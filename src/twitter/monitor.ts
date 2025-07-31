import { TwitterApi, TweetV2, UserV2 } from "twitter-api-v2";
import {
  TwitterMonitorInterface,
  TwitterTweet,
  TwitterUser,
} from "../types/index.js";
import { appConfig } from "../config/index.js";
import { log } from "../utils/logger.js";

/**
 * Twitter 监控类
 * 使用 Twitter API v2 监控指定用户的推文
 */
export class TwitterMonitor implements TwitterMonitorInterface {
  private readonly client: TwitterApi;
  private readonly usernames: string[];
  private userIds: Map<string, string> = new Map();

  constructor() {
    this.usernames = appConfig.twitter.usernames;
    this.client = new TwitterApi(appConfig.twitter.bearerToken);

    log.info(
      `初始化 Twitter 监控器，目标用户: ${this.usernames
        .map((u) => `@${u}`)
        .join(", ")}`
    );
  }

  /**
   * 初始化用户信息
   */
  async initialize(): Promise<void> {
    try {
      for (const username of this.usernames) {
        const user = await this.client.v2.userByUsername(username, {
          "user.fields": [
            "id",
            "name",
            "username",
            "description",
            "public_metrics",
          ],
        });

        if (!user.data) {
          log.warn(`无法找到用户 @${username}，跳过该用户`);
          continue;
        }

        this.userIds.set(username, user.data.id);
        log.info(`成功连接用户: @${username} (ID: ${user.data.id})`);

        // 避免API限制，间隔请求
        await this.sleep(1000);
      }

      if (this.userIds.size === 0) {
        throw new Error("没有找到任何有效的用户");
      }

      log.info(`Twitter API 初始化完成，共监控 ${this.userIds.size} 个用户`);
    } catch (error) {
      log.error("初始化 Twitter 客户端失败", error as Error);
      throw error;
    }
  }

  /**
   * 获取指定用户的最新推文
   */
  async getLatestTweets(
    username: string,
    count: number = 10,
    sinceId?: string
  ): Promise<TwitterTweet[]> {
    const userId = this.userIds.get(username);
    if (!userId) {
      log.error(`用户 @${username} 未初始化`);
      return [];
    }

    try {
      const options: any = {
        "tweet.fields": [
          "id",
          "text",
          "created_at",
          "author_id",
          "public_metrics",
        ],
        max_results: Math.min(count, 100), // API 限制最大100条
      };

      if (sinceId) {
        options.since_id = sinceId;
      }

      const tweets = await this.client.v2.userTimeline(userId, options);

      if (
        !tweets.data ||
        !Array.isArray(tweets.data) ||
        tweets.data.length === 0
      ) {
        return [];
      }

      // 转换为我们的格式
      const tweetList: TwitterTweet[] = tweets.data.map((tweet: TweetV2) => ({
        id: tweet.id,
        text: tweet.text,
        createdAt: tweet.created_at || new Date().toISOString(),
        authorId: tweet.author_id || userId,
        publicMetrics: tweet.public_metrics
          ? {
              retweetCount: tweet.public_metrics.retweet_count || 0,
              likeCount: tweet.public_metrics.like_count || 0,
              replyCount: tweet.public_metrics.reply_count || 0,
              quoteCount: tweet.public_metrics.quote_count || 0,
            }
          : undefined,
        url: `https://twitter.com/${username}/status/${tweet.id}`,
      }));

      log.info(`获取到 @${username} 的 ${tweetList.length} 条推文`);
      return tweetList;
    } catch (error) {
      log.error(`获取 @${username} 推文失败`, error as Error);
      return [];
    }
  }

  /**
   * 获取指定用户信息
   */
  async getUserInfo(username: string): Promise<TwitterUser | null> {
    try {
      const user = await this.client.v2.userByUsername(username, {
        "user.fields": [
          "id",
          "name",
          "username",
          "description",
          "public_metrics",
        ],
      });

      if (!user.data) {
        return null;
      }

      const userData: UserV2 = user.data;
      return {
        id: userData.id,
        name: userData.name,
        username: userData.username,
        description: userData.description,
        publicMetrics: userData.public_metrics
          ? {
              followersCount: userData.public_metrics.followers_count || 0,
              followingCount: userData.public_metrics.following_count || 0,
              tweetCount: userData.public_metrics.tweet_count || 0,
            }
          : undefined,
      };
    } catch (error) {
      log.error(`获取 @${username} 用户信息失败`, error as Error);
      return null;
    }
  }

  /**
   * 获取所有监控的用户名
   */
  getUsernames(): string[] {
    return [...this.usernames];
  }

  /**
   * 获取指定用户的ID
   */
  getUserId(username: string): string | null {
    return this.userIds.get(username) || null;
  }

  /**
   * 休眠函数
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

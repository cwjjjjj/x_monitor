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
  private readonly username: string;
  private userId: string | null = null;

  constructor() {
    this.username = appConfig.twitter.username;
    this.client = new TwitterApi(appConfig.twitter.bearerToken);

    log.info(`初始化 Twitter 监控器，目标用户: @${this.username}`);
  }

  /**
   * 初始化用户信息
   */
  async initialize(): Promise<void> {
    try {
      const user = await this.client.v2.userByUsername(this.username, {
        "user.fields": [
          "id",
          "name",
          "username",
          "description",
          "public_metrics",
        ],
      });

      if (!user.data) {
        throw new Error(`无法找到用户 @${this.username}`);
      }

      this.userId = user.data.id;
      log.info(
        `成功连接到 Twitter API，监控用户: @${this.username} (ID: ${this.userId})`
      );
    } catch (error) {
      log.error("初始化 Twitter 客户端失败", error as Error);
      throw error;
    }
  }

  /**
   * 获取用户的最新推文
   */
  async getLatestTweets(
    count: number = 10,
    sinceId?: string
  ): Promise<TwitterTweet[]> {
    if (!this.userId) {
      await this.initialize();
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

      const tweets = await this.client.v2.userTimeline(this.userId!, options);

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
        authorId: tweet.author_id || this.userId!,
        publicMetrics: tweet.public_metrics
          ? {
              retweetCount: tweet.public_metrics.retweet_count || 0,
              likeCount: tweet.public_metrics.like_count || 0,
              replyCount: tweet.public_metrics.reply_count || 0,
              quoteCount: tweet.public_metrics.quote_count || 0,
            }
          : undefined,
        url: `https://twitter.com/${this.username}/status/${tweet.id}`,
      }));

      log.info(`获取到 ${tweetList.length} 条推文`);
      return tweetList;
    } catch (error) {
      log.error("获取推文失败", error as Error);
      return [];
    }
  }

  /**
   * 获取用户信息
   */
  async getUserInfo(): Promise<TwitterUser | null> {
    try {
      const user = await this.client.v2.userByUsername(this.username, {
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
      log.error("获取用户信息失败", error as Error);
      return null;
    }
  }

  /**
   * 获取监控的用户名
   */
  getUsername(): string {
    return this.username;
  }

  /**
   * 获取用户ID
   */
  getUserId(): string | null {
    return this.userId;
  }
}

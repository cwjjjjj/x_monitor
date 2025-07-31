import {
  TwitterMonitorInterface,
  TwitterTweet,
  TwitterUser,
} from "../types/index.js";
import { appConfig } from "../config/index.js";
import { log } from "../utils/logger.js";

/**
 * 测试版 Twitter 监控类
 * 用于在没有真实 API Token 时模拟推文数据
 */
export class TestTwitterMonitor implements TwitterMonitorInterface {
  private readonly username: string;
  private mockTweetCount: number = 0;

  constructor() {
    this.username = appConfig.twitter.username;
    log.info(`🧪 初始化测试版 Twitter 监控器，模拟用户: @${this.username}`);
  }

  /**
   * 初始化（测试版无需真实初始化）
   */
  async initialize(): Promise<void> {
    log.info(
      `🎭 测试模式：模拟连接到 Twitter API，监控用户: @${this.username}`
    );
    // 模拟一点延迟
    await this.sleep(1000);
  }

  /**
   * 模拟获取最新推文
   */
  async getLatestTweets(
    count: number = 10,
    sinceId?: string
  ): Promise<TwitterTweet[]> {
    log.info(`🧪 测试模式：模拟获取 ${count} 条推文`);

    // 模拟一点延迟
    await this.sleep(500);

    // 随机决定是否有新推文（30%概率）
    if (Math.random() > 0.3) {
      log.info("🎭 测试模式：没有新推文");
      return [];
    }

    // 生成1-2条模拟推文
    const tweetCount = Math.floor(Math.random() * 2) + 1;
    const tweets: TwitterTweet[] = [];

    for (let i = 0; i < tweetCount; i++) {
      this.mockTweetCount++;
      tweets.push(this.generateMockTweet());
    }

    log.info(`🎭 测试模式：生成了 ${tweets.length} 条模拟推文`);
    return tweets;
  }

  /**
   * 模拟获取用户信息
   */
  async getUserInfo(): Promise<TwitterUser | null> {
    log.info("🧪 测试模式：获取模拟用户信息");

    return {
      id: "mock_user_id_123456789",
      name: "币安中国 (模拟)",
      username: this.username,
      description: "这是一个测试模式的模拟账号，用于演示监控功能",
      publicMetrics: {
        followersCount: 1500000,
        followingCount: 100,
        tweetCount: 25000,
      },
    };
  }

  /**
   * 生成模拟推文
   */
  private generateMockTweet(): TwitterTweet {
    const mockTexts = [
      "📈 BTC价格突破新高！加密货币市场表现强劲 #Bitcoin #Crypto",
      "🚀 币安推出新功能：零手续费交易活动正式启动！",
      "⚠️ 重要公告：系统维护将于今晚进行，预计耗时2小时",
      "🎉 恭喜！币安用户突破2亿大关，感谢大家的支持！",
      "💡 投资有风险，入市需谨慎。请做好风险管理 #投资理财",
      "🔔 新币上线公告：XYZ代币将于明日上线币安交易平台",
      "📊 本周市场回顾：主流币种普遍上涨，市场情绪乐观",
      "🛡️ 安全提醒：请妥善保管您的账户信息，谨防钓鱼网站",
    ];

    const randomText = mockTexts[Math.floor(Math.random() * mockTexts.length)];
    const tweetId = `mock_tweet_${Date.now()}_${this.mockTweetCount}`;
    const now = new Date();

    return {
      id: tweetId,
      text: randomText,
      createdAt: now.toISOString(),
      authorId: "mock_user_id_123456789",
      publicMetrics: {
        retweetCount: Math.floor(Math.random() * 1000),
        likeCount: Math.floor(Math.random() * 5000),
        replyCount: Math.floor(Math.random() * 200),
        quoteCount: Math.floor(Math.random() * 100),
      },
      url: `https://twitter.com/${this.username}/status/${tweetId}`,
    };
  }

  /**
   * 获取监控的用户名
   */
  getUsername(): string {
    return this.username;
  }

  /**
   * 获取用户ID（测试版）
   */
  getUserId(): string | null {
    return "mock_user_id_123456789";
  }

  /**
   * 休眠函数
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

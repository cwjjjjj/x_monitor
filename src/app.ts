import { TwitterMonitor } from "./twitter/monitor.js";
import { TestTwitterMonitor } from "./twitter/test-monitor.js";
import { TelegramNotifier } from "./telegram/notifier.js";
import { FileStorage } from "./storage/index.js";
import {
  TwitterTweet,
  AppStatus,
  TwitterMonitorInterface,
} from "./types/index.js";
import { appConfig } from "./config/index.js";
import { log } from "./utils/logger.js";

/**
 * Twitter 监控应用主类
 */
export class TwitterMonitorApp {
  private readonly twitterMonitor: TwitterMonitorInterface;
  private readonly telegramNotifier: TelegramNotifier;
  private readonly storage: FileStorage;
  private status: AppStatus;
  private stopSignal: boolean = false;

  constructor() {
    // 根据配置选择使用真实监控器还是测试监控器
    if (appConfig.testMode) {
      log.info("🧪 使用测试模式");
      this.twitterMonitor = new TestTwitterMonitor();
    } else {
      log.info("🐦 使用生产模式");
      this.twitterMonitor = new TwitterMonitor();
    }

    this.telegramNotifier = new TelegramNotifier();
    this.storage = new FileStorage();

    this.status = {
      isRunning: false,
      errorCount: 0,
      lastCheckTime: null,
      totalTweetsProcessed: 0,
    };

    log.info("Twitter 监控应用初始化完成");
  }

  /**
   * 发送测试通知
   */
  async sendTestNotification(): Promise<boolean> {
    log.info("发送测试通知...");
    const success = await this.telegramNotifier.sendTestMessage();

    if (success) {
      log.info("✅ 测试通知发送成功");
    } else {
      log.error("❌ 测试通知发送失败");
    }

    return success;
  }

  /**
   * 检查新推文
   */
  async checkNewTweets(): Promise<TwitterTweet[]> {
    try {
      // 获取上次检查的推文ID
      const lastTweetId = await this.storage.getLastTweetId();

      // 获取最新推文
      let tweets: TwitterTweet[];
      if (lastTweetId) {
        tweets = await this.twitterMonitor.getLatestTweets(10, lastTweetId);
      } else {
        // 首次运行，只获取最新一条推文
        tweets = await this.twitterMonitor.getLatestTweets(1);
      }

      if (tweets.length > 0) {
        // 按时间排序，确保按发布顺序处理
        tweets.sort((a, b) => a.id.localeCompare(b.id));
        log.info(`发现 ${tweets.length} 条新推文`);

        // 保存最新的推文ID
        const latestTweetId = tweets[tweets.length - 1]!.id;
        await this.storage.saveLastTweetId(latestTweetId);
      }

      return tweets;
    } catch (error) {
      log.error("检查新推文时发生错误", error as Error);
      return [];
    }
  }

  /**
   * 处理新推文
   */
  async processNewTweets(tweets: TwitterTweet[]): Promise<void> {
    for (const tweet of tweets) {
      try {
        log.info(`处理推文: ${tweet.id}`);

        // 发送 Telegram 通知
        const success = await this.telegramNotifier.sendTweetNotification(
          tweet
        );

        if (success) {
          log.info(`✅ 推文 ${tweet.id} 通知发送成功`);
          this.status.totalTweetsProcessed++;
        } else {
          log.error(`❌ 推文 ${tweet.id} 通知发送失败`);
        }

        // 避免发送过快
        await this.sleep(1000);
      } catch (error) {
        log.error(`处理推文 ${tweet.id} 时发生错误`, error as Error);
      }
    }
  }

  /**
   * 执行一次检查
   */
  async runOnce(): Promise<void> {
    log.info("开始检查新推文...");
    this.status.lastCheckTime = new Date();

    // 检查新推文
    const newTweets = await this.checkNewTweets();

    if (newTweets.length > 0) {
      // 处理新推文
      await this.processNewTweets(newTweets);
    } else {
      log.info("没有发现新推文");
    }
  }

  /**
   * 运行监控程序
   */
  async run(): Promise<void> {
    log.info("启动 Twitter 监控程序");
    log.info(`监控账号: @${this.twitterMonitor.getUsername()}`);
    log.info(`监控间隔: ${appConfig.monitor.interval} 秒`);

    // 初始化 Twitter 监控器
    try {
      await this.twitterMonitor.initialize();
    } catch (error) {
      log.error("初始化 Twitter 监控器失败", error as Error);
      throw error;
    }

    // 发送启动通知
    await this.sendTestNotification();

    this.status.isRunning = true;
    this.status.errorCount = 0;

    while (this.status.isRunning && !this.stopSignal) {
      try {
        await this.runOnce();
        this.status.errorCount = 0; // 重置错误计数

        // 等待下次检查
        log.info(`等待 ${appConfig.monitor.interval} 秒后进行下次检查...`);
        await this.sleep(appConfig.monitor.interval * 1000);
      } catch (error) {
        this.status.errorCount++;
        log.error(
          `监控过程中发生错误 (错误次数: ${this.status.errorCount})`,
          error as Error
        );

        // 如果连续错误太多，增加等待时间
        if (this.status.errorCount >= 5) {
          const waitTime = Math.min(300, appConfig.monitor.interval * 3); // 最多等待5分钟
          log.warn(`连续错误过多，等待 ${waitTime} 秒后重试...`);
          await this.sleep(waitTime * 1000);
        } else {
          await this.sleep(30000); // 等待30秒后重试
        }
      }
    }

    this.status.isRunning = false;
    log.info("Twitter 监控程序已停止");
  }

  /**
   * 停止监控
   */
  stop(): void {
    log.info("收到停止信号...");
    this.stopSignal = true;
    this.status.isRunning = false;
  }

  /**
   * 获取应用状态
   */
  getStatus(): AppStatus {
    return { ...this.status };
  }

  /**
   * 休眠函数
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 清理资源
   */
  async cleanup(): Promise<void> {
    log.info("清理应用资源...");
    // 这里可以添加清理逻辑，比如关闭数据库连接等
  }
}

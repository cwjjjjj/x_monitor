/**
 * 推特相关类型定义
 */
export interface TwitterTweet {
  id: string;
  text: string;
  createdAt: string;
  authorId: string;
  publicMetrics?:
    | {
        retweetCount: number;
        likeCount: number;
        replyCount: number;
        quoteCount: number;
      }
    | undefined;
  url: string;
}

export interface TwitterUser {
  id: string;
  name: string;
  username: string;
  description?: string | undefined;
  publicMetrics?:
    | {
        followersCount: number;
        followingCount: number;
        tweetCount: number;
      }
    | undefined;
}

/**
 * 配置相关类型定义
 */
export interface Config {
  twitter: {
    bearerToken: string;
    username: string;
  };
  telegram: {
    botToken: string;
    chatId: string;
  };
  monitor: {
    interval: number;
  };
  logging: {
    level: string;
  };
  testMode?: boolean;
}

/**
 * 存储相关类型定义
 */
export interface StorageInterface {
  saveLastTweetId(tweetId: string): Promise<boolean>;
  getLastTweetId(): Promise<string>;
}

/**
 * 监控器相关类型定义
 */
export interface TwitterMonitorInterface {
  getLatestTweets(count?: number, sinceId?: string): Promise<TwitterTweet[]>;
  getUserInfo(): Promise<TwitterUser | null>;
}

/**
 * 通知器相关类型定义
 */
export interface TelegramNotifierInterface {
  sendTweetNotification(tweet: TwitterTweet): Promise<boolean>;
  sendTestMessage(): Promise<boolean>;
}

/**
 * 日志级别类型
 */
export type LogLevel = "error" | "warn" | "info" | "debug";

/**
 * 应用状态类型
 */
export interface AppStatus {
  isRunning: boolean;
  errorCount: number;
  lastCheckTime: Date | null;
  totalTweetsProcessed: number;
}

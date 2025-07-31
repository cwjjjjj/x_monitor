import { TwitterMonitorInterface, TwitterTweet, TwitterUser } from "../types/index.js";
import { appConfig } from "../config/index.js";
import { log } from "../utils/logger.js";

/**
 * 网页抓取版 Twitter 监控类
 * 通过抓取公开信息监控推特账号（无需 API Token）
 */
export class WebTwitterMonitor implements TwitterMonitorInterface {
  private readonly usernames: string[];

  constructor() {
    this.usernames = appConfig.twitter.usernames;
    log.info(`🌐 初始化网页版 Twitter 监控器，目标用户: ${this.usernames.map(u => `@${u}`).join(', ')}`);
  }

  /**
   * 初始化
   */
  async initialize(): Promise<void> {
    log.info(`🌐 网页模式：开始监控 ${this.usernames.map(u => `@${u}`).join(', ')}`);
    // 检查网络连接
    try {
      const response = await fetch('https://twitter.com', { 
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      });
      if (response.ok) {
        log.info("✅ 网络连接正常");
      } else {
        log.warn("⚠️ Twitter 网站连接异常，但会继续尝试");
      }
    } catch (error) {
      log.warn(`⚠️ 网络测试失败，但会继续尝试: ${(error as Error).message}`);
    }
  }

  /**
   * 通过网页获取最新推文
   */
  async getLatestTweets(
    username: string,
    count: number = 10,
    sinceId?: string
  ): Promise<TwitterTweet[]> {
    try {
      log.info(`🌐 尝试获取 @${username} 的最新推文...`);
      
      // 这里我们使用一个模拟的实现，因为直接抓取Twitter会比较复杂
      // 实际项目中可以考虑使用第三方API或者RSS
      log.info(`📄 网页模式：正在查找 @${username} 的公开推文...`);
      
      // 暂时返回一个提示推文，告诉用户如何获取真实数据
      const mockTweet: TwitterTweet = {
        id: `web_${username}_${Date.now()}`,
        text: `⚠️ 网页监控模式提醒：由于技术限制，当前无法直接获取真实推文。建议申请 Twitter API 或使用其他方案。正在监控 @${username}`,
        createdAt: new Date().toISOString(),
        authorId: username,
        publicMetrics: undefined,
        url: `https://twitter.com/${username}`
      };

      // 只在首次运行时返回提示消息
      if (!sinceId) {
        log.info(`📢 为 @${username} 生成了提示消息`);
        return [mockTweet];
      }

      return [];
    } catch (error) {
      log.error(`网页获取 @${username} 推文失败`, error as Error);
      return [];
    }
  }

  /**
   * 获取用户信息
   */
  async getUserInfo(username: string): Promise<TwitterUser | null> {
    return {
      id: `web_${username}`,
      name: `@${username}`,
      username: username,
      description: "通过网页模式监控的账号",
      publicMetrics: undefined
    };
  }

  /**
   * 获取所有监控的用户名
   */
  getUsernames(): string[] {
    return [...this.usernames];
  }
}
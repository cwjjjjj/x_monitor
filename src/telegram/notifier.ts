import TelegramBot from "node-telegram-bot-api";
import { TelegramNotifierInterface, TwitterTweet } from "../types/index.js";
import { appConfig } from "../config/index.js";
import { log } from "../utils/logger.js";

/**
 * Telegram 通知类
 * 发送推文通知到 Telegram
 */
export class TelegramNotifier implements TelegramNotifierInterface {
  private readonly bot: TelegramBot;
  private readonly chatId: string;

  constructor() {
    this.chatId = appConfig.telegram.chatId;
    this.bot = new TelegramBot(appConfig.telegram.botToken, { polling: false });

    log.info("初始化 Telegram 通知器");
  }

  /**
   * 发送推文通知
   */
  async sendTweetNotification(tweet: TwitterTweet): Promise<boolean> {
    try {
      const message = this.formatTweetMessage(tweet);

      await this.bot.sendMessage(this.chatId, message, {
        parse_mode: "HTML",
        disable_web_page_preview: false,
      });

      log.info(`成功发送推文通知: ${tweet.id}`);
      return true;
    } catch (error) {
      log.error(`发送推文通知失败: ${tweet.id}`, error as Error);
      return false;
    }
  }

  /**
   * 发送测试消息
   */
  async sendTestMessage(): Promise<boolean> {
    try {
      const testMessage =
        "🤖 Twitter 监控机器人测试消息\n\n✅ 连接正常，开始监控 @binancezh 账号";

      await this.bot.sendMessage(this.chatId, testMessage, {
        parse_mode: "HTML",
      });

      log.info("测试消息发送成功");
      return true;
    } catch (error) {
      log.error("发送测试消息失败", error as Error);
      return false;
    }
  }

  /**
   * 格式化推文消息
   */
  private formatTweetMessage(tweet: TwitterTweet): string {
    // 限制推文文本长度
    let text = tweet.text;
    if (text.length > 500) {
      text = text.substring(0, 500) + "...";
    }

    // 格式化时间
    let formattedTime = tweet.createdAt;
    try {
      const date = new Date(tweet.createdAt);
      formattedTime =
        date.toLocaleString("zh-CN", {
          timeZone: "UTC",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " UTC";
    } catch (error) {
      log.warn("时间格式化失败，使用原始时间");
    }

    // 获取互动数据
    const metrics = tweet.publicMetrics;
    const retweetCount = metrics?.retweetCount || 0;
    const likeCount = metrics?.likeCount || 0;
    const replyCount = metrics?.replyCount || 0;

    // 构建消息
    const message = `🐦 <b>@binancezh 发布了新推文</b>

📝 <b>内容:</b>
${this.escapeHtml(text)}

📊 <b>数据:</b>
❤️ ${likeCount} | 🔄 ${retweetCount} | 💬 ${replyCount}

🕒 <b>时间:</b> ${formattedTime}

🔗 <a href="${tweet.url}">查看原推文</a>`;

    return message;
  }

  /**
   * 转义HTML特殊字符
   */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /**
   * 发送纯文本消息
   */
  async sendMessage(message: string): Promise<boolean> {
    try {
      await this.bot.sendMessage(this.chatId, message);
      log.info("消息发送成功");
      return true;
    } catch (error) {
      log.error("发送消息失败", error as Error);
      return false;
    }
  }

  /**
   * 获取机器人信息
   */
  async getBotInfo(): Promise<any> {
    try {
      return await this.bot.getMe();
    } catch (error) {
      log.error("获取机器人信息失败", error as Error);
      return null;
    }
  }
}

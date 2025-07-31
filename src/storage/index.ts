import { promises as fs } from "fs";
import { resolve } from "path";
import { StorageInterface } from "../types/index.js";
import { log } from "../utils/logger.js";

/**
 * 文件存储实现类
 * 用于保存和读取最后一条推文的ID
 */
export class FileStorage implements StorageInterface {
  private readonly baseDir: string;

  constructor(baseDir: string = "data") {
    this.baseDir = resolve(baseDir);
    // 确保数据目录存在
    this.ensureDataDir();
  }

  /**
   * 确保数据目录存在
   */
  private async ensureDataDir(): Promise<void> {
    try {
      await fs.mkdir(this.baseDir, { recursive: true });
    } catch (error) {
      log.error("创建数据目录失败", error as Error);
    }
  }

  /**
   * 获取用户的推文ID文件路径
   */
  private getUserFilePath(username: string): string {
    return resolve(this.baseDir, `last_tweet_id_${username}.txt`);
  }

  /**
   * 保存指定用户的最后一条推文ID
   */
  async saveLastTweetId(username: string, tweetId: string): Promise<boolean> {
    try {
      await this.ensureDataDir();
      const filePath = this.getUserFilePath(username);
      await fs.writeFile(filePath, tweetId, "utf-8");
      log.info(`保存 @${username} 最后推文ID: ${tweetId}`);
      return true;
    } catch (error) {
      log.error(`保存 @${username} 推文ID失败`, error as Error);
      return false;
    }
  }

  /**
   * 获取指定用户的最后一条推文ID
   */
  async getLastTweetId(username: string): Promise<string> {
    try {
      const filePath = this.getUserFilePath(username);
      const exists = await this.fileExists(filePath);
      if (!exists) {
        log.info(`未找到 @${username} 历史推文ID文件，将获取最新推文`);
        return "";
      }

      const tweetId = await fs.readFile(filePath, "utf-8");
      const cleanId = tweetId.trim();

      if (cleanId) {
        log.info(`读取到 @${username} 最后推文ID: ${cleanId}`);
      }

      return cleanId;
    } catch (error) {
      log.error(`读取 @${username} 推文ID失败`, error as Error);
      return "";
    }
  }

  /**
   * 检查文件是否存在
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 清除指定用户的存储文件
   */
  async clearUser(username: string): Promise<boolean> {
    try {
      const filePath = this.getUserFilePath(username);
      const exists = await this.fileExists(filePath);
      if (exists) {
        await fs.unlink(filePath);
        log.info(`已清除 @${username} 历史推文ID文件`);
      }
      return true;
    } catch (error) {
      log.error(`清除 @${username} 存储文件失败`, error as Error);
      return false;
    }
  }

  /**
   * 清除所有存储文件
   */
  async clearAll(): Promise<boolean> {
    try {
      const files = await fs.readdir(this.baseDir);
      const tweetIdFiles = files.filter(
        (file) => file.startsWith("last_tweet_id_") && file.endsWith(".txt")
      );

      for (const file of tweetIdFiles) {
        await fs.unlink(resolve(this.baseDir, file));
      }

      log.info(`已清除所有历史推文ID文件 (${tweetIdFiles.length} 个文件)`);
      return true;
    } catch (error) {
      log.error("清除所有存储文件失败", error as Error);
      return false;
    }
  }
}

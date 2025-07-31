import { promises as fs } from "fs";
import { resolve } from "path";
import { StorageInterface } from "../types/index.js";
import { log } from "../utils/logger.js";

/**
 * 文件存储实现类
 * 用于保存和读取最后一条推文的ID
 */
export class FileStorage implements StorageInterface {
  private readonly filePath: string;

  constructor(filePath: string = "last_tweet_id.txt") {
    this.filePath = resolve(filePath);
  }

  /**
   * 保存最后一条推文的ID
   */
  async saveLastTweetId(tweetId: string): Promise<boolean> {
    try {
      await fs.writeFile(this.filePath, tweetId, "utf-8");
      log.info(`保存最后推文ID: ${tweetId}`);
      return true;
    } catch (error) {
      log.error("保存推文ID失败", error as Error);
      return false;
    }
  }

  /**
   * 获取最后一条推文的ID
   */
  async getLastTweetId(): Promise<string> {
    try {
      const exists = await this.fileExists();
      if (!exists) {
        log.info("未找到历史推文ID文件，将获取最新推文");
        return "";
      }

      const tweetId = await fs.readFile(this.filePath, "utf-8");
      const cleanId = tweetId.trim();

      if (cleanId) {
        log.info(`读取到最后推文ID: ${cleanId}`);
      }

      return cleanId;
    } catch (error) {
      log.error("读取推文ID失败", error as Error);
      return "";
    }
  }

  /**
   * 检查文件是否存在
   */
  private async fileExists(): Promise<boolean> {
    try {
      await fs.access(this.filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 删除存储文件
   */
  async clear(): Promise<boolean> {
    try {
      const exists = await this.fileExists();
      if (exists) {
        await fs.unlink(this.filePath);
        log.info("已清除历史推文ID文件");
      }
      return true;
    } catch (error) {
      log.error("清除存储文件失败", error as Error);
      return false;
    }
  }
}

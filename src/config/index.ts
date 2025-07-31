import { config } from "dotenv";
import { Config } from "../types/index.js";

// 加载环境变量
config();

/**
 * 验证必需的环境变量
 */
function validateRequiredEnvVars(): void {
  const required = ["TELEGRAM_BOT_TOKEN", "TELEGRAM_CHAT_ID"];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  // 如果是测试模式，不需要Twitter token
  if (process.env.TEST_MODE === "true") {
    return;
  }

  // 生产模式需要Twitter token
  if (!process.env.TWITTER_BEARER_TOKEN) {
    console.log("⚠️  没有检测到 TWITTER_BEARER_TOKEN");
    console.log("💡 你可以设置 TEST_MODE=true 来使用测试模式");
    throw new Error(
      "Missing TWITTER_BEARER_TOKEN (set TEST_MODE=true for testing)"
    );
  }
}

/**
 * 获取应用配置
 */
export function getConfig(): Config {
  validateRequiredEnvVars();

  return {
    twitter: {
      bearerToken: process.env.TWITTER_BEARER_TOKEN || "test_token",
      username: process.env.TWITTER_USERNAME || "binancezh",
    },
    telegram: {
      botToken: process.env.TELEGRAM_BOT_TOKEN!,
      chatId: process.env.TELEGRAM_CHAT_ID!,
    },
    monitor: {
      interval: parseInt(process.env.MONITOR_INTERVAL || "60", 10),
    },
    logging: {
      level: process.env.LOG_LEVEL || "info",
    },
    testMode: process.env.TEST_MODE === "true",
  };
}

/**
 * 导出配置实例
 */
export const appConfig = getConfig();

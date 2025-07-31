#!/usr/bin/env node

/**
 * Twitter 监控主程序
 * 监控 @binancezh 账号的新推文，并发送到 Telegram
 */

import { TwitterMonitorApp } from "./app.js";
import { log } from "./utils/logger.js";

/**
 * 处理程序退出信号
 */
function setupSignalHandlers(app: TwitterMonitorApp): void {
  const handleExit = async (signal: string) => {
    log.info(`收到 ${signal} 信号，正在关闭程序...`);

    try {
      app.stop();
      await app.cleanup();
      log.info("程序已正常关闭");
      process.exit(0);
    } catch (error) {
      log.error("程序关闭时发生错误", error as Error);
      process.exit(1);
    }
  };

  // 监听各种退出信号
  process.on("SIGINT", () => handleExit("SIGINT"));
  process.on("SIGTERM", () => handleExit("SIGTERM"));
  process.on("SIGQUIT", () => handleExit("SIGQUIT"));

  // 监听未捕获的异常
  process.on("uncaughtException", (error) => {
    log.error("未捕获的异常", error);
    process.exit(1);
  });

  process.on("unhandledRejection", (reason, promise) => {
    log.error("未处理的 Promise 拒绝", new Error(String(reason)));
    console.error("Promise:", promise);
    process.exit(1);
  });
}

/**
 * 主函数
 */
async function main(): Promise<number> {
  try {
    log.info("=".repeat(50));
    log.info("Twitter 监控程序启动");
    log.info("=".repeat(50));

    // 创建应用实例
    const app = new TwitterMonitorApp();

    // 设置信号处理
    setupSignalHandlers(app);

    // 运行应用
    await app.run();

    return 0;
  } catch (error) {
    log.error("程序启动失败", error as Error);
    return 1;
  }
}

/**
 * 程序入口
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
    .then((exitCode) => {
      if (exitCode !== 0) {
        process.exit(exitCode);
      }
    })
    .catch((error) => {
      log.error("程序运行失败", error);
      process.exit(1);
    });
}

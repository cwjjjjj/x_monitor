import winston from "winston";
import { appConfig } from "../config/index.js";
import { LogLevel } from "../types/index.js";

/**
 * 创建 Winston 日志实例
 */
const createLogger = () => {
  const logFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
    })
  );

  return winston.createLogger({
    level: appConfig.logging.level as LogLevel,
    format: logFormat,
    transports: [
      // 控制台输出
      new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(), logFormat),
      }),
      // 文件输出
      new winston.transports.File({
        filename: "twitter-monitor.log",
        format: logFormat,
      }),
      // 错误日志单独文件
      new winston.transports.File({
        filename: "error.log",
        level: "error",
        format: logFormat,
      }),
    ],
  });
};

/**
 * 导出日志实例
 */
export const logger = createLogger();

/**
 * 日志辅助函数
 */
export const log = {
  error: (message: string, error?: Error) => {
    logger.error(message, { error });
  },
  warn: (message: string) => {
    logger.warn(message);
  },
  info: (message: string) => {
    logger.info(message);
  },
  debug: (message: string) => {
    logger.debug(message);
  },
};

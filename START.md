# Twitter 监控工具 - 快速开始指南

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env` 文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的配置：

```env
# Twitter API 配置
TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here

# Telegram Bot 配置
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here

# 监控配置
TWITTER_USERNAME=binancezh
MONITOR_INTERVAL=60

# 日志配置
LOG_LEVEL=info
```

### 3. 获取必要的 Token

#### Twitter Bearer Token

1. 访问 [Twitter Developer Portal](https://developer.twitter.com/)
2. 创建应用
3. 生成 Bearer Token
4. 复制并填入 `.env` 文件

#### Telegram Bot Token

1. 在 Telegram 中搜索 `@BotFather`
2. 发送 `/newbot` 创建新机器人
3. 按提示设置名称
4. 获取 Bot Token

#### Telegram Chat ID

1. 将创建的机器人添加到你想接收通知的聊天中
2. 发送一条消息给机器人
3. 访问 `https://api.telegram.org/bot<YourBOTToken>/getUpdates`
4. 找到 chat.id 字段

### 4. 运行程序

#### 开发模式（自动重启）

```bash
npm run dev
```

#### 生产模式

```bash
npm run build
npm start
```

### 5. 验证运行

程序启动后会：

1. 发送测试消息到 Telegram
2. 开始监控 @binancezh 的推特
3. 有新推特时自动发送通知

## 📋 命令列表

- `npm run dev` - 开发模式运行
- `npm run build` - 构建项目
- `npm start` - 生产模式运行
- `npm run clean` - 清理构建文件

## 🔧 故障排除

### 常见错误

1. **Twitter API 错误**

   - 检查 Bearer Token 是否正确
   - 确认网络连接正常

2. **Telegram 发送失败**

   - 验证 Bot Token 和 Chat ID
   - 确保机器人已被添加到聊天中

3. **环境变量错误**
   - 检查 `.env` 文件是否存在
   - 确认所有必需变量已设置

### 查看日志

程序会生成以下日志文件：

- `twitter-monitor.log` - 完整日志
- `error.log` - 错误日志

## 🎯 项目特性

- ✅ TypeScript 严格模式
- ✅ 模块化架构
- ✅ 完整错误处理
- ✅ 自动重试机制
- ✅ 智能去重
- ✅ 详细日志记录
- ✅ 优雅关闭处理

## 📦 项目结构

```
src/
├── types/           # TypeScript 类型定义
├── config/          # 配置管理
├── utils/           # 日志等工具函数
├── storage/         # 数据存储
├── twitter/         # Twitter API 集成
├── telegram/        # Telegram Bot 集成
├── app.ts           # 主应用类
└── main.ts          # 程序入口
```

## 🔄 从 Python 版本迁移

如果你之前使用过 Python 版本：

1. 保留 `last_tweet_id.txt` 文件（如果存在）
2. 将 Python 版本的环境变量复制到 `.env` 文件
3. 停止 Python 版本后启动 Node.js 版本

## 📞 获取帮助

如遇问题，请：

1. 检查日志文件
2. 验证环境变量配置
3. 确认网络连接
4. 查看 GitHub Issues

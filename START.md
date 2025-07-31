# Twitter 监控工具 - 快速开始指南

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env` 文件：

```bash
# 如果有 .env.example 文件
cp .env.example .env

# 或者直接创建
touch .env
```

编辑 `.env` 文件，填入你的配置：

```env
# Twitter API 配置 (API模式需要)
TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here

# Telegram Bot 配置 (必需)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here

# 监控配置 - 多账号支持 (用逗号分隔)
TWITTER_USERNAMES=binancezh,elonmusk,bitcoin
# 或单个账号
TWITTER_USERNAME=binancezh
MONITOR_INTERVAL=60

# 日志配置
LOG_LEVEL=info

# 运行模式配置 (可选)
# TEST_MODE=true     # 测试模式，生成模拟推文
# 如果没有 Twitter API Token，系统会自动使用网页模式
```

## 🎯 监控模式

本工具支持三种监控模式：

### 1. 🐦 API 模式 (推荐)

- **条件**: 有有效的 Twitter Bearer Token
- **优势**: 数据准确、实时性好、功能完整
- **配置**: 设置 `TWITTER_BEARER_TOKEN`

### 2. 🌐 网页模式 (无 Token 方案)

- **条件**: 没有 Twitter Bearer Token 时自动启用
- **优势**: 无需申请 API，免费使用
- **限制**: 功能受限，主要用于演示

### 3. 🧪 测试模式 (开发调试)

- **条件**: 设置 `TEST_MODE=true`
- **优势**: 生成模拟推文，用于测试 Telegram 通知
- **用途**: 开发和调试

### 3. 获取必要的 Token

#### Telegram Bot Token (必需)

1. 在 Telegram 中搜索 `@BotFather`
2. 发送 `/newbot` 创建新机器人
3. 按提示设置名称
4. 获取 Bot Token

#### Telegram Chat ID (必需)

**方法一：使用命令行工具**

```bash
# 先给你的机器人发送一条消息，然后运行：
curl -s "https://api.telegram.org/bot<你的BOT_TOKEN>/getUpdates" | python3 -c "
import sys, json
data = json.load(sys.stdin)
if data['result']:
    for update in data['result']:
        if 'message' in update:
            chat_id = update['message']['chat']['id']
            from_user = update['message']['from']['first_name']
            print(f'✅ 发现消息来自: {from_user}')
            print(f'🎯 你的 Chat ID 是: {chat_id}')
            break
else:
    print('❌ 还没有发现任何消息，请确保已经给机器人发送了消息')
"
```

**方法二：手动获取**

1. 将创建的机器人添加到你想接收通知的聊天中
2. 发送一条消息给机器人
3. 访问 `https://api.telegram.org/bot<YourBOTToken>/getUpdates`
4. 找到 chat.id 字段

#### Twitter Bearer Token (API 模式需要)

1. 访问 [Twitter Developer Portal](https://developer.twitter.com/)
2. 创建应用
3. 生成 Bearer Token
4. 复制并填入 `.env` 文件

**💡 提示**: 如果没有 Twitter API Token，程序会自动使用网页模式，仍可监控公开账号。

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

1. 自动检测并选择合适的监控模式
2. 发送测试消息到 Telegram
3. 开始监控配置的推特账号
4. 有新推特时自动发送通知

**运行示例**:

```
🌐 使用网页模式监控真实推特
🌐 初始化网页版 Twitter 监控器，目标用户: @binancezh, @cwjjj222
监控账号: @binancezh, @cwjjj222
监控间隔: 60 秒
✅ 测试通知发送成功
```

## 📋 命令列表

- `npm run dev` - 开发模式运行
- `npm run build` - 构建项目
- `npm start` - 生产模式运行
- `npm run clean` - 清理构建文件

## 🔧 故障排除

### 常见错误

1. **Telegram 发送失败**

   - 验证 Bot Token 和 Chat ID
   - 确保机器人已被添加到聊天中
   - 先给机器人发送 `/start` 命令

2. **Twitter API 错误 (API 模式)**

   - 检查 Bearer Token 是否正确
   - 确认网络连接正常
   - 如果没有 Token，程序会自动切换到网页模式

3. **环境变量错误**

   - 检查 `.env` 文件是否存在
   - 确认必需变量 `TELEGRAM_BOT_TOKEN` 和 `TELEGRAM_CHAT_ID` 已设置
   - 多账号监控请使用 `TWITTER_USERNAMES=账号1,账号2,账号3`

4. **网页模式限制**
   - 网页模式功能有限，主要用于演示
   - 建议申请 Twitter API 以获得完整功能

### 配置示例

**单账号监控**:

```env
TWITTER_USERNAME=binancezh
```

**多账号监控**:

```env
TWITTER_USERNAMES=binancezh,elonmusk,bitcoin,cwjjj222
```

**测试模式**:

```env
TEST_MODE=true
TWITTER_USERNAMES=binancezh,elonmusk
```

### 查看日志

程序会生成以下日志文件：

- `twitter-monitor.log` - 完整日志
- `error.log` - 错误日志

## 🎯 项目特性

- ✅ **多账号监控**: 支持同时监控多个 Twitter 账号
- ✅ **多种监控模式**: API 模式、网页模式、测试模式
- ✅ **无需 Token 运行**: 网页模式可在没有 Twitter API 的情况下工作
- ✅ **TypeScript 严格模式**: 完整的类型安全
- ✅ **模块化架构**: 易于扩展和维护
- ✅ **完整错误处理**: 包含重试机制和容错处理
- ✅ **智能去重**: 避免重复推送相同内容
- ✅ **详细日志记录**: 完整的运行日志和错误追踪
- ✅ **优雅关闭处理**: 支持信号处理和资源清理
- ✅ **配置灵活**: 支持环境变量和多种运行模式

## 📦 项目结构

```
src/
├── types/           # TypeScript 类型定义
├── config/          # 配置管理
├── utils/           # 日志等工具函数
├── storage/         # 数据存储 (支持多账号)
├── twitter/         # Twitter 监控器
│   ├── monitor.ts      # API 模式监控器
│   ├── web-monitor.ts  # 网页模式监控器
│   └── test-monitor.ts # 测试模式监控器
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

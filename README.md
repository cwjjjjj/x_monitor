# Twitter 监控工具

一个使用 Node.js + TypeScript 构建的 Twitter 账号监控工具，支持多账号同时监控并发送 Telegram 通知。

## 🎯 功能特性

- ✅ **多账号监控**: 支持同时监控多个 Twitter 账号
- ✅ **多种监控模式**: API 模式、网页模式、测试模式
- ✅ **无需 Token 运行**: 网页模式可在没有 Twitter API 的情况下工作
- ✅ **实时通知**: 新推文自动发送到 Telegram
- ✅ **智能去重**: 避免重复通知，支持断点续传
- ✅ **完整错误处理**: 包含重试机制和容错处理
- ✅ **详细日志记录**: 完整的运行日志和错误追踪
- ✅ **TypeScript 支持**: 完整的类型安全和代码可靠性
- ✅ **优雅关闭处理**: 支持信号处理和资源清理

## 🛠️ 系统要求

- Node.js 18+
- Telegram Bot Token (必需)
- Twitter API Bearer Token (API 模式需要)

## 🚀 监控模式

### 1. 🐦 API 模式 (推荐)

- **优势**: 数据准确、实时性好、功能完整
- **要求**: 需要 Twitter Bearer Token
- **适用**: 正式生产环境

### 2. 🌐 网页模式 (无 Token 方案)

- **优势**: 无需申请 API，免费使用
- **限制**: 功能受限，主要用于演示
- **适用**: 快速体验和演示

### 3. 🧪 测试模式 (开发调试)

- **优势**: 生成模拟推文，用于测试通知
- **配置**: 设置 `TEST_MODE=true`
- **适用**: 开发和调试环境

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env` 文件：

```bash
# 直接创建
touch .env
```

编辑 `.env` 文件：

```env
# Telegram Bot 配置 (必需)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here

# 多账号监控配置 (用逗号分隔)
TWITTER_USERNAMES=binancezh,elonmusk,bitcoin

# Twitter API 配置 (API模式需要)
TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here

# 运行配置
MONITOR_INTERVAL=60
LOG_LEVEL=info

# 可选模式
# TEST_MODE=true  # 启用测试模式
```

### 3. 获取必要 Token

#### Telegram Bot Token (必需)

1. 在 Telegram 中搜索 `@BotFather`
2. 发送 `/newbot` 命令创建新机器人
3. 按提示设置机器人名称和用户名
4. 获得 Bot Token

#### Telegram Chat ID (必需)

**快速获取方法**:

```bash
# 先给你的机器人发送一条消息，然后运行：
curl -s "https://api.telegram.org/bot<你的BOT_TOKEN>/getUpdates" | python3 -c "
import sys, json
data = json.load(sys.stdin)
if data['result']:
    for update in data['result']:
        if 'message' in update:
            chat_id = update['message']['chat']['id']
            print(f'🎯 你的 Chat ID 是: {chat_id}')
            break
"
```

#### Twitter API Bearer Token (API 模式需要)

1. 访问 [Twitter Developer Portal](https://developer.twitter.com/)
2. 创建开发者账号并申请 API 访问权限
3. 创建一个新的 App
4. 在 App 设置中找到 Bearer Token
5. 复制 Bearer Token

**💡 提示**: 如果没有 Twitter API Token，程序会自动使用网页模式。

### 3. 安装和配置

运行安装脚本：

```bash
cd twitter-monitor
python setup.py
```

脚本会自动：

- 安装所需的 Python 包
- 创建配置文件
- 测试 API 连接

### 4. 手动配置（可选）

如果需要手动配置，创建 `.env` 文件：

```bash
# Twitter API 配置
TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here

# Telegram Bot 配置
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here

# 监控配置
TWITTER_USERNAME=binancezh
MONITOR_INTERVAL=60
```

### 5. 运行程序

```bash
python main.py
```

程序会开始监控并发送测试消息确认连接正常。

## 配置说明

### 环境变量

| 变量名                 | 说明                     | 默认值      |
| ---------------------- | ------------------------ | ----------- |
| `TWITTER_BEARER_TOKEN` | Twitter API Bearer Token | 必填        |
| `TELEGRAM_BOT_TOKEN`   | Telegram Bot Token       | 必填        |
| `TELEGRAM_CHAT_ID`     | Telegram 聊天 ID         | 必填        |
| `TWITTER_USERNAME`     | 要监控的 Twitter 用户名  | `binancezh` |
| `MONITOR_INTERVAL`     | 监控间隔（秒）           | `60`        |

### 自定义监控账号

要监控其他 Twitter 账号，修改 `.env` 文件中的 `TWITTER_USERNAME`：

```bash
TWITTER_USERNAME=elonmusk
```

## 项目结构

```
twitter-monitor/
├── main.py                 # 主程序
├── config.py              # 配置模块
├── twitter_monitor.py     # Twitter 监控模块
├── telegram_notifier.py   # Telegram 通知模块
├── storage.py             # 数据存储模块
├── setup.py               # 安装配置脚本
├── requirements.txt       # 依赖包列表
├── README.md             # 说明文档
├── .env                  # 环境变量配置（需要创建）
├── last_tweet_id.txt     # 存储最后推文ID（自动生成）
└── twitter_monitor.log   # 日志文件（自动生成）
```

## 使用说明

### 启动监控

```bash
python main.py
```

### 停止监控

按 `Ctrl+C` 停止程序。

### 查看日志

日志会同时输出到控制台和 `twitter_monitor.log` 文件。

### 重新开始监控

程序会自动记住上次检查的位置，重启后不会重复发送已经通知过的推文。

如果需要重新开始（重新发送所有推文），删除 `last_tweet_id.txt` 文件。

## 故障排除

### 常见问题

1. **Twitter API 错误**

   - 检查 Bearer Token 是否正确
   - 确认 API 访问权限是否正常
   - 检查用户名是否存在

2. **Telegram 发送失败**

   - 检查 Bot Token 是否正确
   - 确认 Chat ID 是否正确
   - 确保机器人有发送消息的权限

3. **程序崩溃**
   - 查看日志文件了解详细错误信息
   - 检查网络连接
   - 确认所有依赖包已正确安装

### 调试模式

如需更详细的调试信息，修改 `main.py` 中的日志级别：

```python
logging.basicConfig(
    level=logging.DEBUG,  # 改为 DEBUG
    # ... 其他配置
)
```

## 高级配置

### 自定义消息格式

编辑 `telegram_notifier.py` 中的 `_format_tweet_message` 方法来自定义消息格式。

### 添加过滤条件

在 `main.py` 的 `process_new_tweets` 方法中添加过滤逻辑，例如只通知包含特定关键词的推文。

### 部署到服务器

建议使用 systemd、PM2 或 Docker 来管理后台运行：

#### 使用 systemd (Linux)

创建服务文件 `/etc/systemd/system/twitter-monitor.service`：

```ini
[Unit]
Description=Twitter Monitor Service
After=network.target

[Service]
Type=simple
User=your_username
WorkingDirectory=/path/to/twitter-monitor
ExecStart=/usr/bin/python3 /path/to/twitter-monitor/main.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

启动服务：

```bash
sudo systemctl enable twitter-monitor
sudo systemctl start twitter-monitor
```

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 许可证

MIT License

## 免责声明

本工具仅供学习和个人使用。请遵守 Twitter 和 Telegram 的使用条款，合理使用 API，避免过于频繁的请求。

# 更新日志

## [1.1.0] - 2024-01-XX

### 🎯 新特性

- ✨ **多账号监控**: 支持同时监控多个 Twitter 账号，通过 `TWITTER_USERNAMES` 逗号分隔配置
- 🌐 **网页模式**: 新增无需 Twitter API Token 的网页监控模式，免费监控公开账号
- 🧪 **测试模式**: 新增测试模式，生成模拟推文用于开发调试
- 🤖 **智能模式选择**: 自动根据配置选择最合适的监控模式

### 🔧 改进

- 📁 **存储系统**: 升级为支持多账号的分离存储，每个账号独立的推文 ID 文件
- 🎮 **用户体验**: 更友好的运行提示和模式识别
- 📊 **日志系统**: 增强的多账号监控日志，更清晰的运行状态显示
- 🔄 **错误处理**: 改进的网络连接和 API 调用错误处理

### 📦 架构更新

- 新增 `WebTwitterMonitor` 网页模式监控器
- 新增 `TestTwitterMonitor` 测试模式监控器
- 重构 `TwitterMonitorInterface` 支持多账号
- 升级 `FileStorage` 支持按用户名分离存储
- 改进 `TelegramNotifier` 动态提取用户名

### 💡 使用场景

- **API 模式**: 有 Twitter Bearer Token 时的完整功能
- **网页模式**: 无 Token 时的替代方案，适合演示和轻量使用
- **测试模式**: 开发调试时的模拟环境

### 配置示例

**多账号监控**:

```env
TWITTER_USERNAMES=binancezh,elonmusk,bitcoin,cwjjj222
```

**测试模式**:

```env
TEST_MODE=true
TWITTER_USERNAMES=binancezh,elonmusk
```

## [1.0.0] - 2024-01-XX

### 新功能

- 🆕 完整的 Node.js TypeScript 重构版本
- 🐦 支持监控 Twitter API v2
- 📱 美观的 Telegram 消息格式
- 💾 智能存储避免重复通知
- 🔄 自动重试和错误恢复
- 📊 详细的日志记录系统
- ⚡ 使用 ESM 模块系统
- 🎯 TypeScript 严格模式

### 技术栈

- Node.js 18+
- TypeScript 5.0+
- twitter-api-v2 库
- node-telegram-bot-api
- winston 日志系统
- ESM 模块支持

### 从 Python 版本的改进

- ✅ 更好的类型安全
- ✅ 更快的启动速度
- ✅ 更低的内存占用
- ✅ 更好的错误处理
- ✅ 模块化架构
- ✅ 更易于扩展

### 功能对比

| 功能          | Python 版本 | Node.js 版本 |
| ------------- | ----------- | ------------ |
| Twitter 监控  | ✅          | ✅           |
| Telegram 通知 | ✅          | ✅           |
| 数据存储      | ✅          | ✅           |
| 错误处理      | ✅          | ✅           |
| 日志记录      | ✅          | ✅           |
| 类型安全      | ❌          | ✅           |
| 模块化        | 部分        | ✅           |
| 热重载        | ❌          | ✅           |
| 编译检查      | ❌          | ✅           |

### 兼容性

- 完全兼容 Python 版本的配置
- 可直接使用现有的 `last_tweet_id.txt` 文件
- 环境变量格式保持一致

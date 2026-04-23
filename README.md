# LumaDrop

LumaDrop 是一个移动端优先的照片上传、预览、下载与私密分享平台。它介于高级相册、作品集交付页和私密分享空间之间，内置 mock 登录、照片网格/瀑布流、全屏沉浸预览、批量 ZIP 下载、分享权限、主题切换、Prisma schema 和可替换对象存储结构。

## 技术栈

- Next.js 15 App Router
- React 19 + TypeScript
- Tailwind CSS
- shadcn/ui 风格本地组件
- Framer Motion
- Zustand + localStorage 持久化
- Prisma + PostgreSQL
- S3 / Cloudflare R2 兼容存储抽象

## 快速开始

```bash
npm install
cp .env.example .env
npm run dev
```

打开 http://localhost:3000。

本地开发默认 `STORAGE_DRIVER=local`，上传文件会写入 `public/uploads`，前端状态由 Zustand 保存到浏览器 localStorage，所以不接数据库也可以先完整体验 UI 和交互。

## 数据库

准备 PostgreSQL 后，在 `.env` 中配置：

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lumadrop?schema=public"
```

执行迁移与初始化：

```bash
npm run db:migrate
npm run db:seed
```

生成 Prisma Client：

```bash
npm run db:generate
```

## 对象存储

本地默认：

```bash
STORAGE_DRIVER="local"
```

切换 S3 / Cloudflare R2：

```bash
STORAGE_DRIVER="s3"
S3_ENDPOINT="https://<account-id>.r2.cloudflarestorage.com"
S3_REGION="auto"
S3_BUCKET="lumadrop"
S3_ACCESS_KEY_ID="..."
S3_SECRET_ACCESS_KEY="..."
S3_PUBLIC_BASE_URL="https://cdn.example.com"
```

存储入口在 `src/lib/storage.ts`，API 上传入口在 `src/app/api/photos/route.ts`。

## 登录配置

验证码登录默认要求真实服务商配置（不再返回 `devCode`）。

短信验证码使用 Twilio：

```bash
TWILIO_ACCOUNT_SID="..."
TWILIO_AUTH_TOKEN="..."
TWILIO_FROM_PHONE="+1234567890"
```

邮箱验证码使用 Resend：

```bash
RESEND_API_KEY="..."
EMAIL_FROM="LumaDrop <hello@your-domain.com>"
```

## AI（OpenRouter）

上传后生成相册描述会调用 OpenRouter（可用高性价比模型）。

```bash
OPENROUTER_API_KEY="..."
# 可选：默认 google/gemini-2.0-flash-lite
OPENROUTER_MODEL="google/gemini-2.0-flash-lite"
# 可选：用于 OpenRouter 统计与风控
OPENROUTER_HTTP_REFERER="https://your-domain.com"
OPENROUTER_APP_TITLE="LumaDrop"
```

微信扫码登录需要微信开放平台网站应用：

```bash
WECHAT_OPEN_APP_ID="..."
WECHAT_OPEN_APP_SECRET="..."
WECHAT_REDIRECT_URI="https://your-domain.com/auth/wechat/callback"
```

当前代码会生成微信扫码授权 URL，并在 `/auth/wechat/callback` 用 `code` 换取微信 access token 与用户信息。正式上线时建议把微信 unionid/openid 持久化到用户表。

## 项目结构

```text
src/app
  api/photos        上传接口
  api/albums        相册接口预留
  api/share         分享接口预留
  page.tsx          首页 / Landing + 产品仪表盘
  login             邮箱验证码登录
  photos            我的照片
  albums            相册列表
  albums/[id]       相册详情 + 分享设置
  upload            上传页
  preview/[id]      全屏沉浸预览
  share/[token]     公开 / 私密分享页
  settings          设置页
src/components
  album             相册卡片
  layout            AppShell / ThemeProvider
  photo             照片卡片、网格、全屏预览
  share             分享设置面板
  upload            上传器和进度条
  ui                shadcn/ui 风格基础组件
src/lib
  mock-data.ts      初始照片、相册、分享数据
  prisma.ts         Prisma Client
  storage.ts        local / S3 / R2 存储抽象
src/store
  luma-store.ts     Zustand 产品状态
prisma
  schema.prisma     User / Album / Photo / Share / DownloadRecord
  seed.ts           初始化数据
```

## 已实现功能

- 邮箱验证码登录，配置 Resend 后真实发送
- 多图上传与上传进度
- 上传后自动生成相册
- 我的照片列表
- 宫格 / 瀑布流切换
- 按标题/标签搜索
- 按时间、收藏、人物/动物/植物/城市/风景等分类筛选
- 长按进入选择模式
- 多选批量 ZIP 下载
- 删除到回收站
- 回收站恢复、永久删除、清空
- 回收站 7 天后自动清理
- 多选快速生成相册
- 照片收藏
- 全屏照片预览
- 左右切图、双击放大、下滑关闭
- 单张下载
- 相册创建、编辑标题与描述
- 公开 / 私密分享链接
- 访问密码与允许下载配置
- 分享页主题切换
- 深色 / 浅色主题
- EXIF 字段结构预留
- AI 推荐封面与 AI 描述接口预留位置

## 后续扩展建议

- 将 Zustand mock 数据替换为 Prisma 查询与 Server Actions
- 接入真实邮箱登录或托管 Auth
- 上传时读取图片真实尺寸和 EXIF
- 增加服务端 ZIP 打包，支持大批量下载
- 增加 AI 封面评分和描述生成接口

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

## Vercel + Neon + R2 部署

推荐线上组合：

- Vercel: 托管 Next.js 应用和 API
- Neon: 托管 PostgreSQL
- Cloudflare R2: 存储图片原文件

### 1. 新建 Neon 数据库

最省心的方式是直接在 Vercel Dashboard 里安装 Neon Marketplace 集成。完成后，Vercel 会自动把 `DATABASE_URL` 注入到项目环境变量中。

如果你已经在 Neon 控制台自己建库，也可以手动把连接串填到 Vercel 的 `DATABASE_URL`。

### 2. 配置 Vercel 环境变量

至少需要以下变量：

```bash
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_APP_URL="https://your-domain.com"
AUTH_SECRET="replace-with-a-long-random-secret"

STORAGE_DRIVER="s3"
S3_ENDPOINT="https://<account-id>.r2.cloudflarestorage.com"
S3_REGION="auto"
S3_BUCKET="lumadrop"
S3_ACCESS_KEY_ID="..."
S3_SECRET_ACCESS_KEY="..."
S3_PUBLIC_BASE_URL="https://cdn.your-domain.com"
```

如果要启用真实登录，还需要按需配置：

```bash
TWILIO_ACCOUNT_SID="..."
TWILIO_AUTH_TOKEN="..."
TWILIO_FROM_PHONE="+1234567890"

RESEND_API_KEY="..."
EMAIL_FROM="LumaDrop <hello@your-domain.com>"

WECHAT_OPEN_APP_ID="..."
WECHAT_OPEN_APP_SECRET="..."
WECHAT_REDIRECT_URI="https://your-domain.com/auth/wechat/callback"
```

### 3. 让 Vercel 自动执行 Prisma 迁移

项目已经内置：

```bash
npm run vercel-build
```

它会先执行：

```bash
prisma migrate deploy
```

然后再构建 Next.js。

仓库里已经提供了 [vercel.json](/Users/fhj/Desktop/Github/LumaDrop/vercel.json)，默认会让 Vercel：

- 使用官方 npm registry 安装依赖
- 在构建时执行 `npm run vercel-build`

所以大多数情况下你不需要再手动改 Build Command。

### 4. 首次上线顺序

推荐按这个顺序来：

1. 在 Vercel 连接 GitHub 仓库
2. 安装 Neon 集成或手动填入 `DATABASE_URL`
3. 填好 R2 相关环境变量
4. 如果使用短信 / 邮箱 / 微信登录，再补齐对应环境变量
5. 触发一次部署

首次部署成功后，Prisma 会把表结构部署到线上数据库。

### 5. 预览环境建议

如果你在 Vercel + Neon 中开启 Preview Branching，每个 Preview Deployment 都可以拥有独立数据库分支。这样改 Prisma schema 时会更安全，也更适合多人协作。

### 6. 上线后检查项

部署完成后建议检查这些页面和流程：

- 首页是否正常加载
- 上传照片后是否能写入 R2
- `/albums`、`/photos`、`/trash` 是否正常
- 分享链接是否能打开
- 手机号 / 邮箱验证码是否能正常发送
- 微信扫码回调地址是否与开放平台后台配置一致

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

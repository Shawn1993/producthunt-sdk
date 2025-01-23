# Product Hunt SDK

一个简单的 Product Hunt API 集成工具，支持获取每日最热门产品榜单。

## 功能特性

- 获取 Product Hunt 每日最热门产品
- 支持产品标题、描述、投票数等信息
- 使用 GraphQL API
- TypeScript 支持
- Next.js API Routes

## 在线演示

访问 [https://producthunt-sdk.vercel.app/test](https://producthunt-sdk.vercel.app/test) 查看实时榜单。

## API 接口

### 获取每日榜单

```bash
GET /api/product-hunt/daily
```

返回示例：

```json
{
  "posts": [
    {
      "id": "...",
      "name": "产品名称",
      "tagline": "产品简介",
      "description": "详细描述",
      "thumbnail": {
        "url": "图片地址"
      },
      "votesCount": 100,
      "website": "网站地址",
      "slug": "product-slug",
      "topics": {
        "edges": [
          {
            "node": {
              "name": "话题名称"
            }
          }
        ]
      }
    }
  ]
}
```

## 开发配置

### 环境变量

创建 `.env.local` 文件并添加以下配置：

```bash
PRODUCT_HUNT_API_TOKEN=your_api_token
PRODUCT_HUNT_API_SECRET=your_api_secret
PRODUCT_HUNT_REDIRECT_URI=your_redirect_uri
```

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

访问 [http://localhost:3000/test](http://localhost:3000/test) 查看开发页面。

## 部署

本项目已配置好自动部署到 Vercel。你需要：

1. Fork 本仓库
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 完成部署

## 技术栈

- Next.js 14
- TypeScript
- GraphQL
- Tailwind CSS

## 许可证

MIT License

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 联系方式

如有问题或建议，欢迎提交 Issue。

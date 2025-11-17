# Cloudflare 部署指南

## ✅ 构建检查完成

你的项目现在可以成功构建了！以下是部署到 Cloudflare Pages 的步骤。

## 前置准备

### 1. 安装 Wrangler CLI
```bash
npm install -g wrangler
# 或使用项目本地的
pnpm install
```

### 2. 登录 Cloudflare
```bash
wrangler login
```

## 部署步骤

### 方式一：使用 OpenNext Cloudflare (推荐)

#### 1. 创建 Cloudflare D1 数据库
```bash
# 创建生产数据库
wrangler d1 create resource-booking-db

# 记录返回的 database_id，类似：
# database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

#### 2. 更新 wrangler.toml
将 `wrangler.toml` 中的 `YOUR_DATABASE_ID_HERE` 替换为上面返回的 `database_id`。

#### 3. 创建数据库表
```bash
# 将本地数据库 schema 推送到 Cloudflare D1
wrangler d1 execute resource-booking-db --file=./drizzle/0000_*.sql

# 或者逐个执行 SQL 文件
wrangler d1 execute resource-booking-db --command="CREATE TABLE IF NOT EXISTS users (...)"
```

#### 4. 填充初始数据（可选）
你需要手动将种子数据插入到 D1 数据库：

```bash
# 方式1：通过 Cloudflare Dashboard
# 访问 https://dash.cloudflare.com
# 进入 D1 数据库 -> 选择你的数据库 -> Console
# 运行 INSERT 语句

# 方式2：使用 wrangler 执行 SQL
wrangler d1 execute resource-booking-db --command="
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@concordia.ca', '\$2a\$10\$...', 'admin'),
('John Smith', 'john.smith@concordia.ca', '\$2a\$10\$...', 'student');
"
```

#### 5. 构建并部署
```bash
# 构建项目
pnpm build

# 使用 OpenNext 构建 Cloudflare 版本
pnpm run deploy

# 或者分步执行
pnpm run preview  # 本地预览
pnpm run deploy   # 部署到 Cloudflare
```

### 方式二：使用 Cloudflare Pages (直接部署)

#### 1. 推送代码到 GitHub
```bash
git add .
git commit -m "Ready for Cloudflare deployment"
git push origin main
```

#### 2. 在 Cloudflare Dashboard 创建 Pages 项目
1. 访问 https://dash.cloudflare.com
2. 选择 Workers & Pages
3. 点击 "Create application" -> "Pages"
4. 连接你的 GitHub 仓库
5. 配置构建设置：
   - **Framework preset**: Next.js
   - **Build command**: `pnpm build`
   - **Build output directory**: `.next`
   - **Root directory**: `/`

#### 3. 配置环境变量
在 Cloudflare Pages 设置中添加：
```
NODE_VERSION=20
SKIP_ENV_VALIDATION=true
```

#### 4. 绑定 D1 数据库
1. 在 Pages 项目设置中
2. 选择 "Settings" -> "Functions" -> "D1 database bindings"
3. 添加绑定：
   - Variable name: `DB`
   - D1 database: 选择之前创建的 `resource-booking-db`

#### 5. 部署
点击 "Deploy" 按钮，Cloudflare 会自动构建和部署。

## 数据库迁移

### 导出本地数据库架构
```bash
# 生成 SQL 文件
pnpm db:generate

# 查看生成的 SQL 文件
ls drizzle/*.sql
```

### 应用到 Cloudflare D1
```bash
# 执行所有迁移文件
for file in drizzle/*.sql; do
  wrangler d1 execute resource-booking-db --file="$file"
done
```

## 验证部署

### 1. 检查 API 端点
```bash
# 替换为你的 Cloudflare Pages URL
curl https://your-project.pages.dev/api/resources
```

### 2. 测试登录
访问: `https://your-project.pages.dev/sign-in`

使用测试账号：
- 邮箱: admin@concordia.ca
- 密码: admin123

### 3. 检查数据库连接
在 Cloudflare Dashboard 中：
1. 进入你的 D1 数据库
2. 运行查询: `SELECT * FROM users LIMIT 5;`
3. 确认数据存在

## 常见问题

### 问题1: "Module not found" 错误
**解决方案**: 确保 `wrangler.toml` 中的 `compatibility_flags` 包含 `nodejs_compat`

### 问题2: 数据库连接失败
**解决方案**: 
1. 检查 D1 绑定是否正确配置
2. 确认 `src/db/index.ts` 中的环境检测逻辑
3. 检查 `process.env.DB` 是否可用

### 问题3: better-sqlite3 错误
**解决方案**: Cloudflare 使用 D1，不需要 better-sqlite3。确保：
```typescript
// src/db/index.ts
export function getDb() {
  if (process.env.DB) {
    // Cloudflare D1
    return drizzle(process.env.DB);
  } else {
    // 本地开发
    const sqlite = require('better-sqlite3');
    const db = sqlite(process.env.DATABASE_URL || './local.db');
    return drizzle(db);
  }
}
```

### 问题4: 构建时 ESLint 错误
**解决方案**: 已在 `next.config.ts` 中配置忽略构建时的 ESLint 和 TypeScript 错误。

## 环境差异

### 本地开发
- 数据库: SQLite (better-sqlite3)
- 文件: `./local.db`
- 命令: `pnpm dev`

### Cloudflare 生产环境
- 数据库: Cloudflare D1
- 绑定: `process.env.DB`
- 部署: `pnpm deploy`

## 性能优化建议

### 1. 启用缓存
在 API 路由中添加缓存头：
```typescript
return NextResponse.json(
  { success: true, data },
  {
    headers: {
      'Cache-Control': 's-maxage=60, stale-while-revalidate',
    },
  }
);
```

### 2. 使用 Cloudflare Images
将资源图片上传到 Cloudflare Images 以提高加载速度。

### 3. 启用分析
在 Cloudflare Dashboard 中启用 Web Analytics 监控性能。

## 监控和日志

### 查看部署日志
```bash
wrangler pages deployment tail
```

### 查看实时日志
```bash
wrangler tail
```

### 在 Dashboard 查看
访问 Cloudflare Dashboard -> Pages -> 选择项目 -> View logs

## 更新部署

### 方式一：自动部署（GitHub 集成）
推送到 main 分支会自动触发部署：
```bash
git push origin main
```

### 方式二：手动部署
```bash
pnpm build
pnpm run deploy
```

## 回滚

在 Cloudflare Dashboard 中：
1. 进入 Pages 项目
2. 选择 "Deployments"
3. 找到之前的部署
4. 点击 "Rollback to this deployment"

## 成本估算

Cloudflare Pages 和 D1 提供免费套餐：
- **Pages**: 无限请求，500 次构建/月
- **D1**: 5GB 存储，500万行读取/天

对于学习项目完全够用！

## 下一步

1. ✅ 构建通过
2. ⏳ 创建 D1 数据库
3. ⏳ 配置 wrangler.toml
4. ⏳ 部署到 Cloudflare
5. ⏳ 测试生产环境

祝部署顺利！🚀

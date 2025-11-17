# 后端开发指南

## 已完成的功能

本项目已成功实现完整的后端API系统，包括：

### ✅ 数据库层
- ✅ Drizzle ORM配置 (`src/db/schema.ts`)
- ✅ 7个数据表定义（用户、资源分类、资源、预订、工作时间规则、例外情况、通知）
- ✅ 数据库连接配置 (`src/db/index.ts`)
- ✅ 支持Cloudflare D1和本地SQLite
- ✅ 数据库迁移系统

### ✅ API路由（40+个端点）

#### 1. 认证系统 (`/api/auth/*`)
- 用户注册
- 用户登录

#### 2. 用户管理 (`/api/users/*`)
- 获取所有用户
- 获取单个用户
- 更新用户信息
- 删除用户

#### 3. 资源分类 (`/api/categories/*`)
- 获取所有分类
- 创建新分类

#### 4. 资源管理 (`/api/resources/*`)
- 获取所有资源（支持筛选）
- 获取单个资源
- 创建资源
- 更新资源
- 删除资源

#### 5. 预订管理 (`/api/bookings/*`)
- 获取所有预订（支持筛选）
- 获取单个预订
- 创建预订（自动冲突检测）
- 更新预订
- 取消预订
- 批准预订（管理员）
- 拒绝预订（管理员）

#### 6. 可用性管理 (`/api/availability/*`)
- 工作时间规则CRUD
- 例外情况CRUD

#### 7. 管理员分析 (`/api/admin/*`)
- 统计数据总览
- 热门资源报告
- 高峰时段分析
- 资源使用详情

#### 8. 通知系统 (`/api/notifications/*`)
- 获取用户通知
- 创建通知
- 标记已读
- 批量标记已读

## 快速开始

### 1. 安装依赖
```bash
pnpm install
```

### 2. 生成并应用数据库迁移
```bash
pnpm db:generate
pnpm db:push
```

### 3. 填充测试数据
```bash
pnpm db:seed
```

### 4. 启动开发服务器
```bash
pnpm dev
```

### 5. 查看数据库（可选）
```bash
pnpm db:studio
```

## 项目结构

```
src/
├── db/
│   ├── schema.ts          # 数据库表定义
│   └── index.ts           # 数据库连接配置
├── app/
│   └── api/               # API路由
│       ├── auth/          # 认证
│       ├── users/         # 用户管理
│       ├── categories/    # 资源分类
│       ├── resources/     # 资源管理
│       ├── bookings/      # 预订管理
│       ├── availability/  # 可用性管理
│       ├── admin/         # 管理员功能
│       └── notifications/ # 通知系统
└── types/
    └── d1.d.ts           # Cloudflare D1类型定义

scripts/
└── seed.ts               # 数据库种子文件

drizzle/
└── 0000_*.sql           # 数据库迁移文件
```

## 测试API

使用curl测试示例：

```bash
# 注册用户
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"张三","email":"zhang@example.com","password":"password123"}'

# 登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"zhang@example.com","password":"password123"}'

# 获取所有资源
curl http://localhost:3000/api/resources

# 创建预订
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "resourceId": 1,
    "startTime": "2025-11-20T14:00:00Z",
    "endTime": "2025-11-20T16:00:00Z",
    "purpose": "小组学习"
  }'
```

## 数据库命令

```bash
# 生成新的迁移文件
pnpm db:generate

# 应用迁移到数据库
pnpm db:push

# 查看数据库内容
pnpm db:studio

# 填充测试数据
pnpm db:seed
```

## 默认测试账户

种子数据包含以下测试账户：

- **管理员**
  - Email: `admin@concordia.ca`
  - Password: `admin123`
  - Role: admin

- **普通用户1**
  - Email: `john.smith@concordia.ca`
  - Password: `password123`
  - Role: user

- **普通用户2**
  - Email: `jane.doe@concordia.ca`
  - Password: `password123`
  - Role: user

## 特性亮点

### 🔒 安全性
- 密码加密存储（注：生产环境应使用bcrypt）
- SQL注入防护（Drizzle ORM自动处理）

### ⚡ 冲突检测
- 自动检测预订时间冲突
- 防止双重预订

### 📊 灵活查询
- 支持资源筛选
- 支持预订状态过滤
- 支持用户和资源关联查询

### 🔔 通知系统
- 预订状态更新通知
- 系统公告
- 未读消息管理

### 📈 数据分析
- 资源使用统计
- 高峰时段分析
- 热门资源排行

## 下一步建议

### 必需的改进（生产环境）
- [ ] 实现JWT或Session认证
- [ ] 使用bcrypt加密密码
- [ ] 添加请求验证中间件
- [ ] 实现权限控制（RBAC）
- [ ] 添加API速率限制
- [ ] 实现分页功能

### 可选的增强功能
- [ ] 添加文件上传（资源图片）
- [ ] 实现邮件通知
- [ ] 添加搜索功能
- [ ] 实现缓存层
- [ ] 添加单元测试
- [ ] 生成API文档（Swagger）

## 文档

详细的API文档请参考：[docs/API.md](./API.md)

## 技术选型说明

- **Next.js Route Handlers**: 轻量级、类型安全的API解决方案
- **Drizzle ORM**: TypeScript优先，性能优秀，类型安全
- **Cloudflare D1**: 边缘计算友好，零冷启动，全球分发
- **SQLite**: 开发环境简单高效，无需额外配置

## 部署

### Cloudflare Pages

1. 创建D1数据库：
```bash
wrangler d1 create campus-booking-db
```

2. 更新 `wrangler.jsonc` 配置

3. 应用迁移：
```bash
wrangler d1 migrations apply campus-booking-db
```

4. 部署：
```bash
pnpm deploy
```

## 问题排查

### 数据库连接错误
确保已运行 `pnpm db:push` 来创建数据库表。

### API返回500错误
检查控制台日志，确认数据库连接正常。

### 类型错误
运行 `pnpm cf-typegen` 更新Cloudflare类型。

## 贡献

本项目为SOEN 287课程项目，团队成员请确保：
- 代码符合项目规范
- 提交前测试所有API
- 更新相关文档
- 记录个人贡献

## 许可证

MIT License

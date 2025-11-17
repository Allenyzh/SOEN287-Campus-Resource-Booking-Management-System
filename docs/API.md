# 后端API文档

## 概述

本项目使用 Next.js Route Handlers 作为后端API，Drizzle ORM 连接 Cloudflare D1 数据库（开发环境使用 better-sqlite3）。

## 技术栈

- **框架**: Next.js 15 (App Router)
- **ORM**: Drizzle ORM
- **数据库**: Cloudflare D1 / SQLite (开发环境)
- **类型安全**: TypeScript

## 数据库设置

### 1. 安装依赖

```bash
pnpm install
```

### 2. 生成数据库迁移文件

```bash
pnpm db:generate
```

### 3. 推送迁移到数据库

```bash
pnpm db:push
```

### 4. （可选）填充种子数据

```bash
pnpm db:seed
```

### 5. 查看数据库（Drizzle Studio）

```bash
pnpm db:studio
```

## API 端点

### 🔐 认证 (Auth)

#### 注册
- **POST** `/api/auth/register`
- Body: `{ name, email, password }`
- 返回: 新创建的用户信息

#### 登录
- **POST** `/api/auth/login`
- Body: `{ email, password }`
- 返回: 用户信息（不含密码）

### 👤 用户管理 (Users)

#### 获取所有用户（管理员）
- **GET** `/api/users`
- 返回: 所有用户列表

#### 获取单个用户
- **GET** `/api/users/[id]`
- 返回: 指定用户信息

#### 更新用户
- **PUT** `/api/users/[id]`
- Body: `{ name?, email? }`
- 返回: 更新后的用户信息

#### 删除用户
- **DELETE** `/api/users/[id]`
- 返回: 成功消息

### 📦 资源分类 (Categories)

#### 获取所有分类
- **GET** `/api/categories`
- 返回: 所有资源分类列表

#### 创建分类
- **POST** `/api/categories`
- Body: `{ name, description? }`
- 返回: 新创建的分类

### 🏢 资源管理 (Resources)

#### 获取所有资源
- **GET** `/api/resources`
- Query参数: `category?`, `status?`
- 返回: 资源列表（包含分类信息）

#### 获取单个资源
- **GET** `/api/resources/[id]`
- 返回: 资源详情

#### 创建资源
- **POST** `/api/resources`
- Body: `{ name, description?, categoryId, location?, capacity?, imageUrl?, requiresApproval? }`
- 返回: 新创建的资源

#### 更新资源
- **PUT** `/api/resources/[id]`
- Body: 任意资源字段
- 返回: 更新后的资源

#### 删除资源
- **DELETE** `/api/resources/[id]`
- 返回: 成功消息

### 📅 预订管理 (Bookings)

#### 获取所有预订
- **GET** `/api/bookings`
- Query参数: `userId?`, `resourceId?`, `status?`
- 返回: 预订列表（包含用户和资源信息）

#### 获取单个预订
- **GET** `/api/bookings/[id]`
- 返回: 预订详情

#### 创建预订
- **POST** `/api/bookings`
- Body: `{ userId, resourceId, startTime, endTime, purpose? }`
- 返回: 新创建的预订（自动检测冲突）

#### 更新预订
- **PUT** `/api/bookings/[id]`
- Body: 任意预订字段
- 返回: 更新后的预订

#### 取消预订
- **DELETE** `/api/bookings/[id]`
- 返回: 取消的预订（状态改为 cancelled）

#### 批准预订（管理员）
- **POST** `/api/bookings/[id]/approve`
- 返回: 批准的预订

#### 拒绝预订（管理员）
- **POST** `/api/bookings/[id]/reject`
- Body: `{ reason? }`
- 返回: 拒绝的预订

### ⏰ 可用性管理 (Availability)

#### 获取工作时间规则
- **GET** `/api/availability/rules`
- Query参数: `resourceId?`
- 返回: 工作时间规则列表

#### 创建工作时间规则
- **POST** `/api/availability/rules`
- Body: `{ resourceId, dayOfWeek, openTime, closeTime }`
- dayOfWeek: 0=周日, 1=周一, ..., 6=周六
- 返回: 新创建的规则

#### 更新工作时间规则
- **PUT** `/api/availability/rules/[id]`
- Body: 任意规则字段
- 返回: 更新后的规则

#### 删除工作时间规则
- **DELETE** `/api/availability/rules/[id]`
- 返回: 成功消息

#### 获取例外情况
- **GET** `/api/availability/exceptions`
- Query参数: `resourceId?`
- 返回: 例外情况列表

#### 创建例外情况
- **POST** `/api/availability/exceptions`
- Body: `{ resourceId, startDatetime, endDatetime, isUnavailable?, reason? }`
- 返回: 新创建的例外

#### 删除例外情况
- **DELETE** `/api/availability/exceptions/[id]`
- 返回: 成功消息

### 📊 管理员分析 (Admin Reports)

#### 获取统计数据
- **GET** `/api/admin/stats`
- 返回: 总体统计（资源数、用户数、预订数等）

#### 获取热门资源
- **GET** `/api/admin/reports/popular-resources`
- Query参数: `limit?` (默认10)
- 返回: 按预订次数排序的资源列表

#### 获取高峰时段
- **GET** `/api/admin/reports/peak-times`
- 返回: 按小时和星期几的预订统计

#### 获取资源使用报告
- **GET** `/api/admin/reports/resource-usage/[id]`
- Query参数: `startDate?`, `endDate?`
- 返回: 指定资源的详细使用情况

### 🔔 通知系统 (Notifications)

#### 获取用户通知
- **GET** `/api/notifications`
- Query参数: `userId` (必需), `unreadOnly?`
- 返回: 通知列表

#### 创建通知
- **POST** `/api/notifications`
- Body: `{ userId, title, message, type, relatedBookingId? }`
- type: `booking_update` 或 `announcement`
- 返回: 新创建的通知

#### 标记通知为已读
- **PUT** `/api/notifications/[id]/read`
- 返回: 更新后的通知

#### 标记所有通知为已读
- **PUT** `/api/notifications/mark-all-read`
- Body: `{ userId }`
- 返回: 成功消息

## 数据模型

### User (用户)
```typescript
{
  id: number
  name: string
  email: string (unique)
  passwordHash: string
  role: 'user' | 'admin'
  createdAt: Date
  updatedAt: Date
}
```

### ResourceCategory (资源分类)
```typescript
{
  id: number
  name: string (unique)
  description: string?
}
```

### Resource (资源)
```typescript
{
  id: number
  name: string
  description: string?
  categoryId: number
  location: string?
  capacity: number?
  imageUrl: string?
  status: 'available' | 'unavailable'
  requiresApproval: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Booking (预订)
```typescript
{
  id: number
  userId: number
  resourceId: number
  startTime: Date
  endTime: Date
  purpose: string?
  status: 'pending' | 'confirmed' | 'cancelled' | 'rejected'
  createdAt: Date
  updatedAt: Date
}
```

### AvailabilityRule (工作时间规则)
```typescript
{
  id: number
  resourceId: number
  dayOfWeek: number  // 0=周日, 1=周一, ..., 6=周六
  openTime: string   // "HH:mm"
  closeTime: string  // "HH:mm"
}
```

### AvailabilityException (例外情况)
```typescript
{
  id: number
  resourceId: number
  startDatetime: Date
  endDatetime: Date
  isUnavailable: boolean
  reason: string?
}
```

### Notification (通知)
```typescript
{
  id: number
  userId: number
  title: string
  message: string
  isRead: boolean
  type: 'booking_update' | 'announcement'
  relatedBookingId: number?
  createdAt: Date
}
```

## 响应格式

所有API响应都遵循统一格式：

### 成功响应
```json
{
  "success": true,
  "data": { /* 数据对象或数组 */ }
}
```

### 错误响应
```json
{
  "success": false,
  "error": "错误描述"
}
```

## 错误代码

- `400` - 请求参数错误
- `401` - 未授权（认证失败）
- `404` - 资源未找到
- `409` - 冲突（如预订时间冲突、邮箱已存在）
- `500` - 服务器内部错误

## 开发环境

### 启动开发服务器

```bash
pnpm dev
```

访问 `http://localhost:3000`

### 测试API

可以使用以下工具测试API：
- Postman
- Thunder Client (VS Code扩展)
- cURL
- 或任何HTTP客户端

示例请求：

```bash
# 注册用户
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# 登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 获取所有资源
curl http://localhost:3000/api/resources
```

## 部署到Cloudflare

1. 配置 `wrangler.jsonc` 中的 D1 数据库绑定
2. 创建 D1 数据库：
   ```bash
   wrangler d1 create campus-booking-db
   ```
3. 运行迁移：
   ```bash
   wrangler d1 migrations apply campus-booking-db --local
   ```
4. 部署：
   ```bash
   pnpm deploy
   ```

## 注意事项

1. **密码安全**: 当前使用简单的Base64编码，生产环境应使用bcrypt等安全哈希算法
2. **认证**: 生产环境应实现JWT或Session管理
3. **权限控制**: 需要添加中间件验证用户权限
4. **输入验证**: 建议使用Zod等库进行更严格的输入验证
5. **分页**: 大数据量查询应该添加分页功能
6. **速率限制**: 生产环境应添加API速率限制

## 下一步

- [ ] 实现JWT认证
- [ ] 添加请求验证中间件
- [ ] 实现文件上传（资源图片）
- [ ] 添加邮件通知功能
- [ ] 实现更复杂的可用性检查逻辑
- [ ] 添加API文档自动生成（Swagger/OpenAPI）
- [ ] 实现缓存策略
- [ ] 添加单元测试和集成测试

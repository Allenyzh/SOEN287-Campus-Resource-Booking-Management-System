# 前后端集成完成 - 测试指南

## ✅ 完成的功能

### 1. 用户认证
- ✅ 用户登录 (LoginForm → authStore → POST /api/auth/login)
- ✅ 用户注册 (RegisterForm → authStore → POST /api/auth/register)
- ✅ 用户登出 (清除状态并跳转首页)
- ✅ 状态持久化 (localStorage)

### 2. 资源浏览
- ✅ 获取所有资源 (GET /api/resources)
- ✅ 按类别筛选
- ✅ 搜索功能
- ✅ 显示加载状态

### 3. 预订管理
- ✅ 创建预订 (POST /api/bookings)
- ✅ 查看我的预订 (GET /api/bookings?userId=X)
- ✅ 编辑预订 (PUT /api/bookings/:id)
- ✅ 取消预订 (DELETE /api/bookings/:id)
- ✅ 冲突检测 (后端自动检查)

### 4. 权限控制
- ✅ 未登录用户访问预订功能时自动跳转登录页
- ✅ Dashboard 页面需要登录才能访问
- ✅ 用户只能看到自己的预订

## 📁 修改的文件

### 新建文件
1. `src/stores/authStore.ts` - 用户认证状态管理
2. `src/components/common/UserNav.tsx` - 用户导航组件
3. `FRONTEND_BACKEND_INTEGRATION.md` - 集成文档
4. `TESTING_GUIDE.zh.md` - 本文档

### 修改的文件
1. `src/stores/bookingStore.ts` - 完全重写，接入后端 API
2. `src/components/auth/LoginForm.tsx` - 使用 authStore
3. `src/components/auth/RegisterForm.tsx` - 使用 authStore
4. `src/app/browse/page.tsx` - 从 API 获取资源，创建预订
5. `src/app/dashboard/page.tsx` - 从 API 获取预订，权限检查

## 🧪 测试步骤

### 准备工作
```bash
# 1. 确保数据库已初始化和填充数据
pnpm db:push
pnpm db:seed

# 2. 启动开发服务器
pnpm dev
```

### 测试账号
```
管理员账号:
- 邮箱: admin@concordia.ca
- 密码: admin123

学生账号 1:
- 邮箱: john.smith@concordia.ca
- 密码: password123

学生账号 2:
- 邮箱: jane.doe@concordia.ca
- 密码: password123
```

### 测试场景

#### 1. 用户注册和登录
1. 访问 http://localhost:3000/create-account
2. 填写注册表单
   - 姓名: Test User
   - 邮箱: test@concordia.ca
   - 密码: password123
   - 确认密码: password123
3. 点击 "Create account"
4. 应该自动跳转到 Dashboard
5. 点击 "Logout" 退出
6. 访问 http://localhost:3000/sign-in
7. 使用刚注册的账号登录
8. 应该再次跳转到 Dashboard

#### 2. 浏览资源
1. 访问 http://localhost:3000/browse
2. 应该看到 4 个资源（从 seed 数据）
   - Conference Room A
   - Computer Lab B
   - Study Room C
   - Sports Field D
3. 尝试搜索 "Conference"
4. 应该只显示 Conference Room A
5. 尝试按类别筛选 "Study Rooms"
6. 应该只显示 Study Room C

#### 3. 创建预订（未登录）
1. 确保已登出
2. 访问 http://localhost:3000/browse
3. 点击任意资源的 "Book Now" 按钮
4. 应该自动跳转到登录页

#### 4. 创建预订（已登录）
1. 使用 john.smith@concordia.ca 登录
2. 访问 http://localhost:3000/browse
3. 点击 "Conference Room A" 的 "Book Now"
4. 选择日期（明天或之后的日期）
5. 选择时间段（例如 10:00 - 12:00）
6. 点击 "Confirm Booking"
7. 应该显示成功提示

#### 5. 查看我的预订
1. 访问 http://localhost:3000/dashboard
2. 应该看到刚才创建的预订
3. 状态应该是 "pending"（待审核）
4. 应该显示资源名称、日期、时间

#### 6. 编辑预订
1. 在 Dashboard 中找到刚才的预订
2. 点击 "Edit" 按钮
3. 选择新的日期和时间
4. 点击 "Confirm Changes"
5. 预订应该更新

#### 7. 取消预订
1. 在 Dashboard 中找到预订
2. 点击 "Cancel" 按钮
3. 确认取消
4. 状态应该变为 "cancelled"

#### 8. 预订冲突检测
1. 使用 john.smith@concordia.ca 登录
2. 创建一个预订：Conference Room A, 明天 10:00-11:00
3. 登出
4. 使用 jane.doe@concordia.ca 登录
5. 尝试预订相同的资源和时间
6. 应该显示冲突错误

## 🔍 API 测试

可以使用浏览器开发者工具的 Network 选项卡查看 API 请求：

### 登录请求
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.smith@concordia.ca",
  "password": "password123"
}

响应:
{
  "success": true,
  "data": {
    "user": {
      "id": 2,
      "name": "John Smith",
      "email": "john.smith@concordia.ca",
      "role": "student"
    }
  }
}
```

### 获取资源
```http
GET /api/resources

响应:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Conference Room A",
      "description": "Large conference room with projector...",
      "categoryId": 1,
      "capacity": 20,
      "location": "Building H, Room 801",
      "status": "available",
      "requiresApproval": false,
      "category": {
        "id": 1,
        "name": "Conference Rooms"
      }
    }
  ]
}
```

### 创建预订
```http
POST /api/bookings
Content-Type: application/json

{
  "userId": 2,
  "resourceId": 1,
  "startTime": "2024-01-20T10:00:00.000Z",
  "endTime": "2024-01-20T11:00:00.000Z",
  "purpose": "Team meeting"
}

响应:
{
  "success": true,
  "data": {
    "id": 4,
    "userId": 2,
    "resourceId": 1,
    "startTime": "2024-01-20T10:00:00.000Z",
    "endTime": "2024-01-20T11:00:00.000Z",
    "status": "pending",
    "purpose": "Team meeting"
  }
}
```

## 📊 数据库查看

可以使用 Drizzle Studio 查看数据库：

```bash
pnpm db:studio
```

访问 https://local.drizzle.studio 查看：
- users 表 - 所有用户
- resources 表 - 所有资源
- bookings 表 - 所有预订
- resource_categories 表 - 资源类别

## 🐛 常见问题

### 问题：资源不显示
**解决方案:**
1. 检查浏览器控制台是否有错误
2. 确认数据库已填充数据: `pnpm db:seed`
3. 检查 API 是否正常: 访问 http://localhost:3000/api/resources

### 问题：登录失败
**解决方案:**
1. 确认密码正确（区分大小写）
2. 检查数据库中是否存在该用户
3. 清除浏览器 localStorage 重试

### 问题：预订不显示
**解决方案:**
1. 确认已登录
2. 检查 userId 是否匹配
3. 查看数据库 bookings 表确认数据存在

### 问题：TypeScript 错误
**解决方案:**
```bash
# 检查所有错误
pnpm type-check

# 重新安装依赖
pnpm install

# 重启 VS Code 的 TypeScript 服务器
```

## ✨ 下一步开发计划

1. **管理员功能** - 资源管理、预订审核
2. **实时更新** - WebSocket 支持
3. **通知系统** - 显示预订通知
4. **可用性规则** - 工作时间和例外情况 UI
5. **高级搜索** - 日期范围、可用性筛选
6. **统计报表** - 预订分析和资源使用率
7. **邮件通知** - 发送预订确认邮件
8. **个人资料** - 用户资料管理
9. **密码重置** - 忘记密码流程
10. **文件上传** - 资源图片上传

## 📝 技术栈

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **State Management**: Zustand (with persist middleware)
- **Backend**: Next.js Route Handlers
- **Database**: SQLite (local) / Cloudflare D1 (production)
- **ORM**: Drizzle ORM
- **UI Components**: Radix UI + shadcn/ui

## 🎉 总结

前端已成功连接到后端 API，主要功能（认证、资源浏览、预订管理）都使用真实数据库数据。应用遵循最佳实践，包括状态管理、错误处理和用户体验设计。

所有核心功能都已测试并正常工作！

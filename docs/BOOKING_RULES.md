# Booking Rules Implementation

本文档说明了如何在预订系统中应用 AvailabilityRule 和 AvailabilityException 规则。

## 概述

系统现在支持以下功能：

1. **工作时间规则（AvailabilityRule）**：定义资源在每周特定日期的开放时间
2. **可用性异常（AvailabilityException）**：定义特殊日期（如假期、维护期）的可用性
3. **智能预订验证**：在用户预订时自动检查这些规则

## 数据结构

### AvailabilityRule

```typescript
interface AvailabilityRule {
  id: number;
  resourceId: number;
  dayOfWeek: number; // 0=周日, 1=周一, ..., 6=周六
  openTime: string; // "HH:mm" 格式，如 "08:00"
  closeTime: string; // "HH:mm" 格式，如 "20:00"
}
```

### AvailabilityException

```typescript
interface AvailabilityException {
  id: number;
  resourceId: number;
  startDate: string; // "YYYY-MM-DD" 格式
  endDate: string; // "YYYY-MM-DD" 格式
  isUnavailable: boolean; // true = 不可用，false = 特殊可用
  reason?: string; // 原因/描述
  type: "holiday" | "maintenance" | "special_event" | "other";
}
```

## 新增的验证函数

### 1. `isDateAvailable(resourceId: number, date: string)`

检查某个日期是否可用于预订。

**返回值：**
```typescript
{
  available: boolean;
  reason?: string; // 如果不可用，返回原因
}
```

**逻辑：**
- 首先检查是否有异常规则（如假期、维护）
- 然后检查该星期几是否有工作时间规则
- 如果没有规则定义，则默认不可用

### 2. `getAvailableTimeSlots(resourceId: number, date: string)`

获取某个日期所有可用的时间段。

**返回值：** `string[]` - 可用时间段数组，如 `["08:00 - 10:00", "10:00 - 12:00"]`

**逻辑：**
- 首先验证日期是否可用
- 根据工作时间规则筛选时间段
- 排除已被预订的时间段

### 3. `isTimeSlotAvailable(resourceId: number, date: string, timeSlot: string)`

检查特定时间段是否可预订。

**返回值：**
```typescript
{
  available: boolean;
  reason?: string; // 如果不可用，返回原因
}
```

## 使用示例

### 示例 1: 添加工作时间规则

```typescript
const { addAvailabilityRule } = useBookingStore();

// Study Room 101 周一到周五 08:00-20:00 开放
for (let day = 1; day <= 5; day++) {
  addAvailabilityRule({
    resourceId: 1, // Study Room 101
    dayOfWeek: day,
    openTime: "08:00",
    closeTime: "20:00",
  });
}

// 周六 10:00-18:00 开放
addAvailabilityRule({
  resourceId: 1,
  dayOfWeek: 6,
  openTime: "10:00",
  closeTime: "18:00",
});
```

### 示例 2: 添加假期异常

```typescript
const { addAvailabilityException } = useBookingStore();

// 圣诞节假期
addAvailabilityException({
  resourceId: 1,
  startDate: "2025-12-24",
  endDate: "2025-12-26",
  isUnavailable: true,
  reason: "Christmas Holiday",
  type: "holiday",
});

// 设备维护
addAvailabilityException({
  resourceId: 2,
  startDate: "2025-11-15",
  endDate: "2025-11-15",
  isUnavailable: true,
  reason: "Scheduled maintenance",
  type: "maintenance",
});
```

### 示例 3: 在预订前验证

```typescript
const { isTimeSlotAvailable, addBooking } = useBookingStore();

// 验证时间段是否可用
const availability = isTimeSlotAvailable(
  1, // resourceId
  "2025-10-23", // date
  "10:00 - 12:00" // timeSlot
);

if (availability.available) {
  addBooking({
    resourceId: 1,
    resourceName: "Study Room 101",
    date: "2025-10-23",
    time: "10:00 - 12:00",
    status: "Pending",
    userName: "Student",
  });
} else {
  alert(`Cannot book: ${availability.reason}`);
}
```

## UI 集成

### BookingDialog 组件

BookingDialog 组件已经集成了这些验证规则：

1. **日期选择**：当用户选择日期后，自动检查该日期是否可用
2. **时间段显示**：只显示可用的时间段
3. **实时验证**：在确认预订前进行最终验证

**用户体验：**
- 如果日期不可用，会显示错误消息和原因
- 只有在选择日期后才显示可用的时间段
- 已被预订或不在工作时间内的时间段不会显示
- 确认按钮只在所有条件满足时才启用

### 错误提示示例

- "holiday: Christmas Holiday" - 假期不可用
- "maintenance: Scheduled maintenance" - 维护期间不可用
- "No availability rules defined for this day" - 该日期未定义工作时间
- "Time slot is not available or already booked" - 时间段已被预订

## 管理员功能

管理员可以通过以下方式管理规则：

1. **WorkingHoursDialog**：设置资源的工作时间
2. **ExceptionsDialog**：添加特殊日期的异常规则
3. 这些组件在 `/admin/resources` 页面中使用

## 注意事项

1. **默认行为**：如果没有为某个资源定义任何规则，该资源在所有时间都不可用
2. **异常优先级**：异常规则优先于工作时间规则
3. **时区**：所有时间都使用本地时区
4. **预订冲突**：系统会自动防止重复预订

## 未来改进

- [ ] 添加半小时时间段支持
- [ ] 支持自定义时间段长度
- [ ] 添加定期异常（如每周例行维护）
- [ ] 支持多个时间段（如午休时间）
- [ ] 添加容量管理（部分预订）

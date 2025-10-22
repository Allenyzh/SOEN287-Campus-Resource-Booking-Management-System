/**
 * 示例：如何为资源添加可用性规则和异常
 *
 * 这个文件展示了如何使用 bookingStore 的 API 来设置资源的工作时间和异常日期
 */

import { useBookingStore } from "@/stores/bookingStore";

/**
 * 为 Study Room 101 设置工作时间
 */
export function setupStudyRoom101Schedule() {
  const { addAvailabilityRule, addAvailabilityException } =
    useBookingStore.getState();

  // 周一到周五：08:00 - 20:00
  for (let day = 1; day <= 5; day++) {
    addAvailabilityRule({
      resourceId: 1,
      dayOfWeek: day,
      openTime: "08:00",
      closeTime: "20:00",
    });
  }

  // 周六：10:00 - 18:00
  addAvailabilityRule({
    resourceId: 1,
    dayOfWeek: 6,
    openTime: "10:00",
    closeTime: "18:00",
  });

  // 周日：关闭（不添加规则）

  // 添加假期异常
  addAvailabilityException({
    resourceId: 1,
    startDate: "2025-12-24",
    endDate: "2025-12-26",
    isUnavailable: true,
    reason: "Christmas Holiday - Library Closed",
    type: "holiday",
  });

  console.log("Study Room 101 schedule configured");
}

/**
 * 为 Computer Lab 2 设置工作时间
 */
export function setupComputerLab2Schedule() {
  const { addAvailabilityRule, addAvailabilityException } =
    useBookingStore.getState();

  // 周一到周五：08:00 - 22:00（更长的工作时间）
  for (let day = 1; day <= 5; day++) {
    addAvailabilityRule({
      resourceId: 2,
      dayOfWeek: day,
      openTime: "08:00",
      closeTime: "22:00",
    });
  }

  // 周末：12:00 - 18:00
  [0, 6].forEach((day) => {
    addAvailabilityRule({
      resourceId: 2,
      dayOfWeek: day,
      openTime: "12:00",
      closeTime: "18:00",
    });
  });

  // 定期维护
  addAvailabilityException({
    resourceId: 2,
    startDate: "2025-11-15",
    endDate: "2025-11-15",
    isUnavailable: true,
    reason: "Monthly system maintenance and updates",
    type: "maintenance",
  });

  console.log("Computer Lab 2 schedule configured");
}

/**
 * 为 Conference Room A 设置工作时间
 */
export function setupConferenceRoomASchedule() {
  const { addAvailabilityRule, addAvailabilityException } =
    useBookingStore.getState();

  // 周一到周五：09:00 - 17:00（办公时间）
  for (let day = 1; day <= 5; day++) {
    addAvailabilityRule({
      resourceId: 3,
      dayOfWeek: day,
      openTime: "09:00",
      closeTime: "17:00",
    });
  }

  // 周末不开放

  // 特殊活动日（全天不可用）
  addAvailabilityException({
    resourceId: 3,
    startDate: "2025-11-20",
    endDate: "2025-11-22",
    isUnavailable: true,
    reason: "Annual Conference - Reserved for keynote speakers",
    type: "special_event",
  });

  console.log("Conference Room A schedule configured");
}

/**
 * 为所有主要资源设置默认工作时间
 */
export function setupAllResourceSchedules() {
  setupStudyRoom101Schedule();
  setupComputerLab2Schedule();
  setupConferenceRoomASchedule();

  // 可以继续为其他资源添加规则...
  const { addAvailabilityRule } = useBookingStore.getState();

  // Study Room 205 (resourceId: 4) - 类似 Study Room 101
  for (let day = 1; day <= 5; day++) {
    addAvailabilityRule({
      resourceId: 4,
      dayOfWeek: day,
      openTime: "08:00",
      closeTime: "20:00",
    });
  }

  // Presentation Room B (resourceId: 6)
  for (let day = 1; day <= 5; day++) {
    addAvailabilityRule({
      resourceId: 6,
      dayOfWeek: day,
      openTime: "09:00",
      closeTime: "18:00",
    });
  }

  // Group Study Space 3 (resourceId: 7)
  for (let day = 1; day <= 5; day++) {
    addAvailabilityRule({
      resourceId: 7,
      dayOfWeek: day,
      openTime: "08:00",
      closeTime: "22:00",
    });
  }

  // VR Lab (resourceId: 8) - 需要监督，时间较短
  for (let day = 1; day <= 5; day++) {
    addAvailabilityRule({
      resourceId: 8,
      dayOfWeek: day,
      openTime: "10:00",
      closeTime: "18:00",
    });
  }

  console.log("All resource schedules configured");
}

/**
 * 测试可用性检查
 */
export function testAvailabilityChecks() {
  const { isDateAvailable, getAvailableTimeSlots, isTimeSlotAvailable } =
    useBookingStore.getState();

  console.log("=== Testing Availability Checks ===");

  // 测试 1: 检查工作日
  const mondayCheck = isDateAvailable(1, "2025-10-27"); // Monday
  console.log("Monday availability for Study Room 101:", mondayCheck);

  // 测试 2: 检查周日（应该不可用）
  const sundayCheck = isDateAvailable(1, "2025-10-26"); // Sunday
  console.log("Sunday availability for Study Room 101:", sundayCheck);

  // 测试 3: 检查假期
  const holidayCheck = isDateAvailable(1, "2025-12-25"); // Christmas
  console.log("Christmas Day availability:", holidayCheck);

  // 测试 4: 获取可用时间段
  const availableSlots = getAvailableTimeSlots(1, "2025-10-27");
  console.log("Available time slots for Monday:", availableSlots);

  // 测试 5: 检查特定时间段
  const slotCheck = isTimeSlotAvailable(1, "2025-10-27", "10:00 - 12:00");
  console.log("10:00-12:00 slot availability:", slotCheck);
}

/**
 * 在应用启动时调用此函数来设置示例数据
 */
export function initializeBookingRules() {
  // 检查是否已经初始化
  const { availabilityRules } = useBookingStore.getState();

  if (availabilityRules.length === 0) {
    console.log("Initializing booking rules...");
    setupAllResourceSchedules();

    // 如果需要测试，取消注释下面这行
    // testAvailabilityChecks();
  } else {
    console.log("Booking rules already initialized");
  }
}

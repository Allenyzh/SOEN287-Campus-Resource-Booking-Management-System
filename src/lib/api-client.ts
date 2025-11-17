// API调用示例 - 可在前端组件中使用

// ============================================
// 认证相关API
// ============================================

// 用户注册
export async function registerUser(name: string, email: string, password: string) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return response.json();
}

// 用户登录
export async function loginUser(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}

// ============================================
// 资源相关API
// ============================================

// 获取所有资源
export async function getResources(category?: string, status?: string) {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (status) params.append('status', status);
  
  const response = await fetch(`/api/resources?${params.toString()}`);
  return response.json();
}

// 获取单个资源详情
export async function getResource(id: number) {
  const response = await fetch(`/api/resources/${id}`);
  return response.json();
}

// 创建资源（管理员）
export async function createResource(resourceData: {
  name: string;
  description?: string;
  categoryId: number;
  location?: string;
  capacity?: number;
  imageUrl?: string;
  requiresApproval?: boolean;
}) {
  const response = await fetch('/api/resources', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resourceData),
  });
  return response.json();
}

// 更新资源（管理员）
export async function updateResource(id: number, updates: Partial<any>) {
  const response = await fetch(`/api/resources/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return response.json();
}

// 删除资源（管理员）
export async function deleteResource(id: number) {
  const response = await fetch(`/api/resources/${id}`, {
    method: 'DELETE',
  });
  return response.json();
}

// ============================================
// 预订相关API
// ============================================

// 获取用户的所有预订
export async function getUserBookings(userId: number) {
  const response = await fetch(`/api/bookings?userId=${userId}`);
  return response.json();
}

// 获取某个资源的所有预订
export async function getResourceBookings(resourceId: number) {
  const response = await fetch(`/api/bookings?resourceId=${resourceId}`);
  return response.json();
}

// 创建预订
export async function createBooking(bookingData: {
  userId: number;
  resourceId: number;
  startTime: string; // ISO 8601 格式
  endTime: string;   // ISO 8601 格式
  purpose?: string;
}) {
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData),
  });
  return response.json();
}

// 更新预订
export async function updateBooking(id: number, updates: {
  startTime?: string;
  endTime?: string;
  purpose?: string;
}) {
  const response = await fetch(`/api/bookings/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return response.json();
}

// 取消预订
export async function cancelBooking(id: number) {
  const response = await fetch(`/api/bookings/${id}`, {
    method: 'DELETE',
  });
  return response.json();
}

// 批准预订（管理员）
export async function approveBooking(id: number) {
  const response = await fetch(`/api/bookings/${id}/approve`, {
    method: 'POST',
  });
  return response.json();
}

// 拒绝预订（管理员）
export async function rejectBooking(id: number, reason?: string) {
  const response = await fetch(`/api/bookings/${id}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });
  return response.json();
}

// ============================================
// 资源分类API
// ============================================

// 获取所有分类
export async function getCategories() {
  const response = await fetch('/api/categories');
  return response.json();
}

// 创建分类（管理员）
export async function createCategory(name: string, description?: string) {
  const response = await fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description }),
  });
  return response.json();
}

// ============================================
// 可用性管理API
// ============================================

// 获取资源的工作时间规则
export async function getAvailabilityRules(resourceId?: number) {
  const url = resourceId 
    ? `/api/availability/rules?resourceId=${resourceId}`
    : '/api/availability/rules';
  const response = await fetch(url);
  return response.json();
}

// 创建工作时间规则（管理员）
export async function createAvailabilityRule(rule: {
  resourceId: number;
  dayOfWeek: number; // 0=周日, 1=周一, ..., 6=周六
  openTime: string;  // "HH:mm"
  closeTime: string; // "HH:mm"
}) {
  const response = await fetch('/api/availability/rules', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rule),
  });
  return response.json();
}

// 获取例外情况
export async function getAvailabilityExceptions(resourceId?: number) {
  const url = resourceId
    ? `/api/availability/exceptions?resourceId=${resourceId}`
    : '/api/availability/exceptions';
  const response = await fetch(url);
  return response.json();
}

// 创建例外情况（管理员）
export async function createAvailabilityException(exception: {
  resourceId: number;
  startDatetime: string; // ISO 8601
  endDatetime: string;   // ISO 8601
  isUnavailable?: boolean;
  reason?: string;
}) {
  const response = await fetch('/api/availability/exceptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(exception),
  });
  return response.json();
}

// ============================================
// 管理员统计和报告API
// ============================================

// 获取统计数据
export async function getAdminStats() {
  const response = await fetch('/api/admin/stats');
  return response.json();
}

// 获取热门资源
export async function getPopularResources(limit: number = 10) {
  const response = await fetch(`/api/admin/reports/popular-resources?limit=${limit}`);
  return response.json();
}

// 获取高峰时段
export async function getPeakTimes() {
  const response = await fetch('/api/admin/reports/peak-times');
  return response.json();
}

// 获取资源使用报告
export async function getResourceUsageReport(
  resourceId: number,
  startDate?: string,
  endDate?: string
) {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  
  const response = await fetch(
    `/api/admin/reports/resource-usage/${resourceId}?${params.toString()}`
  );
  return response.json();
}

// ============================================
// 通知系统API
// ============================================

// 获取用户通知
export async function getUserNotifications(userId: number, unreadOnly: boolean = false) {
  const params = new URLSearchParams({ userId: userId.toString() });
  if (unreadOnly) params.append('unreadOnly', 'true');
  
  const response = await fetch(`/api/notifications?${params.toString()}`);
  return response.json();
}

// 创建通知（管理员）
export async function createNotification(notification: {
  userId: number;
  title: string;
  message: string;
  type: 'booking_update' | 'announcement';
  relatedBookingId?: number;
}) {
  const response = await fetch('/api/notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(notification),
  });
  return response.json();
}

// 标记通知为已读
export async function markNotificationAsRead(notificationId: number) {
  const response = await fetch(`/api/notifications/${notificationId}/read`, {
    method: 'PUT',
  });
  return response.json();
}

// 标记所有通知为已读
export async function markAllNotificationsAsRead(userId: number) {
  const response = await fetch('/api/notifications/mark-all-read', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  return response.json();
}

// ============================================
// 使用示例
// ============================================

/*
// 在React组件中使用：

import { useState, useEffect } from 'react';
import { getResources, createBooking } from '@/lib/api-client';

export function BrowseResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResources() {
      try {
        const result = await getResources();
        if (result.success) {
          setResources(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch resources:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchResources();
  }, []);

  async function handleBooking(resourceId: number) {
    const bookingData = {
      userId: 1, // 从用户session获取
      resourceId,
      startTime: new Date('2025-11-20T14:00:00').toISOString(),
      endTime: new Date('2025-11-20T16:00:00').toISOString(),
      purpose: '小组学习',
    };

    try {
      const result = await createBooking(bookingData);
      if (result.success) {
        alert('预订成功！');
      } else {
        alert(`预订失败: ${result.error}`);
      }
    } catch (error) {
      console.error('Booking error:', error);
    }
  }

  if (loading) return <div>加载中...</div>;

  return (
    <div>
      {resources.map((resource) => (
        <div key={resource.id}>
          <h3>{resource.name}</h3>
          <p>{resource.description}</p>
          <button onClick={() => handleBooking(resource.id)}>
            预订
          </button>
        </div>
      ))}
    </div>
  );
}
*/

import { api } from '@/plugin/axios'
import { ApiResponse } from '@/types/services'
import type { Notification, NotificationsResponse, UnreadCountResponse } from '@/types/notification'

export type { Notification }

export const getNotifications = (page: number = 1, limit: number = 10): ApiResponse<NotificationsResponse> => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })

  return api.get(`/notifications?${queryParams.toString()}`)
}

export const getUnreadCount = (): ApiResponse<UnreadCountResponse> => {
  return api.get('/notifications/unread-count')
}

export const markAsRead = (id: string): ApiResponse<Notification> => {
  return api.put(`/notifications/${id}/read`)
}

export const markAllAsRead = (): ApiResponse<{ success: boolean }> => {
  return api.put('/notifications/read-all')
}

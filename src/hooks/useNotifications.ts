import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  type Notification,
} from '@/services/notification'

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isCountLoading, setIsCountLoading] = useState(false)

  const fetchNotifications = useCallback(async (page: number = 1, limit: number = 10) => {
    try {
      setIsLoading(true)
      const response = await getNotifications(page, limit)

      if (response.data?.error) {
        console.error('Failed to fetch notifications')
        return
      }

      const items = response.data?.data?.item
      if (items && 'notifications' in items) {
        setNotifications(items.notifications)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchUnreadCount = useCallback(async () => {
    try {
      setIsCountLoading(true)
      const response = await getUnreadCount()

      if (response.data?.error) {
        console.error('Failed to fetch unread count')
        return
      }

      const items = response.data?.data?.item
      if (items && 'unreadCount' in items) {
        setUnreadCount(items.unreadCount)
      }
    } catch (error) {
      console.error('Error fetching unread count:', error)
    } finally {
      setIsCountLoading(false)
    }
  }, [])

  const handleMarkAsRead = useCallback(async (id: string) => {
    try {
      const response = await markAsRead(id)

      if (response.data?.error) {
        toast.error('ไม่สามารถทำเครื่องหมายว่าอ่านแล้ว')
        return
      }

      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
      )

      await fetchUnreadCount()
    } catch (error) {
      console.error('Error marking notification as read:', error)
      toast.error('เกิดข้อผิดพลาด')
    }
  }, [fetchUnreadCount])

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      const response = await markAllAsRead()

      if (response.data?.error) {
        toast.error('ไม่สามารถทำเครื่องหมายทั้งหมดว่าอ่านแล้ว')
        return
      }

      setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      toast.error('เกิดข้อผิดพลาด')
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
    fetchUnreadCount()

    const interval = setInterval(() => {
      fetchUnreadCount()
    }, 30000)

    return () => clearInterval(interval)
  }, [fetchNotifications, fetchUnreadCount])

  return {
    notifications,
    unreadCount,
    isLoading,
    isCountLoading,
    handleMarkAsRead,
    handleMarkAllAsRead,
    refetch: fetchNotifications,
    refetchCount: fetchUnreadCount,
  }
}

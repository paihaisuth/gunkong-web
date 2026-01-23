import type { NotificationType } from '@/types/notification'

export interface NotificationIconConfig {
  icon: string
  color: string
}

export function getNotificationIconConfig(type: NotificationType): NotificationIconConfig {
  const configs: Record<NotificationType, NotificationIconConfig> = {
    PAYMENT_SUBMITTED: { icon: 'check-circle', color: 'text-green-500' },
    PAYMENT_VERIFIED: { icon: 'check-circle', color: 'text-green-500' },
    PAYMENT_REJECTED: { icon: 'x-circle', color: 'text-red-500' },
    ITEM_SHIPPED: { icon: 'package', color: 'text-blue-500' },
    TRANSACTION_COMPLETED: { icon: 'check-circle', color: 'text-green-500' },
    TRANSACTION_CANCELLED: { icon: 'x-circle', color: 'text-red-500' },
    DISPUTE_OPENED: { icon: 'message-circle', color: 'text-yellow-500' },
    DISPUTE_MESSAGE: { icon: 'message-circle', color: 'text-yellow-500' },
    ROOM_EXPIRED: { icon: 'alert-triangle', color: 'text-yellow-500' },
  }

  return configs[type] || { icon: 'bell', color: 'text-gray-500' }
}

export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'เมื่อสักครู่'
  }

  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} นาทีที่แล้ว`
  }

  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} ชั่วโมงที่แล้ว`
  }

  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} วันที่แล้ว`
  }

  return date.toLocaleDateString('th-TH')
}

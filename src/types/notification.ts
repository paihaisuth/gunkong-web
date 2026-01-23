export type NotificationType =
  | 'PAYMENT_SUBMITTED'
  | 'PAYMENT_VERIFIED'
  | 'PAYMENT_REJECTED'
  | 'ITEM_SHIPPED'
  | 'TRANSACTION_COMPLETED'
  | 'TRANSACTION_CANCELLED'
  | 'DISPUTE_OPENED'
  | 'DISPUTE_MESSAGE'
  | 'ROOM_EXPIRED'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  roomCode?: string
  isRead: boolean
  createdAt: string
}

export interface NotificationsResponse {
  items: Notification[]
  pagination: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}

export interface UnreadCountResponse {
  count: number
}

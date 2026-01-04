export type DisputeReason =
  | 'ITEM_NOT_RECEIVED'
  | 'ITEM_NOT_AS_DESCRIBED'
  | 'ITEM_DAMAGED'
  | 'PAYMENT_ISSUE'
  | 'SHIPPING_ISSUE'
  | 'SELLER_NOT_SHIPPING'
  | 'BUYER_NOT_CONFIRMING'
  | 'OTHER'

export type DisputeStatus =
  | 'OPEN'
  | 'UNDER_REVIEW'
  | 'RESOLVED_BUYER_FAVOR'
  | 'RESOLVED_SELLER_FAVOR'
  | 'RESOLVED_PARTIAL'
  | 'CLOSED'

export type DisputeResolution =
  | 'RESOLVED_BUYER_FAVOR'
  | 'RESOLVED_SELLER_FAVOR'
  | 'RESOLVED_PARTIAL'
  | 'CLOSED'

export type MessageType = 'MESSAGE' | 'EVIDENCE' | 'ADMIN_NOTE' | 'SYSTEM'

export interface DisputeUser {
  id: string
  username: string
  fullName: string
}

export interface DisputeMessage {
  id: string
  disputeId: string
  senderId: string
  messageType: MessageType
  content: string
  evidenceUrls: string[] | null
  isAdminMessage: boolean
  isInternalNote: boolean
  createdAt: string
  sender?: DisputeUser
}

export interface Dispute {
  id: string
  roomId: string
  roomCode?: string
  disputeCode: string
  openedBy: string
  buyerId: string
  sellerId: string
  reason: DisputeReason
  description: string
  status: DisputeStatus
  resolution: DisputeResolution | null
  resolutionNotes: string | null
  resolvedBy: string | null
  resolvedAt: string | null
  buyerRefundPercent: number | null
  sellerReleasePercent: number | null
  openedAt: string
  underReviewAt: string | null
  closedAt: string | null
  createdAt: string
  updatedAt: string
  opener?: DisputeUser
  buyer?: DisputeUser
  seller?: DisputeUser
  resolver?: DisputeUser
  messages?: DisputeMessage[]
}

export interface DisputeListItem {
  id: string
  roomCode: string
  disputeCode: string
  reason: DisputeReason
  status: DisputeStatus
  openedAt: string
  itemTitle: string
  totalCents: number
}

export interface DisputeListResponse {
  disputes: DisputeListItem[]
  total: number
  page: number
  totalPages: number
}

export interface OpenDisputeRequest {
  reason: DisputeReason
  description: string
}

export interface AddDisputeMessageRequest {
  content: string
  evidenceUrls?: string[]
}

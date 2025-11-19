import z from 'zod'
import { api } from '@/plugin/axios'
import { callApi } from '@/lib/service'

export type TransactionType =
    | 'PAYMENT'
    | 'REFUND'
    | 'PLATFORM_FEE'
    | 'SHIPPING_FEE'
    | 'RELEASE'

export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'

export type RoomStatus =
    | 'CREATED'
    | 'PENDING_PAYMENT'
    | 'PAID'
    | 'SHIPPED'
    | 'COMPLETED'
    | 'CANCELLED'

export type PaymentStatus = 'PENDING' | 'HELD' | 'RELEASED' | 'REFUNDED'

export type UserRole = 'creator' | 'buyer' | 'seller'

export interface UserSummary {
    id: string
    username: string
    fullName: string
}

export interface UserDetail extends UserSummary {
    email: string
}

export interface RoomSummary {
    id: string
    roomCode: string
    itemTitle: string
    status: string
    totalCents: number
    currency: string
    buyer?: UserSummary
    seller?: UserSummary
}

export interface Transaction {
    id: string
    userId: string
    roomId: string
    type: TransactionType
    status: TransactionStatus
    amountCents: number
    currency: string
    description?: string
    metadata?: Record<string, any>
    paymentMethod?: string
    paymentReference?: string
    completedAt?: string
    failedAt?: string
    failureReason?: string
    createdAt: string
    updatedAt: string
    room: RoomSummary
}

export interface JoinedRoom {
    id: string
    roomCode: string
    creatorId: string
    buyerId?: string
    sellerId?: string
    status: RoomStatus
    itemTitle: string
    itemDescription?: string
    quantity: number
    itemPriceCents: number
    shippingFeeCents: number
    platformFeeCents: number
    totalCents: number
    currency: string
    itemImages?: string[]
    shippingAddressId?: string
    trackingNumber?: string
    paidAt?: string
    paymentVerifiedAt?: string
    paymentVerifiedBy?: string
    shippedAt?: string
    completedAt?: string
    cancelledAt?: string
    cancelledBy?: string
    cancellationReason?: string
    expiresAt?: string
    closedAt?: string
    paymentStatus: PaymentStatus
    createdAt: string
    updatedAt: string
    seller?: UserDetail
    buyer?: UserDetail
    creator: UserDetail
}

export interface Pagination {
    total?: number
    page: number
    perPage: number
    totalPages: number
}

export interface CompleteHistoryResponse {
    success: boolean
    title: string
    message: string
    history: {
        transactionHistory: {
            total: number
            items: Transaction[]
        }
        joinedRooms: {
            total: number
            items: JoinedRoom[]
        }
    }
    pagination: Pagination
}

export interface TransactionHistoryResponse {
    success: boolean
    title: string
    message: string
    items: Transaction[]
    pagination: Pagination
}

export interface JoinedRoomsResponse {
    success: boolean
    title: string
    message: string
    items: JoinedRoom[]
    pagination: Pagination
}

const buildQueryParams = (data: Record<string, any>): string => {
    const queryParams = new URLSearchParams()
    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString())
        }
    })
    return queryParams.toString()
}

const fetchHistorySchema = z
    .object({
        page: z.number().min(1).optional(),
        perPage: z.number().min(1).max(50).optional(),
    })
    .transform((data) => ({
        ...data,
        queryString: buildQueryParams(data),
    }))

export type FetchHistoryParams = z.input<typeof fetchHistorySchema>

export const fetchCompleteHistory = (
    params: FetchHistoryParams = {}
): Promise<any> => {
    return callApi(params, fetchHistorySchema, (data) => {
        return api.get(`/history?${data.queryString}`)
    })
}

const fetchTransactionHistorySchema = z
    .object({
        page: z.number().min(1).optional(),
        perPage: z.number().min(1).max(50).optional(),
        type: z
            .enum([
                'PAYMENT',
                'REFUND',
                'PLATFORM_FEE',
                'SHIPPING_FEE',
                'RELEASE',
            ])
            .optional(),
        status: z
            .enum(['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'])
            .optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        searchText: z.string().optional(),
    })
    .transform((data) => ({
        ...data,
        queryString: buildQueryParams(data),
    }))

export type FetchTransactionHistoryParams = z.input<
    typeof fetchTransactionHistorySchema
>

export const fetchTransactionHistory = (
    params: FetchTransactionHistoryParams = {}
): Promise<any> => {
    return callApi(params, fetchTransactionHistorySchema, (data) => {
        return api.get(`/history/transactions?${data.queryString}`)
    })
}

const fetchJoinedRoomsSchema = z
    .object({
        page: z.number().min(1).optional(),
        perPage: z.number().min(1).max(50).optional(),
        role: z.enum(['creator', 'buyer', 'seller']).optional(),
        status: z
            .enum([
                'CREATED',
                'PENDING_PAYMENT',
                'PAID',
                'SHIPPED',
                'COMPLETED',
                'CANCELLED',
            ])
            .optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        searchText: z.string().optional(),
    })
    .transform((data) => ({
        ...data,
        queryString: buildQueryParams(data),
    }))

export type FetchJoinedRoomsParams = z.input<typeof fetchJoinedRoomsSchema>

export const fetchJoinedRooms = (
    params: FetchJoinedRoomsParams = {}
): Promise<any> => {
    return callApi(params, fetchJoinedRoomsSchema, (data) => {
        return api.get(`/history/rooms?${data.queryString}`)
    })
}

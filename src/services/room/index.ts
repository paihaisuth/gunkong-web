import z from 'zod'
import { api } from '@/plugin/axios'
import { ApiResponse } from '@/types/services'
import { callApi } from '@/lib/service'

type ItemStatus =
    | 'CREATED'
    | 'PENDING_PAYMENT'
    | 'PAID'
    | 'SHIPPED'
    | 'COMPLETED'
    | 'CANCELLED'

type PaymentProvider = 'OMISE' | 'PROMPTPAY' | 'BANK_TRANSFER'
type PaymentStatus = 'PENDING' | 'HELD' | 'RELEASED' | 'REFUNDED'

export interface RoomUser {
    id: string
    username: string
    fullName: string
}

export interface Payment {
    id: string
    roomId: string
    provider: PaymentProvider
    amountCents: number
    omiseChargeId: string | null
    status: PaymentStatus
    slipImage: {
        url: string
        publicId: string
    } | null
    heldAt: string | null
    releasedAt: string | null
    refundedAt: string | null
    createdAt: string
    updatedAt: string
}

export interface ShippingAddress {
    id: string
    roomId: string
    recipientName: string
    phone: string
    addressLine1: string
    addressLine2: string | null
    district: string
    province: string
    postalCode: string
    createdAt: string
    updatedAt: string
}

export interface Room {
    id: string
    roomCode: string
    creatorId: string
    buyerId: string | null
    sellerId: string
    status: ItemStatus
    itemTitle: string
    itemDescription: string | null
    quantity: number
    itemPriceCents: number
    shippingFeeCents: number
    platformFeeCents: number
    totalCents: number
    currency: string
    itemImages: string[]
    shippingAddressId: string | null
    trackingNumber: string | null
    paidAt: string | null
    paymentVerifiedAt: string | null
    paymentVerifiedBy: string | null
    shippedAt: string | null
    completedAt: string | null
    cancelledAt: string | null
    cancelledBy: string | null
    cancellationReason: string | null
    expiresAt: string | null
    closedAt: string | null
    paymentStatus: PaymentStatus
    createdAt: string
    updatedAt: string
    seller: RoomUser
    buyer: RoomUser | null
    creator: RoomUser
}

const searchRoomSchema = z.object({
    roomCode: z.string().min(1).max(8),
})

export type SearchRoomSchema = z.infer<typeof searchRoomSchema>

export const searchRooms = (roomCode: SearchRoomSchema): ApiResponse<Room> =>
    callApi(roomCode, searchRoomSchema, (data) => {
        return api.get(`/room/code/${data.roomCode}`)
    })

interface FetchRoomsParams {
    page?: number
    perPage?: number
    searchText?: string
}

export const fetchRooms = async (
    params?: FetchRoomsParams
): ApiResponse<Room[]> => {
    const queryParams = new URLSearchParams()

    if (params?.page) {
        queryParams.append('page', params.page.toString())
    }
    if (params?.perPage) {
        queryParams.append('perPage', params.perPage.toString())
    }
    if (params?.searchText) {
        queryParams.append('searchText', params.searchText)
    }

    const queryString = queryParams.toString()
    const url = queryString ? `/room/list?${queryString}` : '/room/list'

    return api.get(url)
}

const createRoomSchema = z.object({
    itemTitle: z.string().min(1, 'Item title is required'),
    itemDescription: z.string().optional(),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    itemPriceCents: z.number().min(0, 'Item price must be at least 0'),
    itemImages: z.array(z.string().url()).optional(),
})

export type CreateRoomSchema = z.infer<typeof createRoomSchema>

export const createRoom = (payload: CreateRoomSchema): ApiResponse<Room> =>
    callApi(payload, createRoomSchema, (data) => {
        return api.post('/room', {
            itemTitle: data.itemTitle,
            itemDescription: data.itemDescription,
            quantity: data.quantity,
            itemPriceCents: data.itemPriceCents,
            itemImages: data.itemImages,
        })
    })

export const fetchCodeRoom = (payload: SearchRoomSchema): ApiResponse<Room> => {
    return callApi(payload, searchRoomSchema, (data) => {
        return api.get(`/room/code/${data.roomCode}`)
    })
}

const updateRoomSchema = z.object({
    roomCode: z.string().min(1, 'Room code is required'),
    itemTitle: z.string().min(1, 'Item title is required').optional(),
    itemDescription: z.string().optional(),
    quantity: z.number().min(1, 'Quantity must be at least 1').optional(),
    itemPriceCents: z
        .number()
        .min(0, 'Item price must be at least 0')
        .optional(),
    itemImages: z.array(z.string().url()).optional(),
})

export type UpdateRoomSchema = z.infer<typeof updateRoomSchema>

export const updateRoom = (payload: UpdateRoomSchema): ApiResponse<Room> =>
    callApi(payload, updateRoomSchema, (data) => {
        const { roomCode, ...updateData } = data
        return api.patch(`/room/${roomCode}`, updateData)
    })

// Room Workflow Functions
const joinRoomSchema = z.object({
    roomCode: z.string().min(1, 'Room code is required'),
})

export type JoinRoomSchema = z.infer<typeof joinRoomSchema>

export const joinRoom = (payload: JoinRoomSchema): ApiResponse<Room> =>
    callApi(payload, joinRoomSchema, (data) => {
        return api.post(`/room/${data.roomCode}/join`)
    })

const cancelRoomSchema = z.object({
    roomCode: z.string().min(1, 'Room code is required'),
    reason: z.string().max(1000).optional(),
})

export type CancelRoomSchema = z.infer<typeof cancelRoomSchema>

export const cancelRoom = (payload: CancelRoomSchema): ApiResponse<Room> =>
    callApi(payload, cancelRoomSchema, (data) => {
        const { roomCode, reason } = data
        return api.post(`/room/${roomCode}/cancel`, { reason })
    })

const markAsShippedSchema = z.object({
    roomCode: z.string().min(1, 'Room code is required'),
    trackingNumber: z
        .string()
        .min(3, 'Tracking number must be at least 3 characters')
        .max(100, 'Tracking number cannot exceed 100 characters'),
})

export type MarkAsShippedSchema = z.infer<typeof markAsShippedSchema>

export const markAsShipped = (
    payload: MarkAsShippedSchema
): ApiResponse<Room> =>
    callApi(payload, markAsShippedSchema, (data) => {
        const { roomCode, trackingNumber } = data
        return api.post(`/room/${roomCode}/mark-shipped`, { trackingNumber })
    })

const completeRoomSchema = z.object({
    roomCode: z.string().min(1, 'Room code is required'),
})

export type CompleteRoomSchema = z.infer<typeof completeRoomSchema>

export const completeRoom = (payload: CompleteRoomSchema): ApiResponse<Room> =>
    callApi(payload, completeRoomSchema, (data) => {
        return api.post(`/room/${data.roomCode}/complete`)
    })

import z from 'zod'
import { api } from '@/plugin/axios'
import { ApiResponse } from '@/types/services'
import { callApi } from '@/lib/service'

type ItemStatus =
    | 'CREATED'
    | 'PENDING'
    | 'CONFIRMED'
    | 'SHIPPED'
    | 'COMPLETED'
    | 'CANCELLED'
type PaymentStatus = 'PENDING' | 'PAID' | 'VERIFIED' | 'FAILED'

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
}

const searchRoomSchema = z.object({
    roomCode: z.string().min(1).max(8),
})

export type SearchRoomShcema = z.infer<typeof searchRoomSchema>

export const searchRooms = (roomCode: SearchRoomShcema): ApiResponse<Room> =>
    callApi(roomCode, searchRoomSchema, (data) => {
        return api.get(`/room/${data.roomCode}`)
    })

export const fetchRooms = async (): ApiResponse<Room[]> => {
    return api.get('/room/list')
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

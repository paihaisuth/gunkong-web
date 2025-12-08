import z from 'zod'
import { api } from '@/plugin/axios'
import { ApiResponse } from '@/types/services'
import { callApi } from '@/lib/service'
import { ShippingAddress } from '@/services/room'

// Add Shipping Address
const addShippingAddressSchema = z.object({
    roomCode: z.string().min(1, 'Room code is required'),
    recipientName: z
        .string()
        .min(1, 'Recipient name is required')
        .max(100, 'Recipient name cannot exceed 100 characters'),
    phone: z
        .string()
        .regex(/^\+?[0-9]{9,15}$/, 'Phone number must be 9-15 digits'),
    addressLine1: z
        .string()
        .min(5, 'Address line 1 must be at least 5 characters')
        .max(200, 'Address line 1 cannot exceed 200 characters'),
    addressLine2: z
        .string()
        .max(200, 'Address line 2 cannot exceed 200 characters')
        .optional(),
    district: z
        .string()
        .min(1, 'District is required')
        .max(100, 'District cannot exceed 100 characters'),
    province: z
        .string()
        .min(1, 'Province is required')
        .max(100, 'Province cannot exceed 100 characters'),
    postalCode: z
        .string()
        .regex(/^\d{5}$/, 'Postal code must be exactly 5 digits'),
})

export type AddShippingAddressSchema = z.infer<typeof addShippingAddressSchema>

export const addShippingAddress = (
    payload: AddShippingAddressSchema
): ApiResponse<ShippingAddress> =>
    callApi(payload, addShippingAddressSchema, (data) => {
        const { roomCode, ...addressData } = data
        return api.post(`/room/${roomCode}/shipping-address`, addressData)
    })

// Update Shipping Address
const updateShippingAddressSchema = z.object({
    roomCode: z.string().min(1, 'Room code is required'),
    recipientName: z
        .string()
        .min(1, 'Recipient name is required')
        .max(100, 'Recipient name cannot exceed 100 characters'),
    phone: z
        .string()
        .regex(/^\+?[0-9]{9,15}$/, 'Phone number must be 9-15 digits'),
    addressLine1: z
        .string()
        .min(5, 'Address line 1 must be at least 5 characters')
        .max(200, 'Address line 1 cannot exceed 200 characters'),
    addressLine2: z
        .string()
        .max(200, 'Address line 2 cannot exceed 200 characters')
        .optional(),
    district: z
        .string()
        .min(1, 'District is required')
        .max(100, 'District cannot exceed 100 characters'),
    province: z
        .string()
        .min(1, 'Province is required')
        .max(100, 'Province cannot exceed 100 characters'),
    postalCode: z
        .string()
        .regex(/^\d{5}$/, 'Postal code must be exactly 5 digits'),
})

export type UpdateShippingAddressSchema = z.infer<
    typeof updateShippingAddressSchema
>

export const updateShippingAddress = (
    payload: UpdateShippingAddressSchema
): ApiResponse<ShippingAddress> =>
    callApi(payload, updateShippingAddressSchema, (data) => {
        const { roomCode, ...addressData } = data
        return api.put(`/room/${roomCode}/shipping-address`, addressData)
    })

// Get Shipping Address
const getShippingAddressSchema = z.object({
    roomCode: z.string().min(1, 'Room code is required'),
})

export type GetShippingAddressSchema = z.infer<typeof getShippingAddressSchema>

export const getShippingAddress = (
    payload: GetShippingAddressSchema
): ApiResponse<ShippingAddress> =>
    callApi(payload, getShippingAddressSchema, (data) => {
        return api.get(`/room/${data.roomCode}/shipping-address`)
    })

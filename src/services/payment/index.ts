import z from 'zod'
import { api } from '@/plugin/axios'
import { ApiResponse } from '@/types/services'
import { callApi } from '@/lib/service'
import { Payment } from '@/services/room'

// Payment Submission
const submitPaymentSchema = z.object({
    roomCode: z.string().min(1, 'Room code is required'),
    provider: z.enum(['OMISE', 'PROMPTPAY', 'BANK_TRANSFER']),
    omiseToken: z.string().optional(),
    slipImage: z
        .object({
            url: z.string(),
            publicId: z.string(),
        })
        .optional(),
})

export type SubmitPaymentSchema = z.infer<typeof submitPaymentSchema>

export const submitPayment = (
    payload: SubmitPaymentSchema
): ApiResponse<Payment> =>
    callApi(payload, submitPaymentSchema, (data) => {
        const { roomCode, ...paymentData } = data
        return api.post(`/room/${roomCode}/payment`, paymentData)
    })

// Get Payment
const getPaymentSchema = z.object({
    roomCode: z.string().min(1, 'Room code is required'),
})

export type GetPaymentSchema = z.infer<typeof getPaymentSchema>

export const getPayment = (payload: GetPaymentSchema): ApiResponse<Payment> =>
    callApi(payload, getPaymentSchema, (data) => {
        return api.get(`/room/${data.roomCode}/payment`)
    })

// Release Payment (Seller receives money)
const releasePaymentSchema = z.object({
    roomCode: z.string().min(1, 'Room code is required'),
})

export type ReleasePaymentSchema = z.infer<typeof releasePaymentSchema>

export const releasePayment = (
    payload: ReleasePaymentSchema
): ApiResponse<Payment> =>
    callApi(payload, releasePaymentSchema, (data) => {
        return api.post(`/room/${data.roomCode}/release-payment`)
    })

// Refund Payment (Cancel transaction)
const refundPaymentSchema = z.object({
    roomCode: z.string().min(1, 'Room code is required'),
    reason: z.string().max(1000).optional(),
})

export type RefundPaymentSchema = z.infer<typeof refundPaymentSchema>

export const refundPayment = (
    payload: RefundPaymentSchema
): ApiResponse<Payment> =>
    callApi(payload, refundPaymentSchema, (data) => {
        const { roomCode, reason } = data
        return api.post(`/room/${roomCode}/refund`, { reason })
    })

// // Admin: Verify Payment
// const verifyPaymentSchema = z.object({
//     paymentId: z.string().min(1, 'Payment ID is required'),
// })

// export type VerifyPaymentSchema = z.infer<typeof verifyPaymentSchema>

// export const verifyPayment = (
//     payload: VerifyPaymentSchema
// ): ApiResponse<Payment> =>
//     callApi(payload, verifyPaymentSchema, (data) => {
//         return api.post(`/admin/payment/${data.paymentId}/verify`)
//     })

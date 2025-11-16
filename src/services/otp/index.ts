import z from 'zod'
import { api } from '@/plugin/axios'
import { ApiResponse } from '@/types/services'
import { callApi } from '@/lib/service'

const verifyOtpSchema = z.object({
    email: z.string().email('Invalid email address'),
    otp: z.string().length(6, 'OTP must be 6 digits'),
})

export type VerifyOtpSchema = z.infer<typeof verifyOtpSchema>

const resendOtpSchema = z.object({
    email: z.string().email('Invalid email address'),
})

export type ResendOtpSchema = z.infer<typeof resendOtpSchema>

export interface VerifyOtpResponse {
    success: boolean
    title: string
    message: string
    data: {
        accessToken: string
        refreshToken: string
    }
}

export interface ResendOtpResponse {
    success: boolean
    title: string
    message: string
}

export const verifyOtp = (
    payload: VerifyOtpSchema
): ApiResponse<VerifyOtpResponse> =>
    callApi(payload, verifyOtpSchema, (data) => {
        return api.post('/verify-otp', {
            email: data.email,
            otp: data.otp,
        })
    })

export const resendOtp = (
    payload: ResendOtpSchema
): ApiResponse<ResendOtpResponse> =>
    callApi(payload, resendOtpSchema, (data) => {
        return api.post('/resend-otp', {
            email: data.email,
        })
    })

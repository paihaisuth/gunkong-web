import z from 'zod'
import { api } from '@/plugin/axios'
import { ApiResponse } from '@/types/services'
import { LoginResponse } from '@/types/services/login'
import { callApi } from '@/lib/service'

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginSchema = z.infer<typeof loginSchema>

export const login = (payload: LoginSchema): ApiResponse<LoginResponse> =>
    callApi(payload, loginSchema, (data) => {
        return api.post('/login', {
            email: data.email,
            password: data.password,
        })
    })

const refreshToken = z.string().jwt()

export const refreshTokenApi = (
    token: string
): ApiResponse<{ accessToken: string; refreshToken: string }> =>
    callApi(token, refreshToken, (data) => {
        return api.post('/refresh-token', {
            refreshToken: data,
        })
    })

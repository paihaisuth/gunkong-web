import z from 'zod'
import { api } from '@/plugin/axios'
import { ApiResponse } from '@/types/services'
import { LoginResponse } from '@/types/services/login'
import { callApi } from '@/lib/service'

export const loginSchema = z
    .object({
        usernameEmail: z.string().min(1, 'Username or email is required'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
    })
    .transform((data) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const isEmailInput = emailRegex.test(data.usernameEmail)

        return {
            ...(isEmailInput
                ? { email: data.usernameEmail.toLowerCase() }
                : { username: data.usernameEmail }),
            password: data.password,
        }
    })

type LoginSchema = z.input<typeof loginSchema>

export const login = (payload: LoginSchema): ApiResponse<LoginResponse> =>
    callApi(payload, loginSchema, (data) => {
        return api.post('/login', data)
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

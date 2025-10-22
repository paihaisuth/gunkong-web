import z from 'zod'
import { api } from '@/plugin/axios'
import { ApiResponse } from '@/types/services'
import { LoginResponse } from '@/types/services/login'
import { callApi } from '@/lib/service'

export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    fullName: z.string().min(3, 'Full name must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    phone: z
        .string()
        .min(10, 'Phone number must be at least 10 characters')
        .max(15, 'Phone number must be at most 15 characters'),
})

type RegisterSchema = z.infer<typeof registerSchema>

export const register = (payload: RegisterSchema): ApiResponse<LoginResponse> =>
    callApi(payload, registerSchema, (data) => {
        return api.post('/register', {
            email: data.email,
            username: data.username,
            password: data.password,
            fullName: data.fullName,
            phone: data.phone,
        })
    })

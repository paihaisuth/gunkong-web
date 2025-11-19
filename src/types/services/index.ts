import type { AxiosPromise } from 'axios'

export type Response<T> = {
    error?: {
        code: never
        description: string
    }
    data?: {
        title: string
        description: string
        pagination?: {
            total: number
            page: number
            perPage: number
            totalPages: number
        }
    } & T
}

export type ApiResponse<T> = AxiosPromise<
    Response<
        T extends unknown[]
            ? {
                  items: T
              }
            : { item: T }
    >
>

export interface AxiosPayloadError<T> {
    error: {
        code: T
        message: string
    } | null
}

export class ValidationDtoError extends Error {}

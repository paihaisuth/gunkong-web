import axios from 'axios'
import type { AxiosResponse } from 'axios'

let isRefreshing = false
let failedQueue: Array<{
    resolve: (value?: unknown) => void
    reject: (reason?: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null = null) {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    failedQueue = []
}

const createAxiosInstance = () => {
    const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'

    const instance = axios.create({
        baseURL: apiBaseUrl,
    })

    instance.interceptors.request.use(
        function (config) {
            const token = getAuthToken()

            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`
            }
            return config
        },
        function (error) {
            return Promise.reject(error)
        }
    )

    instance.interceptors.response.use(
        (response: AxiosResponse) => response,
        async (error) => {
            const originalRequest = error.config

            if (
                error.response &&
                error.response.status === 401 &&
                !originalRequest._retry
            ) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject })
                    })
                        .then((token) => {
                            originalRequest.headers[
                                'Authorization'
                            ] = `Bearer ${token}`
                            return instance(originalRequest)
                        })
                        .catch((err) => {
                            return Promise.reject(err)
                        })
                }

                originalRequest._retry = true
                isRefreshing = true

                try {
                    const newToken = await handleRefreshToken()

                    instance.defaults.headers.common[
                        'Authorization'
                    ] = `Bearer ${newToken}`
                    processQueue(null, newToken)
                    originalRequest.headers[
                        'Authorization'
                    ] = `Bearer ${newToken}`
                    return instance(originalRequest)
                } catch (err) {
                    processQueue(err, null)
                    clearAuthToken()
                    window.location.href = '/login'
                    return Promise.reject(err)
                } finally {
                    isRefreshing = false
                }
            }

            return Promise.reject(error)
        }
    )

    return instance
}

// Helper functions that you need to implement based on your auth system
function getAuthToken(): string | null {
    // TODO: Get token from your Zustand store
    // Example: return useUserStore.getState().accessToken
    return null
}

async function handleRefreshToken(): Promise<string> {
    // TODO: Implement token refresh logic
    // This should call your refresh token endpoint and return new access token
    throw new Error('Token refresh not implemented')
}

function clearAuthToken(): void {
    // TODO: Clear token from your Zustand store
    // Example: useUserStore.getState().logout()
}

// Create and export the axios instance
export const api = createAxiosInstance()
export default api

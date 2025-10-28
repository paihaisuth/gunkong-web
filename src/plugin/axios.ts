import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { useUserStore } from '@/stores/useUserStore'
import { refreshTokenApi } from '@/services/login/login'
import { isTokenExpired } from '@/lib/token-utils'

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

function redirectToLogin() {
    if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname
        if (currentPath !== '/login') {
            window.location.href = `/login?redirectTo=${encodeURIComponent(currentPath)}`
        }
    }
}

const createAxiosInstance = () => {
    const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'

    const instance = axios.create({
        baseURL: apiBaseUrl,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
    })

    instance.interceptors.request.use(
        async function (config) {
            const token = getAuthToken()

            if (token) {
                if (isTokenExpired(token)) {
                    const refreshToken = useUserStore.getState().refreshToken
                    
                    if (!refreshToken || isTokenExpired(refreshToken)) {
                        clearAuthToken()
                        redirectToLogin()
                        return Promise.reject(new Error('Token expired'))
                    }

                    try {
                        const newToken = await handleRefreshToken()
                        config.headers['Authorization'] = `Bearer ${newToken}`
                    } catch (error) {
                        clearAuthToken()
                        redirectToLogin()
                        return Promise.reject(error)
                    }
                } else {
                    config.headers['Authorization'] = `Bearer ${token}`
                }
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
                    redirectToLogin()
                    return Promise.reject(err)
                } finally {
                    isRefreshing = false
                }
            }

            if (error.response && error.response.status === 401) {
                clearAuthToken()
                redirectToLogin()
            }

            return Promise.reject(error)
        }
    )

    return instance
}

// Helper functions that you need to implement based on your auth system
function getAuthToken(): string | null {
    try {
        return useUserStore.getState().accessToken
    } catch (error) {
        console.error('Error getting auth token:', error)
        return null
    }
}

async function handleRefreshToken(): Promise<string> {
    try {
        const currentRefreshToken = useUserStore.getState().refreshToken

        if (!currentRefreshToken) {
            throw new Error('No refresh token available')
        }

        try {
            const response = await refreshTokenApi(currentRefreshToken)

            if (response.data?.data?.item?.accessToken) {
                const { setTokens } = useUserStore.getState()
                const newAccessToken = response.data.data.item.accessToken
                const newRefreshToken = response.data.data.item.refreshToken

                setTokens(newAccessToken, newRefreshToken)

                console.log('Token refresh successful')
                return newAccessToken
            } else {
                console.error(
                    'Invalid refresh token response structure:',
                    response.data
                )
                throw new Error('Invalid refresh token response')
            }
        } catch (error) {
            console.error('Token refresh failed:', error)
            const { logout } = useUserStore.getState()
            logout()
            throw error
        }
    } catch (error) {
        console.error('Token refresh failed:', error)
        throw error
    }
}

function clearAuthToken(): void {
    const { logout } = useUserStore.getState()
    logout()
}

// Create and export the axios instance
export const api = createAxiosInstance()
export default api

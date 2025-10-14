export const AUTH_COOKIE_NAME = 'access-token'
export const REFRESH_COOKIE_NAME = 'refresh-token'

const cookieOptions = {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
}

export const setAuthCookies = (accessToken: string, refreshToken?: string) => {
    if (typeof window !== 'undefined') {
        document.cookie = `${AUTH_COOKIE_NAME}=${accessToken}; path=/; max-age=${
            cookieOptions.maxAge
        }; samesite=${cookieOptions.sameSite}${
            cookieOptions.secure ? '; secure' : ''
        }`

        if (refreshToken) {
            document.cookie = `${REFRESH_COOKIE_NAME}=${refreshToken}; path=/; max-age=${
                cookieOptions.maxAge
            }; samesite=${cookieOptions.sameSite}${
                cookieOptions.secure ? '; secure' : ''
            }`
        }
    }
}

export const removeAuthCookies = () => {
    if (typeof window !== 'undefined') {
        document.cookie = `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`

        document.cookie = `${REFRESH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    }
}

export const getAuthCookie = (name: string): string | null => {
    if (typeof window !== 'undefined') {
        const value = `; ${document.cookie}`
        const parts = value.split(`; ${name}=`)
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null
    }
    return null
}

export const AUTH_COOKIE_NAME = 'access-token'
export const REFRESH_COOKIE_NAME = 'refresh-token'
export const OTP_SESSION_COOKIE_NAME = 'otp-session'

const cookieOptions = {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
}

const otpSessionOptions = {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 15,
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

export const setOtpSessionCookie = (email: string) => {
    if (typeof window !== 'undefined') {
        document.cookie = `${OTP_SESSION_COOKIE_NAME}=${email}; path=/; max-age=${
            otpSessionOptions.maxAge
        }; samesite=${otpSessionOptions.sameSite}${
            otpSessionOptions.secure ? '; secure' : ''
        }`
    }
}

export const removeOtpSessionCookie = () => {
    if (typeof window !== 'undefined') {
        document.cookie = `${OTP_SESSION_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    }
}

export const getOtpSessionCookie = (): string | null => {
    return getAuthCookie(OTP_SESSION_COOKIE_NAME)
}

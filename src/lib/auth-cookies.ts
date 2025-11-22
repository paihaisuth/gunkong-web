export const AUTH_COOKIE_NAME = 'access-token'
export const REFRESH_COOKIE_NAME = 'refresh-token'
export const OTP_SESSION_COOKIE_NAME = 'otp-session'

/**
 * Cookie Security Options
 *
 * IMPORTANT SECURITY NOTE:
 * - httpOnly is currently set to false to allow client-side JavaScript access
 * - This is required for the current client-side authentication implementation
 *
 * RECOMMENDED IMPROVEMENT FOR PRODUCTION:
 * - Set httpOnly: true to prevent XSS attacks
 * - Move authentication logic to Server-Side (API routes)
 * - Use Server Actions or API routes to set/read cookies
 * - This requires refactoring the auth flow to use server-side session management
 *
 * Current security measures:
 * - secure: true in production (requires HTTPS)
 * - sameSite: 'strict' to prevent CSRF attacks
 * - Limited maxAge to reduce exposure window
 */
const cookieOptions = {
    httpOnly: false, // TODO: Change to true and refactor to server-side auth
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const, // Updated from 'lax' for better security
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
}

const otpSessionOptions = {
    httpOnly: false, // Temporary session, less critical
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const, // Updated from 'lax' for better security
    path: '/',
    maxAge: 60 * 15, // 15 minutes
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

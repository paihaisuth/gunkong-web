'use client'

import { useEffect, useState } from 'react'
import { useUserStore } from '@/stores/useUserStore'
import { getAuthCookie, AUTH_COOKIE_NAME } from '@/lib/auth-cookies'

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { setTokens, accessToken, logout } = useUserStore()
    const [isInitialized, setIsInitialized] = useState(false)

    useEffect(() => {
        const cookieToken = getAuthCookie(AUTH_COOKIE_NAME)

        if (cookieToken && !accessToken) {
            setTokens(cookieToken)
        } else if (!cookieToken && accessToken) {
            logout()
        }

        setIsInitialized(true)
    }, [accessToken, setTokens, logout])

    if (!isInitialized) {
        return null
    }

    return <>{children}</>
}

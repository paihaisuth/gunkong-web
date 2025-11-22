'use client'

import { useEffect, useState } from 'react'
import { useUserStore } from '@/stores/useUserStore'
import { getAuthCookie, AUTH_COOKIE_NAME } from '@/lib/auth-cookies'

function LoadingSpinner() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">กำลังโหลด...</p>
            </div>
        </div>
    )
}

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
        return <LoadingSpinner />
    }

    return <>{children}</>
}

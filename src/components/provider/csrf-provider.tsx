'use client'

import { useEffect } from 'react'
import { initializeCsrfToken } from '@/plugin/axios'

export function CsrfProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        initializeCsrfToken()
    }, [])

    return <>{children}</>
}

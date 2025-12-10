export function decodeJWT(token: string): { exp?: number; sub?: string } | null {
    try {
        const parts = token.split('.')
        if (parts.length !== 3) {
            return null
        }

        const payload = parts[1]
        const decoded = JSON.parse(
            Buffer.from(payload, 'base64').toString('utf-8')
        )
        return decoded
    } catch (error) {
        console.error('Failed to decode JWT:', error)
        return null
    }
}

export function isTokenExpired(token: string): boolean {
    const decoded = decodeJWT(token)
    if (!decoded || !decoded.exp) {
        return true
    }

    const currentTime = Math.floor(Date.now() / 1000)
    return decoded.exp < currentTime
}

export function getTokenExpirationTime(token: string): number | null {
    const decoded = decodeJWT(token)
    if (!decoded || !decoded.exp) {
        return null
    }
    return decoded.exp * 1000
}

export function getUserIdFromToken(token: string): string | null {
    const decoded = decodeJWT(token)
    if (!decoded || !decoded.sub) {
        return null
    }
    return decoded.sub
}

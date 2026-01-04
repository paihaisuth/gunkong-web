export interface LoginResponse {
    success: boolean
    accessToken: string
    refreshToken: string
    user: {
        id: string
        email: string
        fullName: string
        phone: string
        username: string
    }
}

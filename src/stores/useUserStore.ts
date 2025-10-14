import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { setAuthCookies, removeAuthCookies } from '@/lib/auth-cookies'

interface User {
    id: string
    email: string
    name: string
}

interface UserState {
    user: User | null
    accessToken: string | null
    refreshToken: string | null
    isAuthenticated: boolean
    isLoading: boolean
}

interface UserActions {
    setUser: (user: User) => void
    setTokens: (accessToken: string, refreshToken?: string) => void
    login: (user: User, accessToken: string, refreshToken?: string) => void
    logout: () => void
    clearUser: () => void
    setLoading: (loading: boolean) => void
}

type UserStore = UserState & UserActions

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,

            setUser: (user: User) => {
                set({ user, isAuthenticated: !!user })
            },

            setTokens: (accessToken: string, refreshToken?: string) => {
                set({
                    accessToken,
                    refreshToken: refreshToken || get().refreshToken,
                    isAuthenticated: !!accessToken,
                })
                setAuthCookies(accessToken, refreshToken)
            },

            login: (user: User, accessToken: string, refreshToken?: string) => {
                set({
                    user,
                    accessToken,
                    refreshToken,
                    isAuthenticated: true,
                    isLoading: false,
                })
                setAuthCookies(accessToken, refreshToken)
            },

            logout: () => {
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    isLoading: false,
                })
                removeAuthCookies()
            },

            clearUser: () => {
                set({
                    user: null,
                    isAuthenticated: false,
                })
            },

            setLoading: (isLoading: boolean) => {
                set({ isLoading })
            },
        }),
        {
            name: 'user-storage',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)

export const useUser = () => useUserStore((state) => state.user)
export const useAccessToken = () => useUserStore((state) => state.accessToken)
export const useIsAuthenticated = () =>
    useUserStore((state) => state.isAuthenticated)
export const useUserActions = () =>
    useUserStore((state) => ({
        setUser: state.setUser,
        setTokens: state.setTokens,
        login: state.login,
        logout: state.logout,
        clearUser: state.clearUser,
        setLoading: state.setLoading,
    }))

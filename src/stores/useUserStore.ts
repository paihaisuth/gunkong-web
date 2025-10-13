import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
            // Initial state
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,

            // Actions
            setUser: (user: User) => {
                set({ user, isAuthenticated: !!user })
            },

            setTokens: (accessToken: string, refreshToken?: string) => {
                set({
                    accessToken,
                    refreshToken: refreshToken || get().refreshToken,
                    isAuthenticated: !!accessToken,
                })
            },

            login: (user: User, accessToken: string, refreshToken?: string) => {
                set({
                    user,
                    accessToken,
                    refreshToken,
                    isAuthenticated: true,
                    isLoading: false,
                })
            },

            logout: () => {
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    isLoading: false,
                })
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
            name: 'user-storage', // Storage key
            // Only persist these fields
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)

// Selectors for easier usage
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

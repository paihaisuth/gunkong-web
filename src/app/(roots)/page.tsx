'use client'

import { useUserStore } from '@/stores/useUserStore'
import { ShButton } from '@/components/ui/Button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { ShBadge } from '@/components/ui/Badge'
import { toast } from 'sonner'

export default function Home() {
    const { user, accessToken, logout, isAuthenticated } = useUserStore()

    const handleLogout = () => {
        logout()
        toast('Logged out successfully')
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="container mx-auto max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-4">
                        Welcome to Gunkong
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        This is a protected route that requires authentication.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                Authentication Status
                                <ShBadge
                                    variant={
                                        isAuthenticated
                                            ? 'default'
                                            : 'destructive'
                                    }
                                >
                                    {isAuthenticated
                                        ? 'Authenticated'
                                        : 'Not Authenticated'}
                                </ShBadge>
                            </CardTitle>
                            <CardDescription>
                                Current authentication information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {user && (
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground">
                                        User Information
                                    </h4>
                                    <div className="mt-2 space-y-1">
                                        <p>
                                            <strong>ID:</strong> {user.id}
                                        </p>
                                        <p>
                                            <strong>Email:</strong> {user.email}
                                        </p>
                                        <p>
                                            <strong>Name:</strong> {user.name}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {accessToken && (
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground">
                                        Access Token
                                    </h4>
                                    <p className="mt-2 text-sm font-mono bg-muted p-2 rounded break-all">
                                        {accessToken.substring(0, 50)}...
                                    </p>
                                </div>
                            )}

                            <ShButton
                                onClick={handleLogout}
                                variant="destructive"
                                className="w-full"
                            >
                                Logout
                            </ShButton>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Protected Content</CardTitle>
                            <CardDescription>
                                This content is only visible to authenticated
                                users
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                🎉 Congratulations! You have successfully
                                accessed a protected route. The middleware is
                                working correctly and verified your
                                authentication token.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

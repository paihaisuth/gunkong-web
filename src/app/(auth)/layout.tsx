import { Metadata } from 'next'
import { ShIcon } from '@/components/ui/icon'
import { ThemeToggle } from '@/components/provider/theme-toggle'

export const metadata: Metadata = {
    title: 'Authentication | E-Commerce Web',
    description:
        'Login or create an account to access your e-commerce platform',
}

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-md p-4">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <ShIcon
                                name="share-2"
                                size={18}
                                className="text-primary-foreground"
                            />
                        </div>
                        <span className="font-semibold text-lg">
                            Gunkong P2P Exchange
                        </span>
                    </div>
                    <ThemeToggle />
                </div>
            </header>
            {children}
        </div>
    )
}

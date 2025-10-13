import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Badge } from '@/components/ui/badge'
import { Toaster } from '@/components/ui/sonner'
import { ThemeToggle } from '@/components/theme-toggle'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'E-Commerce Web',
    description:
        'Modern e-commerce built with Next.js, Tailwind CSS 4, and shadcn/ui',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {/*<header className="border-b border-border bg-card p-4">
                        <div className="container mx-auto flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <h1 className="text-2xl font-bold text-foreground">
                                    TechStore
                                </h1>
                                <Badge variant="secondary">
                                    Tailwind 4 + shadcn/ui
                                </Badge>
                            </div>
                            <ThemeToggle />
                        </div>
                    </header>*/}
                    {children}
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    )
}

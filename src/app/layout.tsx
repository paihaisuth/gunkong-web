import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/provider/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/components/provider/auth-provider'
import { CsrfProvider } from '@/components/provider/csrf-provider'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'Gunkong P2P Commercial',
    description:
        'A secure peer-to-peer trading middleman platform that serves as a trusted intermediary between buyers and sellers. We handle payment verification and transaction approval to ensure safe and reliable P2P trading experiences.',
    keywords: [
        'P2P trading',
        'peer-to-peer marketplace',
        'secure trading',
        'payment verification',
        'transaction middleman',
        'safe trading platform',
        'buyer protection',
        'seller protection',
    ],
    authors: [{ name: 'Gunkong' }],
    openGraph: {
        title: 'Gunkong P2P Commercial - Secure Peer-to-Peer Trading',
        description:
            'A secure peer-to-peer trading middleman platform that serves as a trusted intermediary between buyers and sellers. We handle payment verification and transaction approval to ensure safe and reliable P2P trading experiences.',
        type: 'website',
    },
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
                    <CsrfProvider>
                        <AuthProvider>
                            {children}
                            <Toaster />
                        </AuthProvider>
                    </CsrfProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}

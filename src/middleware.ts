import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.') ||
        pathname === '/favicon.ico'
    ) {
        return NextResponse.next()
    }

    const publicRoutes = ['/login', '/register']
    const isPublicRoute = publicRoutes.some((route) =>
        pathname.startsWith(route)
    )

    const accessToken = request.cookies.get('access-token')?.value
    const otpSession = request.cookies.get('otp-session')?.value

    if (pathname.startsWith('/verify-otp')) {
        if (!otpSession) {
            return NextResponse.redirect(new URL('/register', request.url))
        }
        return NextResponse.next()
    }

    if (pathname.startsWith('/admin')) {
        if (!accessToken) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        return NextResponse.next()
    }

    if (!isPublicRoute && !accessToken) {
        const loginUrl = new URL('/login', request.url)
        if (pathname !== '/') {
            loginUrl.searchParams.set('redirectTo', pathname)
        }
        return NextResponse.redirect(loginUrl)
    }

    if (
        accessToken &&
        (pathname.startsWith('/login') || pathname.startsWith('/register'))
    ) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

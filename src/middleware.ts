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

    const publicRoutes = ['/login', '/register', '/test']
    const isPublicRoute = publicRoutes.some((route) =>
        pathname.startsWith(route)
    )

    const accessToken = request.cookies.get('access-token')?.value

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

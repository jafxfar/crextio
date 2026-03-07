import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { TOKEN_KEY } from '@/lib/api'

// Routes that do NOT require authentication
const PUBLIC_PATHS = ['/login', '/register', '/forgot-password']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths and Next.js internals through without a check
  const isPublic =
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(.*)$/) // static files (images, svg, etc.)

  if (isPublic) {
    return NextResponse.next()
  }

  const token = request.cookies.get(TOKEN_KEY)?.value

  if (!token) {
    const loginUrl = new URL('/login', request.url)
    // Pass the original destination so we can redirect back after login
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Run on all routes except static assets handled by Next.js automatically
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

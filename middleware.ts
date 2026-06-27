import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect HTTP to HTTPS in production
  if (process.env.NODE_ENV === 'production' && request.headers.get('x-forwarded-proto') !== 'https') {
    const httpsUrl = new URL(`https://${request.headers.get('host')}${request.url}`)
    return NextResponse.redirect(httpsUrl, 301)
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    // Allow access to login page
    if (pathname === '/admin/login') {
      return NextResponse.next()
    }

    // Check for admin session cookie
    const adminToken = request.cookies.get('cgc-admin-token')
    
    if (!adminToken) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // Validate the token with Firebase (optional, for extra security)
    // This requires server-side Firebase auth verification
    // For now, we trust the cookie exists
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}

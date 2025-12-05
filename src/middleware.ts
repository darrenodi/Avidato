import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { addSecurityHeaders } from "@/lib/security-headers"

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  
  // Get admin IP from environment (comma-separated list)
  const adminIPs = (process.env.ADMIN_IPS || '').split(',').filter(ip => ip.trim())
  const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                   request.headers.get('x-real-ip') || 
                   'unknown'

  // Check if this is admin subdomain
  const isAdminSubdomain = host.startsWith('admin.avidato.com') || host.startsWith('admin.localhost')

  if (isAdminSubdomain) {
    // IP whitelist check for admin subdomain
    // On localhost, allow if ADMIN_IPS includes 127.0.0.1 or ::1
    const isLocalhost = host.includes('localhost')
    const localhostIPs = ['127.0.0.1', '::1', 'localhost']
    const isWhitelisted = !adminIPs.length || adminIPs.includes(clientIP) || (isLocalhost && adminIPs.some(ip => localhostIPs.includes(ip)))
    
    if (!isWhitelisted) {
      return new NextResponse('Unauthorized: Your IP is not whitelisted', { status: 403 })
    }

    // Allow access to admin routes
    // Middleware will continue and check authentication in the layout
  }

  // Create response with security headers
  const response = NextResponse.next()
  
  // Add security headers
  addSecurityHeaders(response)
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) 
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
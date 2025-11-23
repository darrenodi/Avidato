import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { addSecurityHeaders } from "@/lib/security-headers"

export function middleware(request: NextRequest) {
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
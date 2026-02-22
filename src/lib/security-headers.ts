import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Security headers middleware
 * Implements OWASP security best practices
 */

export function addSecurityHeaders(response: NextResponse) {
  // Content Security Policy - prevents XSS attacks
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: http://localhost:3000",
      "media-src 'self' data: https: blob: https://*.supabase.co",
      "connect-src 'self' https://challenges.cloudflare.com https://api.github.com",
      "frame-src 'self' https://challenges.cloudflare.com https://drive.google.com https://www.youtube.com https://www.youtube-nocookie.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join('; ')
  )

  // X-Content-Type-Options - prevents MIME sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // X-Frame-Options - prevents clickjacking
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')

  // X-XSS-Protection - legacy XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Referrer-Policy - controls referrer information
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions-Policy - controls browser features
  response.headers.set(
    'Permissions-Policy',
    [
      'geolocation=()',
      'microphone=()',
      'camera=()',
      'payment=()',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()',
    ].join(', ')
  )

  // HSTS - enforce HTTPS in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }

  return response
}

/**
 * Apply security headers to all responses
 */
export function withSecurityHeaders(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    let response = await handler(request)
    
    if (!response.headers.has('Content-Security-Policy')) {
      response = addSecurityHeaders(response)
    }
    
    return response
  }
}

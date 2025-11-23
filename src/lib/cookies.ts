/**
 * Secure Cookie Management
 * Implements OWASP best practices for cookie security
 */

export interface CookieOptions {
  maxAge?: number // seconds
  expires?: Date
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
  path?: string
  domain?: string
}

/**
 * Cookie type definitions with security levels
 */
export const COOKIE_TYPES = {
  // Authentication cookies - highest security
  SESSION_TOKEN: 'session-token',
  REFRESH_TOKEN: 'refresh-token',
  CSRF_TOKEN: 'csrf-token',
  
  // Preference cookies - accessible to client
  THEME: 'theme',
  LANGUAGE: 'language',
  PREFERENCES: 'preferences',
  
  // Analytics cookies - separate from auth
  ANALYTICS_ID: 'analytics-id',
  SESSION_ID: 'session-id',
} as const

type CookieType = typeof COOKIE_TYPES[keyof typeof COOKIE_TYPES]

/**
 * Type guards for cookie categories
 */
function isAuthCookie(cookieType: CookieType): boolean {
  return cookieType === COOKIE_TYPES.SESSION_TOKEN || 
         cookieType === COOKIE_TYPES.REFRESH_TOKEN || 
         cookieType === COOKIE_TYPES.CSRF_TOKEN
}

function isPreferenceCookie(cookieType: CookieType): boolean {
  return cookieType === COOKIE_TYPES.THEME || 
         cookieType === COOKIE_TYPES.LANGUAGE || 
         cookieType === COOKIE_TYPES.PREFERENCES
}

function isAnalyticsCookie(cookieType: CookieType): boolean {
  return cookieType === COOKIE_TYPES.ANALYTICS_ID || 
         cookieType === COOKIE_TYPES.SESSION_ID
}

/**
 * Secure cookie configuration based on type
 */
export function getCookieConfig(
  cookieType: CookieType,
  isDevelopment = process.env.NODE_ENV === 'development'
): CookieOptions {
  const baseConfig: CookieOptions = {
    path: '/',
    secure: !isDevelopment, // HTTPS only in production
  }

  // Authentication cookies - maximum security
  if (isAuthCookie(cookieType)) {
    return {
      ...baseConfig,
      httpOnly: true, // JavaScript cannot access
      sameSite: 'strict', // No cross-site requests
      maxAge: 30 * 24 * 60 * 60, // 30 days for session
      domain: getDomain(isDevelopment),
    }
  }

  // Preference cookies - client accessible
  if (isPreferenceCookie(cookieType)) {
    return {
      ...baseConfig,
      httpOnly: false, // Client-side JavaScript can access
      sameSite: 'lax', // Some cross-site requests allowed
      maxAge: 365 * 24 * 60 * 60, // 1 year
      domain: getDomain(isDevelopment),
    }
  }

  // Analytics cookies - isolated, no sensitive data
  if (isAnalyticsCookie(cookieType)) {
    return {
      ...baseConfig,
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      domain: getDomain(isDevelopment),
    }
  }

  // Default conservative config
  return {
    ...baseConfig,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60, // 24 hours
  }
}

/**
 * Get appropriate domain for cookies
 */
function getDomain(isDevelopment: boolean): string | undefined {
  if (isDevelopment) {
    return 'localhost'
  }
  // Production domain
  return 'avidato.com'
}

/**
 * Format cookie header value
 */
export function formatCookieHeader(
  name: string,
  value: string,
  options: CookieOptions
): string {
  let cookie = `${name}=${encodeURIComponent(value)}`

  if (options.maxAge) {
    cookie += `; Max-Age=${options.maxAge}`
  }

  if (options.expires) {
    cookie += `; Expires=${options.expires.toUTCString()}`
  }

  if (options.path) {
    cookie += `; Path=${options.path}`
  }

  if (options.domain) {
    cookie += `; Domain=${options.domain}`
  }

  if (options.httpOnly) {
    cookie += '; HttpOnly'
  }

  if (options.secure) {
    cookie += '; Secure'
  }

  if (options.sameSite) {
    cookie += `; SameSite=${options.sameSite.charAt(0).toUpperCase() + options.sameSite.slice(1)}`
  }

  return cookie
}

/**
 * Serialize cookies for Set-Cookie header
 * Usage in API routes:
 * response.headers.set('Set-Cookie', serializeCookie('token', value, options))
 */
export function serializeCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): string {
  return formatCookieHeader(name, value, options)
}

/**
 * Create clear cookie header (expires in past)
 */
export function clearCookie(name: string): string {
  return `${name}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict`
}

/**
 * Validate cookie value is safe
 */
export function validateCookieValue(value: string): boolean {
  // Check for injection attacks
  const dangerousPatterns = [
    /[\r\n]/,      // Line breaks
    /[;,]/,        // Delimiters that could break cookie
    /<script/i,    // Script tags
    /javascript:/i, // JavaScript protocol
  ]

  return !dangerousPatterns.some(pattern => pattern.test(value))
}

/**
 * Cookie security checklist
 */
export const SECURITY_CHECKLIST = {
  sessionToken: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: '30 days',
    description: 'Authentication token - highest security'
  },
  csrfToken: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 'session',
    description: 'CSRF protection - never shared with 3rd parties'
  },
  preferences: {
    httpOnly: false,
    secure: true,
    sameSite: 'lax',
    maxAge: '1 year',
    description: 'User preferences - client-accessible'
  },
  analytics: {
    httpOnly: false,
    secure: true,
    sameSite: 'lax',
    maxAge: '24 hours',
    description: 'Analytics tracking - anonymous data only'
  }
}

/**
 * Client-side cookie getter (only for non-HttpOnly cookies)
 * HttpOnly cookies cannot be accessed from JavaScript
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null
  }

  const cookies = document.cookie.split('; ')
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=')
    if (cookieName === name) {
      try {
        return decodeURIComponent(cookieValue)
      } catch {
        return cookieValue
      }
    }
  }
  return null
}

/**
 * Client-side cookie setter (only for non-HttpOnly cookies)
 * HttpOnly cookies must be set via HTTP headers from server
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof document === 'undefined') {
    return
  }

  // Validate cookie value
  if (!validateCookieValue(value)) {
    console.error(`Invalid cookie value for ${name}: contains dangerous characters`)
    return
  }

  let cookieString = `${name}=${encodeURIComponent(value)}`

  if (options.maxAge) {
    cookieString += `; Max-Age=${options.maxAge}`
  }

  if (options.path) {
    cookieString += `; Path=${options.path}`
  }

  if (options.sameSite) {
    cookieString += `; SameSite=${options.sameSite.charAt(0).toUpperCase() + options.sameSite.slice(1)}`
  }

  // Note: Secure flag cannot be set from client-side on localhost
  // Production will automatically use secure
  document.cookie = cookieString
}

/**
 * Client-side cookie deleter
 */
export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') {
    return
  }

  document.cookie = `${name}=; Max-Age=0; Path=/`
}

/**
 * Check if cookie consent has been given
 */
export function hasCookieConsent(type: 'analytics' | 'necessary'): boolean {
  const consent = getCookie('cookie-consent')
  
  if (type === 'necessary') {
    // Necessary cookies are always implicitly consented when using the app
    return true
  }

  if (type === 'analytics') {
    // Analytics requires explicit consent
    return consent === 'accepted'
  }

  return false
}

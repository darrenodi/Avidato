import {
  getCookieConfig,
  serializeCookie,
  clearCookie,
  validateCookieValue,
  COOKIE_TYPES,
  formatCookieHeader,
} from '@/lib/cookies'

describe('Cookie Security Utilities', () => {
  describe('getCookieConfig', () => {
    it('should return maximum security config for session tokens', () => {
      const config = getCookieConfig(COOKIE_TYPES.SESSION_TOKEN, true)
      
      expect(config.httpOnly).toBe(true)
      expect(config.sameSite).toBe('strict')
      expect(config.path).toBe('/')
      expect(config.secure).toBe(false) // Development
      expect(config.maxAge).toBe(30 * 24 * 60 * 60)
    })

    it('should set secure flag in production for auth cookies', () => {
      const config = getCookieConfig(COOKIE_TYPES.SESSION_TOKEN, false)
      
      expect(config.secure).toBe(true)
    })

    it('should allow client access for preference cookies', () => {
      const config = getCookieConfig(COOKIE_TYPES.THEME, true)
      
      expect(config.httpOnly).toBe(false)
      expect(config.sameSite).toBe('lax')
      expect(config.maxAge).toBe(365 * 24 * 60 * 60)
    })

    it('should restrict analytics cookies to 24 hours', () => {
      const config = getCookieConfig(COOKIE_TYPES.ANALYTICS_ID, true)
      
      expect(config.maxAge).toBe(24 * 60 * 60)
      expect(config.httpOnly).toBe(false)
    })

    it('should use localhost domain in development', () => {
      const config = getCookieConfig(COOKIE_TYPES.SESSION_TOKEN, true)
      
      expect(config.domain).toBe('localhost')
    })

    it('should use avidato.com domain in production', () => {
      const config = getCookieConfig(COOKIE_TYPES.SESSION_TOKEN, false)
      
      expect(config.domain).toBe('avidato.com')
    })
  })

  describe('formatCookieHeader', () => {
    it('should format a complete cookie header', () => {
      const header = formatCookieHeader('session', 'abc123', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 3600,
        path: '/',
      })

      expect(header).toContain('session=abc123')
      expect(header).toContain('HttpOnly')
      expect(header).toContain('Secure')
      expect(header).toContain('SameSite=Strict')
      expect(header).toContain('Max-Age=3600')
      expect(header).toContain('Path=/')
    })

    it('should encode cookie values', () => {
      const header = formatCookieHeader('test', 'value with spaces', {})
      
      expect(header).toContain('value%20with%20spaces')
    })
  })

  describe('serializeCookie', () => {
    it('should serialize a cookie with options', () => {
      const cookie = serializeCookie('token', 'xyz789', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 86400,
      })

      expect(cookie).toContain('token=xyz789')
      expect(cookie).toContain('HttpOnly')
      expect(cookie).toContain('Secure')
      expect(cookie).toContain('SameSite=Strict')
    })

    it('should use default options if not provided', () => {
      const cookie = serializeCookie('simple', 'value')
      
      expect(cookie).toContain('simple=value')
    })
  })

  describe('clearCookie', () => {
    it('should create a cookie expiration header', () => {
      const header = clearCookie('session')
      
      expect(header).toContain('session=')
      expect(header).toContain('Max-Age=0')
      expect(header).toContain('HttpOnly')
      expect(header).toContain('Secure')
    })
  })

  describe('validateCookieValue', () => {
    it('should accept valid cookie values', () => {
      expect(validateCookieValue('abc123')).toBe(true)
      expect(validateCookieValue('token_xyz-789')).toBe(true)
      expect(validateCookieValue('uuid-550e8400-e29b-41d4')).toBe(true)
    })

    it('should reject values with line breaks', () => {
      expect(validateCookieValue('value\ninjection')).toBe(false)
      expect(validateCookieValue('value\rinjection')).toBe(false)
    })

    it('should reject values with dangerous delimiters', () => {
      expect(validateCookieValue('value;injection')).toBe(false)
      expect(validateCookieValue('value,injection')).toBe(false)
    })

    it('should reject values with script tags', () => {
      expect(validateCookieValue('<script>alert("xss")</script>')).toBe(false)
      expect(validateCookieValue('value<script>test</script>')).toBe(false)
    })

    it('should reject values with javascript protocol', () => {
      expect(validateCookieValue('javascript:alert("xss")')).toBe(false)
      expect(validateCookieValue('JAVASCRIPT:void(0)')).toBe(false)
    })
  })

  describe('Security Best Practices', () => {
    it('should never allow HttpOnly + client access compromise', () => {
      const authConfig = getCookieConfig(COOKIE_TYPES.SESSION_TOKEN)
      const prefConfig = getCookieConfig(COOKIE_TYPES.THEME)

      // Auth cookies should always be HttpOnly
      expect(authConfig.httpOnly).toBe(true)
      
      // Preference cookies should never be HttpOnly
      expect(prefConfig.httpOnly).toBe(false)
    })

    it('should use strict SameSite for auth cookies', () => {
      const authConfig = getCookieConfig(COOKIE_TYPES.SESSION_TOKEN)
      
      expect(authConfig.sameSite).toBe('strict')
    })

    it('should use lax SameSite for non-sensitive cookies', () => {
      const prefConfig = getCookieConfig(COOKIE_TYPES.THEME)
      const analyticsConfig = getCookieConfig(COOKIE_TYPES.ANALYTICS_ID)

      expect(prefConfig.sameSite).toBe('lax')
      expect(analyticsConfig.sameSite).toBe('lax')
    })

    it('should enforce secure flag for production auth cookies', () => {
      // Development (isDevelopment = true)
      const devConfig = getCookieConfig(COOKIE_TYPES.SESSION_TOKEN, true)
      expect(devConfig.secure).toBe(false)

      // Production (isDevelopment = false)
      const prodConfig = getCookieConfig(COOKIE_TYPES.SESSION_TOKEN, false)
      expect(prodConfig.secure).toBe(true)
    })
  })

  describe('Cookie Type Segregation', () => {
    it('should segregate auth, preferences, and analytics', () => {
      const authConfig = getCookieConfig(COOKIE_TYPES.SESSION_TOKEN)
      const prefConfig = getCookieConfig(COOKIE_TYPES.THEME)
      const analyticsConfig = getCookieConfig(COOKIE_TYPES.ANALYTICS_ID)

      // Auth: maximum security
      expect(authConfig.httpOnly).toBe(true)
      expect(authConfig.sameSite).toBe('strict')

      // Preferences: client accessible
      expect(prefConfig.httpOnly).toBe(false)
      expect(prefConfig.sameSite).toBe('lax')

      // Analytics: client accessible, short-lived
      expect(analyticsConfig.httpOnly).toBe(false)
      expect(analyticsConfig.maxAge).toBe(24 * 60 * 60)
    })
  })
})

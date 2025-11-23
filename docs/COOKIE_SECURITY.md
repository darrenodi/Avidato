# Secure Cookie Implementation Guide

## Overview

This document outlines the secure cookie implementation for Avidato following OWASP best practices.

## Cookie Types

### 1. **Necessary Cookies** (Always Enabled)
- **Session Token** (`next-auth.session-token`)
  - Stores JWT authentication token
  - HttpOnly, Secure, SameSite=Strict
  - 30-day expiration
  - Cannot be accessed via JavaScript

- **CSRF Token** (`next-auth.csrf-token`)
  - Prevents Cross-Site Request Forgery attacks
  - HttpOnly, Secure, SameSite=Strict
  - Session-based expiration
  - __Host- prefix in production (strictest)

### 2. **Analytics Cookies** (Opt-In)
- User must explicitly consent via cookie banner
- Only used if `cookie-consent=accepted`
- 24-hour expiration
- No sensitive user data stored
- Accessible to client-side JavaScript

## Security Features

### HttpOnly Flag
Prevents JavaScript from accessing cookies, mitigating XSS attacks.

```typescript
// Secure
next-auth.session-token: HttpOnly ✓

// Not protected by HttpOnly (preference cookies)
theme: HttpOnly ✗ (intentional - client needs access)
```

### Secure Flag
Ensures cookies only transmit over HTTPS in production.

```
Development: secure = false (allows HTTP on localhost)
Production: secure = true (HTTPS only)
```

### SameSite Attribute
Prevents CSRF attacks by restricting cross-site cookie sending.

```
Auth cookies: SameSite=Strict (no cross-site)
Preference cookies: SameSite=Lax (limited cross-site)
```

### Domain & Path
Restricts cookies to specific domains and paths.

```
Domain: localhost (dev) | avidato.com (prod)
Path: / (applies to all routes)
```

## Implementation

### Client-Side Cookie Management

```typescript
import { getCookie, setCookie, deleteCookie } from '@/lib/cookies'

// Get a preference cookie
const theme = getCookie('theme')

// Set a preference cookie
setCookie('theme', 'dark', {
  maxAge: 365 * 24 * 60 * 60, // 1 year
  path: '/',
  sameSite: 'lax',
})

// Delete a cookie
deleteCookie('theme')
```

### Server-Side Cookie Management

```typescript
import { serializeCookie, clearCookie, getCookieConfig } from '@/lib/cookies'

// In API route
export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true })
  
  // Set secure auth cookie
  const cookieHeader = serializeCookie(
    'auth-token',
    token,
    getCookieConfig('SESSION_TOKEN')
  )
  response.headers.set('Set-Cookie', cookieHeader)
  
  // Clear cookie
  response.headers.append('Set-Cookie', clearCookie('old-token'))
  
  return response
}
```

## Cookie Consent Banner

The cookie consent banner appears on the homepage and offers two options:

1. **Only Necessary** - Disables analytics cookies
2. **Accept All Cookies** - Enables both necessary and analytics cookies

User's choice is stored in `cookie-consent` cookie for 1 year.

## Checking Cookie Consent

```typescript
import { hasCookieConsent } from '@/lib/cookies'

// Check if analytics cookies allowed
if (hasCookieConsent('analytics')) {
  // Track user analytics
  trackEvent('page_view')
}

// Necessary cookies always return true (no consent needed)
if (hasCookieConsent('necessary')) {
  // Always true
}
```

## Production Checklist

- [ ] Change `TURNSTILE_HOSTNAME` in `.env` from `localhost` to `avidato.com`
- [ ] Verify `NODE_ENV=production` is set
- [ ] Test cookie transmission over HTTPS only
- [ ] Verify HttpOnly cookies are inaccessible via DevTools
- [ ] Monitor for cookie-related errors in production logs
- [ ] Set up analytics only if user consented
- [ ] Review Privacy Policy includes cookie information

## Testing

### Browser DevTools
1. Open DevTools → Application → Cookies
2. Verify auth cookies have:
   - ✓ HttpOnly checked
   - ✓ Secure checked (production only)
   - ✓ SameSite=Strict

### Curl Command
```bash
curl -v http://localhost:3000/login 2>&1 | grep -i set-cookie
```

### Jest Tests
```bash
npm test -- src/lib/cookies.test.ts
```

## Security Best Practices

❌ **Never**
- Store sensitive data in preference cookies
- Use cookies for CSRF tokens without HttpOnly
- Store passwords or API keys in cookies
- Trust client-side cookie validation

✅ **Always**
- Use HttpOnly for auth tokens
- Use Secure flag in production
- Use SameSite attribute
- Validate cookies server-side
- Rotate tokens on privilege escalation
- Clear cookies on logout

## References

- [OWASP: Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [MDN: HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [RFC 6265: HTTP State Management Mechanism](https://tools.ietf.org/html/rfc6265)
- [OWASP: CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

## Troubleshooting

### Issue: Cookie not being set
- [ ] Check if domain matches (localhost vs avidato.com)
- [ ] Verify path is correct
- [ ] Check browser's cookie settings
- [ ] Ensure HTTPS in production (if Secure flag set)

### Issue: HttpOnly cookie visible in console
- [ ] This should not happen - HttpOnly prevents this
- [ ] If you see it, the cookie was not set with HttpOnly
- [ ] Check Set-Cookie header in Network tab

### Issue: Cookie persistence issues
- [ ] Check Max-Age or Expires values
- [ ] Verify domain/path match request
- [ ] Clear browser cache and try again

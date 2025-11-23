# Secure Cookie Implementation

## Overview

This document outlines the comprehensive cookie security implementation following OWASP best practices and industry standards.

## Cookie Types & Security Levels

### 1. Authentication Cookies (Maximum Security)
- **Names**: `next-auth.session-token`, `next-auth.refresh-token`, `next-auth.csrf-token`
- **Access**: Server-side only (HttpOnly)
- **Transmission**: HTTPS only (Secure flag)
- **Cross-site**: Disabled (SameSite=Strict)
- **Lifespan**: 30 days (session-token), 7 days (refresh-token)
- **Domain**: Restricted to avidato.com (production) or localhost (development)
- **Purpose**: Authentication and CSRF protection

```typescript
// Example: Session token
{
  name: '__Secure-next-auth.session-token',
  options: {
    httpOnly: true,      // ✅ JavaScript cannot access
    sameSite: 'strict',  // ✅ No cross-site requests
    secure: true,        // ✅ HTTPS only
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  }
}
```

### 2. Preference Cookies (Client-Accessible)
- **Names**: `theme`, `language`, `preferences`
- **Access**: Client-side accessible (no HttpOnly)
- **Transmission**: HTTPS only (Secure flag)
- **Cross-site**: Limited (SameSite=Lax)
- **Lifespan**: 1 year
- **Domain**: Avidato.com
- **Purpose**: Store user preferences

```typescript
// Example: Theme preference
{
  name: 'theme',
  options: {
    httpOnly: false,     // ✅ JavaScript can access
    sameSite: 'lax',     // ⚠️ Some cross-site requests allowed
    secure: true,        // ✅ HTTPS only
    path: '/',
    maxAge: 365 * 24 * 60 * 60,
  }
}
```

### 3. Analytics Cookies (Anonymous Data Only)
- **Names**: `analytics-id`, `session-id`
- **Access**: Client-side accessible
- **Transmission**: HTTPS only
- **Cross-site**: Limited (SameSite=Lax)
- **Lifespan**: 24 hours
- **Domain**: Avidato.com
- **Purpose**: Usage tracking (NO personal data)
- **Constraint**: Must never contain user email, name, or sensitive identifiers

```typescript
// Example: Analytics cookie (random UUID only)
{
  name: 'analytics-id',
  value: '550e8400-e29b-41d4-a716-446655440000', // UUID only
  options: {
    httpOnly: false,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 24 * 60 * 60,
  }
}
```

## Implementation Examples

### Setting a Secure Cookie

```typescript
import { getCookieConfig, serializeCookie, COOKIE_TYPES } from '@/lib/cookies'

// In an API route
const cookieConfig = getCookieConfig(COOKIE_TYPES.SESSION_TOKEN)
const cookieHeader = serializeCookie('session-token', 'token-value-here', cookieConfig)

response.headers.set('Set-Cookie', cookieHeader)
```

### Clearing a Cookie

```typescript
import { clearCookie } from '@/lib/cookies'

response.headers.set('Set-Cookie', clearCookie('session-token'))
```

### Client-Side Preference Cookie

```typescript
import { getCookieConfig, COOKIE_TYPES } from '@/lib/cookies'

// In client component - no HttpOnly
const config = getCookieConfig(COOKIE_TYPES.THEME)
document.cookie = `theme=dark; ${formatCookieString(config)}`
```

## Security Headers

All responses include comprehensive security headers:

- **Content-Security-Policy (CSP)**: Prevents XSS attacks
- **X-Content-Type-Options**: Prevents MIME sniffing
- **X-Frame-Options**: Prevents clickjacking
- **X-XSS-Protection**: Legacy XSS protection
- **Referrer-Policy**: Controls referrer leaking
- **Permissions-Policy**: Disables unnecessary browser features
- **Strict-Transport-Security (HSTS)**: Enforces HTTPS in production

## Cookie Rotation & Expiration

### Session Token Rotation
- Issued on login
- Refreshed on every API call (optional)
- Expired on logout
- Max age: 30 days

### CSRF Token Rotation
- Issued on every page load (managed by NextAuth)
- Must validate on POST/PUT/DELETE requests
- Cannot be accessed by JavaScript (HttpOnly)

### Refresh Token Strategy
- Issued on login
- 7-day expiration
- Used to obtain new session tokens
- Stored in HttpOnly cookie
- Never exposed to JavaScript

## Validation & Safety

### Cookie Value Validation
All cookie values are validated to prevent injection attacks:
- ✅ No line breaks (\r, \n)
- ✅ No special delimiters (;, ,)
- ✅ No script tags or JavaScript protocols
- ✅ No sensitive data in plain text

```typescript
import { validateCookieValue } from '@/lib/cookies'

if (!validateCookieValue(userInput)) {
  throw new Error('Invalid cookie value')
}
```

## Best Practices

### DO:
- ✅ Always use HttpOnly for authentication cookies
- ✅ Use Secure flag in production (HTTPS only)
- ✅ Set SameSite=Strict for sensitive operations
- ✅ Validate all cookie values before setting
- ✅ Clear cookies on logout
- ✅ Use appropriate expiration times
- ✅ Segregate auth from preferences/analytics

### DON'T:
- ❌ Store passwords in cookies (use hashed tokens)
- ❌ Store sensitive user data in cookies
- ❌ Use cookies without Secure flag in production
- ❌ Set sameSite=None unless absolutely necessary
- ❌ Store plain text PII (Personally Identifiable Information)
- ❌ Allow JavaScript access to auth tokens
- ❌ Forget to clear cookies on logout

## Testing Cookie Security

### Browser DevTools
1. Open DevTools → Application → Cookies
2. Verify auth cookies have:
   - ✅ HttpOnly flag
   - ✅ Secure flag (production)
   - ✅ SameSite=Strict
3. Verify preference cookies:
   - ✅ No HttpOnly (client accessible)
   - ✅ SameSite=Lax

### Command Line Testing
```bash
# Check cookies with curl (development)
curl -v http://localhost:3000/api/auth/login

# Check security headers
curl -v http://localhost:3000 | grep -i "content-security-policy"
```

### OWASP Top 10 Compliance
- ✅ A01:2021 - Broken Access Control (HttpOnly auth cookies)
- ✅ A02:2021 - Cryptographic Failures (Secure flag, HSTS)
- ✅ A03:2021 - Injection (CSP prevents XSS)
- ✅ A05:2021 - Broken Access Control (SameSite CSRF protection)
- ✅ A07:2021 - Identification and Authentication Failures (Session management)

## Migration Guide

### From Old Implementation
If migrating from an older cookie setup:

1. Backup existing cookies
2. Update NextAuth config to use new cookie types
3. Set both old and new cookie names temporarily for compatibility
4. Gradually remove old cookie names after user sessions expire
5. Clear old cookies on next login

```typescript
// Temporary compatibility layer
const legacyToken = getLegacyCookie('old-token-name')
if (legacyToken && !hasNewCookie()) {
  migrateToNewCookie(legacyToken)
}
```

## Monitoring & Logging

### Security Events to Log
- ❌ Failed CSRF token validation
- ❌ Cookie tampering attempts
- ⚠️ Unusually long cookie lifespan
- ⚠️ Cookies sent over HTTP (production)

### Metrics to Monitor
- Cookie expiration distribution
- CSRF token validation success rate
- HttpOnly violation attempts
- Cross-site cookie access attempts

## References

- [OWASP Cookie Security](https://owasp.org/www-community/controls/Cookie_Security)
- [RFC 6265 - HTTP State Management Mechanism](https://tools.ietf.org/html/rfc6265)
- [SameSite Cookie Explained](https://web.dev/samesite-cookies-explained/)
- [Mozilla: Set-Cookie Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

## Checklist for Future Development

- [ ] Review cookie usage before adding new features
- [ ] Validate all user-controlled data in cookies
- [ ] Test with browser security tools
- [ ] Audit cookies quarterly
- [ ] Monitor security headers compliance
- [ ] Update SameSite policy if needed
- [ ] Rotate refresh tokens regularly
- [ ] Test with OWASP ZAP
- [ ] Document any custom cookie handling
- [ ] Ensure analytics cookies don't contain PII

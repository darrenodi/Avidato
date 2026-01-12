# Cloudflare Turnstile CAPTCHA Setup

## Environment Variables

Add these to your `.env.local` file:

```
# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key_here
TURNSTILE_SECRET_KEY=your_secret_key_here
TURNSTILE_HOSTNAME=avidato.com
```

## Getting Credentials

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to "Turnstile" → "Sites"
3. Click "Create Site"
4. Fill in details:
   - Site name: "Avidato"
   - Domains: `avidato.com` and `localhost` (for development)
   - Widget mode: Managed
   - Bot fight mode: Super Bot Fight Mode (Recommended)
5. Copy the Site Key and Secret Key

## Security Architecture

### Client-Side
- Turnstile widget renders on login/signup pages
- User completes challenge before submission
- Token submitted with credentials

### Server-Side
1. **Token Verification**: Every token verified with Cloudflare API
2. **Rate Limiting**: Per-user, per-IP limiting on failed attempts
3. **Replay Detection**: Tokens can only be used once
4. **IP Tracking**: Monitor suspicious patterns
5. **Timeout**: Tokens expire quickly (5 minutes)

### Protected Endpoints
- `POST /api/auth/login` - Login with CAPTCHA verification
- `POST /api/auth/signup` - Signup with CAPTCHA verification
- `POST /api/lessons/generate` - AI lesson generation (rate limited)
- `POST /api/lessons/grammar` - Grammar analysis (rate limited)
- `POST /api/lessons/[id]/share` - Lesson sharing (rate limited)

## Rate Limiting Strategy

### Login/Signup
- **Max attempts**: 5 failed attempts
- **Window**: 15 minutes
- **Block duration**: 30 minutes
- **Identifier**: `email:ip_address`

### API Operations
- **Per-user limits** prevent abuse of expensive operations
- **Turnstile tokens optional** for authenticated users but required for suspicious activity

## Testing

### Development
1. CAPTCHA widget works in localhost
2. Test with dummy credentials
3. Observe rate limiting after 5 failures
4. Check console for verification logs

### Production
1. Update domains in Cloudflare to production URL
2. Use strong Secret Key (rotate regularly)
3. Monitor rate limit violations
4. Set up alerts for suspicious patterns

## Security Best Practices Implemented

✅ **Server-side verification only** - Never trust client tokens
✅ **Replay attack prevention** - Tokens cannot be reused
✅ **Rate limiting** - Prevents brute force
✅ **IP tracking** - Combined with email for better accuracy
✅ **Environment secrets** - Keys never exposed to client
✅ **Token expiration** - Short TTL reduces attack window
✅ **Hostname verification** - Prevents token use from other sites
✅ **Comprehensive logging** - Track all verification attempts

## Future Enhancements

1. **Redis rate limiting** - Replace in-memory for scalability
2. **Webhook notifications** - Alert on suspicious patterns
3. **Bot detection** - Use Turnstile bot score for additional filtering
4. **Geographic blocking** - Optional: block login attempts from specific regions
5. **Device fingerprinting** - Track repeat offenders
6. **API abuse monitoring** - Implement adaptive rate limits

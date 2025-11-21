/**
 * Cloudflare Turnstile Verification
 * Server-side token validation with security best practices
 */

interface TurnstileVerifyResponse {
  success: boolean
  challenge_ts?: string
  hostname?: string
  error_codes?: string[]
  'error-codes'?: string[]
}

interface TurnstileValidationResult {
  success: boolean
  error?: string
  isReplay?: boolean
  timestamp?: Date
}

/**
 * Verify Turnstile token on the server
 * NEVER trust client-side validation
 */
export async function verifyTurnstileToken(
  token: string,
  remoteIP?: string
): Promise<TurnstileValidationResult> {
  try {
    if (!token) {
      return { success: false, error: 'Token required' }
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY
    if (!secretKey) {
      console.error('TURNSTILE_SECRET_KEY not configured')
      return { success: false, error: 'CAPTCHA service misconfigured' }
    }

    // Call Cloudflare Turnstile verification API
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
        remoteip: remoteIP, // Optional: IP of the user
      }),
    })

    if (!response.ok) {
      console.error('Turnstile API error:', response.status)
      return { success: false, error: 'Verification service error' }
    }

    const data = (await response.json()) as TurnstileVerifyResponse

    // Check for success
    if (!data.success) {
      const errors = data['error-codes'] || data.error_codes || []
      
      // Detect replay attacks
      if (errors.includes('token_already_spent')) {
        return {
          success: false,
          error: 'Token already used',
          isReplay: true,
        }
      }

      return {
        success: false,
        error: `Verification failed: ${errors.join(', ')}`,
      }
    }

    // Additional security: Verify hostname matches expected domain
    const expectedHostname = process.env.TURNSTILE_HOSTNAME || 'avidato.com'
    if (data.hostname) {
      // Support flexible hostname matching (localhost, avidato.com, etc.)
      const hostnames = expectedHostname.split(',').map(h => h.trim())
      const isValidHost = hostnames.some(host => 
        data.hostname?.includes(host) || data.hostname === host
      )
      
      if (!isValidHost) {
        console.warn(`Hostname mismatch: expected one of [${hostnames.join(', ')}], got ${data.hostname}`)
        return { success: false, error: 'Hostname verification failed' }
      }
    }

    return {
      success: true,
      timestamp: data.challenge_ts ? new Date(data.challenge_ts) : undefined,
    }
  } catch (error) {
    console.error('Turnstile verification error:', error)
    return { success: false, error: 'Verification failed' }
  }
}

/**
 * Rate limit helper to prevent brute force
 * Store attempts in memory (or use Redis in production)
 */
interface RateLimitEntry {
  attempts: number
  firstAttempt: number
  blocked: boolean
}

const rateLimitMap = new Map<string, RateLimitEntry>()

const RATE_LIMIT_CONFIG = {
  maxAttempts: 5, // Max failed attempts
  windowMs: 15 * 60 * 1000, // 15 minute window
  blockDurationMs: 30 * 60 * 1000, // Block for 30 minutes
}

export function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = rateLimitMap.get(identifier)

  // Clean up old entries
  if (entry && now - entry.firstAttempt > RATE_LIMIT_CONFIG.windowMs) {
    rateLimitMap.delete(identifier)
    return { allowed: true, remaining: RATE_LIMIT_CONFIG.maxAttempts }
  }

  // Check if blocked
  if (entry && entry.blocked && now - entry.firstAttempt < RATE_LIMIT_CONFIG.blockDurationMs) {
    return { allowed: false, remaining: 0 }
  }

  // Check if exceeded limit
  if (entry && entry.attempts >= RATE_LIMIT_CONFIG.maxAttempts) {
    entry.blocked = true
    return { allowed: false, remaining: 0 }
  }

  const remaining = RATE_LIMIT_CONFIG.maxAttempts - (entry?.attempts || 0)
  return { allowed: true, remaining }
}

export function recordFailedAttempt(identifier: string): void {
  const now = Date.now()
  const entry = rateLimitMap.get(identifier)

  if (!entry) {
    rateLimitMap.set(identifier, {
      attempts: 1,
      firstAttempt: now,
      blocked: false,
    })
  } else {
    entry.attempts += 1
    if (entry.attempts >= RATE_LIMIT_CONFIG.maxAttempts) {
      entry.blocked = true
    }
  }
}

export function clearRateLimit(identifier: string): void {
  rateLimitMap.delete(identifier)
}

/* eslint-disable react/no-unescaped-entities */
'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import { signIn, getSession, useSession, signOut } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

// Extend window to include Turnstile
declare global {
  interface Window {
    turnstile: {
      render: (selector: string, options: Record<string, unknown>) => string
      remove: (widgetId: string) => void
      reset: (widgetId: string) => void
      getResponse: (widgetId: string) => string | undefined
    }
  }
}

function LoginPageContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [turnstileWidgetId, setTurnstileWidgetId] = useState<string>('')
  const [turnstileError, setTurnstileError] = useState('')
  const turnstileRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()

  // Check if user was redirected here after logout
  const fromLogout = searchParams.get('logout') === 'true'

  // Load and render Turnstile widget - only once
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (turnstileWidgetId) return // Already rendered

    const renderWidget = () => {
      if (!window.turnstile || !turnstileRef.current) return

      try {
        // Clear any existing widget in container first
        const container = turnstileRef.current
        if (container?.hasChildNodes()) {
          container.innerHTML = ''
        }

        const widgetId = window.turnstile.render('#turnstile-widget', {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
          theme: 'light',
          size: 'normal',
        })
        setTurnstileWidgetId(widgetId)
      } catch (err) {
        console.error('Turnstile render error:', err)
      }
    }

    // Check if Turnstile script already exists
    if (document.querySelector('script[src*="turnstile"]')) {
      // Script exists, wait for window.turnstile to be available
      if (window.turnstile) {
        renderWidget()
      } else {
        // Poll until Turnstile is available
        const checkTurnstile = setInterval(() => {
          if (window.turnstile) {
            clearInterval(checkTurnstile)
            renderWidget()
          }
        }, 50)
        return () => clearInterval(checkTurnstile)
      }
      return
    }

    // Load script if not present
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true

    script.onload = () => {
      setTimeout(renderWidget, 100)
    }

    script.onerror = () => {
      console.error('Failed to load Turnstile script')
    }

    document.head.appendChild(script)

    return () => {
      // Cleanup: remove widget on unmount
      if (turnstileWidgetId && window.turnstile) {
        try {
          window.turnstile.remove(turnstileWidgetId)
        } catch (err) {
          console.error('Error removing widget:', err)
        }
      }
    }
  }, [turnstileWidgetId])

  // Clear session if coming from logout or force logout parameter
  useEffect(() => {
    if (fromLogout && session) {
      signOut({ redirect: false })
      return
    }
  }, [fromLogout, session])

  // Redirect to dashboard if already logged in (and not coming from logout)
  useEffect(() => {
    if (status === 'loading') return // Still loading
    
    if (session && !fromLogout) {
      const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
      router.push(callbackUrl)
    }
  }, [session, status, router, fromLogout, searchParams])

  // Show loading while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render login form if already logged in
  if (session) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Get Turnstile token
      if (!window.turnstile || !turnstileWidgetId) {
        setError('CAPTCHA not ready. Please try again.')
        setIsLoading(false)
        return
      }

      const turnstileToken = window.turnstile.getResponse(turnstileWidgetId)
      if (!turnstileToken) {
        setError('Please complete the CAPTCHA verification')
        setIsLoading(false)
        return
      }

      // Send login request with Turnstile token to our API
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          turnstileToken,
        }),
      })

      const loginData = await loginResponse.json()

      if (!loginResponse.ok) {
        if (loginData.captchaError) {
          setError(loginData.captchaError)
          // Reset Turnstile for retry
          window.turnstile.reset(turnstileWidgetId)
        } else if (loginData.rateLimited) {
          setError('Too many failed attempts. Please try again later.')
        } else {
          setError(loginData.error || 'Login failed')
        }
        setIsLoading(false)
        return
      }

      // Use NextAuth signIn with the validated token
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid credentials')
        window.turnstile.reset(turnstileWidgetId)
      } else if (result?.ok) {
        setTimeout(async () => {
          const session = await getSession()
          if (session) {
            const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
            router.push(callbackUrl)
          } else {
            setError('Session not established. Please try again.')
          }
        }, 500)
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setIsLoading(true)

    try {
      // Get Turnstile token for Google sign-in too
      if (!window.turnstile || !turnstileWidgetId) {
        setError('CAPTCHA not ready. Please try again.')
        setIsLoading(false)
        return
      }

      const turnstileToken = window.turnstile.getResponse(turnstileWidgetId)
      if (!turnstileToken) {
        setError('Please complete the CAPTCHA verification')
        setIsLoading(false)
        return
      }

      // Verify CAPTCHA before allowing Google sign-in
      const captchaResponse = await fetch('/api/auth/verify-captcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          turnstileToken,
        }),
      })

      const captchaData = await captchaResponse.json()

      if (!captchaResponse.ok || !captchaData.success) {
        setError('CAPTCHA verification failed. Please try again.')
        window.turnstile.reset(turnstileWidgetId)
        setIsLoading(false)
        return
      }

      // CAPTCHA verified, clear any existing auth state before signing in
      if (typeof window !== 'undefined') {
        // Clear Google-specific cookies/storage that might cache the account
        const cookies = document.cookie.split(";")
        cookies.forEach(cookie => {
          const eqPos = cookie.indexOf("=")
          const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
          if (name.startsWith('__Secure-') || name.includes('google') || name.includes('oauth')) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
          }
        })
      }

      // Force Google to show account picker
      setIsLoading(false)
      await signIn('google', { 
        callbackUrl: '/dashboard',
        prompt: 'select_account'
      })
    } catch {
      setError('Failed to sign in with Google. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Sign in with your email and password, or use Google
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Cloudflare Turnstile Widget */}
            <div className="flex justify-center">
              <div id="turnstile-widget" ref={turnstileRef} />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link href="/auth/forgot-password" className="font-medium text-brand-primary hover:text-brand-accent dark:text-brand-secondary dark:hover:text-brand-primary">
                  Forgot password?
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link href="/signup" className="font-medium text-brand-primary hover:text-brand-accent dark:text-brand-secondary dark:hover:text-brand-primary">
                  Sign up here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

export function VerificationBanner() {
  const { data: session, update: updateSession } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [canResend, setCanResend] = useState(true)
  const [resendCountdown, setResendCountdown] = useState(0)
  const [verificationProcessed, setVerificationProcessed] = useState(false)
  const [showBanner, setShowBanner] = useState(false)

  // Check if user just verified their email via URL param
  useEffect(() => {
    if (searchParams.get('verified') === 'true' && !verificationProcessed) {
      setVerificationProcessed(true)
      setSuccess(true)
      // Refresh session to update emailVerified status
      const refreshSession = async () => {
        await updateSession()
        // Wait a moment for session to update, then remove the verified param
        setTimeout(() => {
          router.replace('/dashboard')
        }, 500)
      }
      refreshSession()
    }
  }, [searchParams, updateSession, router, verificationProcessed])

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (resendCountdown === 0 && !canResend) {
      setCanResend(true)
    }
  }, [resendCountdown, canResend])

  // Auto-hide success banner after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  // Show banner after 30 seconds (allows background verification check)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBanner(true)
    }, 30000) // 30 seconds
    return () => clearTimeout(timer)
  }, [])

  // Show success banner first (before checking if email is verified)
  if (success) {
    return (
      <div className="fixed top-0 left-64 right-0 lg:left-64 z-50 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800 p-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Email verified successfully! Welcome to Avidato!
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show banner if user's email is not verified AND 30 seconds have passed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isEmailVerified = (session?.user as any)?.emailVerified || session?.user?.image // Google users have image set immediately
  
  if (!showBanner || !session?.user?.email || isEmailVerified) {
    return null
  }

  const handleResendVerification = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/resend-verification-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user?.email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // If email is already verified, treat as success
        if (response.status === 400 && data.error?.includes('already verified')) {
          setEmailSent(true)
          await updateSession()
          setTimeout(() => {
            setEmailSent(false)
          }, 3000)
          setIsLoading(false)
          return
        }
        setError(data.error || 'Failed to resend verification email')
        setIsLoading(false)
        return
      }

      // Success - show message and start countdown
      setEmailSent(true)
      setCanResend(false)
      setResendCountdown(60) // 60 second countdown
      
      // Hide success message after 3 seconds and return to warning banner
      setTimeout(() => {
        setEmailSent(false)
      }, 3000)
    } catch (error) {
      console.error('Error resending verification email:', error)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="sticky top-0 inset-x-0 z-50 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800 p-4 md:left-64">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Email verified successfully! Welcome to Avidato!
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (emailSent) {
    return (
      <div className="sticky top-0 inset-x-0 z-50 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800 p-4 md:left-64">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Verification email sent! Please check your inbox.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="sticky top-0 inset-x-0 z-50 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 p-3 md:left-64">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-amber-900 dark:text-amber-200 font-medium">
              Email not verified
            </p>
          </div>
          <button
            onClick={handleResendVerification}
            disabled={isLoading || !canResend}
            className={`flex-shrink-0 px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap ${
              canResend && !isLoading
                ? 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600 text-white cursor-pointer'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-1">
                <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : !canResend ? (
              `Resend in ${resendCountdown}s`
            ) : (
              'Verify'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

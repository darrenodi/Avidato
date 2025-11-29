'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function VerifyErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = () => {
    switch (error) {
      case 'missing-token':
        return {
          title: 'Missing Verification Link',
          message: 'The verification link is incomplete or missing. Please request a new verification email.'
        }
      case 'invalid-token':
        return {
          title: 'Invalid or Expired Link',
          message: 'The verification link has expired or is invalid. Please request a new verification email.'
        }
      case 'server-error':
        return {
          title: 'Something Went Wrong',
          message: 'An error occurred while verifying your email. Please try again later or contact support.'
        }
      default:
        return {
          title: 'Verification Failed',
          message: 'Unable to verify your email. Please try again or contact support.'
        }
    }
  }

  const { title, message } = getErrorMessage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center space-y-6">
          {/* Error Icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-4">
              <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <Link
              href="/dashboard"
              className="block w-full px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
            >
              Back to Dashboard
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              or{' '}
              <Link href="/dashboard/settings" className="text-primary hover:text-primary/90 font-medium">
                request a new verification email
              </Link>
            </p>
          </div>

          {/* Support */}
          <div className="text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p>Need help? Contact us at{' '}
              <a href="mailto:support@avidato.com" className="text-primary hover:text-primary/90">
                support@avidato.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyErrorPage() {
  return (
    <Suspense>
      <VerifyErrorContent />
    </Suspense>
  )
}

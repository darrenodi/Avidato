'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { setCookie, getCookie } from '@/lib/cookies'

export default function CookieConsent() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)

  // Pages where cookie banner should NOT appear
  const policyPages = ['/privacy', '/refund-policy', '/fair-use', '/terms', '/cookie-policy']
  const shouldHide = policyPages.some(page => pathname?.startsWith(page))

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = getCookie('cookie-consent')
    if (!cookieConsent && !shouldHide) {
      // Show banner only if no decision made yet and not on policy pages
      setIsVisible(true)
    }
  }, [shouldHide])

  const handleAcceptAll = () => {
    // Set cookie consent to true (includes necessary + analytics)
    setCookie('cookie-consent', 'accepted', {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: '/',
      sameSite: 'lax',
    })
    setIsVisible(false)
  }

  const handleOnlyNecessary = () => {
    // Set cookie consent to necessary-only
    setCookie('cookie-consent', 'necessary-only', {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: '/',
      sameSite: 'lax',
    })
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2">
              Accept the use of cookies.
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              We use cookies to improve your browsing experience, serve personalized content, and analyze our traffic.
              By clicking &quot;Accept all Cookies&quot;, you agree to the storing of cookies on your device.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              You can customize your settings by clicking &quot;Only necessary cookies&quot;. For more details, see our{' '}
              <Link href="/privacy" className="text-brand-primary hover:underline font-medium">
                Cookie Policy
              </Link>
              .
            </p>
          </div>

          <button
            onClick={() => {
              // Closing the banner = only necessary cookies (privacy-compliant)
              handleOnlyNecessary()
            }}
            className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0"
            aria-label="Close cookie banner"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={handleAcceptAll}
            className="px-6 py-2.5 bg-brand-primary hover:bg-brand-accent text-white font-medium rounded-lg transition-colors order-2 sm:order-1"
          >
            Accept all Cookies
          </button>
          <button
            onClick={handleOnlyNecessary}
            className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-lg transition-colors order-1 sm:order-2"
          >
            Only necessary cookies
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { setCookie, getCookie } from '@/lib/cookies'

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = getCookie('cookie-consent')
    if (!cookieConsent) {
      // Show banner only if no decision made yet
      setIsVisible(true)
    }
  }, [])

  const handleAcceptAll = () => {
    // Set cookie consent to true (includes necessary + analytics)
    setCookie('cookie-consent', 'accepted', {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: '/',
      sameSite: 'lax',
    })
    setIsVisible(false)
  }

  const handleRejectAnalytics = () => {
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        {/* Cookie Emoji Icon */}
        <div className="mb-6 text-6xl">🍪</div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">We use cookies</h2>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-2">
          Please, accept these sweeties<br />to continue enjoying our site!
        </p>

        {/* Privacy Policy Link */}
        <p className="text-gray-500 text-xs mb-6">
          Learn more about how we use your data in our{' '}
          <Link href="/privacy" target="_blank" className="text-blue-600 hover:text-blue-700 underline font-medium">
            Privacy Policy
          </Link>
          {' '}and{' '}
          <Link href="/privacy#cookie-policy" target="_blank" className="text-blue-600 hover:text-blue-700 underline font-medium">
            Cookie Policy
          </Link>
        </p>

        {/* Button Container */}
        <div className="space-y-3">
          <button
            onClick={handleAcceptAll}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Mmm... Sweet!
          </button>
          
          <button
            onClick={handleRejectAnalytics}
            className="w-full text-blue-500 hover:text-blue-600 font-medium py-2 px-4 transition-colors duration-200"
          >
            Nope... I am on a diet 😊
          </button>
        </div>
      </div>
    </div>
  )
}

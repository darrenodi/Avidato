'use client'

import { useSession } from 'next-auth/react'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ManageAccountsIcon from '@/components/icons/ManageAccountsIcon'
import { updateProfile, getUserProfile, checkUsernameAvailability, changePassword, getSecurityInfo, uploadProfilePicture } from '@/app/actions/settings'
import type { UpdateProfileData } from '@/app/actions/settings'

/**
 * Settings Page Component
 * 
 * Provides comprehensive settings and profile management for tutors:
 * - Profile Tab: Update name, email, username, bio
 * - Security Tab: Change password, active sessions
 * - Account Linking Tab: Connect/disconnect providers
 * 
 * Features:
 * - Tabbed interface with responsive design
 * - Form validation and error handling
 * - Success/error toast notifications
 * - Industry-standard security practices
 */

type SettingsTab = 'profile' | 'security' | 'account-linking'

interface TabConfig {
  id: SettingsTab
  label: string
  icon: React.ReactNode
  description: string
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')

  // Tab configuration
  const tabs: TabConfig[] = [
    {
      id: 'profile',
      label: 'Profile',
      icon: <ManageAccountsIcon className="w-5 h-5" />,
      description: 'Manage your personal information and preferences'
    },
    {
      id: 'security',
      label: 'Security',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      description: 'Password, authentication, and security settings'
    },
    {
      id: 'account-linking',
      label: 'Account Linking',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      description: 'Connect or disconnect authentication providers'
    }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />
      case 'security':
        return <SecurityTab />
      case 'account-linking':
        return <AccountLinkingTab />
      default:
        return <ProfileTab />
    }
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ManageAccountsIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Settings
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  Manage your account settings and preferences
                </p>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Tab Headers */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              {/* Mobile Tab Dropdown */}
              <div className="block sm:hidden px-4 py-4">
                <select 
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value as SettingsTab)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  {tabs.map((tab) => (
                    <option key={tab.id} value={tab.id}>
                      {tab.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Desktop Tab Navigation */}
              <div className="hidden sm:flex overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-primary text-primary bg-primary/5'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6">
              {/* Tab Description */}
              <div className="mb-4 sm:mb-6">
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  {tabs.find(tab => tab.id === activeTab)?.description}
                </p>
              </div>

              {/* Active Tab Content */}
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

/**
 * Profile Tab Component
 * Handles user profile information updates with server actions
 */
function ProfileTab() {
  const { data: session, update: updateSession } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: session?.user?.email || '', // Read-only, for display only
    username: '',
    bio: ''
  })

  // Load user profile data on component mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getUserProfile()
        if (profile) {
          setFormData({
            name: profile.name || '',
            email: profile.email || '',
            username: profile.username || '',
            bio: profile.bio || ''
          })
        }
      } catch (error) {
        console.error('Failed to load profile:', error)
      }
    }

    if (session?.user?.email) {
      loadProfile()
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    setMessage(null)
    
    try {
      const updateData: UpdateProfileData = {
        name: formData.name,
        username: formData.username,
        bio: formData.bio
      }
      
      const result = await updateProfile(updateData)
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message })
      } else {
        setMessage({ type: 'error', text: result.message })
        if (result.errors) {
          setErrors(result.errors)
        }
      }
    } catch (error) {
      console.error('Profile update error:', error)
      setMessage({ type: 'error', text: 'An unexpected error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value
    setFormData({ ...formData, username: newUsername })
    
    // Clear previous username errors
    if (errors.username) {
      setErrors({ ...errors, username: [] })
    }

    // Check availability for non-empty usernames
    if (newUsername.trim().length >= 3) {
      try {
        const isAvailable = await checkUsernameAvailability(newUsername)
        if (!isAvailable) {
          setErrors({ ...errors, username: ['This username is already taken'] })
        }
      } catch (error) {
        console.error('Username check error:', error)
      }
    }
  }

  const handlePictureClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file (JPG, PNG, etc.)' })
      return
    }

    // Validate file size (max 1MB)
    const maxSize = 1024 * 1024 // 1MB
    if (file.size > maxSize) {
      setMessage({ type: 'error', text: 'Image must be less than 1MB' })
      return
    }

    // Upload file
    setIsUploading(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      const result = await uploadProfilePicture(formData)

      if (result.success && result.imageUrl) {
        // Refresh session to get updated image
        await updateSession({ image: result.imageUrl })
        setMessage({ type: 'success', text: result.message || 'Profile picture updated' })
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to upload image' })
      }
    } catch (error) {
      console.error('File upload error:', error)
      setMessage({ type: 'error', text: 'An error occurred while uploading' })
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Success/Error Messages */}
      {message && (
        <div className={`p-3 sm:p-4 rounded-lg text-sm sm:text-base ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Display Name */}
        <div>
          <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Display Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter your display name"
            required
          />
          {errors.name && (
            <p className="text-red-600 dark:text-red-400 text-xs sm:text-sm mt-1">{errors.name[0]}</p>
          )}
        </div>

        {/* Email (Read-only) */}
        <div>
          <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            readOnly
            className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            placeholder="Enter your email address"
          />
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Email cannot be changed for security reasons. Contact support if needed.
          </p>
        </div>

        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={handleUsernameChange}
            className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
              errors.username ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Choose a unique username"
          />
          {errors.username && (
            <p className="text-red-600 dark:text-red-400 text-xs sm:text-sm mt-1">{errors.username[0]}</p>
          )}
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Used for your profile URL and identification
          </p>
        </div>

        {/* Profile Picture */}
        <div className="lg:col-span-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Profile Picture
          </label>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              {session?.user?.image ? (
                <Image 
                  src={session.user.image} 
                  alt="Profile" 
                  width={48}
                  height={48}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                />
              ) : (
                <ManageAccountsIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
              )}
            </div>
            <button
              type="button"
              onClick={handlePictureClick}
              disabled={isUploading}
              className="px-3 py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Change Picture'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Upload profile picture"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Max 1MB
            </p>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Bio
        </label>
        <textarea
          id="bio"
          rows={4}
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none ${
            errors.bio ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder="Tell us about yourself and your teaching experience..."
        />
        {errors.bio && (
          <p className="text-red-600 dark:text-red-400 text-xs sm:text-sm mt-1">{errors.bio[0]}</p>
        )}
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Brief description for your tutor profile (optional, max 500 characters)
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm sm:text-base w-full sm:w-auto ${
            isLoading 
              ? 'opacity-50 cursor-not-allowed' 
              : 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </div>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </form>
  )
}

/**
 * Security Tab Component
 * Handles password changes and security settings
 */
function SecurityTab() {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const [securityInfo, setSecurityInfo] = useState<{
    hasPassword: boolean
    linkedAccounts: Array<{provider: string, type: string}>
    emailVerified: boolean
    email: string
  } | null>(null)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [isResendingEmail, setIsResendingEmail] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Load security information on component mount
  useEffect(() => {
    async function loadSecurityInfo() {
      try {
        const result = await getSecurityInfo()
        if (result.success && result.data) {
          setSecurityInfo(result.data)
        }
      } catch (error) {
        console.error('Failed to load security info:', error)
      }
    }
    loadSecurityInfo()
  }, [])

  // Handle password change form submission
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('currentPassword', passwordData.currentPassword)
      formData.append('newPassword', passwordData.newPassword)
      formData.append('confirmPassword', passwordData.confirmPassword)

      const result = await changePassword(formData)

      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Password changed successfully!' })
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setShowPasswordForm(false)
        
        // Reload security info
        const securityResult = await getSecurityInfo()
        if (securityResult.success && securityResult.data) {
          setSecurityInfo(securityResult.data)
        }
      } else if (result.errors) {
        setErrors(result.errors)
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to change password' })
      }
    } catch {
      setMessage({ type: 'error', text: 'An unexpected error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle resend verification email
  const handleResendVerification = async () => {
    setIsResendingEmail(true)
    setMessage(null)

    try {
      const response = await fetch('/api/auth/resend-verification-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: securityInfo?.email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage({ 
          type: 'error', 
          text: data.error || 'Failed to resend verification email'
        })
        return
      }

      setMessage({ 
        type: 'success', 
        text: 'Verification email sent! Please check your inbox.'
      })
    } catch (error) {
      console.error('Error resending verification email:', error)
      setMessage({ 
        type: 'error', 
        text: 'An error occurred. Please try again.'
      })
    } finally {
      setIsResendingEmail(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Success/Error Messages */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {message.type === 'success' ? (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          </div>
        </div>
      )}

      {/* Security Overview */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Overview</h3>
        
        {securityInfo ? (
          <div className="space-y-4">
            {/* Password Status */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${securityInfo.hasPassword ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Password Protection</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {securityInfo.hasPassword ? 'Your account is protected with a password' : 'No password set - using social login only'}
                  </p>
                </div>
              </div>
              {securityInfo.hasPassword && (
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="px-4 py-2 text-sm font-medium text-primary hover:text-primary-dark border border-primary hover:border-primary-dark rounded-lg transition-colors"
                >
                  Change Password
                </button>
              )}
            </div>

            {/* Email Address */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 flex-1">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Email Address</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {securityInfo.email}
                  </p>
                  <p className="text-xs mt-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                      securityInfo.emailVerified 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${securityInfo.emailVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                      {securityInfo.emailVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    Email cannot be changed for security reasons. <a href="mailto:support@avidato.com" className="text-primary hover:text-primary-dark">Contact support</a> if needed.
                  </p>
                </div>
              </div>
            </div>

            {/* Email Verification Status */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${securityInfo.emailVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Email Verification</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {securityInfo.emailVerified ? 'Email address verified' : 'Email address not verified'}
                  </p>
                </div>
              </div>
              {!securityInfo.emailVerified && (
                <button
                  onClick={handleResendVerification}
                  disabled={isResendingEmail}
                  className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed border border-yellow-600 rounded-lg transition-colors"
                >
                  {isResendingEmail ? 'Sending...' : 'Send Verification'}
                </button>
              )}
            </div>

            {/* Connected Accounts */}
            <div className="py-3">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-3 h-3 rounded-full ${securityInfo.linkedAccounts.length > 0 ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Connected Accounts</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Social login providers linked to your account
                  </p>
                </div>
              </div>
              {securityInfo.linkedAccounts.length > 0 ? (
                <div className="ml-6 space-y-2">
                  {securityInfo.linkedAccounts.map((account: {provider: string, type: string}, index: number) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {account.provider.charAt(0).toUpperCase() + account.provider.slice(1)}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">({account.type})</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="ml-6 text-sm text-gray-500 dark:text-gray-400">No connected accounts</p>
              )}
            </div>
          </div>
        ) : (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        )}
      </div>

      {/* Password Change Form */}
      {showPasswordForm && securityInfo?.hasPassword && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
          
          <form onSubmit={handlePasswordChange} className="space-y-6">
            {/* Current Password */}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.currentPassword ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter your current password"
                required
              />
              {errors.currentPassword && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.currentPassword[0]}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.newPassword ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter your new password"
                required
              />
              {errors.newPassword && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.newPassword[0]}</p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Must be at least 8 characters with uppercase, lowercase, and number
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.confirmPassword ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Confirm your new password"
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.confirmPassword[0]}</p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(false)
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                  setErrors({})
                  setMessage(null)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  isLoading
                    ? 'bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-dark text-white active:scale-95'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Changing...</span>
                  </div>
                ) : (
                  'Change Password'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Security Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">Security Tips</h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
          <li className="flex items-start space-x-2">
            <span className="font-bold">•</span>
            <span>Use a strong, unique password that you don&apos;t use elsewhere</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-bold">•</span>
            <span>Consider using a password manager to generate and store secure passwords</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-bold">•</span>
            <span>Keep your account secure by linking additional authentication methods</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-bold">•</span>
            <span>Regularly review your connected accounts and remove any you no longer use</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

/**
 * Account Linking Tab Component
 * Handles provider linking/unlinking and OAuth management
 */
function AccountLinkingTab() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const [securityInfo, setSecurityInfo] = useState<{
    hasPassword: boolean
    linkedAccounts: Array<{provider: string, type: string}>
    emailVerified: boolean
    email: string
  } | null>(null)

  // Load security info to get linked accounts
  useEffect(() => {
    async function loadAccountInfo() {
      try {
        const result = await getSecurityInfo()
        if (result.success && result.data) {
          setSecurityInfo(result.data)
        }
      } catch (error) {
        console.error('Failed to load account info:', error)
      }
    }
    loadAccountInfo()
  }, [])

  // Available OAuth providers
  const availableProviders = [
    {
      id: 'google',
      name: 'Google',
      description: 'Link your Google account for easy sign-in',
      icon: 'google-logo',
      color: 'bg-white dark:bg-white border border-gray-300',
      textColor: 'text-gray-700',
      bgLight: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    }
  ]

  const isProviderLinked = (providerId: string) => {
    return securityInfo?.linkedAccounts.some(account => account.provider === providerId) || false
  }

  const handleLinkAccount = async (providerId: string) => {
    setIsLoading(true)
    setMessage(null)

    try {
      // Redirect to NextAuth provider sign-in
      const baseUrl = window.location.origin
      const callbackUrl = `${baseUrl}/dashboard/settings?tab=account-linking&linked=${providerId}`
      window.location.href = `/api/auth/signin/${providerId}?callbackUrl=${encodeURIComponent(callbackUrl)}`
    } catch {
      setMessage({ type: 'error', text: 'Failed to initiate account linking' })
      setIsLoading(false)
    }
  }

  const handleUnlinkAccount = async (_providerId: string) => {
    setIsLoading(true)
    setMessage(null)

    try {
      // TODO: Implement account unlinking
      // This would require a server action to remove the account record
      setMessage({ 
        type: 'error', 
        text: 'Account unlinking feature coming soon. Please contact support for assistance.' 
      })
    } catch {
      setMessage({ type: 'error', text: 'Failed to unlink account' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Success/Error Messages */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {message.type === 'success' ? (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          </div>
        </div>
      )}

      {/* Account Linking */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Connected Accounts</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your sign-in options
            </p>
          </div>
        </div>

        {/* Available Providers */}
        <div className="space-y-4">
          {availableProviders.map(provider => {
            const isLinked = isProviderLinked(provider.id)
            
            return (
              <div key={provider.id} className={`border rounded-lg p-4 transition-colors ${
                isLinked 
                  ? `${provider.bgLight} ${provider.borderColor}` 
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${provider.color}`}>
                      {provider.icon === 'google-logo' ? (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                      ) : (
                        <span className="text-lg">{provider.icon}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{provider.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{provider.description}</p>
                      {isLinked && (
                        <div className="flex items-center space-x-1 mt-1">
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">Connected</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {isLinked ? (
                      <button
                        onClick={() => handleUnlinkAccount(provider.id)}
                        disabled={isLoading}
                        className={`px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${
                          isLoading
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed border-gray-300 dark:border-gray-600'
                            : 'text-red-700 dark:text-red-300 border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                        }`}
                      >
                        {isLoading ? 'Processing...' : 'Disconnect'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleLinkAccount(provider.id)}
                        disabled={isLoading}
                        className={`px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${
                          isLoading
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed border-gray-300 dark:border-gray-600'
                            : `${provider.textColor} dark:text-gray-300 ${provider.borderColor} hover:${provider.bgLight}`
                        }`}
                      >
                        {isLoading ? 'Connecting...' : 'Connect'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Security Tip */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-200 mb-2">Tip</h3>
        <p className="text-sm text-yellow-800 dark:text-yellow-300">
          Keep at least one authentication method (password or linked account) to ensure you can always access your account.
        </p>
      </div>
    </div>
  )
}
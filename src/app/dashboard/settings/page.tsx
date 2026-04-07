'use client'

import { useSession } from 'next-auth/react'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import DashboardLayout from '@/components/layout/DashboardLayout'
import PersonIcon from '@/components/icons/PersonIcon'
import { updateProfile, getUserProfile, checkUsernameAvailability, changePassword, getSecurityInfo, uploadProfilePicture } from '@/app/actions/settings'
import type { UpdateProfileData } from '@/app/actions/settings'

type SettingsTab = 'profile' | 'password' | 'billing' | 'email' | 'notifications' | 'pricing'

const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'profile',
    label: 'Profile',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    id: 'password',
    label: 'Security',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    id: 'email',
    label: 'Email',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
]

function StatusMessage({ message }: { message: { type: 'success' | 'error'; text: string } | null }) {
  if (!message) return null
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-6 ${
      message.type === 'success'
        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
        : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
    }`}>
      {message.type === 'success' ? (
        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )}
      {message.text}
    </div>
  )
}

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5 mt-8 first:mt-0">
      <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider whitespace-nowrap">{title}</h3>
      <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{children}</label>
  )
}

function Input({ error, hint, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: string; hint?: string }) {
  return (
    <div>
      <input
        {...props}
        className={`w-full px-3 py-2 text-sm bg-white dark:bg-gray-900 border rounded-lg outline-none transition-colors
          text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600
          focus:border-primary dark:focus:border-primary focus:ring-1 focus:ring-primary/20
          disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-400 disabled:cursor-not-allowed
          ${props.readOnly ? 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 cursor-default' : ''}
          ${error ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}
        `}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      {hint && !error && <p className="text-gray-400 dark:text-gray-600 text-xs mt-1">{hint}</p>}
    </div>
  )
}

function PrimaryButton({ loading, loadingText, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean; loadingText?: string }) {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={`px-4 py-2 bg-primary hover:bg-brand-accent text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${props.className ?? ''}`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          {loadingText ?? 'Loading...'}
        </span>
      ) : children}
    </button>
  )
}

function GhostButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50 ${props.className ?? ''}`}
    >
      {children}
    </button>
  )
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')

  return (
    <DashboardLayout>
      <div className="px-3 py-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-8">Settings</h1>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-44 flex-shrink-0">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-brand-primary flex items-center justify-center mb-2 ring-2 ring-white dark:ring-gray-900 shadow">
                {session?.user?.image ? (
                  <Image src={session.user.image} alt="Profile" width={56} height={56} className="w-full h-full object-cover" />
                ) : (
                  <PersonIcon className="w-7 h-7 text-white" />
                )}
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-full">{session?.user?.name || 'Your Name'}</p>
              <p className="text-xs text-gray-400 truncate max-w-full">{session?.user?.email}</p>
            </div>

            {/* Nav */}
            <nav className="space-y-0.5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary/10 dark:bg-primary/15 text-primary font-medium'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <span className={activeTab === tab.id ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <div className={activeTab === 'profile' ? '' : 'hidden'}><ProfileTab /></div>
            <div className={activeTab === 'password' ? '' : 'hidden'}><SecurityTab /></div>
            <div className={activeTab === 'billing' ? '' : 'hidden'}><BillingTab /></div>
            <div className={activeTab === 'email' ? '' : 'hidden'}><EmailTab /></div>
            <div className={activeTab === 'notifications' ? '' : 'hidden'}><NotificationsTab /></div>
          </main>
        </div>
      </div>
    </DashboardLayout>
  )
}

function ProfileTab() {
  const { data: session, update: updateSession } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({ name: '', email: session?.user?.email || '', username: '', bio: '' })

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getUserProfile()
        if (profile) {
          setFormData({ name: profile.name || '', email: profile.email || '', username: profile.username || '', bio: profile.bio || '' })
        }
      } catch (error) { console.error('Failed to load profile:', error) }
    }
    if (session?.user?.email) loadProfile()
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    setMessage(null)
    try {
      const updateData: UpdateProfileData = { name: formData.name, username: formData.username, bio: formData.bio }
      const result = await updateProfile(updateData)
      if (result.success) {
        setMessage({ type: 'success', text: result.message })
      } else {
        setMessage({ type: 'error', text: result.message })
        if (result.errors) setErrors(result.errors)
      }
    } catch {
      setMessage({ type: 'error', text: 'An unexpected error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value
    setFormData({ ...formData, username: newUsername })
    if (errors.username) setErrors({ ...errors, username: [] })
    if (newUsername.trim().length >= 3) {
      try {
        const isAvailable = await checkUsernameAvailability(newUsername)
        if (!isAvailable) setErrors({ ...errors, username: ['This username is already taken'] })
      } catch (error) { console.error('Username check error:', error) }
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setMessage({ type: 'error', text: 'Please select an image file' }); return }
    if (file.size > 1024 * 1024) { setMessage({ type: 'error', text: 'Image must be less than 1MB' }); return }
    setIsUploading(true)
    setMessage(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const result = await uploadProfilePicture(fd)
      if (result.success && result.imageUrl) {
        await updateSession({ image: result.imageUrl })
        setMessage({ type: 'success', text: result.message || 'Profile picture updated' })
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to upload image' })
      }
    } catch { setMessage({ type: 'error', text: 'An error occurred while uploading' }) }
    finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-6">My Profile</h2>
      <StatusMessage message={message} />

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-brand-primary flex items-center justify-center flex-shrink-0 shadow">
          {session?.user?.image ? (
            <Image src={session.user.image} alt="Profile" width={64} height={64} className="w-full h-full object-cover" />
          ) : (
            <PersonIcon className="w-8 h-8 text-white" />
          )}
        </div>
        <div>
          <GhostButton type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            {isUploading ? 'Uploading...' : '+ Change Image'}
          </GhostButton>
          <p className="text-xs text-gray-400 mt-1">PNGs, JPEGs under 1MB</p>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" aria-label="Upload profile picture" />
      </div>

      <SectionDivider title="Personal Info" />

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <FieldLabel>Display Name</FieldLabel>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your full name"
            required
            error={errors.name?.[0]}
          />
        </div>
        <div>
          <FieldLabel>Email Address</FieldLabel>
          <Input
            type="email"
            value={formData.email}
            readOnly
            hint="Cannot be changed. Contact support if needed."
          />
        </div>
      </div>

      <div className="mb-8 max-w-sm">
        <FieldLabel>Username</FieldLabel>
        <Input
          type="text"
          value={formData.username}
          onChange={handleUsernameChange}
          placeholder="your-username"
          hint="Used for your profile URL"
          error={errors.username?.[0]}
        />
      </div>

      <SectionDivider title="Bio" />

      <div className="mb-8">
        <textarea
          rows={4}
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className={`w-full px-3 py-2 text-sm bg-white dark:bg-gray-900 border rounded-lg outline-none transition-colors resize-none
            text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600
            focus:border-primary dark:focus:border-primary focus:ring-1 focus:ring-primary/20
            ${errors.bio ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}`}
          placeholder="Tell your students about yourself and your teaching experience..."
        />
        {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio[0]}</p>}
        <p className="text-xs text-gray-400 mt-1">Optional, max 500 characters</p>
      </div>

      <PrimaryButton type="submit" loading={isLoading} loadingText="Saving...">
        Save Changes
      </PrimaryButton>
    </form>
  )
}

function SecurityTab() {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [securityInfo, setSecurityInfo] = useState<{
    hasPassword: boolean
    linkedAccounts: Array<{ provider: string; type: string }>
    emailVerified: boolean
    email: string
  } | null>(null)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [isResendingEmail, setIsResendingEmail] = useState(false)
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })

  useEffect(() => {
    async function loadSecurityInfo() {
      try {
        const result = await getSecurityInfo()
        if (result.success && result.data) setSecurityInfo(result.data)
      } catch (error) { console.error('Failed to load security info:', error) }
    }
    loadSecurityInfo()
  }, [])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    setMessage(null)
    try {
      const fd = new FormData()
      fd.append('currentPassword', passwordData.currentPassword)
      fd.append('newPassword', passwordData.newPassword)
      fd.append('confirmPassword', passwordData.confirmPassword)
      const result = await changePassword(fd)
      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Password changed successfully!' })
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setShowPasswordForm(false)
        const securityResult = await getSecurityInfo()
        if (securityResult.success && securityResult.data) setSecurityInfo(securityResult.data)
      } else if (result.errors) {
        setErrors(result.errors)
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to change password' })
      }
    } catch { setMessage({ type: 'error', text: 'An unexpected error occurred' }) }
    finally { setIsLoading(false) }
  }

  const handleResendVerification = async () => {
    setIsResendingEmail(true)
    setMessage(null)
    try {
      const response = await fetch('/api/auth/resend-verification-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: securityInfo?.email }),
      })
      const data = await response.json()
      if (!response.ok) { setMessage({ type: 'error', text: data.error || 'Failed to resend verification email' }); return }
      setMessage({ type: 'success', text: 'Verification email sent! Please check your inbox.' })
    } catch { setMessage({ type: 'error', text: 'An error occurred. Please try again.' }) }
    finally { setIsResendingEmail(false) }
  }

  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-6">Security</h2>
      <StatusMessage message={message} />

      <SectionDivider title="Account Security" />

      {securityInfo ? (
        <div className="space-y-0">
          {/* Email row */}
          <div className="flex items-center justify-between py-3.5 border-b border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {securityInfo.email}
                <span className={`ml-2 text-xs font-medium ${securityInfo.emailVerified ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                  {securityInfo.emailVerified ? '· Verified' : '· Not verified'}
                </span>
              </p>
            </div>
            {!securityInfo.emailVerified && (
              <GhostButton onClick={handleResendVerification} disabled={isResendingEmail}>
                {isResendingEmail ? 'Sending...' : 'Send verification'}
              </GhostButton>
            )}
          </div>

          {/* Password row */}
          <div className="flex items-center justify-between py-3.5 border-b border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Password</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {securityInfo.hasPassword ? '••••••••••' : 'No password set — social login only'}
              </p>
            </div>
            {securityInfo.hasPassword && (
              <GhostButton onClick={() => setShowPasswordForm(!showPasswordForm)}>
                {showPasswordForm ? 'Cancel' : 'Change password'}
              </GhostButton>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4 py-2">
          {[1, 2].map((i) => <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />)}
        </div>
      )}

      {/* Password change form */}
      {showPasswordForm && securityInfo?.hasPassword && (
        <form onSubmit={handlePasswordChange} className="mt-6 space-y-4 max-w-sm">
          <div>
            <FieldLabel>Current Password</FieldLabel>
            <Input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              placeholder="Enter current password"
              required
              error={errors.currentPassword?.[0]}
            />
          </div>
          <div>
            <FieldLabel>New Password</FieldLabel>
            <Input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              placeholder="Min 8 characters"
              required
              error={errors.newPassword?.[0]}
            />
          </div>
          <div>
            <FieldLabel>Confirm New Password</FieldLabel>
            <Input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              placeholder="Repeat new password"
              required
              error={errors.confirmPassword?.[0]}
            />
          </div>
          <div className="flex gap-2 pt-1">
            <PrimaryButton type="submit" loading={isLoading} loadingText="Updating...">
              Update Password
            </PrimaryButton>
            <GhostButton type="button" onClick={() => { setShowPasswordForm(false); setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); setErrors({}) }}>
              Cancel
            </GhostButton>
          </div>
        </form>
      )}

      <AccountLinkingSection />
    </div>
  )
}

function AccountLinkingSection() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [securityInfo, setSecurityInfo] = useState<{
    hasPassword: boolean
    linkedAccounts: Array<{ provider: string; type: string }>
    emailVerified: boolean
    email: string
  } | null>(null)

  useEffect(() => {
    async function loadAccountInfo() {
      try {
        const result = await getSecurityInfo()
        if (result.success && result.data) setSecurityInfo(result.data)
      } catch (error) { console.error('Failed to load account info:', error) }
    }
    loadAccountInfo()
  }, [])

  const isProviderLinked = (providerId: string) =>
    securityInfo?.linkedAccounts.some(account => account.provider === providerId) || false

  const handleLinkAccount = async (providerId: string) => {
    setIsLoading(true)
    setMessage(null)
    try {
      const baseUrl = window.location.origin
      const callbackUrl = `${baseUrl}/dashboard/settings?tab=account-linking&linked=${providerId}`
      window.location.href = `/api/auth/signin/${providerId}?callbackUrl=${encodeURIComponent(callbackUrl)}`
    } catch {
      setMessage({ type: 'error', text: 'Failed to initiate account linking' })
      setIsLoading(false)
    }
  }

  const handleUnlinkAccount = async () => {
    setIsLoading(true)
    setMessage(null)
    try {
      setMessage({ type: 'error', text: 'Account unlinking feature coming soon. Please contact support for assistance.' })
    } catch {
      setMessage({ type: 'error', text: 'Failed to unlink account' })
    } finally {
      setIsLoading(false)
    }
  }

  const isLinked = isProviderLinked('google')

  return (
    <>
      <SectionDivider title="Connected Accounts" />
      <StatusMessage message={message} />

      <div className="flex items-center justify-between py-3.5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Google</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isLinked ? <span className="text-emerald-600 dark:text-emerald-400">Connected</span> : 'Not connected'}
            </p>
          </div>
        </div>
        {isLinked ? (
          <button
            onClick={handleUnlinkAccount}
            disabled={isLoading}
            className="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Disconnect'}
          </button>
        ) : (
          <GhostButton onClick={() => handleLinkAccount('google')} disabled={isLoading}>
            {isLoading ? 'Connecting...' : 'Connect'}
          </GhostButton>
        )}
      </div>
    </>
  )
}

function BillingTab() {
  const [subscription, setSubscription] = useState<{
    plan: string
    status: string
    billingInterval: string | null
    currentPeriodEnd: string | null
    cancelAt: string | null
    dailyLimit: number
    subscriptionId?: string
    paddleCustomerId?: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [canceling, setCanceling] = useState(false)

  useEffect(() => {
    fetch('/api/paddle/subscription?sync=true')
      .then((r) => r.json())
      .then((data) => setSubscription(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will retain access until the end of your billing period.')) return
    setCanceling(true)
    try {
      const res = await fetch('/api/paddle/cancel', { method: 'POST' })
      if (res.ok) {
        setSubscription((prev) => prev ? { ...prev, status: 'canceled' } : prev)
      } else {
        const err = await res.json()
        alert(err.error || 'Failed to cancel subscription')
      }
    } catch { alert('Network error — please try again') }
    finally { setCanceling(false) }
  }

  if (loading) {
    return (
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-6">Billing</h2>
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-10 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />)}
        </div>
      </div>
    )
  }

  const isPaid = subscription && subscription.status !== 'free' && subscription.subscriptionId
  const isActive = isPaid && (subscription.status === 'active' || subscription.status === 'trialing')
  const isCanceled = subscription?.status === 'canceled'

  const planLabel = subscription?.plan ?? 'Starter'
  const intervalLabel = subscription?.billingInterval === 'annual' ? 'Annual' : 'Monthly'
  const priceDisplay =
    planLabel === 'Pro'
      ? subscription?.billingInterval === 'annual' ? '$5/mo' : '$6/mo'
      : planLabel === 'Premium'
        ? subscription?.billingInterval === 'annual' ? '$8/mo' : '$10/mo'
        : 'Free'

  const periodEnd = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  const planFeatures = [
    { label: isPaid ? 'Unlimited students' : 'Up to 20 students' },
    { label: 'Shareable lesson links' },
    { label: `${isPaid ? 'Unlimited' : subscription?.dailyLimit ?? 20} generations / day` },
    ...(planLabel === 'Pro' || planLabel === 'Premium' ? [
      { label: 'All 4 teaching methodologies' },
      { label: 'Vocabulary audio pronunciation' },
      { label: 'Priority email support' },
      { label: 'Ad-free experience' },
    ] : []),
    ...(planLabel === 'Premium' ? [
      { label: 'YouTube to Lesson tool' },
      { label: 'Smart vocabulary tracking' },
      { label: 'Early access to new features' },
    ] : []),
  ]

  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-6">Billing</h2>

      <SectionDivider title="Current Plan" />

      <div className="flex items-center justify-between py-3.5 border-b border-gray-100 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{planLabel} Plan</p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              isActive ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
              : isCanceled ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}>
              {isPaid ? (subscription.status ?? 'free').replace('_', ' ') : 'Free'}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {isPaid
              ? `${priceDisplay} · ${intervalLabel} billing${periodEnd ? ` · Renews ${periodEnd}` : ''}`
              : 'Free tier — limited generations per day'}
          </p>
          {isCanceled && periodEnd && (
            <p className="text-xs text-red-500 mt-0.5">Access until {periodEnd}</p>
          )}
        </div>
        {!isPaid ? (
          <a href="/pricing" className="px-4 py-2 bg-primary hover:bg-brand-accent text-white text-sm font-medium rounded-lg transition-colors">
            Upgrade
          </a>
        ) : (
          <a href="/pricing" className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Change Plan
          </a>
        )}
      </div>

      <SectionDivider title="Plan Includes" />

      <ul className="space-y-2 mb-8">
        {planFeatures.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {f.label}
          </li>
        ))}
      </ul>

      {isActive && (
        <>
          <SectionDivider title="Manage" />
          <button
            onClick={handleCancel}
            disabled={canceling}
            className="text-sm text-red-600 dark:text-red-400 hover:underline disabled:opacity-50"
          >
            {canceling ? 'Canceling...' : 'Cancel subscription'}
          </button>
        </>
      )}
    </div>
  )
}

function EmailTab() {
  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-6">Email</h2>
      <SectionDivider title="Preferences" />
      <p className="text-sm text-gray-500 dark:text-gray-400">Email preferences coming soon.</p>
    </div>
  )
}

function NotificationsTab() {
  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-6">Notifications</h2>
      <SectionDivider title="Preferences" />
      <p className="text-sm text-gray-500 dark:text-gray-400">Notification settings coming soon.</p>
    </div>
  )
}

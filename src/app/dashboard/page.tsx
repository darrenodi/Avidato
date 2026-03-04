'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'
import NotificationCenter from '@/components/NotificationCenter'
import { getDashboardStats } from '../actions/dashboard'
import { getGenerationStats } from '../actions/ai-generation'

// Extended session type for our custom fields
interface ExtendedUser {
  name?: string | null
  email?: string | null
  image?: string | null
  dailyGenerationCount?: number
  dailyLimit?: number
}

interface ExtendedSession {
  user?: ExtendedUser
}

interface DashboardStats {
  studentCount: number
  lessonCount: number
  recentStudents: Array<{
    id: string
    name: string
    targetLanguage: string
    level: string
    createdAt: Date
  }>
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentDateTime, setCurrentDateTime] = useState('')
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [generationStats, setGenerationStats] = useState({ used: 0, limit: 10, remaining: 10 })

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      if (session) {
        // Skip if stats already loaded
        if (dashboardStats && !statsLoading) {
          return
        }

        try {
          setStatsLoading(true)

          // Retry helper for cold-start resilience
          const withRetry = async <T,>(fn: () => Promise<T>, retries = 2): Promise<T> => {
            for (let i = 0; i <= retries; i++) {
              try {
                return await fn()
              } catch (err) {
                if (i === retries) throw err
                await new Promise(r => setTimeout(r, 1000 * (i + 1)))
              }
            }
            throw new Error('Exhausted retries')
          }

          const [dashboardResponse, generationResponse] = await Promise.all([
            withRetry(() => getDashboardStats()),
            withRetry(() => getGenerationStats())
          ])
          
          if (dashboardResponse.success && dashboardResponse.data) {
            setDashboardStats(dashboardResponse.data)
          }
          
          setGenerationStats(generationResponse)
        } catch (error) {
          console.error('Error fetching dashboard stats:', error)
        } finally {
          setStatsLoading(false)
        }
      }
    }

    fetchStats()
  }, [session, dashboardStats, statsLoading])

  // Update date and time every minute
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }
      setCurrentDateTime(now.toLocaleDateString('en-US', options))
    }

    updateDateTime() // Initial update
    const interval = setInterval(updateDateTime, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  // Prevent auto-refresh when switching back to this tab from another browser tab (Issue #58)
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Do nothing when page becomes visible - prevent automatic re-renders
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Sync subscription after checkout redirect (?upgraded=true)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('upgraded') === 'true' && session) {
      fetch('/api/paddle/sync', { method: 'POST' })
        .then((r) => r.json())
        .then((data) => {
          if (data.synced) {
            console.log(`[Subscription] Synced: ${data.plan} (${data.status})`)
          }
        })
        .catch(console.error)
        .finally(() => {
          // Clean up URL
          window.history.replaceState({}, '', '/dashboard')
        })
    }
  }, [session])

  useEffect(() => {
    
    if (status === 'loading') return // Still loading
    if (!session) {
      router.push('/login')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect via useEffect
  }

  const extendedSession = session as ExtendedSession

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{currentDateTime}</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Hey, {extendedSession.user?.name?.split(' ')[0] || 'there'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <NotificationCenter />
              <Link
                href="/dashboard/students/add"
                className="hidden sm:inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Student
              </Link>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {[
            { label: 'Students', value: dashboardStats?.studentCount || 0 },
            { label: 'Lessons', value: dashboardStats?.lessonCount || 0 },
            { label: 'Generated today', value: generationStats.used },
            { label: 'Remaining', value: generationStats.limit === -1 ? '∞' : `${generationStats.remaining}/${generationStats.limit}` },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5">
              {statsLoading ? (
                <div className="animate-pulse">
                  <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-10 mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                </div>
              ) : (
                <>
                  <p className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Two-column: CTA + Recent */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          {/* Left: action card */}
          <div className="lg:col-span-2 bg-gray-900 dark:bg-gray-800 rounded-xl p-6 sm:p-7 text-white flex flex-col justify-between min-h-[200px]">
            {!statsLoading && (dashboardStats?.studentCount || 0) === 0 ? (
              <>
                <div>
                  <h2 className="text-lg font-semibold mb-2">Get started</h2>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Add your first student profile, then generate a lesson plan in under a minute.
                  </p>
                </div>
                <Link
                  href="/dashboard/students/add"
                  className="mt-6 inline-flex items-center gap-2 bg-white text-gray-900 font-medium px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-sm w-fit"
                >
                  Add Your First Student
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
              </>
            ) : (
              <>
                <div>
                  <h2 className="text-lg font-semibold mb-2">Your students</h2>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {dashboardStats?.studentCount || 0} student{(dashboardStats?.studentCount || 0) !== 1 ? 's' : ''} in your portfolio.
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/dashboard/students/add"
                    className="inline-flex items-center gap-2 bg-white text-gray-900 font-medium px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                  >
                    Add Student
                  </Link>
                  <Link
                    href="/dashboard/students"
                    className="inline-flex items-center gap-2 bg-white/10 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-white/15 transition-colors text-sm"
                  >
                    View All
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Right: recent students */}
          <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">Recent Students</h2>
              {dashboardStats?.recentStudents && dashboardStats.recentStudents.length > 0 && (
                <Link href="/dashboard/students" className="text-xs text-brand-primary hover:underline font-medium">
                  View all
                </Link>
              )}
            </div>
            {statsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-center gap-3">
                    <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="flex-1">
                      <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-28 mb-1.5" />
                      <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : dashboardStats?.recentStudents && dashboardStats.recentStudents.length > 0 ? (
              <div className="space-y-1">
                {dashboardStats.recentStudents.map((student) => (
                  <Link
                    key={student.id}
                    href={`/dashboard/students/${student.id}`}
                    className="flex items-center gap-3 p-2.5 -mx-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                  >
                    <div className="w-9 h-9 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-brand-primary font-semibold text-sm">
                        {student.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-brand-primary transition-colors truncate">{student.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{student.targetLanguage} · {student.level}</p>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500 dark:text-gray-400">No students yet</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Add a student to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
          {[
            { label: 'YouTube to Lesson', desc: 'Turn any video into a 50-min lesson plan', href: '/dashboard/tools/youtube-to-lesson', icon: '▶' },
            { label: 'Discussion Generator', desc: 'Create discussion questions on any topic', href: '/dashboard/tools/discussion', icon: '💬' },
            { label: 'Word Matching', desc: 'Build vocabulary matching exercises', href: '/dashboard/tools/word-definition-matching', icon: '🔤' },
          ].map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex items-start gap-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 hover:border-brand-primary/40 dark:hover:border-brand-primary/40 transition-all"
            >
              <span className="text-xl mt-0.5 flex-shrink-0">{tool.icon}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-brand-primary transition-colors">{tool.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Roadmap */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">Roadmap</h2>
            <span className="text-xs text-gray-400 dark:text-gray-500">2026</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Placement Tests', when: 'Q1', color: 'bg-rose-500' },
              { title: 'Progress Tracking', when: 'Q1', color: 'bg-violet-500' },
              { title: 'Mobile App', when: 'Q2', color: 'bg-blue-500' },
              { title: 'AI Voice Tools', when: 'Q3', color: 'bg-amber-500' },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className={`w-2 h-2 rounded-full ${item.color} flex-shrink-0`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.when} 2026</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile add button */}
        <div className="mt-6 sm:hidden">
          <Link
            href="/dashboard/students/add"
            className="flex items-center justify-center gap-2 w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-3 rounded-lg text-sm font-medium"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Student
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import DashboardLayout from '@/components/layout/DashboardLayout'
import NotificationCenter from '@/components/NotificationCenter'
import { getDashboardStats } from '../actions/dashboard'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts'

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
  youtubeLessonCount: number
  lessonsThisWeek: number
  teachingStreak: number
  weeklyActivity: number[]
  recentStudents: Array<{
    id: string
    name: string
    targetLanguage: string
    level: string
    createdAt: Date
  }>
  levelDistribution: Array<{ level: string; count: number }>
  monthlyActivity: Array<{ month: string; lessons: number; students: number }>
}

/* ───────── Level Dot Grid ───────── */
const LEVEL_DOT_COLORS: Record<string, string> = {
  A1: 'bg-green-400', A2: 'bg-emerald-500', B1: 'bg-blue-400', B2: 'bg-indigo-500', C1: 'bg-purple-500', C2: 'bg-pink-500'
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // ─── SWR: cached data fetching ───
  const { data: dashboardStats, isLoading: statsLoading } = useSWR<DashboardStats>(
    session ? 'dashboard-stats' : null,
    async () => {
      const res = await getDashboardStats()
      if (res.success && res.data) return res.data
      throw new Error(res.error || 'Failed to fetch stats')
    }
  )

  // Date info
  const now = useMemo(() => new Date(), [])
  const dayNum = now.getDate()
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' })
  const monthYear = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  // Sync subscription after checkout redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('upgraded') === 'true' && session) {
      fetch('/api/paddle/sync', { method: 'POST' })
        .then((r) => r.json())
        .then((data) => { if (data.synced) console.log(`[Subscription] Synced: ${data.plan} (${data.status})`) })
        .catch(console.error)
        .finally(() => window.history.replaceState({}, '', '/dashboard'))
    }
  }, [session])

  useEffect(() => {
    if (status === 'loading') return
    if (!session) { router.push('/login'); return }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto" />
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  const extendedSession = session as ExtendedSession
  const firstName = extendedSession.user?.name?.split(' ')[0] || 'there'
  const totalStudents = dashboardStats?.studentCount || 0
  const totalLessons = dashboardStats?.lessonCount || 0
  const ytLessons = dashboardStats?.youtubeLessonCount || 0
  const lessonsThisWeek = dashboardStats?.lessonsThisWeek || 0
  const teachingStreak = dashboardStats?.teachingStreak || 0
  const weeklyActivity = dashboardStats?.weeklyActivity || [0, 0, 0, 0, 0, 0, 0]
  const levelDist = dashboardStats?.levelDistribution || []
  const monthlyData = dashboardStats?.monthlyActivity || []

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px]">

        {/* ─── TOP BAR: date + greeting ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            {/* Big date circle */}
            <div className="w-16 h-16 rounded-2xl bg-gray-900 dark:bg-white flex flex-col items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-white dark:text-gray-900 leading-none">{dayNum}</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">{dayName.slice(0, 3)}</span>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">{monthYear}</p>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Hey, {firstName}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NotificationCenter />
            <Link
              href="/dashboard/students/add"
              className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2.5 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Student
            </Link>
          </div>
        </div>

        {/* ─── BENTO GRID ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

          {/* Card 1: Total Students (large) */}
          <div className="col-span-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 flex flex-col justify-between min-h-[160px]">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                <svg className="w-4.5 h-4.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
            </div>
            {statsLoading ? (
              <div className="animate-pulse"><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12 mb-1" /><div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" /></div>
            ) : (
              <div>
                <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">{totalStudents}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Students</p>
              </div>
            )}
          </div>

          {/* Card 2: Total Lessons */}
          <div className="col-span-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 flex flex-col justify-between min-h-[160px]">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                <svg className="w-4.5 h-4.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
            </div>
            {statsLoading ? (
              <div className="animate-pulse"><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12 mb-1" /><div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" /></div>
            ) : (
              <div>
                <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">{totalLessons}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Lessons Created</p>
              </div>
            )}
          </div>

          {/* Card 3: This Week (spans 1 col, 2 rows) */}
          <div className="col-span-1 row-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 flex flex-col justify-between">
            {statsLoading ? (
              <div className="animate-pulse flex flex-col gap-3">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-14" />
                <div className="flex gap-1.5 mt-auto">{[...Array(7)].map((_, i) => <div key={i} className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded" />)}</div>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">This Week</p>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight mt-2">{lessonsThisWeek}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">lesson{lessonsThisWeek !== 1 ? 's' : ''} created</p>
                </div>
                {/* Weekly activity bars (Mon → Sun) */}
                <div className="flex items-end gap-1.5 mt-4">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                    const max = Math.max(...weeklyActivity, 1)
                    const height = weeklyActivity[i] > 0
                      ? Math.max(20, (weeklyActivity[i] / max) * 100)
                      : 8
                    const isToday = (() => {
                      const d = new Date().getDay()
                      const todayIdx = d === 0 ? 6 : d - 1
                      return i === todayIdx
                    })()
                    return (
                      <div key={i} className="flex flex-col items-center gap-1 flex-1">
                        <div
                          className={`w-full rounded-md transition-all ${
                            weeklyActivity[i] > 0
                              ? 'bg-brand-primary'
                              : isToday
                                ? 'bg-gray-200 dark:bg-gray-600'
                                : 'bg-gray-100 dark:bg-gray-700'
                          }`}
                          style={{ height: `${height}%`, minHeight: '4px' }}
                        />
                        <span className={`text-[9px] ${isToday ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>{day}</span>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>

          {/* Card 4: YouTube Lessons + mini line chart */}
          <div className="col-span-1 row-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center mb-3">
                <svg className="w-4.5 h-4.5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{ytLessons}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">YouTube Lessons</p>
            </div>
            {/* Mini sparkline */}
            <div className="h-16 mt-3 -mx-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData.length > 0 ? monthlyData : [{ month: '', lessons: 0 }]}>
                  <defs>
                    <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3d74b5" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3d74b5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="lessons" stroke="#3d74b5" fill="url(#sparkGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 5: Teaching Streak */}
          <div className="col-span-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 flex flex-col justify-between min-h-[160px]">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
            </div>
            {statsLoading ? (
              <div className="animate-pulse"><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12 mb-1" /><div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" /></div>
            ) : (
              <div>
                <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {teachingStreak}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Day Streak {teachingStreak > 0 ? '🔥' : ''}</p>
              </div>
            )}
          </div>

          {/* Card 6: Level Distribution (dot grid) */}
          <div className="col-span-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 flex flex-col justify-between min-h-[160px]">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">Levels</p>
            {statsLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              </div>
            ) : levelDist.length > 0 ? (
              <div className="space-y-2">
                {levelDist.map((l) => (
                  <div key={l.level} className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${LEVEL_DOT_COLORS[l.level] || 'bg-gray-400'}`} />
                    <span className="text-xs text-gray-600 dark:text-gray-300 font-medium w-6">{l.level}</span>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${LEVEL_DOT_COLORS[l.level] || 'bg-gray-400'}`}
                        style={{ width: `${Math.max(8, (l.count / Math.max(totalStudents, 1)) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 w-5 text-right">{l.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 dark:text-gray-500">No students yet</p>
            )}
          </div>
        </div>

        {/* ─── SECOND ROW: Activity chart + Recent students ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4 mt-3 sm:mt-4">

          {/* Activity Chart */}
          <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Activity</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Last 6 months</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">Lessons</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-secondary" />
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">Students</span>
                </div>
              </div>
            </div>
            <div className="h-48 sm:h-56">
              {statsLoading ? (
                <div className="animate-pulse w-full h-full bg-gray-100 dark:bg-gray-700 rounded-xl" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} barGap={2}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} allowDecimals={false} width={24} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                      cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                    />
                    <Bar dataKey="lessons" fill="#3d74b5" radius={[4, 4, 0, 0]} maxBarSize={32} />
                    <Bar dataKey="students" fill="#5ebbc8" radius={[4, 4, 0, 0]} maxBarSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Recent Students */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Recent Students</p>
              {(dashboardStats?.recentStudents?.length || 0) > 0 && (
                <Link href="/dashboard/students" className="text-[10px] font-medium text-brand-primary hover:underline uppercase tracking-wide">
                  View All
                </Link>
              )}
            </div>
            {statsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse flex items-center gap-3">
                    <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="flex-1"><div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-1.5" /><div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-16" /></div>
                  </div>
                ))}
              </div>
            ) : (dashboardStats?.recentStudents?.length || 0) > 0 ? (
              <div className="space-y-0.5">
                {dashboardStats!.recentStudents.map((s) => (
                  <Link key={s.id} href={`/dashboard/students/${s.id}`}
                    className="flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                  >
                    <div className="w-9 h-9 bg-gray-900 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-medium text-sm">{s.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-brand-primary transition-colors">{s.name}</p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500">{s.targetLanguage} · {s.level}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-400 dark:text-gray-500">No students yet</p>
                <Link href="/dashboard/students/add" className="text-xs text-brand-primary hover:underline mt-1 inline-block">Add your first student</Link>
              </div>
            )}
          </div>
        </div>

        {/* ─── THIRD ROW: Quick Tools ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-4">
          {[
            { label: 'YouTube to Lesson', desc: 'Video to full lesson plan', href: '/dashboard/tools/youtube-to-lesson',
              icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
              color: 'bg-rose-50 dark:bg-rose-900/30 text-rose-500'
            },
            { label: 'Discussion Generator', desc: 'Questions on any topic', href: '/dashboard/tools/discussion',
              icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
              color: 'bg-violet-50 dark:bg-violet-900/30 text-violet-500'
            },
            { label: 'Word Matching', desc: 'Vocabulary matching exercises', href: '/dashboard/tools/word-definition-matching',
              icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>,
              color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-500'
            },
          ].map((tool) => (
            <Link key={tool.href} href={tool.href}
              className="group flex items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
            >
              <div className={`w-10 h-10 rounded-xl ${tool.color} flex items-center justify-center flex-shrink-0`}>
                {tool.icon}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-brand-primary transition-colors">{tool.label}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{tool.desc}</p>
              </div>
              <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 ml-auto flex-shrink-0 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

      </div>
    </DashboardLayout>
  )
}
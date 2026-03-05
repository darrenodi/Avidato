'use server'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../lib/auth'
import { prisma } from '../../lib/prisma'
import type { Session } from 'next-auth'

/**
 * Dashboard Statistics Interface
 */
interface DashboardStats {
  studentCount: number
  lessonCount: number
  youtubeLessonCount: number
  lessonsThisWeek: number
  teachingStreak: number
  weeklyActivity: number[]          // 7 values, Mon → Sun
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

/**
 * Server Action Response Interface
 */
interface DashboardResponse {
  success: boolean
  data?: DashboardStats
  error?: string
}

/**
 * Fetches dashboard statistics for the authenticated user
 * 
 * @returns DashboardResponse with user statistics or error
 */
export async function getDashboardStats(): Promise<DashboardResponse> {
  try {
    // Check authentication
    const session = await getServerSession(authOptions) as Session | null
    if (!session?.user || typeof session.user.id !== 'string') {
      return {
        success: false,
        error: 'You must be logged in to view dashboard statistics'
      }
    }

    const userId = session.user.id

    try {
      // Use a single transaction for all queries to improve performance
      const result = await Promise.race([
        prisma.$transaction(async (tx) => {
          // 6 months ago for activity chart
          const sixMonthsAgo = new Date()
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
          sixMonthsAgo.setDate(1)
          sixMonthsAgo.setHours(0, 0, 0, 0)

          // Start of current week (Monday 00:00)
          const now = new Date()
          const dayOfWeek = now.getDay()            // 0=Sun … 6=Sat
          const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1
          const weekStart = new Date(now)
          weekStart.setDate(weekStart.getDate() - mondayOffset)
          weekStart.setHours(0, 0, 0, 0)

          // 60 days back for streak calculation
          const sixtyDaysAgo = new Date()
          sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)
          sixtyDaysAgo.setHours(0, 0, 0, 0)

          // Run all queries in parallel within the transaction
          const [studentCount, lessonCount, youtubeLessonCount, recentStudents, levelGroups, recentLessons, recentStudentsByMonth, lessonsForWeek, lessonsForStreak] = await Promise.all([
            tx.student.count({
              where: {
                tutorId: userId,
                archived: false
              }
            }),
            tx.lesson.count({
              where: {
                student: {
                  tutorId: userId,
                  archived: false
                }
              }
            }),
            tx.youTubeLesson.count({
              where: { createdBy: userId }
            }),
            // Only return the 5 most recently created students for dashboard
            tx.student.findMany({
              where: {
                tutorId: userId,
                archived: false
              },
              select: {
                id: true,
                name: true,
                targetLanguage: true,
                level: true,
                createdAt: true
              },
              orderBy: {
                createdAt: 'desc'
              },
              take: 5
            }),
            // Level distribution
            tx.student.groupBy({
              by: ['level'],
              where: {
                tutorId: userId,
                archived: false
              },
              _count: { level: true }
            }),
            // Lessons created in last 6 months (for monthly chart)
            tx.lesson.findMany({
              where: {
                student: { tutorId: userId },
                createdAt: { gte: sixMonthsAgo }
              },
              select: { createdAt: true }
            }),
            // Students created in last 6 months (for monthly chart)
            tx.student.findMany({
              where: {
                tutorId: userId,
                createdAt: { gte: sixMonthsAgo }
              },
              select: { createdAt: true }
            }),
            // Lessons created this week (Mon–Sun) for weekly dots
            tx.lesson.findMany({
              where: {
                student: { tutorId: userId },
                createdAt: { gte: weekStart }
              },
              select: { createdAt: true }
            }),
            // Lessons created in last 60 days for streak calculation
            tx.lesson.findMany({
              where: {
                student: { tutorId: userId },
                createdAt: { gte: sixtyDaysAgo }
              },
              select: { createdAt: true }
            })
          ])

          // Build level distribution
          const levelDistribution = levelGroups.map(g => ({
            level: g.level,
            count: g._count.level
          })).sort((a, b) => {
            const order = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
            return order.indexOf(a.level) - order.indexOf(b.level)
          })

          // Build monthly activity for last 6 months
          const monthlyActivity: Array<{ month: string; lessons: number; students: number }> = []
          for (let i = 5; i >= 0; i--) {
            const d = new Date()
            d.setMonth(d.getMonth() - i)
            const monthKey = d.toLocaleString('en-US', { month: 'short' })
            const year = d.getFullYear()
            const month = d.getMonth()
            monthlyActivity.push({
              month: monthKey,
              lessons: recentLessons.filter(l => {
                const c = new Date(l.createdAt)
                return c.getFullYear() === year && c.getMonth() === month
              }).length,
              students: recentStudentsByMonth.filter(s => {
                const c = new Date(s.createdAt)
                return c.getFullYear() === year && c.getMonth() === month
              }).length
            })
          }

          // Build weekly activity (Mon=0 … Sun=6)
          const weeklyActivity = [0, 0, 0, 0, 0, 0, 0]
          for (const l of lessonsForWeek) {
            const d = new Date(l.createdAt).getDay()     // 0=Sun
            const idx = d === 0 ? 6 : d - 1              // remap to Mon=0
            weeklyActivity[idx]++
          }

          // Calculate teaching streak (consecutive days with ≥1 lesson, going backwards from today)
          const streakDays = new Set<string>()
          for (const l of lessonsForStreak) {
            const d = new Date(l.createdAt)
            streakDays.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`)
          }
          let teachingStreak = 0
          const cursor = new Date()
          cursor.setHours(0, 0, 0, 0)
          // If no lessons today, check if yesterday had lessons (allow in-progress day)
          const todayKey = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`
          if (!streakDays.has(todayKey)) {
            cursor.setDate(cursor.getDate() - 1)
          }
          while (true) {
            const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`
            if (streakDays.has(key)) {
              teachingStreak++
              cursor.setDate(cursor.getDate() - 1)
            } else {
              break
            }
          }

          return {
            studentCount,
            lessonCount,
            youtubeLessonCount,
            lessonsThisWeek: lessonsForWeek.length,
            teachingStreak,
            weeklyActivity,
            recentStudents,
            levelDistribution,
            monthlyActivity
          }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), 5000)
        )
      ])

      return {
        success: true,
        data: result as DashboardStats
      }

    } catch (error) {
      console.error('❌ Error fetching dashboard stats:', error)
      
      // Return fallback data instead of complete failure
      return {
        success: true,
        data: {
          studentCount: 0,
          lessonCount: 0,
          youtubeLessonCount: 0,
          lessonsThisWeek: 0,
          teachingStreak: 0,
          weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
          recentStudents: [],
          levelDistribution: [],
          monthlyActivity: []
        }
      }
    }

  } catch (error) {
    console.error('❌ Auth error:', error)
    
    return {
      success: false,
      error: 'Authentication failed. Please try logging in again.'
    }
  }
}
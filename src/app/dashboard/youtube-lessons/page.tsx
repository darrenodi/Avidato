'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'

type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

interface YouTubeLessonSummary {
  id: string
  videoId: string
  sourceUrl: string
  level: string
  title: string
  topic: string | null
  createdAt: string
  creator: { name: string | null }
}

const LEVEL_COLORS: Record<CEFRLevel, string> = {
  A1: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  A2: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  B1: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  B2: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  C1: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  C2: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
}

export default function YouTubeLessonsLibraryPage() {
  const { status } = useSession()
  const router = useRouter()

  const [lessons, setLessons] = useState<YouTubeLessonSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterLevel, setFilterLevel] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return

    const fetchLessons = async () => {
      try {
        const res = await fetch('/api/tools/youtube-to-lesson/library')
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to fetch lessons')
        setLessons(data.lessons)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load lessons')
      } finally {
        setLoading(false)
      }
    }

    fetchLessons()
  }, [status])

  const filteredLessons = lessons.filter((lesson) => {
    const matchesLevel = filterLevel === 'all' || lesson.level === filterLevel
    const matchesSearch =
      !searchQuery ||
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lesson.topic && lesson.topic.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesLevel && matchesSearch
  })

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30">
              <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">YouTube Lessons</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Shared library of lessons generated from YouTube videos
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by title or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-transparent text-sm"
            />
          </div>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent"
          >
            <option value="all">All Levels</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
            <option value="C2">C2</option>
          </select>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!error && filteredLessons.length === 0 && (
          <div className="text-center py-16">
            <svg className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchQuery || filterLevel !== 'all' ? 'No lessons match your filters' : 'No YouTube lessons yet'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {searchQuery || filterLevel !== 'all'
                ? 'Try adjusting your search or level filter.'
                : 'Generate your first YouTube lesson using the YouTube to Lesson tool.'}
            </p>
            {!searchQuery && filterLevel === 'all' && (
              <Link
                href="/dashboard/tools/youtube-to-lesson"
                className="inline-flex items-center px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors text-sm font-medium"
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Generate a YouTube Lesson
              </Link>
            )}
          </div>
        )}

        {/* Lesson cards grid */}
        {filteredLessons.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLessons.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/dashboard/youtube-lessons/${lesson.id}`}
                className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md hover:border-brand-primary/40 dark:hover:border-brand-primary/40 transition-all"
              >
                {/* Thumbnail */}
                {lesson.videoId && lesson.videoId !== 'manual' && (
                  <div className="relative w-full mb-4 rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://img.youtube.com/vi/${lesson.videoId}/mqdefault.jpg`}
                      alt={lesson.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded ${LEVEL_COLORS[lesson.level as CEFRLevel] || 'bg-gray-100 text-gray-800'}`}>
                        {lesson.level}
                      </span>
                    </div>
                  </div>
                )}

                {/* No thumbnail for manual transcripts */}
                {(!lesson.videoId || lesson.videoId === 'manual') && (
                  <div className="relative w-full mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center" style={{ paddingBottom: '56.25%' }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded ${LEVEL_COLORS[lesson.level as CEFRLevel] || 'bg-gray-100 text-gray-800'}`}>
                        {lesson.level}
                      </span>
                    </div>
                  </div>
                )}

                {/* Title & topic */}
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2 group-hover:text-brand-primary transition-colors">
                  {lesson.title}
                </h3>
                {lesson.topic && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-1">
                    {lesson.topic}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
                  <span>{lesson.creator?.name || 'Unknown'}</span>
                  <span>{new Date(lesson.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Generate CTA at bottom */}
        {filteredLessons.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href="/dashboard/tools/youtube-to-lesson"
              className="inline-flex items-center px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors text-sm font-medium"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Generate New Lesson
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'

interface Tool {
  name: string
  description: string
  href: string
  icon: React.ReactNode
  status?: 'available' | 'coming-soon'
  planBadge?: 'Pro' | 'Premium'
}

interface ToolGroup {
  label: string
  tools: Tool[]
}

const toolGroups: ToolGroup[] = [
  {
    label: 'Lesson Tools',
    tools: [
      {
        name: 'YouTube to Lesson',
        description: 'Generate a complete 45-minute lesson plan from a YouTube video transcript.',
        href: '/dashboard/tools/youtube-to-lesson',
        status: 'available',
        planBadge: 'Premium',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14m-6 4h5a2 2 0 002-2V8a2 2 0 00-2-2H9a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        name: 'Discussion Generator',
        description: 'Generate discussion questions on any topic. Use as a warm-up or at any stage of your lesson.',
        href: '/dashboard/tools/discussion',
        status: 'available',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        name: 'Placement Test',
        description: "Assess a student's proficiency to recommend a starting CEFR level.",
        href: '/dashboard/placement-tests',
        status: 'coming-soon',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Worksheet Tools',
    tools: [
      {
        name: 'Gap Fill',
        description: 'Generate gap-fill sentences on any topic or grammar point, with or without a word bank.',
        href: '/dashboard/tools/gap-fill',
        status: 'available',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        ),
      },
      {
        name: 'Error Correction',
        description: 'Generate sentences with one error each. Students find and correct them.',
        href: '/dashboard/tools/error-correction',
        status: 'available',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        ),
      },
      {
        name: 'True / False / Not Given',
        description: 'Generate a reading passage with True, False, and Not Given comprehension statements.',
        href: '/dashboard/tools/true-false',
        status: 'available',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        name: 'MCQ Reading',
        description: 'Generate a reading passage with multiple-choice comprehension questions.',
        href: '/dashboard/tools/mcq-reading',
        status: 'available',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 8h2m-2 4h2m4-4h2m-2 4h2" />
          </svg>
        ),
      },
      {
        name: 'Scrambled Sentences',
        description: 'Jumble up words in sentences. Students reorder them to practise grammar and word order.',
        href: '/dashboard/tools/scrambled-sentences',
        status: 'available',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        ),
      },
      {
        name: 'Word-Definition Matching',
        description: 'Create vocabulary matching exercises where students pair words with their definitions.',
        href: '/dashboard/tools/word-definition-matching',
        status: 'available',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        ),
      },
    ],
  },
]

export default function ToolsPage() {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tools
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Teaching utilities and lesson generators
          </p>
        </div>

        {/* Tool Groups */}
        <div className="space-y-10">
          {toolGroups.map((group) => (
            <div key={group.label}>
              <h2 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-4">
                {group.label}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.tools.map((tool) => (
                  <div key={tool.name} className="relative group">
                    <Link href={tool.href}>
                      <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200">
                        {tool.status === 'coming-soon' && (
                          <div className="absolute top-4 right-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                              Soon
                            </span>
                          </div>
                        )}
                        {tool.planBadge && tool.status !== 'coming-soon' && (
                          <div className="absolute top-4 right-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900">
                              {tool.planBadge}
                            </span>
                          </div>
                        )}
                        <div className="mb-4 text-gray-700 dark:text-gray-300">
                          {tool.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {tool.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow mb-4">
                          {tool.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                            {tool.status === 'coming-soon' ? 'Coming soon' : 'Open'}
                          </span>
                          <svg className="w-4 h-4 text-gray-400 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

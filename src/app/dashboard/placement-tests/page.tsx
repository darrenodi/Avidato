'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import {
  getPlacementAssignments,
  getStudentsForAssignment,
  createPlacementAssignment,
  cancelPlacementAssignment,
} from '@/app/actions/placement-tests'

interface Student {
  id: string
  name: string
  level: string
  placementTests: { id: string; status: string }[]
}

interface Assignment {
  id: string
  status: string
  shareToken: string
  studentFullName: string | null
  createdAt: string
  completedAt: string | null
  student: { id: string; name: string; level: string }
  attempts: {
    section: string
    status: string
    determinedLevel: string | null
    score: number | null
    questionsAsked: number
    correctCount: number
  }[]
  result: {
    overallLevel: string
    grammarLevel: string | null
    readingLevel: string | null
    grammarScore: number | null
    readingScore: number | null
    certificateId: string | null
    totalTimeSecs: number
  } | null
}

const statusColors: Record<string, string> = {
  assigned: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
}

const levelColors: Record<string, string> = {
  A1: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  A2: 'bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300',
  B1: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  B2: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  C1: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  C2: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
}

export default function PlacementTestsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [sections, setSections] = useState<string[]>(['grammar', 'reading'])
  const [assigning, setAssigning] = useState(false)
  const [copiedToken, setCopiedToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [assignRes, studentRes] = await Promise.all([
        getPlacementAssignments(),
        getStudentsForAssignment(),
      ])

      if (assignRes.success && assignRes.data) {
        setAssignments(assignRes.data.assignments as unknown as Assignment[])
      }
      if (studentRes.success && studentRes.data) {
        setStudents(studentRes.data.students as unknown as Student[])
      }
    } catch {
      setError('Failed to load data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
    if (status === 'authenticated') {
      loadData()
    }
  }, [status, router, loadData])

  const handleAssign = async () => {
    if (!selectedStudentId) return
    setAssigning(true)
    setError(null)

    const res = await createPlacementAssignment(selectedStudentId, sections)

    if (res.success) {
      setSuccessMsg('Placement test assigned! Share the link with your student.')
      setShowAssignModal(false)
      setSelectedStudentId('')
      loadData()
    } else {
      setError(res.error || 'Failed to assign test.')
    }
    setAssigning(false)
  }

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this placement test?')) return
    const res = await cancelPlacementAssignment(id)
    if (res.success) {
      loadData()
    } else {
      setError(res.error || 'Failed to cancel.')
    }
  }

  const copyLink = (token: string) => {
    const url = `${window.location.origin}/placement-test/${token}`
    navigator.clipboard.writeText(url)
    setCopiedToken(token)
    setTimeout(() => setCopiedToken(null), 2000)
  }

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Placement Tests
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Assign adaptive CEFR placement tests to assess student proficiency
            </p>
          </div>
          <button
            onClick={() => setShowAssignModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors font-medium shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Assign Test
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
            <button onClick={() => setError(null)} className="ml-auto">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300 flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {successMsg}
            <button onClick={() => setSuccessMsg(null)} className="ml-auto">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Tests"
            value={assignments.length}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          <StatCard
            label="Assigned"
            value={assignments.filter((a) => a.status === 'assigned').length}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color="yellow"
          />
          <StatCard
            label="In Progress"
            value={assignments.filter((a) => a.status === 'in_progress').length}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            color="blue"
          />
          <StatCard
            label="Completed"
            value={assignments.filter((a) => a.status === 'completed').length}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color="green"
          />
        </div>

        {/* Assignments Table */}
        {assignments.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary/10 rounded-full mb-4">
              <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Placement Tests Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Assign an adaptive placement test to assess your students&apos; English proficiency level.
            </p>
            <button
              onClick={() => setShowAssignModal(true)}
              className="px-5 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors font-medium"
            >
              Assign Your First Test
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Result</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {assignments.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">{a.student?.name || a.studentFullName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Current: {a.student?.level}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[a.status] || ''}`}>
                          {a.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {a.result ? (
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${levelColors[a.result.overallLevel] || ''}`}>
                            {a.result.overallLevel}
                          </span>
                        ) : a.attempts.length > 0 ? (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {a.attempts[0].questionsAsked} questions answered
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400 dark:text-gray-500">Waiting</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => copyLink(a.shareToken)}
                            className="p-2 text-gray-400 hover:text-brand-primary transition-colors"
                            title="Copy test link"
                          >
                            {copiedToken === a.shareToken ? (
                              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                              </svg>
                            )}
                          </button>
                          {a.result && (
                            <button
                              onClick={() => router.push(`/dashboard/placement-tests/${a.id}/results`)}
                              className="p-2 text-gray-400 hover:text-brand-primary transition-colors"
                              title="View results"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                            </button>
                          )}
                          {a.status !== 'completed' && (
                            <button
                              onClick={() => handleCancel(a.id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                              title="Cancel test"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Assign Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Assign Placement Test</h2>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-5">
                {/* Student select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Select Student
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition-colors"
                  >
                    <option value="">Choose a student...</option>
                    {students
                      .filter((s) => s.placementTests.length === 0)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.level})
                        </option>
                      ))}
                  </select>
                  {students.filter((s) => s.placementTests.length > 0).length > 0 && (
                    <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                      {students.filter((s) => s.placementTests.length > 0).length} student(s) already have active tests
                    </p>
                  )}
                </div>

                {/* Sections */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Test Sections
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={sections.includes('grammar')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSections([...sections, 'grammar'])
                          } else {
                            setSections(sections.filter((s) => s !== 'grammar'))
                          }
                        }}
                        className="w-4 h-4 text-brand-primary rounded focus:ring-brand-primary"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm">Grammar</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Tests grammar knowledge across A1-C2</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={sections.includes('reading')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSections([...sections, 'reading'])
                          } else {
                            setSections(sections.filter((s) => s !== 'reading'))
                          }
                        }}
                        className="w-4 h-4 text-brand-primary rounded focus:ring-brand-primary"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm">Reading</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Tests reading comprehension with passages</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Info */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm text-blue-700 dark:text-blue-300">
                  <p>The test adapts to the student&apos;s level in real time. It starts at B1 and adjusts based on performance. Each section takes 15-30 questions to determine a level.</p>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssign}
                    disabled={!selectedStudentId || sections.length === 0 || assigning}
                    className="px-5 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {assigning && (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                    )}
                    Assign Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

function StatCard({
  label,
  value,
  icon,
  color = 'primary',
}: {
  label: string
  value: number
  icon: React.ReactNode
  color?: string
}) {
  const colorMap: Record<string, string> = {
    primary: 'bg-brand-primary/10 text-brand-primary',
    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-lg ${colorMap[color]}`}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
        </div>
      </div>
    </div>
  )
}

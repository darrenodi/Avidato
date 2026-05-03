'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { getStudent } from '../../../actions/students'
import { generateLesson, getGenerationStats, getStudentLearningPlan, shareLesson, generateMoreLessons, generateBlockLearningPlan, generateModularLesson } from '../../../actions/ai-generation'
import { nativeLanguages, levels, ageGroups } from '@/lib/form-data-mappings'
import type { LearningPlan, BlockLearningPlan, BlockLesson } from '@/types/lesson-template'

/**
 * StudentProfilePage Component
 * 
 * Comprehensive student profile with 3 main tabs:
 * 1. Student Details - Personal info, learning preferences, and stats
 * 2. Learning Plan - AI-generated 10 topics based on goals
 * 3. Generate Lesson - Select topic and generate detailed lessons
 */

interface StudentData {
  id: string
  name: string
  targetLanguage: string
  nativeLanguage: string
  ageGroup: string
  level: string
  endGoals: string
  occupation?: string | null
  weaknesses?: string | null
  interests?: string | null
  archived: boolean
  createdAt: Date
  updatedAt: Date
  lessonCount?: number
}

interface LearningTopic {
  id: string
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  estimatedLessons: number
  skills: string[]
}

interface StudentLesson {
  id: string
  title: string
  overview: string | null
  createdAt: Date
  sharedAt: Date | null
}

type TabType = 'details' | 'learning-plan' | 'generated-lessons' | 'instant-lesson'

export default function StudentProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const studentId = params.id as string

  const [student, setStudent] = useState<StudentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('details')
  const [learningTopics, setLearningTopics] = useState<LearningTopic[]>([])
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [generationStats, setGenerationStats] = useState({ used: 0, limit: 10, remaining: 10 })
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)
  const [isGeneratingLesson, setIsGeneratingLesson] = useState(false)
  const [generatingLessonKey, setGeneratingLessonKey] = useState<string | null>(null)
  const [currentLearningPlan, setCurrentLearningPlan] = useState<LearningPlan | null>(null)
  const [currentBlockPlan, setCurrentBlockPlan] = useState<BlockLearningPlan | null>(null)
  const [planFormat, setPlanFormat] = useState<'legacy' | 'block' | null>(null)
  const [expandedBlocks, setExpandedBlocks] = useState<Set<number>>(new Set([1]))
  const [lessons, setLessons] = useState<StudentLesson[]>([])
  const [loadingLessons, setLoadingLessons] = useState(false)
  const [isGeneratingMoreLessons, setIsGeneratingMoreLessons] = useState(false)
  // Issue #37: Track which lesson is currently being marked as taught
  const [markingTaughtId, setMarkingTaughtId] = useState<string | null>(null)
  const [selectedLessons, setSelectedLessons] = useState<Set<string>>(new Set())
  const [isDeletingLessons, setIsDeletingLessons] = useState(false)
  
  // Instant Lesson Generator State
  const [instantGrammarTopic, setInstantGrammarTopic] = useState('')
  const [instantLessonDescription, setInstantLessonDescription] = useState('')
  const [instantLessonDuration, setInstantLessonDuration] = useState<25 | 50>(50)
  const [isGeneratingInstantLesson, setIsGeneratingInstantLesson] = useState(false)

  // Check if student is learning a supported language (English or French)
  const isEnglishStudent = ['english', 'french'].includes(student?.targetLanguage.toLowerCase() || '')

  // Helper function to check if a lesson already exists for a topic
  const isLessonGenerated = (topicTitle: string) => {
    return lessons.some(lesson => 
      lesson.title.toLowerCase().includes(topicTitle.toLowerCase()) ||
      topicTitle.toLowerCase().includes(lesson.title.toLowerCase())
    )
  }

  // Fetch lessons for the student
  const fetchLessons = useCallback(async () => {
    if (!studentId) return

    setLoadingLessons(true)
    try {
      const response = await fetch(`/api/students/${studentId}/lessons`)
      if (response.ok) {
        const data = await response.json()
        setLessons(data)
      } else {
        console.error('Failed to fetch lessons')
      }
    } catch (err) {
      console.error('Error fetching lessons:', err)
    } finally {
      setLoadingLessons(false)
    }
  }, [studentId])

  // Issue #37: Handle marking lesson as taught
  const handleMarkLessonAsTaught = useCallback(async (lessonId: string) => {
    setMarkingTaughtId(lessonId)
    try {
      const result = await shareLesson(lessonId, studentId)
      if (result.success) {
        await fetchLessons()
      } else {
        console.error('Failed to mark lesson as taught:', result.error)
      }
    } catch (err) {
      console.error('Error marking lesson as taught:', err)
    } finally {
      setMarkingTaughtId(null)
    }
  }, [studentId, fetchLessons])

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Delete this lesson? This cannot be undone.')) return
    try {
      const res = await fetch(`/api/lessons/${lessonId}`, { method: 'DELETE' })
      if (res.ok) setLessons(prev => prev.filter(l => l.id !== lessonId))
    } catch (err) {
      console.error('Error deleting lesson:', err)
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedLessons.size === 0) return
    if (!confirm(`Delete ${selectedLessons.size} lesson(s)? This cannot be undone.`)) return
    setIsDeletingLessons(true)
    try {
      const res = await fetch('/api/lessons/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedLessons) }),
      })
      if (res.ok) {
        setLessons(prev => prev.filter(l => !selectedLessons.has(l.id)))
        setSelectedLessons(new Set())
      }
    } catch (err) {
      console.error('Error deleting lessons:', err)
    } finally {
      setIsDeletingLessons(false)
    }
  }

  // Fetch existing learning plan
  const fetchExistingLearningPlan = useCallback(async () => {
    if (!studentId) return

    try {
      const result = await getStudentLearningPlan(studentId)
      if (result.success && result.data) {
        setPlanFormat(result.format ?? 'legacy')
        if (result.format === 'block') {
          setCurrentBlockPlan(result.data as BlockLearningPlan)
          setCurrentLearningPlan(null)
          setLearningTopics([])
        } else {
          const legacyPlan = result.data as LearningPlan
          setCurrentLearningPlan(legacyPlan)
          setCurrentBlockPlan(null)
          const aiTopics: LearningTopic[] = legacyPlan.topics.map((topic) => ({
            id: topic.lessonNumber.toString(),
            title: topic.title,
            description: topic.objective,
            difficulty: topic.lessonNumber <= 3 ? 'Beginner' :
                       topic.lessonNumber <= 7 ? 'Intermediate' : 'Advanced',
            estimatedLessons: 1,
            skills: topic.skills
          }))
          setLearningTopics(aiTopics)
        }
      }
    } catch (err) {
      console.error('Error fetching existing learning plan:', err)
    }
  }, [studentId])

  // Prevent refetching on window focus (Issue #58)
  useEffect(() => {
    const handleFocus = () => {
      // Do nothing - prevent refetching when tab regains focus
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  // Fetch student data
  useEffect(() => {
    const fetchStudent = async () => {
      if (session && studentId) {
        // Skip if student is already loaded
        if (student?.id === studentId) {
          return
        }

        try {
          setLoading(true)
          setError(null)
          
          const response = await getStudent(studentId)
          if (response.success && response.data) {
            setStudent(response.data)
            // Generate learning topics based on student data
            generateLearningTopics()
            // Fetch lessons for this student
            fetchLessons()
            // Fetch existing learning plan
            fetchExistingLearningPlan()
          } else {
            setError(response.error || 'Failed to load student profile')
          }
        } catch (err) {
          console.error('Error fetching student:', err)
          setError('Failed to load student profile. Please try again.')
        } finally {
          setLoading(false)
        }
      }
    }

    fetchStudent()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, studentId, fetchLessons, fetchExistingLearningPlan])

  // Fetch generation stats
  useEffect(() => {
    const fetchStats = async () => {
      if (session) {
        try {
          const stats = await getGenerationStats()
          setGenerationStats(stats)
        } catch (err) {
          console.error('Error fetching generation stats:', err)
        }
      }
    }

    fetchStats()
  }, [session])

  // Handle AI learning plan generation (block format)
  const handleGenerateLearningPlan = async () => {
    if (!student || isGeneratingPlan) return

    setIsGeneratingPlan(true)
    try {
      const result = await generateBlockLearningPlan(student.id)
      if (result.success && result.data) {
        setCurrentBlockPlan(result.data)
        setCurrentLearningPlan(null)
        setLearningTopics([])
        setPlanFormat('block')
        setExpandedBlocks(new Set([1]))
        const stats = await getGenerationStats()
        setGenerationStats(stats)
      } else {
        setError(result.error || 'Failed to generate learning plan')
      }
    } catch (err) {
      console.error('Error generating learning plan:', err)
      setError('Failed to generate learning plan. Please try again.')
    } finally {
      setIsGeneratingPlan(false)
    }
  }

  // Handle generating 10 more lessons
  const handleGenerateMoreLessons = async () => {
    if (!student || isGeneratingMoreLessons) return

    setIsGeneratingMoreLessons(true)
    try {
      const result = await generateMoreLessons(student.id)
      if (result.success && result.data) {
        setCurrentLearningPlan(result.data)
        // Convert all topics to display format
        const aiTopics: LearningTopic[] = result.data.topics.map((topic) => ({
          id: topic.lessonNumber.toString(),
          title: topic.title,
          description: topic.objective,
          difficulty: topic.lessonNumber <= 10 ? 'Beginner' : 
                     topic.lessonNumber <= 20 ? 'Intermediate' : 'Advanced',
          estimatedLessons: 1,
          skills: topic.skills
        }))
        setLearningTopics(aiTopics)
        
        // Update generation stats
        const stats = await getGenerationStats()
        setGenerationStats(stats)
      } else {
        setError(result.error || 'Failed to generate more lessons')
      }
    } catch (err) {
      console.error('Error generating more lessons:', err)
      setError('Failed to generate more lessons. Please try again.')
    } finally {
      setIsGeneratingMoreLessons(false)
    }
  }

  // Handle legacy AI lesson generation
  const handleGenerateLesson = async () => {
    if (!student || !selectedTopic || !currentLearningPlan || isGeneratingLesson) return

    const selectedAITopic = currentLearningPlan.topics.find(t => t.lessonNumber.toString() === selectedTopic)
    if (!selectedAITopic) return

    const topicWithVocabulary = { ...selectedAITopic, vocabulary: selectedAITopic.vocabulary || [] }

    setIsGeneratingLesson(true)
    try {
      const result = await generateLesson(student.id, topicWithVocabulary, 50)
      if (result.success && result.data) {
        await fetchLessons()
        const stats = await getGenerationStats()
        setGenerationStats(stats)
        setSelectedTopic(null)
      } else {
        setError(result.error || 'Failed to generate lesson')
      }
    } catch (err) {
      console.error('Error generating lesson:', err)
      setError('Failed to generate lesson. Please try again.')
    } finally {
      setIsGeneratingLesson(false)
    }
  }

  // Handle block-format TBLT lesson generation
  const handleGenerateBlockLesson = async (lesson: BlockLesson) => {
    if (!student || isGeneratingLesson) return

    setIsGeneratingLesson(true)
    setGeneratingLessonKey(`${lesson.lessonNumber}`)
    try {
      const result = await generateModularLesson(student.id, lesson, 50)
      if (result.success && result.data) {
        await fetchLessons()
        const stats = await getGenerationStats()
        setGenerationStats(stats)
      } else {
        setError(result.error || 'Failed to generate lesson')
      }
    } catch (err) {
      console.error('Error generating TBLT lesson:', err)
      setError('Failed to generate lesson. Please try again.')
    } finally {
      setIsGeneratingLesson(false)
      setGeneratingLessonKey(null)
    }
  }

  // Generate learning topics based on student's profile
  const generateLearningTopics = () => {
    // Topics come from AI generation only
    setLearningTopics([])
  }

  // Download the block learning plan as a print-ready HTML page
  const downloadLearningPlan = (plan: BlockLearningPlan, studentData: StudentData) => {
    const levelLabel = getLevelLabel(studentData.level)
    const langLabel = getLanguageLabel(studentData.targetLanguage)
    const methodologyColors: Record<string, string> = {
      TBLT: '#1d4ed8', CLT: '#059669', PPP: '#7c3aed', TTT: '#b45309'
    }

    const blockOverviewRows = plan.blocks.map(b => `
      <tr>
        <td style="padding:10px 14px;font-weight:600;white-space:nowrap">Block ${b.blockNumber}</td>
        <td style="padding:10px 14px;font-weight:600">${b.title}</td>
        <td style="padding:10px 14px;color:#374151">${b.rationale || ''}</td>
        <td style="padding:10px 14px;text-align:center;white-space:nowrap">${b.lessons.length} lessons</td>
      </tr>`).join('')

    const blockSections = plan.blocks.map(b => {
      const lessonRows = b.lessons.map((l, i) => {
        const bg = i % 2 === 0 ? '#ffffff' : '#f9fafb'
        const methodColor = methodologyColors[l.methodology] || '#374151'
        const vocabHtml = l.isReview ? '<span style="color:#9ca3af;font-style:italic">—</span>' : (l.keyVocabulary || []).map(w => `<span style="display:inline-block;background:#eff6ff;color:#1e40af;padding:1px 6px;border-radius:10px;font-size:10px;margin:1px 2px">${w}</span>`).join('')
        return `
        <tr style="background:${bg}">
          <td style="padding:9px 12px;text-align:center;font-weight:600;color:#6b7280;white-space:nowrap">${l.isReview ? '★' : l.lessonNumber}</td>
          <td style="padding:9px 12px;font-weight:500;color:#111827">${l.title}${l.isReview ? ' <span style="color:#d97706;font-size:11px">(Review)</span>' : ''}</td>
          <td style="padding:9px 12px;color:#374151;font-size:12px">${l.communicativeNeed}</td>
          <td style="padding:9px 12px;font-size:12px">${vocabHtml}</td>
          <td style="padding:9px 12px;color:#4b5563;font-size:12px">${l.isReview ? '<span style="color:#9ca3af;font-style:italic">Mixed review</span>' : (l.grammarFocus || '—')}</td>
          <td style="padding:9px 12px;color:#4b5563;font-size:12px">${l.mainActivity || '—'}</td>
          <td style="padding:9px 12px;text-align:center"><span style="background:${methodColor}15;color:${methodColor};padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600">${l.methodology}</span></td>
        </tr>`}).join('')

      return `
      <div style="margin-bottom:32px;page-break-inside:avoid">
        <div style="background:#1e3a8a;color:white;padding:10px 16px;border-radius:6px 6px 0 0">
          <h3 style="margin:0;font-size:15px;font-weight:700">Block ${b.blockNumber}: ${b.title}</h3>
          ${b.rationale ? `<p style="margin:4px 0 0;font-size:12px;opacity:0.85">${b.rationale}</p>` : ''}
        </div>
        <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 6px 6px;overflow:hidden">
          <thead>
            <tr style="background:#eff6ff">
              <th style="padding:8px 12px;text-align:center;font-size:11px;color:#1e40af;text-transform:uppercase;letter-spacing:.05em;width:36px">#</th>
              <th style="padding:8px 12px;text-align:left;font-size:11px;color:#1e40af;text-transform:uppercase;letter-spacing:.05em;width:18%">Topic / Theme</th>
              <th style="padding:8px 12px;text-align:left;font-size:11px;color:#1e40af;text-transform:uppercase;letter-spacing:.05em;width:20%">Learning Objectives</th>
              <th style="padding:8px 12px;text-align:left;font-size:11px;color:#1e40af;text-transform:uppercase;letter-spacing:.05em;width:16%">Key Vocabulary</th>
              <th style="padding:8px 12px;text-align:left;font-size:11px;color:#1e40af;text-transform:uppercase;letter-spacing:.05em;width:14%">Grammar Focus</th>
              <th style="padding:8px 12px;text-align:left;font-size:11px;color:#1e40af;text-transform:uppercase;letter-spacing:.05em">Main Activity</th>
              <th style="padding:8px 12px;text-align:center;font-size:11px;color:#1e40af;text-transform:uppercase;letter-spacing:.05em;width:55px">Method</th>
            </tr>
          </thead>
          <tbody>${lessonRows}</tbody>
        </table>
      </div>`
    }).join('')

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Learning Plan — ${studentData.name}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111827;background:#fff;padding:40px;max-width:1000px;margin:0 auto}
    @media print{body{padding:20px}@page{margin:15mm 15mm}}
  </style>
</head>
<body>
  <div style="border-bottom:4px solid #1e3a8a;padding-bottom:20px;margin-bottom:28px">
    <h1 style="font-size:26px;font-weight:800;color:#1e3a8a;margin-bottom:6px">Personalized Learning Plan</h1>
    <p style="font-size:15px;color:#374151"><strong>${studentData.name}</strong> &nbsp;·&nbsp; ${langLabel} &nbsp;·&nbsp; Level: ${levelLabel} &nbsp;·&nbsp; ${studentData.occupation || 'General learner'}</p>
    <p style="font-size:12px;color:#6b7280;margin-top:4px">Generated by Avidato &nbsp;·&nbsp; ${new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}</p>
  </div>

  <div style="margin-bottom:32px">
    <h2 style="font-size:16px;font-weight:700;color:#1e3a8a;margin-bottom:12px;text-transform:uppercase;letter-spacing:.05em">Course Overview</h2>
    <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:6px;overflow:hidden">
      <thead>
        <tr style="background:#1e3a8a;color:white">
          <th style="padding:10px 14px;text-align:left;font-size:12px;font-weight:600">Block</th>
          <th style="padding:10px 14px;text-align:left;font-size:12px;font-weight:600">Title</th>
          <th style="padding:10px 14px;text-align:left;font-size:12px;font-weight:600">Goals & Focus</th>
          <th style="padding:10px 14px;text-align:center;font-size:12px;font-weight:600">Lessons</th>
        </tr>
      </thead>
      <tbody>${blockOverviewRows}</tbody>
    </table>
  </div>

  <h2 style="font-size:16px;font-weight:700;color:#1e3a8a;margin-bottom:20px;text-transform:uppercase;letter-spacing:.05em">Lesson Schedule</h2>
  ${blockSections}

  <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:11px;color:#9ca3af;text-align:center">
    Generated by Avidato &nbsp;·&nbsp; Each lesson: 50 minutes &nbsp;·&nbsp; Methods: TBLT = Task-Based | CLT = Communicative | PPP = Present-Practice-Produce
  </div>
  <script>window.onload = function(){ window.print(); }</script>
</body>
</html>`

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
    setTimeout(() => URL.revokeObjectURL(url), 60000)
  }

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }
  }, [session, status, router])

  // Get display labels for form data
  const getLanguageLabel = (value: string) => {
    const lang = nativeLanguages.find(l => l.value === value)
    return lang ? `${lang.country} ${lang.label}` : value
  }

  const getLevelLabel = (value: string) => {
    const level = levels.find(l => l.value === value)
    return level ? level.label : value
  }

  const getAgeGroupLabel = (value: string) => {
    const group = ageGroups.find(g => g.value === value)
    return group ? group.label : value
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

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
    return null
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header with Back Button */}
        <div className="flex items-center mb-4 sm:mb-6 lg:mb-8">
          <Link
            href="/dashboard/students"
            className="inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mr-4 text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Students
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto"></div>
            <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">Loading student profile...</p>
          </div>
        )}

        {/* Student Profile Content */}
        {!loading && !error && student && (
          <div className="space-y-4 sm:space-y-6">
            {/* Student Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-4 min-w-0 flex-1">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-brand-primary to-brand-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-lg sm:text-xl">
                      {student.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                      {student.name}
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      Learning {getLanguageLabel(student.targetLanguage)} • {getLevelLabel(student.level)}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {getAgeGroupLabel(student.ageGroup)} • Added {new Date(student.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {/* Actions - Stack on mobile, inline on desktop */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                  <div className="text-center sm:text-right order-3 sm:order-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Generations: {generationStats.limit === -1 ? `${generationStats.used} (Unlimited)` : `${generationStats.used}/${generationStats.limit}`}
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('learning-plan')}
                    className="bg-brand-primary text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-brand-accent transition-colors text-sm sm:text-base order-1 sm:order-2"
                  >
                    Learning Plan
                  </button>
                  <Link
                    href={`/dashboard/students/${studentId}/edit`}
                    className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors inline-flex items-center justify-center text-sm sm:text-base order-2 sm:order-3"
                  >
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="border-b border-gray-200 dark:border-gray-700">
                {/* Mobile Tab Navigation - Dropdown Style */}
                <div className="block sm:hidden px-4 sm:px-6 py-4">
                  <select 
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value as TabType)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="details">Student Details</option>
                    <option value="learning-plan">Learning Plan</option>
                    <option value="generated-lessons">Generated Lessons</option>
                    <option value="instant-lesson">Instant Lesson</option>
                  </select>
                </div>
                
                {/* Desktop Tab Navigation */}
                <nav className="hidden sm:flex -mb-px space-x-4 lg:space-x-8 px-4 sm:px-6 overflow-x-auto scrollbar-hide">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                      activeTab === 'details'
                        ? 'border-brand-primary text-brand-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="hidden lg:inline">Student Details</span>
                      <span className="lg:hidden">Details</span>
                    </div>
                  </button>
                  <button
                    onClick={() => isEnglishStudent && setActiveTab('learning-plan')}
                    disabled={!isEnglishStudent}
                    className={`py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                      activeTab === 'learning-plan'
                        ? 'border-brand-primary text-brand-primary'
                        : !isEnglishStudent
                        ? 'border-transparent text-gray-300 dark:text-gray-600 cursor-not-allowed'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      <span className="hidden lg:inline">Learning Plan</span>
                      <span className="lg:hidden">Plan</span>
                    </div>
                  </button>
                  <button
                    onClick={() => isEnglishStudent && setActiveTab('generated-lessons')}
                    disabled={!isEnglishStudent}
                    className={`py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                      activeTab === 'generated-lessons'
                        ? 'border-brand-primary text-brand-primary'
                        : !isEnglishStudent
                        ? 'border-transparent text-gray-300 dark:text-gray-600 cursor-not-allowed'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                      </svg>
                      <span className="hidden lg:inline">Generated Lessons</span>
                      <span className="lg:hidden">Lessons</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('instant-lesson')}
                    className={`py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                      activeTab === 'instant-lesson'
                        ? 'border-brand-primary text-brand-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="hidden lg:inline">Instant Lesson</span>
                      <span className="lg:hidden">Instant</span>
                    </div>
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-4 sm:p-6">
                {/* Student Details Tab */}
                {activeTab === 'details' && (
                  <div className="space-y-4 sm:space-y-6">
                    {/* Personal Information Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      {/* Basic Info */}
                      <div className="space-y-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                          Personal Information
                        </h3>
                        <div className="space-y-3 sm:space-y-4">
                          <div>
                            <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Target Language</label>
                            <p className="text-sm sm:text-base text-gray-900 dark:text-white">{getLanguageLabel(student.targetLanguage)}</p>
                          </div>
                          <div>
                            <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Native Language</label>
                            <p className="text-sm sm:text-base text-gray-900 dark:text-white">{getLanguageLabel(student.nativeLanguage)}</p>
                          </div>
                          <div>
                            <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Current Level</label>
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-brand-primary/10 text-brand-primary">
                              {getLevelLabel(student.level)}
                            </span>
                          </div>
                          <div>
                            <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Age Group</label>
                            <p className="text-sm sm:text-base text-gray-900 dark:text-white">{getAgeGroupLabel(student.ageGroup)}</p>
                          </div>
                          {student.occupation && (
                            <div>
                              <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Occupation</label>
                              <p className="text-sm sm:text-base text-gray-900 dark:text-white">{student.occupation}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Learning Stats */}
                      <div className="space-y-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                          Learning Progress
                        </h3>
                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Lessons Generated</span>
                            <span className="text-xl sm:text-2xl font-bold text-brand-primary">{student.lessonCount || 0}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Lessons Taught</span>
                            <span className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                              {lessons.filter(lesson => lesson.sharedAt !== null).length}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Profile Created</span>
                            <span className="text-xs sm:text-sm text-gray-900 dark:text-white">
                              {new Date(student.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</span>
                            <span className="text-xs sm:text-sm text-gray-900 dark:text-white">
                              {new Date(student.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              student.archived 
                                ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            }`}>
                              {student.archived ? 'Archived' : 'Active'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Learning Goals */}
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                        Learning Goals
                      </h3>
                      <p className="text-sm sm:text-base text-gray-900 dark:text-white whitespace-pre-wrap">
                        {student.endGoals}
                      </p>
                    </div>

                    {/* Additional Information */}
                    {(student.weaknesses || student.interests) && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        {student.weaknesses && (
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                              Areas to Improve
                            </h3>
                            <p className="text-sm sm:text-base text-gray-900 dark:text-white whitespace-pre-wrap">
                              {student.weaknesses}
                            </p>
                          </div>
                        )}
                        
                        {student.interests && (
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                              Interests & Hobbies
                            </h3>
                            <p className="text-sm sm:text-base text-gray-900 dark:text-white whitespace-pre-wrap">
                              {student.interests}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Learning Plan Tab */}
                {activeTab === 'learning-plan' && (
                  <>
                    {!isEnglishStudent ? (
                      <div className="text-center py-12 rounded-lg">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                          Feature Coming Soon
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                          We are working with professionals to bring this feature to life for {getLanguageLabel(student.targetLanguage)} students. In the meantime, you can use the Instant Lesson tab to generate custom lessons.
                        </p>
                      </div>
                    ) : (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                          Personalized Learning Plan
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {currentBlockPlan
                            ? `${currentBlockPlan.blocks.length} topic blocks · ${currentBlockPlan.blocks.reduce((n, b) => n + b.lessons.length, 0)} lessons`
                            : currentLearningPlan
                            ? `Personalized lesson plan`
                            : `Structured topic blocks tailored to ${student.name}'s goals`
                          }
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {planFormat === 'block' && currentBlockPlan && (
                          <button
                            onClick={() => downloadLearningPlan(currentBlockPlan, student)}
                            className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-1.5 text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download PDF
                          </button>
                        )}
                        <button
                          onClick={handleGenerateLearningPlan}
                          disabled={isGeneratingPlan || (generationStats.remaining !== -1 && generationStats.remaining <= 0)}
                          className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                        >
                          {isGeneratingPlan && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          )}
                          <span>{currentBlockPlan || currentLearningPlan ? 'Regenerate' : 'Generate AI Plan'}</span>
                        </button>
                      </div>
                    </div>

                    {!currentBlockPlan && learningTopics.length === 0 && !isGeneratingPlan && (
                      <div className="text-center py-12 rounded-lg">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                          No learning plan yet
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Generate an AI-powered learning plan based on {student.name}&apos;s profile
                        </p>
                        <div className="mt-6">
                          <button 
                            onClick={handleGenerateLearningPlan}
                            disabled={generationStats.remaining !== -1 && generationStats.remaining <= 0}
                            className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Generate AI Learning Plan
                          </button>
                        </div>
                      </div>
                    )}

                    {isGeneratingPlan && (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto"></div>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Generating personalized learning plan...</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Using AI to analyze student profile and select optimal methodology</p>
                      </div>
                    )}

                    {/* Block-format plan (new TBLT structure) */}
                    {planFormat === 'block' && currentBlockPlan && (
                      <div className="space-y-3">
                        {currentBlockPlan.blocks.map((block) => {
                          const isExpanded = expandedBlocks.has(block.blockNumber)
                          const blockLessons = block.lessons
                          const generatedCount = blockLessons.filter(l => isLessonGenerated(l.title)).length
                          const progress = Math.round((generatedCount / blockLessons.length) * 100)

                          return (
                            <div key={block.blockNumber} className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                              {/* Block header */}
                              <button
                                onClick={() => setExpandedBlocks(prev => {
                                  const next = new Set(prev)
                                  if (next.has(block.blockNumber)) next.delete(block.blockNumber)
                                  else next.add(block.blockNumber)
                                  return next
                                })}
                                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors text-left"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-primary text-white text-xs flex items-center justify-center font-semibold">
                                    {block.blockNumber}
                                  </span>
                                  <div className="min-w-0">
                                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{block.title}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{blockLessons.length} lessons · {generatedCount} generated</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                                  {/* Progress bar */}
                                  <div className="hidden sm:flex items-center gap-2">
                                    <div className="w-20 h-1.5 rounded-full bg-gray-200 dark:bg-gray-600">
                                      <div
                                        className="h-1.5 rounded-full bg-brand-primary transition-all"
                                        style={{ width: `${progress}%` }}
                                      />
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{progress}%</span>
                                  </div>
                                  <svg
                                    className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                              </button>

                              {/* Block rationale */}
                              {isExpanded && block.rationale && (
                                <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/10 border-b border-gray-200 dark:border-gray-700">
                                  <p className="text-xs text-blue-700 dark:text-blue-300">{block.rationale}</p>
                                </div>
                              )}

                              {/* Lessons table */}
                              {isExpanded && (
                                <div>
                                  {/* Table header — desktop */}
                                  <div className="hidden sm:grid grid-cols-[2rem_1fr_4rem_5rem] md:grid-cols-[2rem_1fr_1fr_4rem_5rem] lg:grid-cols-[2rem_1fr_1fr_10rem_10rem_4rem_5rem] gap-3 px-4 py-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/60">
                                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide text-center">#</span>
                                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Topic / Theme</span>
                                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide hidden md:block">Learning Objectives</span>
                                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide hidden lg:block">Key Vocabulary</span>
                                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide hidden lg:block">Grammar Focus</span>
                                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide text-center">Method</span>
                                    <span></span>
                                  </div>
                                  <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
                                  {blockLessons.map((lesson) => {
                                    const isGenerated = isLessonGenerated(lesson.title)
                                    const generatedLesson = lessons.find(l => l.title.toLowerCase().includes(lesson.title.toLowerCase()))
                                    const isTaught = generatedLesson?.sharedAt
                                    const isThisGenerating = generatingLessonKey === `${lesson.lessonNumber}` && isGeneratingLesson
                                    const methodColors: Record<string, string> = {
                                      TBLT: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                                      CLT: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
                                      PPP: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
                                      TTT: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                                    }

                                    return (
                                      <div key={lesson.lessonNumber} className="px-4 py-3 grid grid-cols-[2rem_1fr_auto] sm:grid-cols-[2rem_1fr_4rem_5rem] md:grid-cols-[2rem_1fr_1fr_4rem_5rem] lg:grid-cols-[2rem_1fr_1fr_10rem_10rem_4rem_5rem] gap-3 items-center hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                        {/* # badge */}
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                                          lesson.isReview ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                                          isGenerated ? (isTaught ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400') :
                                          'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                        }`}>
                                          {isGenerated ? (isTaught ? '✓' : '⚡') : lesson.isReview ? '★' : lesson.lessonNumber}
                                        </span>

                                        {/* Title + main activity */}
                                        <div className="min-w-0">
                                          <p className="text-sm font-medium text-gray-900 dark:text-white leading-snug">{lesson.title}</p>
                                          {!lesson.isReview && (lesson.mainActivity || (lesson as unknown as {keyLanguageFeatures?: string[]}).keyLanguageFeatures?.slice(0,2).join(' · ')) && (
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                                              {lesson.mainActivity || (lesson as unknown as {keyLanguageFeatures?: string[]}).keyLanguageFeatures?.slice(0,2).join(' · ')}
                                            </p>
                                          )}
                                        </div>

                                        {/* Objective — hidden on mobile/sm, shown on md+ */}
                                        <p className="hidden md:block text-xs text-gray-500 dark:text-gray-400 leading-snug line-clamp-2">{lesson.communicativeNeed}</p>

                                        {/* Key vocabulary chips — lg+ only */}
                                        <div className="hidden lg:flex flex-wrap gap-1">
                                          {!lesson.isReview && (lesson.keyVocabulary || []).slice(0, 4).map(w => (
                                            <span key={w} className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded">{w}</span>
                                          ))}
                                        </div>

                                        {/* Grammar focus — lg+ only */}
                                        <p className="hidden lg:block text-xs text-gray-500 dark:text-gray-400 leading-snug line-clamp-2">{lesson.isReview ? 'Mixed review' : (lesson.grammarFocus || '—')}</p>

                                        {/* Methodology badge — hidden on mobile */}
                                        <div className="hidden sm:flex justify-center">
                                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${methodColors[lesson.methodology] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                                            {lesson.methodology}
                                          </span>
                                        </div>

                                        {/* Action button */}
                                        <div className="flex justify-end">
                                          {!isGenerated ? (
                                            <button
                                              onClick={() => handleGenerateBlockLesson(lesson)}
                                              disabled={isGeneratingLesson || (generationStats.remaining !== -1 && generationStats.remaining <= 0)}
                                              className="px-3 py-1.5 rounded-lg bg-brand-primary text-white text-xs font-medium hover:bg-brand-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap"
                                            >
                                              {isThisGenerating && <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />}
                                              {isThisGenerating ? 'Generating...' : 'Generate'}
                                            </button>
                                          ) : (
                                            <Link
                                              href={`/lessons/${generatedLesson?.id}`}
                                              className={`px-3 py-1.5 rounded-lg text-white text-xs font-medium transition-colors whitespace-nowrap ${isTaught ? 'bg-green-500 hover:bg-green-600' : 'bg-purple-500 hover:bg-purple-600'}`}
                                            >
                                              View
                                            </Link>
                                          )}
                                        </div>
                                      </div>
                                    )
                                  })}
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Legacy flat-list plan */}
                    {planFormat === 'legacy' && learningTopics.length > 0 && (
                    <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {learningTopics.map((topic, index) => {
                        const isGenerated = isLessonGenerated(topic.title)
                        const generatedLesson = lessons.find(l => l.title.toLowerCase().includes(topic.title.toLowerCase()))
                        const isTaught = generatedLesson?.sharedAt
                        const borderColor = !isGenerated ? 'border-gray-200 dark:border-gray-600' : isTaught ? 'border-green-400 dark:border-green-600' : 'border-purple-400 dark:border-purple-600'
                        const circleColor = !isGenerated ? 'bg-brand-primary text-white' : isTaught ? 'bg-green-500 text-white' : 'bg-purple-500 text-white'
                        const textColor = !isGenerated ? 'text-gray-900 dark:text-white' : isTaught ? 'text-green-700 dark:text-green-400' : 'text-purple-700 dark:text-purple-400'
                        const descColor = !isGenerated ? 'text-gray-600 dark:text-gray-300' : isTaught ? 'text-green-600 dark:text-green-300' : 'text-purple-600 dark:text-purple-300'
                        return (
                          <div key={topic.id} className={`rounded-lg p-4 border ${borderColor}`}>
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${circleColor}`}>{isGenerated ? (isTaught ? '✓' : '⚡') : index + 1}</span>
                                <div>
                                  <h4 className={`font-medium ${textColor}`}>{topic.title}</h4>
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(topic.difficulty)}`}>{topic.difficulty}</span>
                                </div>
                              </div>
                            </div>
                            <p className={`text-sm mb-3 ${descColor}`}>{topic.description}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                              <span>{topic.estimatedLessons} lesson{topic.estimatedLessons !== 1 ? 's' : ''}</span>
                              <div className="flex space-x-1">
                                {(topic.skills || ['listening', 'speaking', 'reading']).map((skill) => (
                                  <span key={skill} className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">{skill}</span>
                                ))}
                              </div>
                            </div>
                            {!isGenerated ? (
                              <button
                                onClick={async () => {
                                  setSelectedTopic(topic.id);
                                  await handleGenerateLesson();
                                }}
                                disabled={isGeneratingLesson || (generationStats.remaining !== -1 && generationStats.remaining <= 0)}
                                className="w-full mt-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-accent transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                              >
                                {isGeneratingLesson ? 'Generating...' : 'Generate Lesson'}
                              </button>
                            ) : (
                              <Link
                                href={`/lessons/${generatedLesson?.id}`}
                                className={`w-full mt-2 px-4 py-2 rounded-lg text-white transition-colors text-sm font-medium flex items-center justify-center ${isTaught ? 'bg-green-500 hover:bg-green-600' : 'bg-purple-500 hover:bg-purple-600'}`}
                              >
                                View Lesson
                              </Link>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {/* Generate 10 More Lessons Button */}
                    {learningTopics.length < 30 && (
                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={handleGenerateMoreLessons}
                        disabled={isGeneratingMoreLessons || (generationStats.remaining !== -1 && generationStats.remaining <= 0)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {isGeneratingMoreLessons && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        )}
                        <span>{isGeneratingMoreLessons ? 'Generating 10 More Lessons...' : 'Generate 10 More Lessons'}</span>
                      </button>
                    </div>
                    )}
                    {learningTopics.length >= 30 && (
                    <div className="mt-6 flex justify-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ✓ Learning plan complete (30 lessons maximum reached)
                      </p>
                    </div>
                    )}
                    </>
                    )}
                  </div>
                    )}
                  </>
                )}

                {/* Generated Lessons Tab */}
                {activeTab === 'generated-lessons' && (
                  <>
                    {!isEnglishStudent ? (
                      <div className="text-center py-12 rounded-lg">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                          Feature Coming Soon
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                          We are working with professionals to bring this feature to life for {getLanguageLabel(student.targetLanguage)} students. In the meantime, you can use the Instant Lesson tab to generate custom lessons.
                        </p>
                      </div>
                    ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Generated Lessons
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          View and manage all lessons generated for {student.name}
                        </p>
                      </div>
                      {lessons.length > 0 && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {lessons.length} lesson{lessons.length !== 1 ? 's' : ''} created
                        </span>
                      )}
                    </div>

                    {loadingLessons && (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto"></div>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Loading lessons...</p>
                      </div>
                    )}

                    {!loadingLessons && lessons.length === 0 && (
                      <div className="text-center py-12 rounded-lg">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                          No lessons generated yet
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Generate your first lesson from the learning plan topics
                        </p>
                        <div className="mt-6">
                          <button 
                            onClick={() => setActiveTab('learning-plan')}
                            className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-accent transition-colors"
                          >
                            Go to Learning Plan
                          </button>
                        </div>
                      </div>
                    )}

                    {!loadingLessons && lessons.length > 0 && (
                      <div className="space-y-3">
                        {/* Bulk action bar */}
                        <div className="flex items-center gap-3 pb-2">
                          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={selectedLessons.size === lessons.length && lessons.length > 0}
                              onChange={e => setSelectedLessons(e.target.checked ? new Set(lessons.map(l => l.id)) : new Set())}
                              className="rounded border-gray-300 dark:border-gray-600 text-brand-primary"
                            />
                            Select all
                          </label>
                          {selectedLessons.size > 0 && (
                            <button
                              onClick={handleDeleteSelected}
                              disabled={isDeletingLessons}
                              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40 disabled:opacity-50 transition-colors"
                            >
                              {isDeletingLessons ? 'Deleting...' : `Delete ${selectedLessons.size} selected`}
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          {lessons.map((lesson, index) => (
                            <div key={lesson.id} className={`rounded-lg p-6 border transition-colors ${selectedLessons.has(lesson.id) ? 'border-brand-primary bg-brand-primary/5 dark:bg-brand-primary/10' : 'border-gray-200 dark:border-gray-600'}`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                  <input
                                    type="checkbox"
                                    checked={selectedLessons.has(lesson.id)}
                                    onChange={e => {
                                      setSelectedLessons(prev => {
                                        const next = new Set(prev)
                                        if (e.target.checked) { next.add(lesson.id) } else { next.delete(lesson.id) }
                                        return next
                                      })
                                    }}
                                    className="rounded border-gray-300 dark:border-gray-600 text-brand-primary flex-shrink-0"
                                  />
                                  <div className="flex items-center space-x-4 flex-1">
                                    <span className="w-10 h-10 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                      {index + 1}
                                    </span>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                          {lesson.title}
                                        </h4>
                                      </div>
                                      {lesson.overview && (
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                          {lesson.overview}
                                        </p>
                                      )}
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                        Created {new Date(lesson.createdAt).toLocaleDateString()} at {new Date(lesson.createdAt).toLocaleTimeString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2 flex-shrink-0">
                                  <Link
                                    href={`/lessons/${lesson.id}`}
                                    className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-accent transition-colors text-sm font-medium"
                                  >
                                    View Lesson
                                  </Link>
                                  <button
                                    onClick={async (e) => {
                                      e.preventDefault();
                                      try {
                                        if (!lesson.sharedAt && markingTaughtId !== lesson.id) {
                                          await handleMarkLessonAsTaught(lesson.id);
                                        }
                                      } catch (err) {
                                        console.error('Error marking lesson as taught before sharing:', err);
                                      }
                                      const shareUrl = `${window.location.origin}/lessons/${lesson.id}/share`;
                                      window.open(shareUrl, '_blank', 'noopener');
                                    }}
                                    disabled={markingTaughtId === lesson.id}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                      markingTaughtId === lesson.id
                                        ? 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                                        : lesson.sharedAt
                                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100'
                                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                                    }`}
                                    title="Share this lesson with the student"
                                  >
                                    {markingTaughtId === lesson.id ? 'Sharing...' : lesson.sharedAt ? 'Taught' : 'Share'}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteLesson(lesson.id)}
                                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    title="Delete lesson"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                    )}
                  </>
                )}

                {/* Instant Lesson Tab */}
                {activeTab === 'instant-lesson' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Generate Instant Lesson
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                        Generate a custom {getLanguageLabel(student.targetLanguage)} lesson on any topic. The lesson will be customized to {student?.name}&apos;s proficiency level and interests.
                      </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault()
                          if (!instantGrammarTopic.trim()) {
                            alert('Please enter a lesson topic')
                            return
                          }

                          setIsGeneratingInstantLesson(true)
                          try {
                            const response = await fetch('/api/lessons/instant', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                studentId,
                                topic: instantGrammarTopic.trim(),
                                description: instantLessonDescription.trim(),
                                duration: instantLessonDuration,
                                targetLanguage: student.targetLanguage,
                                nativeLanguage: student.nativeLanguage,
                                level: student.level
                              })
                            })

                            if (response.ok) {
                              const result = await response.json()
                              // Refresh lessons list and redirect to lesson view
                              await fetchLessons()
                              // Navigate to the new lesson
                              router.push(`/lessons/${result.data.id}`)
                            } else {
                              const errorData = await response.json()
                              alert(`Error: ${errorData.error || 'Failed to generate lesson'}`)
                            }
                          } catch (err) {
                            console.error('Error generating lesson:', err)
                            alert('Failed to generate lesson. Please try again.')
                          } finally {
                            setIsGeneratingInstantLesson(false)
                          }
                        }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Lesson Topic <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={instantGrammarTopic}
                            onChange={(e) => setInstantGrammarTopic(e.target.value)}
                            placeholder="e.g., Present Perfect, Ordering Food, Business Negotiations..."
                            disabled={isGeneratingInstantLesson}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50"
                            required
                          />
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Enter any topic you&apos;d like to teach. The lesson will be customized to the student&apos;s level and context.
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Description (Optional)
                          </label>
                          <textarea
                            value={instantLessonDescription}
                            onChange={(e) => setInstantLessonDescription(e.target.value)}
                            placeholder="Add more context about what you want to focus on in this lesson..."
                            disabled={isGeneratingInstantLesson}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 resize-none"
                          />
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Provide additional details to help customize the lesson content.
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Duration <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={instantLessonDuration}
                            onChange={(e) => setInstantLessonDuration(Number(e.target.value) as 25 | 50)}
                            disabled={isGeneratingInstantLesson}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                          >
                            <option value={25}>25 minutes</option>
                            <option value={50}>50 minutes</option>
                          </select>
                        </div>

                        <button
                          type="submit"
                          disabled={isGeneratingInstantLesson || !instantGrammarTopic.trim()}
                          className="w-full bg-brand-primary text-white px-6 py-3 rounded-lg hover:bg-brand-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                        >
                          {isGeneratingInstantLesson ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Generating Lesson...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              <span>Generate Lesson</span>
                            </>
                          )}
                        </button>
                      </form>
                    </div>

                    {/* Example Topics */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Example Topics for {getLanguageLabel(student.targetLanguage)}:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                          <li>• Grammar: Present Perfect, Conditionals</li>
                          <li>• Conversation: Ordering Food, Job Interviews</li>
                          <li>• Business: Negotiations, Presentations</li>
                        </ul>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                          <li>• Travel: At the Airport, Booking Hotels</li>
                          <li>• Academic: Writing Essays, Discussions</li>
                          <li>• Daily Life: Shopping, Making Appointments</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

                {/* No Student Found */}
        {!loading && !student && !error && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
              Student not found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              The student you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
            </p>
            <div className="mt-6">
              <Link
                href="/dashboard/students"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-accent"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Students
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
'use client'

import { useState, useEffect, useCallback } from 'react'

// ---------------------------------------------------------------------------
// Generic recursive editor for lesson data
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EditableValue = any

interface EditSectionModalProps {
  /** Modal title shown at the top */
  title: string
  /** The data to edit — can be an array of objects, an object, or a simple value */
  data: EditableValue
  /** Called with the edited data when the user saves */
  onSave: (updated: EditableValue) => void
  /** Called when the modal is dismissed */
  onCancel: () => void
  /** Optional field labels (key → human label) */
  fieldLabels?: Record<string, string>
  /** Fields to hide from editing (e.g. "id") */
  hiddenFields?: string[]
  /** Fields that should be read-only */
  readOnlyFields?: string[]
}

// Human-friendly labels for common lesson fields
const DEFAULT_LABELS: Record<string, string> = {
  term: 'Term / Phrase',
  type: 'Type',
  definition: 'Definition',
  meaning: 'Meaning',
  exampleSentence: 'Example Sentence',
  question: 'Question',
  answer: 'Answer',
  followUp: 'Follow-Up',
  sentence: 'Sentence',
  prompt: 'Prompt',
  task: 'Task',
  word: 'Word',
  example: 'Example',
  partOfSpeech: 'Part of Speech',
  title: 'Title',
  description: 'Description',
  instructions: 'Instructions',
  setting: 'Setting',
  scenario: 'Scenario',
  speaker: 'Speaker',
  character: 'Character',
  line: 'Line',
  incorrect: 'Incorrect Sentence',
  correct: 'Correct Sentence',
  errorType: 'Error Type',
}

function labelFor(key: string, custom?: Record<string, string>): string {
  if (custom?.[key]) return custom[key]
  if (DEFAULT_LABELS[key]) return DEFAULT_LABELS[key]
  // Convert camelCase to Title Case
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim()
}

// Decide if a value should render as textarea (multi-line) or input
function isLongText(value: string): boolean {
  return value.length > 60 || value.includes('\n')
}

// ---------------------------------------------------------------------------
// Recursive field renderer
// ---------------------------------------------------------------------------

function FieldEditor({
  label,
  value,
  onChange,
  readOnly,
  fieldLabels,
  hiddenFields,
  readOnlyFields,
  depth = 0,
}: {
  label: string
  value: EditableValue
  onChange: (v: EditableValue) => void
  readOnly?: boolean
  fieldLabels?: Record<string, string>
  hiddenFields?: string[]
  readOnlyFields?: string[]
  depth?: number
}) {
  if (value === null || value === undefined) return null

  // String
  if (typeof value === 'string') {
    return (
      <div className="mb-3">
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
          {label}
        </label>
        {isLongText(value) ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            readOnly={readOnly}
            rows={Math.min(6, Math.max(2, value.split('\n').length + 1))}
            className={`w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-y ${readOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            readOnly={readOnly}
            className={`w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent ${readOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
          />
        )}
      </div>
    )
  }

  // Number
  if (typeof value === 'number') {
    return (
      <div className="mb-3">
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
          {label}
        </label>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          readOnly={readOnly}
          className={`w-32 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent ${readOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
        />
      </div>
    )
  }

  // Boolean
  if (typeof value === 'boolean') {
    return (
      <div className="mb-3 flex items-center gap-2">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          disabled={readOnly}
          className="rounded border-gray-300 dark:border-gray-600 text-brand-primary focus:ring-brand-primary"
        />
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          {label}
        </label>
      </div>
    )
  }

  // Array of items
  if (Array.isArray(value)) {
    return (
      <div className="mb-3">
        {depth === 0 && value.length > 0 && typeof value[0] === 'object' && (
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
            {label} ({value.length} items)
          </label>
        )}
        <div className="space-y-3">
          {value.map((item, idx) => (
            <div
              key={idx}
              className="relative border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800/50"
            >
              <span className="absolute -top-2.5 left-3 bg-gray-50 dark:bg-gray-800 px-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                #{idx + 1}
              </span>
              <FieldEditor
                label=""
                value={item}
                onChange={(updated) => {
                  const copy = [...value]
                  copy[idx] = updated
                  onChange(copy)
                }}
                readOnly={readOnly}
                fieldLabels={fieldLabels}
                hiddenFields={hiddenFields}
                readOnlyFields={readOnlyFields}
                depth={depth + 1}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Object with keys
  if (typeof value === 'object') {
    const keys = Object.keys(value).filter((k) => !hiddenFields?.includes(k))
    return (
      <div className={depth > 0 ? '' : 'mb-3'}>
        {label && depth === 0 && (
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
            {label}
          </label>
        )}
        {keys.map((key) => (
          <FieldEditor
            key={key}
            label={labelFor(key, fieldLabels)}
            value={(value as Record<string, EditableValue>)[key]}
            onChange={(updated) => {
              onChange({ ...value, [key]: updated })
            }}
            readOnly={readOnly || readOnlyFields?.includes(key)}
            fieldLabels={fieldLabels}
            hiddenFields={hiddenFields}
            readOnlyFields={readOnlyFields}
            depth={depth + 1}
          />
        ))}
      </div>
    )
  }

  return null
}

// ---------------------------------------------------------------------------
// Modal wrapper
// ---------------------------------------------------------------------------

export default function EditSectionModal({
  title,
  data,
  onSave,
  onCancel,
  fieldLabels,
  hiddenFields = ['id'],
  readOnlyFields,
}: EditSectionModalProps) {
  const [editedData, setEditedData] = useState<EditableValue>(data)
  const [saving, setSaving] = useState(false)

  // Sync if data prop changes
  useEffect(() => {
    setEditedData(data)
  }, [data])

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    },
    [onCancel]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(editedData)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-primary/10 text-brand-primary rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <FieldEditor
            label=""
            value={editedData}
            onChange={setEditedData}
            fieldLabels={fieldLabels}
            hiddenFields={hiddenFields}
            readOnlyFields={readOnlyFields}
            depth={0}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 shrink-0">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-sm font-medium text-white bg-brand-primary rounded-lg hover:bg-brand-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving && <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Edit pencil button — placed next to section headers
// ---------------------------------------------------------------------------

export function EditButton({ onClick, label = 'Edit' }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors group"
    >
      <svg className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

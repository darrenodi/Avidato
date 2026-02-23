import React from 'react'

/**
 * Convert markdown-style **bold** to React <strong> elements.
 * Safe — no dangerouslySetInnerHTML. Works with mixed text.
 *
 * Usage:
 *   <FormattedText text="This is **bold** text" />
 *   or
 *   {formatText("This is **bold** text")}
 */

/** Parse **bold** markers in a string and return React nodes */
export function formatText(text: string | null | undefined): React.ReactNode {
  if (!text) return ''
  const str = String(text)
  const parts = str.split(/\*\*(.*?)\*\*/g)
  if (parts.length === 1) return str // no bold markers
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  )
}

/** Component version for JSX convenience */
export function FormattedText({ text, className }: { text: string | null | undefined; className?: string }) {
  if (className) {
    return <span className={className}>{formatText(text)}</span>
  }
  return <>{formatText(text)}</>
}

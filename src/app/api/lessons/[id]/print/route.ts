import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

// ── HTML escape ──────────────────────────────────────────────────────────────
function e(s: unknown): string {
  if (s == null) return ''
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// ── Inline logo ───────────────────────────────────────────────────────────────
const LOGO_WHITE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 328 326" width="30" height="30" style="flex-shrink:0;vertical-align:middle"><path fill="none" d="M-0.5-0.5h328v326h-328z"/><path fill="#fff" d="M 46.5,299.5 C 41.9898,299.884 37.6565,300.551 33.5,301.5C 30.8333,301.5 28.1667,301.5 25.5,301.5C 20.9677,301.818 16.6344,301.485 12.5,300.5C 72.4733,204.184 132.473,107.851 192.5,11.5C 205.162,29.0046 217.662,46.6712 230,64.5C 230.667,65.5 230.667,66.5 230,67.5C 193,127.167 156,186.833 119,246.5C 102.045,273.945 77.8783,291.611 46.5,299.5 Z"/><path fill="#fff" d="M 245.5,87.5 C 246.496,87.4142 247.329,87.7476 248,88.5C 258.386,101.931 266.719,116.597 273,132.5C 276.256,142.943 277.256,153.609 276,164.5C 274.861,167.583 273.528,170.583 272,173.5C 271.097,174.701 269.931,175.535 268.5,176C 242.494,176.833 216.494,176.667 190.5,175.5C 208.86,146.149 227.193,116.816 245.5,87.5 Z"/><path fill="#fff" d="M 231.5,199.5 C 257.522,198.843 283.188,199.509 308.5,201.5C 295.453,231.388 276.453,256.888 251.5,278C 228.946,294.769 203.613,304.602 175.5,307.5C 132.997,307.832 90.6634,307.499 48.5,306.5C 72.4088,304.148 93.7421,295.648 112.5,281C 124.107,270.399 134.607,258.899 144,246.5C 163.777,223.029 188.61,207.863 218.5,201C 222.848,200.535 227.181,200.035 231.5,199.5 Z"/></svg>`

// ── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
  font-size: 10pt; line-height: 1.45; color: #374151;
  background: white; padding: 18mm;
  max-width: 210mm; margin: 0 auto;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
@page { margin: 14mm 18mm; size: A4; }
@media print {
  body { padding: 0; }
  .pagebreak { page-break-before: always; }
  .avoid-break { page-break-inside: avoid; }
}

/* Cover */
.cover { background: #1a3a5c; color: white; padding: 14px 16px 14px; border-radius: 4px; margin-bottom: 12px; }
.cover-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.cover-brand { display: flex; align-items: center; gap: 8px; }
.cover-brand-name { font-size: 10.5pt; font-weight: 700; letter-spacing: .1em; color: white; text-transform: uppercase; }
.copy-badge { background: rgba(255,255,255,0.15); color: white; font-size: 7.5pt; font-weight: 700; padding: 3px 10px; border-radius: 10px; text-transform: uppercase; letter-spacing: .07em; white-space: nowrap; }
.cover-title { font-size: 19pt; font-weight: 700; color: white; line-height: 1.25; margin-bottom: 6px; }
.cover-meta { font-size: 9.5pt; color: #BDD7EE; }

/* Objective box */
.objective-box { background: #F3F4F6; border: 1px solid #DEEAF1; padding: 9px 13px; border-radius: 4px; margin-bottom: 12px; font-size: 9.5pt; color: #374151; }

/* Info table */
.info-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
.info-table td { padding: 5px 10px; font-size: 9pt; border: 0.5px solid #DEEAF1; vertical-align: middle; }
.info-label { font-weight: 700; color: #1a3a5c; background: #F0F4F8; width: 22%; }

/* Timing table */
.timing-table { width: 100%; border-collapse: collapse; margin-bottom: 14px; }
.timing-table thead tr th { background: #1a3a5c; color: white; font-size: 8.5pt; padding: 5px 10px; text-align: left; font-weight: 600; letter-spacing: .03em; }
.timing-table td { padding: 5px 10px; font-size: 9pt; border-bottom: 0.5px solid #E5E7EB; }
.timing-table tr:nth-child(even) td { background: #F9FAFB; }
.timing-row-num { color: #9CA3AF; font-size: 8.5pt; text-align: center; width: 24px; }
.timing-row-total td { font-weight: 700; background: #EBF3FA !important; border-top: 1.5px solid #1a3a5c; }
.timing-right { text-align: right !important; white-space: nowrap; }

/* Section header */
.section-header { width: 100%; border-collapse: collapse; border: 1px solid #DEEAF1; border-radius: 4px; overflow: hidden; margin-bottom: 10px; }
.section-header td { padding: 8px 11px; vertical-align: middle; }
.section-num { background: #1a3a5c; color: white; font-weight: 700; font-size: 12pt; text-align: center; width: 28px; }
.section-title-cell { background: #EBF3FA; font-weight: 700; font-size: 12pt; color: #1a3a5c; }
.section-time-cell { background: #EBF3FA; text-align: right; font-size: 9pt; color: #9CA3AF; white-space: nowrap; width: 52px; }

/* Vocab card */
.vocab-card { border: 1px solid #E5E7EB; border-radius: 4px; padding: 10px 12px; margin-bottom: 8px; background: white; }
.vocab-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
.vocab-word { font-size: 11pt; font-weight: 700; color: #1a3a5c; }
.vocab-phon { font-size: 9pt; font-weight: 400; font-style: italic; color: #9CA3AF; margin-left: 6px; }
.pos-pill { background: #DBEAFE; border: 0.5px solid #2E75B6; color: #2E75B6; font-size: 8pt; padding: 2px 7px; border-radius: 10px; white-space: nowrap; }
.vocab-def { font-size: 9.5pt; color: #374151; margin-bottom: 4px; }
.vocab-ex { font-size: 9pt; font-style: italic; color: #9CA3AF; margin-bottom: 2px; }
.vocab-syn { font-size: 8.5pt; color: #9CA3AF; }

/* Vocab match table */
.match-group-label { font-size: 9pt; font-weight: 700; color: #1a3a5c; margin: 8px 0 4px; text-transform: uppercase; letter-spacing: .04em; }
.match-table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
.match-table td { padding: 7px 10px; border: 0.5px solid #E5E7EB; font-size: 9.5pt; vertical-align: top; }
.match-table tr:nth-child(odd) td { background: #F9FAFB; }
.match-num { color: #2E75B6; font-weight: 700; width: 24px; }
.match-term { font-weight: 500; color: #1a3a5c; width: 42%; }
.match-def { color: #374151; }

/* Dialogue */
.dialogue-row { display: grid; grid-template-columns: 68px 1fr; gap: 8px; padding: 4px 0; }
.dialogue-speaker { font-size: 9.5pt; font-weight: 700; padding-top: 1px; }
.dialogue-text { font-size: 9.5pt; color: #374151; line-height: 1.5; }

/* Note / tutor box */
.note-box { display: grid; grid-template-columns: 56px 1fr; border: 1px solid #F59E0B; border-radius: 4px; overflow: hidden; margin: 8px 0; }
.note-label { background: #FFFBEB; color: #92400E; font-size: 7.5pt; font-weight: 700; text-transform: uppercase; padding: 8px; border-right: 1px solid #F59E0B; display: flex; align-items: flex-start; }
.note-body { background: #FFFBEB; color: #92400E; font-size: 9pt; padding: 8px 9px; line-height: 1.5; }

/* Phrases */
.phrase-item { color: #1D4ED8; font-weight: 700; font-style: italic; font-size: 9.5pt; padding: 2px 0 2px 14px; line-height: 1.5; }
.phrase-fn { color: #374151; font-style: normal; font-weight: 400; font-size: 8.5pt; margin-left: 4px; }

/* Expression drill table */
.expr-drill-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
.expr-drill-table thead th { background: #1a3a5c; color: white; font-size: 8.5pt; padding: 6px 10px; text-align: left; font-weight: 600; letter-spacing: .03em; }
.expr-drill-table tbody td { padding: 8px 10px; border-bottom: 0.5px solid #E5E7EB; font-size: 9.5pt; vertical-align: middle; }
.expr-drill-table tbody tr:nth-child(odd) td { background: #F9FAFB; }
.expr-stem { color: #1D4ED8; font-weight: 700; font-style: italic; }
.expr-write { border-bottom: 1px solid #D1D5DB; min-height: 18px; display: block; }

/* Numbered questions */
.numbered-q { display: grid; grid-template-columns: 18px 1fr; gap: 5px; padding: 4px 0; align-items: start; }
.q-num { color: #2E75B6; font-weight: 700; font-size: 10pt; }
.q-text { font-size: 9.5pt; color: #374151; line-height: 1.5; }

/* Bullet */
.bullet-item { padding: 2px 0 2px 14px; font-size: 9.5pt; color: #374151; line-height: 1.5; }

/* Corrections */
.correction-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
.correction-table th { background: #1a3a5c; color: white; font-size: 9pt; padding: 6px 10px; text-align: left; }
.correction-table td { padding: 7px 10px; font-size: 9.5pt; border-bottom: 0.5px solid #E5E7EB; vertical-align: top; }
.correction-table tr:nth-child(odd) td { background: #F9FAFB; }
.incorrect-text { text-decoration: line-through; color: #EF4444; }
.correct-text { color: #166534; font-weight: 500; }
.error-type { color: #374151; font-size: 8.5pt; }

/* Gap fill */
.gap-sentence { font-size: 9.5pt; padding: 5px 0 5px 14px; color: #374151; line-height: 1.6; }
.gap-answer { color: #1D4ED8; font-weight: 700; }

/* Roleplay */
.role-card { margin-bottom: 6px; }
.role-name { background: #F3F4F6; padding: 6px 10px; font-weight: 700; font-size: 10pt; border-radius: 3px 3px 0 0; margin-bottom: 0; }
.role-blue { color: #2E75B6; }
.role-navy { color: #1a3a5c; }

/* Debate / two-col */
.debate-grid { width: 100%; border-collapse: separate; border-spacing: 8px 0; margin-bottom: 8px; display: table; }
.debate-col-a { display: table-cell; width: 50%; background: #EFF6FF; border: 1px solid #2E75B6; border-radius: 4px; padding: 10px 12px; vertical-align: top; }
.debate-col-b { display: table-cell; width: 50%; background: #FFFBEB; border: 1px solid #F59E0B; border-radius: 4px; padding: 10px 12px; vertical-align: top; }
.debate-label { font-size: 9pt; font-weight: 700; color: #2E75B6; margin-bottom: 6px; }
.debate-label-b { color: #92400E; }

/* HR */
.hr { border: none; border-top: 1px solid #DEEAF1; margin: 12px 0; }
.spacer { height: 8px; }
.h2 { font-size: 12pt; font-weight: 700; color: #1a3a5c; margin-bottom: 8px; margin-top: 14px; }
.italic { font-style: italic; font-size: 9.5pt; color: #374151; margin-bottom: 8px; }
.bold { font-weight: 700; font-size: 9.5pt; margin-bottom: 5px; }
.small-gray { font-size: 8.5pt; color: #9CA3AF; }

/* Post-lesson notes (tutor only) */
.notes-section { border: 1px solid #DEEAF1; border-radius: 4px; overflow: hidden; margin-top: 20px; }
.notes-section-hdr { background: #1a3a5c; color: white; font-size: 10pt; font-weight: 700; padding: 8px 14px; }
.notes-row { padding: 10px 14px; border-bottom: 0.5px solid #DEEAF1; }
.notes-row:last-child { border-bottom: none; }
.notes-row-label { font-size: 8pt; font-weight: 700; color: #1a3a5c; margin-bottom: 8px; text-transform: uppercase; letter-spacing: .05em; }

/* Phrase reference card */
.phrase-ref-section { border: 1px solid #DBEAFE; border-radius: 4px; overflow: hidden; margin-top: 0; }
.phrase-ref-hdr { background: #2E75B6; color: white; font-size: 10pt; font-weight: 700; padding: 8px 14px; }
.phrase-ref-table { width: 100%; border-collapse: collapse; }
.phrase-ref-item { width: 50%; padding: 6px 12px; font-size: 9pt; border-bottom: 0.5px solid #DBEAFE; vertical-align: top; }
.phrase-ref-item:first-child { border-right: 0.5px solid #DBEAFE; }
.phrase-ref-phrase { color: #1D4ED8; font-weight: 700; font-style: italic; }
.phrase-ref-note { color: #6B7280; font-size: 8pt; font-weight: 400; font-style: normal; display: block; margin-top: 1px; }

/* Footer */
.page-footer { margin-top: 20px; padding-top: 10px; border-top: 1px solid #DEEAF1; font-size: 8pt; color: #9CA3AF; display: flex; justify-content: space-between; align-items: center; }
.footer-brand { font-weight: 700; color: #1a3a5c; letter-spacing: .06em; font-size: 8pt; }
`

// ── Primitive helpers ─────────────────────────────────────────────────────────
function sectionHeader(num: number, title: string, timeMin: number): string {
  return `<table class="section-header avoid-break"><tr>
    <td class="section-num">${num}</td>
    <td class="section-title-cell">${e(title)}</td>
    <td class="section-time-cell">${timeMin} min</td>
  </tr></table>`
}

function noteBox(label: string, body: string): string {
  return `<div class="note-box avoid-break"><div class="note-label">${e(label)}</div><div class="note-body">${e(body)}</div></div>`
}

function phraseItem(text: string, fn?: string): string {
  return `<div class="phrase-item">"${e(text)}"${fn ? `<span class="phrase-fn">— ${e(fn)}</span>` : ''}</div>`
}

function numberedQ(num: number, text: string): string {
  return `<div class="numbered-q"><span class="q-num">${num}.</span><span class="q-text">${e(text)}</span></div>`
}

function bulletItem(text: string): string {
  return `<div class="bullet-item">• ${e(text)}</div>`
}

function vocabCard(word: string, pos: string, phonetics: string, definition: string, example: string, synonym?: string): string {
  return `<div class="vocab-card avoid-break">
  <div class="vocab-header">
    <span class="vocab-word">${e(word)}<span class="vocab-phon">${e(phonetics)}</span></span>
    ${pos ? `<span class="pos-pill">${e(pos)}</span>` : ''}
  </div>
  <div class="vocab-def">${e(definition)}</div>
  <div class="vocab-ex">"${e(example)}"</div>
  ${synonym ? `<div class="vocab-syn">≈ ${e(synonym)}</div>` : ''}
</div>`
}

function dialogueRow(speaker: string, text: string, isStudent: boolean): string {
  const color = isStudent ? '#1a3a5c' : '#2E75B6'
  return `<div class="dialogue-row">
  <div class="dialogue-speaker" style="color:${color}">${e(speaker)}</div>
  <div class="dialogue-text">${e(text)}</div>
</div>`
}

function writeLine(): string {
  return `<div style="border-bottom:1px solid #D1D5DB;margin:4px 0 10px;height:18px"></div>`
}

// ── Timing table (tutor only) ─────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildTimingTable(modules: Record<string, any>[]): string {
  let rows = ''
  let cumulative = 0
  modules.forEach((mod, i) => {
    const time: number = mod.timeMinutes || 0
    cumulative += time
    rows += `<tr>
      <td class="timing-row-num">${i + 1}</td>
      <td>${e(mod.title || mod.type || '')}</td>
      <td class="timing-right">${time} min</td>
      <td class="timing-right" style="color:#9CA3AF">${cumulative} min</td>
    </tr>`
  })
  return `<div class="avoid-break" style="margin-bottom:16px">
    <div style="font-size:8.5pt;font-weight:700;color:#1a3a5c;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Lesson Timing</div>
    <table class="timing-table">
      <thead><tr><th>#</th><th>Module</th><th style="text-align:right">Time</th><th style="text-align:right">Cumulative</th></tr></thead>
      <tbody>${rows}
        <tr class="timing-row-total">
          <td colspan="2" style="font-size:9pt">Total</td>
          <td class="timing-right" style="font-size:9pt">${cumulative} min</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>`
}

// ── Phrase reference card ─────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildPhraseRefCard(modules: Record<string, any>[]): string {
  const items: { text: string; note: string }[] = []

  for (const mod of modules) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c: Record<string, any> = mod.content || {}
    const type: string = mod.type || ''

    if (['useful-language', 'useful-phrases'].includes(type)) {
      const list: unknown[] = Array.isArray(c.phrases) ? c.phrases : []
      list.forEach((p) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pp = p as Record<string, any>
        const text: string = typeof p === 'string' ? p : (pp.phrase || pp.expression || '')
        const note: string = typeof p === 'object' && p !== null ? (pp.usage || pp.function || pp.example || '') : ''
        if (text) items.push({ text, note })
      })
    } else if (type === 'useful-expressions') {
      const list: unknown[] = Array.isArray(c.expressions) ? c.expressions : []
      list.forEach((p) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pp = p as Record<string, any>
        const text: string = typeof p === 'string' ? p : (pp.full || pp.expression || pp.phrase || '')
        if (text) items.push({ text, note: '' })
      })
    } else if (type === 'language-in-context') {
      const list: unknown[] = Array.isArray(c.phrases) ? c.phrases : []
      list.forEach((p) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pp = p as Record<string, any>
        const text: string = typeof p === 'string' ? p : (pp.phrase || '')
        const note: string = typeof p === 'object' && p !== null ? (pp.function || '') : ''
        if (text) items.push({ text, note })
      })
    } else if (type === 'phrasal-verbs') {
      const list: unknown[] = Array.isArray(c.pairs) ? c.pairs : []
      list.forEach((p) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pp = p as Record<string, any>
        if (pp.verb) items.push({ text: pp.verb, note: pp.meaning || '' })
      })
    }
  }

  if (items.length === 0) return ''

  // Pad to even count for table rows
  if (items.length % 2 !== 0) items.push({ text: '', note: '' })

  const cell = (item: { text: string; note: string }) =>
    item.text
      ? `<td class="phrase-ref-item"><span class="phrase-ref-phrase">${e(item.text)}</span>${item.note ? `<span class="phrase-ref-note">${e(item.note)}</span>` : ''}</td>`
      : `<td class="phrase-ref-item"></td>`

  let tableRows = ''
  for (let i = 0; i < items.length; i += 2) {
    tableRows += `<tr>${cell(items[i])}${cell(items[i + 1])}</tr>`
  }

  return `<div class="pagebreak">
  <div class="phrase-ref-section">
    <div class="phrase-ref-hdr">Key Language Reference</div>
    <table class="phrase-ref-table">${tableRows}</table>
  </div>
</div>`
}

// ── Module renderers ──────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderModule(mod: Record<string, any>, idx: number, studentName: string, tutorCopy: boolean): string {
  const type: string = mod.type || ''
  const title: string = mod.title || mod.type || ''
  const time: number = mod.timeMinutes || 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c: Record<string, any> = mod.content || {}

  let body = ''

  // ── Warm-up / Lead-in ──
  if (['warm-up', 'warmup', 'lead-in', 'warmer'].includes(type)) {
    const qs: string[] = Array.isArray(c.questions) ? c.questions : (Array.isArray(c.prompts) ? c.prompts : [])
    body = qs.map((q, i) => numberedQ(i + 1, q)).join('')
  }

  // ── Vocabulary cards ──
  else if (['vocabulary-cards', 'vocabulary'].includes(type)) {
    const vocab: unknown[] = Array.isArray(c.vocabulary) ? c.vocabulary : []
    body = vocab.map((v) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vv = v as Record<string, any>
      return vocabCard(vv.word || vv.term || '', vv.partOfSpeech || vv.pos || '', vv.phonetics || '', vv.definition || '', vv.example || '', vv.synonym)
    }).join('')
  }

  // ── Vocabulary match ──
  // Both copies use the same two-column matching layout.
  // Tutor copy: answer letters filled in. Student copy: blank answer column.
  else if (type === 'vocabulary-match') {
    const groups: unknown[] = Array.isArray(c.groups) ? c.groups : []
    body = groups.map((g) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const gg = g as Record<string, any>
      const pairs: unknown[] = Array.isArray(gg.pairs) ? gg.pairs : []
      const n = pairs.length
      if (n === 0) return ''
      const offset = 2
      const scrambledDefs = pairs.map((_, j) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pp = pairs[(j + offset) % n] as Record<string, any>
        return pp.definition || pp.match || ''
      })
      const termRows = pairs.map((p, i) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pp = p as Record<string, any>
        const answerLetterIdx = (i - offset + n) % n
        const answerLetter = String.fromCharCode(65 + answerLetterIdx)
        const answerCell = tutorCopy
          ? `<td style="width:28px;text-align:center;font-weight:700;color:#166534;border:0.5px solid #E5E7EB">${answerLetter}</td>`
          : `<td style="width:28px;text-align:center;color:#9CA3AF;border:0.5px solid #E5E7EB">___</td>`
        const rawSentence: string = pp.sentence || pp.term || pp.word || ''
        const rawTerm: string = pp.term || pp.word || ''
        let display: string
        if (rawSentence && rawTerm && rawSentence !== rawTerm) {
          const esc = e(rawSentence)
          const escTerm = e(rawTerm).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          display = esc.replace(new RegExp(escTerm, 'i'), m => `<strong style="color:#1a3a5c">${m}</strong>`)
        } else {
          display = e(rawSentence)
        }
        return `<tr><td class="match-num">${i + 1}</td><td style="font-size:9pt;padding:6px 8px;border:0.5px solid #E5E7EB">${display}</td>${answerCell}</tr>`
      }).join('')
      const defRows = scrambledDefs.map((def, j) => {
        const letter = String.fromCharCode(65 + j)
        return `<tr><td class="match-num" style="color:#92400E">${letter}</td><td class="match-def" colspan="2">${e(def)}</td></tr>`
      }).join('')
      return `<div class="match-group-label">${e(gg.label || '')}</div>
<table style="width:100%;border-collapse:collapse;margin-bottom:10px">
  <tr>
    <td style="width:65%;vertical-align:top;padding-right:8px">
      <div style="font-size:8pt;color:#9CA3AF;margin-bottom:4px;text-transform:uppercase;letter-spacing:.04em">Sentences — ${tutorCopy ? 'answer key' : 'write the matching letter'}</div>
      <table class="match-table">${termRows}</table>
    </td>
    <td style="width:35%;vertical-align:top;padding-left:8px">
      <div style="font-size:8pt;color:#9CA3AF;margin-bottom:4px;text-transform:uppercase;letter-spacing:.04em">Definitions</div>
      <table class="match-table">${defRows}</table>
    </td>
  </tr>
</table>`
    }).join('')
  }

  // ── Useful expressions (stem-completion drill) ──
  // Same table layout for both copies — tutor sees full answer, student sees blank.
  else if (type === 'useful-expressions') {
    const context: string = c.context || ''
    if (context) body += `<p class="italic">${e(context)}</p><div class="spacer"></div>`
    const expressions: unknown[] = Array.isArray(c.expressions) ? c.expressions : []
    body += `<table class="expr-drill-table">
      <thead><tr>
        <th>Complete the expression</th>
        <th style="width:38%">${tutorCopy ? 'Answer' : 'Finish writing it here'}</th>
      </tr></thead>
      <tbody>`
    expressions.forEach((exp) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ex = exp as Record<string, any>
      const stem: string = ex.stem || ex.full || ''
      const full: string = ex.full || ex.expression || ''
      // Extract only the completion part (text after the stem up to the end)
      const stemBase = stem.replace(/\.+$/, '').trim()
      const completion = full.length > stemBase.length ? full.slice(stemBase.length).trim() : full
      body += `<tr>
        <td><span class="expr-stem">${e(stem)}</span></td>
        <td>${tutorCopy ? `<span style="color:#166534;font-weight:700">${e(completion || full)}</span>` : '<span class="expr-write"></span>'}</td>
      </tr>`
    })
    body += `</tbody></table>`
  }

  // ── Useful phrases / useful language / language-in-context / phrasal-verbs ──
  else if (['useful-language', 'useful-phrases', 'language-in-context', 'phrasal-verbs'].includes(type)) {
    const context: string = c.context || ''
    if (context) body += `<p class="italic">${e(context)}</p>`
    const phrases: unknown[] = Array.isArray(c.phrases) ? c.phrases : (Array.isArray(c.pairs) ? c.pairs : [])
    phrases.forEach((p) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pp = p as Record<string, any>
      body += phraseItem(pp.phrase || pp.expression || pp.verb || '', pp.function || pp.usage || pp.meaning || '')
    })
  }

  // ── Dialogue / fill-in-blanks-dialogue ──
  else if (['dialogue', 'fill-in-blanks-dialogue'].includes(type)) {
    const dl = c.dialogue || c.modelDialogue || {}
    const setting: string = dl.setting || c.setting || ''
    if (setting) body += `<p class="italic">${e(setting)}</p><div class="spacer"></div>`
    const lines: unknown[] = Array.isArray(dl.dialogue) ? dl.dialogue : (Array.isArray(c.dialogue) ? c.dialogue : [])
    lines.forEach((l) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ll = l as Record<string, any>
      const speaker: string = ll.character || ll.speaker || ''
      const isStudent = speaker.toLowerCase().includes(studentName.toLowerCase())
      body += dialogueRow(speaker, ll.text || ll.line || '', isStudent)
    })
    if (c.teachingNotes || dl.noticingTask) {
      body += noteBox('Tutor note', c.teachingNotes || dl.noticingTask || '')
    }
  }

  // ── Task prep (TBLT) ──
  else if (type === 'task-prep') {
    const vocab: unknown[] = Array.isArray(c.vocabulary) ? c.vocabulary : []
    if (vocab.length) {
      body += `<p class="bold">Vocabulary</p>`
      vocab.forEach((v) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const vv = v as Record<string, any>
        body += vocabCard(vv.word || '', vv.partOfSpeech || '', vv.phonetics || '', vv.definition || '', vv.example || '', vv.synonym)
      })
    }
    const phrases: unknown[] = Array.isArray(c.keyPhrases) ? c.keyPhrases : []
    if (phrases.length) {
      body += `<p class="bold">Key Phrases</p>`
      phrases.forEach((p) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pp = p as Record<string, any>
        body += phraseItem(pp.phrase || '', pp.function || pp.usage || '')
      })
    }
    const dl = c.modelDialogue
    if (dl) {
      body += `<p class="bold">Model Dialogue</p>`
      if (dl.setting) body += `<p class="italic">${e(dl.setting)}</p><div class="spacer"></div>`
      const lines: unknown[] = Array.isArray(dl.dialogue) ? dl.dialogue : []
      lines.forEach((l) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ll = l as Record<string, any>
        const speaker: string = ll.character || ll.speaker || ''
        body += dialogueRow(speaker, ll.text || '', speaker.toLowerCase().includes(studentName.toLowerCase()))
      })
    }
  }

  // ── Comprehension / matching-qa / skim / reading-scan / listening-comprehension ──
  else if (['comprehension', 'matching-qa', 'skim-main-idea', 'reading-scan', 'listening-comprehension'].includes(type)) {
    const rawPairs: unknown[] = Array.isArray(c.pairs) ? c.pairs : []
    const qs: unknown[] = Array.isArray(c.questions) ? c.questions : rawPairs
    qs.forEach((q, i) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const qq = q as Record<string, any>
      const text = typeof q === 'string' ? q : (qq.question || '')
      const answer = qq.answer || qq.correctAnswer || ''
      body += numberedQ(i + 1, text)
      if (tutorCopy && answer) body += `<div style="padding:1px 0 5px 23px;font-size:8.5pt;color:#9CA3AF">→ ${e(answer)}</div>`
      else if (!tutorCopy) body += writeLine()
    })
  }

  // ── Sentence correction ──
  else if (type === 'sentence-correction') {
    const sentences: unknown[] = Array.isArray(c.sentences) ? c.sentences : []
    if (tutorCopy) {
      body = `<table class="correction-table"><thead><tr><th>#</th><th>Incorrect</th><th>Correct</th><th>Error type</th></tr></thead><tbody>`
      sentences.forEach((s, i) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ss = s as Record<string, any>
        body += `<tr><td class="q-num">${i + 1}</td><td><span class="incorrect-text">${e(ss.incorrect || ss.sentence || '')}</span></td><td><span class="correct-text">${e(ss.correct || ss.correction || '')}</span></td><td class="error-type">${e(ss.errorType || ss.error_type || '')}</td></tr>`
      })
      body += '</tbody></table>'
    } else {
      body = `<table class="correction-table"><thead><tr><th>#</th><th>Find and correct the mistake</th><th>Your correction</th></tr></thead><tbody>`
      sentences.forEach((s, i) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ss = s as Record<string, any>
        body += `<tr><td class="q-num">${i + 1}</td><td>${e(ss.incorrect || ss.sentence || '')}</td><td>&nbsp;</td></tr>`
      })
      body += '</tbody></table>'
    }
  }

  // ── Find the mistake ──
  // Same table layout for both copies — tutor sees answers, student sees blank cells.
  else if (type === 'find-the-mistake') {
    const sentences: unknown[] = Array.isArray(c.sentences) ? c.sentences : []
    body = `<table class="correction-table"><thead><tr><th>#</th><th>Find and correct the mistake</th><th>${tutorCopy ? 'Correct' : 'Your correction'}</th>${tutorCopy ? '<th>Explanation</th>' : ''}</tr></thead><tbody>`
    sentences.forEach((s, i) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ss = s as Record<string, any>
      const incorrectCell = `<td>${e(ss.incorrect || ss.sentence || '')}</td>`
      const correctCell = tutorCopy
        ? `<td><span class="correct-text">${e(ss.correct || ss.correction || '')}</span></td>`
        : `<td>&nbsp;</td>`
      const explanationCell = tutorCopy
        ? `<td class="error-type">${e(ss.explanation || ss.errorType || '')}</td>`
        : ''
      body += `<tr><td class="q-num">${i + 1}</td>${incorrectCell}${correctCell}${explanationCell}</tr>`
    })
    body += '</tbody></table>'
  }

  // ── Grammar focus / post-task ──
  else if (['grammar-focus', 'post-task'].includes(type)) {
    const focus: string = c.grammarFocus || c.grammar_focus || c.topic || ''
    const explanation: string = c.explanation || ''
    if (focus) body += `<p class="bold">${e(focus)}</p>`
    if (explanation) body += `<p class="italic">${e(explanation)}</p>`
    const corrections: unknown[] = Array.isArray(c.corrections) ? c.corrections : []
    if (corrections.length) {
      if (tutorCopy) {
        body += `<table class="correction-table"><thead><tr><th>#</th><th>Error</th><th>Correction</th><th>Rule</th></tr></thead><tbody>`
        corrections.forEach((cor, i) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const cc = cor as Record<string, any>
          body += `<tr><td class="q-num">${i + 1}</td><td><span class="incorrect-text">${e(cc.error || cc.incorrect || '')}</span></td><td><span class="correct-text">${e(cc.correction || cc.correct || '')}</span></td><td class="error-type">${e(cc.rule || '')}</td></tr>`
        })
        body += '</tbody></table>'
      } else {
        body += `<table class="correction-table"><thead><tr><th>#</th><th>Correct this sentence</th><th>Your answer</th></tr></thead><tbody>`
        corrections.forEach((cor, i) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const cc = cor as Record<string, any>
          body += `<tr><td class="q-num">${i + 1}</td><td>${e(cc.error || cc.incorrect || '')}</td><td>&nbsp;</td></tr>`
        })
        body += '</tbody></table>'
      }
    }
    const examples: unknown[] = Array.isArray(c.examples) ? c.examples : []
    if (examples.length) {
      examples.forEach(ex => {
        // examples is {label, sentence} in modular lessons; plain string in legacy
        const text = typeof ex === 'object' && ex !== null
          ? `<strong>${e((ex as Record<string,string>).label || '')}</strong> ${e((ex as Record<string,string>).sentence || '')}`
          : e(String(ex))
        body += `<div class="bullet-item">• ${text}</div>`
      })
    }
    // grammar-focus table
    if (c.table && Array.isArray(c.table.headers) && Array.isArray(c.table.rows)) {
      body += `<table class="correction-table" style="margin-top:8px"><thead><tr>${c.table.headers.map((h: string) => `<th>${e(h)}</th>`).join('')}</tr></thead><tbody>`
      c.table.rows.forEach((row: string[]) => {
        body += `<tr>${row.map((cell: string) => `<td>${e(cell)}</td>`).join('')}</tr>`
      })
      body += `</tbody></table>`
    }
    // practice questions
    if (c.practice && Array.isArray(c.practice.questions)) {
      body += `<p class="bold" style="margin-top:8px">Practice</p>`
      c.practice.questions.forEach((q: Record<string, unknown>, i: number) => {
        const stem = String(q.stem || '')
        const options: string[] = Array.isArray(q.options) ? q.options as string[] : []
        body += numberedQ(i + 1, stem)
        options.forEach((opt, oi) => {
          const isAnswer = tutorCopy && q.answer === oi
          body += `<div style="padding:1px 0 2px 23px;font-size:9pt;color:${isAnswer ? '#166534' : '#374151'};font-weight:${isAnswer ? '700' : '400'}">${String.fromCharCode(65 + oi)}. ${e(opt)}</div>`
        })
      })
    }
  }

  // ── Gap fill ──
  else if (['gap-fill', 'complete-the-sentence'].includes(type)) {
    const sentences: unknown[] = Array.isArray(c.sentences) ? c.sentences : []
    sentences.forEach((s, i) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ss = s as Record<string, any>
      const sentence: string = ss.sentence || ss.incomplete || ''
      const answer: string = ss.answer || ss.word || ''
      const display = tutorCopy
        ? sentence.replace('___', `<span class="gap-answer">[${e(answer)}]</span>`)
        : sentence.replace('___', `<span style="display:inline-block;min-width:80px;border-bottom:1px solid #9CA3AF">&nbsp;</span>`)
      body += `<div class="gap-sentence">${i + 1}. ${display}</div>`
    })
  }

  // ── Roleplay / task-performance ──
  else if (['roleplay', 'task-performance'].includes(type)) {
    const scenario: string = c.scenario || c.situation || ''
    if (scenario) body += `<p class="italic">${e(scenario)}</p><div class="spacer"></div>`
    const roles: unknown[] = Array.isArray(c.roles) ? c.roles : []
    roles.forEach((r) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rr = r as Record<string, any>
      const isStudent = (rr.name || '').toLowerCase().includes(studentName.toLowerCase())
      const color = isStudent ? 'role-navy' : 'role-blue'
      body += `<div class="role-card avoid-break"><div class="role-name ${color}">${e(rr.name || '')}${rr.description ? ` — ${e(rr.description)}` : ''}</div>`
      const pts: string[] = Array.isArray(rr.keyPoints) ? rr.keyPoints : []
      pts.forEach(pt => { body += bulletItem(pt) })
      body += `</div>`
    })
    const phrases: string[] = Array.isArray(c.phrasesToUse) ? c.phrasesToUse : []
    if (phrases.length) {
      body += `<p class="bold" style="margin-top:8px">Phrases to use:</p>`
      phrases.forEach(p => { body += phraseItem(p) })
    }
  }

  // ── Talking point (two-card format) ──
  else if (type === 'talking-point') {
    const cards = [c.studentA, c.studentB].filter(Boolean)
    if (cards.length) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cards.forEach((card: Record<string, any>, ci) => {
        const cardColor = ci === 0 ? '#EFF6FF' : '#FFFBEB'
        const borderColor = ci === 0 ? '#2E75B6' : '#F59E0B'
        const labelColor = ci === 0 ? '#2E75B6' : '#92400E'
        body += `<div style="background:${cardColor};border:1px solid ${borderColor};border-radius:4px;padding:10px 12px;margin-bottom:8px" class="avoid-break">`
        if (card.title) body += `<p style="font-size:9pt;font-weight:700;color:${labelColor};text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px">${e(card.title)}</p>`
        const qs: string[] = Array.isArray(card.questions) ? card.questions : []
        qs.forEach((q, i) => { body += numberedQ(i + 1, q) })
        body += `</div>`
      })
    } else {
      const qs: string[] = Array.isArray(c.questions) ? c.questions : []
      if (c.instructions) body += `<p class="italic">${e(c.instructions)}</p>`
      qs.forEach((q, i) => { body += numberedQ(i + 1, q) })
    }
  }

  // ── Discussion / further-discussion ──
  else if (['discussion', 'further-discussion'].includes(type)) {
    const qs: string[] = Array.isArray(c.questions) ? c.questions : (Array.isArray(c.points) ? c.points : [])
    if (c.instructions) body += `<p class="italic">${e(c.instructions)}</p>`
    qs.forEach((q, i) => { body += numberedQ(i + 1, q) })
  }

  // ── Debate ──
  else if (type === 'debate') {
    const topic: string = c.topic || ''
    if (topic) body += `<p class="bold">${e(topic)}</p><div class="spacer"></div>`
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sideAData: any = c.sideA || c.side_a || {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sideBData: any = c.sideB || c.side_b || {}
    const sideALabel: string = typeof sideAData === 'string' ? sideAData : (sideAData.label || 'Side A')
    const sideBLabel: string = typeof sideBData === 'string' ? sideBData : (sideBData.label || 'Side B')
    const pointsA: string[] = Array.isArray(sideAData.points) ? sideAData.points : (Array.isArray(c.pointsA) ? c.pointsA : [])
    const pointsB: string[] = Array.isArray(sideBData.points) ? sideBData.points : (Array.isArray(c.pointsB) ? c.pointsB : [])
    body += `<div class="debate-grid">
      <div class="debate-col-a"><div class="debate-label">${e(sideALabel)}</div>${pointsA.map(p => bulletItem(p)).join('')}</div>
      <div class="debate-col-b"><div class="debate-label debate-label-b">${e(sideBLabel)}</div>${pointsB.map(p => bulletItem(p)).join('')}</div>
    </div>`
  }

  // ── Writing task ──
  else if (type === 'writing-task') {
    const brief: string = c.brief || ''
    const format: string = c.format || 'Writing Task'
    const planningNotes: string[] = Array.isArray(c.planningNotes) ? c.planningNotes : []
    const modelText: string = c.modelText || ''
    if (brief) {
      body += `<div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:6px;padding:10px 12px;margin-bottom:10px">
        <div style="font-size:8pt;font-weight:700;color:#1D4ED8;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">${e(format)}</div>
        <div style="font-size:9.5pt;color:#1E3A5F">${e(brief)}</div>
      </div>`
    }
    if (planningNotes.length) {
      body += `<div style="margin-bottom:8px"><div style="font-size:8pt;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px">Plan your writing</div>`
      planningNotes.forEach(n => { body += bulletItem(n) })
      body += `</div>`
    }
    if (modelText) {
      body += `<div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:4px;padding:10px 12px;margin-bottom:8px">
        <div style="font-size:8pt;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px">Model text</div>
        <div style="font-size:9pt;color:#6B7280;font-style:italic;line-height:1.6">${e(modelText)}</div>
      </div>`
    }
    if (c.wordCount) body += `<p class="small-gray" style="margin-bottom:8px">Target: ${e(c.wordCount)}</p>`
    if (!tutorCopy) {
      body += `<div style="margin-top:4px">`
      for (let i = 0; i < 8; i++) { body += writeLine() }
      body += `</div>`
    }
  }

  // ── Register upgrade (Say It Better) ──
  else if (type === 'register-upgrade') {
    const items: { basic?: string; upgraded?: string; note?: string }[] = Array.isArray(c.items) ? c.items : []
    if (typeof c.instructions === 'string' && c.instructions) body += `<p class="italic">${e(c.instructions)}</p>`
    body += `<table class="correction-table"><thead><tr><th style="width:42%">Basic</th><th>${tutorCopy ? 'Upgraded' : 'Your upgrade'}</th></tr></thead><tbody>`
    items.forEach(item => {
      body += `<tr>
        <td>"${e(item.basic || '')}"</td>
        <td>${tutorCopy
          ? `<span class="correct-text">"${e(item.upgraded || '')}"</span>${item.note ? `<div class="error-type" style="margin-top:2px">${e(item.note)}</div>` : ''}`
          : `<span class="expr-write">&nbsp;</span>`}</td>
      </tr>`
    })
    body += `</tbody></table>`
  }

  // ── Presentation task ──
  else if (type === 'presentation-task') {
    const brief: string = c.brief || ''
    const audience: string = c.audience || ''
    const planningNotes: string[] = Array.isArray(c.planningNotes) ? c.planningNotes : []
    const deliveryChecklist: string[] = Array.isArray(c.deliveryChecklist) ? c.deliveryChecklist : []
    if (brief) {
      body += `<div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:6px;padding:10px 12px;margin-bottom:10px">
        <div style="font-size:8pt;font-weight:700;color:#1D4ED8;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">${e(audience ? `Present to: ${audience}` : 'Presentation Task')}</div>
        <div style="font-size:9.5pt;color:#1E3A5F">${e(brief)}</div>
      </div>`
    }
    if (planningNotes.length) {
      body += `<div style="margin-bottom:8px"><div style="font-size:8pt;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px">Plan your presentation</div>`
      planningNotes.forEach(n => { body += bulletItem(n) })
      body += `</div>`
    }
    if (deliveryChecklist.length) {
      body += `<div style="margin-bottom:8px"><div style="font-size:8pt;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px">Delivery checklist</div>`
      deliveryChecklist.forEach(item => { body += `<div style="font-size:9.5pt;color:#374151;margin-bottom:3px">☐ ${e(item)}</div>` })
      body += `</div>`
    }
    if (c.timeTarget) body += `<p class="small-gray" style="margin-bottom:8px">Target length: ${e(c.timeTarget)}</p>`
    if (!tutorCopy) {
      body += `<div style="margin-top:4px">`
      for (let i = 0; i < 6; i++) { body += writeLine() }
      body += `</div>`
    }
  }

  // ── Homework ──
  else if (['homework-writing', 'homework'].includes(type)) {
    const task: string = c.task || c.description || c.taskName || ''
    if (task) body += `<p>${e(task)}</p><div class="spacer"></div>`
    if (typeof c.instructions === 'string') body += `<p>${e(c.instructions)}</p>`
    const steps: string[] = Array.isArray(c.instructions) ? c.instructions : (Array.isArray(c.prompts) ? c.prompts : [])
    steps.forEach(s => { body += bulletItem(s) })
    if (c.wordCount) body += `<p class="small-gray" style="margin-top:6px">${e(c.wordCount)}</p>`
  }

  // ── Reading article ──
  else if (type === 'reading-article') {
    const text: string = c.text || c.article || c.content || ''
    if (c.title) body += `<p class="bold">${e(c.title)}</p>`
    if (text) {
      const paragraphs = text.split(/\n\n+/)
      paragraphs.forEach(para => {
        if (para.trim()) body += `<p style="font-size:9.5pt;line-height:1.65;color:#374151;margin-bottom:8px">${e(para.trim())}</p>`
      })
    }
    const qs: string[] = Array.isArray(c.questions) ? c.questions : []
    if (qs.length) {
      body += `<p class="bold" style="margin-top:8px">Questions</p>`
      qs.forEach((q, i) => { body += numberedQ(i + 1, q) })
    }
  }

  // ── Listening true/false ──
  else if (type === 'listening-true-false') {
    const qs: unknown[] = Array.isArray(c.questions) ? c.questions : []
    qs.forEach((q, i) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const qq = q as Record<string, any>
      const statement: string = typeof q === 'string' ? q : (qq.statement || '')
      body += numberedQ(i + 1, statement)
      if (tutorCopy) {
        const answer = qq.answer === true ? 'TRUE' : qq.answer === false ? 'FALSE' : ''
        body += `<div style="padding:1px 0 6px 23px;font-size:8.5pt;color:#9CA3AF">→ ${e(answer)}${qq.note ? ` — ${e(qq.note)}` : ''}</div>`
      } else {
        body += `<div style="padding:2px 0 8px 23px;display:flex;gap:16px;font-size:9pt;color:#374151">
          <span style="display:flex;align-items:center;gap:4px"><span style="display:inline-block;width:13px;height:13px;border:1px solid #9CA3AF;border-radius:2px"></span> True</span>
          <span style="display:flex;align-items:center;gap:4px"><span style="display:inline-block;width:13px;height:13px;border:1px solid #9CA3AF;border-radius:2px"></span> False</span>
        </div>`
      }
    })
  }

  // ── Listening MCQ ──
  else if (type === 'listening-mcq') {
    const qs: unknown[] = Array.isArray(c.questions) ? c.questions : []
    qs.forEach((q, i) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const qq = q as Record<string, any>
      const question: string = typeof q === 'string' ? q : (qq.question || '')
      const options: string[] = Array.isArray(qq.options) ? qq.options : []
      body += numberedQ(i + 1, question)
      options.forEach((opt, oi) => {
        const letter = String.fromCharCode(65 + oi)
        const isAnswer = tutorCopy && qq.answer === oi
        body += `<div style="padding:1px 0 2px 23px;font-size:9pt;color:${isAnswer ? '#166534' : '#374151'};font-weight:${isAnswer ? '700' : '400'}">${letter}. ${e(opt)}</div>`
      })
      body += `<div style="height:6px"></div>`
    })
  }

  // ── Generic fallback ──
  else {
    const qs: unknown[] = Array.isArray(c.questions) ? c.questions : (Array.isArray(c.items) ? c.items : [])
    qs.forEach((q, i) => {
      const text = typeof q === 'string' ? q : (typeof q === 'object' && q !== null ? Object.values(q as object).find(v => typeof v === 'string') || '' : '')
      body += numberedQ(i + 1, text as string)
    })
    const desc: string = c.description || c.instructions || ''
    if (!qs.length && desc) body += `<p>${e(desc)}</p>`
  }

  return `<div style="margin-bottom:18px">
  ${sectionHeader(idx + 1, title, time)}
  <div style="padding:2px 0 6px">${body}</div>
</div>`
}

// ── Build full HTML ───────────────────────────────────────────────────────────
function buildHTML(lesson: {
  title: string
  content: Record<string, unknown>
  createdAt: Date
  student: { name: string; level: string; targetLanguage: string }
}, tutorCopy: boolean): string {
  const { title, content, createdAt, student } = lesson
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = content as Record<string, any>
  const objective: string = c.objective || c.overview || ''
  const teachingNotes: string = c.teachingNotes || ''
  const homework: string = c.homework || ''
  const duration: number = c.duration || 50
  const skills: string[] = Array.isArray(c.skills) ? c.skills : []
  const formattedDate = new Date(createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const copyLabel = tutorCopy ? 'Tutor Copy' : 'Student Worksheet'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawModules: Record<string, any>[] = Array.isArray(c.modules) ? c.modules : (Array.isArray(c.exercises) ? c.exercises : [])

  const modulesHTML = rawModules.map((mod, idx) => renderModule(mod, idx, student.name, tutorCopy)).join('')

  const hasHomeworkModule = rawModules.some(m => ['homework-writing', 'homework'].includes(m.type || ''))
  const homeworkSection = (!hasHomeworkModule && homework) ? `
  <div class="avoid-break" style="margin-bottom:18px">
    ${sectionHeader(rawModules.length + 1, 'Homework', 2)}
    <div style="padding:2px 0 6px"><p style="font-size:9.5pt;color:#374151">${e(homework)}</p></div>
  </div>` : ''

  // Post-lesson notes (tutor only)
  const postLessonNotes = tutorCopy ? `
  <div class="notes-section avoid-break">
    <div class="notes-section-hdr">Post-Lesson Notes</div>
    <div class="notes-row">
      <div class="notes-row-label">Grammar errors noticed</div>
      ${writeLine()}${writeLine()}${writeLine()}
    </div>
    <div class="notes-row">
      <div class="notes-row-label">Strong moments</div>
      ${writeLine()}${writeLine()}
    </div>
    <div class="notes-row">
      <div class="notes-row-label">Focus for next lesson</div>
      ${writeLine()}${writeLine()}
    </div>
  </div>` : ''

  const phraseRefCard = buildPhraseRefCard(rawModules)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${e(title)} — ${e(student.name)}</title>
  <style>${CSS}</style>
</head>
<body>

  <!-- Cover -->
  <div class="cover avoid-break">
    <div class="cover-top">
      <div class="cover-brand">
        ${LOGO_WHITE}
        <span class="cover-brand-name">Avidato</span>
      </div>
      <span class="copy-badge">${copyLabel}</span>
    </div>
    <div class="cover-title">${e(title)}</div>
    <div class="cover-meta">${e(student.name)} &nbsp;·&nbsp; ${e(student.level.toUpperCase())} &nbsp;·&nbsp; ${e(student.targetLanguage)} &nbsp;·&nbsp; ${duration} min</div>
  </div>

  <!-- Lesson info -->
  <table class="info-table avoid-break">
    <tr>
      <td class="info-label">Student</td><td>${e(student.name)}</td>
      <td class="info-label">Language</td><td>${e(student.targetLanguage)}</td>
    </tr>
    <tr>
      <td class="info-label">Level</td><td>${e(student.level)}</td>
      <td class="info-label">Duration</td><td>${duration} minutes</td>
    </tr>
    ${skills.length ? `<tr><td class="info-label">Skills</td><td colspan="3">${e(skills.join(' · '))}</td></tr>` : ''}
    <tr>
      <td class="info-label">Date</td><td colspan="3">${e(formattedDate)}</td>
    </tr>
  </table>

  ${objective ? `<div class="objective-box"><strong>Objective:</strong> ${e(objective)}</div>` : ''}

  ${tutorCopy && rawModules.length > 0 ? buildTimingTable(rawModules) : ''}

  <!-- Modules -->
  ${modulesHTML}
  ${homeworkSection}

  ${tutorCopy && teachingNotes ? `<div class="avoid-break" style="margin-top:8px">${noteBox('Teaching notes', teachingNotes)}</div>` : ''}

  ${postLessonNotes}

  ${phraseRefCard}

  <div class="page-footer">
    <span class="footer-brand">AVIDATO</span>
    <span>${e(formattedDate)} &nbsp;·&nbsp; ${copyLabel}</span>
  </div>

  <script>window.onload = function(){ window.print(); }</script>
</body>
</html>`
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const tutorCopy = req.nextUrl.searchParams.get('tutor') === '1'

  const lesson = await prisma.lesson.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      student: { select: { name: true, level: true, targetLanguage: true } },
    },
  })

  if (!lesson || !lesson.student) {
    return new Response('Lesson not found', { status: 404 })
  }

  const html = buildHTML({
    title: lesson.title,
    content: lesson.content as Record<string, unknown>,
    createdAt: lesson.createdAt,
    student: lesson.student,
  }, tutorCopy)

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

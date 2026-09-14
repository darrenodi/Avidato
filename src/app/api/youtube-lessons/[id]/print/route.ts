import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

// YouTube lesson PDF — same visual system as the main lesson print route
// (cover block, numbered section headers, vocab cards, note boxes).
// ?tutor=1 renders the tutor copy with answers; default is the student worksheet.

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

// Escape, then render **bold** markers (used in speaking-practice questions)
function eBold(s: unknown): string {
  return e(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
}

// ── Inline logo ───────────────────────────────────────────────────────────────
const LOGO_WHITE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 328 326" width="30" height="30" style="flex-shrink:0;vertical-align:middle"><path fill="none" d="M-0.5-0.5h328v326h-328z"/><path fill="#fff" d="M 46.5,299.5 C 41.9898,299.884 37.6565,300.551 33.5,301.5C 30.8333,301.5 28.1667,301.5 25.5,301.5C 20.9677,301.818 16.6344,301.485 12.5,300.5C 72.4733,204.184 132.473,107.851 192.5,11.5C 205.162,29.0046 217.662,46.6712 230,64.5C 230.667,65.5 230.667,66.5 230,67.5C 193,127.167 156,186.833 119,246.5C 102.045,273.945 77.8783,291.611 46.5,299.5 Z"/><path fill="#fff" d="M 245.5,87.5 C 246.496,87.4142 247.329,87.7476 248,88.5C 258.386,101.931 266.719,116.597 273,132.5C 276.256,142.943 277.256,153.609 276,164.5C 274.861,167.583 273.528,170.583 272,173.5C 271.097,174.701 269.931,175.535 268.5,176C 242.494,176.833 216.494,176.667 190.5,175.5C 208.86,146.149 227.193,116.816 245.5,87.5 Z"/><path fill="#fff" d="M 231.5,199.5 C 257.522,198.843 283.188,199.509 308.5,201.5C 295.453,231.388 276.453,256.888 251.5,278C 228.946,294.769 203.613,304.602 175.5,307.5C 132.997,307.832 90.6634,307.499 48.5,306.5C 72.4088,304.148 93.7421,295.648 112.5,281C 124.107,270.399 134.607,258.899 144,246.5C 163.777,223.029 188.61,207.863 218.5,201C 222.848,200.535 227.181,200.035 231.5,199.5 Z"/></svg>`

// ── CSS (mirrors the main lesson PDF) ────────────────────────────────────────
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

/* Info table */
.info-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
.info-table td { padding: 5px 10px; font-size: 9pt; border: 0.5px solid #DEEAF1; vertical-align: middle; }
.info-label { font-weight: 700; color: #1a3a5c; background: #F0F4F8; width: 22%; }

/* Section header */
.section-header { width: 100%; border-collapse: collapse; border: 1px solid #DEEAF1; border-radius: 4px; overflow: hidden; margin-bottom: 10px; margin-top: 14px; }
.section-header td { padding: 8px 11px; vertical-align: middle; }
.section-num { background: #1a3a5c; color: white; font-weight: 700; font-size: 12pt; text-align: center; width: 28px; }
.section-title-cell { background: #EBF3FA; font-weight: 700; font-size: 12pt; color: #1a3a5c; }
.section-time-cell { background: #EBF3FA; text-align: right; font-size: 9pt; color: #9CA3AF; white-space: nowrap; width: 70px; }

/* Vocab card */
.vocab-card { border: 1px solid #E5E7EB; border-radius: 4px; padding: 10px 12px; margin-bottom: 8px; background: white; }
.vocab-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
.vocab-word { font-size: 11pt; font-weight: 700; color: #1a3a5c; }
.vocab-phon { font-size: 9pt; font-weight: 400; font-style: italic; color: #9CA3AF; margin-left: 6px; }
.pos-pill { background: #DBEAFE; border: 0.5px solid #2E75B6; color: #2E75B6; font-size: 8pt; padding: 2px 7px; border-radius: 10px; white-space: nowrap; }
.vocab-def { font-size: 9.5pt; color: #374151; margin-bottom: 4px; }
.vocab-ex { font-size: 9pt; font-style: italic; color: #9CA3AF; margin-bottom: 2px; }
.vocab-syn { font-size: 8.5pt; color: #9CA3AF; }

/* Match table */
.match-group-label { font-size: 9pt; font-weight: 700; color: #1a3a5c; margin: 8px 0 4px; text-transform: uppercase; letter-spacing: .04em; }
.match-table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
.match-table td { padding: 7px 10px; border: 0.5px solid #E5E7EB; font-size: 9.5pt; vertical-align: top; }
.match-table tr:nth-child(odd) td { background: #F9FAFB; }
.match-num { color: #2E75B6; font-weight: 700; width: 24px; }
.match-term { font-weight: 500; color: #1a3a5c; width: 42%; }
.match-def { color: #374151; }
.match-blank { display: inline-block; width: 34px; border-bottom: 1px solid #9CA3AF; }
.type-pill { background: #F3E8FF; border: 0.5px solid #9333EA; color: #9333EA; font-size: 7.5pt; padding: 1px 6px; border-radius: 10px; white-space: nowrap; margin-left: 6px; }

/* Note / tutor box */
.note-box { display: grid; grid-template-columns: 56px 1fr; border: 1px solid #F59E0B; border-radius: 4px; overflow: hidden; margin: 8px 0; }
.note-label { background: #FFFBEB; color: #92400E; font-size: 7.5pt; font-weight: 700; text-transform: uppercase; padding: 8px; border-right: 1px solid #F59E0B; display: flex; align-items: flex-start; }
.note-body { background: #FFFBEB; color: #92400E; font-size: 9pt; padding: 8px 9px; line-height: 1.5; }

/* Numbered questions */
.numbered-q { display: grid; grid-template-columns: 18px 1fr; gap: 5px; padding: 4px 0; align-items: start; }
.q-num { color: #2E75B6; font-weight: 700; font-size: 10pt; }
.q-text { font-size: 9.5pt; color: #374151; line-height: 1.5; }
.q-answer { font-size: 9pt; color: #166534; font-weight: 500; padding: 1px 0 4px 23px; }
.q-followup { font-size: 8.5pt; color: #9CA3AF; font-style: italic; padding: 0 0 4px 23px; }

/* Gap fill */
.gap-sentence { font-size: 9.5pt; padding: 5px 0 5px 14px; color: #374151; line-height: 1.6; }
.gap-answer { color: #1D4ED8; font-weight: 700; }

/* Bullet */
.bullet-item { padding: 2px 0 2px 14px; font-size: 9.5pt; color: #374151; line-height: 1.5; }

/* Video block */
.video-block { text-align: center; margin: 6px 0 10px; }
.video-thumb { width: 62%; max-width: 340px; border-radius: 6px; border: 1px solid #DEEAF1; display: inline-block; }
.video-url { font-size: 9pt; color: #1D4ED8; text-decoration: underline; word-break: break-all; margin-top: 6px; }

/* Answer key */
.answer-key { background: #EBF3FA; border: 1px solid #DEEAF1; border-radius: 4px; padding: 8px 12px; font-size: 9pt; color: #1a3a5c; margin-bottom: 8px; }
.answer-key strong { text-transform: uppercase; font-size: 8pt; letter-spacing: .05em; }

/* Misc */
.bold { font-weight: 700; font-size: 9.5pt; margin-bottom: 5px; }
.small-gray { font-size: 8.5pt; color: #9CA3AF; }
.italic { font-style: italic; font-size: 9.5pt; color: #374151; margin-bottom: 8px; }

/* Footer */
.page-footer { margin-top: 20px; padding-top: 10px; border-top: 1px solid #DEEAF1; font-size: 8pt; color: #9CA3AF; display: flex; justify-content: space-between; align-items: center; }
.footer-brand { font-weight: 700; color: #1a3a5c; letter-spacing: .06em; font-size: 8pt; }
`

// ── Primitive helpers ─────────────────────────────────────────────────────────
function sectionHeader(num: number, title: string, time: string): string {
  return `<table class="section-header avoid-break"><tr>
    <td class="section-num">${num}</td>
    <td class="section-title-cell">${e(title)}</td>
    <td class="section-time-cell">${e(time)}</td>
  </tr></table>`
}

function noteBox(label: string, body: string): string {
  return `<div class="note-box avoid-break"><div class="note-label">${e(label)}</div><div class="note-body">${e(body)}</div></div>`
}

function numberedQ(num: number, html: string): string {
  return `<div class="numbered-q"><span class="q-num">${num}.</span><span class="q-text">${html}</span></div>`
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

function writeLine(): string {
  return `<div style="border-bottom:1px solid #D1D5DB;margin:4px 0 10px;height:18px"></div>`
}

// Deterministic shuffle (seeded by lesson id) so student + tutor copies match
function seededShuffleIndices(count: number, seedStr: string): number[] {
  let seed = 0
  for (let i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0
  const rand = () => {
    seed = (seed + 0x6d2b79f5) >>> 0
    let t = seed
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const idx = Array.from({ length: count }, (_, i) => i)
  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[idx[i], idx[j]] = [idx[j], idx[i]]
  }
  // Derangement: no position may hold its own original index, or that row's
  // "match" is trivially guessable (the phrase would sit next to its own meaning).
  if (count > 1) {
    for (let i = 0; i < count; i++) {
      if (idx[i] === i) {
        const swapWith = (i + 1) % count
        ;[idx[i], idx[swapWith]] = [idx[swapWith], idx[i]]
      }
    }
  }
  return idx
}

// ── Data shape ────────────────────────────────────────────────────────────────
/* eslint-disable @typescript-eslint/no-explicit-any */
interface YtData {
  videoId?: string
  sourceUrl?: string
  teacherNotes?: string
  estimatedMinutes?: number
  videoDurationSeconds?: number
  videoBreak?: { splitAtSeconds?: number; rationale?: string }
  warmUp?: any[]
  preTeach?: any[]
  detailQuestions?: any[]
  partOneQuestions?: any[]
  midpointDiscussion?: any[]
  partTwoQuestions?: any[]
  phrases?: any[]
  fillBlanks?: any[]
  speakingPractice?: any[]
  discussion?: any[]
  wrapUp?: any[]
  homework?: { task?: string; type?: string }
}

// ── HTML builder ──────────────────────────────────────────────────────────────
function buildHTML(lesson: { id: string; title: string; level: string; topic: string | null; createdAt: Date; data: YtData }, tutorCopy: boolean): string {
  const d = lesson.data || {}
  const copyLabel = tutorCopy ? 'Tutor Copy' : 'Student Copy'
  const formattedDate = lesson.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const videoUrl = d.videoId && d.videoId !== 'manual' ? `https://www.youtube.com/watch?v=${d.videoId}` : (d.sourceUrl || '')
  let sections = ''
  let num = 0

  // 1 — Warm-up
  if (d.warmUp?.length) {
    num++
    sections += sectionHeader(num, 'Warm-up', '3-5 min')
    d.warmUp.forEach((q: any, i: number) => { sections += numberedQ(i + 1, e(q.question)) })
  }

  // 2 — Vocabulary
  if (d.preTeach?.length) {
    num++
    sections += sectionHeader(num, 'Vocabulary', '5-7 min')
    d.preTeach.forEach((v: any) => {
      sections += vocabCard(v.term || '', v.type || '', v.phonetics || '', v.definition || '', v.exampleSentence || '', v.synonym)
    })
  }

  // 3 — Watch & Comprehend
  if (d.detailQuestions?.length || d.videoId) {
    num++
    sections += sectionHeader(num, 'Watch & Comprehend', '8-10 min')
    if (d.videoId && d.videoId !== 'manual') {
      sections += `<div class="video-block avoid-break">
        <img class="video-thumb" src="https://img.youtube.com/vi/${e(d.videoId)}/hqdefault.jpg" alt="Video thumbnail">
        <div class="video-url">${e(videoUrl)}</div>
      </div>`
    }
    if (d.videoBreak?.splitAtSeconds && d.partOneQuestions?.length) {
      sections += `<p class="bold">Part 1 — Watch to the first natural pause:</p>`
      d.partOneQuestions.forEach((q: any, i: number) => {
        sections += numberedQ(i + 1, e(q.question))
        if (tutorCopy && q.answer) sections += `<div class="q-answer">✓ ${e(q.answer)}</div>`
        else sections += writeLine()
      })
      if (d.midpointDiscussion?.length) {
        sections += `<p class="bold pause-heading">Pause and discuss:</p>`
        d.midpointDiscussion.forEach((q: any, i: number) => {
          sections += numberedQ(i + 1, e(q.question))
          if (tutorCopy && q.followUp) sections += `<div class="q-followup">${e(q.followUp)}</div>`
          else sections += writeLine()
        })
      }
      sections += `<p class="bold pause-heading">Part 2 — Finish the video:</p>`
      ;(d.partTwoQuestions || []).forEach((q: any, i: number) => {
        sections += numberedQ(i + 1, e(q.question))
        if (tutorCopy && q.answer) sections += `<div class="q-answer">✓ ${e(q.answer)}</div>`
        else sections += writeLine()
      })
    } else if (d.detailQuestions?.length) {
      sections += `<p class="bold">Watch the video and answer the questions:</p>`
      d.detailQuestions.forEach((q: any, i: number) => {
        sections += numberedQ(i + 1, e(q.question))
        if (tutorCopy && q.answer) sections += `<div class="q-answer">✓ ${e(q.answer)}</div>`
        else sections += writeLine()
      })
    }
  }

  // 4 — Discussion
  if (d.discussion?.length) {
    num++
    sections += sectionHeader(num, 'Discussion', '8-10 min')
    d.discussion.forEach((q: any, i: number) => {
      sections += numberedQ(i + 1, e(q.question))
      if (tutorCopy && q.followUp) sections += `<div class="q-followup">${e(q.followUp)}</div>`
    })
  }

  // 5 — Phrases (matching) — single side-by-side table: phrase | blank | letter | meaning
  if (d.phrases?.length) {
    num++
    sections += sectionHeader(num, 'Phrases from the Video', '5-7 min')
    // order[i] = index into d.phrases of the MEANING shown on row i (so row i's own meaning is
    // shuffled to a different row, letter = row position, and no row's meaning matches its phrase)
    const order = seededShuffleIndices(d.phrases.length, lesson.id)
    sections += `<p class="bold">Match each phrase with its meaning. Write the correct letter next to each number.</p>`
    sections += `<table class="match-table"><thead><tr>
      <th style="width:6%"></th>
      <th style="width:34%">Phrase</th>
      <th style="width:8%">Match</th>
      <th style="width:6%"></th>
      <th>Meaning</th>
    </tr></thead><tbody>`
    d.phrases.forEach((p: any, i: number) => {
      const letter = String.fromCharCode(97 + i)
      const meaningIdx = order[i]
      const meaning = d.phrases![meaningIdx]?.meaning || ''
      sections += `<tr>
        <td class="match-num">${i + 1}.</td>
        <td class="match-term">${e(p.term)}${p.type ? `<span class="type-pill">${e(p.type)}</span>` : ''}</td>
        <td class="match-def" style="text-align:center"><span class="match-blank">&nbsp;</span></td>
        <td class="match-num">${letter}.</td>
        <td class="match-def">${e(meaning)}</td>
      </tr>`
    })
    sections += `</tbody></table>`
    if (tutorCopy) {
      const key = d.phrases.map((_: any, i: number) => `${i + 1}-${String.fromCharCode(97 + order.indexOf(i))}`).join(' &nbsp; ')
      sections += `<div class="answer-key avoid-break"><strong>Answer key:</strong> &nbsp; ${key}</div>`
    }
  }

  // 6 — Fill in the blanks
  if (d.fillBlanks?.length) {
    num++
    sections += sectionHeader(num, 'Fill in the Blanks', '5 min')
    sections += `<p class="bold">Complete each sentence with a phrase from the video:</p>`
    d.fillBlanks.forEach((f: any, i: number) => {
      sections += `<div class="gap-sentence">${i + 1}. ${e(f.sentence)}${tutorCopy && f.answer ? ` &nbsp;<span class="gap-answer">→ ${e(f.answer)}</span>` : ''}</div>`
    })
  }

  // 7 — Speaking practice
  if (d.speakingPractice?.length) {
    num++
    sections += sectionHeader(num, 'Speaking Practice', '5-7 min')
    sections += `<p class="bold">Answer each question using the highlighted phrase:</p>`
    d.speakingPractice.forEach((s: any, i: number) => { sections += numberedQ(i + 1, eBold(s.question)) })
  }

  // 8 — Wrap-up
  if (d.wrapUp?.length) {
    num++
    sections += sectionHeader(num, 'Wrap-up', '3-5 min')
    d.wrapUp.forEach((w: any) => { sections += bulletItem(w.prompt || w.question || '') })
  }

  // 9 — Homework
  if (d.homework?.task) {
    num++
    sections += sectionHeader(num, 'Homework', '')
    sections += `<div class="gap-sentence" style="padding-left:0">${e(d.homework.task)}</div>`
    if (d.homework.type) sections += `<p class="small-gray" style="margin-top:4px">Task type: ${e(d.homework.type)}</p>`
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${e(lesson.title)} — YouTube Lesson</title>
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
    <div class="cover-title">${e(lesson.title)}</div>
    <div class="cover-meta">YouTube Lesson &nbsp;·&nbsp; ${e(lesson.level.toUpperCase())}${d.estimatedMinutes ? ` &nbsp;·&nbsp; ~${d.estimatedMinutes} min` : ''}</div>
  </div>

  <!-- Lesson info -->
  <table class="info-table avoid-break">
    <tr>
      <td class="info-label">Level</td><td>${e(lesson.level)}</td>
      <td class="info-label">Duration</td><td>${d.estimatedMinutes ? `~${d.estimatedMinutes} minutes` : '—'}</td>
    </tr>
    ${lesson.topic ? `<tr><td class="info-label">Topic</td><td colspan="3">${e(lesson.topic)}</td></tr>` : ''}
    ${videoUrl ? `<tr><td class="info-label">Video</td><td colspan="3">${e(videoUrl)}</td></tr>` : ''}
    <tr><td class="info-label">Date</td><td colspan="3">${e(formattedDate)}</td></tr>
  </table>

  ${sections}

  ${tutorCopy && d.teacherNotes ? `<div class="avoid-break" style="margin-top:12px">${noteBox('Teacher notes', d.teacherNotes)}</div>` : ''}

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

  const lesson = await prisma.youTubeLesson.findUnique({
    where: { id },
    select: { id: true, title: true, level: true, topic: true, createdAt: true, data: true },
  })

  if (!lesson) {
    return new Response('Lesson not found', { status: 404 })
  }

  const html = buildHTML(
    {
      id: lesson.id,
      title: lesson.title,
      level: lesson.level,
      topic: lesson.topic,
      createdAt: lesson.createdAt,
      data: lesson.data as YtData,
    },
    tutorCopy
  )

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

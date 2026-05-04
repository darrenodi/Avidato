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
.cover { background: #1a3a5c; color: white; padding: 16px 18px 14px; border-radius: 4px; margin-bottom: 14px; }
.cover-title { font-size: 20pt; font-weight: 700; color: white; line-height: 1.25; margin-bottom: 6px; }
.cover-meta { font-size: 10pt; color: #BDD7EE; }

/* Objective box */
.objective-box { background: #F3F4F6; border: 1px solid #DEEAF1; padding: 10px 13px; border-radius: 4px; margin-bottom: 10px; font-size: 9.5pt; color: #374151; }

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
.debate-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px; }
.debate-col-a { background: #EFF6FF; border: 1px solid #2E75B6; border-radius: 4px; padding: 10px 12px; }
.debate-col-b { background: #FFFBEB; border: 1px solid #F59E0B; border-radius: 4px; padding: 10px 12px; }
.debate-label { font-size: 9pt; font-weight: 700; color: #2E75B6; margin-bottom: 6px; }
.debate-label-b { color: #92400E; }

/* HR */
.hr { border: none; border-top: 1px solid #DEEAF1; margin: 12px 0; }
.spacer { height: 8px; }
.h2 { font-size: 12pt; font-weight: 700; color: #1a3a5c; margin-bottom: 8px; margin-top: 14px; }
.italic { font-style: italic; font-size: 9.5pt; color: #374151; margin-bottom: 8px; }
.bold { font-weight: 700; font-size: 9.5pt; margin-bottom: 5px; }
.small-gray { font-size: 8.5pt; color: #9CA3AF; }
.page-footer { margin-top: 20px; padding-top: 10px; border-top: 1px solid #DEEAF1; font-size: 8pt; color: #9CA3AF; text-align: center; }
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

// ── Write line ────────────────────────────────────────────────────────────────
function writeLine(): string {
  return `<div style="border-bottom:1px solid #D1D5DB;margin:4px 0 10px;height:18px"></div>`
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
  else if (type === 'vocabulary-match') {
    const groups: unknown[] = Array.isArray(c.groups) ? c.groups : []
    if (tutorCopy) {
      // Tutor copy: show term + definition side by side
      body = groups.map((g) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const gg = g as Record<string, any>
        const pairs: unknown[] = Array.isArray(gg.pairs) ? gg.pairs : []
        const rows = pairs.map((p, i) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const pp = p as Record<string, any>
          return `<tr><td class="match-num">${i + 1}</td><td class="match-term">${e(pp.term || pp.word || '')}</td><td class="match-def">${e(pp.definition || pp.match || '')}</td></tr>`
        }).join('')
        return `<div class="match-group-label">${e(gg.label || '')}</div><table class="match-table">${rows}</table>`
      }).join('')
    } else {
      // Student copy: terms numbered, definitions lettered and rotated — student writes matching letter
      body = groups.map((g) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const gg = g as Record<string, any>
        const pairs: unknown[] = Array.isArray(gg.pairs) ? gg.pairs : []
        const n = pairs.length
        // Rotate definitions by 2 positions so term 1 ≠ definition A
        const offset = 2
        const scrambledDefs = pairs.map((_, i) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const pp = pairs[(i + offset) % n] as Record<string, any>
          return pp.definition || pp.match || ''
        })
        const termRows = pairs.map((p, i) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const pp = p as Record<string, any>
          return `<tr><td class="match-num">${i + 1}</td><td class="match-term">${e(pp.term || pp.word || '')}</td><td style="width:28px;text-align:center;color:#9CA3AF;border:0.5px solid #E5E7EB">___</td></tr>`
        }).join('')
        const defRows = scrambledDefs.map((def, i) => {
          const letter = String.fromCharCode(65 + i)
          return `<tr><td class="match-num" style="color:#92400E">${letter}</td><td class="match-def" colspan="2">${e(def)}</td></tr>`
        }).join('')
        return `<div class="match-group-label">${e(gg.label || '')}</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:10px">
  <div>
    <div style="font-size:8pt;color:#9CA3AF;margin-bottom:4px;text-transform:uppercase;letter-spacing:.04em">Terms — write the matching letter</div>
    <table class="match-table">${termRows}</table>
  </div>
  <div>
    <div style="font-size:8pt;color:#9CA3AF;margin-bottom:4px;text-transform:uppercase;letter-spacing:.04em">Definitions</div>
    <table class="match-table">${defRows}</table>
  </div>
</div>`
      }).join('')
    }
  }

  // ── Useful phrases / useful language / useful expressions / language-in-context ──
  else if (['useful-language', 'useful-expressions', 'useful-phrases', 'language-in-context', 'phrasal-verbs'].includes(type)) {
    const context: string = c.context || ''
    if (context) body += `<p class="italic">${e(context)}</p>`
    const phrases: unknown[] = Array.isArray(c.phrases) ? c.phrases : (Array.isArray(c.expressions) ? c.expressions : [])
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

  // ── Comprehension / matching-qa ──
  else if (['comprehension', 'matching-qa', 'skim-main-idea', 'reading-scan', 'listening-comprehension'].includes(type)) {
    // matching-qa uses c.pairs; other types use c.questions
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

  // ── Sentence correction / find-the-mistake ──
  else if (['sentence-correction', 'find-the-mistake'].includes(type)) {
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

  // ── Grammar focus / post-task ──
  else if (['grammar-focus', 'post-task'].includes(type)) {
    const focus: string = c.grammarFocus || c.grammar_focus || ''
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
    const examples: string[] = Array.isArray(c.examples) ? c.examples : []
    if (examples.length) {
      examples.forEach(ex => { body += `<div class="bullet-item">• ${e(ex)}</div>` })
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
      // Fallback: flat questions array
      const qs: string[] = Array.isArray(c.questions) ? c.questions : []
      if (c.instructions) body += `<p class="italic">${e(c.instructions)}</p>`
      qs.forEach((q, i) => { body += numberedQ(i + 1, q) })
    }
  }

  // ── Discussion / further-discussion ──
  else if (['discussion', 'further-discussion', 'your-turn-answer', 'your-turn-tell', 'your-turn-ask'].includes(type)) {
    const qs: string[] = Array.isArray(c.questions) ? c.questions : (Array.isArray(c.points) ? c.points : [])
    if (c.instructions) body += `<p class="italic">${e(c.instructions)}</p>`
    qs.forEach((q, i) => { body += numberedQ(i + 1, q) })
  }

  // ── Debate ──
  else if (type === 'debate') {
    const topic: string = c.topic || ''
    if (topic) body += `<p class="bold">${e(topic)}</p><div class="spacer"></div>`
    // sideA/sideB can be either string labels or {label, points} objects
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
    if (text) body += `<p style="font-size:9.5pt;line-height:1.65;color:#374151">${e(text)}</p>`
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

  // ── Generic fallback (ordering, noticing, etc.) ──
  else {
    const qs: unknown[] = Array.isArray(c.questions) ? c.questions : (Array.isArray(c.items) ? c.items : [])
    qs.forEach((q, i) => {
      const text = typeof q === 'string' ? q : (typeof q === 'object' && q !== null ? Object.values(q as object).find(v => typeof v === 'string') || '' : '')
      body += numberedQ(i + 1, text as string)
    })
    const desc: string = c.description || c.instructions || ''
    if (!qs.length && desc) body += `<p>${e(desc)}</p>`
  }

  return `<div class="avoid-break" style="margin-bottom:18px">
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
  const formattedDate = new Date(createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  // Determine modules array (modular vs exercises format)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawModules: Record<string, any>[] = Array.isArray(c.modules) ? c.modules : (Array.isArray(c.exercises) ? c.exercises : [])

  const modulesHTML = rawModules.map((mod, idx) => renderModule(mod, idx, student.name, tutorCopy)).join('')

  // Standalone homework section if not already in a module
  const hasHomeworkModule = rawModules.some(m => ['homework-writing', 'homework'].includes(m.type || ''))
  const homeworkSection = (!hasHomeworkModule && homework) ? `
  <div class="avoid-break" style="margin-bottom:18px">
    ${sectionHeader(rawModules.length + 1, 'Homework', 2)}
    <div style="padding:2px 0 6px"><p style="font-size:9.5pt;color:#374151">${e(homework)}</p></div>
  </div>` : ''

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
    <div class="cover-title">${e(title)}</div>
    <div class="cover-meta">${e(student.name)} &nbsp;·&nbsp; ${e(student.level.toUpperCase())} &nbsp;·&nbsp; ${duration} min &nbsp;·&nbsp; ${tutorCopy ? 'Tutor Copy' : 'Student Worksheet'}</div>
  </div>

  ${objective ? `<div class="objective-box"><strong>Objective:</strong> ${e(objective)}</div>` : ''}

  <!-- Modules -->
  ${modulesHTML}
  ${homeworkSection}

  ${tutorCopy && teachingNotes ? `<div class="avoid-break" style="margin-top:8px">${noteBox('Teaching notes', teachingNotes)}</div>` : ''}

  <div class="page-footer">
    Generated by Avidato &nbsp;·&nbsp; ${e(formattedDate)} &nbsp;·&nbsp; ${tutorCopy ? 'Tutor Copy' : 'Student Worksheet'}
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

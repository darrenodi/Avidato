// Temporary script to generate SQL INSERT statements from seed data
// Usage: npx tsx prisma/generate-sql.ts > prisma/seed-placement-production.sql

import { grammarQuestions } from './seed-placement-questions'
import { extendedGrammarQuestionsA1A2, extendedGrammarQuestionsB1B2, extendedGrammarQuestionsC1C2 } from './seed-placement-questions-extended'
import { readingPassages, readingQuestions } from './seed-placement-reading'
import { additionalGrammarQuestions } from './seed-placement-questions-part3'
import { part4GrammarQuestions, part4ReadingQuestions } from './seed-placement-questions-part4'
import { part5GrammarQuestions } from './seed-placement-questions-part5'
import type { SeedQuestion } from './seed-placement-questions'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

function esc(s: string | null | undefined): string {
  if (s === null || s === undefined) return 'NULL'
  return "'" + s.replace(/'/g, "''") + "'"
}

function extractPassageTitle(stem: string): string | null {
  const match = stem.match(/^\[(.+?)\]/)
  return match ? match[1] : null
}

let output = ''

output += `-- ============================================================\n`
output += `-- Placement Test Seed Data for Production\n`
output += `-- Generated from TypeScript seed files\n`
output += `-- ============================================================\n\n`
output += `-- Run this inside a transaction for safety\nBEGIN;\n\n`

// 1. Reading Passages
output += `-- ============================================================\n`
output += `-- READING PASSAGES (${readingPassages.length} total)\n`
output += `-- ============================================================\n\n`

for (const p of readingPassages) {
  const wordCount = p.passage.split(/\s+/).length
  output += `INSERT INTO "ReadingPassage" ("id", "cefrLevel", "title", "content", "wordCount", "source", "createdAt")\n`
  output += `VALUES (gen_random_uuid()::text, ${esc(p.cefrLevel)}, ${esc(p.title)}, ${esc(p.passage)}, ${wordCount}, 'Original', CURRENT_TIMESTAMP);\n\n`
}

// 2. All grammar questions (no readingPassageId)
const allGrammarQuestions: SeedQuestion[] = [
  ...grammarQuestions,
  ...extendedGrammarQuestionsA1A2,
  ...extendedGrammarQuestionsB1B2,
  ...extendedGrammarQuestionsC1C2,
  ...additionalGrammarQuestions,
  ...part4GrammarQuestions,
  ...part5GrammarQuestions,
]

output += `-- ============================================================\n`
output += `-- GRAMMAR QUESTIONS (${allGrammarQuestions.length} total)\n`
output += `-- ============================================================\n\n`

for (const q of allGrammarQuestions) {
  output += `INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")\n`
  output += `VALUES (gen_random_uuid()::text, ${esc(q.section)}, ${esc(q.cefrLevel)}, ${esc(q.topic)}, ${q.subtopic ? esc(q.subtopic) : 'NULL'}, ${q.difficulty}, ${esc(q.stem)}, ${esc(q.optionA)}, ${esc(q.optionB)}, ${esc(q.optionC)}, ${esc(q.optionD)}, ${esc(q.correctAnswer)}, ${esc(q.explanation)}, ${esc(q.recommendedTopic)}, NULL, true, CURRENT_TIMESTAMP);\n\n`
}

// 3. Reading questions (with readingPassageId subquery)
const allReadingQuestions: SeedQuestion[] = [
  ...readingQuestions,
  ...part4ReadingQuestions,
]

output += `-- ============================================================\n`
output += `-- READING QUESTIONS (${allReadingQuestions.length} total)\n`
output += `-- ============================================================\n\n`

for (const q of allReadingQuestions) {
  const passageTitle = extractPassageTitle(q.stem)
  let passageIdExpr = 'NULL'
  if (passageTitle) {
    passageIdExpr = `(SELECT "id" FROM "ReadingPassage" WHERE "title" = ${esc(passageTitle)} LIMIT 1)`
  }
  output += `INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")\n`
  output += `VALUES (gen_random_uuid()::text, ${esc(q.section)}, ${esc(q.cefrLevel)}, ${esc(q.topic)}, ${q.subtopic ? esc(q.subtopic) : 'NULL'}, ${q.difficulty}, ${esc(q.stem)}, ${esc(q.optionA)}, ${esc(q.optionB)}, ${esc(q.optionC)}, ${esc(q.optionD)}, ${esc(q.correctAnswer)}, ${esc(q.explanation)}, ${esc(q.recommendedTopic)}, ${passageIdExpr}, true, CURRENT_TIMESTAMP);\n\n`
}

output += `COMMIT;\n\n`
output += `-- ============================================================\n`
output += `-- SUMMARY\n`
output += `-- Reading Passages: ${readingPassages.length}\n`
output += `-- Grammar Questions: ${allGrammarQuestions.length}\n`
output += `-- Reading Questions: ${allReadingQuestions.length}\n`
output += `-- TOTAL QUESTIONS: ${allGrammarQuestions.length + allReadingQuestions.length}\n`
output += `-- ============================================================\n`

const outPath = path.join(__dirname, 'seed-placement-production.sql')
fs.writeFileSync(outPath, output, 'utf-8')
console.log(`✅ Generated ${outPath}`)
console.log(`   Passages: ${readingPassages.length}`)
console.log(`   Grammar Questions: ${allGrammarQuestions.length}`)
console.log(`   Reading Questions: ${allReadingQuestions.length}`)
console.log(`   Total Questions: ${allGrammarQuestions.length + allReadingQuestions.length}`)

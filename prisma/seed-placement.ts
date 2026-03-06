// prisma/seed-placement.ts
// Main seed script that combines ALL question pools and seeds the database
// Usage: npx tsx prisma/seed-placement.ts

import { PrismaClient } from '@prisma/client'
import { grammarQuestions } from './seed-placement-questions'
import { extendedGrammarQuestionsA1A2, extendedGrammarQuestionsB1B2, extendedGrammarQuestionsC1C2 } from './seed-placement-questions-extended'
import { readingPassages, readingQuestions } from './seed-placement-reading'
import { additionalGrammarQuestions } from './seed-placement-questions-part3'
import { part4GrammarQuestions, part4ReadingQuestions } from './seed-placement-questions-part4'
import { part5GrammarQuestions } from './seed-placement-questions-part5'
import type { SeedQuestion } from './seed-placement-questions'
import type { ReadingPassageSeed } from './seed-placement-reading'

const prisma = new PrismaClient()

async function seedReadingPassages() {
  console.log('\n📖 Seeding reading passages...')
  const passageMap = new Map<string, string>()

  for (const p of readingPassages) {
    const existing = await prisma.readingPassage.findFirst({
      where: { title: p.title, cefrLevel: p.cefrLevel },
    })

    if (existing) {
      passageMap.set(p.title, existing.id)
      console.log(`  ↳ Passage "${p.title}" already exists, skipping`)
      continue
    }

    const passage = await prisma.readingPassage.create({
      data: {
        cefrLevel: p.cefrLevel,
        title: p.title,
        content: p.passage,
        wordCount: p.passage.split(/\s+/).length,
      },
    })
    passageMap.set(p.title, passage.id)
    console.log(`  ✅ Created passage: "${p.title}" (${p.cefrLevel})`)
  }

  return passageMap
}

function extractPassageTitle(stem: string): string | null {
  const match = stem.match(/^\[(.+?)\]/)
  return match ? match[1] : null
}

async function seedQuestions(questions: SeedQuestion[], passageMap: Map<string, string>, label: string) {
  console.log(`\n📝 Seeding ${label} (${questions.length} questions)...`)

  let created = 0
  let skipped = 0

  for (const q of questions) {
    // Check for duplicates by stem
    const existing = await prisma.placementQuestion.findFirst({
      where: { stem: q.stem, section: q.section },
    })

    if (existing) {
      skipped++
      continue
    }

    // For reading questions, link to passage
    let readingPassageId: string | undefined = undefined
    if (q.section === 'reading') {
      const passageTitle = extractPassageTitle(q.stem)
      if (passageTitle && passageMap.has(passageTitle)) {
        readingPassageId = passageMap.get(passageTitle)
      }
    }

    await prisma.placementQuestion.create({
      data: {
        section: q.section,
        cefrLevel: q.cefrLevel,
        topic: q.topic,
        subtopic: q.subtopic || null,
        difficulty: q.difficulty,
        stem: q.stem,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        recommendedTopic: q.recommendedTopic,
        readingPassageId: readingPassageId || null,
        active: true,
      },
    })
    created++
  }

  console.log(`  ✅ Created: ${created}, Skipped (duplicate): ${skipped}`)
  return created
}

async function main() {
  console.log('🚀 Starting Placement Test Question Seeder')
  console.log('==========================================')

  // 1. Seed reading passages first
  const passageMap = await seedReadingPassages()

  // 2. Seed all grammar question pools
  let totalCreated = 0

  totalCreated += await seedQuestions(grammarQuestions, passageMap, 'Core Grammar Questions')
  totalCreated += await seedQuestions(extendedGrammarQuestionsA1A2, passageMap, 'Extended A1/A2 Questions')
  totalCreated += await seedQuestions(extendedGrammarQuestionsB1B2, passageMap, 'Extended B1/B2 Questions')
  totalCreated += await seedQuestions(extendedGrammarQuestionsC1C2, passageMap, 'Extended C1/C2 Questions')
  totalCreated += await seedQuestions(additionalGrammarQuestions, passageMap, 'Additional Grammar Questions')
  totalCreated += await seedQuestions(part4GrammarQuestions, passageMap, 'Part 4 Grammar Questions')
  totalCreated += await seedQuestions(part5GrammarQuestions, passageMap, 'Part 5 Grammar Questions')

  // 3. Seed reading comprehension questions
  totalCreated += await seedQuestions(readingQuestions, passageMap, 'Reading Comprehension Questions')
  totalCreated += await seedQuestions(part4ReadingQuestions, passageMap, 'Part 4 Reading Questions')

  // 4. Print summary
  console.log('\n==========================================')
  console.log(`✅ SEED COMPLETE: ${totalCreated} total questions created`)

  // Print breakdown by level and section
  const counts = await prisma.placementQuestion.groupBy({
    by: ['section', 'cefrLevel'],
    _count: { id: true },
    orderBy: [{ section: 'asc' }, { cefrLevel: 'asc' }],
  })

  console.log('\n📊 Questions by Section & Level:')
  console.log('─────────────────────────────────')
  for (const c of counts) {
    console.log(`  ${c.section.padEnd(10)} ${c.cefrLevel.padEnd(4)} → ${c._count.id} questions`)
  }

  const totalCount = await prisma.placementQuestion.count()
  console.log(`\n📊 TOTAL QUESTIONS IN DATABASE: ${totalCount}`)

  const passageCount = await prisma.readingPassage.count()
  console.log(`📖 TOTAL READING PASSAGES: ${passageCount}`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

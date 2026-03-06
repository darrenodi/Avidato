import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Get IDs of all reading questions
  const readingQs = await prisma.placementQuestion.findMany({
    where: { section: 'reading' },
    select: { id: true },
  })
  const ids = readingQs.map((q) => q.id)
  console.log(`Found ${ids.length} reading questions`)

  // Delete answers that reference these questions
  if (ids.length > 0) {
    const deletedAnswers = await prisma.placementAnswer.deleteMany({
      where: { questionId: { in: ids } },
    })
    console.log(`Deleted ${deletedAnswers.count} answers referencing reading questions`)
  }

  // Now delete the reading questions
  const deleted = await prisma.placementQuestion.deleteMany({
    where: { section: 'reading' },
  })
  console.log(`Deleted ${deleted.count} reading questions`)

  // Delete reading passages
  const deletedPassages = await prisma.readingPassage.deleteMany({})
  console.log(`Deleted ${deletedPassages.count} reading passages`)
}

main()
  .catch((e) => {
    console.error('Failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

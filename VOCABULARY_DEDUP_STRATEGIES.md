# Vocabulary Deduplication Strategies

## Current State
- ✅ **Vocabulary is extracted** from lesson Exercise 1 (via `extractVocabularyFromLesson()`)
- ✅ **Previous vocabulary is passed to AI** (via `vocabularyContextSection` in prompt)
- ✅ **AI is instructed** to "naturally incorporate" 2-3 previous words in dialogue only
- ❌ **But there's NO enforcement** that new exercises don't repeat words from ALL previous lessons
- ❌ **AI sometimes ignores instruction** and creates new vocabulary items that were already taught

## The Problem
Right now only the PREVIOUS lesson is considered. If you generate 10 lessons in a learning plan, lesson #10 could repeat words from lessons #1-#9.

---

## Solution 1: "Blocklist Approach" (Easiest, 80% effective)

### How it works:
Pass ALL previously taught vocabulary to the AI as a blocklist.

### Implementation:
```typescript
// In src/lib/openai.ts, modify generateLesson():

async generateLesson(student, topic, duration) {
  // Get vocabulary from ALL previous lessons (not just last 3)
  const allPreviousVocabulary = await getAllStudentVocabulary(studentId);
  
  // Build blocklist section
  const blocklist = allPreviousVocabulary.map(v => v.word).join(', ');
  
  // Add to prompt:
  const blocklist_prompt = `
VOCABULARY BLOCKLIST - DO NOT USE:
The student has already learned these words in previous lessons:
${blocklist}

CRITICAL: Exercise 1 (Vocabulary) must contain 6 items NONE of which appear in the above list.
Your 6 new vocabulary items MUST be completely different from these ${allPreviousVocabulary.length} words.
`;
}
```

### Pros:
- ✅ Simple to implement
- ✅ AI understands "do not use these"
- ✅ Works for 80% of cases
- ✅ No database schema changes

### Cons:
- ❌ Prompt gets longer (adds ~50 lines)
- ❌ AI might still occasionally include blocked words
- ❌ No feedback if vocabulary IS repeated

---

## Solution 2: "Post-Generation Validation" (Medium effort, 95% effective)

### How it works:
Generate lesson normally, then validate vocabulary AFTER AI returns it. If duplicates found, either:
- A) Regenerate just that lesson
- B) Ask AI to replace duplicates with synonyms

### Implementation:
```typescript
// In src/lib/openai.ts

async generateLesson(student, topic, duration) {
  // ... existing code ...
  
  const parsedResponse = cleanAndParseJSON<GeneratedLesson>(jsonStr);
  
  // NEW: Validate vocabulary
  const allPreviousVocab = await getAllStudentVocabulary(studentId);
  const newVocab = parsedResponse.exercises[0]?.content?.vocabulary || [];
  
  const duplicates = newVocab.filter(word => 
    allPreviousVocab.some(prev => prev.word.toLowerCase() === word.word.toLowerCase())
  );
  
  if (duplicates.length > 0) {
    console.warn(`⚠️ Found ${duplicates.length} duplicate words:`, duplicates);
    
    // Option A: Regenerate the lesson (expensive)
    return this.generateLesson(student, topic, duration);
    
    // Option B: Ask AI to fix it (cheaper)
    const fixedLesson = await this.fixDuplicateVocabulary(
      parsedResponse, 
      duplicates, 
      allPreviousVocab
    );
    return fixedLesson;
  }
  
  return parsedResponse;
}
```

### Pros:
- ✅ Catches repeats 100% of the time
- ✅ Doesn't lengthen original prompt
- ✅ Can fix issues without full regeneration
- ✅ Provides visibility into when duplicates occur

### Cons:
- ❌ More code to maintain
- ❌ Takes longer if regenerating
- ❌ Needs a "fix duplicates" prompt

---

## Solution 3: "Database Constraint Approach" (Most robust, highest effort)

### How it works:
1. Create new database table `StudentVocabulary` to track all words taught to a student
2. Before generation, pass this list to AI (like Solution 1)
3. AFTER generation, validate and save confirmed vocabulary (like Solution 2)
4. This creates a permanent record preventing ANY repetition

### Schema changes needed:
```prisma
// Add to schema.prisma

model StudentVocabulary {
  id          String   @id @default(cuid())
  word        String
  definition  String
  level       String   // CEFR level (A1, B1, C1, etc)
  studentId   String
  lessonId    String
  createdAt   DateTime @default(now())
  student     Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  lesson      Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  
  @@unique([studentId, word])  // Each student can only "learn" each word once
  @@index([studentId])
  @@index([word])
}

// Update Student model:
model Student {
  id             String         @id @default(cuid())
  // ... existing fields ...
  vocabulary     StudentVocabulary[]
}

// Update Lesson model:
model Lesson {
  id        String   @id @default(cuid())
  // ... existing fields ...
  vocabulary StudentVocabulary[]
}
```

### Implementation:
```typescript
// In src/lib/openai.ts

async generateLesson(student, topic, duration) {
  // 1. Get all vocabulary this student has ever been taught
  const existingVocab = await prisma.studentVocabulary.findMany({
    where: { studentId: student.id },
    select: { word: true, definition: true }
  });
  
  const blocklist = existingVocab.map(v => v.word).join(', ');
  
  // 2. Include blocklist in prompt
  const prompt = buildLessonGenerationPrompt(
    student, topic, duration,
    // ... existing params ...
    blocklist  // NEW param
  );
  
  const parsedResponse = cleanAndParseJSON<GeneratedLesson>(jsonStr);
  
  // 3. Save generated lesson first
  const savedLesson = await prisma.lesson.create({...});
  
  // 4. Extract and save vocabulary with uniqueness constraint
  const newVocab = parsedResponse.exercises[0]?.content?.vocabulary || [];
  
  for (const vocabItem of newVocab) {
    try {
      await prisma.studentVocabulary.create({
        data: {
          word: vocabItem.word,
          definition: vocabItem.definition,
          level: parsedResponse.level,
          studentId: student.id,
          lessonId: savedLesson.id
        }
      });
    } catch (error) {
      if (error.code === 'P2002') { // Unique constraint violation
        console.error(`Vocabulary word already exists: ${vocabItem.word}`);
        // Handle duplicate - could log, alert, or regenerate
      }
    }
  }
  
  return parsedResponse;
}
```

### Pros:
- ✅ 100% prevents repetition (database constraint)
- ✅ Complete audit trail of all taught vocabulary
- ✅ Can query student's "vocabulary inventory" anytime
- ✅ Enables future features (vocabulary reviews, assessments, etc)

### Cons:
- ❌ Requires database migration
- ❌ Most code to write and maintain
- ❌ Slowest to implement

---

## My Recommendation: Hybrid Approach

**Start with Solution 1 + Solution 2:**

### Phase 1 (This week): Solution 1
1. Write function `getAllStudentVocabulary()` in vocabulary-tracker.ts
2. Add blocklist to prompt in openai.ts
3. Test with a few lessons
4. **Effort:** 1-2 hours

### Phase 2 (Next week): Add Solution 2  
1. Add post-generation validation
2. Create `fixDuplicateVocabulary()` helper
3. Log when duplicates are found
4. **Effort:** 2-3 hours

### Phase 3 (Optional): Database constraint
1. Create StudentVocabulary table
2. Migrate existing lesson data
3. Implement full enforcement
4. **Effort:** 4-5 hours

---

## Quick Implementation (Phase 1)

Add this function to `vocabulary-tracker.ts`:

```typescript
/**
 * Get ALL vocabulary ever taught to a student
 * Used to prevent repetition across all lessons
 */
export async function getAllStudentVocabulary(studentId: string): Promise<ExtractedVocabulary[]> {
  const lessons = await prisma.lesson.findMany({
    where: { studentId },
    select: { content: true }
  });

  const allVocabulary: ExtractedVocabulary[] = [];
  const seenWords = new Set<string>();

  for (const lesson of lessons) {
    const extracted = extractVocabularyFromLesson(lesson.content);
    for (const vocab of extracted) {
      const wordLower = vocab.word.toLowerCase();
      if (!seenWords.has(wordLower)) {
        seenWords.add(wordLower);
        allVocabulary.push(vocab);
      }
    }
  }

  return allVocabulary;
}
```

Then in `openai.ts` generateLesson():

```typescript
const allPreviousVocab = await getAllStudentVocabulary(studentId);
const blocklist = allPreviousVocab.map(v => v.word).join(', ');

const blocklistSection = allPreviousVocab.length > 0 ? `

VOCABULARY BLOCKLIST - CRITICAL:
The student has already learned these ${allPreviousVocab.length} words in previous lessons:
${blocklist}

✅ Your 6 new vocabulary items in Exercise 1 MUST NOT include any of the above words.
✅ If you accidentally use any blocked word, the lesson will be rejected.
` : '';
```

Then include `blocklistSection` in the prompt before sending to AI.

---

## Trade-off Summary

| Approach | Implementation Time | Effectiveness | Database Changes | Complexity |
|----------|-------------------|--------------|------------------|-----------|
| **Solution 1 (Blocklist)** | 1-2 hours | 85% | None | Low |
| **Solution 2 (Validation)** | 2-3 hours | 99% | None | Medium |
| **Solution 1 + 2 (Hybrid)** | 3-5 hours | 99%+ | None | Medium |
| **Solution 3 (DB Constraint)** | 4-5 hours | 100% | Yes | High |

**Recommendation:** Start with Solutions 1 + 2 (hybrid). Give you 99%+ effectiveness without database migration.

---

## What to Do

Which approach sounds best to you?

1. **Just implement Solution 1** (blocklist) - quick win
2. **Implement Solutions 1 + 2** (blocklist + validation) - most effective without DB changes
3. **Go full Solution 3** (database constraint) - most robust long-term

Pick one and I'll implement it.

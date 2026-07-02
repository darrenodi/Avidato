# Special Report Lesson Type

## Overview

The **Special Report** lesson type is designed for advanced learners (C1-C2 level) studying business English. It's based on the Linguahouse course structure and combines listening, reading, vocabulary, and discussion activities around a single business topic.

## Structure

Special Report lessons contain exactly **11 structured modules**:

1. **Warm Up** (4 min) - Activate prior knowledge with 3-4 discussion questions
2. **Focus on Keywords** (6 min) - Vocabulary matching from the source text
3. **Listen for Predictions 1** (5 min) - Predict numerical data from listening
4. **Listen for Predictions 2** (7 min) - Fill gaps with vocabulary from the audio script
5. **Listen for Details** (6 min) - Comprehension questions about the podcast/audio
6. **Discussion** (5 min) - Pair discussion about the topic
7. **Focus on Vocabulary** (8 min) - Vocabulary definitions + gap fill practice
8. **Skimming for General Understanding** (7 min) - Match paragraph titles to content
9. **Reading Comprehension** (7 min) - Answer short-answer questions about the text
10. **Discussion** (5 min) - Follow-up discussion questions
11. **Vocabulary for Conversation** (6 min) - Natural language phrases + practice questions

**Total Duration:** 60 minutes

## Metadata

```typescript
interface SpecialReportLessonContent {
  title: string                    // e.g., "The Decline of the Digital Nomad"
  lessonType: 'special-report'     // Always this value
  courseTitle: string              // e.g., "Business English"
  level: string                    // e.g., "Advanced (C1-C2)"
  topic: string                    // e.g., "Digital Nomad Lifestyle"
  objective: string                // Learning outcome
  duration: number                 // 60 minutes
  difficulty: number               // 1-10 scale
  skills: string[]                 // e.g., ["Listening", "Reading", "Speaking"]
  expemoCode?: string              // Optional: flashcard review code
  modules: LessonModule[]          // Exactly 11 modules
  teachingNotes: string            // Guidance for tutors
}
```

## Module Types

Each module uses one of these types:

| Position | Type | Purpose |
|----------|------|---------|
| 1 | `warm-up` | Discussion questions to engage students |
| 2 | `vocabulary-match` | Match terms to definitions from the text |
| 3 | `listening-prediction` | Predict meaning of numerical references |
| 4 | `listening-details` | Fill-the-blank comprehension from audio |
| 5 | `listening-details` | Answer comprehension questions about audio |
| 6 | `discussion` | Pair/group discussion questions |
| 7 | `vocabulary-context` | Vocabulary with definitions + gap fill |
| 8 | `reading-skimming` | Match paragraph titles to paragraphs |
| 9 | `reading-scan` | Short-answer comprehension questions |
| 10 | `discussion` | Follow-up discussion questions |
| 11 | `vocabulary-for-conversation` | Natural phrases + conversation practice |

## Creating a Special Report Lesson

### Using the Template

```typescript
import { createSpecialReportLessonTemplate } from '@/lib/lesson-templates/special-report-template'

const myLesson = createSpecialReportLessonTemplate({
  title: 'Your Topic Title',
  topic: 'The Main Topic',
  level: 'Advanced (C1-C2)',
  courseTitle: 'Business English',
  objective: 'Students will understand...',
  duration: 60,
  difficulty: 8,
  skills: ['Listening', 'Reading', 'Speaking', 'Vocabulary'],
  expemoCode: 'ABC-XYZ-123',
  modules: [
    // ... 11 modules in order
  ],
})
```

### Module Content Examples

#### 1. Warm-up Module
```typescript
{
  type: 'warm-up',
  title: 'Warm Up',
  timeMinutes: 4,
  content: {
    questions: [
      'Question 1?',
      'Question 2?',
      'Question 3?',
    ],
    instructions: 'In pairs, discuss the following questions.',
  },
}
```

#### 2. Vocabulary Match Module
```typescript
{
  type: 'vocabulary-match',
  title: 'Focus on Keywords',
  timeMinutes: 6,
  content: {
    instructions: 'Match the words to their definitions.',
    pairs: [
      {
        sentence: 'The word appeared in this sentence...',
        term: 'word',
        definition: 'Definition of the word',
      },
      // ... more pairs
    ],
  },
}
```

#### 7. Vocabulary with Gap Fill
```typescript
{
  type: 'vocabulary-context',
  title: 'Focus on Vocabulary',
  timeMinutes: 8,
  content: {
    instructions: 'Learn and practice these words.',
    vocabulary: [
      {
        word: 'enticing',
        partOfSpeech: 'adj.',
        definition: 'so interesting or attractive...',
        example: 'The offer sounded enticing.',
      },
      // ... more vocabulary
    ],
    gapFill: {
      sentences: [
        {
          sentence: 'That offer is very _____.',
          answer: 'enticing',
        },
        // ... more sentences
      ],
    },
  },
}
```

## Displaying Special Report Lessons

### In Your Lesson Page

```typescript
import { SpecialReportLessonDisplay } from '@/lib/lesson-displays'
import { digitalNomadSpecialReportExample } from '@/lib/lesson-templates/special-report-template'

export default function LessonPage() {
  const lesson = digitalNomadSpecialReportExample
  
  return (
    <SpecialReportLessonDisplay
      lesson={lesson}
      showObjectives={true}
      showProgressBar={true}
      showHeader={true}
      isTutorView={true}
    />
  )
}
```

### Display Features

✅ **Module Navigation** - Click numbered tabs to jump to any module  
✅ **Progress Tracking** - Mark modules complete as you progress  
✅ **Progress Bar** - Visual indicator of lesson completion  
✅ **Header Information** - Course title, level, topic displayed  
✅ **Time Estimates** - Each module shows duration  
✅ **Responsive Design** - Works on desktop, tablet, mobile  
✅ **Dark Mode** - Automatic light/dark theme support  
✅ **Tutor View** - Optional tutor notes and answers displayed  

## Content Guidelines

### Vocabulary Matching (Module 2)
- Include 6-8 vocabulary items
- Use sentences from the actual text
- Match at intermediate difficulty (B1+)
- Include parts of speech

### Listening Predictions (Modules 3-4)
- Numbers should be realistic and meaningful
- Gap fill should use vocabulary from Module 2
- Predictions help students activate prior knowledge

### Listening Comprehension (Module 5)
- Questions should follow Bloom's: recall, understand, apply
- Mix of 5-7 questions
- Include question types: what, where, how long, why

### Discussion (Modules 6 & 10)
- 4 questions each, open-ended
- Should generate 5-10 minutes of conversation
- Build on content, personal experiences, predictions

### Vocabulary with Gap Fill (Module 7)
- 7-8 vocabulary items with definitions, examples
- Gap fill practice with 5 sentences
- Mix word families: verbs, adjectives, nouns

### Reading Skimming (Module 8)
- 7 paragraph titles
- 3-4 actual paragraphs to match against
- Titles should be distinct and specific

### Reading Comprehension (Module 9)
- 7 short-answer questions
- Answers: 1-3 words from the text
- Progressive difficulty from literal to inferential

### Vocabulary for Conversation (Module 11)
- 4 natural language phrases
- Each phrase includes context and meaning
- 4 follow-up "Let's Chat" questions
- Phrases should be authentic and reusable

## Validation

Check if your lesson meets the requirements:

```typescript
import { validateSpecialReportLesson } from '@/lib/lesson-templates/special-report-template'

const result = validateSpecialReportLesson(myLesson)
if (!result.valid) {
  console.error('Validation errors:', result.errors)
}
```

## Example: Complete Special Report

See [special-report-template.ts](./special-report-template.ts) for the complete "Digital Nomad" example with all 11 modules fully implemented.

## Integration Checklist

- [ ] Create lesson data with all 11 modules
- [ ] Ensure lessonType is set to 'special-report'
- [ ] Validate using validateSpecialReportLesson()
- [ ] Save lesson to database
- [ ] Add lesson type check in display logic
- [ ] Render with SpecialReportLessonDisplay component
- [ ] Test all module types render correctly
- [ ] Test navigation between modules
- [ ] Test progress tracking
- [ ] Test on mobile, tablet, desktop
- [ ] Test dark mode
- [ ] Deploy to production

## Benefits

🎯 **Structured Approach** - 11-module format ensures comprehensive learning  
📚 **Multi-skill** - Combines listening, reading, vocabulary, speaking  
💼 **Business Context** - Uses real business English topics  
⏱️ **Time-efficient** - Exactly 60 minutes, predictable structure  
🎓 **Advanced Level** - Designed for C1-C2 learners  
🌐 **International** - Based on proven Linguahouse methodology  

## Next Steps

1. **Create Content** - Use the template to create your lesson
2. **Validate** - Check for errors with validateSpecialReportLesson()
3. **Display** - Render with SpecialReportLessonDisplay
4. **Teach** - Use with students in tutoring sessions
5. **Refine** - Gather feedback and update as needed

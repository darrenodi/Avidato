# Special Report Lesson - Quick Start Guide

## Copy-Paste Example

### 1. Display in Your Page

```tsx
import { SpecialReportLessonDisplay } from '@/lib/lesson-displays'
import { digitalNomadSpecialReportExample } from '@/lib/lesson-templates/special-report-template'

export default function LessonPage() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <SpecialReportLessonDisplay
        lesson={digitalNomadSpecialReportExample}
        showObjectives={true}
        showProgressBar={true}
        showHeader={true}
        isTutorView={false}
      />
    </div>
  )
}
```

### 2. Create a New Lesson

```typescript
import { createSpecialReportLessonTemplate } from '@/lib/lesson-templates/special-report-template'
import { SpecialReportLessonContent } from '@/types/module-lesson'

const myLesson: SpecialReportLessonContent = createSpecialReportLessonTemplate({
  title: 'Artificial Intelligence in Business',
  topic: 'AI Trends',
  level: 'Advanced (C1-C2)',
  courseTitle: 'Business English',
  objective: 'Understand the impact of AI on modern business practices',
  duration: 60,
  difficulty: 8,
  skills: ['Listening', 'Reading', 'Speaking', 'Vocabulary'],
  expemoCode: 'AI-TREND-001',
  
  modules: [
    // Module 1: Warm up
    {
      type: 'warm-up',
      title: 'Warm Up',
      timeMinutes: 4,
      content: {
        questions: [
          'How do you currently use AI in your daily work?',
          'What are the main benefits of AI for businesses?',
          'What concerns do you have about AI replacing jobs?',
        ],
        instructions: 'In pairs, discuss the following questions.',
      },
    },

    // Module 2: Focus on keywords
    {
      type: 'vocabulary-match',
      title: 'Focus on Keywords',
      timeMinutes: 6,
      content: {
        instructions: 'Match the underlined words to the definitions.',
        pairs: [
          {
            sentence: 'AI has become ubiquitous in modern business.',
            term: 'ubiquitous',
            definition: '(adj.) present, appearing, or found everywhere',
          },
          {
            sentence: 'The algorithm processes data with remarkable efficiency.',
            term: 'algorithm',
            definition: '(n) a step-by-step procedure for solving a problem',
          },
          // ... more pairs
        ],
      },
    },

    // Module 3: Listen for predictions 1
    {
      type: 'listening-prediction',
      title: 'Listen for Predictions 1',
      timeMinutes: 5,
      content: {
        instructions: 'Listen to the podcast and predict what these numbers refer to.',
        items: [
          { number: '65%' },
          { number: '$15.3 trillion' },
          { number: '2030' },
          { number: '47%' },
        ],
      },
    },

    // Module 4: Listen for predictions 2
    {
      type: 'listening-details',
      title: 'Listen for Predictions 2',
      timeMinutes: 7,
      content: {
        instructions: 'Fill the gaps with words from Module 2.',
        questions: [
          {
            question: 'AI has become _____ in modern business.',
            answer: 'ubiquitous',
          },
          {
            question: 'The _____ processes data efficiently.',
            answer: 'algorithm',
          },
          // ... more questions
        ],
      },
    },

    // Module 5: Listen for details
    {
      type: 'listening-details',
      title: 'Listen for Details',
      timeMinutes: 6,
      content: {
        instructions: 'Answer the comprehension questions.',
        questions: [
          {
            question: 'What is the main focus of the podcast?',
            answer: 'How AI is transforming business',
          },
          {
            question: 'Which industries are mentioned?',
            answer: 'Finance, healthcare, and manufacturing',
          },
          // ... more questions
        ],
      },
    },

    // Module 6: Discussion
    {
      type: 'discussion',
      title: 'Discussion',
      timeMinutes: 5,
      content: {
        instructions: 'Discuss with your partner.',
        questions: [
          'Do you think AI will create or destroy jobs?',
          'What ethical concerns does AI raise?',
          'How should governments regulate AI?',
          'What opportunities does AI present for your industry?',
        ],
      },
    },

    // Module 7: Focus on vocabulary
    {
      type: 'vocabulary-context',
      title: 'Focus on Vocabulary',
      timeMinutes: 8,
      content: {
        instructions: 'Learn these terms and complete the gap fill.',
        vocabulary: [
          {
            word: 'machine learning',
            partOfSpeech: 'n',
            definition: 'the ability of computers to learn from data without being explicitly programmed',
            example: 'Machine learning powers recommendation systems.',
          },
          {
            word: 'neural network',
            partOfSpeech: 'n',
            definition: 'a computer system inspired by biological neural networks',
            example: 'Neural networks enable deep learning applications.',
          },
          // ... more vocabulary
        ],
        gapFill: {
          sentences: [
            {
              sentence: '_____ powers most modern AI applications.',
              answer: 'Machine learning',
            },
            {
              sentence: 'A _____ mimics how the human brain processes information.',
              answer: 'neural network',
            },
            // ... more sentences
          ],
        },
      },
    },

    // Module 8: Skimming for general understanding
    {
      type: 'reading-skimming',
      title: 'Skimming for General Understanding',
      timeMinutes: 7,
      content: {
        instructions: 'Match paragraph titles to paragraphs.',
        paragraphTitles: [
          'The economic impact of AI',
          'How machine learning works',
          'Ethical considerations',
          'Future applications',
          'Challenges and limitations',
        ],
        paragraphs: [
          {
            content: 'Artificial intelligence is transforming the global economy...',
          },
          {
            content: 'Machine learning algorithms learn patterns from data...',
          },
          // ... more paragraphs
        ],
      },
    },

    // Module 9: Reading comprehension
    {
      type: 'reading-scan',
      title: 'Reading Comprehension',
      timeMinutes: 7,
      content: {
        instructions: 'Answer using 1-3 words from the text.',
        questions: [
          {
            question: 'What is the main topic of the article?',
            answer: 'AI transformation in business',
          },
          {
            question: 'Name three industries mentioned.',
            answer: 'Finance, healthcare, manufacturing',
          },
          // ... more questions
        ],
      },
    },

    // Module 10: Discussion
    {
      type: 'discussion',
      title: 'Discussion',
      timeMinutes: 5,
      content: {
        instructions: 'Follow-up discussion.',
        questions: [
          'Has the article changed your perspective on AI?',
          'Would you implement AI in your business?',
          'What skills will be important in an AI-driven world?',
          'How can workers prepare for AI integration?',
        ],
      },
    },

    // Module 11: Vocabulary for conversation
    {
      type: 'vocabulary-for-conversation',
      title: 'Vocabulary for Conversation',
      timeMinutes: 6,
      content: {
        instructions: 'Learn these phrases and practice using them.',
        phrases: [
          {
            phrase: 'raise ethical concerns',
            meaning: 'bring up issues about right and wrong',
          },
          {
            phrase: 'transform the landscape',
            meaning: 'change the overall situation significantly',
          },
          {
            phrase: 'leverage technology',
            meaning: 'use technology effectively to gain advantage',
          },
          {
            phrase: 'bridge the gap',
            meaning: 'help close the difference between two things',
          },
        ],
        practice: {
          questions: [
            {
              question: 'How might AI raise ethical concerns in your industry?',
            },
            {
              question: 'Can you describe how technology has transformed your field?',
            },
            {
              question: 'How can businesses leverage AI to compete?',
            },
            {
              question: 'What skills bridge the gap between human and machine work?',
            },
          ],
        },
      },
    },
  ],

  teachingNotes: 'This lesson explores the impact and applications of AI in business. Start with the warm-up to activate prior knowledge, then progress through listening and reading sections. Encourage discussion throughout, and have students explain technical concepts in their own words.',
})
```

## Types

```typescript
import { SpecialReportLessonContent, LessonModule } from '@/types/module-lesson'

interface SpecialReportLessonContent {
  title: string                    // Lesson title
  lessonType: 'special-report'     // Must be this value
  courseTitle: string              // e.g., "Business English"
  level: string                    // e.g., "Advanced (C1-C2)"
  topic: string                    // Main topic
  objective: string                // What students will learn
  duration: number                 // Minutes (typically 60)
  difficulty: number               // 1-10 scale
  skills: string[]                 // ["Listening", "Reading", ...]
  expemoCode?: string              // Optional flashcard code
  modules: LessonModule[]          // Exactly 11 modules
  teachingNotes: string            // Tutor guidance
}
```

## Module Type Options

```
'warm-up'                       Module 1 - Discussion questions
'vocabulary-match'              Module 2 - Vocabulary matching
'listening-prediction'          Module 3 - Number predictions
'listening-details'             Module 4-5 - Listening comprehension
'discussion'                    Module 6 & 10 - Discussion questions
'vocabulary-context'            Module 7 - Vocabulary + gap fill
'reading-skimming'              Module 8 - Paragraph matching
'reading-scan'                  Module 9 - Short answer questions
'vocabulary-for-conversation'   Module 11 - Phrases + practice
```

## Validation

```typescript
import { validateSpecialReportLesson } from '@/lib/lesson-templates/special-report-template'

const result = validateSpecialReportLesson(myLesson)

if (result.valid) {
  console.log('✅ Lesson is valid')
} else {
  console.error('❌ Errors:', result.errors)
  // Errors like:
  // - Missing title
  // - Duration should be between 30-120 minutes
  // - Should have at least 10 modules
  // - lessonType must be "special-report"
}
```

## Display Props

```typescript
<SpecialReportLessonDisplay
  lesson={myLesson}                    // Required: lesson data
  showObjectives={true}                // Show learning objectives
  showProgressBar={true}               // Show progress bar
  showHeader={true}                    // Show metadata header
  isTutorView={false}                  // Show tutor notes/answers
/>
```

## Features Automatically Included

✅ Module navigation with numbered tabs  
✅ Progress tracking per module  
✅ Visual progress bar  
✅ Time estimates  
✅ Previous/Next buttons  
✅ Mark complete functionality  
✅ Responsive mobile/tablet/desktop  
✅ Dark mode support  
✅ Smooth scroll to top  

## Use Cases

📚 **Business English Training** - Use the template for corporate clients  
🎓 **Language Schools** - Add to course libraries  
👥 **One-on-One Tutoring** - Presley with comprehensive structure  
💼 **Professional Development** - English for specific industries  
🌐 **Online Platforms** - Add premium content  

## File Locations

```
src/
├── types/
│   └── module-lesson.ts                     ← Type definitions
├── lib/
│   ├── lesson-displays/
│   │   ├── special-report-display.tsx       ← Display component
│   │   └── index.ts
│   └── lesson-templates/
│       └── special-report-template.ts       ← Template & example
└── app/
    └── lessons/
        └── [id]/
            └── page.tsx                      ← Use component here

docs/
├── SPECIAL_REPORT_LESSON_TYPE.md            ← Full guide
├── SPECIAL_REPORT_IMPLEMENTATION.md         ← Implementation details
└── SPECIAL_REPORT_QUICK_START.md            ← This file
```

## Tips

💡 **Module 2 sets up vocabulary** → Use in Modules 4, 7, 11  
💡 **Listening comes before reading** → Good pedagogical sequence  
💡 **Discussion bookends content** → Modules 6 & 10  
💡 **Always 11 modules** → Consistent structure  
💡 **Always ~60 minutes** → Predictable lesson length  
💡 **Validate before saving** → Catch errors early  

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Modules not rendering | Check module `type` matches list above |
| Styling looks off | Ensure Tailwind CSS configured |
| Dark mode not working | Check dark: prefixes in CSS |
| Progress not tracking | Verify state updates in component |
| TypeScript errors | Check imported types match interfaces |

## Resources

📖 [Full Documentation](../../docs/SPECIAL_REPORT_LESSON_TYPE.md)  
💾 [Example Data](../special-report-template.ts)  
🎨 [Component Code](../lesson-displays/special-report-display.tsx)  
📝 [Implementation Details](../../docs/SPECIAL_REPORT_IMPLEMENTATION.md)  

---

**Ready to create your first Special Report lesson!** Copy the example above and customize for your topic. 🚀

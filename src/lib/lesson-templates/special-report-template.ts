/**
 * Special Report Lesson Template
 * 
 * Creates Business English Special Report lessons with exactly 11 modules
 * based on real Linguahouse course material structure
 * 
 * Template: "Business English · Special Report · ADVANCED (C1-C2)"
 * with customizable topic, title, and content
 */

import { SpecialReportLessonContent, LessonModule } from '@/types/module-lesson'

export const createSpecialReportLessonTemplate = (config: {
  title: string
  topic: string
  level: string
  courseTitle?: string
  objective: string
  duration: number
  difficulty: number
  skills: string[]
  expemoCode?: string
  modules: LessonModule[]
  teachingNotes?: string
  source?: string
}): SpecialReportLessonContent => ({
  title: config.title,
  lessonType: 'special-report',
  courseTitle: config.courseTitle || 'Business English',
  level: config.level,
  topic: config.topic,
  objective: config.objective,
  duration: config.duration,
  difficulty: config.difficulty,
  skills: config.skills,
  expemoCode: config.expemoCode,
  modules: config.modules,
  teachingNotes: config.teachingNotes || 'Review the lesson structure and ensure all modules flow naturally. The structure combines listening, reading, vocabulary, and discussion activities.',
  metadata: {
    source: config.source,
    category: 'Special Report',
  },
})

/**
 * Example: Digital Nomad Special Report Lesson
 * Based on the Linguahouse "The Decline of the Digital Nomad" structure
 */
export const digitalNomadSpecialReportExample: SpecialReportLessonContent = {
  title: 'The Decline of the Digital Nomad',
  lessonType: 'special-report',
  courseTitle: 'Business English',
  level: 'Advanced (C1-C2)',
  topic: 'Digital Nomad Lifestyle',
  objective: 'Understand the challenges and realities of digital nomad work through listening and reading comprehension',
  duration: 60,
  difficulty: 8,
  skills: ['Listening', 'Reading', 'Speaking', 'Vocabulary'],
  expemoCode: '1DJN-X1EZ-48U',
  modules: [
    // Module 1: Warm up
    {
      type: 'warm-up',
      title: 'Warm Up',
      timeMinutes: 4,
      content: {
        questions: [
          'Would you prefer to work 9-5 or does a flexi-schedule suit your lifestyle better?',
          'Have you ever thought about remote working? Why/Why not?',
          'What are some of the benefits of working remotely?',
          'Can you think of any drawbacks in relation to freelance work?',
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
        instructions: 'Match the underlined words to the definitions below.',
        pairs: [
          {
            sentence: 'The mounting pressure on the government was likely to push them into calling a general election.',
            term: 'mounting',
            definition: '(adj.) increasing, often in a way that causes some to worry',
          },
          {
            sentence: 'We wanted to go to one of the trendy hotspots in the town centre, but the queue was too long.',
            term: 'hotspots',
            definition: '(n) a place where there is a lot of excitement or activity',
          },
          {
            sentence: 'As I\'ve grown older, I have become a bit of a lone wolf.',
            term: 'lone wolf',
            definition: '(n) a person who prefers to live or work alone',
          },
          {
            sentence: 'Due to the leaking roof, the overwhelming feeling was that they had to move house.',
            term: 'overwhelming',
            definition: '(adj.) so powerful that it is impossible to resist',
          },
          {
            sentence: 'They have been in the village for 20 years, but they originally hail from London.',
            term: 'hail from',
            definition: '(phr. v) come from or be born in a certain place',
          },
          {
            sentence: 'The hotel offered us a smorgasbord of entertainment options when we arrived, but I just wanted to chill out at the pool.',
            term: 'smorgasbord',
            definition: '(n) a wide range of something',
          },
          {
            sentence: 'A substantial amount of money was stolen from the bank this morning.',
            term: 'substantial',
            definition: '(adj.) large in importance',
          },
        ],
      },
    },

    // Module 3: Listen for predictions 1
    {
      type: 'listening-prediction',
      title: 'Listen for Predictions 1',
      timeMinutes: 5,
      content: {
        instructions: 'Look at the expressions related to numbers and with your partner try to predict what each of them might refer to in relation to digital nomads, then listen to the podcast and see if your ideas are similar.',
        items: [
          { number: '35 million' },
          { number: '$787 billion' },
          { number: '47%' },
          { number: '61%' },
          { number: '$10-$30' },
        ],
      },
    },

    // Module 4: Listen for predictions 2
    {
      type: 'listening-details',
      title: 'Listen for Predictions 2',
      timeMinutes: 7,
      content: {
        instructions: 'Read the sentences from the script and think about which words from the vocabulary section could go in the gaps, only five are needed. Afterwards, listen to the audio and check your predictions.',
        questions: [
          {
            question: 'The influence that digital nomads have in today\'s business world...',
            answer: 'influence',
          },
          {
            question: '35 million digital nomads working in various _____ around the world...',
            answer: 'countries/industries',
          },
          {
            question: '61% of digital nomads are men and most are _____',
            answer: 'under 35',
          },
          {
            question: '51% of digital nomads originally _____ from America.',
            answer: 'hail',
          },
          {
            question: 'a _____ for people who find themselves on the more creative side of things...',
            answer: 'need',
          },
        ],
      },
    },

    // Module 5: Listen for details
    {
      type: 'listening-details',
      title: 'Listen for Details',
      timeMinutes: 6,
      content: {
        instructions: 'Listen to the podcast one more time and try to answer the following questions.',
        questions: [
          {
            question: 'Where are digital nomads often read about?',
            answer: 'In magazines and blogs / Social media',
          },
          {
            question: 'How big would Digital Nomad-land be?',
            answer: 'As big as a large country',
          },
          {
            question: 'How long do most digital nomads stay in the same place?',
            answer: 'Several months / 3-6 months',
          },
          {
            question: 'In which industry do most of the companies who employ digital nomads work in?',
            answer: 'Tech / Technology',
          },
          {
            question: 'What creative jobs are mentioned in the report?',
            answer: 'Designers, writers, developers',
          },
        ],
      },
    },

    // Module 6: Discussion
    {
      type: 'discussion',
      title: 'Discussion',
      timeMinutes: 5,
      content: {
        instructions: 'Read through the questions then talk about them with your partner.',
        questions: [
          'What do you think about the concept of a digital nomad?',
          'Would you like to live a year as a digital nomad? Why/Why not?',
          'Do you have any skills in relation to the tech or creative industries?',
          'Can you think of any reasons why people might stop being digital nomads?',
        ],
      },
    },

    // Module 7: Focus on vocabulary
    {
      type: 'vocabulary-context',
      title: 'Focus on Vocabulary',
      timeMinutes: 8,
      content: {
        instructions: 'Part A: Match the following vocabulary to the definitions. Part B: Put the vocabulary from Part A into the correct gaps in the following sentences.',
        vocabulary: [
          {
            word: 'enticing',
            partOfSpeech: 'adj.',
            definition: 'so interesting or attractive that you want to know more about it',
            example: 'The thought of spending two weeks in Spain sounded very enticing.',
          },
          {
            word: 'wear thin',
            partOfSpeech: 'idiom',
            definition: 'gradually becomes harder or weaker to accept',
            example: 'After six months, my teacher\'s weird voice was beginning to wear thin.',
          },
          {
            word: 'clamped down on',
            partOfSpeech: 'phr. v',
            definition: 'suppress or prevent something, often in an aggressive way',
            example: 'The local police started a campaign to clamp down on teenage drinking in the neighbourhood.',
          },
          {
            word: 'superficial',
            partOfSpeech: 'adj.',
            definition: 'not serious or important',
            example: 'It seems really superficial for her mother to buy her a new mobile phone.',
          },
          {
            word: 'yearn',
            partOfSpeech: 'v',
            definition: 'want something very much even if it is impossible to reach',
            example: 'She used to sit and yearn but I used to spend all my money on designer baseball caps.',
          },
          {
            word: 'burnout',
            partOfSpeech: 'n',
            definition: 'state of being physically or mentally exhausted due to work',
            example: 'In my last job, I used to work 80 hours a week and by the end, I was heading towards burnout.',
          },
          {
            word: 'commissioned',
            partOfSpeech: 'v',
            definition: 'asked someone to write, make or create something for you',
            example: 'I was commissioned to design the bathrooms for a new department store that was opening.',
          },
          {
            word: 'prominent',
            partOfSpeech: 'adj.',
            definition: 'important or well-known',
            example: 'The Eiffel Tower is such a prominent feature of the Paris skyline.',
          },
        ],
        gapFill: {
          sentences: [
            {
              sentence: 'The local police started a campaign to _____ teenage drinking in the neighbourhood.',
              answer: 'clamp down on',
            },
            {
              sentence: 'In my last job, I used to work 80 hours a week and by the end, I was heading towards _____.',
              answer: 'burnout',
            },
            {
              sentence: 'After six months, my teacher\'s weird voice was beginning to _____.',
              answer: 'wear thin',
            },
            {
              sentence: 'The Eiffel Tower is such a _____ feature of the Paris skyline.',
              answer: 'prominent',
            },
            {
              sentence: 'I was _____ to design the bathrooms for a new department store that was opening.',
              answer: 'commissioned',
            },
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
        instructions: 'Read the following paragraph titles for the article and match them to the correct paragraph.',
        paragraphTitles: [
          'The right to work',
          'Already qualified',
          'A perfect world',
          'Positives don\'t last forever',
          'All roads lead to being lonely',
          'Too much pressure',
          'Complicated visa rules',
        ],
        paragraphs: [
          {
            content: 'When the world was first sold the idea of the digital nomad, the positives that came out seemed so obvious, we all wondered why we were not all jumping on the bandwagon. Freedom of movement was the primary selling point, the ability to move to any country, any city, any place was just too enticing for many. Put on top of that the opportunity to have a flexi-schedule and no real boss barking orders down your neck all day, it seemed too good to be true and as it turns out for many, it was.',
          },
          {
            content: 'It has become clear over the last couple of years that living as a digital nomad has a limited shelf life and the attractiveness that was once there has started to wear thin for many. So, what are the reasons that people have stopped making themselves available as remote workers?',
          },
          {
            content: 'One of the chief reasons for many is the complications surrounding the obtainment of visas in different countries. While the idea of being able to travel freely sounds amazing, the actual reality doesn\'t quite exist, as to work in almost any country you need to get yourself a work visa.',
          },
        ],
      },
    },

    // Module 9: Reading comprehension
    {
      type: 'reading-scan',
      title: 'Reading Comprehension',
      timeMinutes: 7,
      content: {
        instructions: 'Answer the questions below. Choose no more than three words from the passage for the answer.',
        questions: [
          {
            question: 'What was the main selling point for life as a digital nomad?',
            answer: 'Freedom of movement',
          },
          {
            question: 'One of the main reasons putting people off is complications related to what?',
            answer: 'Visas / Work visas',
          },
          {
            question: 'How long can an American freelance worker stay in the Schengen zone?',
            answer: '90 days',
          },
          {
            question: 'Being a digital nomad can lead to what kind of feelings?',
            answer: 'Loneliness and isolation',
          },
          {
            question: 'Find a phrase that is similar in meaning to "always moving".',
            answer: 'Constantly travelling',
          },
          {
            question: 'When you are working freelance, what kind of things do you have to meet?',
            answer: 'Tight deadlines',
          },
          {
            question: 'Find a phrase that is similar in meaning to "steady salary"',
            answer: 'Stable income',
          },
        ],
      },
    },

    // Module 10: Discussion
    {
      type: 'discussion',
      title: 'Discussion',
      timeMinutes: 5,
      content: {
        instructions: 'Look at the questions and discuss them with your partner.',
        questions: [
          'What did you think of the article? What was the most interesting thing?',
          'Do you think there are more pros or cons when working as a digital nomad?',
          'Do you think life as a digital nomad is more suited to a younger or older person? Why do you think that?',
          'Can you think of any other careers in which people might suffer from feelings of loneliness or isolation?',
        ],
      },
    },

    // Module 11: Vocabulary for conversation
    {
      type: 'vocabulary-for-conversation',
      title: 'Vocabulary for Conversation',
      timeMinutes: 6,
      content: {
        instructions: 'Look at the examples of natural language from the audio report and the article with your partner and from the context, try to guess the meaning of each one. To help you remember the expressions, have a discussion with your partner and use them to talk about your life.',
        phrases: [
          {
            phrase: 'hard to put a finger on',
            meaning: 'difficult to identify or explain exactly',
          },
          {
            phrase: 'jumping on the bandwagon',
            meaning: 'joining something that is becoming popular',
          },
          {
            phrase: 'barking orders down your neck',
            meaning: 'giving you orders in an aggressive way',
          },
          {
            phrase: 'put some roots down',
            meaning: 'establish a permanent home or settle somewhere',
          },
        ],
        practice: {
          questions: [
            {
              question: 'Do you think it is hard to put your finger on why some people find it hard to learn languages?',
            },
            {
              question: 'Can you remember the last time you jumped on the bandwagon?',
            },
            {
              question: 'Have you ever worked with someone who barked orders down your neck?',
            },
            {
              question: 'At what age do people in your country usually start putting some roots down?',
            },
          ],
        },
      },
    },
  ],
  teachingNotes: 'This lesson combines listening, reading, and speaking activities around the topic of digital nomad work. The structure flows from warm-up through vocabulary preparation, listening comprehension, reading comprehension, and finally discussion and conversation practice. Teachers should ensure students understand the vocabulary in Module 2 and 7 before moving to comprehension sections.',
}

/**
 * Helper function to generate a Special Report lesson from structured data
 * Ensures the lesson follows the correct 11-module structure
 */
export const validateSpecialReportLesson = (lesson: SpecialReportLessonContent): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!lesson.title) errors.push('Missing title')
  if (!lesson.topic) errors.push('Missing topic')
  if (!lesson.objective) errors.push('Missing objective')
  if (!lesson.level) errors.push('Missing level')
  if (lesson.duration < 30 || lesson.duration > 120) {
    errors.push('Duration should be between 30-120 minutes')
  }
  if (lesson.difficulty < 1 || lesson.difficulty > 10) {
    errors.push('Difficulty should be between 1-10')
  }
  if (!lesson.modules || lesson.modules.length < 10) {
    errors.push('Special Report lessons should have at least 10 modules')
  }
  if (lesson.lessonType !== 'special-report') {
    errors.push('lessonType must be "special-report"')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

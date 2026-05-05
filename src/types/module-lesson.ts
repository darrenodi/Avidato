// ─── Module Lesson Types ────────────────────────────────────────────────────

export type ModuleType =
  | 'warm-up'
  | 'vocabulary-cards'
  | 'vocabulary-match'
  | 'useful-expressions'
  | 'useful-language'
  | 'language-in-context'
  | 'phrasal-verbs'
  | 'gap-fill'
  | 'find-the-mistake'
  | 'ordering'
  | 'sentence-correction'
  | 'grammar-focus'
  | 'dialogue'
  | 'reading-article'
  | 'reading-scan'
  | 'vocabulary-in-text'
  | 'skim-main-idea'
  | 'matching-qa'
  | 'listening-true-false'
  | 'listening-mcq'
  | 'roleplay'
  | 'talking-point'
  | 'discussion'
  | 'debate'
  | 'homework-writing'

// ─── Module Content Interfaces ──────────────────────────────────────────────

export interface WarmUpContent {
  questions: string[]
  instructions?: string
}

export interface VocabularyCardsContent {
  vocabulary: {
    word: string
    partOfSpeech: string
    phonetics: string
    definition: string
    example: string
    synonym?: string
  }[]
}

export interface VocabularyMatchPair {
  sentence: string
  term: string
  definition: string
}

export interface VocabularyMatchContent {
  groups?: { label: string; pairs: VocabularyMatchPair[] }[]
  pairs?: VocabularyMatchPair[]
  instructions?: string
}

export interface UsefulExpressionsContent {
  context?: string
  expressions: (string | { full: string; stem: string })[]
  instructions?: string
}

export interface UsefulLanguageContent {
  phrases: { phrase: string; stem?: string; example: string }[]
  practice: {
    sentences: { prompt: string; answer: string }[]
  }
}

export interface LanguageInContextContent {
  phrases: { phrase: string; function: string; example?: string }[]
  instructions?: string
}

export interface PhrasalVerbsContent {
  pairs: { verb: string; meaning: string; example?: string }[]
  discussionQuestions?: string[]
}

export interface GapFillContent {
  instructions: string
  sentences: { sentence: string; answer: string }[]
  wordBank?: string[]
}

export interface FindTheMistakeContent {
  instructions: string
  sentences: { incorrect: string; correct: string; explanation?: string }[]
}

export interface OrderingContent {
  instructions: string
  sentences: { scrambled: string; correct: string }[]
}

export interface SentenceCorrectionContent {
  sentences: {
    incorrect: string
    correct: string
    errorType: string
    explanation: string
  }[]
}

export interface GrammarFocusContent {
  topic: string
  explanation: string
  table?: { headers: string[]; rows: string[][] }
  examples: { label: string; sentence: string }[]
  practice: {
    questions: { stem: string; options: string[]; answer: number }[]
  }
}

export interface DialogueContent {
  setting: string
  characters: { name: string; role?: string }[]
  dialogue: { character: string; text: string }[]
  comprehension?: {
    type: 'true-false' | 'short-answer'
    questions: { question: string; answer: string | boolean }[]
  }
}

export interface ReadingArticleContent {
  title?: string
  text: string
  source?: string
  glossary?: { term: string; definition: string }[]
}

export interface ReadingScanContent {
  instructions: string
  questions: { question: string; answer: string }[]
}

export interface VocabularyInTextContent {
  instructions: string
  items: { definition: string; answer: string; paragraph?: number; partOfSpeech?: string }[]
}

export interface SkimMainIdeaContent {
  options: string[]
  answer: number
  explanation?: string
}

export interface MatchingQAContent {
  pairs: { question: string; answer: string }[]
  distractors?: string[]
}

export interface ListeningTrueFalseContent {
  questions: { statement: string; answer: boolean; note?: string }[]
}

export interface ListeningMCQContent {
  questions: { question: string; options: string[]; answer: number }[]
}

export interface RoleplayContent {
  situation: string
  roles: { name: string; description: string; keyPoints?: string[] }[]
  phrasesToUse?: string[]
  instructions?: string
}

export interface TalkingPointContent {
  studentA: { title: string; questions: string[] }
  studentB: { title: string; questions: string[] }
  instructions?: string
}

export interface DiscussionContent {
  questions: string[]
  instructions?: string
}

export interface DebateContent {
  topic: string
  sideA: { label: string; points: string[] }
  sideB: { label: string; points: string[] }
  instructions?: string
}

export interface HomeworkWritingContent {
  task: string
  prompts: string[]
  wordCount?: string
  instructions?: string
}

// ─── Discriminated Union ─────────────────────────────────────────────────────

export type ModuleContent =
  | WarmUpContent
  | VocabularyCardsContent
  | VocabularyMatchContent
  | UsefulExpressionsContent
  | UsefulLanguageContent
  | LanguageInContextContent
  | PhrasalVerbsContent
  | GapFillContent
  | FindTheMistakeContent
  | OrderingContent
  | SentenceCorrectionContent
  | GrammarFocusContent
  | DialogueContent
  | ReadingArticleContent
  | ReadingScanContent
  | VocabularyInTextContent
  | SkimMainIdeaContent
  | MatchingQAContent
  | ListeningTrueFalseContent
  | ListeningMCQContent
  | RoleplayContent
  | TalkingPointContent
  | DiscussionContent
  | DebateContent
  | HomeworkWritingContent

// ─── Core Lesson Structure ───────────────────────────────────────────────────

export interface LessonModule {
  type: ModuleType
  title: string
  timeMinutes: number
  tutorNotes?: string
  content: ModuleContent
}

export interface ModularLessonContent {
  title: string
  lessonType: 'modular'
  objective: string
  duration: number
  difficulty: number
  skills: string[]
  modules: LessonModule[]
  teachingNotes: string
}

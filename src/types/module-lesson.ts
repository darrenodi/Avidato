// ─── Module Lesson Types ────────────────────────────────────────────────────

export type ModuleType =
  | 'warm-up'
  | 'image-discussion'
  | 'vocabulary-cards'
  | 'vocabulary-match'
  | 'useful-expressions'
  | 'useful-language'
  | 'language-in-context'
  | 'phrasal-verbs'
  | 'gap-fill'
  | 'complete-the-sentence'
  | 'find-the-mistake'
  | 'ordering'
  | 'fill-in-blanks-dialogue'
  | 'sentence-correction'
  | 'grammar-focus'
  | 'dialogue'
  | 'reading-article'
  | 'reading-scan'
  | 'vocabulary-in-text'
  | 'reading-section-prediction'
  | 'skim-main-idea'
  | 'matching-qa'
  | 'noticing'
  | 'listening-predictions'
  | 'listening-main-idea'
  | 'listening-true-false'
  | 'listening-mcq'
  | 'listening-specific-info'
  | 'listening-table'
  | 'listening-comprehension'
  | 'roleplay'
  | 'talking-point'
  | 'discussion'
  | 'further-discussion'
  | 'debate'
  | 'your-turn-ask'
  | 'your-turn-answer'
  | 'your-turn-tell'
  | 'homework-writing'

// ─── Module Content Interfaces ──────────────────────────────────────────────

export interface WarmUpContent {
  questions: string[]
  instructions?: string
}

export interface ImageDiscussionContent {
  imagePlaceholders: { label: string; description: string }[]
  questions: string[]
  imageData?: string // base64 data URL populated after Imagen generation
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

export interface VocabularyMatchContent {
  groups?: { label: string; pairs: { term: string; definition: string }[] }[]
  pairs?: { term: string; definition: string }[]  // backward compat - flat list
  instructions?: string
}

export interface UsefulExpressionsContent {
  context?: string
  expressions: string[]
  instructions?: string
}

export interface UsefulLanguageContent {
  phrases: { phrase: string; example: string }[]
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

export interface CompleteTheSentenceContent {
  instructions: string
  questions: {
    stem: string
    options: string[]
    answer: number
    explanation?: string
  }[]
}

export interface FindTheMistakeContent {
  instructions: string
  sentences: { incorrect: string; correct: string; explanation?: string }[]
}

export interface OrderingContent {
  instructions: string
  sentences: { scrambled: string; correct: string }[]
}

export interface FillInBlanksDialogueContent {
  context?: string
  characters: { name: string; role?: string }[]
  dialogue: { character: string; text: string; blankIndex?: number }[]
  answerPool: string[]
  answers: Record<string, string>
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
  items: { definition: string; answer: string; paragraph?: number }[]
}

export interface ReadingSectionPredictionContent {
  sections: { heading: string }[]
  items: { content: string; answer: number }[]
  instructions?: string
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

export interface NoticingContent {
  instruction: string
  targetPattern: string
  examples?: string[]
}

export interface ListeningPredictionsContent {
  instructions: string
  items: { statement: string; willBeMentioned: boolean }[]
}

export interface ListeningMainIdeaContent {
  options: string[]
  answer: number
}

export interface ListeningTrueFalseContent {
  questions: { statement: string; answer: boolean; note?: string }[]
}

export interface ListeningMCQContent {
  questions: { question: string; options: string[]; answer: number }[]
}

export interface ListeningSpecificInfoContent {
  question: string
  options?: string[]
  answer: string
}

export interface ListeningTableContent {
  headers: string[]
  rows: { label: string; cells: (string | null)[] }[]
  answers: Record<string, string>
}

export interface ListeningComprehensionContent {
  speakers: string[]
  questions: { statement: string; answer: string }[]
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

export interface FurtherDiscussionContent {
  questions: string[]
  instructions?: string
}

export interface DebateContent {
  topic: string
  sideA: { label: string; points: string[] }
  sideB: { label: string; points: string[] }
  instructions?: string
}

export interface YourTurnAskContent {
  questions: string[]
  note?: string
}

export interface YourTurnAnswerContent {
  questions: string[]
  note?: string
}

export interface YourTurnTellContent {
  prompts: string[]
  example?: string
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
  | ImageDiscussionContent
  | VocabularyCardsContent
  | VocabularyMatchContent
  | UsefulExpressionsContent
  | UsefulLanguageContent
  | LanguageInContextContent
  | PhrasalVerbsContent
  | GapFillContent
  | CompleteTheSentenceContent
  | FindTheMistakeContent
  | OrderingContent
  | FillInBlanksDialogueContent
  | SentenceCorrectionContent
  | GrammarFocusContent
  | DialogueContent
  | ReadingArticleContent
  | ReadingScanContent
  | VocabularyInTextContent
  | ReadingSectionPredictionContent
  | SkimMainIdeaContent
  | MatchingQAContent
  | NoticingContent
  | ListeningPredictionsContent
  | ListeningMainIdeaContent
  | ListeningTrueFalseContent
  | ListeningMCQContent
  | ListeningSpecificInfoContent
  | ListeningTableContent
  | ListeningComprehensionContent
  | RoleplayContent
  | TalkingPointContent
  | DiscussionContent
  | FurtherDiscussionContent
  | DebateContent
  | YourTurnAskContent
  | YourTurnAnswerContent
  | YourTurnTellContent
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

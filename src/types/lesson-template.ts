// Legacy/compatibility exports for GeminiService
export interface StudentProfile {
  name: string;
  targetLanguage: string;
  nativeLanguage: string;
  ageGroup: string;
  level: string;
  endGoals: string;
  occupation?: string;
  weaknesses?: string;
  interests?: string;
}

export interface LearningTopic {
  lessonNumber: number;
  title: string;
  objective: string;
  vocabulary: string[];
  grammarFocus?: string;
  skills: string[];
  context: string;
  methodology: 'CLT' | 'TBLT' | 'PPP' | 'TTT';
  // Issue #37: Previous vocabulary context for natural reuse in dialogues
  previousVocabulary?: Array<{
    word: string;
    definition: string;
    example?: string;
  }>;
  previousLessonTitle?: string;
  shouldReuseVocabularyInDialogue?: boolean;
}

export interface LearningPlan {
  selectedMethodology: 'CLT' | 'TBLT' | 'PPP' | 'TTT';
  methodologyReasoning: string;
  topics: LearningTopic[];
}

export interface LessonExercise {
  type: 'vocabulary' | 'expressions' | 'dialogue' | 'roleplay' | 'discussion' | 'grammar' | 'article' | 'fill_blanks' | 'sentence_building' | 'pronunciation' | 'listening' | 'lead-in' | 'task-prep' | 'task-performance' | 'post-task' | 'homework';
  title: string;
  description: string;
  content: string | string[] | object;
  timeMinutes: number;
}

export interface GeneratedLesson {
  title: string;
  lessonType: 'business' | 'grammar' | 'article' | 'conversation' | 'mixed';
  difficulty: number;
  duration: number;
  objective: string;
  skills: string[];
  vocabulary: string[];
  context: string;
  exercises: LessonExercise[];
  homework?: string;
  materials: string[];
  teachingNotes?: string;
}
/**
 * Comprehensive Lesson Template Types
 * Based on Engoo lesson structure with proper vocabulary and dialogue formatting
 */

export interface VocabularyItem {
  word: string
  partOfSpeech: 'Noun' | 'Verb' | 'Adjective' | 'Adverb' | 'Preposition' | 'Conjunction' | 'Interjection'
  phonetics: string // IPA pronunciation like "/ˈklæsɪfaɪd/"
  definition: string
  example: string
  synonym?: string // Contextually appropriate synonym, displayed as subscript. Leave empty if no suitable synonym exists.
  expressions?: string[] // Common collocations or phrase patterns, e.g., ["demonstrate compliance", "breach of compliance"]. For A2+.
}

export interface DialogueCharacter {
  name: string
  role?: string // e.g., "Chairman", "Manager", etc.
  avatar?: string // Character description for avatar generation
}

export interface DialogueLine {
  character: string
  text: string
}

export interface Exercise {
  number: number
  title: string
  type: 'vocabulary' | 'warmup' | 'dialogue' | 'comprehension' | 'roleplay' | 'discussion' | 'grammar'
  timeMinutes: number
  description?: string
  content: VocabularyExercise | WarmupExercise | DialogueExercise | ComprehensionExercise | RoleplayExercise | DiscussionExercise | GrammarExercise
}

export interface VocabularyExercise {
  vocabulary: VocabularyItem[]
}

export interface WarmupExercise {
  questions: string[]
  instructions?: string
}

export interface DialogueExercise {
  context: string
  characters: DialogueCharacter[]
  dialogue: DialogueLine[]
  instructions?: string
}

export interface ComprehensionExercise {
  questions: {
    question: string
    type: 'multiple-choice' | 'true-false' | 'short-answer'
    options?: string[] // for multiple choice
    answer?: string // for reference
  }[]
}

export interface RoleplayExercise {
  scenario: string
  roles: {
    name: string
    description: string
    keyPoints?: string[]
  }[]
  instructions: string
  timeMinutes: number
}

export interface DiscussionExercise {
  questions: string[]
  instructions?: string
}

export interface GrammarExercise {
  focus: string // e.g., "Present Perfect vs Past Simple"
  explanation: string
  examples: string[]
  practice: {
    question: string
    answer?: string
  }[]
}

export interface LessonTemplate {
  // Header Information
  title: string
  courseTitle: string // e.g., "Talking with Confidence"
  lessonNumber: number
  level: 'Beginner' | 'Elementary' | 'Intermediate' | 'Upper-Intermediate' | 'Advanced'
  duration: number // in minutes
  
  // Lesson Content
  objective: string
  context: string
  skills: string[] // e.g., ["Speaking", "Listening", "Vocabulary"]
  
  // Exercises in order
  exercises: Exercise[]
  
  // Additional Resources
  homework?: string
  additionalMaterials?: string[]
  teacherNotes?: string
}

// === BLOCK LEARNING PLAN TYPES (Preply TBLT structure) ===

export type LessonMethodology = 'TBLT' | 'PPP' | 'CLT';

export interface BlockLesson {
  lessonNumber: number; // global number across all blocks
  title: string;
  communicativeNeed: string; // what the student will be able to DO
  keyLanguageFeatures: string[]; // phrases, structures (not just words)
  isReview: boolean;
  methodology: LessonMethodology; // teaching methodology for this specific lesson
}

export interface TopicBlock {
  blockNumber: number;
  title: string;
  rationale: string;
  lessons: BlockLesson[];
}

export interface BlockLearningPlan {
  selectedMethodology: string;
  methodologyReasoning: string;
  blocks: TopicBlock[];
}

// === TBLT LESSON EXERCISE CONTENT TYPES ===

export interface LeadInContent {
  questions: string[];
  instructions?: string;
}

export interface KeyPhrase {
  phrase: string;
  usage: string;
  example: string;
}

export interface TaskPrepContent {
  vocabulary: VocabularyItem[];
  keyPhrases: KeyPhrase[];
  modelDialogue: {
    setting: string;
    characters: DialogueCharacter[];
    dialogue: DialogueLine[];
  };
}

export interface TaskPerformanceContent {
  scenario: string;
  roles: {
    name: string;
    description: string;
    keyPoints?: string[];
  }[];
  instructions: string;
  phrasesToUse?: string[];
}

export interface PostTaskContent {
  grammarFocus: string;
  explanation: string;
  examples: string[];
  corrections?: {
    error: string;
    correction: string;
    rule: string;
  }[];
}

export interface HomeworkContent {
  taskName: string;
  description: string;
  instructions: string;
}

// === PPP LESSON EXERCISE CONTENT TYPES ===

export interface PPPPresentationContent {
  targetStructure: string;        // e.g. "Present Perfect with 'just', 'already', 'yet'"
  explanation: string;
  examples: { sentence: string; note?: string }[];
  conceptCheckQuestions: string[]; // CCQs to check understanding
}

export interface PPPPracticeContent {
  instructions: string;
  exercises: {
    type: 'gap-fill' | 'transformation' | 'matching' | 'reorder';
    items: {
      id: number;
      prompt: string;
      answer: string;
      hint?: string;
    }[];
  }[];
}

export interface PPPProductionContent {
  scenario: string;
  task: string;          // what student must do
  targetStructure: string; // the structure they should use
  prompts?: string[];    // optional sentence starters / cues
}

// === CLT LESSON EXERCISE CONTENT TYPES ===

export interface CLTWarmerContent {
  activity: string;       // e.g. "Quick-fire questions", "Word association"
  instructions: string;
  prompts: string[];
}

export interface CLTInputContent {
  vocabulary: {
    word: string;
    partOfSpeech: string;
    phonetics: string;
    definition: string;
    example: string;
    synonym?: string;
  }[];
  contextText?: string;   // short text/dialogue showing vocab in context
}

export interface CLTActivityContent {
  activityName: string;   // e.g. "Information gap", "Describe and draw", "20 questions"
  instructions: string;
  studentRole: string;
  tutorRole: string;
  prompts?: string[];
}

export interface CLTWrapUpContent {
  reviewQuestions: string[];
  homework: string;
}

// Helper type for the complete lesson data structure
export interface LessonData {
  id: string
  title: string
  overview: string | null
  content: LessonTemplate
  createdAt: Date
  student: {
    id: string
    name: string
    targetLanguage: string
    level: string
  }
}
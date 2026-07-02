// src/lib/instantLessonGenerator.ts
// One-off lesson generation for time-sensitive needs (interview tomorrow, travel,
// a topic the student wants right now). Produces standard MODULAR lessons using
// the same structure categories and module library as planned lessons.
import { generateWithProviderFailover } from './ai/generate-with-provider-failover';
import { generateModularLessonWithGuard } from './utils/modular-lesson-generation-guard';
import { buildModularLessonPrompt, selectStructure, STRUCTURES } from './prompts/modular-lesson-prompt';
import { getSuggestedRolesAndScenarios } from './constants/occupation-roles';
import { A1LessonModule } from './cefr/A1LessonModule';
import { A2LessonModule } from './cefr/A2LessonModule';
import { B1LessonModule } from './cefr/B1LessonModule';
import { B2LessonModule } from './cefr/B2LessonModule';
import { C1LessonModule } from './cefr/C1LessonModule';
import { C2LessonModule } from './cefr/C2LessonModule';
import type { StudentProfile, BlockLesson, GeneratedLesson } from '@/types/lesson-template';

interface InstantLessonParams {
  targetLanguage: string;
  nativeLanguage: string;
  level: string;
  topic: string;
  description?: string;
  duration: 25 | 50;
  skillFocus?: string;
  studentName?: string;
  endGoals?: string;
  occupation?: string;
  interests?: string;
  weaknesses?: string;
}

function getVocabularyGuideForLevel(level: string): string {
  const l = level.toLowerCase();
  if (l.includes('a1')) return new A1LessonModule().getVocabularyGuide();
  if (l.includes('a2') || l.includes('elementary')) return new A2LessonModule().getVocabularyGuide();
  if (l.includes('b1') || l.includes('intermediate')) return new B1LessonModule().getVocabularyGuide();
  if (l.includes('b2') || l.includes('upper')) return new B2LessonModule().getVocabularyGuide();
  if (l.includes('c1') || l.includes('advanced')) return new C1LessonModule().getVocabularyGuide();
  if (l.includes('c2') || l.includes('proficiency')) return new C2LessonModule().getVocabularyGuide();
  return new B1LessonModule().getVocabularyGuide();
}

/** Map an explicit skill-focus choice straight to a structure category. */
function categoryFromSkillFocus(skillFocus?: string): keyof typeof STRUCTURES | null {
  if (!skillFocus) return null;
  const f = skillFocus.toLowerCase();
  if (f.includes('listen')) return 'listening';
  if (f.includes('present') || f.includes('pitch')) return 'presentation';
  if (f.includes('writ')) return 'writing';
  if (f.includes('grammar')) return 'grammar';
  if (f.includes('read')) return 'reading';
  if (f.includes('vocab')) return 'vocabulary';
  if (f.includes('business') || f.includes('professional') || f.includes('meeting') || f.includes('work')) return 'professional';
  if (f.includes('speak') || f.includes('conversation') || f.includes('fluency')) return 'speaking';
  return null;
}

export async function generateInstantLesson(params: InstantLessonParams): Promise<GeneratedLesson> {
  const {
    targetLanguage, nativeLanguage, level, topic, description, duration,
    skillFocus, studentName = 'Student', endGoals, occupation, interests, weaknesses,
  } = params;

  const student: StudentProfile = {
    name: studentName,
    targetLanguage,
    nativeLanguage,
    ageGroup: 'Adult',
    level,
    endGoals: endGoals || `Handle "${topic}" confidently in real ${targetLanguage} situations`,
    occupation,
    weaknesses,
    interests,
  };

  const communicativeNeed = description || `Handle ${topic} confidently in real conversation`;
  const lesson: BlockLesson = {
    lessonNumber: 1,
    title: topic,
    communicativeNeed,
    keyVocabulary: [],
    grammarFocus: 'Whatever structure arises naturally from this topic',
    mainActivity: description || `Realistic practice: ${topic}`,
    isReview: false,
    methodology: 'TBLT',
  };

  // Explicit skill focus wins; otherwise infer the category from the request text
  const forcedCategory = categoryFromSkillFocus(skillFocus);
  const structure = forcedCategory
    ? {
        category: forcedCategory,
        modules: [...STRUCTURES[forcedCategory][Math.floor(Math.random() * STRUCTURES[forcedCategory].length)]],
      }
    : selectStructure(communicativeNeed, topic);

  const { roles } = getSuggestedRolesAndScenarios(occupation);
  const vocabGuide = getVocabularyGuideForLevel(level);

  const prompt = buildModularLessonPrompt(
    student,
    lesson,
    duration,
    roles,
    vocabGuide,
    vocabGuide,
    '',
    structure
  );

  try {
    return await generateModularLessonWithGuard(prompt, async (p) => {
      const { rawText } = await generateWithProviderFailover({
        prompt: p,
        generationConfig: { temperature: 0.1, topK: 40, topP: 0.95, maxOutputTokens: 16384 },
      });
      return rawText;
    });
  } catch (error) {
    console.error('Error generating instant lesson:', error);
    throw new Error('Failed to generate lesson. Please try again.');
  }
}

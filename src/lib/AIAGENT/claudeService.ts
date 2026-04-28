// src/lib/AIAGENT/claudeService.ts
import { A1LessonModule } from '../cefr/A1LessonModule';
import { A2LessonModule } from '../cefr/A2LessonModule';
import { B1LessonModule } from '../cefr/B1LessonModule';
import { B2LessonModule } from '../cefr/B2LessonModule';
import { C1LessonModule } from '../cefr/C1LessonModule';
import { C2LessonModule } from '../cefr/C2LessonModule';
import { getSuggestedRolesAndScenarios, getOccupationExclusions } from '../constants/occupation-roles';
import { extractJSONFromText, cleanAndParseJSON } from '../utils/json-parser';
import { enforceSynonymConstraints } from '../utils/vocabulary-validator';
import { enforceDialogueStructure } from '../utils/dialogue-validator';
import { enforceModularLessonConstraints } from '../utils/modular-lesson-validator';
import { buildLessonGenerationPrompt, buildBlockPlanPrompt, buildTBLTLessonPrompt } from '../prompts/lesson-generation-prompts';
import { buildPPPLessonPrompt, buildCLTLessonPrompt } from '../prompts/ppp-clt-prompts';
import { buildModularLessonPrompt } from '../prompts/modular-lesson-prompt';
import { generateWithProviderFailover } from '../ai/generate-with-provider-failover';

import {
  StudentProfile,
  LearningTopic,
  LearningPlan,
  GeneratedLesson,
  BlockLearningPlan,
  BlockLesson,
  TopicBlock,
} from '../../types/lesson-template';

const CLAUDE_CONFIG = { temperature: 0.1, maxOutputTokens: 16384 };

// NEVER EDIT THIS MODEL WITHOUT APPROVAL FROM THE OWNER
class ClaudeService {

  private async generate(prompt: string): Promise<string> {
    const { rawText } = await generateWithProviderFailover({
      prompt,
      generationConfig: CLAUDE_CONFIG,
      provider: 'claude',
    });
    return rawText;
  }

  private selectMethodology(student: StudentProfile): { methodology: 'CLT' | 'TBLT' | 'PPP' | 'TTT'; reasoning: string } {
    const { level, endGoals, occupation, weaknesses } = student;
    const goals = endGoals.toLowerCase();
    const weak = weaknesses?.toLowerCase() || '';

    if (goals.includes('conversation') || goals.includes('speaking') || goals.includes('communication') ||
        goals.includes('travel') || goals.includes('social')) {
      return {
        methodology: 'CLT',
        reasoning: "Selected CLT (Communicative Language Teaching) because the student's goals emphasize real-world communication, speaking practice, and interactive scenarios.",
      };
    }

    if (goals.includes('work') || goals.includes('business') || goals.includes('professional') ||
        goals.includes('job') || occupation) {
      return {
        methodology: 'TBLT',
        reasoning: "Selected TBLT (Task-Based Language Teaching) because the student has professional/work-related goals. This methodology focuses on completing meaningful real-world tasks.",
      };
    }

    if (level === 'beginner' || weak.includes('grammar') || weak.includes('structure') ||
        goals.includes('exam') || goals.includes('academic')) {
      return {
        methodology: 'PPP',
        reasoning: "Selected PPP (Presentation, Practice, Production) because the student is a beginner or has grammar weaknesses.",
      };
    }

    return {
      methodology: 'CLT',
      reasoning: "Selected CLT (Communicative Language Teaching) as the default methodology, focusing on real-life communication and speaking practice.",
    };
  }

  public getLevelVocabularyGuide(level: string): string {
    const levelLower = level.toLowerCase();
    if (levelLower.includes('a1')) return new A1LessonModule().getVocabularyGuide();
    if (levelLower.includes('a2') || levelLower.includes('elementary')) return new A2LessonModule().getVocabularyGuide();
    if (levelLower.includes('b1') || levelLower.includes('intermediate')) return new B1LessonModule().getVocabularyGuide();
    if (levelLower.includes('b2') || levelLower.includes('upper')) return new B2LessonModule().getVocabularyGuide();
    if (levelLower.includes('c1') || levelLower.includes('advanced')) return new C1LessonModule().getVocabularyGuide();
    if (levelLower.includes('c2') || levelLower.includes('proficiency')) return new C2LessonModule().getVocabularyGuide();
    return new B1LessonModule().getVocabularyGuide();
  }

  private getCEFRModule(level: string) {
    const levelLower = level.toLowerCase();
    if (levelLower.includes('a1')) return new A1LessonModule();
    if (levelLower.includes('a2') || levelLower.includes('elementary')) return new A2LessonModule();
    if (levelLower.includes('b1') || levelLower.includes('intermediate')) return new B1LessonModule();
    if (levelLower.includes('b2') || levelLower.includes('upper')) return new B2LessonModule();
    if (levelLower.includes('c1') || levelLower.includes('advanced')) return new C1LessonModule();
    if (levelLower.includes('c2') || levelLower.includes('proficiency')) return new C2LessonModule();
    return new B1LessonModule();
  }

  async generateLearningPlan(student: StudentProfile, existingTopics: LearningTopic[] = []): Promise<LearningPlan> {
    const { methodology, reasoning } = this.selectMethodology(student);
    const { roles, examples } = getSuggestedRolesAndScenarios(student.occupation);
    const rolesList = roles.join(', ');
    const exampleList = examples.join('; ');
    const startLessonNumber = existingTopics.length + 1;
    const endLessonNumber = existingTopics.length + 10;
    const previousTopicsContext = existingTopics.length > 0
      ? `\n\nPREVIOUSLY GENERATED TOPICS (do NOT repeat these):\n${existingTopics.map(t => `${t.lessonNumber}. ${t.title}`).join('\n')}\n\nGenerate the NEXT 10 lessons that build upon these.`
      : '';

    const prompt = `Generate lessons ${startLessonNumber}-${endLessonNumber} for a ${student.level} ${student.targetLanguage} student.

STUDENT PROFILE:
- Name: ${student.name}
- Target Language: ${student.targetLanguage}
- Native Language: ${student.nativeLanguage}
- Age Group: ${student.ageGroup}
- Level: ${student.level}
- Goals: ${student.endGoals}
- Occupation: ${student.occupation || 'Not specified'}
- Weaknesses: ${student.weaknesses || 'Not specified'}
- Interests: ${student.interests || 'Not specified'}

SELECTED METHODOLOGY: ${methodology}
${reasoning}
${previousTopicsContext}

REQUIREMENTS:
1. Create exactly 10 learning topics numbered ${startLessonNumber} to ${endLessonNumber}
2. Each topic MUST be a concrete, real interaction (meeting/call/review/briefing) aligned with the student's occupation and goals — NOT abstract skills
  - Roles should reflect the student's world. Suggested roles: ${rolesList}
  - Scenario examples (adapt as appropriate): ${exampleList}
3. Do NOT create topics about "speaking skills" or "confidence" as abstract abilities.
4. Focus on speaking-based materials
5. Use ${methodology} methodology principles
6. Make content domain-specific to their occupation/interests when relevant
7. Progress logically from simpler to more complex topics
8. VOCABULARY: scenario-based and domain-relevant. FORBIDDEN: "exude confidence", "convey gravitas", "articulate clearly", "come across as", "hold one's own", "speak volumes", "project gravitas", "assertively"
${this.getLevelVocabularyGuide(student.level)}

CRITICAL VOCABULARY EXCLUSIONS:
${getOccupationExclusions(student.occupation || '')}

VOCABULARY GENERATION FOR FULL LEARNING PLAN:
For each of the 10 topics, generate 6 vocabulary words that are:
- Unique and distinct across all 10 lessons (NO REPETITION across lessons)
- Relevant to the topic and student's occupation
- Progressively building (early lessons simpler, later lessons more advanced)
- BALANCED MIX: 2-3 nouns + 2 verbs + 1-2 adjectives (NOT all the same part of speech)
- Avoiding generic cliches ("bottleneck", "backlog", "compliance", "leverage", "synergy", "paradigm")
- CRITICAL: NO HYPHENS or UNDERSCORES in ANY VOCABULARY WORDS. Just simple, single words.

FORMAT YOUR RESPONSE AS VALID JSON ONLY (no markdown, no explanations):
{
  "topics": [
    {
      "lessonNumber": 1,
      "title": "Topic title",
      "objective": "What the student will learn/achieve",
      "vocabulary": ["word1", "word2", "word3", "word4", "word5", "word6"],
      "grammarFocus": "Grammar point if applicable",
      "skills": ["speaking", "listening", "reading", "writing"],
      "context": "Real-world scenario or domain context",
      "methodology": "${methodology}"
    }
  ]
}

IMPORTANT:
- Return ONLY the JSON object. No additional text, markdown formatting, or explanations.
- Vocabulary must be 6 words per topic, 60 words total.
- ENSURE ALL 60 VOCABULARY WORDS ARE UNIQUE AND NOT REPEATED ACROSS ANY LESSONS.
- VOCABULARY WORDS MUST BE SIMPLE - NO UNDERSCORES.
- ALL topic titles and objectives MUST be in ${student.targetLanguage}.`;

    try {
      const text = await this.generate(prompt);
      const jsonStr = extractJSONFromText(text);
      const parsedResponse = cleanAndParseJSON<{ topics: LearningTopic[] }>(jsonStr);
      return {
        selectedMethodology: methodology,
        methodologyReasoning: reasoning,
        topics: parsedResponse.topics,
      };
    } catch (error) {
      console.error('Claude: Error generating learning plan:', error);
      throw new Error('Failed to generate learning plan. Please try again.');
    }
  }

  async generateLesson(student: StudentProfile, topic: LearningTopic, duration: 25 | 50 = 50): Promise<GeneratedLesson> {
    if (!topic.context) topic.context = topic.objective;

    const hasPreGeneratedVocabulary = topic.vocabulary && Array.isArray(topic.vocabulary) && topic.vocabulary.length > 0;

    let vocabularyGuideSection = '';
    if (hasPreGeneratedVocabulary) {
      const vocabList = topic.vocabulary.join(', ');
      vocabularyGuideSection = `

VOCABULARY FOR THIS LESSON (PRE-SELECTED FROM LEARNING PLAN):
${vocabList}

CRITICAL: You MUST use EXACTLY these 6 vocabulary words for the vocabulary exercise.
- Do NOT generate new vocabulary
- Do NOT substitute or replace any words
- These words were carefully selected to be unique across the entire learning plan
- Generate detailed definitions, examples, and synonyms for each word
- Use these words naturally in the dialogue (Exercise 3)`;
    }

    let vocabularyContextSection = '';
    if (topic.shouldReuseVocabularyInDialogue && topic.previousVocabulary && topic.previousVocabulary.length > 0) {
      const prevVocabList = topic.previousVocabulary.map(v => `- "${v.word}": ${v.definition}`).join('\n');
      vocabularyContextSection = `

VOCABULARY CONTINUITY:
The student has just completed: "${topic.previousLessonTitle}"
From that lesson, they learned these vocabulary words:
${prevVocabList}

In the dialogue exercise ONLY, naturally incorporate 2-3 of these previously learned words. Do NOT re-teach them in Exercise 1.`;
    }

    let under18Section = '';
    if (student.ageGroup === 'child' || student.ageGroup === 'teenager') {
      const vocabList = topic.vocabulary && Array.isArray(topic.vocabulary) ? topic.vocabulary.join(', ') : 'lesson vocabulary';
      under18Section = `

UNDER-18 STUDENT - GRAMMAR EXERCISE REQUIREMENT:
Include Exercise 5 "Find the Mistake" with 6-8 sentences about "${topic.title}" using vocabulary: ${vocabList}.
Include 2-3 correct sentences (to make it challenging). Vary error types: verb tenses, subject-verb agreement, word order.
Format: { "type": "grammar", "title": "Exercise 5: Find the Mistake", "content": { "sentences": [{ "incorrect": "...", "correct": "..." }] }, "timeMinutes": 5 }`;
    }

    const { roles } = getSuggestedRolesAndScenarios(student.occupation);
    const prompt = buildLessonGenerationPrompt(
      student,
      topic,
      duration,
      vocabularyGuideSection + vocabularyContextSection,
      under18Section,
      roles,
      this.getLevelVocabularyGuide(student.level),
      this.getCEFRModule(student.level).getVocabularyGuide()
    );

    try {
      const text = await this.generate(prompt);
      const jsonStr = extractJSONFromText(text);
      const parsedResponse = cleanAndParseJSON<GeneratedLesson>(jsonStr);

      try { enforceSynonymConstraints(parsedResponse, student.level); } catch (err) {
        console.warn('Claude: Failed to sanitize synonyms:', err);
      }
      try { enforceDialogueStructure(parsedResponse, student.name || 'Student'); } catch (err) {
        console.warn('Claude: Failed to validate dialogue structure:', err);
      }

      return parsedResponse;
    } catch (error) {
      console.error('Claude: Error generating lesson:', error);
      throw new Error('Failed to generate lesson. Please try again.');
    }
  }

  async generateBlockPlan(student: StudentProfile, existingBlocks: TopicBlock[] = []): Promise<BlockLearningPlan> {
    const { roles } = getSuggestedRolesAndScenarios(student.occupation);
    const prompt = buildBlockPlanPrompt(student, roles, existingBlocks);

    try {
      const text = await this.generate(prompt);
      const jsonStr = extractJSONFromText(text);
      return cleanAndParseJSON<BlockLearningPlan>(jsonStr);
    } catch (error) {
      console.error('Claude: Error generating block plan:', error);
      throw new Error('Failed to generate learning plan. Please try again.');
    }
  }

  async generateTBLTLesson(student: StudentProfile, lesson: BlockLesson, duration: 25 | 50 = 50): Promise<GeneratedLesson> {
    const { roles } = getSuggestedRolesAndScenarios(student.occupation);
    const prompt = buildTBLTLessonPrompt(
      student, lesson, duration, roles,
      this.getLevelVocabularyGuide(student.level),
      this.getCEFRModule(student.level).getVocabularyGuide(),
      ''
    );

    try {
      const text = await this.generate(prompt);
      const jsonStr = extractJSONFromText(text);
      const parsedResponse = cleanAndParseJSON<GeneratedLesson>(jsonStr);

      try { enforceSynonymConstraints(parsedResponse, student.level); } catch (err) {
        console.warn('Claude: Failed to sanitize synonyms:', err);
      }

      return parsedResponse;
    } catch (error) {
      console.error('Claude: Error generating TBLT lesson:', error);
      throw new Error('Failed to generate lesson. Please try again.');
    }
  }

  async generatePPPLesson(student: StudentProfile, lesson: BlockLesson, duration: 25 | 50 = 50): Promise<GeneratedLesson> {
    const prompt = buildPPPLessonPrompt(
      student, lesson, duration,
      this.getLevelVocabularyGuide(student.level),
      this.getCEFRModule(student.level).getVocabularyGuide(),
      ''
    );

    try {
      const text = await this.generate(prompt);
      return cleanAndParseJSON<GeneratedLesson>(extractJSONFromText(text));
    } catch (error) {
      console.error('Claude: Error generating PPP lesson:', error);
      throw new Error('Failed to generate lesson. Please try again.');
    }
  }

  async generateCLTLesson(student: StudentProfile, lesson: BlockLesson, duration: 25 | 50 = 50): Promise<GeneratedLesson> {
    const prompt = buildCLTLessonPrompt(
      student, lesson, duration,
      this.getLevelVocabularyGuide(student.level),
      this.getCEFRModule(student.level).getVocabularyGuide(),
      ''
    );

    try {
      const text = await this.generate(prompt);
      return cleanAndParseJSON<GeneratedLesson>(extractJSONFromText(text));
    } catch (error) {
      console.error('Claude: Error generating CLT lesson:', error);
      throw new Error('Failed to generate lesson. Please try again.');
    }
  }

  async generateModularLesson(student: StudentProfile, lesson: BlockLesson, duration: 25 | 50 = 50, previousContext: string = ''): Promise<GeneratedLesson> {
    const { roles } = getSuggestedRolesAndScenarios(student.occupation);
    const prompt = buildModularLessonPrompt(
      student, lesson, duration, roles,
      this.getLevelVocabularyGuide(student.level),
      this.getCEFRModule(student.level).getVocabularyGuide(),
      previousContext
    );

    try {
      const text = await this.generate(prompt);
      const parsed = cleanAndParseJSON<GeneratedLesson>(extractJSONFromText(text));
      return enforceModularLessonConstraints(parsed) as GeneratedLesson;
    } catch (error) {
      console.error('Claude: Error generating modular lesson:', error);
      throw new Error('Failed to generate lesson. Please try again.');
    }
  }

  async generateRaw(prompt: string): Promise<string | null> {
    try {
      return await this.generate(prompt);
    } catch (error) {
      console.error('Claude: Error in generateRaw:', error);
      return null;
    }
  }
}

const claudeService = new ClaudeService();
export default claudeService;

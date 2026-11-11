// src/lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateWithFailover } from './geminiFailover';
import { A1LessonModule } from '../cefr/A1LessonModule';
import { A2LessonModule } from '../cefr/A2LessonModule';
import { B1LessonModule } from '../cefr/B1LessonModule';
import { B2LessonModule } from '../cefr/B2LessonModule';
import { C1LessonModule } from '../cefr/C1LessonModule';
import { C2LessonModule } from '../cefr/C2LessonModule';
import { getSuggestedRolesAndScenarios, getOccupationExclusions } from '../constants/occupation-roles';
import { extractJSONFromText, cleanAndParseJSON } from '../utils/json-parser';
import { generateModularLessonWithGuard } from '../utils/modular-lesson-generation-guard';
import { buildBlockPlanPrompt } from '../prompts/lesson-generation-prompts';
import { buildModularLessonPrompt } from '../prompts/modular-lesson-prompt';

if (!process.env.GOOGLE_API_KEY) {
  throw new Error('GOOGLE_API_KEY is not set');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

import {
  StudentProfile,
  LearningTopic,
  LearningPlan,
  GeneratedLesson,
  BlockLearningPlan,
  BlockLesson,
  TopicBlock
} from '../../types/lesson-template';
// NEVER EDIT THIS MODEL WITHOUT APPROVAL FROM THE OWNER
class GeminiService {
  public model = genAI.getGenerativeModel({
    model: 'gemini-3.8-flash',
  });

  // Methodology selection based on student profile
  private selectMethodology(student: StudentProfile): { methodology: 'CLT' | 'TBLT' | 'PPP' | 'TTT'; reasoning: string } {
    const { level, endGoals, occupation, weaknesses } = student;
    const goals = endGoals.toLowerCase();
    const weak = weaknesses?.toLowerCase() || '';
    
    // CLT for communication-focused students
    if (goals.includes('conversation') || goals.includes('speaking') || goals.includes('communication') || 
        goals.includes('travel') || goals.includes('social')) {
      return {
        methodology: 'CLT',
        reasoning: 'Selected CLT (Communicative Language Teaching) because the student\'s goals emphasize real-world communication, speaking practice, and interactive scenarios. This methodology prioritizes fluency and meaningful interaction.'
      };
    }
    
    // TBLT for practical, application-focused learners
    if (goals.includes('work') || goals.includes('business') || goals.includes('professional') || 
        goals.includes('job') || occupation) {
      return {
        methodology: 'TBLT',
        reasoning: 'Selected TBLT (Task-Based Language Teaching) because the student has professional/work-related goals. This methodology focuses on completing meaningful real-world tasks that directly apply to their professional context.'
      };
    }
    
    // PPP for beginners or grammar-focused students
    if (level === 'beginner' || weak.includes('grammar') || weak.includes('structure') || 
        goals.includes('exam') || goals.includes('academic')) {
      return {
        methodology: 'PPP',
        reasoning: 'Selected PPP (Presentation, Practice, Production) because the student is a beginner or has grammar weaknesses. This structured approach gradually builds accuracy before moving to free production.'
      };
    }
    
    // Default to CLT for most speaking-focused scenarios
    return {
      methodology: 'CLT',
      reasoning: 'Selected CLT (Communicative Language Teaching) as the default methodology, focusing on real-life communication and speaking practice, which benefits most language learners.'
    };
  }

  // Generate learning plan (10 topics) - can be called multiple times to add more lessons
  async generateLearningPlan(student: StudentProfile, existingTopics: LearningTopic[] = []): Promise<LearningPlan> {
    const { methodology, reasoning } = this.selectMethodology(student);
    const { roles, examples } = getSuggestedRolesAndScenarios(student.occupation);
    const rolesList = roles.join(', ');
    const exampleList = examples.join('; ');
    
    // Calculate lesson numbers for this batch
    const startLessonNumber = existingTopics.length + 1;
    const endLessonNumber = existingTopics.length + 10;
    
    // Build context of previously generated topics
    const previousTopicsContext = existingTopics.length > 0 
      ? `\n\nPREVIOUSLY GENERATED TOPICS (do NOT repeat these):\n${existingTopics.map(t => `${t.lessonNumber}. ${t.title}`).join('\n')}\n\nGenerate the NEXT 10 lessons that build upon these previous topics.`
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
2. Each topic should be relevant to the student's goals and context and MUST be a concrete, real interaction (meeting/call/review/briefing) aligned with the student's occupation and goals — NOT abstract skills
  - Roles should reflect the student's world. Suggested roles: ${rolesList}
  - Scenario examples (adapt as appropriate): ${exampleList}
3. Do NOT create topics about "speaking skills" or "confidence" or "presentation delivery" as abstract abilities. If the student's goal hints at delivery/confidence, convert it into a real event (e.g., QBR with client director, design review, code review, stakeholder update) and focus on the content of that interaction.
4. Focus on speaking-based materials as most students prefer this
5. Use ${methodology} methodology principles:
   ${methodology === 'CLT' ? '- Emphasize real-life communication, dialogues, role-plays, discussions' : ''}
   ${methodology === 'TBLT' ? '- Focus on meaningful tasks and practical applications' : ''}
   ${methodology === 'PPP' ? '- Structure with clear presentation, controlled practice, then production' : ''}
   ${methodology === 'TTT' ? '- Balance teacher input with guided student discovery' : ''}
6. Make content domain-specific to their occupation/interests when relevant
7. Progress logically from simpler to more complex topics
8. VOCABULARY inside each topic MUST be scenario-based and domain-relevant for the student's occupation. STRICTLY FORBIDDEN vocabulary/themes: "exude confidence", "convey gravitas", "articulate clearly", "come across as", "hold one's own", "without reservation", "speak volumes", "project gravitas", "assertively", or any meta-communication coaching terms.
${this.getLevelVocabularyGuide(student.level)}

🚫 CRITICAL VOCABULARY EXCLUSIONS:
${getOccupationExclusions(student.occupation || '')}

🎯 FOCUS ON: Natural workplace language, domain-relevant phrases, and nuanced communication that challenges language skills (not lecturing professional knowledge). Avoid meta-teaching/coaching in dialogues and topics; make it a real conversation.

🎓 VOCABULARY GENERATION FOR FULL LEARNING PLAN:
For each of the 10 topics, generate 6 vocabulary words that are:
- Unique and distinct across all 10 lessons (NO REPETITION across lessons)
- Relevant to the topic and student's occupation
- Progressively building (early lessons simpler, later lessons more advanced)
- BALANCED MIX: 2-3 nouns + 2 verbs + 1-2 adjectives (NOT all the same part of speech)
- STYLE EXAMPLE: tolerance, snap, durable, route, fatigue, validate - DIFFERENT words for each topic, different parts of speech
- Avoiding: generic clichés ("bottleneck", "backlog", "compliance", "leverage", "synergy", "paradigm")
- Focused on PRACTICAL, NICHE terminology that makes each lesson valuable and accessible
- CRITICAL: NO HYPHENS or UNDERSCORES in ANY VOCABULARY WORDS. Ever. Just simple, single words (no compound words).
- Words must be clean: "feedback" not "feedback-loop", "demo" not "demo-script", "workaround" is okay (already simple)
- STYLE EXAMPLE: tolerance, snap, durable, route, fatigue, validate - DIFFERENT words for each topic
- Avoiding: generic clichés ("bottleneck", "backlog", "compliance", "leverage", "synergy", "paradigm")
- Focused on PRACTICAL, NICHE terminology that makes each lesson valuable and accessible
- CRITICAL: NO UNDERSCORES IN ANY VOCABULARY WORDS. Ever. Just simple words.

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
- Vocabulary must be 6 words per topic, 60 words total for all 10 topics.
- ENSURE ALL 60 VOCABULARY WORDS ARE UNIQUE AND NOT REPEATED ACROSS ANY LESSONS.
- VOCABULARY WORDS MUST BE SIMPLE - NO UNDERSCORES, NO UNDERSCORES, NO UNDERSCORES.`;

    try {
      const { rawText: text } = await generateWithFailover({
        prompt,
        generationConfig: {
          temperature: 0.1,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      });
      
      // Extract and parse JSON using shared utilities (handles markdown fences, control chars, etc.)
      const jsonStr = extractJSONFromText(text);
      const parsedResponse = cleanAndParseJSON<{ topics: LearningTopic[] }>(jsonStr);
      
      return {
        selectedMethodology: methodology,
        methodologyReasoning: reasoning,
        topics: parsedResponse.topics
      };
    } catch (error) {
      console.error('Error generating learning plan:', error);
      throw new Error('Failed to generate learning plan. Please try again.');
    }
  }

  // Generate individual lesson
  // Legacy flat-plan topics now generate standard modular lessons
  async generateLesson(
    student: StudentProfile,
    topic: LearningTopic,
    duration: 25 | 50 = 50
  ): Promise<GeneratedLesson> {
    const blockLesson: BlockLesson = {
      lessonNumber: topic.lessonNumber,
      title: topic.title,
      communicativeNeed: topic.objective,
      keyVocabulary: Array.isArray(topic.vocabulary) ? topic.vocabulary : [],
      grammarFocus: topic.grammarFocus || 'Whatever structure arises naturally from this topic',
      mainActivity: topic.context || topic.title,
      isReview: false,
      methodology: topic.methodology === 'TTT' ? 'TBLT' : (topic.methodology || 'TBLT'),
    };

    let previousContext = '';
    if (topic.shouldReuseVocabularyInDialogue && topic.previousVocabulary && topic.previousVocabulary.length > 0) {
      const prevVocabList = topic.previousVocabulary.map(v => `"${v.word}" (${v.definition})`).join(', ');
      previousContext = `
VOCABULARY CONTINUITY: The student just completed "${topic.previousLessonTitle}" and learned: ${prevVocabList}.
Naturally reuse 2-3 of these words in the dialogue ONLY if they fit the topic. Do not re-teach them. If they don't fit, omit them.`;
    }

    return this.generateModularLesson(student, blockLesson, duration, previousContext);
  }

  public getLevelVocabularyGuide(level: string): string {
    const levelLower = level.toLowerCase();
    if (levelLower.includes('a1')) {
      return new A1LessonModule().getVocabularyGuide();
    }
    if (levelLower.includes('a2') || levelLower.includes('elementary')) {
      return new A2LessonModule().getVocabularyGuide();
    }
    if (levelLower.includes('b1') || levelLower.includes('intermediate')) {
      return new B1LessonModule().getVocabularyGuide();
    }
    if (levelLower.includes('b2') || levelLower.includes('upper')) {
      return new B2LessonModule().getVocabularyGuide();
    }
    if (levelLower.includes('c1') || levelLower.includes('advanced')) {
      return new C1LessonModule().getVocabularyGuide();
    }
    if (levelLower.includes('c2') || levelLower.includes('proficiency')) {
      return new C2LessonModule().getVocabularyGuide();
    }
    // Default to intermediate if level unclear
    return new B1LessonModule().getVocabularyGuide();
  }

  // Generate block-structured learning plan (Preply TBLT format)
  async generateBlockPlan(student: StudentProfile, existingBlocks: TopicBlock[] = [], skillFocus?: string[]): Promise<BlockLearningPlan> {
    const { roles } = getSuggestedRolesAndScenarios(student.occupation);

    const prompt = buildBlockPlanPrompt(student, roles, existingBlocks, skillFocus);

    try {
      const { rawText: text } = await generateWithFailover({
        prompt,
        generationConfig: {
          temperature: 0.1,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      });

      const jsonStr = extractJSONFromText(text);
      const parsedResponse = cleanAndParseJSON<BlockLearningPlan>(jsonStr);
      return parsedResponse;
    } catch (error) {
      console.error('Error generating block plan:', error);
      throw new Error('Failed to generate learning plan. Please try again.');
    }
  }

  // Generate a modular lesson from a BlockLesson
  async generateModularLesson(
    student: StudentProfile,
    lesson: BlockLesson,
    duration: 25 | 50 = 50,
    previousContext: string = ''
  ): Promise<GeneratedLesson> {
    const { roles } = getSuggestedRolesAndScenarios(student.occupation);
    const prompt = buildModularLessonPrompt(
      student,
      lesson,
      duration,
      roles,
      this.getLevelVocabularyGuide(student.level),
      this.getCEFRModule(student.level).getVocabularyGuide(),
      previousContext
    );
    try {
      return await generateModularLessonWithGuard(
        prompt,
        async (p) => {
          const { rawText } = await generateWithFailover({
            prompt: p,
            generationConfig: { temperature: 0.1, topK: 40, topP: 0.95, maxOutputTokens: 16384 },
          });
          return rawText;
        }
      );
    } catch (error) {
      console.error('Error generating modular lesson:', error);
      throw new Error('Failed to generate lesson. Please try again.');
    }
  }

  /**
   * Get the appropriate CEFR module instance for the given level
   */
  private getCEFRModule(level: string) {
    const levelLower = level.toLowerCase();
    if (levelLower.includes('a1')) return new A1LessonModule();
    if (levelLower.includes('a2') || levelLower.includes('elementary')) return new A2LessonModule();
    if (levelLower.includes('b1') || levelLower.includes('intermediate')) return new B1LessonModule();
    if (levelLower.includes('b2') || levelLower.includes('upper')) return new B2LessonModule();
    if (levelLower.includes('c1') || levelLower.includes('advanced')) return new C1LessonModule();
    if (levelLower.includes('c2') || levelLower.includes('proficiency')) return new C2LessonModule();
    return new B1LessonModule(); // Default
  }

  async generateRaw(prompt: string): Promise<string | null> {
    try {
      const { rawText } = await generateWithFailover({
        prompt,
        generationConfig: { temperature: 0.1, topK: 40, topP: 0.95, maxOutputTokens: 16384 },
      });
      return rawText;
    } catch (error) {
      console.error('Error in generateRaw:', error);
      return null;
    }
  }

}

const geminiService = new GeminiService();
export default geminiService;

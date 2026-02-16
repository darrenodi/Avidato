// src/lib/openai.ts
import OpenAI from 'openai';
import { generateWithFailover } from './openaiFailover';
import { A1LessonModule } from './cefr/A1LessonModule';
import { A2LessonModule } from './cefr/A2LessonModule';
import { B1LessonModule } from './cefr/B1LessonModule';
import { B2LessonModule } from './cefr/B2LessonModule';
import { C1LessonModule } from './cefr/C1LessonModule';
import { C2LessonModule } from './cefr/C2LessonModule';
import { getSuggestedRolesAndScenarios, getOccupationExclusions } from './constants/occupation-roles';
import { extractJSONFromText, cleanAndParseJSON } from './utils/json-parser';
import { enforceSynonymConstraints } from './utils/vocabulary-validator';
import { enforceDialogueStructure } from './utils/dialogue-validator';
import { buildLessonGenerationPrompt } from './prompts/lesson-generation-prompts';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

import {
  StudentProfile,
  LearningTopic,
  LearningPlan,
  GeneratedLesson
} from '../types/lesson-template';
// NEVER EDIT THIS MODEL WITHOUT APPROVAL FROM THE OWNER
class OpenAIService {
  public model = 'gpt-5-nano'; // OpenAI model - uses fallback chain if unavailable

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

🚨 CRITICAL: All topic titles and objectives MUST be in ${student.targetLanguage}. Do NOT use English or any other language.

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

FORMAT YOUR RESPONSE AS VALID JSON ONLY (no markdown, no explanations):
{
  "topics": [
    {
      "lessonNumber": 1,
      "title": "Topic title (max 60 characters)",
      "objective": "What the student will learn/achieve (max 120 characters)",
      "vocabulary": ["word1", "word2", "word3", "word4", "word5", "word6"]
    }
  ]
}

IMPORTANT: 
- Return ONLY the JSON object. No additional text, markdown formatting, or explanations.
- Keep titles concise (under 60 chars) and objectives concise (under 120 chars).
- Vocabulary must be 6 words per topic, 60 words total for all 10 topics.
- ENSURE ALL 60 VOCABULARY WORDS ARE UNIQUE AND NOT REPEATED ACROSS ANY LESSONS.
- VOCABULARY WORDS MUST BE SIMPLE - NO UNDERSCORES, NO UNDERSCORES, NO UNDERSCORES.`;

    try {
      const { rawText: text } = await generateWithFailover({
        prompt,
        generationConfig: {
          maxOutputTokens: 8192,
        },
      });
      
      // Extract JSON - more robust parsing for gemini-2.5-flash
      const startIdx = text.indexOf('{');
      const lastIdx = text.lastIndexOf('}');
      
      if (startIdx === -1 || lastIdx === -1 || startIdx >= lastIdx) {
        console.error('No JSON found in response:', text.substring(0, 200));
        throw new Error('No valid JSON found in AI response');
      }
      
      const jsonStr = text.substring(startIdx, lastIdx + 1);
      
      // Carefully clean the JSON
      let cleanedJson = jsonStr
        .replace(/\r\n/g, '\n') // Normalize line endings
        .replace(/\n/g, ' ') // Replace newlines with space
        .replace(/\t/g, ' ') // Replace tabs with space
        .replace(/  +/g, ' ') // Collapse multiple spaces
        .replace(/,\s*]/g, ']') // Remove trailing commas in arrays
        .replace(/,\s*}/g, '}'); // Remove trailing commas in objects
      
      // Try parsing
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(cleanedJson);
      } catch (firstError) {
        // Log the problematic JSON segment around error position
        const syntaxError = firstError as SyntaxError;
        const positionMatch = syntaxError.message.match(/position (\d+)/);
        const errorPos = positionMatch ? parseInt(positionMatch[1]) : -1;
        
        if (errorPos > 0) {
          const start = Math.max(0, errorPos - 100);
          const end = Math.min(cleanedJson.length, errorPos + 100);
          console.error(
            `JSON syntax error at position ${errorPos}:`,
            cleanedJson.substring(start, end)
          );
        }

        // Try more aggressive cleanup
        cleanedJson = cleanedJson
          .replace(/[\x00-\x1F\x7F]/g, ' ') // Replace control chars with spaces
          .replace(/\\+n/g, ' ') // Fix double-escaped newlines
          .replace(/\\+r/g, '') // Remove escaped carriage returns
          .replace(/\\+t/g, ' ') // Fix escaped tabs
          .replace(/  +/g, ' '); // Collapse multiple spaces again

        // Fix unescaped quotes within string values
        const parts = cleanedJson.split('"');
        for (let i = 1; i < parts.length; i += 2) {
          // Odd indices are content within quotes - escape any unescaped quotes
          parts[i] = parts[i].replace(/\\"/g, '\\"').replace(/"/g, '\\"');
        }
        cleanedJson = parts.join('"');

        // Fix common JSON structural issues
        cleanedJson = cleanedJson
          .replace(/}\s+{/g, '},{') // Fix missing commas between objects
          .replace(/]\s+{/g, '],[') // Fix missing commas between array and object
          .replace(/}\s+\[/g, '},[') // Fix missing commas between object and array
          .replace(/]\s+[{[\d"]/g, (match) => '],' + match.slice(1)) // Fix missing commas after arrays
          .replace(/}\s+[{[\d"]/g, (match) => '},' + match.slice(1)); // Fix missing commas after objects
        
        console.error('JSON parse error:', syntaxError.message);
        parsedResponse = JSON.parse(cleanedJson);
      }
      
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
  async generateLesson(
    student: StudentProfile, 
    topic: LearningTopic, 
    duration: 25 | 50 = 50
  ): Promise<GeneratedLesson> {
  // Ensure topic has a context - if not provided, use the objective as context (brief, to the point)
  if (!topic.context) {
    topic.context = topic.objective;
  }
  
  // VOCABULARY FROM LEARNING PLAN: Use pre-generated vocabulary from the learning plan
  // If vocabulary is provided, use it directly instead of generating new
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
  
  // Issue #37: Build vocabulary context section
  let vocabularyContextSection = '';
  if (topic.shouldReuseVocabularyInDialogue && topic.previousVocabulary && topic.previousVocabulary.length > 0) {
    const prevVocabList = topic.previousVocabulary.map(v => `- "${v.word}": ${v.definition}`).join('\n');
    vocabularyContextSection = `

ISSUE #37 - VOCABULARY CONTINUITY:
The student has just completed: "${topic.previousLessonTitle}"
From that lesson, they learned these vocabulary words:
${prevVocabList}

CRITICAL INSTRUCTION FOR DIALOGUE EXERCISE (Exercise 3):
- In the dialogue exercise ONLY, naturally incorporate 2-3 of these previously learned words
- Do NOT re-teach them or explain them in Exercise 1 (Vocabulary exercise)
- Use them only if contextually appropriate to the current lesson topic
- Example: If previous lesson was "Business Meetings" with "agenda", and this lesson is "Presentations", 
  you could naturally use "agenda" in dialogue like: "How will this fit with the meeting agenda?"
- This reinforces learning through natural context, not explicit re-teaching
- If these words don't fit naturally into the current lesson's dialogue, OMIT them entirely`;
  }

  // Special instructions for under-18 students: Add grammar exercise
  let under18Section = '';
  if (student.ageGroup === 'child' || student.ageGroup === 'teenager') {
    const vocabList = topic.vocabulary && Array.isArray(topic.vocabulary) ? topic.vocabulary.join(', ') : 'the lesson vocabulary';
    under18Section = `

UNDER-18 STUDENT - GRAMMAR EXERCISE REQUIREMENT:
This is a student under 18 years old. You MUST include Exercise 5 with the "Find the Mistake" grammar exercise.

**Exercise 5: Find the Mistake (MANDATORY FOR UNDER-18)**
This exercise focuses on correcting common grammar errors in sentences DIRECTLY RELATED TO THE LESSON TOPIC: "${topic.title}"

IMPORTANT RULES:
- Create 6-8 sentences ALL ABOUT THE LESSON TOPIC: "${topic.title}"
- Sentences should use the lesson vocabulary: ${vocabList}
- ALL sentences MUST be grammatically incorrect
- EACH sentence must contain exactly ONE mistake (never more than one)
- The mistake type MUST match student level (${student.level}):
  * A1-A2: basic present/past tense form, be/have/do, subject-verb agreement, simple articles, basic prepositions, simple word order
  * B1-B2: perfect vs simple tense choice, modal verb form, gerund/infinitive choice, relative pronouns, countable/uncountable quantifiers, phrasal verb particles
  * C1-C2: advanced tense/aspect nuance, inversion/cleft style issues, complex clause linking, advanced collocation/verb pattern, register-sensitive grammar choice
- Do NOT make the same type of mistake twice - vary mistake types
- ALL sentences must relate to the lesson context: "${topic.context}"

RESPONSE FORMAT FOR EXERCISE 5:
{
  "type": "grammar",
  "title": "Exercise 5: Find the Mistake",
  "description": "Find and correct the one mistake in each sentence.",
  "instructions": "Each sentence has exactly one mistake. Find it and correct it.",
  "content": {
    "sentences": [
      {
        "incorrect": "A sentence about ${topic.title} with exactly one grammar mistake",
        "correct": "The same sentence fully corrected",
        "errorType": "Name of the grammar area for this one mistake"
      },
      ... (6-8 total items, ALL using vocabulary from: ${vocabList})
    ]
  },
  "timeMinutes": 5
}

CRITICAL: This exercise must appear as Exercise 5 in the exercises array. ALL sentences must be thematically related to the lesson topic and use the vocabulary being taught.`;
  }

  const { roles, examples } = getSuggestedRolesAndScenarios(student.occupation);
  
  // Build the prompt using the extracted template function
  const prompt = buildLessonGenerationPrompt(
    student,
    topic,
    duration,
    vocabularyGuideSection + vocabularyContextSection,
    under18Section,
    roles,
    examples.join('; '),
    this.getLevelVocabularyGuide(student.level),
    this.getCEFRModule(student.level).getVocabularyGuide()
  );

    try {
      const { rawText: text } = await generateWithFailover({
        prompt,
        generationConfig: {
          maxOutputTokens: 8192,
        },
      });

      // Extract and parse JSON using imported utilities
      const jsonStr = extractJSONFromText(text);
      const parsedResponse = cleanAndParseJSON<GeneratedLesson>(jsonStr);

      // Sanitize and enforce synonym rules based on CEFR level before returning
      try {
        enforceSynonymConstraints(parsedResponse, student.level);
      } catch (err) {
        // If sanitization fails, log and continue returning raw parsed response
        console.warn('Failed to sanitize synonyms:', err);
      }

      // Validate and fix dialogue structure (student speaks after every speaker)
      try {
        enforceDialogueStructure(parsedResponse, student.name || 'Student');
      } catch (err) {
        // If dialogue validation fails, log and continue
        console.warn('Failed to validate dialogue structure:', err);
      }

      return parsedResponse;
    } catch (error) {
      console.error('Error generating lesson:', error);
      throw new Error('Failed to generate lesson. Please try again.');
    }
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

}

const openaiService = new OpenAIService();
export default openaiService;

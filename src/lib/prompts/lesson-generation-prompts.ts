/**
 * Lesson generation prompt templates
 * Extracted from gemini.ts to reduce file size
 */

import { StudentProfile, LearningTopic } from '../../types/lesson-template';

export function buildLessonGenerationPrompt(
  student: StudentProfile,
  topic: LearningTopic,
  duration: 25 | 50,
  vocabularyContextSection: string,
  under18Section: string,
  roles: string[],
  scenarioHints: string,
  levelGuide: string,
  cefrVocabGuide: string
): string {
  const primaryRoleA = roles[0] || 'Manager';

  return `You are an expert language instructor crafting Engoo-format lessons focused on authentic, role-based workplace interactions. Generate a comprehensive lesson following the EXACT Engoo structure.

STUDENT PROFILE:
- Name: ${student.name}
- Level: ${student.level} 
- Age Group: ${student.ageGroup}
- Native Language: ${student.nativeLanguage}
- Goals: ${student.endGoals}
- Occupation: ${student.occupation || 'General learner'}
- Weaknesses: ${student.weaknesses || 'General improvement'}
- Interests: ${student.interests || 'General topics'}

LESSON TOPIC: ${topic.title}
OBJECTIVE: ${topic.objective}
${topic.context ? `CONTEXT: ${topic.context}` : ''}
${topic.vocabulary ? `VOCABULARY WORDS: ${topic.vocabulary.join(', ')}` : ''}${vocabularyContextSection}${under18Section}

🎯 CRITICAL ENGOO-STYLE REQUIREMENT:
The lesson topic "${topic.title}" must be ENACTED in the dialogue, NOT discussed as an abstract skill.

EXAMPLES OF CORRECT INTERPRETATION:
- "Delivering a Presentation" → Dialogue is ${student.name} ACTUALLY delivering a presentation to stakeholders/investors
- "Client QBR Review" → Dialogue is ${student.name} ACTUALLY conducting the QBR with the client
- "Processing an Order" → Dialogue is ${student.name} ACTUALLY processing a customer order
- "Code Review Session" → Dialogue is ${student.name} ACTUALLY reviewing code with teammates
- "Negotiating Contract Terms" → Dialogue is ${student.name} ACTUALLY negotiating terms with counterparty
- "Triaging Production Incident" → Dialogue is ${student.name} ACTUALLY triaging the incident with team

❌ STRICTLY FORBIDDEN:
- Meta-discussions where colleagues coach ${student.name} on "how to present" or "how to articulate"
- Pre-meeting prep conversations about delivery techniques
- Post-meeting debriefs analyzing communication style
- Any vocabulary about presentation skills, confidence, gravitas, articulation, etc.

✅ VOCABULARY MUST BE:
- Domain-specific and naturally occurring in the ACTUAL scenario
- Used functionally within the event itself (presentation terms in a presentation, negotiation terms in a negotiation, technical terms in a code review)
- Level-appropriate for ${student.level}
- Composed per VOCABULARY COMPOSITION RULES below (max 3 noun phrases, include verbs/idioms/collocations)

LEVEL-APPROPRIATE VOCABULARY REQUIREMENTS:
${levelGuide}

CRITICAL SYNONYM RULES FOR ${student.level.toUpperCase()} STUDENTS:
- Synonyms MUST be appropriate for level ${student.level}
- BEGINNER (A1/A2): Synonyms should be equally simple or LEAVE BLANK if no simple synonym exists
- INTERMEDIATE (B1/B2): Synonyms should be intermediate-level
- ADVANCED (C1/C2): Synonyms can be more sophisticated

VOCABULARY COMPOSITION RULES (CRITICAL):
- Total vocabulary items: EXACTLY 6
- **NO NOUN PHRASES ALLOWED** - Only single words:
  * Must be verbs, adjectives, nouns, adverbs, idioms, or phrasal verbs
  * Must be appropriate for ${student.level} CEFR level
  * Must be CONTEXTUALLY RELEVANT to the specific lesson topic: "${topic.title}"
  * Must be UNIQUE - do NOT repeat vocabulary from other lessons
  * Must appear NATURALLY in the dialogue for this specific topic
- **ALLOWED TYPES**:
  * ✅ Single verbs (e.g., "streamline", "confirm", "negotiate")
  * ✅ Single adjectives (e.g., "efficient", "detailed", "precise")
  * ✅ Single nouns (e.g., "invoice", "quantity", "supplier")
  * ✅ Idioms (e.g., "get bogged down", "touch base")
  * ✅ Phrasal verbs (e.g., "follow up", "sort out")
- **STRICTLY FORBIDDEN**:
  * ❌ Compound noun phrases (e.g., "purchase order", "item code", "delivery schedule")
  * ❌ Multi-word technical terms (e.g., "product code", "ETA")
  * ❌ Possessive structures (e.g., "supplier's terms")
  * ❌ Adjective+noun combinations (e.g., "direct competitor", "key stakeholder")
  * ❌ Generic business words used across multiple lessons (e.g., "mitigate", "align", "leverage", "streamline" - use only if ESSENTIAL to THIS specific topic)
  * ❌ Overused corporate jargon - choose topic-specific vocabulary instead
- **UNIQUENESS REQUIREMENT**:
  * Each lesson must have completely unique vocabulary
  * Do NOT repeat words across different lessons - even common business terms
  * Choose words SPECIFIC to THIS lesson's scenario, not generic business vocabulary
  * If a word like "mitigate" appears in one lesson, use synonyms like "reduce", "minimize", "address" in other lessons
  * Vocabulary must be DIRECTLY TIED to the dialogue content and topic - no generic filler words

CRITICAL REQUIREMENTS:
1. EVERY vocabulary item MUST appear naturally in the Exercise 3 dialogue. ALL vocabulary words MUST be used 2-3 times throughout the lesson.
2. VOCABULARY MUST BE TOPIC-SPECIFIC: Choose words that are directly relevant to "${topic.title}" and would naturally appear in the dialogue context: "${topic.context}". Avoid generic business vocabulary.
3. Follow EXACT Engoo format with proper vocabulary structure
3. The dialogue MUST BE the actual event described in the lesson title. Examples:
   - "Delivering Quarterly Results" → ${student.name} delivers actual presentation with Q&A, NOT colleagues coaching ${student.name} on how to present
   - "Negotiating Contract Terms" → ${student.name} negotiates with client, NOT team discussing negotiation strategy
   - "Code Review Meeting" → ${student.name} reviews actual code with team, NOT discussing how to give feedback
   - "Processing Customer Order" → ${student.name} processes actual order with customer, NOT training scenario
   The dialogue participants are colleagues/clients/managers engaging with ${student.name} about the work content itself.
4. All exercises must connect thematically to the ACTUAL event
5. VOCABULARY MUST BE LEVEL-APPROPRIATE - avoid basic words for advanced students
6. SELECT VOCABULARY BASED ON:
   - What would naturally be said DURING this specific event (presentation, meeting, call, review, negotiation, etc.)
   - Words that are UNIQUE to this topic and dialogue - avoid generic business terms
   - Student's level (use guidelines above)
   - Student's occupation (${student.occupation || 'general'})
   - The functional language needed to execute THIS SPECIFIC task
   - Avoid common corporate jargon that could appear in any lesson (e.g., "mitigate", "leverage", "align", "synergy")
7. DOMAIN TERMS: Naturally include 2-4 domain-specific terms that would ONLY be used in this actual scenario, not generic business words

🎯 FOR ${student.level.toUpperCase()} STUDENTS SPECIFICALLY:
${cefrVocabGuide}

🎯 VOCABULARY PRIORITY FOR ${student.level.toUpperCase()} ${student.occupation || 'PROFESSIONALS'}:
- Prioritize natural workplace phrases,idioms, collocations, and domain-relevant terminology used in context
- Challenge English proficiency while keeping domain terms realistic for the role; do not define domain terms
- Include advanced idioms and phrasal verbs where natural

ENGOO LESSON STRUCTURE:

**Exercise 1: Vocabulary**
Create EXACTLY 6 vocabulary items with this EXACT format (examples for different levels):

FOR BEGINNER/ELEMENTARY (A1-A2):
{
  "word": "comfortable",
  "partOfSpeech": "Adjective",
  "phonetics": "/ˈkʌmftəbəl/",
  "definition": "feeling physically relaxed and free from pain or constraint",
  "example": "This chair is very comfortable.",
  "synonym": "cozy",
  "expressions": []
}

FOR INTERMEDIATE (B1-B2):
{
  "word": "streamline",
  "partOfSpeech": "Verb", 
  "phonetics": "/ˈstriːmlaɪn/",
  "definition": "to make a process more efficient by simplifying it",
  "example": "We need to streamline our approval process to reduce delays.",
  "synonym": "simplify",
  "expressions": ["streamline the process", "streamline operations"]
}

FOR ADVANCED (C1-C2):
{
  "word": "asymmetrical",
  "partOfSpeech": "Adjective",
  "phonetics": "/ˌeɪsɪˈmetrɪkəl/",
  "definition": "having parts that fail to correspond to one another in shape, size, or arrangement; lacking symmetry",
  "example": "The building features an asymmetrical design that challenges conventional architecture.",
  "synonym": "uneven",
  "expressions": ["asymmetrical design", "asymmetrical distribution", "asymmetrical approach"]
}

IDIOM/PHRASAL VERB EXAMPLE (any level):
{
  "word": "get bogged down",
  "partOfSpeech": "Phrasal verb",
  "phonetics": "/ɡet bɒɡd daʊn/",
  "definition": "to become so involved in details or difficulties that you cannot make progress",
  "example": "Let's not get bogged down in minor details; we need to focus on the big picture.",
  "synonym": "get stuck",
  "expressions": ["get bogged down in details", "get bogged down by bureaucracy"]
}

VOCABULARY FORMAT:
{
  "type": "vocabulary",
  "title": "Exercise 1: Vocabulary", 
  "description": "Learn and practice new vocabulary",
  "content": {
    "vocabulary": [/* EXACTLY 6 level-appropriate vocabulary items WITH synonyms */]
  },
  "timeMinutes": 8
}

SYNONYM RULES (Issue #36):
- Add a "synonym" field to EACH vocabulary item
- Synonym MUST be appropriate for the SAME level as the vocabulary word being taught
- CRITICAL: DO NOT use complex synonyms for basic level students
- ONLY include synonym if it's simpler or equally simple at that level (leave empty string "" if none exists)
- Level-specific rules:
  * A1/A2 (Beginner): Use ONLY very common, everyday words OR LEAVE BLANK
    - "sing" → "" (no simpler word, leave blank)
    - "happy" → "glad" (both simple)
    - "appointment" → "meeting" (both common)
  * B1/B2 (Intermediate): Use intermediate-level synonyms
    - "streamline" → "simplify" (both intermediate)
    - "vocalize" → "sing" (more common synonym)
  * C1/C2 (Advanced): Use advanced synonyms
    - "paradigm shift" → "major change" or "" (depends on context)
    - "ameliorate" → "improve" or "" (improve is simpler, so OK or leave blank)
- Examples of WRONG synonyms:
  * "sing" → "vocalize" (for A1 - vocalize is TOO COMPLEX)
  * "run" → "perambulate" (for A1 - way too complex)

EXPRESSIONS/COLLOCATIONS RULES (Issue #42):
- Add an "expressions" array to EACH vocabulary item (can be empty for A1)
- Expressions provide practical phrase patterns showing how the word is used in context
- Level-specific rules:
  * A1 (Beginner): Leave expressions empty [] - focus on word definitions only
  * A2+ (Elementary and above): Include 2-3 common collocations/phrases using the word
    - Examples for "compliance": ["demonstrate compliance", "ensure compliance", "compliance with"]
    - Examples for "streamline": ["streamline the process", "streamline operations"]
  * B1-C2: Include sophisticated, natural phrase patterns
    - Examples for "paradigm shift": ["paradigm shift in", "represent a paradigm shift", "drive a paradigm shift"]
- Expressions should be natural, commonly-used phrases that learners can memorize and reuse
- Each expression should be 2-4 words (not full sentences)
- Expressions help students understand how professional words are actually used in context

  **Exercise 2: Warm-up**
  2-3 discussion prompts that prepare for the ACTUAL scenario:
{
  "type": "warmup",
  "title": "Exercise 2: Warm-up",
  "description": "Discussion questions to introduce the topic",
  "content": {
    "questions": ["Question about prior experience with this type of scenario", "Question about challenges in this context", "Question about best practices in this situation"],
    "instructions": "Try responding as naturally as possible, using any vocabulary you know related to the topic."
  },
  "timeMinutes": 8
}**Exercise 3: Dialogue**
${student.name} performs the ACTUAL task/event described in the lesson title:

  ⚠️ CRITICAL DIALOGUE RULES - THE DIALOGUE MUST BE THE ACTUAL EVENT:
  - EXACTLY 8 EXCHANGES (student speaks 4 times, other character speaks 4 times)
  - ${student.name} is PERFORMING the task in the title (presenting, negotiating, processing order, reviewing code, conducting QBR, etc.)
  - Other characters are the AUDIENCE/PARTICIPANTS in this event (investors, clients, customers, teammates, manager, etc.)
  - The FIRST character speaking MUST be ${student.name}
  - ${student.name} MUST speak after EVERY other character speaks
  - ABSOLUTELY NO consecutive speeches by non-student characters (e.g., Character A then Character B without student between them)
  - This is a 1-on-1 lesson format: the teacher reads one role, the student reads ${student.name}'s role, and they alternate strictly
  - If multiple participants are present in the scenario, they should speak one at a time with ${student.name} responding to each in turn
  - The conversation is about the ACTUAL CONTENT of the event (project details, product specs, code logic, contract terms, etc.) - NOT about how to communicate
  - Vocabulary words are used FUNCTIONALLY within the event
  - NEVER have characters introduce themselves unnecessarily
  - ALWAYS write NATURAL dialogue as people actually speak
  - DIALOGUE MUST HAVE A CONCLUSIVE ENDING with a decision/agreement/resolution (no trailing off or unfinished sentences)
  - NO EM DASHES (—) in dialogue - use periods, commas, or rephrase instead of em dashes
  - KEEP DIALOGUE CONCISE - 8 exchanges total (4 from student, 4 from other character)
  
EXAMPLE PATTERNS:
  * "Delivering Presentation" → ${student.name} presents to stakeholders, they ask questions about content
  * "Client QBR" → ${student.name} reviews quarterly metrics with client, discusses next steps
  * "Processing Order" → ${student.name} takes customer order, confirms details, arranges shipping
  * "Code Review" → ${student.name} walks through code changes, teammates ask technical questions
  * "Contract Negotiation" → ${student.name} proposes terms, counterparty responds, they negotiate

- CONTEXT/SETTING: Generate a descriptive context explaining WHO is participating, WHERE, and WHAT the event is about. Choose roles aligned with the student's occupation. Suggested roles include: ${roles.join(', ')}. Scenario hints: ${scenarioHints}. The setting describes the ACTUAL event being performed.

EXAMPLE OF CORRECT DIALOGUE (${student.name} ACTUALLY performing the task):
If lesson is "Delivering a Presentation":
{
  "character": "${student.name}",
  "text": "Good afternoon everyone. Today I'm here to present our Q3 results and projections for Q4. Let me start with our revenue figures..."
},
{
  "character": "Investor",
  "text": "Before you continue, could you clarify what factors contributed to the 15% increase?"
},
{
  "character": "${student.name}",
  "text": "Absolutely. The increase was primarily driven by our expansion into the Asian market and improved customer retention rates..."
}

If lesson is "Processing an Order":
{
  "character": "${student.name}",
  "text": "Thank you for calling. How may I help you today?"
},
{
  "character": "Customer",
  "text": "Hi, I'd like to place an order for the Model X laptop."
},
{
  "character": "${student.name}",
  "text": "Excellent choice. Let me check our inventory... Yes, we have that in stock. Would you prefer standard or expedited shipping?"
}

{
  "type": "dialogue",
  "title": "Exercise 3: Dialogue",
  "description": "Practice your reading and speaking skills with a real scenario",
  "content": {
    "setting": "Detailed description of the ACTUAL event: ${student.name} is [performing the task from lesson title]. WHO is the audience/participants, WHERE is this happening, WHAT is the specific situation. Example: '${student.name} is delivering a quarterly presentation to the board of directors in the main conference room, presenting Q3 sales results and Q4 projections.'",
    "characters": [
      {"name": "${student.name}", "role": "${student.occupation || 'Professional'} performing the task", "avatar": "You are ${student.name}"},
      {"name": "${primaryRoleA}", "role": "${primaryRoleA}", "avatar": "participant"}
    ],
    "dialogue": [
      {"character": "${student.name}", "text": "${student.name} PERFORMS the task - opens the presentation/takes the order/begins the review/etc."},
      {"character": "Participant", "text": "Response/question about the CONTENT"},
      {"character": "${student.name}", "text": "${student.name} responds about the CONTENT using vocabulary"},
      {"character": "Participant", "text": "Follow-up about CONTENT"},
      {"character": "${student.name}", "text": "${student.name} addresses it, concludes"}
    ],
    "instructions": "Read the dialogue. You are ${student.name}."
  },
  "timeMinutes": 12
}

**Exercise 4: Dialogue Comprehension**
Create 4-5 questions testing dialogue understanding. Use ONLY these two question types:
- 2-3 multiple-choice questions (MCQ)
- 1-2 open-ended questions requiring full sentence answers (e.g., "What was the main concern raised?", "Why did [character] suggest...?")

!!!ABSOLUTE REQUIREMENT FOR MCQ ANSWERS!!!
You MUST use DIFFERENT letters for each MCQ answer. FORBIDDEN patterns:
❌ Question 1: "B", Question 2: "B" (REJECTED - same letter twice)
❌ Question 1: "C", Question 2: "C" (REJECTED - same letter twice)
❌ All answers being B or C (REJECTED - no variation)

✅ REQUIRED: Each MCQ must have a DIFFERENT answer letter
✅ If you have 2 MCQs, use 2 different letters completely random selection
✅ If you have 3 MCQs, use 3 different letters

EXAMPLE OF CORRECT ANSWER DISTRIBUTION:
Question 1 (MCQ): answer is "A"
Question 2 (MCQ): answer is "D" (different from Q1)
Question 3 (open-ended): full sentence answer.

{
  "type": "comprehension",
  "title": "Exercise 4: Dialogue Comprehension",
  "description": "Answer questions about the dialogue",
  "content": {
    "questions": [
      {
        "question": "What main challenge did the team identify?",
        "type": "multiple-choice",
        "options": ["A) Budget constraints", "B) Timeline issues", "C) Resource allocation", "D) Technical limitations"],
        "answer": "A"
      },
      {
        "question": "Which solution did Sarah propose?",
        "type": "multiple-choice",
        "options": ["A) Hire more staff", "B) Extend the deadline", "C) Outsource the work", "D) Restructure the approach"],
        "answer": "D"
      },
      {
        "question": "Why did the team agree with this proposal?",
        "type": "open-ended",
        "answer": "The team agreed because it addressed both the timeline and budget concerns while maintaining quality standards."
      }
    ]
  },
  "timeMinutes": 8
}

**Exercise 5: Role Play (if appropriate)**
Create a 2-PERSON role-play scenario where the student PERFORMS the same task as in the dialogue.
CRITICAL: The roleplay is strictly between TWO people:
1. ${student.name} (the student)
2. ONE counterpart role (assumed by the teacher)

DO NOT create scenarios with 3 or more participants. The teacher will read the counterpart's lines, and the student reads their own lines in alternating fashion.

{
  "type": "roleplay",
  "title": "Exercise 5: Role Play",
  "description": "Perform the task in a new situation",
  "content": {
    "scenario": "The ACTUAL event happening: ${student.name} is [doing the task from lesson title]. WHO is the ONE other person they're with, WHERE is it, WHAT specifically is happening. Example: '${student.name} is delivering a product demo to a potential client in the sales conference room.'",
    "roles": [
      {"name": "${student.name}", "description": "${student.occupation || 'professional'} performing [the task from lesson title]", "keyPoints": ["TASK: [Specific task for student to perform]", "Use vocabulary naturally", "Complete the interaction professionally"]}
    ],
    "timeMinutes": 10
  },
  "timeMinutes": 10
}

**Exercise 6: Discussion**
4-5 questions for free practice:
{
  "type": "discussion",
  "title": "Exercise 6: Discussion", 
  "description": "Discuss these questions using the vocabulary",
  "content": {
    "questions": [
      "Question encouraging vocabulary use",
      "Question about personal experience",
      "Question requiring opinion with vocabulary"
    ],
    "instructions": "Discuss these questions. Try to use the new vocabulary."
  },
  "timeMinutes": 12
}

VOCABULARY INTEGRATION RULES:
- Each vocabulary word must appear in the dialogue naturally
- Use vocabulary in warm-up questions and discussion
- Include vocabulary in role-play scenarios
- Reference vocabulary in comprehension questions
- Create natural, not forced usage

PHONETICS EXAMPLES BY LEVEL:

BEGINNER (A1-A2):
- comfortable: /ˈkʌmftəbəl/
- happy: /ˈhæpi/
- temperature: /ˈtempərətʃər/

INTERMEDIATE (B1-B2):
- streamline: /ˈstriːmlaɪn/
- overwhelmed: /ˌoʊvərˈwelmd/
- accommodate: /əˈkɑːmədeɪt/

ADVANCED (C1-C2):
- asymmetrical: /ˌeɪsɪˈmetrɪkəl/
- serendipitous: /ˌserənˈdɪpɪtəs/
- ubiquitous: /juːˈbɪkwɪtəs/
- quintessential: /ˌkwɪntɪˈsenʃəl/
- entrepreneurial: /ˌɑːntrəprəˈnɜːriəl/

OUTPUT FORMAT (JSON):
{
  "title": "${topic.title}",
  "lessonType": "${(student.ageGroup === 'child' || student.ageGroup === 'teenager') ? 'Under-18' : 'interactive'}",
  "difficulty": ${student.level === 'beginner' ? '3-4' : student.level === 'intermediate' ? '5-6' : '7-8'},
  "duration": ${duration},
  "skills": ["Speaking", "Listening", "Reading", "Vocabulary"],
  "context": "${topic.context}",
  "exercises": [array of exercises following exact format above],
  "homework": "Review vocabulary and practice dialogue with a friend",
  "materials": ["Vocabulary cards", "Audio recording of dialogue"],
  "teachingNotes": "Ensure all vocabulary appears multiple times. Focus on natural pronunciation."
}

FINAL REMINDER: For ${student.level.toUpperCase()} students, vocabulary MUST be challenging and sophisticated. Avoid elementary words. Focus on expressions that extend their current capabilities.

Generate a complete Engoo-style lesson with proper vocabulary integration. Return ONLY the JSON.`;
}

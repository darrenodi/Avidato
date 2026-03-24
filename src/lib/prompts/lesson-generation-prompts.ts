/**
 * Lesson generation prompt templates (streamlined - 55% smaller)
 * Removed redundancy: vocabulary rules repeated 3x, dialogue rules repeated 2x
 * Removed excessive examples: kept format, removed A1/B1/C1 samples
 * 
 * UPDATES:
 * 1. Context → Objectives with skill learning (max 120 chars)
 * 2. Warmup: Single instruction "Discuss the questions"
 * 3. Dialogue setting: Max 150 characters
 * 4. Roleplay scenario: Max 150 characters
 * 5. Roleplay instructions: Action-based with tutor role guidance
 */

import { StudentProfile, LearningTopic, BlockLesson, TopicBlock } from '../../types/lesson-template';

export function buildLessonGenerationPrompt(
  student: StudentProfile,
  topic: LearningTopic,
  duration: 25 | 50,
  vocabularyContextSection: string,
  under18Section: string,
  roles: string[],
  levelGuide: string,
  cefrVocabGuide: string
): string {
  return `You are an expert language instructor creating authentic Engoo-format lessons. Generate a complete lesson following the EXACT structure below.

STUDENT PROFILE:
- Name: ${student.name}
- Level: ${student.level} 
- Age: ${student.ageGroup}
- Goals: ${student.endGoals}
- Occupation: ${student.occupation || 'Professional'}
- Weaknesses: ${student.weaknesses || 'General'}

TOPIC: ${topic.title}
OBJECTIVE: ${topic.objective}

**IMPORTANT: OBJECTIVE SPECIFICATION (MAX 120 CHARACTERS)**
The objective MUST be outcome-focused and specific, showing exactly what the student will be ABLE TO DO after the lesson.

FORMAT: "By the end of this lesson, you'll be able to [specific workplace task]." — One concrete sentence. WRITE THIS IN ${student.targetLanguage}.


GLOBAL FORMATTING RULES (APPLY TO ALL CONTENT):
- NEVER use em dashes (—) anywhere in any content. Use commas, periods, or semicolons instead.
- NEVER suggest or include background colors, colored badges, or colored containers in any content field.

CRITICAL RULES:
- Maximum 120 characters (count carefully!)
- Start with "By the end of this lesson, you'll be able to"
- End with a specific workplace task (e.g. "lead a project update meeting and keep it on track")
- Use action verbs 
- List 3 specific sub-skills separated by commas
- Use "including" to introduce sub-skills
- Be concrete and measurable, NOT vague
- Do NOT repeat the lesson title or use generic statements
- Keep it SHORT and punchy

${topic.vocabulary && Array.isArray(topic.vocabulary) ? `VOCABULARY: ${topic.vocabulary.join(', ')}` : ''}${vocabularyContextSection}${under18Section}

CRITICAL LESSON RULE:
The lesson "${topic.title}" must show ${student.name} PERFORMING the actual task (presenting, negotiating, processing order, reviewing code, etc.), NOT discussing how to do it.

✅ CORRECT: "Code Review Meeting" → ${student.name} reviews actual code with team, discusses technical details
❌ WRONG: "Code Review Meeting" → Team coaches ${student.name} on how to give feedback

🚨 CRITICAL LANGUAGE REQUIREMENT — THIS OVERRIDES EVERYTHING ELSE:
ALL lesson content MUST be in ${student.targetLanguage}. This means:
- ALL exercise titles (NOT "Exercise 1: Vocabulary" — translate to ${student.targetLanguage})
- ALL exercise descriptions and instructions
- ALL dialogue lines, vocabulary definitions, examples, expressions
- ALL comprehension questions and answers
- ALL role-play scenarios and key points
- ALL discussion questions
- The objective, context, homework, teachingNotes fields
- Even the sentence correction sentences must be in ${student.targetLanguage}
The ONLY English allowed is in the JSON keys ("type", "content", etc.) and the "type" values ("vocabulary", "warmup", etc.).
Every piece of text the student or teacher reads MUST be in ${student.targetLanguage}. ZERO English in any text field.

${(topic.recentTopics?.length ?? 0) > 0 || (topic.recentVocabulary?.length ?? 0) > 0 ? `
STUDENT LESSON HISTORY — ANTI-REPETITION RULES (MANDATORY):
Recent lesson topics: ${topic.recentTopics?.join(', ') || 'none'}
Recent vocabulary used (DO NOT repeat any of these): ${topic.recentVocabulary?.slice(0, 30).join(', ') || 'none'}
Recent grammar error types (DO NOT repeat — rotate new types in): ${topic.recentGrammarErrors?.slice(0, 10).join(', ') || 'none'}
Recent discussion questions (DO NOT repeat same angle or theme): ${topic.recentDiscussionQuestions?.slice(0, 5).join(' | ') || 'none'}

REPETITION RULES:
- Do NOT use any vocabulary word from the list above.
- Do NOT repeat any grammar error type from the list above. Introduce at least 2 entirely new error types.
- Do NOT repeat the same discussion angle or theme from the recent questions above.
- If the same broad topic has been covered before, approach it from a completely different angle with entirely different vocabulary.
` : ''}
VOCABULARY QUALITY RULES:
- EXACTLY 6 items, all SINGLE WORDS (verbs, adjectives, nouns, idioms, or phrasal verbs only)
- NO compound phrases (e.g., NO "purchase order", "key stakeholder", "product code")
- UNIQUE to THIS lesson — do not repeat any word from the student's recent vocabulary (listed above)
- DOMAIN-SPECIFIC to the actual task, not generic business words
- ALL 6 must appear naturally in the dialogue
- Level-appropriate synonyms (leave blank if no simple synonym exists for beginners)
- Include expressions/collocations (2-3 per word, empty for A1 students)
- CEFR FITNESS TEST: Before selecting any word, ask — would a confident learner one level below already know this? If yes, reject it and choose a more challenging word. Permanently banned at B2+: emergency, celebrate, control, unemployment, debt, give up, networking, revolutionary, insult, accountant, impact (as standalone entry)

PHRASE AND IDIOM QUALITY RULES (applies to expressions/collocations):
- LITERALNESS TEST: Can a learner understand the phrase from the individual words alone? If yes, reject it.
- Permanently banned phrases at all levels: take care of, come back, go on, keep running, get out, walk by, put on (clothing sense), look for, grow up, give up, run it again, eat in, work on
- Banned at B2+: find out, start off (begin sense)
- Physical movement is never a phrasal verb — bounce around, head into, take off (remove) are all literal, reject them

For vocabulary that's already been taught, naturally incorporate 2-3 of them in the dialogue ONLY — don't teach them again.

ENGOO STRUCTURE (6 exercises in this exact order):

**Exercise 1: Vocabulary** (8 min)
Format: { "type": "vocabulary", "title": "[the word for 'Vocabulary' in ${student.targetLanguage}]", "content": { "vocabulary": [{ "word": "word1", "partOfSpeech": "[in ${student.targetLanguage}]", "phonetics": "/fəˈnetɪks/", "definition": "[in ${student.targetLanguage}]", "example": "[in ${student.targetLanguage}]", "synonym": "[in ${student.targetLanguage} or empty]", "expressions": ["[in ${student.targetLanguage}]"] }, ...6 items total] }, "timeMinutes": 8 }

**Exercise 2: Warm-up** (8 min)
WARMUP STRUCTURE: EXACTLY 3 simple, natural questions - NO MORE, NO LESS:
- Question 1 ONLY: Personal experience — "Have you ever...?" or "When did you last...?" Opens with a story prompt.
- Question 2 ONLY: Personal familiarity — have they done it, seen it, been involved in it? Still experience-based. NEVER knowledge-testing ("What is important when X?", "What information is needed?", "What are the key factors?").
- Question 3 ONLY: Story or memory prompt — "What's the most memorable/challenging/awkward...?" Must invite a personal anecdote, NOT an analysis.

WARMUP GENERATION RULES (STRICT):
- Generate EXACTLY 3 questions in the array. Not 2, not 4, not 5. Exactly 3 questions ONLY.
- DO NOT add a 4th item to the array
- DO NOT add a 4th question with text like "Discuss the questions" - that's the instruction, NOT a question
- Natural, conversational tone - NOT textbook style
- Each question should be SHORT — MAX 15 words. Keep it punchy and conversational.
- NEVER use the student's name in the questions. Write generic "you" questions.
- All 3 questions: personal experience, familiarity, or memorable moment relating to the lesson topic
- Q2 MUST be experience/familiarity based — NEVER "What is important when X?", "What information is needed for X?", "What are the key factors in X?" — those are Discussion questions, not warm-up questions.
- Q3 MUST invite a personal story — NEVER starts with "How can...", "Why is...", "What are the effects/impact/implications of..." — those are analytical Discussion questions, not warm-up questions.
- WARM-UP question = invites a STORY or MEMORY. DISCUSSION question = invites ANALYSIS or OPINION. Never confuse the two.
- Questions directly relate to the work scenario in the dialogue
- Just simple question text - no labels, titles, or metadata
- Do NOT include duplicate text
- Never ask a question where the answer is obviously yes given the student's profession — ask what is challenging or memorable instead

TOPIC ANCHORING — CRITICAL:
  All three warm-up questions must directly relate to the lesson's specific topic.
  If the lesson is about giving presentations, ask about presentations. If it is
  about negotiating contracts, ask about contracts. Never ask generic questions
  that could apply to any lesson.

BANNED QUALIFIERS:
  Never use the phrases "big or small", "large or small", "great or small", or
  similar paired qualifiers in any question. Just ask the question directly.

BANNED AI-TELL WORDS (applies to warm-up AND discussion):
  Never use: "resonate", "navigate", "landscape", "leverage", "dynamics",
  "paradigm", "facilitate", "implications", "aspects", "in terms of",
  "when it comes to", "have you ever found yourself", "what role does X play".

Format: { "type": "warmup", "title": "[the phrase for 'Warm-up' in ${student.targetLanguage}]", "description": "[in ${student.targetLanguage}]", "content": { "questions": ["Q1 in ${student.targetLanguage}", "Q2 in ${student.targetLanguage}", "Q3 in ${student.targetLanguage}"], "instructions": "[in ${student.targetLanguage}]" }, "timeMinutes": 8 }

CRITICAL: "Discuss the questions." is the INSTRUCTION field value, NOT a 4th question in the array.

**Exercise 3: Dialogue** (12 min)
DIALOGUE RULES:
- LIMIT: 8-12 total turns (exchanges between student and participant)
- ${student.name} speaks FIRST and after most responses
- Setting: Max 150 characters — WHO, WHERE, WHAT event
- Participants: Choose from ${roles.join(', ')} based on occupation
- Content: About actual work (project details, specs, contract terms, code logic) — NOT communication techniques
- NATURAL dialogue: contractions always, natural fillers where appropriate
- NO EM DASHES (—)
- CRITICAL: Use EXACT character names — "${student.name}" and the selected role name EXACTLY as listed in the characters array

DIALOGUE REALISM RULES (MANDATORY):
- The second character MUST push back at least once — a specific objection, a challenge, or a concern the student must address. They NEVER agree with everything.
- Include at least one IMPERFECT MOMENT — a misunderstanding, an unexpected question, or mild tension.
- NEVER let one character deliver more than 3 sentences without the other reacting.
- END ON A REALISTIC OPEN NOTE — no tidy resolution. End with agreeing to follow up, a next step, or an open question.
- In restaurant/social contexts: include a third party (waiter, receptionist).
- In professional contexts: the second character has their own priorities that occasionally conflict with the student's goals.
- The second character must have a specific objection or concern that requires the student to defend a position.

DIALOGUE REALISM RULES (MANDATORY FOR EVERY DIALOGUE):
- START WITH SMALL TALK OR A NATURAL OPENER, NEVER THE MAIN TOPIC. The first 2-3 exchanges must ease into the conversation naturally before the main purpose is introduced. Use context-appropriate openers: complimenting the office, asking about the journey, commenting on the environment, referencing a previous interaction, or acknowledging how long it has been. The transition to the main topic must feel organic, not announced.
- INCLUDE AT LEAST ONE IMPERFECT MOMENT. Someone misspeaks and corrects themselves. There is a small misunderstanding that gets quickly resolved. Someone asks for clarification. A detail was forgotten. An interruption happens. These moments make the dialogue feel alive.
- THE OTHER PERSON MUST NOT ALWAYS AGREE OR COOPERATE. They must push back at least once, express mild hesitation, ask an unexpected follow-up question, or challenge something said. A client who says "that sounds promising" to everything is not realistic. A colleague who agrees immediately every time is not realistic.
- USE NATURAL SPOKEN LANGUAGE THROUGHOUT. Contractions always. Natural filler phrases where appropriate: "by the way", "speaking of which", "actually", "to be honest", "that reminds me", "funny you should say that", "now that you mention it". Avoid formal written constructions. Nobody says "I would like to enquire" or "that is indeed the case" in a real conversation.
- VARY THE LINE LENGTHS. Not every line should be two sentences. Some responses are a single word or short phrase. Some are longer. Short responses signal agreement, surprise, or hesitation. Longer responses explain, persuade, or narrate.
- MATCH THE REGISTER TO THE RELATIONSHIP. A first meeting with a senior client sounds different from a catch-up with a familiar colleague. A job interview sounds different from a team brainstorm. Vocabulary, formality, and tone must shift accordingly.
- ADD THIRD PARTIES WHERE THE CONTEXT CALLS FOR IT. In a restaurant a waiter must appear at least once. In an office a receptionist or passing colleague can create a natural interruption. In a phone call a brief hold or transfer can occur.
- END AT A NATURAL PAUSE, NOT A NEAT RESOLUTION. End on something open: agreeing to follow up, suggesting a next step, a final casual exchange as people part ways, or an unresolved question. Do not force a tidy conclusion that no real conversation would have.
- NEVER LET THE DIALOGUE BECOME AN INFORMATION DUMP. If one character explains too much in a single turn it stops feeling like a conversation and starts feeling like a presentation. Information should emerge naturally through questions, reactions, and follow-ups across multiple turns.

Format: { "type": "dialogue", "title": "[the phrase for 'Dialogue' in ${student.targetLanguage}]", "description": "[in ${student.targetLanguage}]", "content": { "setting": "[Max 150 chars in ${student.targetLanguage}]", "characters": ["${student.name}", "[Role Name]"], "dialogue": [{"character": "${student.name}", "text": "[in ${student.targetLanguage}]"}, {"character": "[Role Name]", "text": "[in ${student.targetLanguage}]"}, ...8-12 total exchanges with alternating speakers] }, "timeMinutes": 12 }

**Exercise 4: Useful Phrases** (5 min)
Purpose: 6-8 immediately usable phrases specific to THIS professional scenario. Appears between the dialogue and comprehension.

USEFUL PHRASES RULES:
- Phrases must be specific to the scenario, not generic filler
- For sales/client lessons: phrases for presenting value and handling objections
- For technical lessons: phrases for explaining data and justifying decisions
- For negotiation lessons: phrases for proposing terms and declining gracefully
- For meeting lessons: phrases for summarising, redirecting, and assigning actions
- Every phrase must be something the student can say tomorrow in their real work
- ALL phrases must appear in the dialogue above (they should already be modelled)

Format:
{
  "type": "useful-phrases",
  "title": "[the phrase for 'Useful Phrases' in ${student.targetLanguage}]",
  "content": {
    "context": "[one sentence describing when to use these phrases, in ${student.targetLanguage}]",
    "phrases": [
      { "phrase": "[phrase in ${student.targetLanguage}]", "usage": "[when/why to use it, in ${student.targetLanguage}]" }
    ]
  },
  "timeMinutes": 5
}

**Exercise 5: Dialogue Comprehension** (8 min)
COMPREHENSION FORMAT (SIMPLIFIED - OPEN-ENDED ONLY):
- 3 Structural open-ended questions ONLY
  * Format: "question", "type": "short-answer", "answer": "Full sentence answer"
  * Questions should test understanding of dialogue content, decisions made, reasoning, and key points
  * Each answer should be 1-2 sentences that directly address the question

- Total: Always 3 questions in this exact structure (open-ended only, no MCQ or True/False)

Format: { "type": "comprehension", "title": "[the phrase for 'Comprehension' in ${student.targetLanguage}]", "description": "[in ${student.targetLanguage}]", "content": { "questions": [
  {"question": "[Q1 in ${student.targetLanguage}]", "type": "short-answer", "answer": "[in ${student.targetLanguage}]"},
  {"question": "[Q2 in ${student.targetLanguage}]", "type": "short-answer", "answer": "[in ${student.targetLanguage}]"},
  {"question": "[Q3 in ${student.targetLanguage}]", "type": "short-answer", "answer": "[in ${student.targetLanguage}]"}
] }, "timeMinutes": 8 }

/*
**Exercise 5: Role Play** (10 min)
UPDATED: 
- Scenario: Max 150 characters. WHO, WHERE, WHAT student does
- Instructions: Action-based, step-by-step (do X, then Y, then Z)
- Include tutor role with clear guidance on how to respond

Format: { "type": "roleplay", "title": "Exercise 5: Role Play", "description": "Practice in new situation", "content": { "scenario": "Max 150 chars: WHO, WHERE, WHAT ${student.name} does", "roles": [{ "name": "${student.name}", "description": "${student.occupation || 'Professional'} performing the task", "keyPoints": ["Step 1: [action - what to do]", "Step 2: [action - use vocabulary]", "Step 3: [action - conclude]"] }, { "name": "Tutor", "description": "Responds to ${student.name} to guide dialogue", "keyPoints": ["Listen and react naturally", "Ask clarifying questions", "Respond based on student's vocabulary use"] }], "instructions": "Student: Perform each step. Use new vocabulary naturally. Tutor: Guide the student with realistic responses and questions." }, "timeMinutes": 10 }
*/

**Exercise 6: Sentence Correction** (10 min)

🚨 ABSOLUTE REQUIREMENT: Every single sentence MUST contain a REAL, VISIBLE grammar mistake. The "incorrect" field and "correct" field MUST be DIFFERENT strings. If they are identical, you have FAILED.

GOOD EXAMPLES (the incorrect version has a clear, visible error):
{ "incorrect": "She have been working here for five years.", "correct": "She has been working here for five years.", "errorType": "Subject-verb agreement", "explanation": "Use 'has' with third-person singular subjects." }
{ "incorrect": "I enjoy to read technical documentation.", "correct": "I enjoy reading technical documentation.", "errorType": "Gerund vs infinitive", "explanation": "'Enjoy' requires a gerund, not an infinitive." }
{ "incorrect": "The team discussed about the new proposal.", "correct": "The team discussed the new proposal.", "errorType": "Unnecessary preposition", "explanation": "'Discuss' is transitive — no preposition needed." }
{ "incorrect": "He suggested me to check the report.", "correct": "He suggested that I check the report.", "errorType": "Verb pattern", "explanation": "'Suggest' takes a that-clause, not object + infinitive." }

BAD EXAMPLES (DO NOT generate these — the sentence is already correct or the "error" is trivial/invented):
❌ { "incorrect": "The adhesive bonds the components securely.", "correct": "The adhesive bonds the components securely." } ← IDENTICAL! No real error!
❌ { "incorrect": "Great, thank you.", "correct": "Great, thank you." , "errorType": "Punctuation" } ← Not a real teaching moment!
❌ { "incorrect": "We can laminate different types of plastics to create a material which has unique properties.", "correct": "...a material that has...", "errorType": "Relative pronoun" } ← Both 'which' and 'that' are acceptable here. NOT a real error!

PICK 10 ERRORS FROM THIS LIST (match to student level ${student.level}):

FOR ALL LEVELS — these are the most common, highest-value learner errors:
1. Subject-verb agreement: "The results shows..." → "show"; "Everyone have..." → "has"
2. Tense misuse: "I live here since 2020" → "have lived"; "Yesterday I go" → "went"
3. Preposition errors: "interested for" → "in"; "depend of" → "on"; "arrive to" → "at"
4. Article errors: "She is doctor" → "a doctor"; "I need advice" (when countable needed)
5. Gerund vs infinitive: "enjoy to read" → "reading"; "suggest to go" → "suggest going"
6. Word order: "I eat always breakfast" → "always eat"; "She speaks well English" → "speaks English well"
7. Countable/uncountable: "informations" → "information"; "less people" → "fewer"; "an advice" → "some advice"
8. Collocations: "do a mistake" → "make"; "say me" → "tell me"; "make homework" → "do homework"
9. Conditionals: "If I would know" → "If I knew"; "If I studied, I will pass" → "would pass"
10. Relative pronouns: "The man which called" → "who"; "The reason why is because" → "is that"

ADDITIONAL FOR B2+ ONLY:
11. Reported speech: "He said he is coming" → "was coming"
12. Passive voice: "The report was wrote" → "written"
13. Parallel structure: "likes hiking, swimming, and to run" → "and running"
14. Verb patterns: "prevent him to leave" → "from leaving"; "discussed about" → "discussed"

GRAMMAR ROTATION RULES:
- Do NOT repeat error types from the student's recent lessons (listed in ANTI-REPETITION section above).
- Introduce at least 2 error types from this rotation list that have NOT appeared recently: passive voice formation, parallel structure, reported speech tense shift, infinitive after verbs (before→to), double comparative, redundant conjunction after "although", until vs. by for deadlines, fewer vs. less with countable nouns, verb patterns with prevent/suggest/recommend/insist.

RULES:
1. ALL 10 sentences MUST be WRONG. Zero correct sentences. The "incorrect" and "correct" fields MUST DIFFER.
2. ONE mistake per sentence. The rest of the sentence must be grammatically perfect.
3. The error must be OBVIOUS when pointed out — not a stylistic preference or debatable usage.
4. Use vocabulary from Exercise 1 and keep sentences relevant to the lesson topic.
5. Each sentence: 8-18 words. No overly complex or technical sentences that hide the error.
6. All 10 errorTypes must be DIFFERENT — never repeat the same grammar rule within this lesson.
7. Explanation states the RULE: "Use 'has' with third-person singular" — NOT "Changed 'have' to 'has'."

SELF-CHECK BEFORE OUTPUT: Read each sentence pair. If "incorrect" === "correct", DELETE IT and write a new one with a real error.

Format: { "type": "sentence-correction", "title": "[the phrase for 'Sentence Correction' in ${student.targetLanguage}]", "content": { "sentences": [
  { "incorrect": "[Sentence in ${student.targetLanguage} WITH a visible grammar mistake]", "correct": "[Same sentence FIXED in ${student.targetLanguage}]", "errorType": "[rule name in ${student.targetLanguage}]", "explanation": "[in ${student.targetLanguage}, max 12 words]" },
  ...10 total, ALL incorrect, ALL different error types
] }, "timeMinutes": 10 }

**Exercise 7: Discussion** (12 min)
DISCUSSION RULES:
- Generate exactly 5 questions total
- Questions should be SHORT — MAX 15 words each. Direct and conversational.
- NEVER use the student's name. Write generic "you" questions.
- NO instructional language (avoid "explain", "describe", "how do you approach", "tell me about")
- Assume the student has real work experience
- Questions should sound like everyday conversation
- At least 3 questions must connect directly to something specific that was said or shown in the dialogue
- Never ask a question where the answer is obviously yes given the student's profession (a logistics manager obviously submits expense reports — ask what is challenging about it instead)
- NEVER open a question with a yes/no structure — rephrase to invite a real answer
- Q5 must invite personal reflection or a real story — NOT a sociological or academic essay question
- Do NOT repeat any discussion angle from the student's recent questions listed above
- Mix of: personal experience, practical application, and related perspectives
- Questions can build on lesson topic OR broaden to related context
- Natural, engaging tone - NOT academic

TOPIC ANCHORING — CRITICAL:
  All five discussion questions must connect directly to the lesson's specific topic.
  Use the lesson content as the anchor for every question. Do not drift into
  generic life questions unrelated to the skill being practiced.

BANNED QUALIFIERS:
  Never use "big or small", "large or small", "great or small", or similar
  paired qualifiers. Just ask the question directly.

QUESTION STYLE EXAMPLES (Engoo format):
- Instead of: "Can you describe your experience with presenting to clients?"
- Use: "What's the toughest part of client presentations for you?"
- Instead of: "How would you approach..."
- Use: "What would you do if...?"
- Instead of: "Tell me about your experience with..."
- Use: "When was the last time you...?"

Format: { "type": "discussion", "title": "[the phrase for 'Discussion' in ${student.targetLanguage}]", "description": "[in ${student.targetLanguage}]", "content": { "questions": ["Q1 in ${student.targetLanguage}", "Q2 in ${student.targetLanguage}", "Q3 in ${student.targetLanguage}", "Q4 in ${student.targetLanguage}", "Q5 in ${student.targetLanguage}"], "instructions": "[single instruction in ${student.targetLanguage}]" }, "timeMinutes": 12 }

${levelGuide}

${cefrVocabGuide}

JSON OUTPUT:
{
  "title": "${topic.title}",
  "lessonType": "${(student.ageGroup === 'child' || student.ageGroup === 'teenager') ? 'Under-18' : 'interactive'}",
  "objective": "[Write the objective in ${student.targetLanguage} using the format above]",
  "difficulty": ${student.level === 'beginner' ? '3' : student.level === 'elementary' ? '4' : student.level === 'intermediate' ? '6' : '8'},
  "duration": ${duration},
  "skills": ["Speaking", "Listening", "Reading", "Vocabulary"],
  "vocabulary": [],
  "context": "${topic.context}",
  "exercises": [/* 7 exercises in order: vocabulary, warmup, dialogue, useful-phrases, comprehension, sentence-correction, discussion */],
  "homework": "[in ${student.targetLanguage}]",
  "materials": [],
  "teachingNotes": "[in ${student.targetLanguage}]"
}

RETURN ONLY VALID JSON, NO EXPLANATION.`;
}

export function buildBlockPlanPrompt(
  student: StudentProfile,
  roles: string[],
  existingBlocks: TopicBlock[] = []
): string {
  const previousBlocksContext = existingBlocks.length > 0
    ? `\n\nPREVIOUSLY GENERATED BLOCKS (do NOT repeat these topics):\n${existingBlocks.map(b => `Block ${b.blockNumber}: ${b.title}`).join('\n')}\n\nGenerate the NEXT topic blocks that build upon these.`
    : '';

  const isKid = student.ageGroup.toLowerCase().includes('child') || student.ageGroup.toLowerCase().includes('kid') || student.ageGroup.toLowerCase().includes('under 12') || student.ageGroup.toLowerCase().includes('under 18') || student.ageGroup.toLowerCase().includes('teen')
  const isWorkplace = !!(student.occupation && student.occupation.toLowerCase() !== 'student' && student.occupation.toLowerCase() !== 'n/a')
  const isGrammarFocused = student.endGoals.toLowerCase().includes('grammar') || student.endGoals.toLowerCase().includes('accuracy') || student.endGoals.toLowerCase().includes('exam')

  return `You are an expert language curriculum designer. Generate a structured learning plan tailored to this specific student's goals, age, and context.

STUDENT PROFILE:
- Name: ${student.name}
- Target Language: ${student.targetLanguage}
- Native Language: ${student.nativeLanguage}
- Level: ${student.level}
- Age Group: ${student.ageGroup}
- Goals: ${student.endGoals}
- Occupation: ${student.occupation || 'Not specified'}
- Weaknesses: ${student.weaknesses || 'Not specified'}
- Interests: ${student.interests || 'Not specified'}

AVAILABLE ROLES FOR SCENARIOS: ${roles.join(', ')}
${previousBlocksContext}

METHODOLOGY SELECTION — assign the best methodology per lesson:
- TBLT (Task-Based Language Teaching): Best for communicative tasks, workplace interactions, real-world situations. Student performs a meaningful task, then language is reviewed.
- PPP (Presentation, Practice, Production): Best for specific grammar points, accuracy work, or when a clear language rule needs to be taught. Structure: explain → drill → use freely.
- CLT (Communicative Language Teaching): Best for ${isKid ? 'young learners (kids/teens)' : 'general fluency, conversation, travel, or mixed-skills lessons'}. Fun, interactive, communicative activities.

CONTEXT:
${isKid ? '- This is a YOUNG LEARNER. Prefer CLT for most lessons. Topics should be relatable and engaging for their age. Avoid overly formal/workplace scenarios.' : isWorkplace ? '- This student uses the language professionally. Prefer TBLT for most lessons. Scenarios should reflect real workplace situations.' : '- This is a general learner. Mix TBLT and CLT. Use PPP when a specific grammar point is the lesson focus.'}
${isGrammarFocused ? '- Student has accuracy/grammar goals. Include PPP lessons for grammar-intensive topics.' : ''}

REQUIREMENTS:
1. Generate 4-5 topic blocks, each representing a major communication area relevant to the student's goals
2. Each block must have 5-8 lessons PLUS 1 review/assessment lesson at the end
3. Rank blocks by priority — the student's most urgent need comes first
4. Each lesson must specify:
   - methodology: "TBLT", "PPP", or "CLT"
   - A concrete communicative need (what the student will be ABLE TO DO — start with an action verb)
   - 4-6 key language features: functional phrases, grammar structures, or vocabulary sets depending on methodology
   - Whether it is a review lesson
5. Lesson titles must be real interactions, not abstract skills
6. Key language features for TBLT/CLT: PHRASES like "Let me take you through...", NOT single words
7. Key language features for PPP: grammar structures like "Present Perfect + 'just/already/yet'" or vocabulary sets
8. Review lessons consolidate the block's key language

GLOBAL FORMATTING RULES:
- NEVER use em dashes (—) anywhere
- Keep communicativeNeed under 120 characters, starting with an action verb
- keyLanguageFeatures: each item is a short phrase or structure with an example

FORMAT YOUR RESPONSE AS VALID JSON ONLY:
{
  "selectedMethodology": "${isKid ? 'CLT' : isWorkplace ? 'TBLT' : 'Mixed'}",
  "methodologyReasoning": "[why this mix of methodologies suits this student's goals and context]",
  "blocks": [
    {
      "blockNumber": 1,
      "title": "[Major communication area]",
      "rationale": "[1-2 sentences: why this block is a priority for this student]",
      "lessons": [
        {
          "lessonNumber": 1,
          "title": "[Lesson title]",
          "communicativeNeed": "[Action verb + what they'll do]",
          "keyLanguageFeatures": ["phrase or structure 1", "phrase or structure 2", "phrase or structure 3"],
          "methodology": "TBLT",
          "isReview": false
        },
        {
          "lessonNumber": 7,
          "title": "Review",
          "communicativeNeed": "Demonstrate key skills from this block",
          "keyLanguageFeatures": ["Review of all block phrases and structures"],
          "methodology": "TBLT",
          "isReview": true
        }
      ]
    }
  ]
}

RETURN ONLY VALID JSON, NO EXPLANATION.`;
}

export function buildTBLTLessonPrompt(
  student: StudentProfile,
  lesson: BlockLesson,
  duration: 25 | 50,
  roles: string[],
  levelGuide: string,
  cefrVocabGuide: string,
  vocabularyContextSection: string
): string {
  const is50min = duration === 50;

  return `You are an expert language instructor creating a TBLT (Task-Based Language Teaching) lesson following Preply's recommended structure.

STUDENT PROFILE:
- Name: ${student.name}
- Level: ${student.level}
- Age: ${student.ageGroup}
- Goals: ${student.endGoals}
- Occupation: ${student.occupation || 'Professional'}
- Weaknesses: ${student.weaknesses || 'General'}
- Target Language: ${student.targetLanguage}

LESSON:
- Title: ${lesson.title}
- Communicative Need: ${lesson.communicativeNeed}
- Key Language Features: ${lesson.keyLanguageFeatures.join(', ')}

AVAILABLE ROLES: ${roles.join(', ')}
${vocabularyContextSection}

GLOBAL FORMATTING RULES:
- NEVER use em dashes (—). Use commas, periods, or semicolons instead.
- ALL text content MUST be in ${student.targetLanguage}. JSON keys and type values stay in English.
- NEVER use em dashes (—) anywhere.

TBLT LESSON STRUCTURE (${duration} minutes):
${is50min ? `
Exercise 1: Lead-in (5 min)
Exercise 2: Task Prep — Vocabulary + Key Phrases + Model Dialogue (15 min)
Exercise 3: Task Performance — Roleplay (20 min)
Exercise 4: Post-task — Grammar focus from observed errors (8 min)
Exercise 5: Homework (2 min)
` : `
Exercise 1: Lead-in (5 min)
Exercise 2: Task Prep — Vocabulary + Key Phrases + Model Dialogue (10 min)
Exercise 3: Post-task — Grammar focus (8 min)
Exercise 4: Homework (2 min)
`}

---

**Exercise 1: Lead-in** (5 min)
Purpose: Activate prior knowledge and set context BEFORE pre-teaching any language.
- EXACTLY 3 questions — NOT 2, NOT 4. Count to 3 before outputting.
- Each question must be DIFFERENT. Read all 3 before outputting and remove any duplicates.
- MAX 15 words each
- Q1: Personal experience — "Have you ever...?" or "When did you last...?"
- Q2: Personal familiarity — have they done this task before, and what was it like? NEVER knowledge-testing ("What is important?", "What are the key factors?")
- Q3: Story or memory — "What's the most memorable/challenging...?" NEVER analytical. NEVER starts with "How can...", "Why is...", "What are the effects/implications of..." — those belong in Discussion.
- WARM-UP = invites a STORY or MEMORY. DISCUSSION = invites ANALYSIS or OPINION. Never confuse the two.
- Generic "you" questions — NEVER use student's name
- Directly related to the lesson's communicative task
- Conversational tone, NOT academic
- BANNED words: "resonate", "navigate", "landscape", "leverage", "dynamics", "paradigm", "facilitate"
- SELF-CHECK: Are all 3 questions unique? If not, replace the duplicate before outputting.

Format: { "type": "lead-in", "title": "[the phrase for 'Lead-in' in ${student.targetLanguage}]", "content": { "questions": ["Q1", "Q2", "Q3"], "instructions": "[in ${student.targetLanguage}]" }, "timeMinutes": 5 }

---

**Exercise 2: Task Prep** (${is50min ? 15 : 10} min)
Purpose: Pre-teach vocabulary and phrases IN CONTEXT, then show a model of the communication task.

This exercise has THREE parts:

PART A — Vocabulary (6 items, SINGLE WORDS only):
- EXACTLY 6 vocabulary items, all SINGLE WORDS
- Domain-specific, relevant to the lesson task
- Each must appear naturally in the model dialogue
- Include IPA phonetics, definition, example, optional synonym
- Do NOT include expressions/collocations — leave "expressions" as an empty array [] (the Key Phrases section covers functional language)

PART B — Key Phrases (4-6 phrases from the lesson's keyLanguageFeatures: ${lesson.keyLanguageFeatures.join('; ')}):
- Each phrase gets: the phrase itself, when/why to use it, one example in context
- These are functional phrases for the communicative task, NOT vocabulary words
- ALL phrases MUST appear in the model dialogue

PART C — Model Dialogue (8-12 turns):
- Shows the vocabulary and key phrases used naturally in a realistic workplace scenario
- ${student.name} speaks first
- Apply all DIALOGUE REALISM RULES: small talk opener, imperfect moment, pushback, natural spoken language, varied line lengths
- Setting: max 150 characters (WHO, WHERE, WHAT event)
- End at a natural pause, not a neat resolution

DIALOGUE REALISM RULES (MANDATORY):
- START WITH SMALL TALK — ease into the conversation naturally, never jump to the main topic immediately
- INCLUDE ONE IMPERFECT MOMENT — someone misspeaks, asks for clarification, or forgets a detail
- THE OTHER PERSON MUST PUSH BACK at least once
- USE CONTRACTIONS and natural filler phrases ("actually", "to be honest", "by the way")
- VARY LINE LENGTHS — mix single-word responses with longer turns
- END AT A NATURAL PAUSE, not a tidy conclusion

Format:
{
  "type": "task-prep",
  "title": "[the phrase for 'Task Preparation' in ${student.targetLanguage}]",
  "content": {
    "vocabulary": [
      { "word": "word1", "partOfSpeech": "[in ${student.targetLanguage}]", "phonetics": "/fəˈnetɪks/", "definition": "[in ${student.targetLanguage}]", "example": "[in ${student.targetLanguage}]", "synonym": "[or empty]", "expressions": [] }
    ],
    "keyPhrases": [
      { "phrase": "[phrase in ${student.targetLanguage}]", "usage": "[when to use it, in ${student.targetLanguage}]", "example": "[in context, in ${student.targetLanguage}]" }
    ],
    "modelDialogue": {
      "setting": "[max 150 chars in ${student.targetLanguage}]",
      "characters": [{ "name": "${student.name}", "role": "[role]" }, { "name": "[Other Name]", "role": "[Role]" }],
      "dialogue": [{ "character": "${student.name}", "text": "[in ${student.targetLanguage}]" }, ...]
    }
  },
  "timeMinutes": ${is50min ? 15 : 10}
}

---

${is50min ? `**Exercise 3: Task Performance** (20 min)
Purpose: Student performs the actual communicative task. Tutor monitors and provides feedback. Student repeats with improvements.
- New scenario (different from model dialogue but same communicative task)
- Student role: themselves performing the task
- Include a "phrasesToUse" list of 3-4 key phrases from Task Prep that they should try to use
- Instructions must be action-based and include: do task once → get feedback → repeat with improvements

Format:
{
  "type": "task-performance",
  "title": "[the phrase for 'Task Performance' in ${student.targetLanguage}]",
  "content": {
    "scenario": "[max 150 chars: WHO, WHERE, WHAT ${student.name} does, in ${student.targetLanguage}]",
    "roles": [
      { "name": "${student.name}", "description": "[their role, in ${student.targetLanguage}]", "keyPoints": ["[step 1]", "[step 2]", "[step 3]"] },
      { "name": "Tutor", "description": "[how to respond realistically, in ${student.targetLanguage}]", "keyPoints": ["[react naturally]", "[push back once]", "[ask follow-up]"] }
    ],
    "instructions": "[action-based steps: perform task, get feedback, repeat, in ${student.targetLanguage}]",
    "phrasesToUse": ["phrase1", "phrase2", "phrase3"]
  },
  "timeMinutes": 20
}

---

**Exercise 4: Post-task** (8 min)` : `**Exercise 3: Post-task** (8 min)`}
Purpose: Grammar focus emerging from the communicative task. Address language patterns the student likely struggled with.
- Focus on 1 grammar point relevant to the lesson's communicative need and level
- Invent 3-4 plausible errors a student at ${student.level} level might make during THIS specific task
- Explain the rule clearly
- Provide corrected examples

${levelGuide}
${cefrVocabGuide}

Format:
{
  "type": "post-task",
  "title": "[the phrase for 'Language Focus' in ${student.targetLanguage}]",
  "content": {
    "grammarFocus": "[grammar topic in ${student.targetLanguage}]",
    "explanation": "[clear rule explanation in ${student.targetLanguage}]",
    "examples": ["[correct example 1 in ${student.targetLanguage}]", "[correct example 2]"],
    "corrections": [
      { "error": "[typical student error in ${student.targetLanguage}]", "correction": "[corrected version]", "rule": "[short rule reminder in ${student.targetLanguage}]" }
    ]
  },
  "timeMinutes": 8
}

---

**Exercise ${is50min ? 5 : 4}: Homework** (2 min)
Purpose: Real-world observation or practice task to reinforce the lesson.
- Specific and actionable — tied to the lesson's communicative task
- Observation-based (e.g. notice how colleagues do X, record phrases heard at work) OR practice-based
- Should produce something to discuss in the next lesson

Format:
{
  "type": "homework",
  "title": "[the word for 'Homework' in ${student.targetLanguage}]",
  "content": {
    "taskName": "[short name in ${student.targetLanguage}]",
    "description": "[what to do and why, in ${student.targetLanguage}]",
    "instructions": "[step-by-step, in ${student.targetLanguage}]"
  },
  "timeMinutes": 2
}

---

JSON OUTPUT:
{
  "title": "${lesson.title}",
  "lessonType": "interactive",
  "objective": "[By the end of this lesson, you'll be able to ${lesson.communicativeNeed} — MAX 120 chars, in ${student.targetLanguage}]",
  "difficulty": ${student.level === 'beginner' ? '3' : student.level === 'elementary' ? '4' : student.level === 'intermediate' ? '6' : '8'},
  "duration": ${duration},
  "skills": ["Speaking", "Listening", "Vocabulary"],
  "vocabulary": [],
  "context": "${lesson.communicativeNeed}",
  "exercises": [/* ${is50min ? '5' : '4'} exercises in exact order above */],
  "homework": "",
  "materials": [],
  "teachingNotes": "[tutor notes on likely difficulties and feedback focus, in ${student.targetLanguage}]"
}

RETURN ONLY VALID JSON, NO EXPLANATION.`;
}


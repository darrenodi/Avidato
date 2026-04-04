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
  return `Expert ${student.targetLanguage} instructor. Generate a complete Engoo-format lesson as JSON.

STUDENT: ${student.name}, ${student.level}, ${student.ageGroup}, Goals: ${student.endGoals}, Occupation: ${student.occupation || 'Professional'}, Weaknesses: ${student.weaknesses || 'General'}
TOPIC: ${topic.title}

RULES:
- ALL content in ${student.targetLanguage} (JSON keys and type values stay in English)
- NO em dashes (—). BANNED words: "resonate","navigate","landscape","leverage","dynamics","paradigm"
- Objective: "By the end of this lesson, you'll be able to [specific task]." In ${student.targetLanguage}. MAX 120 chars.
- Show ${student.name} PERFORMING the task, not discussing how to do it.

${topic.vocabulary && Array.isArray(topic.vocabulary) ? `VOCABULARY: ${topic.vocabulary.join(', ')}` : ''}${vocabularyContextSection}
${(topic.recentTopics?.length ?? 0) > 0 || (topic.recentVocabulary?.length ?? 0) > 0 ? `
ANTI-REPETITION:
Recent topics: ${topic.recentTopics?.join(', ') || 'none'}
Do NOT reuse: ${topic.recentVocabulary?.slice(0, 30).join(', ') || 'none'}
Grammar errors to avoid: ${topic.recentGrammarErrors?.slice(0, 10).join(', ') || 'none'}
Discussion angles to avoid: ${topic.recentDiscussionQuestions?.slice(0, 5).join(' | ') || 'none'}
` : ''}
VOCABULARY RULES (Exercise 1):
- EXACTLY 6 single words (no compounds like "purchase order")
- Domain-specific, level-appropriate, all appear in dialogue
- No generic business words. Banned at B2+: emergency, celebrate, networking, impact
- Expressions: 2-3 non-literal collocations per word (empty for A1). Banned: "take care of", "come back", "look for", "work on", "find out"

---

**Exercise 1: Vocabulary** (8 min)
Format: { "type": "vocabulary", "title": "[Vocabulary in ${student.targetLanguage}]", "content": { "vocabulary": [{ "word": "word", "partOfSpeech": "[in ${student.targetLanguage}]", "phonetics": "/ipa/", "definition": "[in ${student.targetLanguage}]", "example": "[in ${student.targetLanguage}]", "synonym": "[or empty]", "expressions": ["[in ${student.targetLanguage}]"] }, ...6 items] }, "timeMinutes": 8 }

**Exercise 2: Warm-up** (8 min)
EXACTLY 3 questions. Q1: personal experience ("Have you ever...?"). Q2: personal familiarity — have they done/seen this? NEVER "What is important when X?" or "What are the key factors?". Q3: story/memory — "What's the most memorable/challenging...?" NEVER starts with "How can...", "Why is...", "What are the effects/implications...". WARM-UP = story or memory. DISCUSSION = analysis. MAX 15 words each. Never use student name.
Format: { "type": "warmup", "title": "[Warm-up in ${student.targetLanguage}]", "description": "[in ${student.targetLanguage}]", "content": { "questions": ["Q1","Q2","Q3"], "instructions": "[Discuss the questions in ${student.targetLanguage}]" }, "timeMinutes": 8 }

**Exercise 3: Useful Phrases** (5 min)
6-8 phrases specific to this scenario. Every phrase must be usable in real life tomorrow.
IMPORTANT: Design these phrases FIRST — the dialogue in Ex 4 will be built around them. Every phrase must appear naturally in Ex 4.
Format: { "type": "useful-phrases", "title": "[Useful Phrases in ${student.targetLanguage}]", "content": { "context": "[one sentence on when to use these, in ${student.targetLanguage}]", "phrases": [{ "phrase": "[in ${student.targetLanguage}]", "usage": "[when/why, in ${student.targetLanguage}]" }] }, "timeMinutes": 5 }

**Exercise 4: Dialogue** (12 min)
8-12 turns. ${student.name} speaks first. Characters from: ${roles.join(', ')}.
LANGUAGE REQUIREMENT: Every vocabulary word from Ex 1 AND every phrase from Ex 3 must appear. Do not insert them into the story — design a situation that REQUIRES them to come up naturally.
REALISM (mandatory): Start with small talk — never jump to the main topic. Include one imperfect moment (misunderstanding, correction, forgotten detail). Other person pushes back at least once. At least one genuine emotional reaction (surprise, disagreement, relief). Use contractions + natural fillers ("actually","to be honest","by the way"). Vary line lengths. End at a natural pause, not a tidy resolution. No info dumps.
Format: { "type": "dialogue", "title": "[Dialogue in ${student.targetLanguage}]", "description": "[in ${student.targetLanguage}]", "content": { "setting": "[MAX 150 chars in ${student.targetLanguage}]", "characters": ["${student.name}", "[Role Name]"], "dialogue": [{"character": "${student.name}", "text": "[in ${student.targetLanguage}]"}, ...8-12 turns alternating] }, "timeMinutes": 12 }

**Exercise 5: Comprehension** (8 min)
EXACTLY 3 open-ended questions about the dialogue (decisions, reasoning, key points).
Format: { "type": "comprehension", "title": "[Comprehension in ${student.targetLanguage}]", "description": "[in ${student.targetLanguage}]", "content": { "questions": [ {"question": "[Q1 in ${student.targetLanguage}]", "type": "short-answer", "answer": "[in ${student.targetLanguage}]"}, {"question": "[Q2]", "type": "short-answer", "answer": "[answer]"}, {"question": "[Q3]", "type": "short-answer", "answer": "[answer]"} ] }, "timeMinutes": 8 }

**Exercise 6: Sentence Correction** (10 min)
10 sentences. EVERY sentence MUST have a real, visible grammar error — "incorrect" and "correct" MUST differ. One error per sentence. Error types match ${student.level}:
Subject-verb agreement, tense misuse, preposition errors, article errors, gerund vs infinitive, word order, countable/uncountable, collocations, conditionals, relative pronouns.
B2+ also: reported speech, passive voice, parallel structure, verb patterns.
ALL 10 error types must be different. Explanation states the rule (not just "changed X to Y").
Format: { "type": "sentence-correction", "title": "[Sentence Correction in ${student.targetLanguage}]", "content": { "sentences": [ { "incorrect": "[sentence WITH error in ${student.targetLanguage}]", "correct": "[FIXED sentence]", "errorType": "[rule in ${student.targetLanguage}]", "explanation": "[rule max 12 words in ${student.targetLanguage}]" }, ...10 total ] }, "timeMinutes": 10 }

**Exercise 7: Discussion** (12 min)
EXACTLY 5 questions. MAX 15 words each. Connect to the dialogue. Mix: personal experience, practical, personal reflection. NOT academic. Never use student name. Q5 invites a personal story. Never open with yes/no structure. NEVER ask questions about explaining something to a non-technical person or stakeholder (e.g. "How would you explain this to someone without a technical background?").
Format: { "type": "discussion", "title": "[Discussion in ${student.targetLanguage}]", "description": "[in ${student.targetLanguage}]", "content": { "questions": ["Q1","Q2","Q3","Q4","Q5"], "instructions": "[single instruction in ${student.targetLanguage}]" }, "timeMinutes": 12 }

${under18Section}

${levelGuide}
${cefrVocabGuide}

JSON OUTPUT:
{
  "title": "${topic.title}",
  "lessonType": "${(student.ageGroup === 'child' || student.ageGroup === 'teenager') ? 'Under-18' : 'interactive'}",
  "objective": "[in ${student.targetLanguage}]",
  "difficulty": ${student.level === 'beginner' ? '3' : student.level === 'elementary' ? '4' : student.level === 'intermediate' ? '6' : '8'},
  "duration": ${duration},
  "skills": ["Speaking","Listening","Reading","Vocabulary"],
  "vocabulary": [],
  "context": "${topic.context}",
  "exercises": [/* 7 exercises: vocabulary, warmup, useful-phrases, dialogue, comprehension, sentence-correction, discussion */],
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
    ? `\nPREVIOUS BLOCKS (do NOT repeat):\n${existingBlocks.map(b => `Block ${b.blockNumber}: ${b.title}`).join('\n')}\nGenerate the NEXT blocks building on these.`
    : '';

  const isKid = ['child','kid','under 12','under 18','teen'].some(k => student.ageGroup.toLowerCase().includes(k))
  const isWorkplace = !!(student.occupation && !['student','n/a'].includes(student.occupation.toLowerCase()))
  const isGrammarFocused = ['grammar','accuracy','exam'].some(k => student.endGoals.toLowerCase().includes(k))

  return `Expert language curriculum designer. Generate a structured learning plan as JSON.

STUDENT: ${student.name}, ${student.targetLanguage} (native: ${student.nativeLanguage}), ${student.level}, ${student.ageGroup}
Goals: ${student.endGoals} | Occupation: ${student.occupation || 'Not specified'} | Weaknesses: ${student.weaknesses || 'Not specified'} | Interests: ${student.interests || 'Not specified'}
Roles available: ${roles.join(', ')}
${previousBlocksContext}

METHODOLOGY GUIDE:
- TBLT: workplace interactions, real-world tasks. Student performs a task, then language is reviewed.
- PPP: specific grammar points, accuracy work. Present → drill → free use.
- CLT: ${isKid ? 'young learners — fun, interactive, communicative' : 'fluency, conversation, travel, mixed skills'}.

Context: ${isKid ? 'Young learner — prefer CLT. Age-appropriate, engaging topics.' : isWorkplace ? 'Professional learner — prefer TBLT. Real workplace scenarios.' : 'General learner — mix TBLT and CLT.'}${isGrammarFocused ? ' Include PPP for grammar-focused topics.' : ''}

REQUIREMENTS:
- 4-5 topic blocks, each a major communication area for this student
- Each block: 5-8 lessons PLUS 1 review lesson at the end
- Each lesson: methodology (TBLT/PPP/CLT), communicativeNeed (action verb, MAX 120 chars), 4-6 keyLanguageFeatures
- TBLT/CLT features: functional phrases (e.g. "Let me take you through..."). PPP features: grammar structures.
- Lesson titles: real interactions, not abstract skills
- NO em dashes (—)

JSON OUTPUT:
{
  "selectedMethodology": "${isKid ? 'CLT' : isWorkplace ? 'TBLT' : 'Mixed'}",
  "methodologyReasoning": "[why this mix suits this student]",
  "blocks": [
    {
      "blockNumber": 1,
      "title": "[communication area]",
      "rationale": "[1-2 sentences why this is a priority]",
      "lessons": [
        { "lessonNumber": 1, "title": "[title]", "communicativeNeed": "[action verb + what they'll do]", "keyLanguageFeatures": ["phrase 1","phrase 2","phrase 3"], "methodology": "TBLT", "isReview": false },
        { "lessonNumber": 7, "title": "Review", "communicativeNeed": "Demonstrate key skills from this block", "keyLanguageFeatures": ["Review of block phrases"], "methodology": "TBLT", "isReview": true }
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

  return `Expert ${student.targetLanguage} instructor. Generate a TBLT lesson as JSON.

STUDENT: ${student.name}, ${student.level}, ${student.ageGroup}, Goals: ${student.endGoals}, Occupation: ${student.occupation || 'Professional'}
LESSON: ${lesson.title} | Need: ${lesson.communicativeNeed} | Key language: ${lesson.keyLanguageFeatures.join(', ')}
Roles: ${roles.join(', ')}
${vocabularyContextSection}

RULES:
- ALL content in ${student.targetLanguage} (JSON keys and type values stay in English)
- NO em dashes (—). BANNED: "resonate","navigate","landscape","leverage","dynamics","paradigm"

STRUCTURE (${duration} min):
${is50min ? `1. Lead-in (5 min)\n2. Task Prep — Vocab + Phrases + Dialogue (15 min)\n3. Task Performance — Roleplay (20 min)\n4. Post-task — Grammar focus (8 min)\n5. Homework (2 min)` : `1. Lead-in (5 min)\n2. Task Prep — Vocab + Phrases + Dialogue (10 min)\n3. Post-task — Grammar focus (8 min)\n4. Homework (2 min)`}

---

**Exercise 1: Lead-in** (5 min)
EXACTLY 3 questions. Q1: personal experience. Q2: personal familiarity with this task (NEVER "What is important?"). Q3: story/memory (NEVER "How can...", "Why is...", analytical). WARM-UP = story/memory. MAX 15 words each. No student name.
Format: { "type": "lead-in", "title": "[Lead-in in ${student.targetLanguage}]", "content": { "questions": ["Q1","Q2","Q3"], "instructions": "[in ${student.targetLanguage}]" }, "timeMinutes": 5 }

**Exercise 2: Task Prep** (${is50min ? 15 : 10} min)
PART A — Vocabulary: EXACTLY 6 single words, domain-specific. No expressions array.
PART B — Key Phrases: 4-6 phrases from lesson features (${lesson.keyLanguageFeatures.join('; ')}). Each: phrase + when to use + example.
Write PART A and PART B first. Then write PART C around them.
PART C — Model Dialogue: 8-12 turns, ${student.name} speaks first. Design a situation that REQUIRES every vocabulary word and every key phrase to arise naturally — do not insert them into an unrelated story. Start with small talk. Include one imperfect moment (misunderstanding, forgotten detail, correction). Other person pushes back once. At least one genuine emotional reaction (surprise, frustration, relief). Contractions + natural fillers. End at a natural pause, not a tidy resolution. No info dumps.
Format:
{
  "type": "task-prep",
  "title": "[Task Preparation in ${student.targetLanguage}]",
  "content": {
    "vocabulary": [{ "word": "word", "partOfSpeech": "[in ${student.targetLanguage}]", "phonetics": "/ipa/", "definition": "[in ${student.targetLanguage}]", "example": "[in ${student.targetLanguage}]", "synonym": "[or empty]", "expressions": [] }],
    "keyPhrases": [{ "phrase": "[in ${student.targetLanguage}]", "function": "[what this phrase communicates/signals — 5-10 words in ${student.targetLanguage}]", "usage": "[when to use, in ${student.targetLanguage}]", "example": "[in context, in ${student.targetLanguage}]" }],
    "modelDialogue": {
      "setting": "[max 150 chars in ${student.targetLanguage}]",
      "characters": [{ "name": "${student.name}", "role": "[role]" }, { "name": "[Other]", "role": "[role]" }],
      "dialogue": [{ "character": "${student.name}", "text": "[in ${student.targetLanguage}]" }],
      "comprehensionQuestions": {
        "gist": ["[big-picture Q1 in ${student.targetLanguage}]", "[big-picture Q2]", "[big-picture Q3]"],
        "detail": ["[specific Q1 in ${student.targetLanguage}]", "[specific Q2]", "[specific Q3]", "[specific Q4]"]
      },
      "noticingTask": "[one instruction: find a specific language pattern in the dialogue, e.g. 'Find all the phrases that soften a request', in ${student.targetLanguage}]"
    }
  },
  "timeMinutes": ${is50min ? 15 : 10}
}

${is50min ? `**Exercise 3: Task Performance** (20 min)
New scenario, same communicative task. Student performs → gets feedback → repeats with improvements.
Format: { "type": "task-performance", "title": "[Task Performance in ${student.targetLanguage}]", "content": { "scenario": "[max 150 chars in ${student.targetLanguage}]", "roles": [{ "name": "${student.name}", "description": "[role in ${student.targetLanguage}]", "keyPoints": ["step1","step2","step3"] }, { "name": "Tutor", "description": "[how to respond in ${student.targetLanguage}]", "keyPoints": ["react naturally","push back once","ask follow-up"] }], "instructions": "[perform, feedback, repeat in ${student.targetLanguage}]", "phrasesToUse": ["phrase1","phrase2","phrase3"] }, "timeMinutes": 20 }

**Exercise 4: Post-task** (8 min)` : `**Exercise 3: Post-task** (8 min)`}
1 grammar point from the lesson's communicative need. 3-4 plausible errors a ${student.level} student would make. Clear rule + corrected examples.
${levelGuide}
${cefrVocabGuide}
Format: { "type": "post-task", "title": "[Language Focus in ${student.targetLanguage}]", "content": { "grammarFocus": "[topic in ${student.targetLanguage}]", "explanation": "[rule in ${student.targetLanguage}]", "examples": ["[example in ${student.targetLanguage}]"], "corrections": [{ "error": "[error in ${student.targetLanguage}]", "correction": "[fixed]", "rule": "[short rule in ${student.targetLanguage}]" }] }, "timeMinutes": 8 }

**Exercise ${is50min ? 5 : 4}: Homework** (2 min)
Specific real-world task tied to the lesson. Observation or practice. Produces something to discuss next session.
Format: { "type": "homework", "title": "[Homework in ${student.targetLanguage}]", "content": { "taskName": "[short name in ${student.targetLanguage}]", "description": "[what to do and why, in ${student.targetLanguage}]", "instructions": "[step-by-step in ${student.targetLanguage}]" }, "timeMinutes": 2 }

JSON OUTPUT:
{
  "title": "${lesson.title}",
  "lessonType": "interactive",
  "objective": "[By the end of this lesson, you'll be able to ${lesson.communicativeNeed} — MAX 120 chars in ${student.targetLanguage}]",
  "difficulty": ${student.level === 'beginner' ? '3' : student.level === 'elementary' ? '4' : student.level === 'intermediate' ? '6' : '8'},
  "duration": ${duration},
  "skills": ["Speaking","Listening","Vocabulary"],
  "vocabulary": [],
  "context": "${lesson.communicativeNeed}",
  "exercises": [/* ${is50min ? '5' : '4'} exercises in order */],
  "homework": "",
  "materials": [],
  "teachingNotes": "[tutor notes in ${student.targetLanguage}]"
}

RETURN ONLY VALID JSON, NO EXPLANATION.`;
}

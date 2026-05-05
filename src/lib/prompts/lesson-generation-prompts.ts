import { StudentProfile, LearningTopic, TopicBlock } from '../../types/lesson-template';

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
- EXACTLY 6 SINGLE WORDS — no phrases, no compound nouns, no collocations. One word per entry.
- Domain-specific, level-appropriate, all appear in the dialogue in Exercise 4.
- No generic business words. Banned at B2+: emergency, celebrate, networking, impact
- No expressions array — this is a single-word vocabulary module. Synonym field only.

---

**Exercise 1: Vocabulary** (8 min)
Format: { "type": "vocabulary", "title": "[Vocabulary in ${student.targetLanguage}]", "content": { "vocabulary": [{ "word": "word", "partOfSpeech": "[in ${student.targetLanguage}]", "phonetics": "/ipa/", "definition": "[in ${student.targetLanguage}]", "example": "[in ${student.targetLanguage}]", "synonym": "[or empty]", "expressions": ["[in ${student.targetLanguage}]"] }, ...6 items] }, "timeMinutes": 8 }

**Exercise 2: Warm-up** (8 min)
EXACTLY 3 questions. WARM-UP = personal story or memory. DISCUSSION = analysis. MAX 15 words each. Never use student name.
TOPIC-SPECIFIC REQUIREMENT — CRITICAL: Every question MUST be anchored to the specific lesson topic ("${topic.title}"). Before submitting each question, apply this test: "Could this exact question appear in a lesson on a completely different topic for the same student?" If yes, it is too generic and MUST be rewritten to lock in this lesson's specific topic.
PERMANENTLY BANNED questions — these four (and any close paraphrase) are forbidden in every lesson:
- "What do you enjoy/like most about working in [field/role]?" — topic-agnostic, banned
- "Have you ever had a stressful situation at work? What happened?" — topic-agnostic, banned
- "What skills do you think matter most for doing your job well?" — topic-agnostic, banned
- "How do you handle it when things get hectic/busy at work?" — topic-agnostic, banned
Question frames to use: Q1 = personal experience tied to this topic ("Have you ever had to [specific action from this lesson]?"). Q2 = personal familiarity with the specific scenario. Q3 = story/memory — "What's the most memorable time you had to [lesson-specific task]?" NEVER "What is important when X?" or "What are the key factors?" NEVER starts with "How can...", "Why is...", "What are the effects/implications..."
BANNED question type — non-expert framing: NEVER ask the student to explain their work to a non-expert, layperson, or non-technical person in ANY form — direct or storytelling reframe.
Format: { "type": "warmup", "title": "[Warm-up in ${student.targetLanguage}]", "description": "[in ${student.targetLanguage}]", "content": { "questions": ["Q1","Q2","Q3"], "instructions": "[Discuss the questions in ${student.targetLanguage}]" }, "timeMinutes": 8 }

**Exercise 3: Useful Phrases** (5 min)
6-8 MULTI-WORD PHRASES only — minimum 2 words each. NEVER single words. These must be functional chunks a speaker uses as a unit in the exact scenario of this lesson.
NEVER include generic phrases that could appear in any professional lesson (e.g. "Can I ask you something?", "I'd like to discuss...", "Let's move forward" — all banned as too generic).
Every phrase must be specific enough to this lesson's topic that it would sound odd in a completely different scenario.
Design these phrases FIRST — the dialogue in Ex 4 will be built around them. Every phrase must appear naturally in Ex 4.
Format: { "type": "useful-phrases", "title": "[Useful Phrases in ${student.targetLanguage}]", "content": { "context": "[one sentence on when to use these, in ${student.targetLanguage}]", "phrases": [{ "phrase": "[in ${student.targetLanguage}]", "usage": "[when/why, in ${student.targetLanguage}]" }] }, "timeMinutes": 5 }

**Exercise 4: Dialogue** (12 min)
8-12 turns. ${student.name} speaks first. Characters from: ${roles.join(', ')}.
LANGUAGE REQUIREMENT: Every vocabulary word from Ex 1 AND every phrase from Ex 3 must appear. Design a situation that REQUIRES them — do not insert them into an unrelated story.
LANGUAGE QUALITY: The dialogue must sound like two real professionals — not a textbook. Characters must use colloquial expressions, idioms, and phrasal verbs naturally throughout, not just in small talk. Examples of the register: "that caught me off guard", "I'll be honest with you", "we're not quite there yet", "that's on me", "let's not get ahead of ourselves", "I dropped the ball on that", "it's a bit of a stretch", "to be fair", "between you and me", "it slipped through the cracks", "that's fair enough", "I'd push back on that". Mix idioms, phrasal verbs, hedging expressions, and colloquial fillers throughout. These arise because that is how people talk — NOT because the lesson is about idioms. Match CEFR level: simpler colloquial register for lower levels, more idiomatic for higher.
SMALL TALK (mandatory, minimum 2 turns): The dialogue MUST open with genuine off-topic chat — commute, weather, something they noticed, a minor personal detail. This must come BEFORE any mention of the main topic. "By the way, how's the project?" is NOT small talk — it is the topic. Only after at least 2 turns of real small talk does one character naturally transition to business.
REALISM (beyond small talk): One imperfect moment (misunderstanding, forgotten detail, correction). Other person pushes back at least once. One genuine emotional reaction (surprise, relief, mild frustration). Contractions throughout. Vary turn length. End at a natural pause, not a tidy resolution. No information dumps.
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
EXACTLY 5 questions. MAX 15 words each. Connect to the dialogue. Mix: personal experience, practical, personal reflection. NOT academic. Never use student name. Q5 invites a personal story. Never open with yes/no structure. BANNED — meta-language questions: NEVER ask how the student feels about language, which phrases they will use, why language matters, or how techniques "help communication" — those are language-analysis questions, not discussion. BANNED — non-expert framing: NEVER ask the student to explain their work to a non-expert, layperson, or non-technical person in ANY form. This includes direct forms AND storytelling reframes. The entire category is banned.
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
  existingBlocks: TopicBlock[] = [],
  skillFocus?: string[]
): string {
  const previousBlocksContext = existingBlocks.length > 0
    ? `\nPREVIOUS BLOCKS (do NOT repeat):\n${existingBlocks.map(b => `Block ${b.blockNumber}: ${b.title}`).join('\n')}\nGenerate the NEXT blocks building on these.`
    : '';

  const isKid = ['child','kid','under 12','under 18','teen'].some(k => student.ageGroup.toLowerCase().includes(k))
  const isWorkplace = !!(student.occupation && !['student','n/a'].includes(student.occupation.toLowerCase()))
  const isGrammarFocused = ['grammar','accuracy','exam'].some(k => student.endGoals.toLowerCase().includes(k))

  const skillFocusSection = skillFocus && skillFocus.length > 0
    ? `\nSKILL FOCUS (tutor instruction — highest priority):\nThe tutor has selected these skill areas: ${skillFocus.join(', ')}.\n- Weight the topic blocks and lesson titles toward these skills. If "Writing" is selected, at least 1 full block must be writing-focused.\n- For any writing lesson, the communicativeNeed MUST begin with an explicit writing verb: "Write", "Draft", "Compose", "Document", or "Compile". This is mandatory — do NOT use speaking/discussion verbs for writing lessons.\n- If "Grammar" is selected, include at least 1 block with PPP methodology and explicit grammar drill lessons.\n- Other skills (Speaking, Reading, Vocabulary, Listening) should each have dedicated lessons within relevant blocks if selected.\n`
    : '';

  return `Expert language curriculum designer. Generate a structured learning plan as JSON.

STUDENT: ${student.name}, ${student.targetLanguage} (native: ${student.nativeLanguage}), ${student.level}, ${student.ageGroup}
Goals: ${student.endGoals} | Occupation: ${student.occupation || 'Not specified'} | Weaknesses: ${student.weaknesses || 'Not specified'} | Interests: ${student.interests || 'Not specified'}
Roles available: ${roles.join(', ')}
${previousBlocksContext}
${skillFocusSection}
METHODOLOGY GUIDE:
- TBLT: workplace interactions, real-world tasks. Student performs a task, then language is reviewed.
- PPP: specific grammar points, accuracy work. Present → drill → free use.
- CLT: ${isKid ? 'young learners — fun, interactive, communicative' : 'fluency, conversation, travel, mixed skills'}.

Context: ${isKid ? 'Young learner — prefer CLT. Age-appropriate, engaging topics.' : isWorkplace ? 'Professional learner — prefer TBLT. Real workplace scenarios.' : 'General learner — mix TBLT and CLT.'}${isGrammarFocused ? ' Include PPP for grammar-focused topics.' : ''}

REQUIREMENTS:
- 4-5 topic blocks, each a major communication area for this student
- Each block: MINIMUM 5 lessons (never fewer) PLUS 1 review lesson at the end — aim for 6-8 lessons per block
- Each lesson fields:
  - methodology: TBLT / PPP / CLT
  - communicativeNeed: action verb + what they'll do, MAX 120 chars (Learning Objective)
  - keyVocabulary: exactly 3-5 SINGLE WORDS introduced in this lesson — no phrases, no compounds
  - grammarFocus: exactly 1 grammar point, e.g. "Present Perfect", "Conditional Type 2", "Passive Voice". For CLT/TBLT lessons choose the most relevant structure from the topic. For PPP lessons this is the drill target.
  - mainActivity: short phrase describing the core task, e.g. "Roleplay: project status update", "Gap-fill: reported speech", "Information gap: scheduling"
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
        { "lessonNumber": 1, "title": "[title]", "communicativeNeed": "[action verb + what they'll do]", "keyVocabulary": ["word1","word2","word3"], "grammarFocus": "[1 grammar point]", "mainActivity": "[core task description]", "methodology": "TBLT", "isReview": false },
        { "lessonNumber": 7, "title": "Review", "communicativeNeed": "Review and consolidate key language from this block", "keyVocabulary": [], "grammarFocus": "Mixed review", "mainActivity": "Review: mixed practice", "methodology": "TBLT", "isReview": true }
      ]
    }
  ]
}

RETURN ONLY VALID JSON, NO EXPLANATION.`;
}

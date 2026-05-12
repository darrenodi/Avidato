// Test fixtures — imaginary students and lessons for AI generation tests.
// No database needed. All students are fictional.

import type { StudentProfile, BlockLesson } from '@/types/lesson-template'
import { STRUCTURES } from '@/lib/prompts/modular-lesson-prompt'

// ─── Students ────────────────────────────────────────────────────────────────

/** B2 software engineer — main test student */
export const PAUL: StudentProfile = {
  name: 'Paul',
  targetLanguage: 'English',
  nativeLanguage: 'Spanish',
  ageGroup: 'adult',
  level: 'B2',
  endGoals: 'Communicate confidently with English-speaking colleagues in daily standups, code reviews, and project meetings. Improve fluency under pressure.',
  occupation: 'Software Engineer',
  weaknesses: 'Speaking fluency under pressure, idiomatic expressions, presenting technical ideas clearly',
  interests: 'Technology, cycling, cooking',
}

/** C1 tech lead — for writing lesson tests */
export const WOJCIECH: StudentProfile = {
  name: 'Wojciech',
  targetLanguage: 'English',
  nativeLanguage: 'Polish',
  ageGroup: 'adult',
  level: 'C1',
  endGoals: 'Write clear technical documentation and PRs, lead engineering discussions with international teams.',
  occupation: 'Tech Lead',
  weaknesses: 'Formal writing register, clarity in async communication',
  interests: 'Software architecture, running, history',
}

/** B1 marketing manager — for professional lesson tests */
export const ELENA: StudentProfile = {
  name: 'Elena',
  targetLanguage: 'English',
  nativeLanguage: 'Russian',
  ageGroup: 'adult',
  level: 'B1',
  endGoals: 'Present ideas and campaign proposals to senior stakeholders in English. Handle meetings and follow-ups confidently.',
  occupation: 'Marketing Manager',
  weaknesses: 'Conditional structures, passive voice, formal vocabulary',
  interests: 'Travel, cinema, fitness',
}

/** B2 project manager — for reading lesson tests */
export const AIKO: StudentProfile = {
  name: 'Aiko',
  targetLanguage: 'English',
  nativeLanguage: 'Japanese',
  ageGroup: 'adult',
  level: 'B2',
  endGoals: 'Read and understand technical specifications, meeting notes, and industry articles. Improve vocabulary for project management.',
  occupation: 'Project Manager',
  weaknesses: 'Reading speed, unfamiliar terminology, articles and prepositions',
  interests: 'Design, podcasts, travel',
}

// ─── BlockLesson fixtures (one per category trigger) ─────────────────────────
// communicativeNeed must trigger the correct category in selectStructure.

/** Triggers: speaking */
export const SPEAKING_LESSON: BlockLesson = {
  lessonNumber: 1,
  title: 'Giving Constructive Feedback in Code Reviews',
  communicativeNeed: 'Give and receive constructive feedback during peer code review sessions without causing offence',
  keyVocabulary: ['nitpick', 'refactor', 'concise', 'brittle', 'linting'],
  grammarFocus: 'Modal verbs for softening (could, might, would)',
  mainActivity: 'Roleplay: live code review feedback exchange',
  isReview: false,
  methodology: 'CLT',
}

/** Triggers: reading */
export const READING_LESSON: BlockLesson = {
  lessonNumber: 2,
  title: 'Reading and Interpreting a Project Post-Mortem Report',
  communicativeNeed: 'Read and extract key information from a technical post-mortem report and discuss findings',
  keyVocabulary: ['retrospective', 'mitigation', 'escalation', 'incident', 'remediation'],
  grammarFocus: 'Passive voice in technical writing',
  mainActivity: 'Read a post-mortem article, answer comprehension questions',
  isReview: false,
  methodology: 'CLT',
}

/** Triggers: vocabulary */
export const VOCABULARY_LESSON: BlockLesson = {
  lessonNumber: 3,
  title: 'Agile Project Management Vocabulary',
  communicativeNeed: 'vocabulary of agile sprint planning, burndown, and retrospective terminology used in team meetings',
  keyVocabulary: ['velocity', 'sprint', 'backlog', 'blocker', 'stakeholder'],
  grammarFocus: 'Quantifiers for project data',
  mainActivity: 'Vocabulary matching and gap-fill with sprint planning scenarios',
  isReview: false,
  methodology: 'CLT',
}

/** Triggers: grammar */
export const GRAMMAR_LESSON: BlockLesson = {
  lessonNumber: 4,
  title: 'Hypothetical Language for Technical Problem-Solving',
  communicativeNeed: 'grammar accuracy using conditional structures to discuss hypothetical solutions and technical decisions',
  keyVocabulary: ['conditional', 'fallback', 'constraint', 'alternative', 'tradeoff'],
  grammarFocus: 'Second and third conditionals for problem-solving discussions',
  mainActivity: 'Discuss system design scenarios using conditional language',
  isReview: false,
  methodology: 'PPP',
}

/** Triggers: professional */
export const PROFESSIONAL_LESSON: BlockLesson = {
  lessonNumber: 5,
  title: 'Running an Effective Sprint Planning Meeting',
  communicativeNeed: 'communicate professionally when facilitating and participating in sprint planning meetings with colleagues',
  keyVocabulary: ['capacity', 'priority', 'estimate', 'dependency', 'align'],
  grammarFocus: 'Hedging and tentative language',
  mainActivity: 'Roleplay: facilitate a sprint planning discussion',
  isReview: false,
  methodology: 'CLT',
}

/** Triggers: writing */
export const WRITING_LESSON: BlockLesson = {
  lessonNumber: 6,
  title: 'Writing a Technical Incident Report',
  communicativeNeed: 'write a structured incident report documenting a production outage for engineering leadership',
  keyVocabulary: ['severity', 'timeline', 'root cause', 'mitigation', 'resolution'],
  grammarFocus: 'Past passive for technical timelines',
  mainActivity: 'Draft an incident report section from a given scenario',
  isReview: false,
  methodology: 'PPP',
}

// ─── Structure overrides (deterministic — no Math.random in tests) ────────────

export const S1 = { category: 'speaking', modules: [...STRUCTURES.speaking[0]] }
export const S2 = { category: 'speaking', modules: [...STRUCTURES.speaking[1]] }
export const S3 = { category: 'speaking', modules: [...STRUCTURES.speaking[2]] }
export const S4 = { category: 'speaking', modules: [...STRUCTURES.speaking[3]] }
export const R1 = { category: 'reading',  modules: [...STRUCTURES.reading[0]] }
export const R2 = { category: 'reading',  modules: [...STRUCTURES.reading[1]] }
export const V2 = { category: 'vocabulary', modules: [...STRUCTURES.vocabulary[1]] }
export const V4 = { category: 'vocabulary', modules: [...STRUCTURES.vocabulary[3]] }
export const G1 = { category: 'grammar',   modules: [...STRUCTURES.grammar[0]] }
export const W3 = { category: 'writing',   modules: [...STRUCTURES.writing[2]] }

// ─── YouTube transcript fixture ───────────────────────────────────────────────
// Fake ~5-minute transcript about remote work productivity.
// Long enough to supply real idioms and phrasal verbs for Stage 5.

export const YOUTUBE_TRANSCRIPT = `
Hi everyone, welcome back to the channel. Today we're talking about remote work — specifically
why some people absolutely thrive working from home while others completely fall apart.

I've been working remotely for about six years now, and honestly, it took me a long time to
figure out what actually works. In the beginning I was all over the place. I'd start late,
get distracted easily, work until midnight to catch up, and then burn out by Thursday.
Sound familiar?

So here's the thing. The people who pull it off — who actually get things done at home
consistently — they all share a few habits. Let's break them down.

First habit: protect your mornings. This is the big one. When you work in an office you
can kind of coast into the day — grab a coffee, chat to a colleague, ease into things.
At home, if you don't have a plan you'll just drift. You pick up your phone, check social
media, watch one video, and suddenly it's eleven o'clock and you've done nothing. That's
called "task avoidance" and we're all guilty of it.

The people who get ahead start with their hardest task first. Eat the frog, as some people
say. Get the thing you've been putting off out of the way before you open Slack or email.
Once that's done, everything else feels manageable.

Second habit: cut off your work. This sounds obvious but almost nobody does it. One of the
weirdest things about remote work is that the job can bleed into everything. There's no
commute to decompress on, no leaving the office behind. So you need to draw a hard line.
A fixed end time. Not "roughly when things wind down" — a real clock-off moment.

Some people use a walk. Even a ten-minute walk signals to your brain: work is over.
It's a transition ritual. Without one, you'll keep checking emails at nine pm wondering
why you can't switch off.

Third habit: deal with distractions head-on. The biggest enemy of remote work isn't
laziness — it's interruption. Family, noise, your phone — all of it chips away at your
focus. Deep work takes time to get into. Studies suggest it takes about twenty minutes to
fully focus after an interruption. So every time you get pulled away, you're paying that
cost again.

The fix? Time-blocking. Set aside chunks of two to three hours for focused work and
protect them ruthlessly. Turn off notifications. Tell people you're unavailable. It feels
uncomfortable at first but you'll be amazed how much you get done.

Fourth habit: build social time in deliberately. Isolation is a real problem with remote
work. It creeps up on you. One day you realise you haven't spoken to another person all
day and you feel drained in a way that sleep won't fix. So don't leave social interaction
to chance. Call a colleague for a proper catch-up, not just a status update. Schedule a
virtual lunch. Join a co-working space one day a week.

The irony is that people who maintain social connection tend to be more productive, not
less. Community keeps you accountable and energised.

So to wrap up: protect your mornings, cut off your work, deal with distractions, and
build social time in. None of these are revolutionary ideas. But the gap between knowing
and doing is where most people fall down.

If you want to go deeper on any of these, I've linked some resources below. And if you
found this useful, hit subscribe — we put out new videos every Tuesday and Thursday.
See you in the next one.
`.trim()

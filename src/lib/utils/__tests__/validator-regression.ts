/**
 * Regression harness: runs validateModularLesson against known-broken lessons.
 * Execute with: npx tsx src/lib/utils/__tests__/validator-regression.ts
 *
 * Lessons reconstructed from conversation screenshots/content.
 * Expected violations are documented inline.
 */

import { validateModularLesson } from '../modular-lesson-validator'

// ─── Danny lesson — "Participating in Global Calls" ──────────────────────────
// Known issues: generic social warm-up Q1+Q2, discussion Q3 abstract ("how do you decide")

const dannyParticipatingInGlobalCalls = {
  title: 'Participating in Global Calls',
  lessonType: 'modular',
  objective: 'Improve fluency and confidence in contributing to remote team discussions using professional logistics terminology.',
  duration: 50,
  difficulty: 7,
  skills: ['Speaking', 'Vocabulary'],
  modules: [
    {
      type: 'warm-up',
      title: 'Warm-up',
      timeMinutes: 5,
      tutorNotes: 'Focus on natural flow. If Danny uses German syntax (e.g., verb placement), gently recast.',
      content: {
        questions: [
          'How was your commute to the Scintilla facility this morning?',
          'Did you manage to get any time off over the weekend, or were you busy with projects?',
          'What is the most frustrating thing that happens when a production schedule suddenly changes?',
        ],
      },
    },
    {
      type: 'vocabulary-match',
      title: 'Vocabulary Match',
      timeMinutes: 8,
      tutorNotes: 'Ensure Danny understands these are not just words but functional units.',
      content: {
        groups: [
          {
            label: 'Logistics and Planning',
            pairs: [
              { sentence: 'We are facing a significant shortfall in blade production this week.', term: 'shortfall', definition: 'a failure to meet a target or requirement' },
              { sentence: 'The team needs to ramp up output to meet the new global demand.', term: 'ramp up', definition: 'to increase the speed or volume of production' },
              { sentence: 'We should prioritize the high-margin items to maximize our revenue.', term: 'high-margin', definition: 'products that generate a large profit' },
              { sentence: 'The current lead time for raw materials is causing us major headaches.', term: 'lead time', definition: 'the duration between starting and completing a process' },
              { sentence: 'We need to clear the current backlog before we can accept new orders.', term: 'backlog', definition: 'an accumulation of uncompleted work' },
            ],
          },
        ],
      },
    },
    {
      type: 'dialogue',
      title: 'Dialogue - The Production Update',
      timeMinutes: 10,
      tutorNotes: 'Danny is the learner. Ensure he uses the target phrases.',
      content: {
        setting: 'A remote video call between Danny (Planner) and Sarah (Project Manager) regarding a production delay.',
        characters: [{ name: 'Danny' }, { name: 'Sarah' }],
        dialogue: [
          { character: 'Sarah', text: 'Morning Danny. Did you catch the game last night? I heard the atmosphere in the stadium was wild.' },
          { character: 'Danny', text: "I did! It was intense. I actually lost my voice cheering. How about you? Did you get out of the city for the weekend?" },
          { character: 'Sarah', text: "I wish! I was stuck at my desk all Saturday. Anyway, we need to talk about the jigsaw blade output. We're behind." },
          { character: 'Danny', text: "I know, it's been a rough week. From my perspective at the site, we've had a major machine failure that slowed us down." },
          { character: 'Sarah', text: "That's frustrating, but the client is expecting those units by Friday. Can you just run an extra shift?" },
          { character: 'Danny', text: "I'm going to push back on that. We don't have the staff to cover an extra shift without burning everyone out." },
          { character: 'Sarah', text: "I hear you, but we can't miss this deadline. It's a high-margin order." },
          { character: 'Danny', text: "Could you clarify that point? Are you saying we should prioritize this over the oscillating tool accessories?" },
          { character: 'Sarah', text: 'Exactly. The jigsaw blades are the priority right now.' },
          { character: 'Danny', text: "I would like to add something. If we swap the priority, we'll create a massive backlog for the other line." },
          { character: 'Sarah', text: "That's a fair point. I hadn't considered the ripple effect on the other line." },
          { character: 'Danny', text: "Let us circle back to this later today once I've checked the material availability. I'll have a better plan then." },
        ],
      },
    },
    {
      type: 'comprehension',
      title: 'Comprehension',
      timeMinutes: 5,
      tutorNotes: "Probe for reasoning. If Danny gives a one-word answer, ask 'Why?' to force a full sentence.",
      content: {
        questions: [
          { question: "Why does Danny push back on Sarah's request for an extra shift?", answer: "Danny doesn't have the staff to cover an extra shift without burning everyone out." },
          { question: 'What is the main conflict regarding the production schedule?', answer: 'The jigsaw blades are behind schedule but prioritising them will create a backlog on the other line.' },
          { question: 'How does Danny propose to resolve the immediate tension?', answer: 'He proposes to circle back later after checking material availability.' },
          { question: "What does Sarah admit after Danny explains his perspective?", answer: "She hadn't considered the ripple effect on the other line." },
        ],
      },
    },
    {
      type: 'roleplay',
      title: 'Roleplay',
      timeMinutes: 10,
      tutorNotes: "If Danny struggles to use the phrases, pause and prompt him: 'How can you express your perspective here?'",
      content: {
        situation: 'Danny is meeting with a Director who wants to expedite a low-priority order that will disrupt the entire week\'s schedule.',
        roles: [
          {
            name: 'Director',
            description: 'Demanding, focused only on the specific client, ignores logistics constraints.',
            keyPoints: [
              'Insist the order must ship by Wednesday.',
              'Dismiss the logistics constraints as minor issues.',
              'Threaten to report the delay to the regional manager.',
            ],
          },
          {
            name: 'Danny',
            description: 'Logistics Planner trying to maintain operational stability.',
            keyPoints: [
              'Use the target phrases to push back professionally.',
              'Explain the impact on the backlog.',
              'Propose a compromise.',
            ],
          },
        ],
        phrasesToUse: [
          'From my perspective at the site',
          'push back on',
          'Could you clarify that point',
          'I would like to add something',
          'Let us circle back to this later',
        ],
      },
    },
    {
      type: 'discussion',
      title: 'Discussion',
      timeMinutes: 7,
      tutorNotes: "Focus on personal experience. If Danny is too general, ask: 'Tell me about a specific time this happened at Scintilla.'",
      content: {
        questions: [
          "Tell me about a time you had to push back on a manager's request. How did you handle it?",
          'When you have a production shortfall, what is the first thing you check?',
          'How do you decide which orders are high-margin enough to justify changing the schedule?',
          'Have you ever had to explain a complex logistics issue to someone who didn\'t understand the technical side?',
        ],
      },
    },
    {
      type: 'homework-writing',
      title: 'Homework',
      timeMinutes: 5,
      tutorNotes: 'Check for correct usage of the phrases in the email draft.',
      content: {
        task: 'Write a follow-up email to a colleague after a difficult meeting.',
        prompts: [
          'Summarize the disagreement from the meeting.',
          "Use the phrase 'From my perspective at the site' to explain your position.",
          "Use 'Let us circle back to this later' to propose a follow-up meeting.",
          "Explain why you had to 'push back on' their initial request.",
        ],
        wordCount: 'approximately 150',
      },
    },
  ],
}

// ─── Maurizio lesson — "Summarizing Decisions and Action Points" ──────────────
// Known issues: Discussion Q2 "especially with international teams",
// phrase-stacking in Maurizio's last turns

const maurizioSummarizingDecisions = {
  title: 'Summarizing Decisions and Action Points',
  lessonType: 'modular',
  objective: 'Master professional English for summarizing key decisions, action points, and responsibilities in technical meetings.',
  duration: 50,
  difficulty: 7,
  skills: ['Speaking', 'Vocabulary'],
  modules: [
    {
      type: 'warm-up',
      title: 'Warm-up',
      timeMinutes: 5,
      tutorNotes: 'Start with these easy, personal questions.',
      content: {
        questions: [
          "What's one small detail in a product design that often gets overlooked but can cause big problems later?",
          "Have you ever had to quickly summarize a complex technical discussion for someone who wasn't in the meeting?",
          "When you're working with international teams, what's the biggest challenge in making sure everyone is on the same page after a decision is made?",
        ],
      },
    },
    {
      type: 'useful-language',
      title: 'Key Phrases',
      timeMinutes: 7,
      tutorNotes: "Say the stem and ask your student to complete the phrase from memory. Drill each one in a realistic sentence before moving on.",
      content: {
        phrases: [
          { phrase: "To recap, we've decided to", stem: "To recap, we've .....", example: "To recap, we've decided to proceed with the revised design." },
          { phrase: 'The main action points are', stem: 'The main .....',  example: 'The main action points are to initiate testing and get a formal report.' },
          { phrase: 'X will be responsible for', stem: 'X will be .....',  example: 'David will be responsible for updating the test protocol.' },
          { phrase: "We'll reconvene on", stem: "We'll .....", example: "We'll reconvene on Tuesday next week." },
          { phrase: 'Is everyone clear on the next', stem: 'Is everyone .....',  example: 'Is everyone clear on the next steps?' },
          { phrase: 'Just to confirm, the key takeaway is', stem: 'Just to confirm, .....',  example: 'Just to confirm, the key takeaway is that we are prioritizing robust testing.' },
        ],
      },
    },
    {
      type: 'dialogue',
      title: 'Dialogue - EV Fastener Review Summary',
      timeMinutes: 12,
      tutorNotes: 'Set the scene for Maurizio. Play Anna and David.',
      content: {
        setting: 'A virtual meeting concluding a technical review for a new fastening solution for EV chassis.',
        characters: [{ name: 'Maurizio' }, { name: 'Anna' }, { name: 'David' }],
        dialogue: [
          { character: 'Anna', text: "Morning, Maurizio, David. How was everyone's weekend?" },
          { character: 'Maurizio', text: 'Good morning, Anna. Mine was quiet, thankfully.' },
          { character: 'David', text: 'Pretty good. Took the kids to the park. Shall we dive into the EV chassis fastener review?' },
          { character: 'Maurizio', text: "Absolutely. So, to recap, we've decided to proceed with the revised design for the multi-material joint, incorporating the new polymer-infused insert to improve vibration dampening." },
          { character: 'Anna', text: "That's right. I'm still a little uneasy about the long-term thermal cycling performance. We need to make sure we're not just kicking the can down the road." },
          { character: 'Maurizio', text: "I hear you, Anna. The main action points are to initiate accelerated thermal cycling tests on the revised prototype and to get a formal report from the materials lab by end of next week. David, you had some thoughts on the testing protocol?" },
          { character: 'David', text: "Yes. I'd like to push back slightly on the duration. I think we should extend the first phase by an extra 48 hours to get more robust data and align on the reliability." },
          { character: 'Maurizio', text: "I appreciate that input, David. Anna, what are your thoughts? It could prevent issues later. I think it's a sensible suggestion to ensure we're truly on track." },
          { character: 'Anna', text: "Hmm, a few days... I see your point, David. Better safe than sorry. So, David will be responsible for updating the test protocol and coordinating with the lab." },
          { character: 'Maurizio', text: "Consider it done, Anna. I'll follow up with the R&D lead immediately. And I'll also take ownership of communicating this slight adjustment to our international suppliers. Just to confirm, the key takeaway is that we're prioritizing robust testing over a strict adherence to the original timeline." },
          { character: 'David', text: "That sounds like a solid plan, Maurizio. I'm relieved we reached consensus on this." },
          { character: 'Maurizio', text: "Good. And we'll reconvene on Tuesday next week to review the preliminary thermal cycling results. Before we wrap up, is everyone clear on the next steps and their respective deliverables?" },
        ],
      },
    },
    {
      type: 'comprehension',
      title: 'Comprehension',
      timeMinutes: 7,
      tutorNotes: 'Ask Maurizio these questions to check his understanding of the dialogue.',
      content: {
        questions: [
          { question: 'What was the main decision Maurizio summarized at the beginning of the meeting?', answer: 'To proceed with the revised design incorporating the polymer-infused insert.' },
          { question: "What was Anna's main concern about the new fastening solution?", answer: 'Long-term thermal cycling performance.' },
          { question: 'What specific change did David propose for the testing protocol, and why?', answer: 'Extending the first phase by 48 hours to get more robust data.' },
          { question: 'What responsibilities did Maurizio take on after the proposal was accepted?', answer: 'Following up with R&D and communicating the adjustment to international suppliers.' },
          { question: 'When will the team reconvene, and what will they discuss?', answer: 'Tuesday next week to review preliminary thermal cycling results.' },
        ],
      },
    },
    {
      type: 'discussion',
      title: 'Discussion',
      timeMinutes: 8,
      tutorNotes: 'These questions encourage Maurizio to connect the lesson content to his own professional experiences.',
      content: {
        questions: [
          "Tell me about a time you had to quickly summarize a complex technical discussion for a senior manager who wasn't present.",
          "What's the most challenging part of ensuring everyone truly understands their responsibilities after a meeting, especially with international teams?",
          "In your experience, what's the best way to handle a situation where someone disagrees with a decision that's already been made, but you still need to move forward?",
          'Can you recall a time when a clear summary of action points prevented a significant problem down the line in one of your projects?',
        ],
      },
    },
    {
      type: 'homework-writing',
      title: 'Homework',
      timeMinutes: 3,
      tutorNotes: 'Explain the homework task clearly.',
      content: {
        task: 'Write an email to your team and key suppliers summarizing the decisions and action points from a fictional technical meeting about a new fastening solution for an electric vehicle\'s interior.',
        prompts: [
          'Start by recapping the main decision made regarding the fastening solution.',
          'List at least three main action points, assigning responsibility for each.',
          'Mention a specific date for the next follow-up or review meeting.',
          'Ensure everyone is clear on the next steps.',
        ],
        wordCount: '150-200 words',
      },
    },
  ],
}

// ─── Run ────────────────────────────────────────────────────────────────────

function runTest(name: string, lesson: unknown): void {
  console.log(`\n${'═'.repeat(70)}`)
  console.log(`LESSON: ${name}`)
  console.log('═'.repeat(70))

  const result = validateModularLesson(lesson)

  if (result.hardViolations.length === 0 && result.warnings.length === 0) {
    console.log('✅  No violations or warnings.')
    return
  }

  if (result.hardViolations.length > 0) {
    console.log(`\n🔴  HARD VIOLATIONS (${result.hardViolations.length}) — lesson would be blocked:`)
    for (const v of result.hardViolations) {
      console.log(`   • ${v}`)
    }
  }

  if (result.warnings.length > 0) {
    console.log(`\n🟡  AUTO-FIXES / WARNINGS (${result.warnings.length}):`)
    for (const w of result.warnings) {
      console.log(`   • ${w}`)
    }
  }
}

runTest('Danny — Participating in Global Calls', dannyParticipatingInGlobalCalls)
runTest('Maurizio — Summarizing Decisions and Action Points', maurizioSummarizingDecisions)

console.log('\n' + '═'.repeat(70))
console.log('Regression run complete.')
console.log('═'.repeat(70) + '\n')

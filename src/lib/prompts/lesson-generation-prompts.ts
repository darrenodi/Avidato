import { StudentProfile, TopicBlock } from '../../types/lesson-template';

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

  // Auto-infer skill focus from student goals; passed-in skillFocus overrides
  function inferSkillsFromGoals(goals: string): string[] {
    const g = goals.toLowerCase()
    const skills: string[] = []
    if (/\bwrit|\bdraft|\breport|\bemail|\bdocumentation/.test(g)) skills.push('Writing')
    if (/\bread|\bcomprehension/.test(g)) skills.push('Reading')
    if (/\bgrammar|\baccuracy|\bexam/.test(g)) skills.push('Grammar')
    if (/\bvocabulary|\bterminology|\blexis/.test(g)) skills.push('Vocabulary')
    if (/\blistening|\bhear/.test(g)) skills.push('Listening')
    return skills
  }
  const effectiveSkills = (skillFocus && skillFocus.length > 0) ? skillFocus : inferSkillsFromGoals(student.endGoals)

  const skillFocusSection = effectiveSkills.length > 0
    ? `\nSKILL FOCUS (derived from student goals):\nPriority skill areas: ${effectiveSkills.join(', ')}.\n- Weight the topic blocks and lesson titles toward these skills. If "Writing" is included, at least 1 full block must be writing-focused.\n- For any writing lesson, the communicativeNeed MUST begin with an explicit writing verb: "Write", "Draft", "Compose", "Document", or "Compile". This is mandatory — do NOT use speaking/discussion verbs for writing lessons.\n- If "Grammar" is included, at least 1 block should use PPP methodology with explicit grammar drill lessons.\n- Other skills (Speaking, Reading, Vocabulary, Listening) should have dedicated lessons within relevant blocks.\n`
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
  - keyVocabulary: exactly 3-5 SINGLE WORDS introduced in this lesson — no phrases, no compounds.
    LEVEL GATE: every word must be genuinely NEW at ${student.level}. Never include words the student
    mastered two levels ago. At C1, "objectives", "priority", "improve", "deadline" are all B1 words — banned.
  - grammarFocus: exactly 1 grammar point, e.g. "Present Perfect", "Conditional Type 2", "Passive Voice". For CLT/TBLT lessons choose the most relevant structure from the topic. For PPP lessons this is the drill target.
  - mainActivity: short phrase describing the core task, e.g. "Roleplay: project status update", "Gap-fill: reported speech", "Information gap: scheduling"

LESSON TITLES — TEXTBOOK FUNCTIONAL FRAMING:
Each lesson teaches a named LANGUAGE FUNCTION applied to a real scenario from this student's life —
like a professional coursebook unit, not a one-off situation. The title names the function; the
mainActivity supplies the scenario.
  ✓ GOOD: "Language for Reporting Problems and Suggesting Solutions", "Giving Reasons in Technical
    Negotiations", "Softening Feedback and Asking for Help", "Hedging and Diplomatic Disagreement",
    "Clarifying and Confirming in Fast Conversations"
  ✗ BAD (scenario with no function): "The Monday Standup", "A Trip to the Client's Office", "Talking About Your Job"
Across each block, functions must build a coherent repertoire (report → suggest → negotiate → decide),
not a random list of situations.
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

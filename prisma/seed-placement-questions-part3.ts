// prisma/seed-placement-questions-part3.ts
// Part 3: More grammar questions to fill all topic gaps and reach 800+ total
// Focus: additional questions per topic, especially underrepresented areas

import type { SeedQuestion } from './seed-placement-questions'

export const additionalGrammarQuestions: SeedQuestion[] = [
  // ================================================================
  // A1 — MORE COVERAGE (40 additional)
  // ================================================================

  // A1 — ARTICLES (more)
  { section: 'grammar', cefrLevel: 'A1', topic: 'articles', difficulty: 3, stem: 'Is there ___ hospital near here?', optionA: 'a', optionB: 'an', optionC: 'the', optionD: 'some', correctAnswer: 'A', explanation: '"A" is used before consonant sounds for something non-specific.', recommendedTopic: 'Articles: a/an/the' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'articles', difficulty: 4, stem: 'I want ___ umbrella. It\'s raining.', optionA: 'a', optionB: 'an', optionC: 'the', optionD: 'some', correctAnswer: 'B', explanation: '"An" is used before vowel sounds. "Umbrella" starts with /ʌ/.', recommendedTopic: 'Articles: a/an/the' },

  // A1 — PRESENT SIMPLE (more)
  { section: 'grammar', cefrLevel: 'A1', topic: 'present-simple', difficulty: 4, stem: 'He ___ TV every evening.', optionA: 'watch', optionB: 'watches', optionC: 'watching', optionD: 'is watch', correctAnswer: 'B', explanation: 'Third person singular: add -es to verbs ending in -ch.', recommendedTopic: 'Present Simple' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'present-simple', difficulty: 5, stem: 'We ___ in a flat in the city centre.', optionA: 'lives', optionB: 'living', optionC: 'live', optionD: 'is living', correctAnswer: 'C', explanation: '"We" uses the base form in present simple.', recommendedTopic: 'Present Simple' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'present-simple', difficulty: 5, stem: 'She never ___ to work by car.', optionA: 'drive', optionB: 'drives', optionC: 'driving', optionD: 'drove', correctAnswer: 'B', explanation: 'Adverb of frequency doesn\'t change the verb form; "she" still needs -s.', recommendedTopic: 'Present Simple' },

  // A1 — OBJECT PRONOUNS
  { section: 'grammar', cefrLevel: 'A1', topic: 'pronouns', subtopic: 'object', difficulty: 3, stem: 'I love ___. She is my best friend.', optionA: 'she', optionB: 'her', optionC: 'hers', optionD: 'herself', correctAnswer: 'B', explanation: '"Her" is the object pronoun for "she".', recommendedTopic: 'Object Pronouns' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'pronouns', subtopic: 'object', difficulty: 4, stem: 'Can you help ___?', optionA: 'we', optionB: 'our', optionC: 'us', optionD: 'ours', correctAnswer: 'C', explanation: '"Us" is the object pronoun for "we".', recommendedTopic: 'Object Pronouns' },

  // A1 — BASIC CONJUNCTIONS
  { section: 'grammar', cefrLevel: 'A1', topic: 'conjunctions-basic', difficulty: 3, stem: 'I like tea ___ coffee.', optionA: 'or', optionB: 'but', optionC: 'and', optionD: 'so', correctAnswer: 'C', explanation: '"And" connects two things you like.', recommendedTopic: 'Basic Conjunctions' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'conjunctions-basic', difficulty: 4, stem: 'Do you want juice ___ water?', optionA: 'and', optionB: 'but', optionC: 'or', optionD: 'so', correctAnswer: 'C', explanation: '"Or" offers a choice between two options.', recommendedTopic: 'Basic Conjunctions' },

  // A1 — COUNTRIES & NATIONALITIES
  { section: 'grammar', cefrLevel: 'A1', topic: 'nationalities', difficulty: 3, stem: 'He is from France. He is ___.', optionA: 'France', optionB: 'Franch', optionC: 'French', optionD: 'Francese', correctAnswer: 'C', explanation: 'The adjective/nationality for France is "French".', recommendedTopic: 'Countries and Nationalities' },

  // A1 — POSITIONS / DIRECTIONS
  { section: 'grammar', cefrLevel: 'A1', topic: 'positions', difficulty: 3, stem: 'The picture is ___ the wall.', optionA: 'in', optionB: 'at', optionC: 'on', optionD: 'under', correctAnswer: 'C', explanation: 'Pictures hang "on" walls (surfaces).', recommendedTopic: 'Prepositions of Place' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'positions', difficulty: 4, stem: 'The dog is sleeping ___ the table.', optionA: 'on', optionB: 'under', optionC: 'in', optionD: 'at', correctAnswer: 'B', explanation: '"Under" means below or beneath.', recommendedTopic: 'Prepositions of Place' },

  // A1 — THIS/THAT/THESE/THOSE
  { section: 'grammar', cefrLevel: 'A1', topic: 'demonstratives', difficulty: 4, stem: 'Who is ___ man over there?', optionA: 'this', optionB: 'that', optionC: 'these', optionD: 'those', correctAnswer: 'B', explanation: '"That" is used for singular things far from the speaker.', recommendedTopic: 'Demonstratives' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'demonstratives', difficulty: 5, stem: '___ flowers in the garden are beautiful.', optionA: 'This', optionB: 'That', optionC: 'These', optionD: 'Those', correctAnswer: 'D', explanation: '"Those" is the plural of "that" for things far from the speaker.', recommendedTopic: 'Demonstratives' },

  // A1 — SIMPLE QUESTIONS
  { section: 'grammar', cefrLevel: 'A1', topic: 'question-words', difficulty: 4, stem: '___ old are you?', optionA: 'What', optionB: 'Who', optionC: 'How', optionD: 'Why', correctAnswer: 'C', explanation: '"How old" asks about age.', recommendedTopic: 'Question Words' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'question-words', difficulty: 5, stem: '___ is your favourite sport?', optionA: 'Who', optionB: 'When', optionC: 'What', optionD: 'Where', correctAnswer: 'C', explanation: '"What" asks for specific information about things.', recommendedTopic: 'Question Words' },

  // A1 — CAN REQUESTS
  { section: 'grammar', cefrLevel: 'A1', topic: 'can-requests', difficulty: 4, stem: '___ I have a glass of water, please?', optionA: 'Am', optionB: 'Do', optionC: 'Can', optionD: 'Have', correctAnswer: 'C', explanation: '"Can" is used to make requests.', recommendedTopic: 'Can for Requests' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'can-requests', difficulty: 5, stem: '___ you open the window, please?', optionA: 'Do', optionB: 'Are', optionC: 'Can', optionD: 'Is', correctAnswer: 'C', explanation: '"Can you...?" is a polite request.', recommendedTopic: 'Can for Requests' },

  // A1 — THERE + BE
  { section: 'grammar', cefrLevel: 'A1', topic: 'there-is-are', difficulty: 3, stem: 'There ___ a cat in the garden.', optionA: 'are', optionB: 'is', optionC: 'am', optionD: 'be', correctAnswer: 'B', explanation: '"There is" + singular noun.', recommendedTopic: 'There is/There are' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'there-is-are', difficulty: 4, stem: '___ there any milk in the fridge?', optionA: 'Are', optionB: 'Is', optionC: 'Do', optionD: 'Does', correctAnswer: 'B', explanation: '"Is there" + uncountable noun for questions.', recommendedTopic: 'There is/There are' },

  // A1 — LET'S / SUGGESTIONS
  { section: 'grammar', cefrLevel: 'A1', topic: 'suggestions-basic', difficulty: 5, stem: '___ go to the park!', optionA: 'We', optionB: 'Let\'s', optionC: 'We are', optionD: 'Do we', correctAnswer: 'B', explanation: '"Let\'s" + base verb for suggestions.', recommendedTopic: 'Making Suggestions' },

  // ================================================================
  // A2 — MORE COVERAGE (35 additional)
  // ================================================================

  // A2 — MORE PAST SIMPLE
  { section: 'grammar', cefrLevel: 'A2', topic: 'past-simple', difficulty: 16, stem: 'We ___ dinner at an Italian restaurant.', optionA: 'eat', optionB: 'ate', optionC: 'eaten', optionD: 'eats', correctAnswer: 'B', explanation: '"Ate" is the past simple of "eat".', recommendedTopic: 'Past Simple: Irregular Verbs' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'past-simple', difficulty: 16, stem: 'I ___ a strange noise during the night.', optionA: 'heared', optionB: 'hear', optionC: 'heard', optionD: 'hearing', correctAnswer: 'C', explanation: '"Heard" is the past simple of "hear".', recommendedTopic: 'Past Simple: Irregular Verbs' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'past-simple', difficulty: 17, stem: 'They ___ to Spain on holiday last year.', optionA: 'fly', optionB: 'flied', optionC: 'flew', optionD: 'flown', correctAnswer: 'C', explanation: '"Flew" is the past simple of "fly".', recommendedTopic: 'Past Simple: Irregular Verbs' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'past-simple', difficulty: 17, stem: 'She ___ her key and couldn\'t open the door.', optionA: 'lose', optionB: 'losed', optionC: 'lost', optionD: 'loosing', correctAnswer: 'C', explanation: '"Lost" is the past simple of "lose".', recommendedTopic: 'Past Simple: Irregular Verbs' },

  // A2 — THERE WAS/WERE
  { section: 'grammar', cefrLevel: 'A2', topic: 'there-was-were', difficulty: 13, stem: 'There ___ a big storm last night.', optionA: 'is', optionB: 'was', optionC: 'were', optionD: 'are', correctAnswer: 'B', explanation: '"There was" + singular noun for past existence.', recommendedTopic: 'There was/There were' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'there-was-were', difficulty: 14, stem: 'There ___ many people at the concert.', optionA: 'is', optionB: 'was', optionC: 'were', optionD: 'are', correctAnswer: 'C', explanation: '"There were" + plural noun for past existence.', recommendedTopic: 'There was/There were' },

  // A2 — PRONOUNS: REFLEXIVE
  { section: 'grammar', cefrLevel: 'A2', topic: 'reflexive-pronouns', difficulty: 16, stem: 'Be careful! You might hurt ___.', optionA: 'you', optionB: 'your', optionC: 'yourself', optionD: 'yours', correctAnswer: 'C', explanation: '"Yourself" is the reflexive pronoun when subject and object are the same.', recommendedTopic: 'Reflexive Pronouns' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'reflexive-pronouns', difficulty: 17, stem: 'The children made the cake by ___.', optionA: 'them', optionB: 'their', optionC: 'themselves', optionD: 'theirs', correctAnswer: 'C', explanation: '"By themselves" means without help.', recommendedTopic: 'Reflexive Pronouns' },

  // A2 — COULD (past ability)
  { section: 'grammar', cefrLevel: 'A2', topic: 'could-past', difficulty: 15, stem: 'When I was young, I ___ run very fast.', optionA: 'can', optionB: 'could', optionC: 'was able', optionD: 'am able', correctAnswer: 'B', explanation: '"Could" is used for general past ability.', recommendedTopic: 'Could for Past Ability' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'could-past', difficulty: 16, stem: 'She ___ read when she was four years old.', optionA: 'can', optionB: 'could', optionC: 'was can', optionD: 'did can', correctAnswer: 'B', explanation: '"Could" expresses ability in the past.', recommendedTopic: 'Could for Past Ability' },

  // A2 — POSSESSIVE PRONOUNS
  { section: 'grammar', cefrLevel: 'A2', topic: 'possessive-pronouns', difficulty: 16, stem: 'Is this your book? No, it\'s ___.', optionA: 'her', optionB: 'hers', optionC: 'she', optionD: 'herself', correctAnswer: 'B', explanation: '"Hers" is a possessive pronoun that replaces "her book".', recommendedTopic: 'Possessive Pronouns' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'possessive-pronouns', difficulty: 17, stem: 'That car is ___. We bought it last week.', optionA: 'our', optionB: 'us', optionC: 'ours', optionD: 'we', correctAnswer: 'C', explanation: '"Ours" is a possessive pronoun standing alone.', recommendedTopic: 'Possessive Pronouns' },

  // A2 — PREPOSITIONS (more)
  { section: 'grammar', cefrLevel: 'A2', topic: 'prepositions', difficulty: 17, stem: 'I arrived ___ the airport two hours before my flight.', optionA: 'to', optionB: 'in', optionC: 'at', optionD: 'on', correctAnswer: 'C', explanation: '"At" is used with the airport, station, and specific locations.', recommendedTopic: 'Prepositions of Place' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'prepositions', difficulty: 18, stem: 'She\'s been waiting ___ 3 o\'clock.', optionA: 'for', optionB: 'since', optionC: 'from', optionD: 'at', correctAnswer: 'B', explanation: '"Since" is used with a specific point in time.', recommendedTopic: 'Prepositions of Time' },

  // A2 — GIVING DIRECTIONS
  { section: 'grammar', cefrLevel: 'A2', topic: 'directions', difficulty: 15, stem: 'Go ___ at the traffic lights.', optionA: 'on straight', optionB: 'straight on', optionC: 'straightly', optionD: 'to straight', correctAnswer: 'B', explanation: '"Straight on" or "straight ahead" means continue forward.', recommendedTopic: 'Giving Directions' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'directions', difficulty: 16, stem: 'Turn right and the bank is ___ the left.', optionA: 'at', optionB: 'in', optionC: 'on', optionD: 'to', correctAnswer: 'C', explanation: '"On the left/right" for positions.', recommendedTopic: 'Giving Directions' },

  // A2 — SHOULD (ADVICE)
  { section: 'grammar', cefrLevel: 'A2', topic: 'should-advice', difficulty: 16, stem: 'You ___ eat too much sugar. It\'s bad for you.', optionA: 'should', optionB: 'shouldn\'t', optionC: 'must', optionD: 'can', correctAnswer: 'B', explanation: '"Shouldn\'t" is used for gentle advice against something.', recommendedTopic: 'Should for Advice' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'should-advice', difficulty: 17, stem: 'You look tired. You ___ go to bed.', optionA: 'should', optionB: 'shouldn\'t', optionC: 'must', optionD: 'can', correctAnswer: 'A', explanation: '"Should" gives friendly advice.', recommendedTopic: 'Should for Advice' },

  // A2 — LIKE + ING / WOULD LIKE + TO
  { section: 'grammar', cefrLevel: 'A2', topic: 'like-vs-would-like', difficulty: 17, stem: 'She likes ___ in the morning.', optionA: 'swim', optionB: 'swimming', optionC: 'to swimming', optionD: 'swims', correctAnswer: 'B', explanation: '"Like + -ing" for enjoyment of activities in general.', recommendedTopic: 'Like + -ing / Would like + to' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'like-vs-would-like', difficulty: 18, stem: 'I\'d like ___ to Paris one day.', optionA: 'going', optionB: 'go', optionC: 'to go', optionD: 'went', correctAnswer: 'C', explanation: '"Would like + to + base verb" for specific wishes/desires.', recommendedTopic: 'Like + -ing / Would like + to' },

  // ================================================================
  // B1 — MORE COVERAGE (35 additional)
  // ================================================================

  // B1 — MORE PRESENT PERFECT
  { section: 'grammar', cefrLevel: 'B1', topic: 'present-perfect', difficulty: 24, stem: 'She has ___ been to Italy. This is her first time.', optionA: 'ever', optionB: 'never', optionC: 'already', optionD: 'just', correctAnswer: 'B', explanation: '"Never" in present perfect for something that has not happened at any time.', recommendedTopic: 'Present Perfect: ever/never' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'present-perfect', difficulty: 28, stem: 'How long ___ you known each other?', optionA: 'did', optionB: 'do', optionC: 'have', optionD: 'are', correctAnswer: 'C', explanation: '"How long have you...?" for duration questions with present perfect.', recommendedTopic: 'Present Perfect: for/since' },

  // B1 — SHOULD / OUGHT TO / HAD BETTER
  { section: 'grammar', cefrLevel: 'B1', topic: 'modals', subtopic: 'ought-to', difficulty: 26, stem: 'You ___ to apologise. It was your fault.', optionA: 'should', optionB: 'ought', optionC: 'must', optionD: 'have', correctAnswer: 'B', explanation: '"Ought to" is similar to "should" for strong advice.', recommendedTopic: 'Ought to' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'modals', subtopic: 'had-better', difficulty: 28, stem: 'You\'d better ___ now or you\'ll miss the train.', optionA: 'to leave', optionB: 'leaving', optionC: 'leave', optionD: 'left', correctAnswer: 'C', explanation: '"Had better + base verb" for strong advice/warning.', recommendedTopic: 'Had Better' },

  // B1 — MORE CONDITIONALS
  { section: 'grammar', cefrLevel: 'B1', topic: 'conditionals', subtopic: 'first conditional', difficulty: 28, stem: 'If she ___ enough money, she will buy a new phone.', optionA: 'saves', optionB: 'will save', optionC: 'saved', optionD: 'would save', correctAnswer: 'A', explanation: 'First conditional if-clause uses present simple.', recommendedTopic: 'First Conditional' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'conditionals', subtopic: 'first conditional', difficulty: 29, stem: 'I won\'t go out unless it ___ raining.', optionA: 'will stop', optionB: 'stopped', optionC: 'stops', optionD: 'would stop', correctAnswer: 'C', explanation: '"Unless" = "if not" and takes present simple in first conditional.', recommendedTopic: 'Unless in Conditionals' },

  // B1 — PASSIVE VOICE (more)
  { section: 'grammar', cefrLevel: 'B1', topic: 'passive', difficulty: 27, stem: 'This song ___ written by a famous artist.', optionA: 'is', optionB: 'was', optionC: 'has', optionD: 'had', correctAnswer: 'B', explanation: 'Past simple passive: was/were + past participle.', recommendedTopic: 'Passive Voice: Past' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'passive', difficulty: 28, stem: 'These cars ___ made in Germany.', optionA: 'is', optionB: 'was', optionC: 'are', optionD: 'been', correctAnswer: 'C', explanation: 'Present simple passive with plural subject: are + past participle.', recommendedTopic: 'Passive Voice: Present' },

  // B1 — USED TO
  { section: 'grammar', cefrLevel: 'B1', topic: 'used-to', difficulty: 25, stem: 'I ___ live in the countryside, but now I live in the city.', optionA: 'used to', optionB: 'use to', optionC: 'used', optionD: 'am used to', correctAnswer: 'A', explanation: '"Used to + base verb" for past habits no longer true.', recommendedTopic: 'Used to' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'used-to', difficulty: 26, stem: 'Did you ___ wear glasses?', optionA: 'used to', optionB: 'use to', optionC: 'used', optionD: 'using to', correctAnswer: 'B', explanation: 'In questions with "did", we use "use to" (not "used to").', recommendedTopic: 'Used to' },

  // B1 — GERUND AS SUBJECT
  { section: 'grammar', cefrLevel: 'B1', topic: 'gerund-subject', difficulty: 26, stem: '___ is good for your health.', optionA: 'Swim', optionB: 'Swimming', optionC: 'To swimming', optionD: 'The swim', correctAnswer: 'B', explanation: 'Gerunds (-ing) can be used as the subject of a sentence.', recommendedTopic: 'Gerunds as Subject' },

  // B1 — PRESENT PERFECT PASSIVE
  { section: 'grammar', cefrLevel: 'B1', topic: 'passive', subtopic: 'present-perfect', difficulty: 29, stem: 'The door ___ been locked.', optionA: 'is', optionB: 'was', optionC: 'has', optionD: 'had', correctAnswer: 'C', explanation: 'Present perfect passive: has/have been + past participle.', recommendedTopic: 'Passive Voice: Present Perfect' },

  // B1 — SO DO I / NEITHER DO I
  { section: 'grammar', cefrLevel: 'B1', topic: 'agreement', difficulty: 27, stem: '"I love pizza." "___ do I."', optionA: 'So', optionB: 'Neither', optionC: 'Either', optionD: 'Too', correctAnswer: 'A', explanation: '"So do I" shows agreement with a positive statement.', recommendedTopic: 'So do I / Neither do I' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'agreement', difficulty: 28, stem: '"I don\'t like snakes." "___ do I."', optionA: 'So', optionB: 'Neither', optionC: 'Either', optionD: 'Not', correctAnswer: 'B', explanation: '"Neither do I" shows agreement with a negative statement.', recommendedTopic: 'So do I / Neither do I' },

  // B1 — COMPARATIVE STRUCTURES
  { section: 'grammar', cefrLevel: 'B1', topic: 'comparisons', difficulty: 26, stem: 'This exercise is not as ___ as the last one.', optionA: 'harder', optionB: 'hard', optionC: 'hardest', optionD: 'more hard', correctAnswer: 'B', explanation: '"Not as + adjective + as" for comparisons of inequality.', recommendedTopic: 'As...as Comparisons' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'comparisons', difficulty: 27, stem: 'That\'s ___ interesting book I\'ve ever read.', optionA: 'more', optionB: 'most', optionC: 'the more', optionD: 'the most', correctAnswer: 'D', explanation: '"The most + adjective" for superlatives with long adjectives.', recommendedTopic: 'Superlatives' },

  // ================================================================
  // B2 — MORE COVERAGE (35 additional)
  // ================================================================

  // B2 — MORE CONDITIONALS
  { section: 'grammar', cefrLevel: 'B2', topic: 'conditionals', subtopic: 'second conditional', difficulty: 33, stem: 'If I ___ you, I\'d take the job.', optionA: 'am', optionB: 'was', optionC: 'were', optionD: 'will be', correctAnswer: 'C', explanation: '"Were" is the formal/correct form for all subjects in second conditional.', recommendedTopic: 'Second Conditional' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'conditionals', subtopic: 'third conditional', difficulty: 38, stem: 'If we had left earlier, we ___ caught the train.', optionA: 'will have', optionB: 'would have', optionC: 'should have', optionD: 'could', correctAnswer: 'B', explanation: 'Third conditional: would have + past participle for unreal past.', recommendedTopic: 'Third Conditional' },

  // B2 — PASSIVE WITH REPORTING VERBS
  { section: 'grammar', cefrLevel: 'B2', topic: 'passive-reporting', difficulty: 37, stem: 'The suspect is ___ to be hiding in the area.', optionA: 'think', optionB: 'thinking', optionC: 'thought', optionD: 'thinks', correctAnswer: 'C', explanation: 'Passive reporting: subject + is + past participle (thought/believed/said) + to + verb.', recommendedTopic: 'Passive with Reporting Verbs' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'passive-reporting', difficulty: 38, stem: 'It is ___ that the president will resign.', optionA: 'reported', optionB: 'reporting', optionC: 'report', optionD: 'reports', correctAnswer: 'A', explanation: '"It is reported/believed/said that..." for impersonal reporting.', recommendedTopic: 'Passive with Reporting Verbs' },

  // B2 — ADVANCED GERUNDS AND INFINITIVES
  { section: 'grammar', cefrLevel: 'B2', topic: 'gerunds-infinitives', subtopic: 'advanced', difficulty: 36, stem: 'I remember ___ the door, but it was open when I came back.', optionA: 'to lock', optionB: 'locking', optionC: 'lock', optionD: 'locked', correctAnswer: 'B', explanation: '"Remember + -ing" = remember something you did before.', recommendedTopic: 'Remember/Forget + gerund/infinitive' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'gerunds-infinitives', subtopic: 'advanced', difficulty: 37, stem: 'Please remember ___ the lights when you leave.', optionA: 'turning off', optionB: 'turn off', optionC: 'to turn off', optionD: 'turned off', correctAnswer: 'C', explanation: '"Remember + to + verb" = don\'t forget to do something.', recommendedTopic: 'Remember/Forget + gerund/infinitive' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'gerunds-infinitives', subtopic: 'advanced', difficulty: 38, stem: 'He stopped ___ a cigarette. (He paused his walk to smoke.)', optionA: 'smoking', optionB: 'to smoke', optionC: 'smoke', optionD: 'smoked', correctAnswer: 'B', explanation: '"Stop + to + verb" = pause in order to do something.', recommendedTopic: 'Stop + gerund/infinitive' },

  // B2 — SUBJECT-VERB AGREEMENT
  { section: 'grammar', cefrLevel: 'B2', topic: 'subject-verb-agreement', difficulty: 35, stem: 'Neither the students nor the teacher ___ happy about the change.', optionA: 'are', optionB: 'were', optionC: 'was', optionD: 'have been', correctAnswer: 'C', explanation: 'With "neither...nor", the verb agrees with the nearest subject (teacher = singular).', recommendedTopic: 'Subject-Verb Agreement' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'subject-verb-agreement', difficulty: 36, stem: 'A number of students ___ absent today.', optionA: 'is', optionB: 'was', optionC: 'are', optionD: 'has been', correctAnswer: 'C', explanation: '"A number of" + plural noun takes a plural verb.', recommendedTopic: 'Subject-Verb Agreement' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'subject-verb-agreement', difficulty: 37, stem: 'The number of applicants ___ increased this year.', optionA: 'have', optionB: 'has', optionC: 'are', optionD: 'were', correctAnswer: 'B', explanation: '"The number of" takes a singular verb.', recommendedTopic: 'Subject-Verb Agreement' },

  // B2 — INVERSION INTRO
  { section: 'grammar', cefrLevel: 'B2', topic: 'inversion-basic', difficulty: 39, stem: 'Not only ___ she win the race, but she also broke the record.', optionA: 'did', optionB: 'has', optionC: 'was', optionD: 'had', correctAnswer: 'A', explanation: '"Not only" triggers inversion: auxiliary + subject + verb.', recommendedTopic: 'Basic Inversion' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'inversion-basic', difficulty: 40, stem: 'Rarely ___ I seen such talent.', optionA: 'did', optionB: 'have', optionC: 'was', optionD: 'am', correctAnswer: 'B', explanation: '"Rarely + have I" with present perfect inversion.', recommendedTopic: 'Basic Inversion' },

  // B2 — ADVANCED CONJUNCTIONS
  { section: 'grammar', cefrLevel: 'B2', topic: 'conjunctions-advanced', difficulty: 36, stem: 'She studied hard ___ she could pass the exam.', optionA: 'so that', optionB: 'in case', optionC: 'although', optionD: 'even though', correctAnswer: 'A', explanation: '"So that" expresses purpose.', recommendedTopic: 'Advanced Conjunctions' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'conjunctions-advanced', difficulty: 37, stem: 'Take an umbrella ___ it rains.', optionA: 'so that', optionB: 'in case', optionC: 'although', optionD: 'unless', correctAnswer: 'B', explanation: '"In case" means as a precaution against something.', recommendedTopic: 'In Case / So That' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'conjunctions-advanced', difficulty: 38, stem: '___ tired she was, she finished the project.', optionA: 'Despite', optionB: 'in spite of', optionC: 'However', optionD: 'Although', correctAnswer: 'C', explanation: '"However + adjective + subject + be" for concession.', recommendedTopic: 'However / Whatever / Wherever' },

  // B2 — PURPOSE AND REASON
  { section: 'grammar', cefrLevel: 'B2', topic: 'purpose-reason', difficulty: 35, stem: '___ to the bad weather, the match was cancelled.', optionA: 'Because', optionB: 'Due', optionC: 'Since', optionD: 'As', correctAnswer: 'B', explanation: '"Due to" + noun phrase for giving reasons.', recommendedTopic: 'Due to / Owing to / Because of' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'purpose-reason', difficulty: 36, stem: 'She went to the library ___ order to study.', optionA: 'for', optionB: 'in', optionC: 'so', optionD: 'with', correctAnswer: 'B', explanation: '"In order to" + base verb for formal expression of purpose.', recommendedTopic: 'In Order To / So As To' },

  // ================================================================
  // C1 — MORE COVERAGE (25 additional)
  // ================================================================

  // C1 — MORE INVERSION
  { section: 'grammar', cefrLevel: 'C1', topic: 'inversion', difficulty: 48, stem: 'No sooner ___ he arrived than the meeting started.', optionA: 'did', optionB: 'had', optionC: 'has', optionD: 'was', correctAnswer: 'B', explanation: '"No sooner had... than..." uses past perfect with inversion.', recommendedTopic: 'Inversion: No Sooner / Hardly' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'inversion', difficulty: 49, stem: 'At no time ___ the defendant show any remorse.', optionA: 'has', optionB: 'had', optionC: 'did', optionD: 'was', correctAnswer: 'C', explanation: '"At no time" triggers inversion with "did" for past simple.', recommendedTopic: 'Inversion with Negative Adverbs' },

  // C1 — DETERMINERS ADVANCED
  { section: 'grammar', cefrLevel: 'C1', topic: 'determiners-advanced', difficulty: 45, stem: '___ student must submit the assignment by Friday.', optionA: 'Every', optionB: 'All', optionC: 'Each', optionD: 'Both A and C', correctAnswer: 'D', explanation: 'Both "Every" and "Each" + singular noun are correct here.', recommendedTopic: 'Every / Each / All' },

  // C1 — IT / THERE STRUCTURES
  { section: 'grammar', cefrLevel: 'C1', topic: 'it-there', difficulty: 46, stem: 'There ___ to be a problem with the system.', optionA: 'seems', optionB: 'appears', optionC: 'Both A and B', optionD: 'looks', correctAnswer: 'C', explanation: 'Both "seems" and "appears" work with "there" for impersonal observations.', recommendedTopic: 'There seems/appears to be' },

  // C1 — SPECULATION
  { section: 'grammar', cefrLevel: 'C1', topic: 'speculation', difficulty: 47, stem: 'He can\'t ___ the thief. He was with me all evening.', optionA: 'be', optionB: 'have been', optionC: 'being', optionD: 'to be', correctAnswer: 'B', explanation: '"Can\'t have been" for impossibility in the past.', recommendedTopic: 'Modal Verbs: Past Speculation' },

  // C1 — COMPLEX NOUN PHRASES
  { section: 'grammar', cefrLevel: 'C1', topic: 'complex-noun-phrases', difficulty: 48, stem: 'The decision ___ by the board last month has been overturned.', optionA: 'made', optionB: 'making', optionC: 'to make', optionD: 'which making', correctAnswer: 'A', explanation: 'Reduced relative clause using past participle: "The decision made (=which was made) by..."', recommendedTopic: 'Reduced Relative Clauses' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'complex-noun-phrases', difficulty: 49, stem: 'The issues ___ in the report need urgent attention.', optionA: 'raising', optionB: 'raised', optionC: 'to raise', optionD: 'being raise', correctAnswer: 'B', explanation: '"The issues raised" = "the issues that were raised" (reduced passive relative clause).', recommendedTopic: 'Reduced Relative Clauses' },

  // C1 — DISTANCING LANGUAGE
  { section: 'grammar', cefrLevel: 'C1', topic: 'distancing', difficulty: 48, stem: 'The economy ___ said to be recovering.', optionA: 'has', optionB: 'is', optionC: 'was been', optionD: 'being', correctAnswer: 'B', explanation: '"Is said to be" is a distancing expression used in news reporting.', recommendedTopic: 'Distancing Language' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'distancing', difficulty: 49, stem: '___ would appear that the policy has failed.', optionA: 'This', optionB: 'It', optionC: 'There', optionD: 'That', correctAnswer: 'B', explanation: '"It would appear that..." is a formal distancing expression.', recommendedTopic: 'Distancing Language' },

  // ================================================================
  // C2 — MORE COVERAGE (20 additional)
  // ================================================================

  // C2 — ARCHAIC/LITERARY FORMS
  { section: 'grammar', cefrLevel: 'C2', topic: 'literary-forms', difficulty: 56, stem: 'Whichever way you look at it, the fact ___ that we are losing money.', optionA: 'remains', optionB: 'remaining', optionC: 'is remaining', optionD: 'has remained', correctAnswer: 'A', explanation: '"The fact remains that..." is a formal emphatic structure.', recommendedTopic: 'Formal Written Structures' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'literary-forms', difficulty: 57, stem: '___ I to disagree, it would make no difference.', optionA: 'If', optionB: 'Should', optionC: 'Were', optionD: 'Had', correctAnswer: 'C', explanation: '"Were I to disagree" is a formal inverted second conditional.', recommendedTopic: 'Formal Conditional Inversion' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'literary-forms', difficulty: 58, stem: 'Suffice ___ to say, the experiment was a complete failure.', optionA: 'it', optionB: 'this', optionC: 'that', optionD: 'enough', correctAnswer: 'A', explanation: '"Suffice it to say" is a fixed formal expression meaning "it is enough to say".', recommendedTopic: 'Formal Fixed Expressions' },

  // C2 — ADVANCED EMPHASIS
  { section: 'grammar', cefrLevel: 'C2', topic: 'emphasis-advanced', difficulty: 57, stem: 'It is precisely ___ reason that I refuse to participate.', optionA: 'for this', optionB: 'because of', optionC: 'of this', optionD: 'due to this', correctAnswer: 'A', explanation: '"It is precisely for this reason that..." is a cleft sentence for precise emphasis.', recommendedTopic: 'Advanced Emphasis' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'emphasis-advanced', difficulty: 58, stem: 'Not for one moment ___ I doubt your sincerity.', optionA: 'have', optionB: 'did', optionC: 'do', optionD: 'had', correctAnswer: 'C', explanation: '"Not for one moment do I..." is emphatic inversion in present tense.', recommendedTopic: 'Emphatic Inversion' },

  // C2 — CIRCUMLOCUTION
  { section: 'grammar', cefrLevel: 'C2', topic: 'circumlocution', difficulty: 58, stem: 'To all intents and ___, the project has been abandoned.', optionA: 'means', optionB: 'purposes', optionC: 'reasons', optionD: 'effects', correctAnswer: 'B', explanation: '"To all intents and purposes" is a fixed expression meaning "in every practical sense".', recommendedTopic: 'Fixed Formal Expressions' },

  // C2 — SUBJUNCTIVE (more)
  { section: 'grammar', cefrLevel: 'C2', topic: 'subjunctive', subtopic: 'were', difficulty: 56, stem: 'If I ___ in your position, I would accept the offer.', optionA: 'am', optionB: 'was', optionC: 'were', optionD: 'would be', correctAnswer: 'C', explanation: '"Were" is used for all subjects in formal/written second conditional (subjunctive).', recommendedTopic: 'Subjunctive Were' },

  // C2 — NUANCED NEGATION
  { section: 'grammar', cefrLevel: 'C2', topic: 'negation', difficulty: 57, stem: 'She is not so much lazy ___ unmotivated.', optionA: 'than', optionB: 'as', optionC: 'but', optionD: 'like', correctAnswer: 'B', explanation: '"Not so much X as Y" means more Y than X.', recommendedTopic: 'Nuanced Negation' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'negation', difficulty: 58, stem: 'The decision was nothing ___ controversial.', optionA: 'but', optionB: 'short of', optionC: 'more than', optionD: 'if not', correctAnswer: 'D', explanation: '"Nothing if not" means extremely; it intensifies the adjective.', recommendedTopic: 'Emphatic Negation' },
]

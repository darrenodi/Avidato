// prisma/seed-placement-questions-extended.ts
// Extended question pool to reach 800+ total questions
// Part 2: Additional grammar questions across all levels

import type { SeedQuestion } from './seed-placement-questions'

export const extendedGrammarQuestionsA1A2: SeedQuestion[] = [
  // ================================================================
  // A1 EXTENDED — MORE TOPIC COVERAGE
  // ================================================================

  // A1 — NUMBERS / TIME
  { section: 'grammar', cefrLevel: 'A1', topic: 'telling-time', difficulty: 2, stem: 'The class starts ___ half past nine.', optionA: 'in', optionB: 'on', optionC: 'at', optionD: 'by', correctAnswer: 'C', explanation: 'We use "at" with clock times.', recommendedTopic: 'Telling the Time' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'telling-time', difficulty: 3, stem: 'It is ___ quarter to three.', optionA: 'a', optionB: 'the', optionC: 'an', optionD: 'no article', correctAnswer: 'A', explanation: 'We say "a quarter to" or "a quarter past" with times.', recommendedTopic: 'Telling the Time' },

  // A1 — MORE PRESENT SIMPLE
  { section: 'grammar', cefrLevel: 'A1', topic: 'present-simple', difficulty: 3, stem: 'My father ___ as a doctor.', optionA: 'work', optionB: 'works', optionC: 'working', optionD: 'is work', correctAnswer: 'B', explanation: 'Third person singular adds -s in present simple.', recommendedTopic: 'Present Simple' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'present-simple', difficulty: 4, stem: 'The shop ___ at 9 AM.', optionA: 'open', optionB: 'opens', optionC: 'opening', optionD: 'is open', correctAnswer: 'B', explanation: 'We use present simple for schedules and timetables.', recommendedTopic: 'Present Simple' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'present-simple', difficulty: 5, stem: '___ your sister like chocolate?', optionA: 'Do', optionB: 'Does', optionC: 'Is', optionD: 'Has', correctAnswer: 'B', explanation: 'Third person singular questions use "Does".', recommendedTopic: 'Present Simple: Questions' },

  // A1 — COLOURS & ADJECTIVES
  { section: 'grammar', cefrLevel: 'A1', topic: 'adjectives-basic', difficulty: 2, stem: 'The sky is ___.', optionA: 'blue', optionB: 'a blue', optionC: 'bluely', optionD: 'the blue', correctAnswer: 'A', explanation: 'Adjectives after "is/are" do not need an article.', recommendedTopic: 'Basic Adjectives' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'adjectives-basic', difficulty: 3, stem: 'She is a ___ girl.', optionA: 'nice', optionB: 'nicely', optionC: 'nicer', optionD: 'more nice', correctAnswer: 'A', explanation: 'Adjectives before nouns use the base form.', recommendedTopic: 'Basic Adjectives' },

  // A1 — LIKES AND DISLIKES
  { section: 'grammar', cefrLevel: 'A1', topic: 'likes-dislikes', difficulty: 3, stem: 'I ___ listen to music.', optionA: 'like', optionB: 'likes', optionC: 'liking', optionD: 'am like', correctAnswer: 'A', explanation: '"I" uses the base form of the verb in present simple.', recommendedTopic: 'Expressing Likes and Dislikes' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'likes-dislikes', difficulty: 4, stem: 'He doesn\'t ___ vegetables.', optionA: 'likes', optionB: 'like', optionC: 'liking', optionD: 'liked', correctAnswer: 'B', explanation: 'After "doesn\'t", use the base form of the verb.', recommendedTopic: 'Expressing Likes and Dislikes' },

  // A1 — MORE PREPOSITIONS
  { section: 'grammar', cefrLevel: 'A1', topic: 'prepositions', subtopic: 'direction', difficulty: 4, stem: 'She is walking ___ school.', optionA: 'at', optionB: 'to', optionC: 'in', optionD: 'on', correctAnswer: 'B', explanation: '"To" shows direction or movement towards a place.', recommendedTopic: 'Prepositions of Direction' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'prepositions', subtopic: 'place', difficulty: 4, stem: 'The cat is ___ the box.', optionA: 'under', optionB: 'on', optionC: 'in', optionD: 'All could be correct', correctAnswer: 'D', explanation: 'The cat could be under, on, or in the box. Context matters.', recommendedTopic: 'Prepositions of Place' },

  // A1 — NUMBERS & DATES
  { section: 'grammar', cefrLevel: 'A1', topic: 'dates', difficulty: 3, stem: 'My birthday is ___ March.', optionA: 'at', optionB: 'on', optionC: 'in', optionD: 'by', correctAnswer: 'C', explanation: 'We use "in" with months.', recommendedTopic: 'Prepositions of Time' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'dates', difficulty: 4, stem: 'Christmas Day is ___ the 25th of December.', optionA: 'in', optionB: 'on', optionC: 'at', optionD: 'by', correctAnswer: 'B', explanation: 'We use "on" with specific dates.', recommendedTopic: 'Prepositions of Time' },

  // A1 — MORE ARTICLES
  { section: 'grammar', cefrLevel: 'A1', topic: 'articles', difficulty: 5, stem: 'He goes to ___ school by bus.', optionA: 'a', optionB: 'an', optionC: 'the', optionD: 'no article', correctAnswer: 'D', explanation: 'We say "go to school" (no article) when talking about the activity/purpose.', recommendedTopic: 'Articles: a/an/the' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'articles', difficulty: 5, stem: 'She plays ___ piano very well.', optionA: 'a', optionB: 'an', optionC: 'the', optionD: 'no article', correctAnswer: 'C', explanation: 'We use "the" with musical instruments.', recommendedTopic: 'Articles: a/an/the' },

  // A1 — VERY BASIC HAVE/HAVE GOT
  { section: 'grammar', cefrLevel: 'A1', topic: 'have-got', difficulty: 2, stem: 'I ___ got a new bike.', optionA: 'am', optionB: 'has', optionC: 'have', optionD: 'do', correctAnswer: 'C', explanation: '"I" + "have got" for possession.', recommendedTopic: 'Have/Has Got' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'have-got', difficulty: 3, stem: '___ she got any pets?', optionA: 'Have', optionB: 'Has', optionC: 'Does', optionD: 'Is', correctAnswer: 'B', explanation: 'Third person singular: "Has she got...?"', recommendedTopic: 'Have/Has Got' },

  // ================================================================
  // A2 EXTENDED
  // ================================================================

  // A2 — IRREGULAR PAST SIMPLE
  { section: 'grammar', cefrLevel: 'A2', topic: 'past-simple', subtopic: 'irregular', difficulty: 14, stem: 'She ___ a new dress for the party.', optionA: 'buyed', optionB: 'bought', optionC: 'buying', optionD: 'buy', correctAnswer: 'B', explanation: '"Bought" is the irregular past form of "buy".', recommendedTopic: 'Past Simple: Irregular Verbs' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'past-simple', subtopic: 'irregular', difficulty: 15, stem: 'The children ___ in the pool all afternoon.', optionA: 'swam', optionB: 'swimmed', optionC: 'swum', optionD: 'swimming', correctAnswer: 'A', explanation: '"Swam" is the past simple form of "swim".', recommendedTopic: 'Past Simple: Irregular Verbs' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'past-simple', subtopic: 'irregular', difficulty: 15, stem: 'He ___ me a lovely card on my birthday.', optionA: 'sended', optionB: 'send', optionC: 'sent', optionD: 'sended', correctAnswer: 'C', explanation: '"Sent" is the irregular past form of "send".', recommendedTopic: 'Past Simple: Irregular Verbs' },

  // A2 — PAST SIMPLE NEGATIVES
  { section: 'grammar', cefrLevel: 'A2', topic: 'past-simple', subtopic: 'negative', difficulty: 13, stem: 'I ___ go to the gym yesterday.', optionA: 'don\'t', optionB: 'didn\'t', optionC: 'wasn\'t', optionD: 'not', correctAnswer: 'B', explanation: 'Past simple negative: didn\'t + base form.', recommendedTopic: 'Past Simple: Negatives' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'past-simple', subtopic: 'negative', difficulty: 14, stem: 'She didn\'t ___ the answer.', optionA: 'knew', optionB: 'known', optionC: 'know', optionD: 'knows', correctAnswer: 'C', explanation: 'After "didn\'t", always use the base form of the verb.', recommendedTopic: 'Past Simple: Negatives' },

  // A2 — MORE COMPARATIVES/SUPERLATIVES
  { section: 'grammar', cefrLevel: 'A2', topic: 'comparatives', difficulty: 15, stem: 'Today is ___ than yesterday.', optionA: 'hotter', optionB: 'more hot', optionC: 'hotest', optionD: 'most hot', correctAnswer: 'A', explanation: 'Short adjectives ending in consonant-vowel-consonant double the final consonant: hot > hotter.', recommendedTopic: 'Comparatives' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'comparatives', difficulty: 16, stem: 'Swimming is ___ than running.', optionA: 'gooder', optionB: 'more good', optionC: 'better', optionD: 'best', correctAnswer: 'C', explanation: '"Better" is the irregular comparative of "good".', recommendedTopic: 'Comparatives: Irregular' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'superlatives', difficulty: 16, stem: 'That was the ___ meal I have ever had.', optionA: 'worse', optionB: 'worst', optionC: 'most bad', optionD: 'baddest', correctAnswer: 'B', explanation: '"Worst" is the irregular superlative of "bad".', recommendedTopic: 'Superlatives: Irregular' },

  // A2 — SOME/ANY/MUCH/MANY
  { section: 'grammar', cefrLevel: 'A2', topic: 'some-any', difficulty: 13, stem: 'Would you like ___ tea?', optionA: 'any', optionB: 'some', optionC: 'a', optionD: 'many', correctAnswer: 'B', explanation: 'We use "some" in offers and requests, even in questions.', recommendedTopic: 'Some/Any' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'some-any', difficulty: 14, stem: 'There aren\'t ___ eggs left.', optionA: 'some', optionB: 'no', optionC: 'any', optionD: 'much', correctAnswer: 'C', explanation: '"Any" is used in negative sentences.', recommendedTopic: 'Some/Any' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'countable-uncountable', difficulty: 15, stem: 'How ___ people came to the party?', optionA: 'much', optionB: 'many', optionC: 'a lot', optionD: 'lots', correctAnswer: 'B', explanation: '"Many" is used with countable plural nouns in questions.', recommendedTopic: 'Much/Many/A Lot of' },

  // A2 — PRESENT CONTINUOUS VS SIMPLE
  { section: 'grammar', cefrLevel: 'A2', topic: 'present-simple-vs-continuous', difficulty: 17, stem: 'I usually walk to work, but today I ___ the bus.', optionA: 'take', optionB: 'takes', optionC: 'am taking', optionD: 'took', correctAnswer: 'C', explanation: '"Today" shows a temporary change from the usual routine (present continuous).', recommendedTopic: 'Present Simple vs Continuous' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'present-simple-vs-continuous', difficulty: 18, stem: 'I ___ coffee, but right now I\'m drinking tea.', optionA: 'love', optionB: 'am loving', optionC: 'loving', optionD: 'loves', correctAnswer: 'A', explanation: '"Love" is a stative verb and is usually used in present simple.', recommendedTopic: 'Stative Verbs' },

  // A2 — POSSESSIVE ADJECTIVES VS PRONOUNS
  { section: 'grammar', cefrLevel: 'A2', topic: 'possessives', difficulty: 15, stem: 'That pen is ___, not ___.',  optionA: 'my / your', optionB: 'mine / yours', optionC: 'mine / your', optionD: 'my / yours', correctAnswer: 'B', explanation: 'Possessive pronouns (mine, yours) stand alone without a noun.', recommendedTopic: 'Possessive Pronouns' },

  // A2 — ADVERBS OF MANNER
  { section: 'grammar', cefrLevel: 'A2', topic: 'adverbs-manner', difficulty: 14, stem: 'She speaks English very ___.', optionA: 'good', optionB: 'well', optionC: 'better', optionD: 'best', correctAnswer: 'B', explanation: '"Well" is the adverb form of "good". Adverbs modify verbs.', recommendedTopic: 'Adverbs of Manner' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'adverbs-manner', difficulty: 15, stem: 'He drives very ___.', optionA: 'careful', optionB: 'carefully', optionC: 'careless', optionD: 'more careful', correctAnswer: 'B', explanation: 'Adverbs of manner are formed by adding -ly to the adjective.', recommendedTopic: 'Adverbs of Manner' },

  // A2 — QUESTIONS: HOW MUCH / HOW MANY
  { section: 'grammar', cefrLevel: 'A2', topic: 'how-much-many', difficulty: 14, stem: '___ does this shirt cost?', optionA: 'How many', optionB: 'How much', optionC: 'How long', optionD: 'How far', correctAnswer: 'B', explanation: '"How much" is used for price/cost questions.', recommendedTopic: 'How much / How many' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'how-much-many', difficulty: 15, stem: '___ languages can you speak?', optionA: 'How much', optionB: 'How many', optionC: 'How long', optionD: 'How well', correctAnswer: 'B', explanation: '"How many" is used with countable nouns.', recommendedTopic: 'How much / How many' },

  // A2 — IMPERATIVES (more complex)
  { section: 'grammar', cefrLevel: 'A2', topic: 'imperatives', difficulty: 14, stem: '___ turn left at the traffic lights.', optionA: 'You', optionB: 'Let\'s', optionC: 'Don\'t', optionD: 'Please', correctAnswer: 'C', explanation: '"Don\'t + base verb" for negative instructions/commands.', recommendedTopic: 'Giving Directions' },

  // A2 — MAKING SUGGESTIONS
  { section: 'grammar', cefrLevel: 'A2', topic: 'suggestions', difficulty: 16, stem: '___ go to the cinema tonight?', optionA: 'Will we', optionB: 'Shall we', optionC: 'Do we', optionD: 'Are we', correctAnswer: 'B', explanation: '"Shall we...?" is used to make suggestions.', recommendedTopic: 'Making Suggestions' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'suggestions', difficulty: 17, stem: 'Why ___ we try that new restaurant?', optionA: 'don\'t', optionB: 'aren\'t', optionC: 'shouldn\'t', optionD: 'won\'t', correctAnswer: 'A', explanation: '"Why don\'t we...?" is a common way to make a suggestion.', recommendedTopic: 'Making Suggestions' },

  // A2 — CONNECTORS: AND, BUT, OR, SO, BECAUSE
  { section: 'grammar', cefrLevel: 'A2', topic: 'connectors', difficulty: 15, stem: 'Would you like tea ___ coffee?', optionA: 'and', optionB: 'but', optionC: 'or', optionD: 'so', correctAnswer: 'C', explanation: '"Or" offers a choice between alternatives.', recommendedTopic: 'Basic Connectors' },

  // A2 — PAST CONTINUOUS INTRO
  { section: 'grammar', cefrLevel: 'A2', topic: 'past-continuous', difficulty: 18, stem: 'What ___ you doing at 8 PM last night?', optionA: 'was', optionB: 'were', optionC: 'did', optionD: 'are', correctAnswer: 'B', explanation: '"You" uses "were" in past continuous questions.', recommendedTopic: 'Past Continuous' },

  // A2 — WOULD LIKE
  { section: 'grammar', cefrLevel: 'A2', topic: 'would-like', difficulty: 13, stem: 'I ___ like a glass of water, please.', optionA: 'will', optionB: 'would', optionC: 'am', optionD: 'do', correctAnswer: 'B', explanation: '"Would like" is a polite way to express a want or desire.', recommendedTopic: 'Would Like / Want' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'would-like', difficulty: 14, stem: '___ you like to come to my party?', optionA: 'Do', optionB: 'Would', optionC: 'Are', optionD: 'Will', correctAnswer: 'B', explanation: '"Would you like to...?" is a polite invitation.', recommendedTopic: 'Would Like / Want' },
]

export const extendedGrammarQuestionsB1B2: SeedQuestion[] = [
  // ================================================================
  // B1 EXTENDED
  // ================================================================

  // B1 — PRESENT PERFECT CONTINUOUS
  { section: 'grammar', cefrLevel: 'B1', topic: 'present-perfect-continuous', difficulty: 27, stem: 'I ___ waiting for you for an hour!', optionA: 'have been', optionB: 'am', optionC: 'was', optionD: 'had been', correctAnswer: 'A', explanation: 'Present perfect continuous: have/has been + -ing for duration up to now.', recommendedTopic: 'Present Perfect Continuous' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'present-perfect-continuous', difficulty: 28, stem: 'She ___ studying English for three years.', optionA: 'is', optionB: 'was', optionC: 'has been', optionD: 'had been', correctAnswer: 'C', explanation: 'Present perfect continuous for an action that started in the past and continues now.', recommendedTopic: 'Present Perfect Continuous' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'present-perfect-continuous', difficulty: 29, stem: 'Your eyes are red. ___ you been crying?', optionA: 'Were', optionB: 'Are', optionC: 'Have', optionD: 'Did', correctAnswer: 'C', explanation: 'Present perfect continuous: Have + subject + been + -ing for recent actions with visible results.', recommendedTopic: 'Present Perfect Continuous' },

  // B1 — MORE MODALS
  { section: 'grammar', cefrLevel: 'B1', topic: 'modals', subtopic: 'necessity', difficulty: 25, stem: 'You ___ to arrive at the airport two hours before your flight.', optionA: 'must', optionB: 'have', optionC: 'should', optionD: 'can', correctAnswer: 'B', explanation: '"Have to" expresses external obligation or necessity.', recommendedTopic: 'Modal Verbs: have to' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'modals', subtopic: 'necessity', difficulty: 26, stem: 'You ___ shout. I can hear you perfectly well.', optionA: 'mustn\'t', optionB: 'don\'t need to', optionC: 'shouldn\'t', optionD: 'can\'t', correctAnswer: 'B', explanation: '"Don\'t need to" means it is not necessary.', recommendedTopic: 'Modal Verbs: don\'t have to / needn\'t' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'modals', subtopic: 'prohibition', difficulty: 26, stem: 'You ___ park here. It\'s a no-parking zone.', optionA: 'don\'t have to', optionB: 'needn\'t', optionC: 'mustn\'t', optionD: 'shouldn\'t', correctAnswer: 'C', explanation: '"Mustn\'t" means it is forbidden/not allowed.', recommendedTopic: 'Modal Verbs: mustn\'t vs don\'t have to' },

  // B1 — MORE PAST CONTINUOUS
  { section: 'grammar', cefrLevel: 'B1', topic: 'past-continuous', difficulty: 25, stem: 'When I saw her, she ___ a red dress.', optionA: 'wore', optionB: 'was wearing', optionC: 'wears', optionD: 'is wearing', correctAnswer: 'B', explanation: 'Past continuous describes what was happening at a specific past moment.', recommendedTopic: 'Past Continuous' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'past-continuous', difficulty: 26, stem: 'While I ___, someone stole my wallet.', optionA: 'shopped', optionB: 'shop', optionC: 'was shopping', optionD: 'am shopping', correctAnswer: 'C', explanation: '"While" + past continuous for the longer action interrupted by a shorter one.', recommendedTopic: 'Past Continuous vs Past Simple' },

  // B1 — DEFINING VS NON-DEFINING RELATIVE CLAUSES
  { section: 'grammar', cefrLevel: 'B1', topic: 'relative-clauses', subtopic: 'non-defining', difficulty: 28, stem: 'My sister, ___ lives in Paris, is visiting next week.', optionA: 'that', optionB: 'who', optionC: 'which', optionD: 'whom', correctAnswer: 'B', explanation: 'Non-defining relative clauses use "who" (not "that") for people, with commas.', recommendedTopic: 'Non-Defining Relative Clauses' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'relative-clauses', subtopic: 'where', difficulty: 27, stem: 'That\'s the restaurant ___ we had dinner.', optionA: 'which', optionB: 'that', optionC: 'where', optionD: 'when', correctAnswer: 'C', explanation: '"Where" is used for places in relative clauses.', recommendedTopic: 'Relative Clauses: where/when' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'relative-clauses', subtopic: 'when', difficulty: 28, stem: 'Do you remember the day ___ we first met?', optionA: 'where', optionB: 'which', optionC: 'when', optionD: 'that', correctAnswer: 'C', explanation: '"When" is used for times in relative clauses.', recommendedTopic: 'Relative Clauses: where/when' },

  // B1 — REPORTED SPEECH: COMMANDS/REQUESTS
  { section: 'grammar', cefrLevel: 'B1', topic: 'reported-speech', subtopic: 'commands', difficulty: 28, stem: 'The teacher told us ___ quiet.', optionA: 'be', optionB: 'being', optionC: 'to be', optionD: 'were', correctAnswer: 'C', explanation: 'Reported commands: told + object + to + base verb.', recommendedTopic: 'Reported Commands' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'reported-speech', subtopic: 'requests', difficulty: 29, stem: 'She asked me ___ the window.', optionA: 'close', optionB: 'closing', optionC: 'to close', optionD: 'closed', correctAnswer: 'C', explanation: 'Reported requests: asked + object + to + base verb.', recommendedTopic: 'Reported Requests' },

  // B1 — FIRST CONDITIONAL (more)
  { section: 'grammar', cefrLevel: 'B1', topic: 'conditionals', subtopic: 'first conditional', difficulty: 26, stem: 'If you don\'t hurry, we ___ miss the bus.', optionA: 'would', optionB: 'will', optionC: 'might', optionD: 'Both B and C', correctAnswer: 'D', explanation: 'First conditional can use "will" or "might" in the result clause.', recommendedTopic: 'First Conditional' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'conditionals', subtopic: 'first conditional', difficulty: 27, stem: 'Unless you ___ a taxi, you\'ll be late.', optionA: 'take', optionB: 'will take', optionC: 'took', optionD: 'would take', correctAnswer: 'A', explanation: '"Unless" means "if not" and takes present simple.', recommendedTopic: 'Unless in Conditionals' },

  // B1 — PURPOSE: TO / IN ORDER TO / SO THAT
  { section: 'grammar', cefrLevel: 'B1', topic: 'purpose', difficulty: 25, stem: 'She went to the shop ___ buy some bread.', optionA: 'for', optionB: 'for to', optionC: 'to', optionD: 'so', correctAnswer: 'C', explanation: '"To + base verb" expresses purpose.', recommendedTopic: 'Expressing Purpose' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'purpose', difficulty: 27, stem: 'I turned off my phone ___ I could concentrate.', optionA: 'in order to', optionB: 'so that', optionC: 'for', optionD: 'to', correctAnswer: 'B', explanation: '"So that" + subject + could/can for purpose with a clause.', recommendedTopic: 'Expressing Purpose' },

  // B1 — ABILITY: CAN / COULD / BE ABLE TO
  { section: 'grammar', cefrLevel: 'B1', topic: 'ability', difficulty: 26, stem: 'After months of practice, she ___ finally play the song.', optionA: 'could', optionB: 'was able to', optionC: 'can', optionD: 'Both A and B', correctAnswer: 'B', explanation: '"Was able to" for a specific past achievement. "Could" for general past ability.', recommendedTopic: 'Can / Could / Be Able To' },

  // B1 — VERB PATTERNS
  { section: 'grammar', cefrLevel: 'B1', topic: 'verb-patterns', difficulty: 28, stem: 'I don\'t mind ___ late if it\'s necessary.', optionA: 'work', optionB: 'working', optionC: 'to work', optionD: 'worked', correctAnswer: 'B', explanation: '"Mind" is followed by a gerund (-ing).', recommendedTopic: 'Verb Patterns' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'verb-patterns', difficulty: 29, stem: 'He promised ___ on time.', optionA: 'arriving', optionB: 'arrive', optionC: 'to arrive', optionD: 'arrived', correctAnswer: 'C', explanation: '"Promise" is followed by the infinitive (to + verb).', recommendedTopic: 'Verb Patterns' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'verb-patterns', difficulty: 30, stem: 'She let me ___ her car.', optionA: 'to use', optionB: 'using', optionC: 'use', optionD: 'used', correctAnswer: 'C', explanation: '"Let" is followed by object + base verb (no "to").', recommendedTopic: 'Verb Patterns: let/make/help' },

  // ================================================================
  // B2 EXTENDED
  // ================================================================

  // B2 — NARRATIVE TENSES
  { section: 'grammar', cefrLevel: 'B2', topic: 'narrative-tenses', difficulty: 33, stem: 'I ___ home when I realised I ___ my phone at work.', optionA: 'was walking / had left', optionB: 'walked / left', optionC: 'had walked / left', optionD: 'was walking / left', correctAnswer: 'A', explanation: 'Past continuous for the background action; past perfect for the earlier action.', recommendedTopic: 'Narrative Tenses' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'narrative-tenses', difficulty: 34, stem: 'She ___ for the company for five years before she got promoted.', optionA: 'worked', optionB: 'was working', optionC: 'had been working', optionD: 'has been working', correctAnswer: 'C', explanation: 'Past perfect continuous for duration before another past event.', recommendedTopic: 'Past Perfect Continuous' },

  // B2 — MORE PHRASAL VERBS
  { section: 'grammar', cefrLevel: 'B2', topic: 'phrasal-verbs', difficulty: 35, stem: 'The plane ___ an hour late because of the storm.', optionA: 'took off', optionB: 'took on', optionC: 'took up', optionD: 'took over', correctAnswer: 'A', explanation: '"Take off" means to leave the ground (for aircraft).', recommendedTopic: 'Phrasal Verbs' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'phrasal-verbs', difficulty: 36, stem: 'We need to ___ a solution to this problem.', optionA: 'come up with', optionB: 'come across', optionC: 'come along', optionD: 'come about', correctAnswer: 'A', explanation: '"Come up with" means to think of or produce an idea or solution.', recommendedTopic: 'Phrasal Verbs' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'phrasal-verbs', difficulty: 37, stem: 'I ___ my old school friend by chance in the supermarket.', optionA: 'ran into', optionB: 'ran out of', optionC: 'ran over', optionD: 'ran up', correctAnswer: 'A', explanation: '"Run into" means to meet someone unexpectedly.', recommendedTopic: 'Phrasal Verbs' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'phrasal-verbs', difficulty: 38, stem: 'The meeting has been ___ until next week.', optionA: 'called off', optionB: 'put off', optionC: 'turned off', optionD: 'set off', correctAnswer: 'B', explanation: '"Put off" means to postpone to a later date.', recommendedTopic: 'Phrasal Verbs' },

  // B2 — MODAL VERBS: MIGHT HAVE / COULD HAVE
  { section: 'grammar', cefrLevel: 'B2', topic: 'modals', subtopic: 'past speculation', difficulty: 36, stem: 'She ___ taken the bus. I\'m not sure how she got here.', optionA: 'must have', optionB: 'might have', optionC: 'should have', optionD: 'would have', correctAnswer: 'B', explanation: '"Might have" + past participle for uncertain speculation about the past.', recommendedTopic: 'Modal Verbs: Past Speculation' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'modals', subtopic: 'past criticism', difficulty: 37, stem: 'You ___ told her the truth. Now she\'s angry.', optionA: 'might have', optionB: 'must have', optionC: 'should have', optionD: 'could have', correctAnswer: 'C', explanation: '"Should have" + past participle for regret or criticism about the past.', recommendedTopic: 'Modal Verbs: should have / could have' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'modals', subtopic: 'past ability', difficulty: 37, stem: 'I ___ helped you, but you didn\'t ask me.', optionA: 'should have', optionB: 'must have', optionC: 'could have', optionD: 'might have', correctAnswer: 'C', explanation: '"Could have" + past participle for an unused ability or opportunity in the past.', recommendedTopic: 'Modal Verbs: could have' },

  // B2 — CONDITIONALS (more)
  { section: 'grammar', cefrLevel: 'B2', topic: 'conditionals', subtopic: 'second conditional', difficulty: 34, stem: 'What would you do if you ___ a million dollars?', optionA: 'win', optionB: 'won', optionC: 'would win', optionD: 'had won', correctAnswer: 'B', explanation: 'Second conditional: If + past simple for hypothetical present/future.', recommendedTopic: 'Second Conditional' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'conditionals', subtopic: 'third conditional', difficulty: 37, stem: 'If he ___ the alarm, he wouldn\'t have missed the bus.', optionA: 'heard', optionB: 'hears', optionC: 'had heard', optionD: 'would hear', correctAnswer: 'C', explanation: 'Third conditional: If + past perfect for unreal past situations.', recommendedTopic: 'Third Conditional' },

  // B2 — -ING / -ED ADJECTIVES
  { section: 'grammar', cefrLevel: 'B2', topic: 'ing-ed-adjectives', difficulty: 32, stem: 'The film was really ___. I nearly fell asleep.', optionA: 'bored', optionB: 'boring', optionC: 'bore', optionD: 'boringly', correctAnswer: 'B', explanation: '-ing adjectives describe the thing/person causing the feeling.', recommendedTopic: '-ing vs -ed Adjectives' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'ing-ed-adjectives', difficulty: 33, stem: 'I\'m ___ in learning more about history.', optionA: 'interesting', optionB: 'interested', optionC: 'interest', optionD: 'interestingly', correctAnswer: 'B', explanation: '-ed adjectives describe how someone feels.', recommendedTopic: '-ing vs -ed Adjectives' },

  // B2 — ARTICLES WITH ABSTRACT/GENERAL
  { section: 'grammar', cefrLevel: 'B2', topic: 'articles-advanced', difficulty: 34, stem: '___ crime is a serious problem in many cities.', optionA: 'A', optionB: 'An', optionC: 'The', optionD: 'no article', correctAnswer: 'D', explanation: 'No article with uncountable/abstract nouns when speaking generally.', recommendedTopic: 'Articles: Advanced Uses' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'articles-advanced', difficulty: 35, stem: '___ Nile is the longest river in Africa.', optionA: 'A', optionB: 'An', optionC: 'The', optionD: 'no article', correctAnswer: 'C', explanation: '"The" is used with rivers, oceans, seas, and mountain ranges.', recommendedTopic: 'Articles: Advanced Uses' },

  // B2 — SO / SUCH
  { section: 'grammar', cefrLevel: 'B2', topic: 'so-such', difficulty: 33, stem: 'It was ___ a beautiful day that we went to the beach.', optionA: 'so', optionB: 'such', optionC: 'very', optionD: 'too', correctAnswer: 'B', explanation: '"Such + a/an + adjective + noun" for emphasis.', recommendedTopic: 'So / Such' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'so-such', difficulty: 34, stem: 'The film was ___ long that I fell asleep.', optionA: 'such', optionB: 'too', optionC: 'so', optionD: 'very', correctAnswer: 'C', explanation: '"So + adjective + that" for emphasis.', recommendedTopic: 'So / Such' },

  // B2 — DETERMINERS: BOTH/EITHER/NEITHER
  { section: 'grammar', cefrLevel: 'B2', topic: 'determiners', difficulty: 35, stem: '___ of the options is acceptable. You can choose any one.', optionA: 'Both', optionB: 'Either', optionC: 'Neither', optionD: 'All', correctAnswer: 'B', explanation: '"Either" means one or the other of two things.', recommendedTopic: 'Both / Either / Neither' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'determiners', difficulty: 36, stem: '___ of the answers was correct. All students failed.', optionA: 'Both', optionB: 'Either', optionC: 'Neither', optionD: 'Each', correctAnswer: 'C', explanation: '"Neither" means not one and not the other of two things.', recommendedTopic: 'Both / Either / Neither' },

  // B2 — EMPHASIS: IT IS... THAT
  { section: 'grammar', cefrLevel: 'B2', topic: 'emphasis', difficulty: 38, stem: 'It\'s the way she speaks ___ annoys me, not what she says.', optionA: 'which', optionB: 'that', optionC: 'what', optionD: 'who', correctAnswer: 'B', explanation: '"It is/It\'s... that..." is a cleft sentence for emphasis.', recommendedTopic: 'Emphasis: Cleft Sentences' },

  // B2 — REPORTED SPEECH (continued)
  { section: 'grammar', cefrLevel: 'B2', topic: 'reported-speech', difficulty: 36, stem: 'He said that he ___ for a new job.', optionA: 'is looking', optionB: 'was looking', optionC: 'looks', optionD: 'has looked', correctAnswer: 'B', explanation: 'In reported speech, present continuous becomes past continuous.', recommendedTopic: 'Reported Speech: Tense Changes' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'reported-speech', difficulty: 37, stem: 'She asked me if I ___ been to London.', optionA: 'have', optionB: 'had', optionC: 'has', optionD: 'was', correctAnswer: 'B', explanation: 'Present perfect "have been" becomes past perfect "had been" in reported speech.', recommendedTopic: 'Reported Speech: Tense Changes' },
]

export const extendedGrammarQuestionsC1C2: SeedQuestion[] = [
  // ================================================================
  // C1 EXTENDED
  // ================================================================

  // C1 — ADVANCED CONDITIONALS
  { section: 'grammar', cefrLevel: 'C1', topic: 'conditionals', subtopic: 'alternatives to if', difficulty: 45, stem: '___ you need any further information, please do not hesitate to contact us.', optionA: 'If', optionB: 'Should', optionC: 'Would', optionD: 'Both A and B', correctAnswer: 'D', explanation: '"Should you need..." is a formal alternative to "If you need..."', recommendedTopic: 'Formal Conditional Alternatives' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'conditionals', subtopic: 'alternatives to if', difficulty: 46, stem: '___ it not been for your help, I would have failed.', optionA: 'If', optionB: 'Had', optionC: 'Were', optionD: 'Should', correctAnswer: 'B', explanation: '"Had it not been for..." is a formal third conditional inversion.', recommendedTopic: 'Conditional Inversion' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'conditionals', subtopic: 'alternatives to if', difficulty: 47, stem: '___ I to win the lottery, I would donate half to charity.', optionA: 'If', optionB: 'Should', optionC: 'Were', optionD: 'Had', correctAnswer: 'C', explanation: '"Were I to..." is a formal second conditional inversion.', recommendedTopic: 'Conditional Inversion' },

  // C1 — ADVANCED PASSIVES
  { section: 'grammar', cefrLevel: 'C1', topic: 'passive', subtopic: 'impersonal', difficulty: 44, stem: 'It ___ that the company will announce job cuts.', optionA: 'is believed', optionB: 'believes', optionC: 'has believed', optionD: 'is believing', correctAnswer: 'A', explanation: 'Impersonal passive: "It is believed/said/thought that..." for reporting.', recommendedTopic: 'Impersonal Passive' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'passive', subtopic: 'impersonal', difficulty: 45, stem: 'The suspect is thought ___ left the country.', optionA: 'to', optionB: 'to have', optionC: 'having', optionD: 'that he', correctAnswer: 'B', explanation: 'Personal passive: subject + is thought + to have + past participle.', recommendedTopic: 'Impersonal Passive' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'passive', subtopic: 'impersonal', difficulty: 46, stem: 'He is said ___ the richest man in the city.', optionA: 'being', optionB: 'that is', optionC: 'to be', optionD: 'he is', correctAnswer: 'C', explanation: 'Personal passive: subject + is said + to be + complement.', recommendedTopic: 'Impersonal Passive' },

  // C1 — NOUN CLAUSES
  { section: 'grammar', cefrLevel: 'C1', topic: 'noun-clauses', difficulty: 45, stem: '___ she said surprised everyone.', optionA: 'That', optionB: 'What', optionC: 'Which', optionD: 'How', correctAnswer: 'B', explanation: '"What" introduces a noun clause functioning as the subject.', recommendedTopic: 'Noun Clauses' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'noun-clauses', difficulty: 46, stem: 'I don\'t understand ___ he refused the offer.', optionA: 'that', optionB: 'what', optionC: 'why', optionD: 'which', correctAnswer: 'C', explanation: '"Why" introduces a noun clause as the object of "understand".', recommendedTopic: 'Noun Clauses' },

  // C1 — CAUSATIVE
  { section: 'grammar', cefrLevel: 'C1', topic: 'causative', difficulty: 44, stem: 'The manager had the report ___ before the deadline.', optionA: 'rewriting', optionB: 'rewrite', optionC: 'rewritten', optionD: 'to rewrite', correctAnswer: 'C', explanation: 'Causative: had + object + past participle (someone else did it).', recommendedTopic: 'Causative Structures' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'causative', difficulty: 46, stem: 'I\'ll get my brother ___ the computer.', optionA: 'fix', optionB: 'fixing', optionC: 'to fix', optionD: 'fixed', correctAnswer: 'C', explanation: '"Get someone to do something" = persuade them to do it.', recommendedTopic: 'Causative Structures' },

  // C1 — COMMENT ADVERBIALS
  { section: 'grammar', cefrLevel: 'C1', topic: 'adverbials', difficulty: 45, stem: '___, the experiment was a success.', optionA: 'Hopeful', optionB: 'Hopingly', optionC: 'Fortunately', optionD: 'Fortunate', correctAnswer: 'C', explanation: 'Comment adverbials (Fortunately, Surprisingly) modify the whole sentence.', recommendedTopic: 'Comment Adverbials' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'adverbials', difficulty: 46, stem: 'The project, ___, was completed on time.', optionA: 'surprising', optionB: 'surprisingly', optionC: 'to surprising', optionD: 'surprisedly', correctAnswer: 'B', explanation: 'Comment adverbials can be placed mid-sentence between commas.', recommendedTopic: 'Comment Adverbials' },

  // C1 — COMPLEX SENTENCE PATTERNS
  { section: 'grammar', cefrLevel: 'C1', topic: 'complex-sentences', difficulty: 47, stem: 'The more you practise, the ___ you will become.', optionA: 'good', optionB: 'better', optionC: 'best', optionD: 'well', correctAnswer: 'B', explanation: '"The more... the more/better..." is a double comparative pattern.', recommendedTopic: 'Double Comparatives' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'complex-sentences', difficulty: 48, stem: 'Much ___ I admire her work, I disagree with her conclusion.', optionA: 'as', optionB: 'though', optionC: 'despite', optionD: 'however', correctAnswer: 'A', explanation: '"Much as..." introduces a concessive clause.', recommendedTopic: 'Concessive Structures' },

  // C1 — WOULD RATHER / HAD BETTER
  { section: 'grammar', cefrLevel: 'C1', topic: 'would-rather', difficulty: 44, stem: 'I\'d rather you ___ anyone about this.', optionA: 'don\'t tell', optionB: 'didn\'t tell', optionC: 'not tell', optionD: 'won\'t tell', correctAnswer: 'B', explanation: '"Would rather + someone + past simple" for preferences about others\' actions.', recommendedTopic: 'Would Rather / Had Better' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'would-rather', difficulty: 45, stem: 'You\'d better ___ late or the boss will be angry.', optionA: 'not to be', optionB: 'not be', optionC: 'don\'t be', optionD: 'not being', correctAnswer: 'B', explanation: '"Had better not + base verb" for strong advice/warning.', recommendedTopic: 'Would Rather / Had Better' },

  // C1 — ADVANCED LINKING DEVICES
  { section: 'grammar', cefrLevel: 'C1', topic: 'linking', difficulty: 47, stem: 'She performed well ___ being ill.', optionA: 'although', optionB: 'despite', optionC: 'however', optionD: 'whereas', correctAnswer: 'B', explanation: '"Despite" + noun/gerund for concession within a sentence.', recommendedTopic: 'Advanced Linking Words' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'linking', difficulty: 48, stem: 'The costs have risen; ___, profits have fallen.', optionA: 'although', optionB: 'despite', optionC: 'consequently', optionD: 'despite this', correctAnswer: 'C', explanation: '"Consequently" shows cause and effect between clauses.', recommendedTopic: 'Advanced Linking Words' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'linking', difficulty: 49, stem: 'He is wealthy. ___, he is not happy.', optionA: 'Nonetheless', optionB: 'Furthermore', optionC: 'Therefore', optionD: 'Moreover', correctAnswer: 'A', explanation: '"Nonetheless" means despite this fact; introduces a contrast.', recommendedTopic: 'Advanced Linking Words' },

  // ================================================================
  // C2 EXTENDED
  // ================================================================

  // C2 — ADVANCED VERB FORMS
  { section: 'grammar', cefrLevel: 'C2', topic: 'advanced-verbs', difficulty: 53, stem: 'I can\'t help ___ whether we made the right decision.', optionA: 'wonder', optionB: 'to wonder', optionC: 'wondering', optionD: 'but wonder', correctAnswer: 'D', explanation: '"Can\'t help but + base verb" is a formal fixed expression meaning "unable to avoid".', recommendedTopic: 'Advanced Verb Patterns' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'advanced-verbs', difficulty: 54, stem: 'The proposal is well worth ___.', optionA: 'to consider', optionB: 'considering', optionC: 'consider', optionD: 'considered', correctAnswer: 'B', explanation: '"Worth" is followed by a gerund: "worth considering".', recommendedTopic: 'Advanced Verb Patterns' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'advanced-verbs', difficulty: 55, stem: 'She so much as ___ in the wrong direction and her mother would scold her.', optionA: 'looks', optionB: 'looked', optionC: 'look', optionD: 'looking', correctAnswer: 'B', explanation: '"So much as + past simple" in a conditional-like structure for the slightest action.', recommendedTopic: 'Advanced Conditional Structures' },

  // C2 — COMPLEX PREPOSITION PATTERNS
  { section: 'grammar', cefrLevel: 'C2', topic: 'complex-prepositions', difficulty: 53, stem: 'The decision was taken ___ the objections of several board members.', optionA: 'in spite', optionB: 'regardless', optionC: 'notwithstanding', optionD: 'irrespective', correctAnswer: 'C', explanation: '"Notwithstanding" is a formal preposition meaning "in spite of".', recommendedTopic: 'Formal Prepositions' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'complex-prepositions', difficulty: 54, stem: 'The event proceeded ___ plan.', optionA: 'as per', optionB: 'in line', optionC: 'pursuant to', optionD: 'according', correctAnswer: 'A', explanation: '"As per" means "according to" or "in accordance with".', recommendedTopic: 'Formal Prepositions' },

  // C2 — SUBTLE TENSE DISTINCTIONS
  { section: 'grammar', cefrLevel: 'C2', topic: 'tense-nuance', difficulty: 55, stem: 'I wish I ___ you earlier. I only just found out myself.', optionA: 'could tell', optionB: 'could have told', optionC: 'told', optionD: 'had told', correctAnswer: 'B', explanation: '"I wish I could have told you" expresses inability in the past, whereas "had told" implies choice.', recommendedTopic: 'Advanced Wish Structures' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'tense-nuance', difficulty: 56, stem: 'It\'s high time you ___ looking for a job.', optionA: 'start', optionB: 'started', optionC: 'would start', optionD: 'had started', correctAnswer: 'B', explanation: '"It\'s high time + past simple" means something should have happened already.', recommendedTopic: 'It\'s Time / High Time' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'tense-nuance', difficulty: 57, stem: 'Sooner had she arrived ___ the problems began.', optionA: 'that', optionB: 'when', optionC: 'than', optionD: 'and', correctAnswer: 'C', explanation: '"No sooner had... than..." is the correct correlative structure.', recommendedTopic: 'No Sooner... Than / Hardly... When' },

  // C2 — CONCESSIVE STRUCTURES
  { section: 'grammar', cefrLevel: 'C2', topic: 'concession-advanced', difficulty: 55, stem: '___ though it may seem, his story is entirely true.', optionA: 'Strange', optionB: 'Strangely', optionC: 'As strange', optionD: 'However strange', correctAnswer: 'A', explanation: '"Adjective + though + subject + may + verb" is a formal concessive pattern.', recommendedTopic: 'Advanced Concessive Structures' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'concession-advanced', difficulty: 56, stem: '___ that as it may, the fact remains that costs are too high.', optionA: 'Be', optionB: 'Being', optionC: 'To be', optionD: 'Been', correctAnswer: 'A', explanation: '"Be that as it may" is a fixed subjunctive expression meaning "even so".', recommendedTopic: 'Fixed Formal Expressions' },

  // C2 — ADVANCED WORD ORDER
  { section: 'grammar', cefrLevel: 'C2', topic: 'word-order-advanced', difficulty: 55, stem: 'So ___ was her anger that she couldn\'t speak.', optionA: 'big', optionB: 'much', optionC: 'great', optionD: 'large', correctAnswer: 'C', explanation: '"So great was..." is an inverted emphatic structure. "Great" collocates with abstract emotions.', recommendedTopic: 'Emphatic Word Order' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'word-order-advanced', difficulty: 56, stem: 'Away ___ the birds as the children approached.', optionA: 'fly', optionB: 'flew', optionC: 'flying', optionD: 'had flown', correctAnswer: 'B', explanation: 'Adverbial fronting with full inversion: "Away flew the birds."', recommendedTopic: 'Fronting and Inversion' },

  // C2 — NUANCED MODALITY
  { section: 'grammar', cefrLevel: 'C2', topic: 'modality-advanced', difficulty: 56, stem: 'The letter ___ have been written by Shakespeare himself, but scholars remain divided.', optionA: 'might well', optionB: 'must', optionC: 'should', optionD: 'will', correctAnswer: 'A', explanation: '"Might well have" expresses strong but uncertain possibility.', recommendedTopic: 'Nuanced Modal Usage' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'modality-advanced', difficulty: 57, stem: 'She ___ not have acted more professionally. She was exemplary.', optionA: 'might', optionB: 'would', optionC: 'could', optionD: 'should', correctAnswer: 'C', explanation: '"Could not have" denotes that it was impossible to do better: it was the best possible.', recommendedTopic: 'Nuanced Modal Usage' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'modality-advanced', difficulty: 58, stem: 'You ___ well ask why I didn\'t complain. The answer is simple.', optionA: 'may', optionB: 'might', optionC: 'could', optionD: 'should', correctAnswer: 'A', explanation: '"You may well ask" acknowledges that the listener\'s natural question is valid.', recommendedTopic: 'Nuanced Modal Usage' },

  // C2 — PRAGMATIC COMPETENCE
  { section: 'grammar', cefrLevel: 'C2', topic: 'pragmatics', difficulty: 57, stem: 'I don\'t suppose you could ___ me a favour, could you?', optionA: 'make', optionB: 'do', optionC: 'give', optionD: 'take', correctAnswer: 'B', explanation: '"Do someone a favour" is the correct collocation for requests.', recommendedTopic: 'Pragmatic Competence' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'pragmatics', difficulty: 58, stem: 'Far ___ it from me to criticise, but I think there\'s a better approach.', optionA: 'is', optionB: 'was', optionC: 'be', optionD: 'being', correctAnswer: 'C', explanation: '"Far be it from me to..." is a fixed subjunctive expression used to soften criticism.', recommendedTopic: 'Diplomatic Language' },

  // C2 — LEXICAL PRECISION
  { section: 'grammar', cefrLevel: 'C2', topic: 'lexical-precision', difficulty: 57, stem: 'The minister ___ any allegations of corruption.', optionA: 'refused', optionB: 'rejected', optionC: 'denied', optionD: 'declined', correctAnswer: 'C', explanation: '"Deny allegations" is the correct collocation. "Refuse" is for requests; "reject" for proposals.', recommendedTopic: 'Lexical Precision' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'lexical-precision', difficulty: 58, stem: 'The painting ___ a sense of profound melancholy.', optionA: 'gives', optionB: 'conveys', optionC: 'performs', optionD: 'carries', correctAnswer: 'B', explanation: '"Convey a sense of" is the precise academic/literary expression.', recommendedTopic: 'Academic Vocabulary' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'lexical-precision', difficulty: 59, stem: 'The data is ___ with previous findings.', optionA: 'compatible', optionB: 'consistent', optionC: 'coherent', optionD: 'concurrent', correctAnswer: 'B', explanation: '"Consistent with" is used in academic contexts for data that agrees.', recommendedTopic: 'Academic Vocabulary' },

  // C2 — ADVANCED CLAUSE LINKING
  { section: 'grammar', cefrLevel: 'C2', topic: 'clause-linking', difficulty: 57, stem: 'Inasmuch ___ the contract was breached, the company reserves the right to seek damages.', optionA: 'that', optionB: 'as', optionC: 'so', optionD: 'which', correctAnswer: 'B', explanation: '"Inasmuch as" is a formal conjunction meaning "because" or "to the extent that".', recommendedTopic: 'Formal Clause Linking' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'clause-linking', difficulty: 58, stem: 'The proposal, ___ ambitious, lacked practical detail.', optionA: 'despite being', optionB: 'albeit', optionC: 'however', optionD: 'Both A and B', correctAnswer: 'D', explanation: 'Both "despite being" and "albeit" work as concessive linkers here.', recommendedTopic: 'Formal Clause Linking' },
]

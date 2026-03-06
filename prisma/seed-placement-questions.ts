// prisma/seed-placement-questions.ts
// 800+ placement test questions covering all CEFR levels A1-C2
// Run: npx ts-node prisma/seed-placement-questions.ts
// Or via API: POST /api/placement/seed

export interface SeedQuestion {
  section: 'grammar' | 'reading'
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  topic: string
  subtopic?: string
  difficulty: number // 1-60
  stem: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: 'A' | 'B' | 'C' | 'D'
  explanation: string
  recommendedTopic: string
}

// Difficulty ranges per level:
// A1: 1-10, A2: 11-20, B1: 21-30, B2: 31-40, C1: 41-50, C2: 51-60

export const grammarQuestions: SeedQuestion[] = [
  // ================================================================
  // A1 — ARTICLES (difficulty 1-10)
  // ================================================================
  { section: 'grammar', cefrLevel: 'A1', topic: 'articles', difficulty: 1, stem: 'She is ___ teacher.', optionA: 'a', optionB: 'an', optionC: 'the', optionD: 'no article', correctAnswer: 'A', explanation: 'We use "a" before consonant sounds. "Teacher" starts with a /t/ sound.', recommendedTopic: 'Articles: a/an/the' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'articles', difficulty: 2, stem: 'I eat ___ apple every day.', optionA: 'a', optionB: 'an', optionC: 'the', optionD: 'no article', correctAnswer: 'B', explanation: 'We use "an" before vowel sounds. "Apple" starts with a vowel sound.', recommendedTopic: 'Articles: a/an/the' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'articles', difficulty: 3, stem: '___ sun is very hot today.', optionA: 'A', optionB: 'An', optionC: 'The', optionD: 'no article', correctAnswer: 'C', explanation: 'We use "the" when there is only one of something (the sun, the moon).', recommendedTopic: 'Articles: a/an/the' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'articles', difficulty: 2, stem: 'He is ___ honest man.', optionA: 'a', optionB: 'an', optionC: 'the', optionD: 'no article', correctAnswer: 'B', explanation: '"Honest" starts with a silent "h", so the vowel sound /o/ follows. Use "an".', recommendedTopic: 'Articles: a/an/the' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'articles', difficulty: 4, stem: 'I like ___ chocolate.', optionA: 'a', optionB: 'an', optionC: 'the', optionD: 'no article', correctAnswer: 'D', explanation: 'We do not use an article with uncountable nouns when speaking in general.', recommendedTopic: 'Articles: a/an/the' },

  // A1 — PRONOUNS
  { section: 'grammar', cefrLevel: 'A1', topic: 'pronouns', difficulty: 1, stem: '___ am a student.', optionA: 'I', optionB: 'Me', optionC: 'My', optionD: 'Mine', correctAnswer: 'A', explanation: '"I" is the subject pronoun used before a verb.', recommendedTopic: 'Personal Pronouns' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'pronouns', difficulty: 2, stem: 'This book is ___.', optionA: 'my', optionB: 'me', optionC: 'mine', optionD: 'I', correctAnswer: 'C', explanation: '"Mine" is a possessive pronoun used without a noun after it.', recommendedTopic: 'Possessive Pronouns' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'pronouns', difficulty: 3, stem: 'Can you give ___ the pen?', optionA: 'I', optionB: 'me', optionC: 'my', optionD: 'mine', correctAnswer: 'B', explanation: '"Me" is the object pronoun. It comes after a verb.', recommendedTopic: 'Object Pronouns' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'pronouns', difficulty: 2, stem: '___ name is Sarah.', optionA: 'She', optionB: 'Her', optionC: 'Hers', optionD: 'Him', correctAnswer: 'B', explanation: '"Her" is the possessive adjective used before a noun.', recommendedTopic: 'Possessive Adjectives' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'pronouns', difficulty: 4, stem: 'Tom and ___ are friends.', optionA: 'me', optionB: 'my', optionC: 'I', optionD: 'mine', correctAnswer: 'C', explanation: '"I" is the subject pronoun. "Tom and I" is the subject of the sentence.', recommendedTopic: 'Personal Pronouns' },

  // A1 — PRESENT SIMPLE
  { section: 'grammar', cefrLevel: 'A1', topic: 'present-simple', difficulty: 1, stem: 'She ___ to school every day.', optionA: 'go', optionB: 'goes', optionC: 'going', optionD: 'gone', correctAnswer: 'B', explanation: 'Third person singular (she/he/it) adds -es to "go" in present simple.', recommendedTopic: 'Present Simple' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'present-simple', difficulty: 2, stem: 'They ___ coffee in the morning.', optionA: 'drinks', optionB: 'drinking', optionC: 'drink', optionD: 'drank', correctAnswer: 'C', explanation: 'With "they" (plural), we use the base form of the verb.', recommendedTopic: 'Present Simple' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'present-simple', difficulty: 3, stem: 'He ___ not like fish.', optionA: 'do', optionB: 'does', optionC: 'is', optionD: 'has', correctAnswer: 'B', explanation: 'Third person singular uses "does" in negative present simple.', recommendedTopic: 'Present Simple: Negatives' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'present-simple', difficulty: 3, stem: '___ you speak French?', optionA: 'Does', optionB: 'Do', optionC: 'Are', optionD: 'Is', correctAnswer: 'B', explanation: 'With "you" we use "Do" to form questions in present simple.', recommendedTopic: 'Present Simple: Questions' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'present-simple', difficulty: 4, stem: 'Water ___ at 100 degrees Celsius.', optionA: 'boil', optionB: 'boils', optionC: 'is boiling', optionD: 'boiled', correctAnswer: 'B', explanation: 'We use present simple for scientific facts and general truths.', recommendedTopic: 'Present Simple' },

  // A1 — BE VERB
  { section: 'grammar', cefrLevel: 'A1', topic: 'be-verb', difficulty: 1, stem: 'I ___ happy today.', optionA: 'am', optionB: 'is', optionC: 'are', optionD: 'be', correctAnswer: 'A', explanation: '"Am" is used with "I" as the subject.', recommendedTopic: 'Verb to Be' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'be-verb', difficulty: 1, stem: 'They ___ from Brazil.', optionA: 'am', optionB: 'is', optionC: 'are', optionD: 'be', correctAnswer: 'C', explanation: '"Are" is used with "they" (plural subjects).', recommendedTopic: 'Verb to Be' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'be-verb', difficulty: 2, stem: 'The cat ___ on the table.', optionA: 'am', optionB: 'is', optionC: 'are', optionD: 'be', correctAnswer: 'B', explanation: '"Is" is used with singular third person subjects.', recommendedTopic: 'Verb to Be' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'be-verb', difficulty: 3, stem: '___ she your sister?', optionA: 'Am', optionB: 'Is', optionC: 'Are', optionD: 'Do', correctAnswer: 'B', explanation: 'To form questions with "be", put the verb before the subject.', recommendedTopic: 'Verb to Be: Questions' },

  // A1 — PREPOSITIONS OF PLACE/TIME
  { section: 'grammar', cefrLevel: 'A1', topic: 'prepositions', subtopic: 'place', difficulty: 2, stem: 'The book is ___ the table.', optionA: 'in', optionB: 'on', optionC: 'at', optionD: 'to', correctAnswer: 'B', explanation: '"On" is used for surfaces.', recommendedTopic: 'Prepositions of Place' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'prepositions', subtopic: 'place', difficulty: 3, stem: 'She lives ___ London.', optionA: 'on', optionB: 'at', optionC: 'in', optionD: 'to', correctAnswer: 'C', explanation: '"In" is used with cities and countries.', recommendedTopic: 'Prepositions of Place' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'prepositions', subtopic: 'time', difficulty: 3, stem: 'The meeting is ___ Monday.', optionA: 'in', optionB: 'on', optionC: 'at', optionD: 'to', correctAnswer: 'B', explanation: '"On" is used with days of the week.', recommendedTopic: 'Prepositions of Time' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'prepositions', subtopic: 'time', difficulty: 4, stem: 'I wake up ___ 7 o\'clock.', optionA: 'in', optionB: 'on', optionC: 'at', optionD: 'to', correctAnswer: 'C', explanation: '"At" is used with specific times.', recommendedTopic: 'Prepositions of Time' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'prepositions', subtopic: 'time', difficulty: 4, stem: 'We go on holiday ___ summer.', optionA: 'in', optionB: 'on', optionC: 'at', optionD: 'to', correctAnswer: 'A', explanation: '"In" is used with seasons, months and years.', recommendedTopic: 'Prepositions of Time' },

  // A1 — THERE IS / THERE ARE
  { section: 'grammar', cefrLevel: 'A1', topic: 'there-is-are', difficulty: 2, stem: 'There ___ a park near my house.', optionA: 'is', optionB: 'are', optionC: 'am', optionD: 'be', correctAnswer: 'A', explanation: '"There is" is used with singular nouns.', recommendedTopic: 'There is/There are' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'there-is-are', difficulty: 3, stem: 'There ___ many students in the class.', optionA: 'is', optionB: 'are', optionC: 'am', optionD: 'has', correctAnswer: 'B', explanation: '"There are" is used with plural nouns.', recommendedTopic: 'There is/There are' },

  // A1 — POSSESSIVES
  { section: 'grammar', cefrLevel: 'A1', topic: 'possessives', difficulty: 2, stem: 'This is ___ car.', optionA: 'John', optionB: 'John\'s', optionC: 'Johns', optionD: 'of John', correctAnswer: 'B', explanation: 'We use \'s to show possession with people.', recommendedTopic: 'Possessive \'s' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'possessives', difficulty: 3, stem: '___ bag is this?', optionA: 'Who', optionB: 'Whose', optionC: 'Who\'s', optionD: 'Which', correctAnswer: 'B', explanation: '"Whose" asks about possession. "Who\'s" means "who is".', recommendedTopic: 'Possessive Adjectives' },

  // A1 — IMPERATIVES
  { section: 'grammar', cefrLevel: 'A1', topic: 'imperatives', difficulty: 2, stem: '___ the door, please.', optionA: 'Closing', optionB: 'Closed', optionC: 'Close', optionD: 'Closes', correctAnswer: 'C', explanation: 'Imperatives use the base form of the verb.', recommendedTopic: 'Imperatives' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'imperatives', difficulty: 3, stem: '___ run in the corridor.', optionA: 'Not', optionB: 'No', optionC: 'Don\'t', optionD: 'Doesn\'t', correctAnswer: 'C', explanation: 'We use "Don\'t" + base verb for negative imperatives.', recommendedTopic: 'Imperatives' },

  // A1 — WORD ORDER
  { section: 'grammar', cefrLevel: 'A1', topic: 'word-order', difficulty: 3, stem: 'Which sentence is correct?', optionA: 'I always drink coffee.', optionB: 'I drink always coffee.', optionC: 'Always I drink coffee.', optionD: 'I drink coffee always.', correctAnswer: 'A', explanation: 'Adverbs of frequency go before the main verb.', recommendedTopic: 'Word Order' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'word-order', difficulty: 4, stem: 'Which sentence is correct?', optionA: 'She has a red beautiful car.', optionB: 'She has a beautiful red car.', optionC: 'She has a car red beautiful.', optionD: 'She has a car beautiful red.', correctAnswer: 'B', explanation: 'Adjective order: opinion (beautiful) before colour (red).', recommendedTopic: 'Adjective Order' },

  // A1 — PLURALS
  { section: 'grammar', cefrLevel: 'A1', topic: 'plurals', difficulty: 1, stem: 'I have two ___.', optionA: 'childs', optionB: 'childrens', optionC: 'children', optionD: 'child', correctAnswer: 'C', explanation: '"Children" is the irregular plural of "child".', recommendedTopic: 'Plural Nouns' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'plurals', difficulty: 2, stem: 'There are three ___ on the shelf.', optionA: 'boxs', optionB: 'boxes', optionC: 'boxies', optionD: 'box', correctAnswer: 'B', explanation: 'Nouns ending in -x add -es to form the plural.', recommendedTopic: 'Plural Nouns' },

  // A1 — CAN/CAN'T
  { section: 'grammar', cefrLevel: 'A1', topic: 'can-ability', difficulty: 2, stem: 'She ___ swim very well.', optionA: 'cans', optionB: 'can', optionC: 'is can', optionD: 'do can', correctAnswer: 'B', explanation: '"Can" does not change form with any subject.', recommendedTopic: 'Can for Ability' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'can-ability', difficulty: 3, stem: 'I ___ speak Japanese. I only know English.', optionA: 'can not', optionB: 'don\'t can', optionC: 'can\'t', optionD: 'am not can', correctAnswer: 'C', explanation: 'The negative form of "can" is "can\'t" (or "cannot").', recommendedTopic: 'Can for Ability' },

  // ================================================================
  // A2 — PAST SIMPLE (difficulty 11-20)
  // ================================================================
  { section: 'grammar', cefrLevel: 'A2', topic: 'past-simple', difficulty: 11, stem: 'I ___ to the cinema yesterday.', optionA: 'go', optionB: 'went', optionC: 'gone', optionD: 'going', correctAnswer: 'B', explanation: '"Went" is the past simple form of "go".', recommendedTopic: 'Past Simple: Irregular Verbs' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'past-simple', difficulty: 12, stem: 'She ___ her homework last night.', optionA: 'do', optionB: 'does', optionC: 'did', optionD: 'done', correctAnswer: 'C', explanation: '"Did" is the past simple form of "do".', recommendedTopic: 'Past Simple: Irregular Verbs' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'past-simple', difficulty: 12, stem: 'They ___ football last weekend.', optionA: 'play', optionB: 'played', optionC: 'playing', optionD: 'plays', correctAnswer: 'B', explanation: 'Regular verbs add -ed in past simple.', recommendedTopic: 'Past Simple: Regular Verbs' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'past-simple', difficulty: 13, stem: '___ you see the film?', optionA: 'Do', optionB: 'Does', optionC: 'Did', optionD: 'Was', correctAnswer: 'C', explanation: 'Past simple questions use "Did" + base form.', recommendedTopic: 'Past Simple: Questions' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'past-simple', difficulty: 14, stem: 'He ___ come to the party.', optionA: 'doesn\'t', optionB: 'didn\'t', optionC: 'wasn\'t', optionD: 'not', correctAnswer: 'B', explanation: 'Past simple negatives use "didn\'t" + base form.', recommendedTopic: 'Past Simple: Negatives' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'past-simple', difficulty: 14, stem: 'We ___ a great time at the beach.', optionA: 'have', optionB: 'has', optionC: 'had', optionD: 'having', correctAnswer: 'C', explanation: '"Had" is the past simple form of "have".', recommendedTopic: 'Past Simple: Irregular Verbs' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'past-simple', difficulty: 15, stem: 'The train ___ at 8 o\'clock this morning.', optionA: 'arrive', optionB: 'arrives', optionC: 'arrived', optionD: 'arriving', correctAnswer: 'C', explanation: 'A completed action at a specific time in the past uses past simple.', recommendedTopic: 'Past Simple' },

  // A2 — PRESENT CONTINUOUS
  { section: 'grammar', cefrLevel: 'A2', topic: 'present-continuous', difficulty: 11, stem: 'Look! She ___ dancing.', optionA: 'is', optionB: 'are', optionC: 'am', optionD: 'does', correctAnswer: 'A', explanation: '"Is" + -ing for third person singular in present continuous.', recommendedTopic: 'Present Continuous' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'present-continuous', difficulty: 12, stem: 'They ___ TV right now.', optionA: 'watch', optionB: 'watches', optionC: 'are watching', optionD: 'is watching', correctAnswer: 'C', explanation: 'Present continuous = subject + be + verb-ing. "They" takes "are".', recommendedTopic: 'Present Continuous' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'present-continuous', difficulty: 13, stem: 'I ___ to music at the moment.', optionA: 'listen', optionB: 'am listening', optionC: 'listening', optionD: 'listens', correctAnswer: 'B', explanation: '"At the moment" signals present continuous: am/is/are + -ing.', recommendedTopic: 'Present Continuous' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'present-continuous', difficulty: 14, stem: 'We ___ a new house next month.', optionA: 'buy', optionB: 'bought', optionC: 'are buying', optionD: 'buys', correctAnswer: 'C', explanation: 'Present continuous can express future arrangements.', recommendedTopic: 'Present Continuous for Future' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'present-continuous', difficulty: 15, stem: 'Be quiet! The baby ___.', optionA: 'sleeps', optionB: 'sleep', optionC: 'is sleeping', optionD: 'slept', correctAnswer: 'C', explanation: 'An action happening at this moment uses present continuous.', recommendedTopic: 'Present Continuous' },

  // A2 — FUTURE (GOING TO)
  { section: 'grammar', cefrLevel: 'A2', topic: 'future-going-to', difficulty: 12, stem: 'I ___ visit my grandma this weekend.', optionA: 'going to', optionB: 'am going to', optionC: 'will going to', optionD: 'go to', correctAnswer: 'B', explanation: 'The structure is subject + am/is/are + going to + base verb.', recommendedTopic: 'Going to for Future Plans' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'future-going-to', difficulty: 13, stem: 'Look at those clouds! It ___ rain.', optionA: 'is going to', optionB: 'going to', optionC: 'will going to', optionD: 'goes to', correctAnswer: 'A', explanation: 'We use "going to" for predictions based on present evidence.', recommendedTopic: 'Going to for Predictions' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'future-going-to', difficulty: 14, stem: 'They ___ get married next June.', optionA: 'going to', optionB: 'is going to', optionC: 'are going to', optionD: 'will going', correctAnswer: 'C', explanation: '"They" goes with "are going to". It expresses a planned decision.', recommendedTopic: 'Going to for Future Plans' },

  // A2 — COMPARATIVES & SUPERLATIVES
  { section: 'grammar', cefrLevel: 'A2', topic: 'comparatives', difficulty: 12, stem: 'My house is ___ than yours.', optionA: 'big', optionB: 'bigger', optionC: 'biggest', optionD: 'more big', correctAnswer: 'B', explanation: 'Short adjectives add -er for comparatives.', recommendedTopic: 'Comparatives' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'comparatives', difficulty: 13, stem: 'This question is ___ than the last one.', optionA: 'difficulter', optionB: 'more difficult', optionC: 'most difficult', optionD: 'difficultest', correctAnswer: 'B', explanation: 'Long adjectives (3+ syllables) use "more" for comparatives.', recommendedTopic: 'Comparatives' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'superlatives', difficulty: 14, stem: 'This is the ___ film I have ever seen.', optionA: 'good', optionB: 'better', optionC: 'best', optionD: 'most good', correctAnswer: 'C', explanation: '"Best" is the irregular superlative of "good".', recommendedTopic: 'Superlatives' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'superlatives', difficulty: 15, stem: 'Mount Everest is the ___ mountain in the world.', optionA: 'higher', optionB: 'most high', optionC: 'highest', optionD: 'more high', correctAnswer: 'C', explanation: 'Short adjectives add -est for superlatives. "High" becomes "highest".', recommendedTopic: 'Superlatives' },

  // A2 — COUNTABLE / UNCOUNTABLE
  { section: 'grammar', cefrLevel: 'A2', topic: 'countable-uncountable', difficulty: 13, stem: 'How ___ milk do we need?', optionA: 'many', optionB: 'much', optionC: 'lot', optionD: 'few', correctAnswer: 'B', explanation: '"Much" is used with uncountable nouns like "milk".', recommendedTopic: 'Much/Many/A Lot of' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'countable-uncountable', difficulty: 14, stem: 'There are ___ apples in the fridge.', optionA: 'much', optionB: 'a lot', optionC: 'a few', optionD: 'a little', correctAnswer: 'C', explanation: '"A few" is used with countable plural nouns.', recommendedTopic: 'A Few / A Little' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'countable-uncountable', difficulty: 15, stem: 'I don\'t have ___ money.', optionA: 'some', optionB: 'any', optionC: 'many', optionD: 'few', correctAnswer: 'B', explanation: '"Any" is used in negative sentences with uncountable nouns.', recommendedTopic: 'Some/Any' },

  // A2 — ADVERBS OF FREQUENCY
  { section: 'grammar', cefrLevel: 'A2', topic: 'adverbs-frequency', difficulty: 12, stem: 'She ___ late for class.', optionA: 'is never', optionB: 'never is', optionC: 'is not never', optionD: 'doesn\'t never', correctAnswer: 'A', explanation: 'Adverbs of frequency go after "be" verbs: She is never late.', recommendedTopic: 'Adverbs of Frequency' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'adverbs-frequency', difficulty: 13, stem: 'He ___ eats breakfast before 7 AM.', optionA: 'usual', optionB: 'usually', optionC: 'every time', optionD: 'all days', correctAnswer: 'B', explanation: '"Usually" is an adverb of frequency placed before the main verb.', recommendedTopic: 'Adverbs of Frequency' },

  // A2 — CONJUNCTIONS
  { section: 'grammar', cefrLevel: 'A2', topic: 'conjunctions', difficulty: 14, stem: 'I like tea ___ I don\'t like coffee.', optionA: 'and', optionB: 'but', optionC: 'so', optionD: 'because', correctAnswer: 'B', explanation: '"But" is used to show contrast between two ideas.', recommendedTopic: 'Conjunctions: and/but/so/because' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'conjunctions', difficulty: 15, stem: 'She was tired ___ she went to bed early.', optionA: 'but', optionB: 'and', optionC: 'so', optionD: 'or', correctAnswer: 'C', explanation: '"So" is used to show result or consequence.', recommendedTopic: 'Conjunctions: and/but/so/because' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'conjunctions', difficulty: 16, stem: 'I stayed home ___ it was raining.', optionA: 'so', optionB: 'but', optionC: 'because', optionD: 'and', correctAnswer: 'C', explanation: '"Because" gives a reason for the action.', recommendedTopic: 'Conjunctions: and/but/so/because' },

  // A2 — PAST SIMPLE (WAS/WERE)
  { section: 'grammar', cefrLevel: 'A2', topic: 'was-were', difficulty: 11, stem: 'I ___ at home yesterday.', optionA: 'was', optionB: 'were', optionC: 'am', optionD: 'be', correctAnswer: 'A', explanation: '"Was" is used with I/he/she/it in the past.', recommendedTopic: 'Was/Were' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'was-were', difficulty: 12, stem: '___ they at the party?', optionA: 'Was', optionB: 'Were', optionC: 'Did', optionD: 'Are', correctAnswer: 'B', explanation: '"Were" is used with you/we/they in the past.', recommendedTopic: 'Was/Were' },

  // ================================================================
  // B1 — PRESENT PERFECT (difficulty 21-30)
  // ================================================================
  { section: 'grammar', cefrLevel: 'B1', topic: 'present-perfect', difficulty: 21, stem: 'I ___ never been to Japan.', optionA: 'have', optionB: 'has', optionC: 'am', optionD: 'did', correctAnswer: 'A', explanation: 'Present perfect: have/has + past participle. "I" takes "have".', recommendedTopic: 'Present Perfect' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'present-perfect', difficulty: 22, stem: 'She ___ just finished her exam.', optionA: 'have', optionB: 'has', optionC: 'is', optionD: 'did', correctAnswer: 'B', explanation: '"She" takes "has" in present perfect.', recommendedTopic: 'Present Perfect' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'present-perfect', difficulty: 23, stem: 'I have lived here ___ 2010.', optionA: 'for', optionB: 'since', optionC: 'from', optionD: 'during', correctAnswer: 'B', explanation: '"Since" is used with a specific point in time.', recommendedTopic: 'Present Perfect: for/since' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'present-perfect', difficulty: 23, stem: 'We have known each other ___ ten years.', optionA: 'since', optionB: 'for', optionC: 'from', optionD: 'during', correctAnswer: 'B', explanation: '"For" is used with a duration of time.', recommendedTopic: 'Present Perfect: for/since' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'present-perfect', difficulty: 25, stem: '___ you ever eaten sushi?', optionA: 'Did', optionB: 'Do', optionC: 'Have', optionD: 'Are', correctAnswer: 'C', explanation: 'Present perfect questions: Have/Has + subject + past participle.', recommendedTopic: 'Present Perfect: Experience' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'present-perfect', difficulty: 26, stem: 'He has ___ gone home.', optionA: 'yet', optionB: 'already', optionC: 'still', optionD: 'never', correctAnswer: 'B', explanation: '"Already" is used in affirmative sentences to mean "before now".', recommendedTopic: 'Present Perfect: already/yet/just' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'present-perfect', difficulty: 27, stem: 'Have you finished ___?', optionA: 'already', optionB: 'just', optionC: 'yet', optionD: 'still', correctAnswer: 'C', explanation: '"Yet" is used at the end of questions and negative sentences.', recommendedTopic: 'Present Perfect: already/yet/just' },

  // B1 — PAST CONTINUOUS
  { section: 'grammar', cefrLevel: 'B1', topic: 'past-continuous', difficulty: 22, stem: 'I ___ TV when the phone rang.', optionA: 'watched', optionB: 'was watching', optionC: 'watch', optionD: 'am watching', correctAnswer: 'B', explanation: 'Past continuous for an ongoing action interrupted by another event.', recommendedTopic: 'Past Continuous' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'past-continuous', difficulty: 23, stem: 'While she ___ dinner, the doorbell rang.', optionA: 'cooked', optionB: 'cooks', optionC: 'was cooking', optionD: 'is cooking', correctAnswer: 'C', explanation: '"While" + past continuous for the longer background action.', recommendedTopic: 'Past Continuous' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'past-continuous', difficulty: 24, stem: 'At 3 PM yesterday, they ___ in the park.', optionA: 'run', optionB: 'ran', optionC: 'were running', optionD: 'are running', correctAnswer: 'C', explanation: 'Past continuous for an action in progress at a specific past time.', recommendedTopic: 'Past Continuous' },

  // B1 — MODALS
  { section: 'grammar', cefrLevel: 'B1', topic: 'modals', subtopic: 'obligation', difficulty: 23, stem: 'You ___ wear a seatbelt. It\'s the law.', optionA: 'should', optionB: 'can', optionC: 'must', optionD: 'might', correctAnswer: 'C', explanation: '"Must" expresses strong obligation, especially for rules and laws.', recommendedTopic: 'Modal Verbs: Obligation' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'modals', subtopic: 'advice', difficulty: 24, stem: 'You ___ see a doctor if you feel ill.', optionA: 'must', optionB: 'should', optionC: 'can', optionD: 'will', correctAnswer: 'B', explanation: '"Should" is used for advice and recommendations.', recommendedTopic: 'Modal Verbs: Advice' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'modals', subtopic: 'possibility', difficulty: 25, stem: 'It ___ rain tomorrow. I\'m not sure.', optionA: 'will', optionB: 'must', optionC: 'might', optionD: 'should', correctAnswer: 'C', explanation: '"Might" expresses possibility when we are uncertain.', recommendedTopic: 'Modal Verbs: Possibility' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'modals', subtopic: 'permission', difficulty: 24, stem: '___ I use your phone, please?', optionA: 'Will', optionB: 'Should', optionC: 'Must', optionD: 'Could', correctAnswer: 'D', explanation: '"Could" is a polite way to ask for permission.', recommendedTopic: 'Modal Verbs: Permission' },

  // B1 — FIRST CONDITIONAL
  { section: 'grammar', cefrLevel: 'B1', topic: 'conditionals', subtopic: 'first conditional', difficulty: 24, stem: 'If it rains, I ___ stay at home.', optionA: 'would', optionB: 'will', optionC: 'am', optionD: 'had', correctAnswer: 'B', explanation: 'First conditional: If + present simple, will + base form.', recommendedTopic: 'First Conditional' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'conditionals', subtopic: 'first conditional', difficulty: 25, stem: 'If you ___ hard, you will pass the exam.', optionA: 'study', optionB: 'will study', optionC: 'studied', optionD: 'would study', correctAnswer: 'A', explanation: 'In first conditional, the if-clause uses present simple.', recommendedTopic: 'First Conditional' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'conditionals', subtopic: 'zero conditional', difficulty: 23, stem: 'If you heat water to 100°C, it ___.', optionA: 'will boil', optionB: 'boils', optionC: 'would boil', optionD: 'boiled', correctAnswer: 'B', explanation: 'Zero conditional: If + present simple, present simple. For facts.', recommendedTopic: 'Zero Conditional' },

  // B1 — PASSIVE VOICE
  { section: 'grammar', cefrLevel: 'B1', topic: 'passive', difficulty: 25, stem: 'English ___ spoken in many countries.', optionA: 'is', optionB: 'are', optionC: 'was', optionD: 'be', correctAnswer: 'A', explanation: 'Present simple passive: is/are + past participle.', recommendedTopic: 'Passive Voice: Present' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'passive', difficulty: 26, stem: 'The Mona Lisa ___ painted by Leonardo da Vinci.', optionA: 'is', optionB: 'was', optionC: 'has', optionD: 'did', correctAnswer: 'B', explanation: 'Past simple passive: was/were + past participle.', recommendedTopic: 'Passive Voice: Past' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'passive', difficulty: 27, stem: 'A new school ___ being built near the park.', optionA: 'is', optionB: 'was', optionC: 'has', optionD: 'will', correctAnswer: 'A', explanation: 'Present continuous passive: is/are + being + past participle.', recommendedTopic: 'Passive Voice: Continuous' },

  // B1 — RELATIVE CLAUSES
  { section: 'grammar', cefrLevel: 'B1', topic: 'relative-clauses', difficulty: 25, stem: 'That\'s the woman ___ lives next door.', optionA: 'which', optionB: 'who', optionC: 'what', optionD: 'whose', correctAnswer: 'B', explanation: '"Who" is used for people in relative clauses.', recommendedTopic: 'Relative Clauses: who/which/that' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'relative-clauses', difficulty: 26, stem: 'I bought the book ___ you recommended.', optionA: 'who', optionB: 'whose', optionC: 'which', optionD: 'where', correctAnswer: 'C', explanation: '"Which" or "that" is used for things in relative clauses.', recommendedTopic: 'Relative Clauses: who/which/that' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'relative-clauses', difficulty: 27, stem: 'She\'s the girl ___ father is a pilot.', optionA: 'who', optionB: 'which', optionC: 'whose', optionD: 'that', correctAnswer: 'C', explanation: '"Whose" shows possession in relative clauses.', recommendedTopic: 'Relative Clauses: whose' },

  // B1 — GERUNDS VS INFINITIVES
  { section: 'grammar', cefrLevel: 'B1', topic: 'gerunds-infinitives', difficulty: 26, stem: 'I enjoy ___ in the rain.', optionA: 'walk', optionB: 'walking', optionC: 'to walk', optionD: 'walked', correctAnswer: 'B', explanation: '"Enjoy" is followed by a gerund (-ing form).', recommendedTopic: 'Gerunds and Infinitives' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'gerunds-infinitives', difficulty: 27, stem: 'She decided ___ a new car.', optionA: 'buying', optionB: 'buy', optionC: 'to buy', optionD: 'bought', correctAnswer: 'C', explanation: '"Decide" is followed by the infinitive (to + verb).', recommendedTopic: 'Gerunds and Infinitives' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'gerunds-infinitives', difficulty: 28, stem: 'He stopped ___ because it was bad for his health.', optionA: 'smoke', optionB: 'smoking', optionC: 'to smoke', optionD: 'smoked', correctAnswer: 'B', explanation: '"Stop + gerund" means to quit the activity.', recommendedTopic: 'Gerunds and Infinitives' },

  // B1 — REPORTED SPEECH BASICS
  { section: 'grammar', cefrLevel: 'B1', topic: 'reported-speech', difficulty: 27, stem: 'She said she ___ tired.', optionA: 'is', optionB: 'was', optionC: 'were', optionD: 'been', correctAnswer: 'B', explanation: 'In reported speech, present "is" changes to past "was".', recommendedTopic: 'Reported Speech' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'reported-speech', difficulty: 28, stem: 'He told me he ___ call later.', optionA: 'will', optionB: 'shall', optionC: 'would', optionD: 'can', correctAnswer: 'C', explanation: 'In reported speech, "will" changes to "would".', recommendedTopic: 'Reported Speech' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'reported-speech', difficulty: 29, stem: 'She asked me where I ___.', optionA: 'live', optionB: 'lived', optionC: 'living', optionD: 'lives', correctAnswer: 'B', explanation: 'In reported questions, the verb shifts one tense back.', recommendedTopic: 'Reported Questions' },

  // ================================================================
  // B2 — SECOND & THIRD CONDITIONAL (difficulty 31-40)
  // ================================================================
  { section: 'grammar', cefrLevel: 'B2', topic: 'conditionals', subtopic: 'second conditional', difficulty: 31, stem: 'If I ___ rich, I would travel the world.', optionA: 'am', optionB: 'was', optionC: 'were', optionD: 'would be', correctAnswer: 'C', explanation: 'Second conditional: If + past simple. "Were" is used for all subjects in formal English.', recommendedTopic: 'Second Conditional' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'conditionals', subtopic: 'second conditional', difficulty: 32, stem: 'If she spoke French, she ___ get the job.', optionA: 'will', optionB: 'would', optionC: 'can', optionD: 'is going to', correctAnswer: 'B', explanation: 'Second conditional result clause: would + base form.', recommendedTopic: 'Second Conditional' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'conditionals', subtopic: 'third conditional', difficulty: 35, stem: 'If I had studied harder, I ___ passed the exam.', optionA: 'will have', optionB: 'would', optionC: 'would have', optionD: 'had', correctAnswer: 'C', explanation: 'Third conditional: If + past perfect, would have + past participle.', recommendedTopic: 'Third Conditional' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'conditionals', subtopic: 'third conditional', difficulty: 36, stem: 'She wouldn\'t have been late if she ___ earlier.', optionA: 'left', optionB: 'had left', optionC: 'would leave', optionD: 'has left', correctAnswer: 'B', explanation: 'Third conditional if-clause uses past perfect (had + past participle).', recommendedTopic: 'Third Conditional' },

  // B2 — PAST PERFECT
  { section: 'grammar', cefrLevel: 'B2', topic: 'past-perfect', difficulty: 31, stem: 'By the time I arrived, the film ___.', optionA: 'started', optionB: 'has started', optionC: 'had started', optionD: 'starts', correctAnswer: 'C', explanation: 'Past perfect shows an action completed before another past event.', recommendedTopic: 'Past Perfect' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'past-perfect', difficulty: 32, stem: 'She ___ never seen snow before she moved to Canada.', optionA: 'has', optionB: 'had', optionC: 'did', optionD: 'was', correctAnswer: 'B', explanation: 'Past perfect: had + past participle for experiences before a past time.', recommendedTopic: 'Past Perfect' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'past-perfect', difficulty: 33, stem: 'After they ___ dinner, they went for a walk.', optionA: 'have', optionB: 'had had', optionC: 'has had', optionD: 'having', correctAnswer: 'B', explanation: '"Had had" is past perfect of "have". The first action uses past perfect.', recommendedTopic: 'Past Perfect' },

  // B2 — ADVANCED PASSIVE
  { section: 'grammar', cefrLevel: 'B2', topic: 'passive', subtopic: 'advanced', difficulty: 33, stem: 'The report ___ by the time I arrived.', optionA: 'has been finished', optionB: 'had been finished', optionC: 'was finishing', optionD: 'is finished', correctAnswer: 'B', explanation: 'Past perfect passive: had been + past participle.', recommendedTopic: 'Passive Voice: Past Perfect' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'passive', subtopic: 'advanced', difficulty: 34, stem: 'The project ___ completed by next Friday.', optionA: 'will be', optionB: 'is', optionC: 'was', optionD: 'has been', correctAnswer: 'A', explanation: 'Future passive: will be + past participle.', recommendedTopic: 'Passive Voice: Future' },

  // B2 — PHRASAL VERBS
  { section: 'grammar', cefrLevel: 'B2', topic: 'phrasal-verbs', difficulty: 33, stem: 'Can you ___ the meeting until Thursday?', optionA: 'put off', optionB: 'put on', optionC: 'put up', optionD: 'put out', correctAnswer: 'A', explanation: '"Put off" means to postpone or delay.', recommendedTopic: 'Phrasal Verbs' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'phrasal-verbs', difficulty: 34, stem: 'I need to ___ this word in the dictionary.', optionA: 'look after', optionB: 'look up', optionC: 'look for', optionD: 'look into', correctAnswer: 'B', explanation: '"Look up" means to search for information in a reference source.', recommendedTopic: 'Phrasal Verbs' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'phrasal-verbs', difficulty: 35, stem: 'She ___ her mother. They look very similar.', optionA: 'takes after', optionB: 'takes off', optionC: 'takes up', optionD: 'takes over', correctAnswer: 'A', explanation: '"Take after" means to resemble a family member.', recommendedTopic: 'Phrasal Verbs' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'phrasal-verbs', difficulty: 36, stem: 'I ___ running last year and now I love it.', optionA: 'took up', optionB: 'took off', optionC: 'took after', optionD: 'took in', correctAnswer: 'A', explanation: '"Take up" means to start a new hobby or activity.', recommendedTopic: 'Phrasal Verbs' },

  // B2 — WISH / IF ONLY
  { section: 'grammar', cefrLevel: 'B2', topic: 'wish-if-only', difficulty: 34, stem: 'I wish I ___ taller.', optionA: 'am', optionB: 'was', optionC: 'were', optionD: 'would be', correctAnswer: 'C', explanation: 'Wish + past simple (were for all subjects) for unreal present situations.', recommendedTopic: 'Wish / If Only' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'wish-if-only', difficulty: 35, stem: 'If only I ___ that email. It caused so many problems.', optionA: 'didn\'t send', optionB: 'haven\'t sent', optionC: 'hadn\'t sent', optionD: 'wouldn\'t send', correctAnswer: 'C', explanation: 'Wish/If only + past perfect for regrets about the past.', recommendedTopic: 'Wish / If Only: Past' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'wish-if-only', difficulty: 36, stem: 'I wish you ___ making that noise. It\'s annoying.', optionA: 'stop', optionB: 'stopped', optionC: 'would stop', optionD: 'will stop', correctAnswer: 'C', explanation: 'Wish + would for complaints about other people\'s behaviour.', recommendedTopic: 'Wish / If Only' },

  // B2 — USED TO / WOULD
  { section: 'grammar', cefrLevel: 'B2', topic: 'used-to', difficulty: 31, stem: 'I ___ live in Paris, but now I live in London.', optionA: 'used to', optionB: 'use to', optionC: 'was used to', optionD: 'am used to', correctAnswer: 'A', explanation: '"Used to" + base verb for past habits or states that are no longer true.', recommendedTopic: 'Used to / Would' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'used-to', difficulty: 33, stem: 'She is ___ waking up early now.', optionA: 'used to', optionB: 'use to', optionC: 'used', optionD: 'using to', correctAnswer: 'A', explanation: '"Be used to" + -ing means to be accustomed to something.', recommendedTopic: 'Be Used to / Get Used to' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'used-to', difficulty: 34, stem: 'When I was a child, we ___ go fishing every summer.', optionA: 'used to', optionB: 'would', optionC: 'were used to', optionD: 'Both A and B', correctAnswer: 'D', explanation: 'Both "used to" and "would" can describe repeated past actions.', recommendedTopic: 'Used to / Would' },

  // B2 — QUANTIFIERS
  { section: 'grammar', cefrLevel: 'B2', topic: 'quantifiers', difficulty: 33, stem: '___ of the students passed the exam. Only three failed.', optionA: 'Most', optionB: 'All', optionC: 'Every', optionD: 'Each', correctAnswer: 'A', explanation: '"Most" means the majority but not all.', recommendedTopic: 'Quantifiers' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'quantifiers', difficulty: 34, stem: 'There is ___ milk left. We need to buy more.', optionA: 'few', optionB: 'a few', optionC: 'little', optionD: 'a little', correctAnswer: 'C', explanation: '"Little" (without "a") means almost none. Used with uncountable nouns.', recommendedTopic: 'Quantifiers: few/little' },

  // B2 — LINKING WORDS
  { section: 'grammar', cefrLevel: 'B2', topic: 'linking-words', difficulty: 35, stem: '___ the rain, we went for a walk.', optionA: 'Although', optionB: 'Despite', optionC: 'However', optionD: 'Because of', correctAnswer: 'B', explanation: '"Despite" + noun/gerund shows contrast.', recommendedTopic: 'Linking Words: despite/although' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'linking-words', difficulty: 36, stem: 'The restaurant was expensive. ___, the food was excellent.', optionA: 'Although', optionB: 'Despite', optionC: 'However', optionD: 'Because', correctAnswer: 'C', explanation: '"However" is used between two sentences to show contrast.', recommendedTopic: 'Linking Words: however/nevertheless' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'linking-words', difficulty: 37, stem: '___ she was tired, she finished the project.', optionA: 'Despite', optionB: 'Although', optionC: 'However', optionD: 'In spite of', correctAnswer: 'B', explanation: '"Although" + subject + verb shows contrast within a sentence.', recommendedTopic: 'Linking Words: despite/although' },

  // B2 — CLEFT SENTENCES
  { section: 'grammar', cefrLevel: 'B2', topic: 'cleft-sentences', difficulty: 38, stem: 'It was John ___ broke the window.', optionA: 'which', optionB: 'what', optionC: 'who', optionD: 'whom', correctAnswer: 'C', explanation: 'Cleft sentence: "It was... who/that..." for emphasis on a person.', recommendedTopic: 'Cleft Sentences' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'cleft-sentences', difficulty: 39, stem: 'What I really need ___ a holiday.', optionA: 'are', optionB: 'is', optionC: 'were', optionD: 'has', correctAnswer: 'B', explanation: '"What" clauses as subject take a singular verb.', recommendedTopic: 'Cleft Sentences' },

  // ================================================================
  // C1 — MIXED CONDITIONALS (difficulty 41-50)
  // ================================================================
  { section: 'grammar', cefrLevel: 'C1', topic: 'conditionals', subtopic: 'mixed conditional', difficulty: 43, stem: 'If I had taken that job, I ___ living in New York now.', optionA: 'will be', optionB: 'would be', optionC: 'would have been', optionD: 'am', correctAnswer: 'B', explanation: 'Mixed conditional: If + past perfect, would + base form (past cause, present result).', recommendedTopic: 'Mixed Conditionals' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'conditionals', subtopic: 'mixed conditional', difficulty: 44, stem: 'If she were more careful, she ___ made that mistake yesterday.', optionA: 'wouldn\'t', optionB: 'won\'t have', optionC: 'wouldn\'t have', optionD: 'hadn\'t', correctAnswer: 'C', explanation: 'Mixed conditional: If + past simple, would have + past participle (present cause, past result).', recommendedTopic: 'Mixed Conditionals' },

  // C1 — INVERSION
  { section: 'grammar', cefrLevel: 'C1', topic: 'inversion', difficulty: 43, stem: 'Never ___ I seen such a beautiful sunset.', optionA: 'did', optionB: 'have', optionC: 'was', optionD: 'had', correctAnswer: 'B', explanation: 'After negative adverbs like "Never", we invert the subject and auxiliary.', recommendedTopic: 'Inversion with Negative Adverbs' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'inversion', difficulty: 44, stem: 'Not only ___ she pass the exam, but she also got the highest mark.', optionA: 'has', optionB: 'was', optionC: 'did', optionD: 'had', correctAnswer: 'C', explanation: '"Not only" triggers inversion: Not only + auxiliary + subject.', recommendedTopic: 'Inversion with Negative Adverbs' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'inversion', difficulty: 45, stem: 'Hardly ___ I arrived when the meeting started.', optionA: 'did', optionB: 'had', optionC: 'have', optionD: 'was', correctAnswer: 'B', explanation: '"Hardly... when" uses past perfect with inversion.', recommendedTopic: 'Inversion with Negative Adverbs' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'inversion', difficulty: 46, stem: 'Seldom ___ people appreciate what they have.', optionA: 'are', optionB: 'do', optionC: 'have', optionD: 'were', correctAnswer: 'B', explanation: '"Seldom" + do/does + subject + base verb in present tense inversion.', recommendedTopic: 'Inversion with Negative Adverbs' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'inversion', difficulty: 47, stem: 'Only after the results were announced ___ he realise his mistake.', optionA: 'has', optionB: 'had', optionC: 'did', optionD: 'was', correctAnswer: 'C', explanation: '"Only after..." triggers inversion in the main clause.', recommendedTopic: 'Inversion: Only if/when/after' },

  // C1 — SUBJUNCTIVE
  { section: 'grammar', cefrLevel: 'C1', topic: 'subjunctive', difficulty: 44, stem: 'The doctor recommended that she ___ more rest.', optionA: 'gets', optionB: 'get', optionC: 'got', optionD: 'getting', correctAnswer: 'B', explanation: 'The subjunctive uses the base form after verbs like recommend, suggest, insist.', recommendedTopic: 'Subjunctive Mood' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'subjunctive', difficulty: 45, stem: 'It is essential that he ___ on time.', optionA: 'arrives', optionB: 'arrive', optionC: 'arrived', optionD: 'arriving', correctAnswer: 'B', explanation: 'Subjunctive: "It is essential/important that + subject + base form".', recommendedTopic: 'Subjunctive Mood' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'subjunctive', difficulty: 46, stem: 'I suggest that the meeting ___ postponed.', optionA: 'is', optionB: 'be', optionC: 'was', optionD: 'will be', correctAnswer: 'B', explanation: 'Subjunctive with "suggest": subject + suggest + that + subject + be.', recommendedTopic: 'Subjunctive Mood' },

  // C1 — ADVANCED MODALS
  { section: 'grammar', cefrLevel: 'C1', topic: 'modals', subtopic: 'deduction past', difficulty: 43, stem: 'She ___ left already. Her car isn\'t here.', optionA: 'must have', optionB: 'can have', optionC: 'should', optionD: 'might', correctAnswer: 'A', explanation: '"Must have + past participle" for strong deductions about the past.', recommendedTopic: 'Modal Verbs: Past Deduction' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'modals', subtopic: 'deduction past', difficulty: 44, stem: 'You ___ studied very hard. Your results are excellent.', optionA: 'should have', optionB: 'must have', optionC: 'could have', optionD: 'would have', correctAnswer: 'B', explanation: '"Must have" expresses a logical conclusion about a past event.', recommendedTopic: 'Modal Verbs: Past Deduction' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'modals', subtopic: 'criticism', difficulty: 45, stem: 'You ___ told me earlier. Now it\'s too late.', optionA: 'must have', optionB: 'can have', optionC: 'should have', optionD: 'would have', correctAnswer: 'C', explanation: '"Should have + past participle" expresses criticism or regret about the past.', recommendedTopic: 'Modal Verbs: should have / could have' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'modals', subtopic: 'possibility past', difficulty: 45, stem: 'He ___ taken the wrong train. Let me call him.', optionA: 'must have', optionB: 'might have', optionC: 'should have', optionD: 'would have', correctAnswer: 'B', explanation: '"Might have + past participle" expresses possibility about a past event.', recommendedTopic: 'Modal Verbs: Past Possibility' },

  // C1 — PARTICIPLE CLAUSES
  { section: 'grammar', cefrLevel: 'C1', topic: 'participle-clauses', difficulty: 44, stem: '___ the door, she walked into the room.', optionA: 'Opened', optionB: 'Opening', optionC: 'To open', optionD: 'Having opened', correctAnswer: 'B', explanation: 'Present participle clause for simultaneous actions.', recommendedTopic: 'Participle Clauses' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'participle-clauses', difficulty: 46, stem: '___ finished the report, she went home.', optionA: 'Have', optionB: 'Had', optionC: 'Having', optionD: 'Has', correctAnswer: 'C', explanation: '"Having + past participle" for a completed action before another.', recommendedTopic: 'Participle Clauses' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'participle-clauses', difficulty: 47, stem: 'The man ___ at the bus stop is my neighbour.', optionA: 'stand', optionB: 'standing', optionC: 'stood', optionD: 'to stand', correctAnswer: 'B', explanation: 'Reduced relative clause using present participle.', recommendedTopic: 'Participle Clauses' },

  // C1 — ELLIPSIS
  { section: 'grammar', cefrLevel: 'C1', topic: 'ellipsis', difficulty: 45, stem: 'I haven\'t been to Paris, but I\'d like ___.', optionA: 'it', optionB: 'to', optionC: 'to go', optionD: 'going', correctAnswer: 'B', explanation: 'We can use "to" alone (ellipsis) when the full infinitive is understood from context.', recommendedTopic: 'Ellipsis and Substitution' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'ellipsis', difficulty: 46, stem: '"Are you coming tonight?" "I hope ___."', optionA: 'it', optionB: 'that', optionC: 'to', optionD: 'so', correctAnswer: 'D', explanation: '"I hope so" is a common ellipsis pattern replacing the whole clause.', recommendedTopic: 'Ellipsis and Substitution' },

  // C1 — ADVANCED REPORTED SPEECH
  { section: 'grammar', cefrLevel: 'C1', topic: 'reported-speech', subtopic: 'advanced', difficulty: 44, stem: 'She denied ___ the window.', optionA: 'break', optionB: 'breaking', optionC: 'to break', optionD: 'broke', correctAnswer: 'B', explanation: '"Deny" is followed by a gerund in reported speech.', recommendedTopic: 'Reporting Verbs' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'reported-speech', subtopic: 'advanced', difficulty: 45, stem: 'He accused me ___ lying.', optionA: 'for', optionB: 'to', optionC: 'of', optionD: 'about', correctAnswer: 'C', explanation: '"Accuse someone of + -ing" is the correct pattern.', recommendedTopic: 'Reporting Verbs' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'reported-speech', subtopic: 'advanced', difficulty: 46, stem: 'She warned us ___ touch the wires.', optionA: 'to not', optionB: 'not to', optionC: 'don\'t', optionD: 'shouldn\'t', correctAnswer: 'B', explanation: '"Warn someone not to do something" is the correct pattern.', recommendedTopic: 'Reporting Verbs' },

  // C1 — FORMAL/INFORMAL REGISTER
  { section: 'grammar', cefrLevel: 'C1', topic: 'register', difficulty: 46, stem: 'Which is more appropriate for a formal letter?', optionA: 'I wanna talk about...', optionB: 'I\'d like to talk about...', optionC: 'I wish to discuss...', optionD: 'I want to say something about...', correctAnswer: 'C', explanation: '"I wish to discuss" is the most formal register.', recommendedTopic: 'Formal vs Informal Register' },

  // ================================================================
  // C2 — NUANCED DISTINCTIONS (difficulty 51-60)
  // ================================================================
  { section: 'grammar', cefrLevel: 'C2', topic: 'tense-nuance', difficulty: 51, stem: 'By this time next year, I ___ here for a decade.', optionA: 'will work', optionB: 'will have been working', optionC: 'will be working', optionD: 'am working', correctAnswer: 'B', explanation: 'Future perfect continuous for duration up to a future point.', recommendedTopic: 'Future Perfect Continuous' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'tense-nuance', difficulty: 52, stem: 'I ___ to tell you, but it slipped my mind.', optionA: 'was meaning', optionB: 'had been meaning', optionC: 'have been meaning', optionD: 'meant', correctAnswer: 'B', explanation: 'Past perfect continuous emphasises the duration of something that was ongoing before another past event.', recommendedTopic: 'Past Perfect Continuous Nuances' },

  // C2 — RARE INVERSIONS
  { section: 'grammar', cefrLevel: 'C2', topic: 'inversion', subtopic: 'rare', difficulty: 53, stem: 'So impressive ___ the performance that the audience gave a standing ovation.', optionA: 'is', optionB: 'was', optionC: 'has been', optionD: 'had been', correctAnswer: 'B', explanation: '"So + adjective + inversion + that" for emphatic statements.', recommendedTopic: 'Advanced Inversion Patterns' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'inversion', subtopic: 'rare', difficulty: 54, stem: 'Under no circumstances ___ this information be shared.', optionA: 'should', optionB: 'does', optionC: 'will', optionD: 'can', correctAnswer: 'A', explanation: '"Under no circumstances" triggers formal inversion with a modal verb.', recommendedTopic: 'Advanced Inversion Patterns' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'inversion', subtopic: 'rare', difficulty: 55, stem: 'Not until the final page ___ the mystery revealed.', optionA: 'is', optionB: 'was', optionC: 'has', optionD: 'did', correctAnswer: 'B', explanation: '"Not until" + clause triggers inversion in the main clause.', recommendedTopic: 'Advanced Inversion Patterns' },

  // C2 — SUBJUNCTIVE IN FIXED EXPRESSIONS
  { section: 'grammar', cefrLevel: 'C2', topic: 'subjunctive', subtopic: 'fixed expressions', difficulty: 53, stem: 'Come what ___, we will finish this project.', optionA: 'might', optionB: 'may', optionC: 'can', optionD: 'will', correctAnswer: 'B', explanation: '"Come what may" is a fixed subjunctive expression meaning "whatever happens".', recommendedTopic: 'Subjunctive in Fixed Expressions' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'subjunctive', subtopic: 'fixed expressions', difficulty: 54, stem: '___ it that she always gets the best results.', optionA: 'How is', optionB: 'Why is', optionC: 'How comes', optionD: 'How come is', correctAnswer: 'A', explanation: '"How is it that..." is used to express surprise or ask for an explanation.', recommendedTopic: 'Advanced Question Forms' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'subjunctive', subtopic: 'fixed expressions', difficulty: 55, stem: 'Be that ___ it may, we still need to find a solution.', optionA: 'how', optionB: 'what', optionC: 'as', optionD: 'which', correctAnswer: 'C', explanation: '"Be that as it may" is a fixed expression meaning "even so".', recommendedTopic: 'Subjunctive in Fixed Expressions' },

  // C2 — ADVANCED COLLOCATIONS
  { section: 'grammar', cefrLevel: 'C2', topic: 'collocations', difficulty: 52, stem: 'The government has taken ___ measures to reduce pollution.', optionA: 'strong', optionB: 'hard', optionC: 'drastic', optionD: 'heavy', correctAnswer: 'C', explanation: '"Take drastic measures" is the correct collocation.', recommendedTopic: 'Advanced Collocations' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'collocations', difficulty: 53, stem: 'She made a ___ recovery after the surgery.', optionA: 'fast', optionB: 'speedy', optionC: 'quick', optionD: 'rapid', correctAnswer: 'B', explanation: '"Make a speedy recovery" is the most common collocation.', recommendedTopic: 'Advanced Collocations' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'collocations', difficulty: 54, stem: 'He bore a striking ___ to his grandfather.', optionA: 'similarity', optionB: 'resemblance', optionC: 'likeness', optionD: 'appearance', correctAnswer: 'B', explanation: '"Bear a striking resemblance to" is the correct collocation.', recommendedTopic: 'Advanced Collocations' },

  // C2 — AMBIGUITY RESOLUTION
  { section: 'grammar', cefrLevel: 'C2', topic: 'ambiguity', difficulty: 55, stem: '"The chicken is ready to eat." This sentence is ambiguous because:', optionA: 'It could mean the chicken is cooked for people to eat, or the chicken (alive) is hungry.', optionB: 'Chicken is uncountable.', optionC: '"Ready" can be an adverb or adjective.', optionD: 'None of the above.', correctAnswer: 'A', explanation: 'This is a classic structural ambiguity: "to eat" can have the chicken as object or subject.', recommendedTopic: 'Ambiguity in English' },

  // C2 — NEAR-SYNONYMS IN CONTEXT
  { section: 'grammar', cefrLevel: 'C2', topic: 'near-synonyms', difficulty: 53, stem: 'The new law will ___ existing regulations.', optionA: 'override', optionB: 'overrule', optionC: 'supersede', optionD: 'surpass', correctAnswer: 'C', explanation: '"Supersede" means to replace something with something newer or better, especially formally.', recommendedTopic: 'Near-Synonyms and Nuance' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'near-synonyms', difficulty: 54, stem: 'After years of tension, the two countries finally ___ their differences.', optionA: 'resolved', optionB: 'solved', optionC: 'settled', optionD: 'fixed', correctAnswer: 'A', explanation: '"Resolve differences" is the correct collocation for conflict resolution.', recommendedTopic: 'Near-Synonyms and Nuance' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'near-synonyms', difficulty: 56, stem: 'The evidence ___ the hypothesis that climate change is accelerating.', optionA: 'confirms', optionB: 'corroborates', optionC: 'verifies', optionD: 'validates', correctAnswer: 'B', explanation: '"Corroborate" means to support with additional evidence, used in academic/scientific contexts.', recommendedTopic: 'Academic Vocabulary' },

  // C2 — DISCOURSE MARKERS
  { section: 'grammar', cefrLevel: 'C2', topic: 'discourse-markers', difficulty: 52, stem: 'The project was a failure. ___, it taught us valuable lessons.', optionA: 'Nevertheless', optionB: 'Moreover', optionC: 'Furthermore', optionD: 'Consequently', correctAnswer: 'A', explanation: '"Nevertheless" concedes the first point while introducing a contrasting positive.', recommendedTopic: 'Discourse Markers' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'discourse-markers', difficulty: 53, stem: 'The data is inconclusive; ___, we cannot draw any firm conclusions.', optionA: 'however', optionB: 'therefore', optionC: 'moreover', optionD: 'nonetheless', correctAnswer: 'B', explanation: '"Therefore" introduces a logical consequence.', recommendedTopic: 'Discourse Markers' },

  // C2 — ADVANCED RELATIVE CLAUSES
  { section: 'grammar', cefrLevel: 'C2', topic: 'relative-clauses', subtopic: 'advanced', difficulty: 54, stem: 'She married Tom, ___ surprised everyone.', optionA: 'that', optionB: 'which', optionC: 'who', optionD: 'what', correctAnswer: 'B', explanation: '"Which" can refer to a whole clause in non-defining relative clauses.', recommendedTopic: 'Non-Defining Relative Clauses' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'relative-clauses', subtopic: 'advanced', difficulty: 55, stem: 'The hotel, the ___ of which I cannot remember, was on a hill.', optionA: 'name', optionB: 'place', optionC: 'location', optionD: 'address', correctAnswer: 'A', explanation: '"The name of which" is a formal non-defining relative clause structure.', recommendedTopic: 'Formal Relative Clauses' },

  // C2 — FRONTING
  { section: 'grammar', cefrLevel: 'C2', topic: 'fronting', difficulty: 55, stem: 'Brilliant ___ it was, it failed to win the award.', optionA: 'as', optionB: 'though', optionC: 'even', optionD: 'Both A and B', correctAnswer: 'D', explanation: 'Both "as" and "though" work in fronted concessive structures.', recommendedTopic: 'Fronting for Emphasis' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'fronting', difficulty: 56, stem: 'Try ___ he might, he could not solve the problem.', optionA: 'as', optionB: 'how', optionC: 'what', optionD: 'though', correctAnswer: 'A', explanation: '"Try as he might" is a fixed expression with fronted adverbial.', recommendedTopic: 'Fronting for Emphasis' },

  // C2 — NOMINAL CLAUSES
  { section: 'grammar', cefrLevel: 'C2', topic: 'nominal-clauses', difficulty: 56, stem: '___ remains to be seen is whether the policy will work.', optionA: 'That', optionB: 'What', optionC: 'Which', optionD: 'It', correctAnswer: 'B', explanation: '"What" introduces a nominal relative clause functioning as the subject.', recommendedTopic: 'Nominal Clauses' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'nominal-clauses', difficulty: 57, stem: 'The fact ___ he lied is unacceptable.', optionA: 'which', optionB: 'what', optionC: 'that', optionD: 'how', correctAnswer: 'C', explanation: '"The fact that..." introduces a noun clause in apposition.', recommendedTopic: 'Nominal Clauses' },

  // ================================================================
  // ADDITIONAL QUESTIONS TO EXPAND POOL
  // ================================================================

  // MORE A1
  { section: 'grammar', cefrLevel: 'A1', topic: 'demonstratives', difficulty: 3, stem: '___ is my friend, Sara.', optionA: 'These', optionB: 'This', optionC: 'Those', optionD: 'Them', correctAnswer: 'B', explanation: '"This" is used for introducing someone near you.', recommendedTopic: 'Demonstratives: this/that/these/those' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'demonstratives', difficulty: 4, stem: '___ shoes are too big for me.', optionA: 'This', optionB: 'That', optionC: 'These', optionD: 'It', correctAnswer: 'C', explanation: '"These" is the plural of "this" for things near you.', recommendedTopic: 'Demonstratives: this/that/these/those' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'have-got', difficulty: 3, stem: 'She ___ got two brothers.', optionA: 'have', optionB: 'has', optionC: 'is', optionD: 'do', correctAnswer: 'B', explanation: 'Third person singular: has got.', recommendedTopic: 'Have/Has Got' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'question-words', difficulty: 3, stem: '___ do you live?', optionA: 'What', optionB: 'Who', optionC: 'Where', optionD: 'When', correctAnswer: 'C', explanation: '"Where" asks about place/location.', recommendedTopic: 'Question Words' },
  { section: 'grammar', cefrLevel: 'A1', topic: 'question-words', difficulty: 4, stem: '___ is your birthday?', optionA: 'What', optionB: 'Who', optionC: 'Where', optionD: 'When', correctAnswer: 'D', explanation: '"When" asks about time.', recommendedTopic: 'Question Words' },

  // MORE A2
  { section: 'grammar', cefrLevel: 'A2', topic: 'will-future', difficulty: 15, stem: 'I think it ___ be sunny tomorrow.', optionA: 'will', optionB: 'is going to', optionC: 'is', optionD: 'does', correctAnswer: 'A', explanation: '"Will" is used for predictions based on opinion (I think...).', recommendedTopic: 'Will for Predictions' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'will-future', difficulty: 16, stem: 'Don\'t worry. I ___ help you.', optionA: 'going to', optionB: 'will', optionC: 'am', optionD: 'do', correctAnswer: 'B', explanation: '"Will" is used for spontaneous decisions made at the moment of speaking.', recommendedTopic: 'Will for Spontaneous Decisions' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'present-simple-vs-continuous', difficulty: 16, stem: 'She ___ to the gym three times a week.', optionA: 'is going', optionB: 'goes', optionC: 'going', optionD: 'go', correctAnswer: 'B', explanation: 'Routines and habits use present simple.', recommendedTopic: 'Present Simple vs Continuous' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'present-simple-vs-continuous', difficulty: 17, stem: 'Right now, he ___ his homework.', optionA: 'does', optionB: 'do', optionC: 'is doing', optionD: 'did', correctAnswer: 'C', explanation: '"Right now" signals an action happening at this moment (present continuous).', recommendedTopic: 'Present Simple vs Continuous' },
  { section: 'grammar', cefrLevel: 'A2', topic: 'object-pronouns', difficulty: 13, stem: 'I saw ___ at the party last night.', optionA: 'they', optionB: 'their', optionC: 'them', optionD: 'theirs', correctAnswer: 'C', explanation: '"Them" is the object pronoun for "they".', recommendedTopic: 'Object Pronouns' },

  // MORE B1
  { section: 'grammar', cefrLevel: 'B1', topic: 'present-perfect-vs-past', difficulty: 26, stem: 'I ___ this film three times.', optionA: 'saw', optionB: 'have seen', optionC: 'see', optionD: 'am seeing', correctAnswer: 'B', explanation: 'Present perfect for experiences without a specific past time.', recommendedTopic: 'Present Perfect vs Past Simple' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'present-perfect-vs-past', difficulty: 27, stem: 'I ___ to Paris last summer.', optionA: 'went', optionB: 'have gone', optionC: 'have been', optionD: 'go', correctAnswer: 'A', explanation: '"Last summer" is a finished time, so we use past simple.', recommendedTopic: 'Present Perfect vs Past Simple' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'too-enough', difficulty: 25, stem: 'This coffee is ___ hot to drink.', optionA: 'enough', optionB: 'too', optionC: 'very', optionD: 'so', correctAnswer: 'B', explanation: '"Too" + adjective means excessively, more than is needed.', recommendedTopic: 'Too / Enough' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'too-enough', difficulty: 26, stem: 'He isn\'t old ___ to drive.', optionA: 'too', optionB: 'very', optionC: 'enough', optionD: 'so', correctAnswer: 'C', explanation: 'Adjective + "enough" means sufficient.', recommendedTopic: 'Too / Enough' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'question-tags', difficulty: 27, stem: 'You like pizza, ___ you?', optionA: 'do', optionB: 'don\'t', optionC: 'aren\'t', optionD: 'are', correctAnswer: 'B', explanation: 'Positive statement gets a negative tag: "don\'t you?"', recommendedTopic: 'Question Tags' },
  { section: 'grammar', cefrLevel: 'B1', topic: 'question-tags', difficulty: 28, stem: 'She can\'t swim, ___ she?', optionA: 'can\'t', optionB: 'doesn\'t', optionC: 'can', optionD: 'does', correctAnswer: 'C', explanation: 'Negative statement gets a positive tag: "can she?"', recommendedTopic: 'Question Tags' },

  // MORE B2
  { section: 'grammar', cefrLevel: 'B2', topic: 'future-perfect', difficulty: 34, stem: 'By next month, I ___ all my exams.', optionA: 'will finish', optionB: 'finish', optionC: 'will have finished', optionD: 'am finishing', correctAnswer: 'C', explanation: 'Future perfect: will have + past participle for completion before a future time.', recommendedTopic: 'Future Perfect' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'future-continuous', difficulty: 33, stem: 'This time tomorrow, I ___ on the beach.', optionA: 'will sit', optionB: 'will be sitting', optionC: 'am sitting', optionD: 'sit', correctAnswer: 'B', explanation: 'Future continuous for an action in progress at a specific future time.', recommendedTopic: 'Future Continuous' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'have-something-done', difficulty: 36, stem: 'I need to get my car ___.', optionA: 'repair', optionB: 'repaired', optionC: 'repairing', optionD: 'to repair', correctAnswer: 'B', explanation: 'Causative: have/get + object + past participle.', recommendedTopic: 'Have Something Done (Causative)' },
  { section: 'grammar', cefrLevel: 'B2', topic: 'have-something-done', difficulty: 37, stem: 'She had her hair ___ yesterday.', optionA: 'cut', optionB: 'cutting', optionC: 'to cut', optionD: 'cuts', correctAnswer: 'A', explanation: 'Have + object + past participle (caused by someone else).', recommendedTopic: 'Have Something Done (Causative)' },

  // MORE C1
  { section: 'grammar', cefrLevel: 'C1', topic: 'cleft-sentences', subtopic: 'advanced', difficulty: 47, stem: 'It was not until midnight ___ the guests finally left.', optionA: 'when', optionB: 'that', optionC: 'which', optionD: 'where', correctAnswer: 'B', explanation: '"It was not until... that..." is a cleft structure for time emphasis.', recommendedTopic: 'Advanced Cleft Sentences' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'emphasis', difficulty: 46, stem: 'What she did ___ resign.', optionA: 'is', optionB: 'was', optionC: 'had', optionD: 'has', correctAnswer: 'B', explanation: '"What + subject + did + was" is an emphatic cleft structure.', recommendedTopic: 'Cleft Sentences for Emphasis' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'future-in-past', difficulty: 45, stem: 'She was about to leave when the phone rang. She ___ to call a taxi.', optionA: 'was going', optionB: 'would', optionC: 'will', optionD: 'is going', correctAnswer: 'A', explanation: '"Was going to" expresses future viewed from a past perspective.', recommendedTopic: 'Future in the Past' },
  { section: 'grammar', cefrLevel: 'C1', topic: 'concession', difficulty: 48, stem: '___ hard he tried, he couldn\'t solve the problem.', optionA: 'Despite', optionB: 'Although', optionC: 'However', optionD: 'No matter', correctAnswer: 'C', explanation: '"However + adjective/adverb" for concessive clauses.', recommendedTopic: 'Concessive Clauses' },

  // MORE C2
  { section: 'grammar', cefrLevel: 'C2', topic: 'hedging', difficulty: 56, stem: 'The results ___ suggest a correlation, but further research is needed.', optionA: 'apparently', optionB: 'would appear to', optionC: 'certainly', optionD: 'obviously', correctAnswer: 'B', explanation: '"Would appear to" is a hedging expression used in academic writing.', recommendedTopic: 'Hedging in Academic English' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'binomials', difficulty: 55, stem: 'The success of the project depends on the ___ of the team.', optionA: 'ins and outs', optionB: 'rough and tumble', optionC: 'give and take', optionD: 'ups and downs', correctAnswer: 'C', explanation: '"Give and take" means compromise and cooperation.', recommendedTopic: 'Binomial Expressions' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'binomials', difficulty: 56, stem: 'She learned the ___ of running a business the hard way.', optionA: 'ins and outs', optionB: 'odds and ends', optionC: 'pros and cons', optionD: 'bits and pieces', correctAnswer: 'A', explanation: '"Ins and outs" means the detailed workings of something.', recommendedTopic: 'Binomial Expressions' },
  { section: 'grammar', cefrLevel: 'C2', topic: 'vague-language', difficulty: 57, stem: 'There were about fifty people, ___.', optionA: 'give or take', optionB: 'more or less', optionC: 'roughly speaking', optionD: 'All of the above', correctAnswer: 'D', explanation: 'All three expressions can be used to indicate approximate numbers.', recommendedTopic: 'Vague Language' },
]

// Total grammar questions: ~180+
// We need to expand this to 800+ total
// The seed API will generate additional variations algorithmically

export const questionTopics = {
  A1: ['articles', 'pronouns', 'present-simple', 'be-verb', 'prepositions', 'there-is-are', 'possessives', 'imperatives', 'word-order', 'plurals', 'can-ability', 'demonstratives', 'have-got', 'question-words'],
  A2: ['past-simple', 'present-continuous', 'future-going-to', 'comparatives', 'superlatives', 'countable-uncountable', 'adverbs-frequency', 'conjunctions', 'was-were', 'will-future', 'present-simple-vs-continuous', 'object-pronouns'],
  B1: ['present-perfect', 'past-continuous', 'modals', 'conditionals', 'passive', 'relative-clauses', 'gerunds-infinitives', 'reported-speech', 'present-perfect-vs-past', 'too-enough', 'question-tags'],
  B2: ['conditionals', 'past-perfect', 'passive', 'phrasal-verbs', 'wish-if-only', 'used-to', 'quantifiers', 'linking-words', 'cleft-sentences', 'future-perfect', 'future-continuous', 'have-something-done'],
  C1: ['conditionals', 'inversion', 'subjunctive', 'modals', 'participle-clauses', 'ellipsis', 'reported-speech', 'register', 'cleft-sentences', 'emphasis', 'future-in-past', 'concession'],
  C2: ['tense-nuance', 'inversion', 'subjunctive', 'collocations', 'ambiguity', 'near-synonyms', 'discourse-markers', 'relative-clauses', 'fronting', 'nominal-clauses', 'hedging', 'binomials', 'vague-language'],
}

export const topicToRecommendedLesson: Record<string, string> = {
  'articles': 'Articles: a/an/the',
  'pronouns': 'Personal and Possessive Pronouns',
  'present-simple': 'Present Simple Tense',
  'be-verb': 'Verb to Be',
  'prepositions': 'Prepositions of Place and Time',
  'there-is-are': 'There is/There are',
  'possessives': 'Possessive Forms',
  'imperatives': 'Giving Instructions',
  'word-order': 'English Word Order',
  'plurals': 'Regular and Irregular Plurals',
  'can-ability': 'Can for Ability and Permission',
  'demonstratives': 'This/That/These/Those',
  'have-got': 'Have and Have Got',
  'question-words': 'Question Words (Wh-questions)',
  'past-simple': 'Past Simple Tense',
  'present-continuous': 'Present Continuous Tense',
  'future-going-to': 'Going to for Future Plans',
  'comparatives': 'Comparative Adjectives',
  'superlatives': 'Superlative Adjectives',
  'countable-uncountable': 'Countable and Uncountable Nouns',
  'adverbs-frequency': 'Adverbs of Frequency',
  'conjunctions': 'Conjunctions',
  'was-were': 'Past Simple of Be',
  'will-future': 'Will for the Future',
  'present-simple-vs-continuous': 'Present Simple vs Continuous',
  'object-pronouns': 'Object Pronouns',
  'present-perfect': 'Present Perfect Tense',
  'past-continuous': 'Past Continuous Tense',
  'modals': 'Modal Verbs',
  'conditionals': 'Conditional Sentences',
  'passive': 'Passive Voice',
  'relative-clauses': 'Relative Clauses',
  'gerunds-infinitives': 'Gerunds and Infinitives',
  'reported-speech': 'Reported Speech',
  'present-perfect-vs-past': 'Present Perfect vs Past Simple',
  'too-enough': 'Too and Enough',
  'question-tags': 'Question Tags',
  'past-perfect': 'Past Perfect Tense',
  'phrasal-verbs': 'Phrasal Verbs',
  'wish-if-only': 'Wish and If Only',
  'used-to': 'Used to, Be Used to, Get Used to',
  'quantifiers': 'Quantifiers',
  'linking-words': 'Linking Words and Connectors',
  'cleft-sentences': 'Cleft Sentences',
  'future-perfect': 'Future Perfect Tense',
  'future-continuous': 'Future Continuous Tense',
  'have-something-done': 'Causative: Have Something Done',
  'inversion': 'Inversion',
  'subjunctive': 'Subjunctive Mood',
  'participle-clauses': 'Participle Clauses',
  'ellipsis': 'Ellipsis and Substitution',
  'register': 'Formal vs Informal Register',
  'emphasis': 'Emphasis Structures',
  'future-in-past': 'Future in the Past',
  'concession': 'Concessive Clauses',
  'tense-nuance': 'Advanced Tense Usage',
  'collocations': 'Advanced Collocations',
  'ambiguity': 'Ambiguity in English',
  'near-synonyms': 'Near-Synonyms and Nuance',
  'discourse-markers': 'Discourse Markers',
  'fronting': 'Fronting for Emphasis',
  'nominal-clauses': 'Nominal Clauses',
  'hedging': 'Hedging in Academic English',
  'binomials': 'Binomial Expressions',
  'vague-language': 'Vague Language',
}

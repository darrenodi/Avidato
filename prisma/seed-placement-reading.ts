// prisma/seed-placement-reading.ts
// Reading comprehension passages and questions for the placement test
// Covers all CEFR levels A1-C2

import type { SeedQuestion } from './seed-placement-questions'

export interface ReadingPassageSeed {
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  title: string
  passage: string
  difficulty: number
}

export const readingPassages: ReadingPassageSeed[] = [
  // A1 READING
  {
    cefrLevel: 'A1', title: 'My Daily Routine', difficulty: 3,
    passage: 'My name is Maria. I am 25 years old. I live in Madrid, Spain. I am a teacher. I wake up at 7 o\'clock every morning. I have breakfast at home. I usually eat toast and drink orange juice. I go to school by bus. My classes start at 9 AM and finish at 3 PM. After work, I go to the gym. In the evening, I cook dinner and watch TV. I go to bed at 11 PM.',
  },
  {
    cefrLevel: 'A1', title: 'The Park', difficulty: 5,
    passage: 'There is a big park near my house. It has many trees and flowers. There is a small lake in the middle of the park. Children play there every afternoon. There are two playgrounds. One is for small children and the other is for older children. My family goes to the park on Sundays. We always have a picnic. My dog Rex loves the park. He runs and plays with other dogs.',
  },

  // A2 READING
  {
    cefrLevel: 'A2', title: 'A Weekend Trip', difficulty: 14,
    passage: 'Last weekend, my friends and I went to the beach. We left on Saturday morning at 8 AM. The drive took about two hours. When we arrived, the weather was beautiful and sunny. We swam in the sea and played volleyball on the sand. For lunch, we ate fish and chips at a restaurant near the beach. In the afternoon, we went for a long walk along the coast. We took many photos. We drove home on Sunday evening. We were tired but happy. It was a wonderful weekend.',
  },
  {
    cefrLevel: 'A2', title: 'My New Apartment', difficulty: 16,
    passage: 'I moved to a new apartment last month. It is on the third floor of a modern building. There are two bedrooms, a living room, a kitchen, and a bathroom. The living room is the biggest room. It has a large window with a beautiful view of the city. The kitchen is small but it has everything I need. There is a supermarket and a bus stop near the building. My neighbours are very friendly. The rent is not cheap, but I am saving money because I don\'t need my car any more. I walk to work in 15 minutes.',
  },

  // B1 READING
  {
    cefrLevel: 'B1', title: 'Working from Home', difficulty: 25,
    passage: 'Since the pandemic, many people have been working from home. This has brought both advantages and disadvantages. On the positive side, workers save time and money because they don\'t need to commute. They can also have a more flexible schedule and spend more time with their families. However, working from home can be lonely, and some people find it difficult to separate their work life from their personal life. Many workers say they miss the social interaction of the office. Companies are now trying to find a balance, with many offering a hybrid model where employees work from home two or three days a week and go to the office for the rest.',
  },
  {
    cefrLevel: 'B1', title: 'The Benefits of Reading', difficulty: 27,
    passage: 'Reading is one of the most beneficial activities you can do for your brain. Studies have shown that people who read regularly have better memory and concentration than those who don\'t. Reading also improves your vocabulary and writing skills, which can help you in both your personal and professional life. Fiction readers, in particular, tend to be more empathetic because they are used to seeing the world from different perspectives. Experts recommend reading for at least 20 minutes a day. It doesn\'t matter whether you prefer books, magazines, or e-readers. The important thing is to make reading a regular habit.',
  },

  // B2 READING
  {
    cefrLevel: 'B2', title: 'The Gig Economy', difficulty: 35,
    passage: 'The gig economy has transformed the way millions of people work. Instead of traditional full-time employment, workers take on short-term contracts or freelance jobs, often through digital platforms. Companies like Uber, Deliveroo, and Fiverr have made it easy for people to offer their services directly to consumers. Supporters argue that the gig economy provides flexibility and autonomy, allowing people to choose when and where they work. Critics, however, point out that gig workers often lack job security, health insurance, and paid holidays. They argue that companies are exploiting workers by classifying them as independent contractors rather than employees. Several countries have started introducing legislation to protect gig workers\' rights, but the debate continues about how best to regulate this rapidly evolving sector of the economy.',
  },
  {
    cefrLevel: 'B2', title: 'Artificial Intelligence in Education', difficulty: 37,
    passage: 'Artificial intelligence is increasingly being used in education, and its impact is likely to grow in the coming years. AI-powered tutoring systems can adapt to individual students\' learning pace and style, providing personalised feedback that would be impossible for a single teacher to offer to every student in a class. Language learning apps use AI to simulate conversations and correct pronunciation errors in real time. However, some educators worry that an over-reliance on technology could undermine the development of critical thinking skills. They argue that learning is fundamentally a social process, and that the relationship between teacher and student is irreplaceable. There are also concerns about data privacy, as these systems collect vast amounts of information about students\' behaviour and performance. The challenge lies in harnessing the benefits of AI while preserving the human elements that make education meaningful.',
  },

  // C1 READING
  {
    cefrLevel: 'C1', title: 'The Psychology of Decision Making', difficulty: 46,
    passage: 'Research in behavioural economics has revealed that human decision-making is far less rational than traditional economic theory would suggest. Daniel Kahneman, who won the Nobel Prize in Economics in 2002, demonstrated that people rely on mental shortcuts, or heuristics, which can lead to systematic errors in judgement. For instance, the availability heuristic causes people to overestimate the likelihood of events that are easily recalled, such as plane crashes, while underestimating more common but less dramatic risks. The anchoring effect shows that initial information disproportionately influences subsequent decisions, even when that information is arbitrary. Perhaps most significantly, Kahneman\'s work on loss aversion revealed that the pain of losing something is psychologically about twice as powerful as the pleasure of gaining something of equivalent value. These findings have profound implications for fields ranging from public policy to marketing, and have led to the emergence of "nudge theory," which seeks to design choice architectures that help people make better decisions without restricting their freedom.',
  },
  {
    cefrLevel: 'C1', title: 'Urban Green Spaces', difficulty: 48,
    passage: 'The relationship between urban green spaces and public health has become an increasingly important area of research. A growing body of evidence suggests that access to parks, gardens, and other natural environments within cities has measurable benefits for both physical and mental health. Studies conducted across multiple countries have found that residents living within 300 metres of green space have significantly lower rates of cardiovascular disease, diabetes, and depression compared to those without such access. The mechanisms underlying these benefits are multifaceted: green spaces encourage physical activity, reduce exposure to air pollution, decrease noise levels, and provide opportunities for social interaction. Furthermore, research in environmental psychology has demonstrated that even brief exposure to natural settings can reduce cortisol levels and improve cognitive function. Despite this evidence, urban green spaces are unequally distributed, with lower-income neighbourhoods typically having less access. This environmental inequality has prompted calls for green space to be treated as essential public infrastructure rather than a luxury amenity.',
  },

  // C2 READING
  {
    cefrLevel: 'C2', title: 'The Paradox of Expertise', difficulty: 55,
    passage: 'The relationship between expertise and decision-making quality is paradoxically more nuanced than one might assume. While it is intuitively appealing to defer to experts, a substantial body of research suggests that expertise can, under certain conditions, actually impair judgement. Philip Tetlock\'s seminal study of political forecasting demonstrated that recognized experts were, on average, no better at predicting geopolitical events than educated laypeople, and in some cases performed worse. This phenomenon can be partly attributed to what has been termed "the curse of knowledge": experts, by virtue of their deep familiarity with a field, may struggle to appreciate how situations appear to those without specialised knowledge, leading to systematic miscalibration of their predictions. Moreover, experts are susceptible to domain-specific cognitive biases; for instance, economists may over-apply market-based frameworks to social problems that resist economic logic. Conversely, in domains characterised by clear feedback loops and well-defined rules, such as chess or weather forecasting, expertise does confer a genuine predictive advantage. The critical distinction appears to lie in the nature of the domain itself: expertise is most valuable in what David Epstein has called "kind" learning environments, where patterns repeat and feedback is immediate, and least reliable in "wicked" environments, where cause and effect are obscure and feedback is delayed or ambiguous.',
  },
  {
    cefrLevel: 'C2', title: 'Linguistic Determinism Revisited', difficulty: 57,
    passage: 'The Sapir-Whorf hypothesis, which posits that the structure of a language fundamentally shapes its speakers\' cognition and worldview, has undergone a remarkable rehabilitation in recent decades. The strong version of the hypothesis, linguistic determinism, which holds that language constrains thought absolutely, fell into disrepute following Chomsky\'s universalist revolution in linguistics. However, a weaker version, linguistic relativity, has found substantial empirical support. Research by Lera Boroditsky and colleagues has demonstrated that speakers of languages with different spatial reference systems (absolute versus relative) navigate physical space differently, while studies of the Pirahã language, which lacks precise number words, suggest that its speakers have difficulty performing exact numerical tasks. The implications extend beyond pure cognition: languages that assign grammatical gender to inanimate objects appear to influence speakers\' associations with those objects, and languages that grammatically distinguish evidentiality compel their speakers to be more precise about the sources of their knowledge. What emerges from this research is not the crude determinism that Whorf may have originally envisioned, but rather a sophisticated understanding of language as one of several interacting cognitive resources that collectively shape, without absolutely constraining, human experience and reasoning.',
  },
]

// READING COMPREHENSION QUESTIONS
// Modelled on FCE / IELTS reading formats:
// - Inference & implication
// - Writer's purpose & attitude
// - Vocabulary in context
// - Main idea / gist
// - Paraphrase & summary
// - Logical deduction
// - Reference resolution

export const readingQuestions: SeedQuestion[] = [
  // ================================================================
  // A1 READING QUESTIONS — My Daily Routine
  // ================================================================
  { section: 'reading', cefrLevel: 'A1', topic: 'reading-comprehension', difficulty: 2,
    stem: '[My Daily Routine] What is the MAIN purpose of this text?',
    optionA: 'To give advice about healthy habits', optionB: 'To describe a typical day', optionC: 'To talk about working in a school', optionD: 'To explain how to use public transport',
    correctAnswer: 'B', explanation: 'The text describes Maria\'s daily activities from morning to night — its main purpose is to describe a typical day.', recommendedTopic: 'Reading Comprehension A1' },
  { section: 'reading', cefrLevel: 'A1', topic: 'reading-comprehension', difficulty: 3,
    stem: '[My Daily Routine] From the text, we can understand that Maria usually spends her evenings ___.',
    optionA: 'going out with friends', optionB: 'at home', optionC: 'at work', optionD: 'at the gym',
    correctAnswer: 'B', explanation: 'Maria cooks dinner and watches TV in the evening — both home activities. This requires combining two pieces of information to infer she stays home.', recommendedTopic: 'Reading Comprehension A1' },
  { section: 'reading', cefrLevel: 'A1', topic: 'reading-comprehension', difficulty: 3,
    stem: '[My Daily Routine] How many hours does Maria work each day?',
    optionA: 'Five hours', optionB: 'Six hours', optionC: 'Seven hours', optionD: 'Eight hours',
    correctAnswer: 'B', explanation: 'Classes start at 9 AM and finish at 3 PM. The student must calculate: 3 PM minus 9 AM = 6 hours. This is not directly stated.', recommendedTopic: 'Reading Comprehension A1' },
  { section: 'reading', cefrLevel: 'A1', topic: 'reading-comprehension', difficulty: 4,
    stem: '[My Daily Routine] Which of the following is TRUE about Maria?',
    optionA: 'She drives to work.', optionB: 'She has an active lifestyle.', optionC: 'She eats lunch at school.', optionD: 'She lives with her family.',
    correctAnswer: 'B', explanation: 'Maria goes to the gym after work — this suggests an active lifestyle. The text doesn\'t mention driving, lunch, or family at home.', recommendedTopic: 'Reading Comprehension A1' },
  { section: 'reading', cefrLevel: 'A1', topic: 'reading-comprehension', difficulty: 4,
    stem: '[My Daily Routine] What can we say about Maria\'s breakfast?',
    optionA: 'It is a large meal.', optionB: 'It is quick and simple.', optionC: 'She eats it at school.', optionD: 'She skips it sometimes.',
    correctAnswer: 'B', explanation: 'Toast and orange juice is a simple, light meal. The word "usually" and the simple items suggest a quick breakfast. This requires inference.', recommendedTopic: 'Reading Comprehension A1' },

  // A1 READING — The Park
  { section: 'reading', cefrLevel: 'A1', topic: 'reading-comprehension', difficulty: 4,
    stem: '[The Park] The park is designed for ___.',
    optionA: 'only small children', optionB: 'only adults', optionC: 'people and animals of all ages', optionD: 'only people with dogs',
    correctAnswer: 'C', explanation: 'There are playgrounds for small and older children, families have picnics, and dogs play there — it serves all ages including pets. Requires synthesising multiple details.', recommendedTopic: 'Reading Comprehension A1' },
  { section: 'reading', cefrLevel: 'A1', topic: 'reading-comprehension', difficulty: 5,
    stem: '[The Park] The word "other" in "the other is for older children" refers to ___.',
    optionA: 'the lake', optionB: 'the second playground', optionC: 'the park', optionD: 'the tree',
    correctAnswer: 'B', explanation: 'Reference question: "One [playground] is for small children and the other [playground] is for older children."', recommendedTopic: 'Reading Comprehension A1' },
  { section: 'reading', cefrLevel: 'A1', topic: 'reading-comprehension', difficulty: 5,
    stem: '[The Park] What can we understand about the writer\'s family?',
    optionA: 'They don\'t enjoy nature.', optionB: 'They visit the park regularly.', optionC: 'They go to the park every day.', optionD: 'They don\'t like animals.',
    correctAnswer: 'B', explanation: '"Always" and "on Sundays" together show it\'s a regular habit, not daily. Requires understanding "on Sundays" ≠ "every day" while "always" = regularly.', recommendedTopic: 'Reading Comprehension A1' },
  { section: 'reading', cefrLevel: 'A1', topic: 'reading-comprehension', difficulty: 5,
    stem: '[The Park] The writer\'s attitude toward the park is ___.',
    optionA: 'negative', optionB: 'neutral', optionC: 'positive', optionD: 'worried',
    correctAnswer: 'C', explanation: 'Words like "big," "loves," "play" create a positive tone. The family chooses to go every week. This tests writer\'s attitude.', recommendedTopic: 'Reading Comprehension A1' },

  // ================================================================
  // A2 READING QUESTIONS — A Weekend Trip
  // ================================================================
  { section: 'reading', cefrLevel: 'A2', topic: 'reading-comprehension', difficulty: 13,
    stem: '[A Weekend Trip] Which sentence best summarises the text?',
    optionA: 'A group of friends had a relaxing trip to the coast.', optionB: 'Some friends went swimming and got sunburned.', optionC: 'The writer went on holiday alone.', optionD: 'A family visited a restaurant by the sea.',
    correctAnswer: 'A', explanation: 'The text describes friends going to the beach, relaxing, and coming home happy. Option A captures the gist without being too specific or adding information.', recommendedTopic: 'Reading Comprehension A2' },
  { section: 'reading', cefrLevel: 'A2', topic: 'reading-comprehension', difficulty: 14,
    stem: '[A Weekend Trip] The phrase "tired but happy" suggests the group ___.',
    optionA: 'didn\'t enjoy the trip', optionB: 'had a full and enjoyable weekend', optionC: 'argued during the trip', optionD: 'slept a lot',
    correctAnswer: 'B', explanation: 'Being "tired but happy" implies they did many enjoyable things — the tiredness came from activities, the happiness from the experience. Tests inference from a phrase.', recommendedTopic: 'Reading Comprehension A2' },
  { section: 'reading', cefrLevel: 'A2', topic: 'reading-comprehension', difficulty: 14,
    stem: '[A Weekend Trip] The trip lasted ___.',
    optionA: 'one day', optionB: 'two days', optionC: 'three days', optionD: 'one week',
    correctAnswer: 'B', explanation: 'They left Saturday morning and drove home Sunday evening. The student must work out the duration from two separate time references.', recommendedTopic: 'Reading Comprehension A2' },
  { section: 'reading', cefrLevel: 'A2', topic: 'reading-comprehension', difficulty: 15,
    stem: '[A Weekend Trip] What does "along the coast" tell us about the walk?',
    optionA: 'It was uphill.', optionB: 'It was beside the sea.', optionC: 'It was in the town centre.', optionD: 'It was through a forest.',
    correctAnswer: 'B', explanation: 'Tests vocabulary in context: "coast" means the edge of the land next to the sea, so walking "along the coast" means beside the sea.', recommendedTopic: 'Reading Comprehension A2' },
  { section: 'reading', cefrLevel: 'A2', topic: 'reading-comprehension', difficulty: 15,
    stem: '[A Weekend Trip] Which of the following is NOT mentioned in the text?',
    optionA: 'Playing a sport on the beach', optionB: 'Having dinner at the beach', optionC: 'Taking photographs', optionD: 'Swimming in the sea',
    correctAnswer: 'B', explanation: 'They ate "lunch" (fish and chips) — dinner is never mentioned. Volleyball, photos, and swimming are all stated. Tests careful reading and negation.', recommendedTopic: 'Reading Comprehension A2' },

  // A2 READING — My New Apartment
  { section: 'reading', cefrLevel: 'A2', topic: 'reading-comprehension', difficulty: 15,
    stem: '[My New Apartment] The writer seems MOST pleased about ___.',
    optionA: 'the size of the kitchen', optionB: 'the view from the living room', optionC: 'the number of bedrooms', optionD: 'the bathroom',
    correctAnswer: 'B', explanation: 'The writer specifically describes the view as "beautiful" — the only strongly positive adjective used about a feature. The kitchen is called "small." Tests writer\'s emphasis.', recommendedTopic: 'Reading Comprehension A2' },
  { section: 'reading', cefrLevel: 'A2', topic: 'reading-comprehension', difficulty: 16,
    stem: '[My New Apartment] The writer saves money because ___.',
    optionA: 'the rent is very cheap', optionB: 'the writer doesn\'t eat out', optionC: 'the writer can walk to work instead of using a car', optionD: 'the supermarket is nearby',
    correctAnswer: 'C', explanation: 'The text says "I am saving money because I don\'t need my car any more. I walk to work." The saving comes from eliminating car costs. Tests cause-effect reasoning.', recommendedTopic: 'Reading Comprehension A2' },
  { section: 'reading', cefrLevel: 'A2', topic: 'reading-comprehension', difficulty: 16,
    stem: '[My New Apartment] What does the writer mean by "it has everything I need"?',
    optionA: 'The kitchen is expensive.', optionB: 'The kitchen is large and modern.', optionC: 'The kitchen is small but well-equipped.', optionD: 'The writer doesn\'t cook much.',
    correctAnswer: 'C', explanation: 'The writer says the kitchen is "small but it has everything I need" — despite its size, it is adequate. Tests understanding of concessive meaning ("but").', recommendedTopic: 'Reading Comprehension A2' },
  { section: 'reading', cefrLevel: 'A2', topic: 'reading-comprehension', difficulty: 17,
    stem: '[My New Apartment] Overall, how does the writer feel about the new apartment?',
    optionA: 'Disappointed', optionB: 'Mostly satisfied', optionC: 'Very unhappy', optionD: 'Unsure',
    correctAnswer: 'B', explanation: 'The writer mentions a "beautiful view," friendly neighbours, and saving money. The only negative is the rent and small kitchen. Overall tone is positive with minor reservations.', recommendedTopic: 'Reading Comprehension A2' },

  // ================================================================
  // B1 READING QUESTIONS — Working from Home
  // ================================================================
  { section: 'reading', cefrLevel: 'B1', topic: 'reading-comprehension', difficulty: 24,
    stem: '[Working from Home] What is the writer\'s purpose in this text?',
    optionA: 'To persuade companies to allow remote work', optionB: 'To present both sides of the remote work debate', optionC: 'To criticise employees who work from home', optionD: 'To explain how to set up a home office',
    correctAnswer: 'B', explanation: 'The text presents advantages ("positive side") and disadvantages ("However…lonely"), then describes the hybrid compromise. It\'s balanced, not persuasive.', recommendedTopic: 'Reading Comprehension B1' },
  { section: 'reading', cefrLevel: 'B1', topic: 'reading-comprehension', difficulty: 25,
    stem: '[Working from Home] The text suggests that the biggest challenge of remote work is ___.',
    optionA: 'learning new technology', optionB: 'the difficulty of maintaining work-life boundaries', optionC: 'lower productivity', optionD: 'finding a quiet space',
    correctAnswer: 'B', explanation: 'The passage says "some people find it difficult to separate their work life from their personal life." This is presented as a key difficulty. Tests inference about emphasis.', recommendedTopic: 'Reading Comprehension B1' },
  { section: 'reading', cefrLevel: 'B1', topic: 'reading-comprehension', difficulty: 26,
    stem: '[Working from Home] The word "hybrid" in "hybrid model" is closest in meaning to ___.',
    optionA: 'modern', optionB: 'flexible', optionC: 'combined', optionD: 'temporary',
    correctAnswer: 'C', explanation: 'A hybrid model combines home and office work. "Hybrid" means a mixture of two things. Tests vocabulary in context.', recommendedTopic: 'Reading Comprehension B1' },
  { section: 'reading', cefrLevel: 'B1', topic: 'reading-comprehension', difficulty: 27,
    stem: '[Working from Home] What can we infer about the future of work from this text?',
    optionA: 'Everyone will work from home permanently.', optionB: 'Offices will completely disappear.', optionC: 'A mix of home and office work is likely to continue.', optionD: 'Companies will ban remote work.',
    correctAnswer: 'C', explanation: 'The text ends by saying companies are "trying to find a balance" with hybrid models — suggesting this mixed approach is the direction. Tests inference about future trends.', recommendedTopic: 'Reading Comprehension B1' },

  // B1 READING — The Benefits of Reading
  { section: 'reading', cefrLevel: 'B1', topic: 'reading-comprehension', difficulty: 26,
    stem: '[Benefits of Reading] According to the text, reading fiction makes people more empathetic because it ___.',
    optionA: 'teaches them facts about other cultures', optionB: 'helps them practise imagining others\' experiences', optionC: 'makes them more intelligent overall', optionD: 'requires them to read slowly',
    correctAnswer: 'B', explanation: 'The text says fiction readers "are used to seeing the world from different perspectives." This is paraphrased as imagining others\' experiences — it\'s not about intelligence or cultural facts.', recommendedTopic: 'Reading Comprehension B1' },
  { section: 'reading', cefrLevel: 'B1', topic: 'reading-comprehension', difficulty: 27,
    stem: '[Benefits of Reading] What does the writer imply by saying "It doesn\'t matter whether you prefer books, magazines, or e-readers"?',
    optionA: 'E-readers are better than books.', optionB: 'The format is less important than the habit itself.', optionC: 'Magazines are not real reading.', optionD: 'Only novels provide benefits.',
    correctAnswer: 'B', explanation: 'The writer follows this with "The important thing is to make reading a regular habit" — the message is that consistency matters more than format. Tests implied meaning.', recommendedTopic: 'Reading Comprehension B1' },
  { section: 'reading', cefrLevel: 'B1', topic: 'reading-comprehension', difficulty: 28,
    stem: '[Benefits of Reading] The text is MAINLY intended to ___.',
    optionA: 'share research findings and encourage reading', optionB: 'compare different types of books', optionC: 'teach people how to read faster', optionD: 'criticise people who don\'t read',
    correctAnswer: 'A', explanation: 'The text cites studies, lists benefits, then gives a recommendation (20 minutes daily). It informs and encourages, not compares or criticises. Tests main idea/purpose.', recommendedTopic: 'Reading Comprehension B1' },

  // ================================================================
  // B2 READING QUESTIONS — The Gig Economy (FCE Part 5 style)
  // ================================================================
  { section: 'reading', cefrLevel: 'B2', topic: 'reading-comprehension', difficulty: 34,
    stem: '[The Gig Economy] The writer presents the gig economy as ___.',
    optionA: 'entirely positive for workers', optionB: 'a controversial development with both benefits and risks', optionC: 'a temporary trend that will disappear', optionD: 'something that only benefits companies',
    correctAnswer: 'B', explanation: 'The text uses "Supporters argue…" and "Critics, however, point out…" — a classic balanced structure presenting both sides of a debate. Tests writer\'s stance.', recommendedTopic: 'Reading Comprehension B2' },
  { section: 'reading', cefrLevel: 'B2', topic: 'reading-comprehension', difficulty: 35,
    stem: '[The Gig Economy] The word "exploiting" in the context of this passage is closest in meaning to ___.',
    optionA: 'helping', optionB: 'training', optionC: 'taking unfair advantage of', optionD: 'employing',
    correctAnswer: 'C', explanation: 'In context, critics say companies are "exploiting workers by classifying them as independent contractors" — the negative context and the word "rather than employees" shows unfair treatment. Tests vocabulary in context.', recommendedTopic: 'Reading Comprehension B2' },
  { section: 'reading', cefrLevel: 'B2', topic: 'reading-comprehension', difficulty: 36,
    stem: '[The Gig Economy] Why do companies classify gig workers as independent contractors, according to the text?',
    optionA: 'Workers prefer this classification.', optionB: 'It is required by law.', optionC: 'It allows companies to avoid providing employment benefits.', optionD: 'It helps workers pay less tax.',
    correctAnswer: 'C', explanation: 'The text implies this by saying workers "lack job security, health insurance, and paid holidays" as a result of being classified as contractors. The reason must be inferred — it\'s not stated directly.', recommendedTopic: 'Reading Comprehension B2' },
  { section: 'reading', cefrLevel: 'B2', topic: 'reading-comprehension', difficulty: 37,
    stem: '[The Gig Economy] The phrase "rapidly evolving sector" suggests that ___.',
    optionA: 'the gig economy is declining', optionB: 'regulation is keeping pace with changes', optionC: 'the industry is changing faster than rules can be made', optionD: 'workers are satisfied with current laws',
    correctAnswer: 'C', explanation: 'The "debate continues about how best to regulate this rapidly evolving sector" — the implication is that change outpaces regulation. Tests inference from a phrase.', recommendedTopic: 'Reading Comprehension B2' },

  // B2 READING — AI in Education (FCE Part 6 style)
  { section: 'reading', cefrLevel: 'B2', topic: 'reading-comprehension', difficulty: 36,
    stem: '[AI in Education] What does the phrase "personalised feedback" imply about traditional classrooms?',
    optionA: 'Teachers give too much feedback.', optionB: 'Individual attention for every student is difficult for one teacher.', optionC: 'Students don\'t want feedback.', optionD: 'Teachers use AI already.',
    correctAnswer: 'B', explanation: 'The text says AI provides "personalised feedback that would be impossible for a single teacher to offer to every student" — this implies traditional classrooms can\'t achieve this. Tests inference by contrast.', recommendedTopic: 'Reading Comprehension B2' },
  { section: 'reading', cefrLevel: 'B2', topic: 'reading-comprehension', difficulty: 37,
    stem: '[AI in Education] The educators who are worried believe that ___.',
    optionA: 'AI is too expensive for schools', optionB: 'students learn best through human interaction and independent thinking', optionC: 'AI will replace all teachers within five years', optionD: 'technology always produces better results',
    correctAnswer: 'B', explanation: 'They argue learning is "fundamentally a social process" and worry about critical thinking. This combines two concerns into one understanding. Tests paraphrase and synthesis.', recommendedTopic: 'Reading Comprehension B2' },
  { section: 'reading', cefrLevel: 'B2', topic: 'reading-comprehension', difficulty: 38,
    stem: '[AI in Education] The writer\'s overall position on AI in education is ___.',
    optionA: 'strongly in favour', optionB: 'strongly against', optionC: 'cautiously balanced', optionD: 'completely neutral with no opinion',
    correctAnswer: 'C', explanation: 'The writer presents benefits then concerns, ending with "The challenge lies in harnessing the benefits…while preserving the human elements." This shows cautious balance — acknowledging both sides.', recommendedTopic: 'Reading Comprehension B2' },

  // ================================================================
  // C1 READING QUESTIONS — Psychology of Decision Making (CAE style)
  // ================================================================
  { section: 'reading', cefrLevel: 'C1', topic: 'reading-comprehension', difficulty: 45,
    stem: '[Decision Making] The writer mentions plane crashes in order to ___.',
    optionA: 'argue that air travel is dangerous', optionB: 'illustrate how mental shortcuts distort risk assessment', optionC: 'suggest people should fear flying', optionD: 'compare air and road safety statistics',
    correctAnswer: 'B', explanation: 'Plane crashes are used as an example of the availability heuristic — events that are "easily recalled" lead to overestimated risk. The writer uses this to illustrate the concept, not comment on aviation safety.', recommendedTopic: 'Reading Comprehension C1' },
  { section: 'reading', cefrLevel: 'C1', topic: 'reading-comprehension', difficulty: 46,
    stem: '[Decision Making] What does the word "arbitrary" mean as used in the description of the anchoring effect?',
    optionA: 'Carefully chosen', optionB: 'Statistically significant', optionC: 'Random or without logical basis', optionD: 'Well-researched',
    correctAnswer: 'C', explanation: 'The anchoring effect works "even when that information is arbitrary" — meaning the initial anchor needn\'t be meaningful. The word contrasts with the assumption that information should be relevant.', recommendedTopic: 'Reading Comprehension C1' },
  { section: 'reading', cefrLevel: 'C1', topic: 'reading-comprehension', difficulty: 47,
    stem: '[Decision Making] Which statement best captures the significance of loss aversion?',
    optionA: 'People are equally affected by gains and losses.', optionB: 'People\'s emotional response to loss is disproportionately stronger than to gain.', optionC: 'People make better decisions about losses.', optionD: 'People always avoid risky investments.',
    correctAnswer: 'B', explanation: 'The text says the "pain of losing something is psychologically about twice as powerful as the pleasure of gaining something of equivalent value." The key insight is disproportionality. Tests precise comprehension and paraphrase.', recommendedTopic: 'Reading Comprehension C1' },
  { section: 'reading', cefrLevel: 'C1', topic: 'reading-comprehension', difficulty: 48,
    stem: '[Decision Making] "Nudge theory" is described as distinctive because it ___.',
    optionA: 'forces people to make optimal choices', optionB: 'removes choices to simplify decisions', optionC: 'influences behaviour while maintaining freedom of choice', optionD: 'only works in economic contexts',
    correctAnswer: 'C', explanation: 'It "help[s] people make better decisions without restricting their freedom." The key distinction is the combination of influence and preserved autonomy. Tests nuanced comprehension.', recommendedTopic: 'Reading Comprehension C1' },

  // C1 READING — Urban Green Spaces (CAE Part 5 / IELTS style)
  { section: 'reading', cefrLevel: 'C1', topic: 'reading-comprehension', difficulty: 46,
    stem: '[Urban Green Spaces] The word "multifaceted" in "the mechanisms underlying these benefits are multifaceted" is closest in meaning to ___.',
    optionA: 'uncertain', optionB: 'simple and direct', optionC: 'involving several different aspects', optionD: 'mainly physical',
    correctAnswer: 'C', explanation: 'The text then lists four different mechanisms (activity, pollution, noise, social). "Multifaceted" = having many facets/aspects. Tests vocabulary in context with supporting evidence.', recommendedTopic: 'Reading Comprehension C1' },
  { section: 'reading', cefrLevel: 'C1', topic: 'reading-comprehension', difficulty: 47,
    stem: '[Urban Green Spaces] The research described suggests that the health benefits of green spaces are ___.',
    optionA: 'mainly psychological', optionB: 'limited to people who exercise outdoors', optionC: 'both physical and mental, operating through multiple pathways', optionD: 'exaggerated by researchers',
    correctAnswer: 'C', explanation: 'The text mentions cardiovascular disease, diabetes (physical), depression, cortisol, cognition (mental), plus exercise, air quality, noise, and social interaction (multiple pathways). Tests synthesis of information across the passage.', recommendedTopic: 'Reading Comprehension C1' },
  { section: 'reading', cefrLevel: 'C1', topic: 'reading-comprehension', difficulty: 48,
    stem: '[Urban Green Spaces] Why does the writer describe the unequal distribution of green spaces as "environmental inequality"?',
    optionA: 'Because richer areas pollute more', optionB: 'Because access to a health-promoting resource varies by income', optionC: 'Because parks cost money to enter', optionD: 'Because lower-income areas have more crime',
    correctAnswer: 'B', explanation: 'Having established that green spaces provide measurable health benefits, the writer shows that lower-income areas have less access — creating inequality in a health resource. Tests logical chain across paragraphs.', recommendedTopic: 'Reading Comprehension C1' },
  { section: 'reading', cefrLevel: 'C1', topic: 'reading-comprehension', difficulty: 49,
    stem: '[Urban Green Spaces] The call to treat green space as "essential public infrastructure" implies it should be ___.',
    optionA: 'privately funded and managed', optionB: 'provided and maintained by government as a basic service', optionC: 'available only in wealthy areas', optionD: 'replaced by indoor recreation',
    correctAnswer: 'B', explanation: 'Public infrastructure (roads, water, electricity) is government-provided and considered essential. Comparing green space to this implies it should have the same status — publicly funded and universally available.', recommendedTopic: 'Reading Comprehension C1' },

  // ================================================================
  // C2 READING QUESTIONS — The Paradox of Expertise (CPE / IELTS Academic style)
  // ================================================================
  { section: 'reading', cefrLevel: 'C2', topic: 'reading-comprehension', difficulty: 54,
    stem: '[Paradox of Expertise] The writer\'s main argument is that expertise ___.',
    optionA: 'is always beneficial regardless of context', optionB: 'is worthless in all domains', optionC: 'has value that depends on the characteristics of the field', optionD: 'should be replaced by AI prediction',
    correctAnswer: 'C', explanation: 'The text\'s central thesis is the distinction between "kind" and "wicked" environments — expertise helps in one but not the other. The value is domain-dependent. Tests identifying the overarching argument.', recommendedTopic: 'Reading Comprehension C2' },
  { section: 'reading', cefrLevel: 'C2', topic: 'reading-comprehension', difficulty: 55,
    stem: '[Paradox of Expertise] The "curse of knowledge" is paradoxical because ___.',
    optionA: 'experts refuse to share knowledge', optionB: 'the very depth of an expert\'s understanding becomes a source of error', optionC: 'experts are paid too much', optionD: 'non-experts have access to the same information',
    correctAnswer: 'B', explanation: 'The paradox is that deep knowledge — normally an asset — leads to "systematic miscalibration" because experts lose perspective on how non-experts see things. The advantage becomes a disadvantage.', recommendedTopic: 'Reading Comprehension C2' },
  { section: 'reading', cefrLevel: 'C2', topic: 'reading-comprehension', difficulty: 56,
    stem: '[Paradox of Expertise] What does the writer mean by a "wicked" learning environment?',
    optionA: 'An environment with dishonest participants', optionB: 'One where patterns are unclear and feedback is delayed or misleading', optionC: 'A morally challenging situation', optionD: 'An extremely competitive professional field',
    correctAnswer: 'B', explanation: '"Wicked" environments are defined as where "cause and effect are obscure and feedback is delayed or ambiguous." The term is technical, not moral. Tests precise vocabulary comprehension in academic context.', recommendedTopic: 'Reading Comprehension C2' },
  { section: 'reading', cefrLevel: 'C2', topic: 'reading-comprehension', difficulty: 57,
    stem: '[Paradox of Expertise] The example of economists over-applying market frameworks serves to illustrate ___.',
    optionA: 'that economics is an unreliable field', optionB: 'how domain-specific thinking can become a cognitive bias', optionC: 'that social problems are simple', optionD: 'that all experts share the same biases',
    correctAnswer: 'B', explanation: 'The example shows experts applying their own field\'s logic inappropriately to other domains — their specialised lens becomes a bias. It\'s one instance of a broader pattern, not a comment on economics per se.', recommendedTopic: 'Reading Comprehension C2' },

  // C2 READING — Linguistic Determinism (CPE / IELTS Academic style)
  { section: 'reading', cefrLevel: 'C2', topic: 'reading-comprehension', difficulty: 55,
    stem: '[Linguistic Determinism] The text describes the Sapir-Whorf hypothesis as having undergone a "remarkable rehabilitation" because ___.',
    optionA: 'Chomsky endorsed it', optionB: 'the strong version was proven correct', optionC: 'new empirical evidence has supported a modified version of the theory', optionD: 'linguists lost interest in universal grammar',
    correctAnswer: 'C', explanation: 'The strong version was rejected, but "a weaker version, linguistic relativity, has found substantial empirical support" through studies by Boroditsky and others. The theory was revived in modified form.', recommendedTopic: 'Reading Comprehension C2' },
  { section: 'reading', cefrLevel: 'C2', topic: 'reading-comprehension', difficulty: 56,
    stem: '[Linguistic Determinism] The Pirahã language example is used to demonstrate that ___.',
    optionA: 'some languages are more primitive than others', optionB: 'the absence of certain linguistic structures may limit specific cognitive abilities', optionC: 'the Pirahã people are unintelligent', optionD: 'number words are unnecessary',
    correctAnswer: 'B', explanation: 'The Pirahã "lack precise number words" and have "difficulty performing exact numerical tasks." This supports linguistic relativity — the absence of linguistic tools corresponds to cognitive limitations in that domain.', recommendedTopic: 'Reading Comprehension C2' },
  { section: 'reading', cefrLevel: 'C2', topic: 'reading-comprehension', difficulty: 57,
    stem: '[Linguistic Determinism] The writer\'s conclusion about language and thought is that ___.',
    optionA: 'language completely controls how we think', optionB: 'language has no effect on cognition', optionC: 'language influences but does not absolutely determine thought', optionD: 'only grammatical gender affects cognition',
    correctAnswer: 'C', explanation: 'The final sentence describes "language as one of several interacting cognitive resources that collectively shape, without absolutely constraining, human experience." This is the nuanced middle position.', recommendedTopic: 'Reading Comprehension C2' },
  { section: 'reading', cefrLevel: 'C2', topic: 'reading-comprehension', difficulty: 58,
    stem: '[Linguistic Determinism] The term "evidentiality" in the text refers to ___.',
    optionA: 'the ability to present evidence in court', optionB: 'grammatical marking of the source or reliability of information', optionC: 'a type of scientific methodology', optionD: 'evidence-based language teaching',
    correctAnswer: 'B', explanation: 'The text says languages that "grammatically distinguish evidentiality compel their speakers to be more precise about the sources of their knowledge." The grammatical context and the phrase "sources of knowledge" clarify the meaning.', recommendedTopic: 'Reading Comprehension C2' },
]

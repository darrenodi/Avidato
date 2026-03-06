-- ============================================================
-- Placement Test Seed Data for Production
-- Generated from TypeScript seed files
-- ============================================================

-- Run this inside a transaction for safety
BEGIN;

-- ============================================================
-- READING PASSAGES (12 total)
-- ============================================================

INSERT INTO "ReadingPassage" ("id", "cefrLevel", "title", "content", "wordCount", "source", "createdAt")
VALUES (gen_random_uuid()::text, 'A1', 'My Daily Routine', 'My name is Maria. I am 25 years old. I live in Madrid, Spain. I am a teacher. I wake up at 7 o''clock every morning. I have breakfast at home. I usually eat toast and drink orange juice. I go to school by bus. My classes start at 9 AM and finish at 3 PM. After work, I go to the gym. In the evening, I cook dinner and watch TV. I go to bed at 11 PM.', 79, 'Original', CURRENT_TIMESTAMP);

INSERT INTO "ReadingPassage" ("id", "cefrLevel", "title", "content", "wordCount", "source", "createdAt")
VALUES (gen_random_uuid()::text, 'A1', 'The Park', 'There is a big park near my house. It has many trees and flowers. There is a small lake in the middle of the park. Children play there every afternoon. There are two playgrounds. One is for small children and the other is for older children. My family goes to the park on Sundays. We always have a picnic. My dog Rex loves the park. He runs and plays with other dogs.', 72, 'Original', CURRENT_TIMESTAMP);

INSERT INTO "ReadingPassage" ("id", "cefrLevel", "title", "content", "wordCount", "source", "createdAt")
VALUES (gen_random_uuid()::text, 'A2', 'A Weekend Trip', 'Last weekend, my friends and I went to the beach. We left on Saturday morning at 8 AM. The drive took about two hours. When we arrived, the weather was beautiful and sunny. We swam in the sea and played volleyball on the sand. For lunch, we ate fish and chips at a restaurant near the beach. In the afternoon, we went for a long walk along the coast. We took many photos. We drove home on Sunday evening. We were tired but happy. It was a wonderful weekend.', 89, 'Original', CURRENT_TIMESTAMP);

INSERT INTO "ReadingPassage" ("id", "cefrLevel", "title", "content", "wordCount", "source", "createdAt")
VALUES (gen_random_uuid()::text, 'A2', 'My New Apartment', 'I moved to a new apartment last month. It is on the third floor of a modern building. There are two bedrooms, a living room, a kitchen, and a bathroom. The living room is the biggest room. It has a large window with a beautiful view of the city. The kitchen is small but it has everything I need. There is a supermarket and a bus stop near the building. My neighbours are very friendly. The rent is not cheap, but I am saving money because I don''t need my car any more. I walk to work in 15 minutes.', 100, 'Original', CURRENT_TIMESTAMP);

INSERT INTO "ReadingPassage" ("id", "cefrLevel", "title", "content", "wordCount", "source", "createdAt")
VALUES (gen_random_uuid()::text, 'B1', 'Working from Home', 'Since the pandemic, many people have been working from home. This has brought both advantages and disadvantages. On the positive side, workers save time and money because they don''t need to commute. They can also have a more flexible schedule and spend more time with their families. However, working from home can be lonely, and some people find it difficult to separate their work life from their personal life. Many workers say they miss the social interaction of the office. Companies are now trying to find a balance, with many offering a hybrid model where employees work from home two or three days a week and go to the office for the rest.', 113, 'Original', CURRENT_TIMESTAMP);

INSERT INTO "ReadingPassage" ("id", "cefrLevel", "title", "content", "wordCount", "source", "createdAt")
VALUES (gen_random_uuid()::text, 'B1', 'The Benefits of Reading', 'Reading is one of the most beneficial activities you can do for your brain. Studies have shown that people who read regularly have better memory and concentration than those who don''t. Reading also improves your vocabulary and writing skills, which can help you in both your personal and professional life. Fiction readers, in particular, tend to be more empathetic because they are used to seeing the world from different perspectives. Experts recommend reading for at least 20 minutes a day. It doesn''t matter whether you prefer books, magazines, or e-readers. The important thing is to make reading a regular habit.', 100, 'Original', CURRENT_TIMESTAMP);

INSERT INTO "ReadingPassage" ("id", "cefrLevel", "title", "content", "wordCount", "source", "createdAt")
VALUES (gen_random_uuid()::text, 'B2', 'The Gig Economy', 'The gig economy has transformed the way millions of people work. Instead of traditional full-time employment, workers take on short-term contracts or freelance jobs, often through digital platforms. Companies like Uber, Deliveroo, and Fiverr have made it easy for people to offer their services directly to consumers. Supporters argue that the gig economy provides flexibility and autonomy, allowing people to choose when and where they work. Critics, however, point out that gig workers often lack job security, health insurance, and paid holidays. They argue that companies are exploiting workers by classifying them as independent contractors rather than employees. Several countries have started introducing legislation to protect gig workers'' rights, but the debate continues about how best to regulate this rapidly evolving sector of the economy.', 125, 'Original', CURRENT_TIMESTAMP);

INSERT INTO "ReadingPassage" ("id", "cefrLevel", "title", "content", "wordCount", "source", "createdAt")
VALUES (gen_random_uuid()::text, 'B2', 'Artificial Intelligence in Education', 'Artificial intelligence is increasingly being used in education, and its impact is likely to grow in the coming years. AI-powered tutoring systems can adapt to individual students'' learning pace and style, providing personalised feedback that would be impossible for a single teacher to offer to every student in a class. Language learning apps use AI to simulate conversations and correct pronunciation errors in real time. However, some educators worry that an over-reliance on technology could undermine the development of critical thinking skills. They argue that learning is fundamentally a social process, and that the relationship between teacher and student is irreplaceable. There are also concerns about data privacy, as these systems collect vast amounts of information about students'' behaviour and performance. The challenge lies in harnessing the benefits of AI while preserving the human elements that make education meaningful.', 139, 'Original', CURRENT_TIMESTAMP);

INSERT INTO "ReadingPassage" ("id", "cefrLevel", "title", "content", "wordCount", "source", "createdAt")
VALUES (gen_random_uuid()::text, 'C1', 'The Psychology of Decision Making', 'Research in behavioural economics has revealed that human decision-making is far less rational than traditional economic theory would suggest. Daniel Kahneman, who won the Nobel Prize in Economics in 2002, demonstrated that people rely on mental shortcuts, or heuristics, which can lead to systematic errors in judgement. For instance, the availability heuristic causes people to overestimate the likelihood of events that are easily recalled, such as plane crashes, while underestimating more common but less dramatic risks. The anchoring effect shows that initial information disproportionately influences subsequent decisions, even when that information is arbitrary. Perhaps most significantly, Kahneman''s work on loss aversion revealed that the pain of losing something is psychologically about twice as powerful as the pleasure of gaining something of equivalent value. These findings have profound implications for fields ranging from public policy to marketing, and have led to the emergence of "nudge theory," which seeks to design choice architectures that help people make better decisions without restricting their freedom.', 161, 'Original', CURRENT_TIMESTAMP);

INSERT INTO "ReadingPassage" ("id", "cefrLevel", "title", "content", "wordCount", "source", "createdAt")
VALUES (gen_random_uuid()::text, 'C1', 'Urban Green Spaces', 'The relationship between urban green spaces and public health has become an increasingly important area of research. A growing body of evidence suggests that access to parks, gardens, and other natural environments within cities has measurable benefits for both physical and mental health. Studies conducted across multiple countries have found that residents living within 300 metres of green space have significantly lower rates of cardiovascular disease, diabetes, and depression compared to those without such access. The mechanisms underlying these benefits are multifaceted: green spaces encourage physical activity, reduce exposure to air pollution, decrease noise levels, and provide opportunities for social interaction. Furthermore, research in environmental psychology has demonstrated that even brief exposure to natural settings can reduce cortisol levels and improve cognitive function. Despite this evidence, urban green spaces are unequally distributed, with lower-income neighbourhoods typically having less access. This environmental inequality has prompted calls for green space to be treated as essential public infrastructure rather than a luxury amenity.', 160, 'Original', CURRENT_TIMESTAMP);

INSERT INTO "ReadingPassage" ("id", "cefrLevel", "title", "content", "wordCount", "source", "createdAt")
VALUES (gen_random_uuid()::text, 'C2', 'The Paradox of Expertise', 'The relationship between expertise and decision-making quality is paradoxically more nuanced than one might assume. While it is intuitively appealing to defer to experts, a substantial body of research suggests that expertise can, under certain conditions, actually impair judgement. Philip Tetlock''s seminal study of political forecasting demonstrated that recognized experts were, on average, no better at predicting geopolitical events than educated laypeople, and in some cases performed worse. This phenomenon can be partly attributed to what has been termed "the curse of knowledge": experts, by virtue of their deep familiarity with a field, may struggle to appreciate how situations appear to those without specialised knowledge, leading to systematic miscalibration of their predictions. Moreover, experts are susceptible to domain-specific cognitive biases; for instance, economists may over-apply market-based frameworks to social problems that resist economic logic. Conversely, in domains characterised by clear feedback loops and well-defined rules, such as chess or weather forecasting, expertise does confer a genuine predictive advantage. The critical distinction appears to lie in the nature of the domain itself: expertise is most valuable in what David Epstein has called "kind" learning environments, where patterns repeat and feedback is immediate, and least reliable in "wicked" environments, where cause and effect are obscure and feedback is delayed or ambiguous.', 209, 'Original', CURRENT_TIMESTAMP);

INSERT INTO "ReadingPassage" ("id", "cefrLevel", "title", "content", "wordCount", "source", "createdAt")
VALUES (gen_random_uuid()::text, 'C2', 'Linguistic Determinism Revisited', 'The Sapir-Whorf hypothesis, which posits that the structure of a language fundamentally shapes its speakers'' cognition and worldview, has undergone a remarkable rehabilitation in recent decades. The strong version of the hypothesis, linguistic determinism, which holds that language constrains thought absolutely, fell into disrepute following Chomsky''s universalist revolution in linguistics. However, a weaker version, linguistic relativity, has found substantial empirical support. Research by Lera Boroditsky and colleagues has demonstrated that speakers of languages with different spatial reference systems (absolute versus relative) navigate physical space differently, while studies of the Pirahã language, which lacks precise number words, suggest that its speakers have difficulty performing exact numerical tasks. The implications extend beyond pure cognition: languages that assign grammatical gender to inanimate objects appear to influence speakers'' associations with those objects, and languages that grammatically distinguish evidentiality compel their speakers to be more precise about the sources of their knowledge. What emerges from this research is not the crude determinism that Whorf may have originally envisioned, but rather a sophisticated understanding of language as one of several interacting cognitive resources that collectively shape, without absolutely constraining, human experience and reasoning.', 187, 'Original', CURRENT_TIMESTAMP);

-- ============================================================
-- GRAMMAR QUESTIONS (652 total)
-- ============================================================

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'articles', NULL, 1, 'She is ___ teacher.', 'a', 'an', 'the', 'no article', 'A', 'We use "a" before consonant sounds. "Teacher" starts with a /t/ sound.', 'Articles: a/an/the', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'articles', NULL, 2, 'I eat ___ apple every day.', 'a', 'an', 'the', 'no article', 'B', 'We use "an" before vowel sounds. "Apple" starts with a vowel sound.', 'Articles: a/an/the', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'articles', NULL, 3, '___ sun is very hot today.', 'A', 'An', 'The', 'no article', 'C', 'We use "the" when there is only one of something (the sun, the moon).', 'Articles: a/an/the', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'articles', NULL, 2, 'He is ___ honest man.', 'a', 'an', 'the', 'no article', 'B', '"Honest" starts with a silent "h", so the vowel sound /o/ follows. Use "an".', 'Articles: a/an/the', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'articles', NULL, 4, 'I like ___ chocolate.', 'a', 'an', 'the', 'no article', 'D', 'We do not use an article with uncountable nouns when speaking in general.', 'Articles: a/an/the', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'pronouns', NULL, 1, '___ am a student.', 'I', 'Me', 'My', 'Mine', 'A', '"I" is the subject pronoun used before a verb.', 'Personal Pronouns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'pronouns', NULL, 2, 'This book is ___.', 'my', 'me', 'mine', 'I', 'C', '"Mine" is a possessive pronoun used without a noun after it.', 'Possessive Pronouns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'pronouns', NULL, 3, 'Can you give ___ the pen?', 'I', 'me', 'my', 'mine', 'B', '"Me" is the object pronoun. It comes after a verb.', 'Object Pronouns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'pronouns', NULL, 2, '___ name is Sarah.', 'She', 'Her', 'Hers', 'Him', 'B', '"Her" is the possessive adjective used before a noun.', 'Possessive Adjectives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'pronouns', NULL, 4, 'Tom and ___ are friends.', 'me', 'my', 'I', 'mine', 'C', '"I" is the subject pronoun. "Tom and I" is the subject of the sentence.', 'Personal Pronouns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'present-simple', NULL, 1, 'She ___ to school every day.', 'go', 'goes', 'going', 'gone', 'B', 'Third person singular (she/he/it) adds -es to "go" in present simple.', 'Present Simple', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'present-simple', NULL, 2, 'They ___ coffee in the morning.', 'drinks', 'drinking', 'drink', 'drank', 'C', 'With "they" (plural), we use the base form of the verb.', 'Present Simple', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'present-simple', NULL, 3, 'He ___ not like fish.', 'do', 'does', 'is', 'has', 'B', 'Third person singular uses "does" in negative present simple.', 'Present Simple: Negatives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'present-simple', NULL, 3, '___ you speak French?', 'Does', 'Do', 'Are', 'Is', 'B', 'With "you" we use "Do" to form questions in present simple.', 'Present Simple: Questions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'present-simple', NULL, 4, 'Water ___ at 100 degrees Celsius.', 'boil', 'boils', 'is boiling', 'boiled', 'B', 'We use present simple for scientific facts and general truths.', 'Present Simple', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'be-verb', NULL, 1, 'I ___ happy today.', 'am', 'is', 'are', 'be', 'A', '"Am" is used with "I" as the subject.', 'Verb to Be', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'be-verb', NULL, 1, 'They ___ from Brazil.', 'am', 'is', 'are', 'be', 'C', '"Are" is used with "they" (plural subjects).', 'Verb to Be', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'be-verb', NULL, 2, 'The cat ___ on the table.', 'am', 'is', 'are', 'be', 'B', '"Is" is used with singular third person subjects.', 'Verb to Be', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'be-verb', NULL, 3, '___ she your sister?', 'Am', 'Is', 'Are', 'Do', 'B', 'To form questions with "be", put the verb before the subject.', 'Verb to Be: Questions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'prepositions', 'place', 2, 'The book is ___ the table.', 'in', 'on', 'at', 'to', 'B', '"On" is used for surfaces.', 'Prepositions of Place', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'prepositions', 'place', 3, 'She lives ___ London.', 'on', 'at', 'in', 'to', 'C', '"In" is used with cities and countries.', 'Prepositions of Place', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'prepositions', 'time', 3, 'The meeting is ___ Monday.', 'in', 'on', 'at', 'to', 'B', '"On" is used with days of the week.', 'Prepositions of Time', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'prepositions', 'time', 4, 'I wake up ___ 7 o''clock.', 'in', 'on', 'at', 'to', 'C', '"At" is used with specific times.', 'Prepositions of Time', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'prepositions', 'time', 4, 'We go on holiday ___ summer.', 'in', 'on', 'at', 'to', 'A', '"In" is used with seasons, months and years.', 'Prepositions of Time', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'there-is-are', NULL, 2, 'There ___ a park near my house.', 'is', 'are', 'am', 'be', 'A', '"There is" is used with singular nouns.', 'There is/There are', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'there-is-are', NULL, 3, 'There ___ many students in the class.', 'is', 'are', 'am', 'has', 'B', '"There are" is used with plural nouns.', 'There is/There are', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'possessives', NULL, 2, 'This is ___ car.', 'John', 'John''s', 'Johns', 'of John', 'B', 'We use ''s to show possession with people.', 'Possessive ''s', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'possessives', NULL, 3, '___ bag is this?', 'Who', 'Whose', 'Who''s', 'Which', 'B', '"Whose" asks about possession. "Who''s" means "who is".', 'Possessive Adjectives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'imperatives', NULL, 2, '___ the door, please.', 'Closing', 'Closed', 'Close', 'Closes', 'C', 'Imperatives use the base form of the verb.', 'Imperatives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'imperatives', NULL, 3, '___ run in the corridor.', 'Not', 'No', 'Don''t', 'Doesn''t', 'C', 'We use "Don''t" + base verb for negative imperatives.', 'Imperatives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'word-order', NULL, 3, 'Which sentence is correct?', 'I always drink coffee.', 'I drink always coffee.', 'Always I drink coffee.', 'I drink coffee always.', 'A', 'Adverbs of frequency go before the main verb.', 'Word Order', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'word-order', NULL, 4, 'Which sentence is correct?', 'She has a red beautiful car.', 'She has a beautiful red car.', 'She has a car red beautiful.', 'She has a car beautiful red.', 'B', 'Adjective order: opinion (beautiful) before colour (red).', 'Adjective Order', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'plurals', NULL, 1, 'I have two ___.', 'childs', 'childrens', 'children', 'child', 'C', '"Children" is the irregular plural of "child".', 'Plural Nouns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'plurals', NULL, 2, 'There are three ___ on the shelf.', 'boxs', 'boxes', 'boxies', 'box', 'B', 'Nouns ending in -x add -es to form the plural.', 'Plural Nouns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'can-ability', NULL, 2, 'She ___ swim very well.', 'cans', 'can', 'is can', 'do can', 'B', '"Can" does not change form with any subject.', 'Can for Ability', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'can-ability', NULL, 3, 'I ___ speak Japanese. I only know English.', 'can not', 'don''t can', 'can''t', 'am not can', 'C', 'The negative form of "can" is "can''t" (or "cannot").', 'Can for Ability', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'past-simple', NULL, 11, 'I ___ to the cinema yesterday.', 'go', 'went', 'gone', 'going', 'B', '"Went" is the past simple form of "go".', 'Past Simple: Irregular Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'past-simple', NULL, 12, 'She ___ her homework last night.', 'do', 'does', 'did', 'done', 'C', '"Did" is the past simple form of "do".', 'Past Simple: Irregular Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'past-simple', NULL, 12, 'They ___ football last weekend.', 'play', 'played', 'playing', 'plays', 'B', 'Regular verbs add -ed in past simple.', 'Past Simple: Regular Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'past-simple', NULL, 13, '___ you see the film?', 'Do', 'Does', 'Did', 'Was', 'C', 'Past simple questions use "Did" + base form.', 'Past Simple: Questions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'past-simple', NULL, 14, 'He ___ come to the party.', 'doesn''t', 'didn''t', 'wasn''t', 'not', 'B', 'Past simple negatives use "didn''t" + base form.', 'Past Simple: Negatives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'past-simple', NULL, 14, 'We ___ a great time at the beach.', 'have', 'has', 'had', 'having', 'C', '"Had" is the past simple form of "have".', 'Past Simple: Irregular Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'past-simple', NULL, 15, 'The train ___ at 8 o''clock this morning.', 'arrive', 'arrives', 'arrived', 'arriving', 'C', 'A completed action at a specific time in the past uses past simple.', 'Past Simple', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'present-continuous', NULL, 11, 'Look! She ___ dancing.', 'is', 'are', 'am', 'does', 'A', '"Is" + -ing for third person singular in present continuous.', 'Present Continuous', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'present-continuous', NULL, 12, 'They ___ TV right now.', 'watch', 'watches', 'are watching', 'is watching', 'C', 'Present continuous = subject + be + verb-ing. "They" takes "are".', 'Present Continuous', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'present-continuous', NULL, 13, 'I ___ to music at the moment.', 'listen', 'am listening', 'listening', 'listens', 'B', '"At the moment" signals present continuous: am/is/are + -ing.', 'Present Continuous', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'present-continuous', NULL, 14, 'We ___ a new house next month.', 'buy', 'bought', 'are buying', 'buys', 'C', 'Present continuous can express future arrangements.', 'Present Continuous for Future', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'present-continuous', NULL, 15, 'Be quiet! The baby ___.', 'sleeps', 'sleep', 'is sleeping', 'slept', 'C', 'An action happening at this moment uses present continuous.', 'Present Continuous', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'future-going-to', NULL, 12, 'I ___ visit my grandma this weekend.', 'going to', 'am going to', 'will going to', 'go to', 'B', 'The structure is subject + am/is/are + going to + base verb.', 'Going to for Future Plans', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'future-going-to', NULL, 13, 'Look at those clouds! It ___ rain.', 'is going to', 'going to', 'will going to', 'goes to', 'A', 'We use "going to" for predictions based on present evidence.', 'Going to for Predictions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'future-going-to', NULL, 14, 'They ___ get married next June.', 'going to', 'is going to', 'are going to', 'will going', 'C', '"They" goes with "are going to". It expresses a planned decision.', 'Going to for Future Plans', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'comparatives', NULL, 12, 'My house is ___ than yours.', 'big', 'bigger', 'biggest', 'more big', 'B', 'Short adjectives add -er for comparatives.', 'Comparatives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'comparatives', NULL, 13, 'This question is ___ than the last one.', 'difficulter', 'more difficult', 'most difficult', 'difficultest', 'B', 'Long adjectives (3+ syllables) use "more" for comparatives.', 'Comparatives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'superlatives', NULL, 14, 'This is the ___ film I have ever seen.', 'good', 'better', 'best', 'most good', 'C', '"Best" is the irregular superlative of "good".', 'Superlatives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'superlatives', NULL, 15, 'Mount Everest is the ___ mountain in the world.', 'higher', 'most high', 'highest', 'more high', 'C', 'Short adjectives add -est for superlatives. "High" becomes "highest".', 'Superlatives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'countable-uncountable', NULL, 13, 'How ___ milk do we need?', 'many', 'much', 'lot', 'few', 'B', '"Much" is used with uncountable nouns like "milk".', 'Much/Many/A Lot of', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'countable-uncountable', NULL, 14, 'There are ___ apples in the fridge.', 'much', 'a lot', 'a few', 'a little', 'C', '"A few" is used with countable plural nouns.', 'A Few / A Little', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'countable-uncountable', NULL, 15, 'I don''t have ___ money.', 'some', 'any', 'many', 'few', 'B', '"Any" is used in negative sentences with uncountable nouns.', 'Some/Any', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'adverbs-frequency', NULL, 12, 'She ___ late for class.', 'is never', 'never is', 'is not never', 'doesn''t never', 'A', 'Adverbs of frequency go after "be" verbs: She is never late.', 'Adverbs of Frequency', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'adverbs-frequency', NULL, 13, 'He ___ eats breakfast before 7 AM.', 'usual', 'usually', 'every time', 'all days', 'B', '"Usually" is an adverb of frequency placed before the main verb.', 'Adverbs of Frequency', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'conjunctions', NULL, 14, 'I like tea ___ I don''t like coffee.', 'and', 'but', 'so', 'because', 'B', '"But" is used to show contrast between two ideas.', 'Conjunctions: and/but/so/because', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'conjunctions', NULL, 15, 'She was tired ___ she went to bed early.', 'but', 'and', 'so', 'or', 'C', '"So" is used to show result or consequence.', 'Conjunctions: and/but/so/because', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'conjunctions', NULL, 16, 'I stayed home ___ it was raining.', 'so', 'but', 'because', 'and', 'C', '"Because" gives a reason for the action.', 'Conjunctions: and/but/so/because', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'was-were', NULL, 11, 'I ___ at home yesterday.', 'was', 'were', 'am', 'be', 'A', '"Was" is used with I/he/she/it in the past.', 'Was/Were', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'was-were', NULL, 12, '___ they at the party?', 'Was', 'Were', 'Did', 'Are', 'B', '"Were" is used with you/we/they in the past.', 'Was/Were', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'present-perfect', NULL, 21, 'I ___ never been to Japan.', 'have', 'has', 'am', 'did', 'A', 'Present perfect: have/has + past participle. "I" takes "have".', 'Present Perfect', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'present-perfect', NULL, 22, 'She ___ just finished her exam.', 'have', 'has', 'is', 'did', 'B', '"She" takes "has" in present perfect.', 'Present Perfect', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'present-perfect', NULL, 23, 'I have lived here ___ 2010.', 'for', 'since', 'from', 'during', 'B', '"Since" is used with a specific point in time.', 'Present Perfect: for/since', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'present-perfect', NULL, 23, 'We have known each other ___ ten years.', 'since', 'for', 'from', 'during', 'B', '"For" is used with a duration of time.', 'Present Perfect: for/since', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'present-perfect', NULL, 25, '___ you ever eaten sushi?', 'Did', 'Do', 'Have', 'Are', 'C', 'Present perfect questions: Have/Has + subject + past participle.', 'Present Perfect: Experience', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'present-perfect', NULL, 26, 'He has ___ gone home.', 'yet', 'already', 'still', 'never', 'B', '"Already" is used in affirmative sentences to mean "before now".', 'Present Perfect: already/yet/just', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'present-perfect', NULL, 27, 'Have you finished ___?', 'already', 'just', 'yet', 'still', 'C', '"Yet" is used at the end of questions and negative sentences.', 'Present Perfect: already/yet/just', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'past-continuous', NULL, 22, 'I ___ TV when the phone rang.', 'watched', 'was watching', 'watch', 'am watching', 'B', 'Past continuous for an ongoing action interrupted by another event.', 'Past Continuous', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'past-continuous', NULL, 23, 'While she ___ dinner, the doorbell rang.', 'cooked', 'cooks', 'was cooking', 'is cooking', 'C', '"While" + past continuous for the longer background action.', 'Past Continuous', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'past-continuous', NULL, 24, 'At 3 PM yesterday, they ___ in the park.', 'run', 'ran', 'were running', 'are running', 'C', 'Past continuous for an action in progress at a specific past time.', 'Past Continuous', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'modals', 'obligation', 23, 'You ___ wear a seatbelt. It''s the law.', 'should', 'can', 'must', 'might', 'C', '"Must" expresses strong obligation, especially for rules and laws.', 'Modal Verbs: Obligation', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'modals', 'advice', 24, 'You ___ see a doctor if you feel ill.', 'must', 'should', 'can', 'will', 'B', '"Should" is used for advice and recommendations.', 'Modal Verbs: Advice', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'modals', 'possibility', 25, 'It ___ rain tomorrow. I''m not sure.', 'will', 'must', 'might', 'should', 'C', '"Might" expresses possibility when we are uncertain.', 'Modal Verbs: Possibility', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'modals', 'permission', 24, '___ I use your phone, please?', 'Will', 'Should', 'Must', 'Could', 'D', '"Could" is a polite way to ask for permission.', 'Modal Verbs: Permission', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'conditionals', 'first conditional', 24, 'If it rains, I ___ stay at home.', 'would', 'will', 'am', 'had', 'B', 'First conditional: If + present simple, will + base form.', 'First Conditional', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'conditionals', 'first conditional', 25, 'If you ___ hard, you will pass the exam.', 'study', 'will study', 'studied', 'would study', 'A', 'In first conditional, the if-clause uses present simple.', 'First Conditional', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'conditionals', 'zero conditional', 23, 'If you heat water to 100°C, it ___.', 'will boil', 'boils', 'would boil', 'boiled', 'B', 'Zero conditional: If + present simple, present simple. For facts.', 'Zero Conditional', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'passive', NULL, 25, 'English ___ spoken in many countries.', 'is', 'are', 'was', 'be', 'A', 'Present simple passive: is/are + past participle.', 'Passive Voice: Present', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'passive', NULL, 26, 'The Mona Lisa ___ painted by Leonardo da Vinci.', 'is', 'was', 'has', 'did', 'B', 'Past simple passive: was/were + past participle.', 'Passive Voice: Past', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'passive', NULL, 27, 'A new school ___ being built near the park.', 'is', 'was', 'has', 'will', 'A', 'Present continuous passive: is/are + being + past participle.', 'Passive Voice: Continuous', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'relative-clauses', NULL, 25, 'That''s the woman ___ lives next door.', 'which', 'who', 'what', 'whose', 'B', '"Who" is used for people in relative clauses.', 'Relative Clauses: who/which/that', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'relative-clauses', NULL, 26, 'I bought the book ___ you recommended.', 'who', 'whose', 'which', 'where', 'C', '"Which" or "that" is used for things in relative clauses.', 'Relative Clauses: who/which/that', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'relative-clauses', NULL, 27, 'She''s the girl ___ father is a pilot.', 'who', 'which', 'whose', 'that', 'C', '"Whose" shows possession in relative clauses.', 'Relative Clauses: whose', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'gerunds-infinitives', NULL, 26, 'I enjoy ___ in the rain.', 'walk', 'walking', 'to walk', 'walked', 'B', '"Enjoy" is followed by a gerund (-ing form).', 'Gerunds and Infinitives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'gerunds-infinitives', NULL, 27, 'She decided ___ a new car.', 'buying', 'buy', 'to buy', 'bought', 'C', '"Decide" is followed by the infinitive (to + verb).', 'Gerunds and Infinitives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'gerunds-infinitives', NULL, 28, 'He stopped ___ because it was bad for his health.', 'smoke', 'smoking', 'to smoke', 'smoked', 'B', '"Stop + gerund" means to quit the activity.', 'Gerunds and Infinitives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'reported-speech', NULL, 27, 'She said she ___ tired.', 'is', 'was', 'were', 'been', 'B', 'In reported speech, present "is" changes to past "was".', 'Reported Speech', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'reported-speech', NULL, 28, 'He told me he ___ call later.', 'will', 'shall', 'would', 'can', 'C', 'In reported speech, "will" changes to "would".', 'Reported Speech', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'reported-speech', NULL, 29, 'She asked me where I ___.', 'live', 'lived', 'living', 'lives', 'B', 'In reported questions, the verb shifts one tense back.', 'Reported Questions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'conditionals', 'second conditional', 31, 'If I ___ rich, I would travel the world.', 'am', 'was', 'were', 'would be', 'C', 'Second conditional: If + past simple. "Were" is used for all subjects in formal English.', 'Second Conditional', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'conditionals', 'second conditional', 32, 'If she spoke French, she ___ get the job.', 'will', 'would', 'can', 'is going to', 'B', 'Second conditional result clause: would + base form.', 'Second Conditional', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'conditionals', 'third conditional', 35, 'If I had studied harder, I ___ passed the exam.', 'will have', 'would', 'would have', 'had', 'C', 'Third conditional: If + past perfect, would have + past participle.', 'Third Conditional', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'conditionals', 'third conditional', 36, 'She wouldn''t have been late if she ___ earlier.', 'left', 'had left', 'would leave', 'has left', 'B', 'Third conditional if-clause uses past perfect (had + past participle).', 'Third Conditional', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'past-perfect', NULL, 31, 'By the time I arrived, the film ___.', 'started', 'has started', 'had started', 'starts', 'C', 'Past perfect shows an action completed before another past event.', 'Past Perfect', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'past-perfect', NULL, 32, 'She ___ never seen snow before she moved to Canada.', 'has', 'had', 'did', 'was', 'B', 'Past perfect: had + past participle for experiences before a past time.', 'Past Perfect', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'past-perfect', NULL, 33, 'After they ___ dinner, they went for a walk.', 'have', 'had had', 'has had', 'having', 'B', '"Had had" is past perfect of "have". The first action uses past perfect.', 'Past Perfect', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'passive', 'advanced', 33, 'The report ___ by the time I arrived.', 'has been finished', 'had been finished', 'was finishing', 'is finished', 'B', 'Past perfect passive: had been + past participle.', 'Passive Voice: Past Perfect', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'passive', 'advanced', 34, 'The project ___ completed by next Friday.', 'will be', 'is', 'was', 'has been', 'A', 'Future passive: will be + past participle.', 'Passive Voice: Future', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'phrasal-verbs', NULL, 33, 'Can you ___ the meeting until Thursday?', 'put off', 'put on', 'put up', 'put out', 'A', '"Put off" means to postpone or delay.', 'Phrasal Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'phrasal-verbs', NULL, 34, 'I need to ___ this word in the dictionary.', 'look after', 'look up', 'look for', 'look into', 'B', '"Look up" means to search for information in a reference source.', 'Phrasal Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'phrasal-verbs', NULL, 35, 'She ___ her mother. They look very similar.', 'takes after', 'takes off', 'takes up', 'takes over', 'A', '"Take after" means to resemble a family member.', 'Phrasal Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'phrasal-verbs', NULL, 36, 'I ___ running last year and now I love it.', 'took up', 'took off', 'took after', 'took in', 'A', '"Take up" means to start a new hobby or activity.', 'Phrasal Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'wish-if-only', NULL, 34, 'I wish I ___ taller.', 'am', 'was', 'were', 'would be', 'C', 'Wish + past simple (were for all subjects) for unreal present situations.', 'Wish / If Only', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'wish-if-only', NULL, 35, 'If only I ___ that email. It caused so many problems.', 'didn''t send', 'haven''t sent', 'hadn''t sent', 'wouldn''t send', 'C', 'Wish/If only + past perfect for regrets about the past.', 'Wish / If Only: Past', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'wish-if-only', NULL, 36, 'I wish you ___ making that noise. It''s annoying.', 'stop', 'stopped', 'would stop', 'will stop', 'C', 'Wish + would for complaints about other people''s behaviour.', 'Wish / If Only', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'used-to', NULL, 31, 'I ___ live in Paris, but now I live in London.', 'used to', 'use to', 'was used to', 'am used to', 'A', '"Used to" + base verb for past habits or states that are no longer true.', 'Used to / Would', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'used-to', NULL, 33, 'She is ___ waking up early now.', 'used to', 'use to', 'used', 'using to', 'A', '"Be used to" + -ing means to be accustomed to something.', 'Be Used to / Get Used to', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'used-to', NULL, 34, 'When I was a child, we ___ go fishing every summer.', 'used to', 'would', 'were used to', 'Both A and B', 'D', 'Both "used to" and "would" can describe repeated past actions.', 'Used to / Would', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'quantifiers', NULL, 33, '___ of the students passed the exam. Only three failed.', 'Most', 'All', 'Every', 'Each', 'A', '"Most" means the majority but not all.', 'Quantifiers', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'quantifiers', NULL, 34, 'There is ___ milk left. We need to buy more.', 'few', 'a few', 'little', 'a little', 'C', '"Little" (without "a") means almost none. Used with uncountable nouns.', 'Quantifiers: few/little', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'linking-words', NULL, 35, '___ the rain, we went for a walk.', 'Although', 'Despite', 'However', 'Because of', 'B', '"Despite" + noun/gerund shows contrast.', 'Linking Words: despite/although', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'linking-words', NULL, 36, 'The restaurant was expensive. ___, the food was excellent.', 'Although', 'Despite', 'However', 'Because', 'C', '"However" is used between two sentences to show contrast.', 'Linking Words: however/nevertheless', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'linking-words', NULL, 37, '___ she was tired, she finished the project.', 'Despite', 'Although', 'However', 'In spite of', 'B', '"Although" + subject + verb shows contrast within a sentence.', 'Linking Words: despite/although', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'cleft-sentences', NULL, 38, 'It was John ___ broke the window.', 'which', 'what', 'who', 'whom', 'C', 'Cleft sentence: "It was... who/that..." for emphasis on a person.', 'Cleft Sentences', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'cleft-sentences', NULL, 39, 'What I really need ___ a holiday.', 'are', 'is', 'were', 'has', 'B', '"What" clauses as subject take a singular verb.', 'Cleft Sentences', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'conditionals', 'mixed conditional', 43, 'If I had taken that job, I ___ living in New York now.', 'will be', 'would be', 'would have been', 'am', 'B', 'Mixed conditional: If + past perfect, would + base form (past cause, present result).', 'Mixed Conditionals', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'conditionals', 'mixed conditional', 44, 'If she were more careful, she ___ made that mistake yesterday.', 'wouldn''t', 'won''t have', 'wouldn''t have', 'hadn''t', 'C', 'Mixed conditional: If + past simple, would have + past participle (present cause, past result).', 'Mixed Conditionals', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'inversion', NULL, 43, 'Never ___ I seen such a beautiful sunset.', 'did', 'have', 'was', 'had', 'B', 'After negative adverbs like "Never", we invert the subject and auxiliary.', 'Inversion with Negative Adverbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'inversion', NULL, 44, 'Not only ___ she pass the exam, but she also got the highest mark.', 'has', 'was', 'did', 'had', 'C', '"Not only" triggers inversion: Not only + auxiliary + subject.', 'Inversion with Negative Adverbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'inversion', NULL, 45, 'Hardly ___ I arrived when the meeting started.', 'did', 'had', 'have', 'was', 'B', '"Hardly... when" uses past perfect with inversion.', 'Inversion with Negative Adverbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'inversion', NULL, 46, 'Seldom ___ people appreciate what they have.', 'are', 'do', 'have', 'were', 'B', '"Seldom" + do/does + subject + base verb in present tense inversion.', 'Inversion with Negative Adverbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'inversion', NULL, 47, 'Only after the results were announced ___ he realise his mistake.', 'has', 'had', 'did', 'was', 'C', '"Only after..." triggers inversion in the main clause.', 'Inversion: Only if/when/after', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'subjunctive', NULL, 44, 'The doctor recommended that she ___ more rest.', 'gets', 'get', 'got', 'getting', 'B', 'The subjunctive uses the base form after verbs like recommend, suggest, insist.', 'Subjunctive Mood', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'subjunctive', NULL, 45, 'It is essential that he ___ on time.', 'arrives', 'arrive', 'arrived', 'arriving', 'B', 'Subjunctive: "It is essential/important that + subject + base form".', 'Subjunctive Mood', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'subjunctive', NULL, 46, 'I suggest that the meeting ___ postponed.', 'is', 'be', 'was', 'will be', 'B', 'Subjunctive with "suggest": subject + suggest + that + subject + be.', 'Subjunctive Mood', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'modals', 'deduction past', 43, 'She ___ left already. Her car isn''t here.', 'must have', 'can have', 'should', 'might', 'A', '"Must have + past participle" for strong deductions about the past.', 'Modal Verbs: Past Deduction', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'modals', 'deduction past', 44, 'You ___ studied very hard. Your results are excellent.', 'should have', 'must have', 'could have', 'would have', 'B', '"Must have" expresses a logical conclusion about a past event.', 'Modal Verbs: Past Deduction', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'modals', 'criticism', 45, 'You ___ told me earlier. Now it''s too late.', 'must have', 'can have', 'should have', 'would have', 'C', '"Should have + past participle" expresses criticism or regret about the past.', 'Modal Verbs: should have / could have', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'modals', 'possibility past', 45, 'He ___ taken the wrong train. Let me call him.', 'must have', 'might have', 'should have', 'would have', 'B', '"Might have + past participle" expresses possibility about a past event.', 'Modal Verbs: Past Possibility', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'participle-clauses', NULL, 44, '___ the door, she walked into the room.', 'Opened', 'Opening', 'To open', 'Having opened', 'B', 'Present participle clause for simultaneous actions.', 'Participle Clauses', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'participle-clauses', NULL, 46, '___ finished the report, she went home.', 'Have', 'Had', 'Having', 'Has', 'C', '"Having + past participle" for a completed action before another.', 'Participle Clauses', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'participle-clauses', NULL, 47, 'The man ___ at the bus stop is my neighbour.', 'stand', 'standing', 'stood', 'to stand', 'B', 'Reduced relative clause using present participle.', 'Participle Clauses', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'ellipsis', NULL, 45, 'I haven''t been to Paris, but I''d like ___.', 'it', 'to', 'to go', 'going', 'B', 'We can use "to" alone (ellipsis) when the full infinitive is understood from context.', 'Ellipsis and Substitution', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'ellipsis', NULL, 46, '"Are you coming tonight?" "I hope ___."', 'it', 'that', 'to', 'so', 'D', '"I hope so" is a common ellipsis pattern replacing the whole clause.', 'Ellipsis and Substitution', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'reported-speech', 'advanced', 44, 'She denied ___ the window.', 'break', 'breaking', 'to break', 'broke', 'B', '"Deny" is followed by a gerund in reported speech.', 'Reporting Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'reported-speech', 'advanced', 45, 'He accused me ___ lying.', 'for', 'to', 'of', 'about', 'C', '"Accuse someone of + -ing" is the correct pattern.', 'Reporting Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'reported-speech', 'advanced', 46, 'She warned us ___ touch the wires.', 'to not', 'not to', 'don''t', 'shouldn''t', 'B', '"Warn someone not to do something" is the correct pattern.', 'Reporting Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'register', NULL, 46, 'Which is more appropriate for a formal letter?', 'I wanna talk about...', 'I''d like to talk about...', 'I wish to discuss...', 'I want to say something about...', 'C', '"I wish to discuss" is the most formal register.', 'Formal vs Informal Register', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'tense-nuance', NULL, 51, 'By this time next year, I ___ here for a decade.', 'will work', 'will have been working', 'will be working', 'am working', 'B', 'Future perfect continuous for duration up to a future point.', 'Future Perfect Continuous', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'tense-nuance', NULL, 52, 'I ___ to tell you, but it slipped my mind.', 'was meaning', 'had been meaning', 'have been meaning', 'meant', 'B', 'Past perfect continuous emphasises the duration of something that was ongoing before another past event.', 'Past Perfect Continuous Nuances', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'inversion', 'rare', 53, 'So impressive ___ the performance that the audience gave a standing ovation.', 'is', 'was', 'has been', 'had been', 'B', '"So + adjective + inversion + that" for emphatic statements.', 'Advanced Inversion Patterns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'inversion', 'rare', 54, 'Under no circumstances ___ this information be shared.', 'should', 'does', 'will', 'can', 'A', '"Under no circumstances" triggers formal inversion with a modal verb.', 'Advanced Inversion Patterns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'inversion', 'rare', 55, 'Not until the final page ___ the mystery revealed.', 'is', 'was', 'has', 'did', 'B', '"Not until" + clause triggers inversion in the main clause.', 'Advanced Inversion Patterns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'subjunctive', 'fixed expressions', 53, 'Come what ___, we will finish this project.', 'might', 'may', 'can', 'will', 'B', '"Come what may" is a fixed subjunctive expression meaning "whatever happens".', 'Subjunctive in Fixed Expressions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'subjunctive', 'fixed expressions', 54, '___ it that she always gets the best results.', 'How is', 'Why is', 'How comes', 'How come is', 'A', '"How is it that..." is used to express surprise or ask for an explanation.', 'Advanced Question Forms', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'subjunctive', 'fixed expressions', 55, 'Be that ___ it may, we still need to find a solution.', 'how', 'what', 'as', 'which', 'C', '"Be that as it may" is a fixed expression meaning "even so".', 'Subjunctive in Fixed Expressions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'collocations', NULL, 52, 'The government has taken ___ measures to reduce pollution.', 'strong', 'hard', 'drastic', 'heavy', 'C', '"Take drastic measures" is the correct collocation.', 'Advanced Collocations', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'collocations', NULL, 53, 'She made a ___ recovery after the surgery.', 'fast', 'speedy', 'quick', 'rapid', 'B', '"Make a speedy recovery" is the most common collocation.', 'Advanced Collocations', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'collocations', NULL, 54, 'He bore a striking ___ to his grandfather.', 'similarity', 'resemblance', 'likeness', 'appearance', 'B', '"Bear a striking resemblance to" is the correct collocation.', 'Advanced Collocations', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'ambiguity', NULL, 55, '"The chicken is ready to eat." This sentence is ambiguous because:', 'It could mean the chicken is cooked for people to eat, or the chicken (alive) is hungry.', 'Chicken is uncountable.', '"Ready" can be an adverb or adjective.', 'None of the above.', 'A', 'This is a classic structural ambiguity: "to eat" can have the chicken as object or subject.', 'Ambiguity in English', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'near-synonyms', NULL, 53, 'The new law will ___ existing regulations.', 'override', 'overrule', 'supersede', 'surpass', 'C', '"Supersede" means to replace something with something newer or better, especially formally.', 'Near-Synonyms and Nuance', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'near-synonyms', NULL, 54, 'After years of tension, the two countries finally ___ their differences.', 'resolved', 'solved', 'settled', 'fixed', 'A', '"Resolve differences" is the correct collocation for conflict resolution.', 'Near-Synonyms and Nuance', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'near-synonyms', NULL, 56, 'The evidence ___ the hypothesis that climate change is accelerating.', 'confirms', 'corroborates', 'verifies', 'validates', 'B', '"Corroborate" means to support with additional evidence, used in academic/scientific contexts.', 'Academic Vocabulary', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'discourse-markers', NULL, 52, 'The project was a failure. ___, it taught us valuable lessons.', 'Nevertheless', 'Moreover', 'Furthermore', 'Consequently', 'A', '"Nevertheless" concedes the first point while introducing a contrasting positive.', 'Discourse Markers', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'discourse-markers', NULL, 53, 'The data is inconclusive; ___, we cannot draw any firm conclusions.', 'however', 'therefore', 'moreover', 'nonetheless', 'B', '"Therefore" introduces a logical consequence.', 'Discourse Markers', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'relative-clauses', 'advanced', 54, 'She married Tom, ___ surprised everyone.', 'that', 'which', 'who', 'what', 'B', '"Which" can refer to a whole clause in non-defining relative clauses.', 'Non-Defining Relative Clauses', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'relative-clauses', 'advanced', 55, 'The hotel, the ___ of which I cannot remember, was on a hill.', 'name', 'place', 'location', 'address', 'A', '"The name of which" is a formal non-defining relative clause structure.', 'Formal Relative Clauses', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'fronting', NULL, 55, 'Brilliant ___ it was, it failed to win the award.', 'as', 'though', 'even', 'Both A and B', 'D', 'Both "as" and "though" work in fronted concessive structures.', 'Fronting for Emphasis', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'fronting', NULL, 56, 'Try ___ he might, he could not solve the problem.', 'as', 'how', 'what', 'though', 'A', '"Try as he might" is a fixed expression with fronted adverbial.', 'Fronting for Emphasis', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'nominal-clauses', NULL, 56, '___ remains to be seen is whether the policy will work.', 'That', 'What', 'Which', 'It', 'B', '"What" introduces a nominal relative clause functioning as the subject.', 'Nominal Clauses', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'nominal-clauses', NULL, 57, 'The fact ___ he lied is unacceptable.', 'which', 'what', 'that', 'how', 'C', '"The fact that..." introduces a noun clause in apposition.', 'Nominal Clauses', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'demonstratives', NULL, 3, '___ is my friend, Sara.', 'These', 'This', 'Those', 'Them', 'B', '"This" is used for introducing someone near you.', 'Demonstratives: this/that/these/those', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'demonstratives', NULL, 4, '___ shoes are too big for me.', 'This', 'That', 'These', 'It', 'C', '"These" is the plural of "this" for things near you.', 'Demonstratives: this/that/these/those', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'have-got', NULL, 3, 'She ___ got two brothers.', 'have', 'has', 'is', 'do', 'B', 'Third person singular: has got.', 'Have/Has Got', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'question-words', NULL, 3, '___ do you live?', 'What', 'Who', 'Where', 'When', 'C', '"Where" asks about place/location.', 'Question Words', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'question-words', NULL, 4, '___ is your birthday?', 'What', 'Who', 'Where', 'When', 'D', '"When" asks about time.', 'Question Words', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'will-future', NULL, 15, 'I think it ___ be sunny tomorrow.', 'will', 'is going to', 'is', 'does', 'A', '"Will" is used for predictions based on opinion (I think...).', 'Will for Predictions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'will-future', NULL, 16, 'Don''t worry. I ___ help you.', 'going to', 'will', 'am', 'do', 'B', '"Will" is used for spontaneous decisions made at the moment of speaking.', 'Will for Spontaneous Decisions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'present-simple-vs-continuous', NULL, 16, 'She ___ to the gym three times a week.', 'is going', 'goes', 'going', 'go', 'B', 'Routines and habits use present simple.', 'Present Simple vs Continuous', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'present-simple-vs-continuous', NULL, 17, 'Right now, he ___ his homework.', 'does', 'do', 'is doing', 'did', 'C', '"Right now" signals an action happening at this moment (present continuous).', 'Present Simple vs Continuous', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'object-pronouns', NULL, 13, 'I saw ___ at the party last night.', 'they', 'their', 'them', 'theirs', 'C', '"Them" is the object pronoun for "they".', 'Object Pronouns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'present-perfect-vs-past', NULL, 26, 'I ___ this film three times.', 'saw', 'have seen', 'see', 'am seeing', 'B', 'Present perfect for experiences without a specific past time.', 'Present Perfect vs Past Simple', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'present-perfect-vs-past', NULL, 27, 'I ___ to Paris last summer.', 'went', 'have gone', 'have been', 'go', 'A', '"Last summer" is a finished time, so we use past simple.', 'Present Perfect vs Past Simple', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'too-enough', NULL, 25, 'This coffee is ___ hot to drink.', 'enough', 'too', 'very', 'so', 'B', '"Too" + adjective means excessively, more than is needed.', 'Too / Enough', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'too-enough', NULL, 26, 'He isn''t old ___ to drive.', 'too', 'very', 'enough', 'so', 'C', 'Adjective + "enough" means sufficient.', 'Too / Enough', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'question-tags', NULL, 27, 'You like pizza, ___ you?', 'do', 'don''t', 'aren''t', 'are', 'B', 'Positive statement gets a negative tag: "don''t you?"', 'Question Tags', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'question-tags', NULL, 28, 'She can''t swim, ___ she?', 'can''t', 'doesn''t', 'can', 'does', 'C', 'Negative statement gets a positive tag: "can she?"', 'Question Tags', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'future-perfect', NULL, 34, 'By next month, I ___ all my exams.', 'will finish', 'finish', 'will have finished', 'am finishing', 'C', 'Future perfect: will have + past participle for completion before a future time.', 'Future Perfect', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'future-continuous', NULL, 33, 'This time tomorrow, I ___ on the beach.', 'will sit', 'will be sitting', 'am sitting', 'sit', 'B', 'Future continuous for an action in progress at a specific future time.', 'Future Continuous', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'have-something-done', NULL, 36, 'I need to get my car ___.', 'repair', 'repaired', 'repairing', 'to repair', 'B', 'Causative: have/get + object + past participle.', 'Have Something Done (Causative)', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'have-something-done', NULL, 37, 'She had her hair ___ yesterday.', 'cut', 'cutting', 'to cut', 'cuts', 'A', 'Have + object + past participle (caused by someone else).', 'Have Something Done (Causative)', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'cleft-sentences', 'advanced', 47, 'It was not until midnight ___ the guests finally left.', 'when', 'that', 'which', 'where', 'B', '"It was not until... that..." is a cleft structure for time emphasis.', 'Advanced Cleft Sentences', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'emphasis', NULL, 46, 'What she did ___ resign.', 'is', 'was', 'had', 'has', 'B', '"What + subject + did + was" is an emphatic cleft structure.', 'Cleft Sentences for Emphasis', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'future-in-past', NULL, 45, 'She was about to leave when the phone rang. She ___ to call a taxi.', 'was going', 'would', 'will', 'is going', 'A', '"Was going to" expresses future viewed from a past perspective.', 'Future in the Past', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'concession', NULL, 48, '___ hard he tried, he couldn''t solve the problem.', 'Despite', 'Although', 'However', 'No matter', 'C', '"However + adjective/adverb" for concessive clauses.', 'Concessive Clauses', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'hedging', NULL, 56, 'The results ___ suggest a correlation, but further research is needed.', 'apparently', 'would appear to', 'certainly', 'obviously', 'B', '"Would appear to" is a hedging expression used in academic writing.', 'Hedging in Academic English', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'binomials', NULL, 55, 'The success of the project depends on the ___ of the team.', 'ins and outs', 'rough and tumble', 'give and take', 'ups and downs', 'C', '"Give and take" means compromise and cooperation.', 'Binomial Expressions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'binomials', NULL, 56, 'She learned the ___ of running a business the hard way.', 'ins and outs', 'odds and ends', 'pros and cons', 'bits and pieces', 'A', '"Ins and outs" means the detailed workings of something.', 'Binomial Expressions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'vague-language', NULL, 57, 'There were about fifty people, ___.', 'give or take', 'more or less', 'roughly speaking', 'All of the above', 'D', 'All three expressions can be used to indicate approximate numbers.', 'Vague Language', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'telling-time', NULL, 2, 'The class starts ___ half past nine.', 'in', 'on', 'at', 'by', 'C', 'We use "at" with clock times.', 'Telling the Time', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'telling-time', NULL, 3, 'It is ___ quarter to three.', 'a', 'the', 'an', 'no article', 'A', 'We say "a quarter to" or "a quarter past" with times.', 'Telling the Time', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'present-simple', NULL, 3, 'My father ___ as a doctor.', 'work', 'works', 'working', 'is work', 'B', 'Third person singular adds -s in present simple.', 'Present Simple', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'present-simple', NULL, 4, 'The shop ___ at 9 AM.', 'open', 'opens', 'opening', 'is open', 'B', 'We use present simple for schedules and timetables.', 'Present Simple', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'present-simple', NULL, 5, '___ your sister like chocolate?', 'Do', 'Does', 'Is', 'Has', 'B', 'Third person singular questions use "Does".', 'Present Simple: Questions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'adjectives-basic', NULL, 2, 'The sky is ___.', 'blue', 'a blue', 'bluely', 'the blue', 'A', 'Adjectives after "is/are" do not need an article.', 'Basic Adjectives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'adjectives-basic', NULL, 3, 'She is a ___ girl.', 'nice', 'nicely', 'nicer', 'more nice', 'A', 'Adjectives before nouns use the base form.', 'Basic Adjectives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'likes-dislikes', NULL, 3, 'I ___ listen to music.', 'like', 'likes', 'liking', 'am like', 'A', '"I" uses the base form of the verb in present simple.', 'Expressing Likes and Dislikes', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'likes-dislikes', NULL, 4, 'He doesn''t ___ vegetables.', 'likes', 'like', 'liking', 'liked', 'B', 'After "doesn''t", use the base form of the verb.', 'Expressing Likes and Dislikes', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'prepositions', 'direction', 4, 'She is walking ___ school.', 'at', 'to', 'in', 'on', 'B', '"To" shows direction or movement towards a place.', 'Prepositions of Direction', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'prepositions', 'place', 4, 'The cat is ___ the box.', 'under', 'on', 'in', 'All could be correct', 'D', 'The cat could be under, on, or in the box. Context matters.', 'Prepositions of Place', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'dates', NULL, 3, 'My birthday is ___ March.', 'at', 'on', 'in', 'by', 'C', 'We use "in" with months.', 'Prepositions of Time', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'dates', NULL, 4, 'Christmas Day is ___ the 25th of December.', 'in', 'on', 'at', 'by', 'B', 'We use "on" with specific dates.', 'Prepositions of Time', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'articles', NULL, 5, 'He goes to ___ school by bus.', 'a', 'an', 'the', 'no article', 'D', 'We say "go to school" (no article) when talking about the activity/purpose.', 'Articles: a/an/the', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'articles', NULL, 5, 'She plays ___ piano very well.', 'a', 'an', 'the', 'no article', 'C', 'We use "the" with musical instruments.', 'Articles: a/an/the', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'have-got', NULL, 2, 'I ___ got a new bike.', 'am', 'has', 'have', 'do', 'C', '"I" + "have got" for possession.', 'Have/Has Got', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'have-got', NULL, 3, '___ she got any pets?', 'Have', 'Has', 'Does', 'Is', 'B', 'Third person singular: "Has she got...?"', 'Have/Has Got', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'past-simple', 'irregular', 14, 'She ___ a new dress for the party.', 'buyed', 'bought', 'buying', 'buy', 'B', '"Bought" is the irregular past form of "buy".', 'Past Simple: Irregular Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'past-simple', 'irregular', 15, 'The children ___ in the pool all afternoon.', 'swam', 'swimmed', 'swum', 'swimming', 'A', '"Swam" is the past simple form of "swim".', 'Past Simple: Irregular Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'past-simple', 'irregular', 15, 'He ___ me a lovely card on my birthday.', 'sended', 'send', 'sent', 'sended', 'C', '"Sent" is the irregular past form of "send".', 'Past Simple: Irregular Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'past-simple', 'negative', 13, 'I ___ go to the gym yesterday.', 'don''t', 'didn''t', 'wasn''t', 'not', 'B', 'Past simple negative: didn''t + base form.', 'Past Simple: Negatives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'past-simple', 'negative', 14, 'She didn''t ___ the answer.', 'knew', 'known', 'know', 'knows', 'C', 'After "didn''t", always use the base form of the verb.', 'Past Simple: Negatives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'comparatives', NULL, 15, 'Today is ___ than yesterday.', 'hotter', 'more hot', 'hotest', 'most hot', 'A', 'Short adjectives ending in consonant-vowel-consonant double the final consonant: hot > hotter.', 'Comparatives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'comparatives', NULL, 16, 'Swimming is ___ than running.', 'gooder', 'more good', 'better', 'best', 'C', '"Better" is the irregular comparative of "good".', 'Comparatives: Irregular', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'superlatives', NULL, 16, 'That was the ___ meal I have ever had.', 'worse', 'worst', 'most bad', 'baddest', 'B', '"Worst" is the irregular superlative of "bad".', 'Superlatives: Irregular', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'some-any', NULL, 13, 'Would you like ___ tea?', 'any', 'some', 'a', 'many', 'B', 'We use "some" in offers and requests, even in questions.', 'Some/Any', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'some-any', NULL, 14, 'There aren''t ___ eggs left.', 'some', 'no', 'any', 'much', 'C', '"Any" is used in negative sentences.', 'Some/Any', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'countable-uncountable', NULL, 15, 'How ___ people came to the party?', 'much', 'many', 'a lot', 'lots', 'B', '"Many" is used with countable plural nouns in questions.', 'Much/Many/A Lot of', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'present-simple-vs-continuous', NULL, 17, 'I usually walk to work, but today I ___ the bus.', 'take', 'takes', 'am taking', 'took', 'C', '"Today" shows a temporary change from the usual routine (present continuous).', 'Present Simple vs Continuous', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'present-simple-vs-continuous', NULL, 18, 'I ___ coffee, but right now I''m drinking tea.', 'love', 'am loving', 'loving', 'loves', 'A', '"Love" is a stative verb and is usually used in present simple.', 'Stative Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'possessives', NULL, 15, 'That pen is ___, not ___.', 'my / your', 'mine / yours', 'mine / your', 'my / yours', 'B', 'Possessive pronouns (mine, yours) stand alone without a noun.', 'Possessive Pronouns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'adverbs-manner', NULL, 14, 'She speaks English very ___.', 'good', 'well', 'better', 'best', 'B', '"Well" is the adverb form of "good". Adverbs modify verbs.', 'Adverbs of Manner', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'adverbs-manner', NULL, 15, 'He drives very ___.', 'careful', 'carefully', 'careless', 'more careful', 'B', 'Adverbs of manner are formed by adding -ly to the adjective.', 'Adverbs of Manner', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'how-much-many', NULL, 14, '___ does this shirt cost?', 'How many', 'How much', 'How long', 'How far', 'B', '"How much" is used for price/cost questions.', 'How much / How many', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'how-much-many', NULL, 15, '___ languages can you speak?', 'How much', 'How many', 'How long', 'How well', 'B', '"How many" is used with countable nouns.', 'How much / How many', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'imperatives', NULL, 14, '___ turn left at the traffic lights.', 'You', 'Let''s', 'Don''t', 'Please', 'C', '"Don''t + base verb" for negative instructions/commands.', 'Giving Directions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'suggestions', NULL, 16, '___ go to the cinema tonight?', 'Will we', 'Shall we', 'Do we', 'Are we', 'B', '"Shall we...?" is used to make suggestions.', 'Making Suggestions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'suggestions', NULL, 17, 'Why ___ we try that new restaurant?', 'don''t', 'aren''t', 'shouldn''t', 'won''t', 'A', '"Why don''t we...?" is a common way to make a suggestion.', 'Making Suggestions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'connectors', NULL, 15, 'Would you like tea ___ coffee?', 'and', 'but', 'or', 'so', 'C', '"Or" offers a choice between alternatives.', 'Basic Connectors', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'past-continuous', NULL, 18, 'What ___ you doing at 8 PM last night?', 'was', 'were', 'did', 'are', 'B', '"You" uses "were" in past continuous questions.', 'Past Continuous', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'would-like', NULL, 13, 'I ___ like a glass of water, please.', 'will', 'would', 'am', 'do', 'B', '"Would like" is a polite way to express a want or desire.', 'Would Like / Want', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'would-like', NULL, 14, '___ you like to come to my party?', 'Do', 'Would', 'Are', 'Will', 'B', '"Would you like to...?" is a polite invitation.', 'Would Like / Want', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'present-perfect-continuous', NULL, 27, 'I ___ waiting for you for an hour!', 'have been', 'am', 'was', 'had been', 'A', 'Present perfect continuous: have/has been + -ing for duration up to now.', 'Present Perfect Continuous', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'present-perfect-continuous', NULL, 28, 'She ___ studying English for three years.', 'is', 'was', 'has been', 'had been', 'C', 'Present perfect continuous for an action that started in the past and continues now.', 'Present Perfect Continuous', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'present-perfect-continuous', NULL, 29, 'Your eyes are red. ___ you been crying?', 'Were', 'Are', 'Have', 'Did', 'C', 'Present perfect continuous: Have + subject + been + -ing for recent actions with visible results.', 'Present Perfect Continuous', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'modals', 'necessity', 25, 'You ___ to arrive at the airport two hours before your flight.', 'must', 'have', 'should', 'can', 'B', '"Have to" expresses external obligation or necessity.', 'Modal Verbs: have to', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'modals', 'necessity', 26, 'You ___ shout. I can hear you perfectly well.', 'mustn''t', 'don''t need to', 'shouldn''t', 'can''t', 'B', '"Don''t need to" means it is not necessary.', 'Modal Verbs: don''t have to / needn''t', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'modals', 'prohibition', 26, 'You ___ park here. It''s a no-parking zone.', 'don''t have to', 'needn''t', 'mustn''t', 'shouldn''t', 'C', '"Mustn''t" means it is forbidden/not allowed.', 'Modal Verbs: mustn''t vs don''t have to', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'past-continuous', NULL, 25, 'When I saw her, she ___ a red dress.', 'wore', 'was wearing', 'wears', 'is wearing', 'B', 'Past continuous describes what was happening at a specific past moment.', 'Past Continuous', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'past-continuous', NULL, 26, 'While I ___, someone stole my wallet.', 'shopped', 'shop', 'was shopping', 'am shopping', 'C', '"While" + past continuous for the longer action interrupted by a shorter one.', 'Past Continuous vs Past Simple', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'relative-clauses', 'non-defining', 28, 'My sister, ___ lives in Paris, is visiting next week.', 'that', 'who', 'which', 'whom', 'B', 'Non-defining relative clauses use "who" (not "that") for people, with commas.', 'Non-Defining Relative Clauses', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'relative-clauses', 'where', 27, 'That''s the restaurant ___ we had dinner.', 'which', 'that', 'where', 'when', 'C', '"Where" is used for places in relative clauses.', 'Relative Clauses: where/when', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'relative-clauses', 'when', 28, 'Do you remember the day ___ we first met?', 'where', 'which', 'when', 'that', 'C', '"When" is used for times in relative clauses.', 'Relative Clauses: where/when', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'reported-speech', 'commands', 28, 'The teacher told us ___ quiet.', 'be', 'being', 'to be', 'were', 'C', 'Reported commands: told + object + to + base verb.', 'Reported Commands', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'reported-speech', 'requests', 29, 'She asked me ___ the window.', 'close', 'closing', 'to close', 'closed', 'C', 'Reported requests: asked + object + to + base verb.', 'Reported Requests', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'conditionals', 'first conditional', 26, 'If you don''t hurry, we ___ miss the bus.', 'would', 'will', 'might', 'Both B and C', 'D', 'First conditional can use "will" or "might" in the result clause.', 'First Conditional', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'conditionals', 'first conditional', 27, 'Unless you ___ a taxi, you''ll be late.', 'take', 'will take', 'took', 'would take', 'A', '"Unless" means "if not" and takes present simple.', 'Unless in Conditionals', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'purpose', NULL, 25, 'She went to the shop ___ buy some bread.', 'for', 'for to', 'to', 'so', 'C', '"To + base verb" expresses purpose.', 'Expressing Purpose', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'purpose', NULL, 27, 'I turned off my phone ___ I could concentrate.', 'in order to', 'so that', 'for', 'to', 'B', '"So that" + subject + could/can for purpose with a clause.', 'Expressing Purpose', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'ability', NULL, 26, 'After months of practice, she ___ finally play the song.', 'could', 'was able to', 'can', 'Both A and B', 'B', '"Was able to" for a specific past achievement. "Could" for general past ability.', 'Can / Could / Be Able To', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'verb-patterns', NULL, 28, 'I don''t mind ___ late if it''s necessary.', 'work', 'working', 'to work', 'worked', 'B', '"Mind" is followed by a gerund (-ing).', 'Verb Patterns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'verb-patterns', NULL, 29, 'He promised ___ on time.', 'arriving', 'arrive', 'to arrive', 'arrived', 'C', '"Promise" is followed by the infinitive (to + verb).', 'Verb Patterns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'verb-patterns', NULL, 30, 'She let me ___ her car.', 'to use', 'using', 'use', 'used', 'C', '"Let" is followed by object + base verb (no "to").', 'Verb Patterns: let/make/help', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'narrative-tenses', NULL, 33, 'I ___ home when I realised I ___ my phone at work.', 'was walking / had left', 'walked / left', 'had walked / left', 'was walking / left', 'A', 'Past continuous for the background action; past perfect for the earlier action.', 'Narrative Tenses', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'narrative-tenses', NULL, 34, 'She ___ for the company for five years before she got promoted.', 'worked', 'was working', 'had been working', 'has been working', 'C', 'Past perfect continuous for duration before another past event.', 'Past Perfect Continuous', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'phrasal-verbs', NULL, 35, 'The plane ___ an hour late because of the storm.', 'took off', 'took on', 'took up', 'took over', 'A', '"Take off" means to leave the ground (for aircraft).', 'Phrasal Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'phrasal-verbs', NULL, 36, 'We need to ___ a solution to this problem.', 'come up with', 'come across', 'come along', 'come about', 'A', '"Come up with" means to think of or produce an idea or solution.', 'Phrasal Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'phrasal-verbs', NULL, 37, 'I ___ my old school friend by chance in the supermarket.', 'ran into', 'ran out of', 'ran over', 'ran up', 'A', '"Run into" means to meet someone unexpectedly.', 'Phrasal Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'phrasal-verbs', NULL, 38, 'The meeting has been ___ until next week.', 'called off', 'put off', 'turned off', 'set off', 'B', '"Put off" means to postpone to a later date.', 'Phrasal Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'modals', 'past speculation', 36, 'She ___ taken the bus. I''m not sure how she got here.', 'must have', 'might have', 'should have', 'would have', 'B', '"Might have" + past participle for uncertain speculation about the past.', 'Modal Verbs: Past Speculation', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'modals', 'past criticism', 37, 'You ___ told her the truth. Now she''s angry.', 'might have', 'must have', 'should have', 'could have', 'C', '"Should have" + past participle for regret or criticism about the past.', 'Modal Verbs: should have / could have', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'modals', 'past ability', 37, 'I ___ helped you, but you didn''t ask me.', 'should have', 'must have', 'could have', 'might have', 'C', '"Could have" + past participle for an unused ability or opportunity in the past.', 'Modal Verbs: could have', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'conditionals', 'second conditional', 34, 'What would you do if you ___ a million dollars?', 'win', 'won', 'would win', 'had won', 'B', 'Second conditional: If + past simple for hypothetical present/future.', 'Second Conditional', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'conditionals', 'third conditional', 37, 'If he ___ the alarm, he wouldn''t have missed the bus.', 'heard', 'hears', 'had heard', 'would hear', 'C', 'Third conditional: If + past perfect for unreal past situations.', 'Third Conditional', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'ing-ed-adjectives', NULL, 32, 'The film was really ___. I nearly fell asleep.', 'bored', 'boring', 'bore', 'boringly', 'B', '-ing adjectives describe the thing/person causing the feeling.', '-ing vs -ed Adjectives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'ing-ed-adjectives', NULL, 33, 'I''m ___ in learning more about history.', 'interesting', 'interested', 'interest', 'interestingly', 'B', '-ed adjectives describe how someone feels.', '-ing vs -ed Adjectives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'articles-advanced', NULL, 34, '___ crime is a serious problem in many cities.', 'A', 'An', 'The', 'no article', 'D', 'No article with uncountable/abstract nouns when speaking generally.', 'Articles: Advanced Uses', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'articles-advanced', NULL, 35, '___ Nile is the longest river in Africa.', 'A', 'An', 'The', 'no article', 'C', '"The" is used with rivers, oceans, seas, and mountain ranges.', 'Articles: Advanced Uses', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'so-such', NULL, 33, 'It was ___ a beautiful day that we went to the beach.', 'so', 'such', 'very', 'too', 'B', '"Such + a/an + adjective + noun" for emphasis.', 'So / Such', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'so-such', NULL, 34, 'The film was ___ long that I fell asleep.', 'such', 'too', 'so', 'very', 'C', '"So + adjective + that" for emphasis.', 'So / Such', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'determiners', NULL, 35, '___ of the options is acceptable. You can choose any one.', 'Both', 'Either', 'Neither', 'All', 'B', '"Either" means one or the other of two things.', 'Both / Either / Neither', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'determiners', NULL, 36, '___ of the answers was correct. All students failed.', 'Both', 'Either', 'Neither', 'Each', 'C', '"Neither" means not one and not the other of two things.', 'Both / Either / Neither', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'emphasis', NULL, 38, 'It''s the way she speaks ___ annoys me, not what she says.', 'which', 'that', 'what', 'who', 'B', '"It is/It''s... that..." is a cleft sentence for emphasis.', 'Emphasis: Cleft Sentences', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'reported-speech', NULL, 36, 'He said that he ___ for a new job.', 'is looking', 'was looking', 'looks', 'has looked', 'B', 'In reported speech, present continuous becomes past continuous.', 'Reported Speech: Tense Changes', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'reported-speech', NULL, 37, 'She asked me if I ___ been to London.', 'have', 'had', 'has', 'was', 'B', 'Present perfect "have been" becomes past perfect "had been" in reported speech.', 'Reported Speech: Tense Changes', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'conditionals', 'alternatives to if', 45, '___ you need any further information, please do not hesitate to contact us.', 'If', 'Should', 'Would', 'Both A and B', 'D', '"Should you need..." is a formal alternative to "If you need..."', 'Formal Conditional Alternatives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'conditionals', 'alternatives to if', 46, '___ it not been for your help, I would have failed.', 'If', 'Had', 'Were', 'Should', 'B', '"Had it not been for..." is a formal third conditional inversion.', 'Conditional Inversion', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'conditionals', 'alternatives to if', 47, '___ I to win the lottery, I would donate half to charity.', 'If', 'Should', 'Were', 'Had', 'C', '"Were I to..." is a formal second conditional inversion.', 'Conditional Inversion', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'passive', 'impersonal', 44, 'It ___ that the company will announce job cuts.', 'is believed', 'believes', 'has believed', 'is believing', 'A', 'Impersonal passive: "It is believed/said/thought that..." for reporting.', 'Impersonal Passive', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'passive', 'impersonal', 45, 'The suspect is thought ___ left the country.', 'to', 'to have', 'having', 'that he', 'B', 'Personal passive: subject + is thought + to have + past participle.', 'Impersonal Passive', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'passive', 'impersonal', 46, 'He is said ___ the richest man in the city.', 'being', 'that is', 'to be', 'he is', 'C', 'Personal passive: subject + is said + to be + complement.', 'Impersonal Passive', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'noun-clauses', NULL, 45, '___ she said surprised everyone.', 'That', 'What', 'Which', 'How', 'B', '"What" introduces a noun clause functioning as the subject.', 'Noun Clauses', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'noun-clauses', NULL, 46, 'I don''t understand ___ he refused the offer.', 'that', 'what', 'why', 'which', 'C', '"Why" introduces a noun clause as the object of "understand".', 'Noun Clauses', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'causative', NULL, 44, 'The manager had the report ___ before the deadline.', 'rewriting', 'rewrite', 'rewritten', 'to rewrite', 'C', 'Causative: had + object + past participle (someone else did it).', 'Causative Structures', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'causative', NULL, 46, 'I''ll get my brother ___ the computer.', 'fix', 'fixing', 'to fix', 'fixed', 'C', '"Get someone to do something" = persuade them to do it.', 'Causative Structures', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'adverbials', NULL, 45, '___, the experiment was a success.', 'Hopeful', 'Hopingly', 'Fortunately', 'Fortunate', 'C', 'Comment adverbials (Fortunately, Surprisingly) modify the whole sentence.', 'Comment Adverbials', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'adverbials', NULL, 46, 'The project, ___, was completed on time.', 'surprising', 'surprisingly', 'to surprising', 'surprisedly', 'B', 'Comment adverbials can be placed mid-sentence between commas.', 'Comment Adverbials', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'complex-sentences', NULL, 47, 'The more you practise, the ___ you will become.', 'good', 'better', 'best', 'well', 'B', '"The more... the more/better..." is a double comparative pattern.', 'Double Comparatives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'complex-sentences', NULL, 48, 'Much ___ I admire her work, I disagree with her conclusion.', 'as', 'though', 'despite', 'however', 'A', '"Much as..." introduces a concessive clause.', 'Concessive Structures', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'would-rather', NULL, 44, 'I''d rather you ___ anyone about this.', 'don''t tell', 'didn''t tell', 'not tell', 'won''t tell', 'B', '"Would rather + someone + past simple" for preferences about others'' actions.', 'Would Rather / Had Better', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'would-rather', NULL, 45, 'You''d better ___ late or the boss will be angry.', 'not to be', 'not be', 'don''t be', 'not being', 'B', '"Had better not + base verb" for strong advice/warning.', 'Would Rather / Had Better', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'linking', NULL, 47, 'She performed well ___ being ill.', 'although', 'despite', 'however', 'whereas', 'B', '"Despite" + noun/gerund for concession within a sentence.', 'Advanced Linking Words', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'linking', NULL, 48, 'The costs have risen; ___, profits have fallen.', 'although', 'despite', 'consequently', 'despite this', 'C', '"Consequently" shows cause and effect between clauses.', 'Advanced Linking Words', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'linking', NULL, 49, 'He is wealthy. ___, he is not happy.', 'Nonetheless', 'Furthermore', 'Therefore', 'Moreover', 'A', '"Nonetheless" means despite this fact; introduces a contrast.', 'Advanced Linking Words', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'advanced-verbs', NULL, 53, 'I can''t help ___ whether we made the right decision.', 'wonder', 'to wonder', 'wondering', 'but wonder', 'D', '"Can''t help but + base verb" is a formal fixed expression meaning "unable to avoid".', 'Advanced Verb Patterns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'advanced-verbs', NULL, 54, 'The proposal is well worth ___.', 'to consider', 'considering', 'consider', 'considered', 'B', '"Worth" is followed by a gerund: "worth considering".', 'Advanced Verb Patterns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'advanced-verbs', NULL, 55, 'She so much as ___ in the wrong direction and her mother would scold her.', 'looks', 'looked', 'look', 'looking', 'B', '"So much as + past simple" in a conditional-like structure for the slightest action.', 'Advanced Conditional Structures', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'complex-prepositions', NULL, 53, 'The decision was taken ___ the objections of several board members.', 'in spite', 'regardless', 'notwithstanding', 'irrespective', 'C', '"Notwithstanding" is a formal preposition meaning "in spite of".', 'Formal Prepositions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'complex-prepositions', NULL, 54, 'The event proceeded ___ plan.', 'as per', 'in line', 'pursuant to', 'according', 'A', '"As per" means "according to" or "in accordance with".', 'Formal Prepositions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'tense-nuance', NULL, 55, 'I wish I ___ you earlier. I only just found out myself.', 'could tell', 'could have told', 'told', 'had told', 'B', '"I wish I could have told you" expresses inability in the past, whereas "had told" implies choice.', 'Advanced Wish Structures', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'tense-nuance', NULL, 56, 'It''s high time you ___ looking for a job.', 'start', 'started', 'would start', 'had started', 'B', '"It''s high time + past simple" means something should have happened already.', 'It''s Time / High Time', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'tense-nuance', NULL, 57, 'Sooner had she arrived ___ the problems began.', 'that', 'when', 'than', 'and', 'C', '"No sooner had... than..." is the correct correlative structure.', 'No Sooner... Than / Hardly... When', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'concession-advanced', NULL, 55, '___ though it may seem, his story is entirely true.', 'Strange', 'Strangely', 'As strange', 'However strange', 'A', '"Adjective + though + subject + may + verb" is a formal concessive pattern.', 'Advanced Concessive Structures', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'concession-advanced', NULL, 56, '___ that as it may, the fact remains that costs are too high.', 'Be', 'Being', 'To be', 'Been', 'A', '"Be that as it may" is a fixed subjunctive expression meaning "even so".', 'Fixed Formal Expressions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'word-order-advanced', NULL, 55, 'So ___ was her anger that she couldn''t speak.', 'big', 'much', 'great', 'large', 'C', '"So great was..." is an inverted emphatic structure. "Great" collocates with abstract emotions.', 'Emphatic Word Order', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'word-order-advanced', NULL, 56, 'Away ___ the birds as the children approached.', 'fly', 'flew', 'flying', 'had flown', 'B', 'Adverbial fronting with full inversion: "Away flew the birds."', 'Fronting and Inversion', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'modality-advanced', NULL, 56, 'The letter ___ have been written by Shakespeare himself, but scholars remain divided.', 'might well', 'must', 'should', 'will', 'A', '"Might well have" expresses strong but uncertain possibility.', 'Nuanced Modal Usage', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'modality-advanced', NULL, 57, 'She ___ not have acted more professionally. She was exemplary.', 'might', 'would', 'could', 'should', 'C', '"Could not have" denotes that it was impossible to do better: it was the best possible.', 'Nuanced Modal Usage', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'modality-advanced', NULL, 58, 'You ___ well ask why I didn''t complain. The answer is simple.', 'may', 'might', 'could', 'should', 'A', '"You may well ask" acknowledges that the listener''s natural question is valid.', 'Nuanced Modal Usage', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'pragmatics', NULL, 57, 'I don''t suppose you could ___ me a favour, could you?', 'make', 'do', 'give', 'take', 'B', '"Do someone a favour" is the correct collocation for requests.', 'Pragmatic Competence', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'pragmatics', NULL, 58, 'Far ___ it from me to criticise, but I think there''s a better approach.', 'is', 'was', 'be', 'being', 'C', '"Far be it from me to..." is a fixed subjunctive expression used to soften criticism.', 'Diplomatic Language', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'lexical-precision', NULL, 57, 'The minister ___ any allegations of corruption.', 'refused', 'rejected', 'denied', 'declined', 'C', '"Deny allegations" is the correct collocation. "Refuse" is for requests; "reject" for proposals.', 'Lexical Precision', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'lexical-precision', NULL, 58, 'The painting ___ a sense of profound melancholy.', 'gives', 'conveys', 'performs', 'carries', 'B', '"Convey a sense of" is the precise academic/literary expression.', 'Academic Vocabulary', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'lexical-precision', NULL, 59, 'The data is ___ with previous findings.', 'compatible', 'consistent', 'coherent', 'concurrent', 'B', '"Consistent with" is used in academic contexts for data that agrees.', 'Academic Vocabulary', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'clause-linking', NULL, 57, 'Inasmuch ___ the contract was breached, the company reserves the right to seek damages.', 'that', 'as', 'so', 'which', 'B', '"Inasmuch as" is a formal conjunction meaning "because" or "to the extent that".', 'Formal Clause Linking', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'clause-linking', NULL, 58, 'The proposal, ___ ambitious, lacked practical detail.', 'despite being', 'albeit', 'however', 'Both A and B', 'D', 'Both "despite being" and "albeit" work as concessive linkers here.', 'Formal Clause Linking', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'articles', NULL, 3, 'Is there ___ hospital near here?', 'a', 'an', 'the', 'some', 'A', '"A" is used before consonant sounds for something non-specific.', 'Articles: a/an/the', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'articles', NULL, 4, 'I want ___ umbrella. It''s raining.', 'a', 'an', 'the', 'some', 'B', '"An" is used before vowel sounds. "Umbrella" starts with /ʌ/.', 'Articles: a/an/the', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'present-simple', NULL, 4, 'He ___ TV every evening.', 'watch', 'watches', 'watching', 'is watch', 'B', 'Third person singular: add -es to verbs ending in -ch.', 'Present Simple', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'present-simple', NULL, 5, 'We ___ in a flat in the city centre.', 'lives', 'living', 'live', 'is living', 'C', '"We" uses the base form in present simple.', 'Present Simple', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'present-simple', NULL, 5, 'She never ___ to work by car.', 'drive', 'drives', 'driving', 'drove', 'B', 'Adverb of frequency doesn''t change the verb form; "she" still needs -s.', 'Present Simple', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'pronouns', 'object', 3, 'I love ___. She is my best friend.', 'she', 'her', 'hers', 'herself', 'B', '"Her" is the object pronoun for "she".', 'Object Pronouns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'pronouns', 'object', 4, 'Can you help ___?', 'we', 'our', 'us', 'ours', 'C', '"Us" is the object pronoun for "we".', 'Object Pronouns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'conjunctions-basic', NULL, 3, 'I like tea ___ coffee.', 'or', 'but', 'and', 'so', 'C', '"And" connects two things you like.', 'Basic Conjunctions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'conjunctions-basic', NULL, 4, 'Do you want juice ___ water?', 'and', 'but', 'or', 'so', 'C', '"Or" offers a choice between two options.', 'Basic Conjunctions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'nationalities', NULL, 3, 'He is from France. He is ___.', 'France', 'Franch', 'French', 'Francese', 'C', 'The adjective/nationality for France is "French".', 'Countries and Nationalities', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'positions', NULL, 3, 'The picture is ___ the wall.', 'in', 'at', 'on', 'under', 'C', 'Pictures hang "on" walls (surfaces).', 'Prepositions of Place', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'positions', NULL, 4, 'The dog is sleeping ___ the table.', 'on', 'under', 'in', 'at', 'B', '"Under" means below or beneath.', 'Prepositions of Place', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'demonstratives', NULL, 4, 'Who is ___ man over there?', 'this', 'that', 'these', 'those', 'B', '"That" is used for singular things far from the speaker.', 'Demonstratives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'demonstratives', NULL, 5, '___ flowers in the garden are beautiful.', 'This', 'That', 'These', 'Those', 'D', '"Those" is the plural of "that" for things far from the speaker.', 'Demonstratives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'question-words', NULL, 4, '___ old are you?', 'What', 'Who', 'How', 'Why', 'C', '"How old" asks about age.', 'Question Words', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'question-words', NULL, 5, '___ is your favourite sport?', 'Who', 'When', 'What', 'Where', 'C', '"What" asks for specific information about things.', 'Question Words', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'can-requests', NULL, 4, '___ I have a glass of water, please?', 'Am', 'Do', 'Can', 'Have', 'C', '"Can" is used to make requests.', 'Can for Requests', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'can-requests', NULL, 5, '___ you open the window, please?', 'Do', 'Are', 'Can', 'Is', 'C', '"Can you...?" is a polite request.', 'Can for Requests', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'there-is-are', NULL, 3, 'There ___ a cat in the garden.', 'are', 'is', 'am', 'be', 'B', '"There is" + singular noun.', 'There is/There are', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'there-is-are', NULL, 4, '___ there any milk in the fridge?', 'Are', 'Is', 'Do', 'Does', 'B', '"Is there" + uncountable noun for questions.', 'There is/There are', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'suggestions-basic', NULL, 5, '___ go to the park!', 'We', 'Let''s', 'We are', 'Do we', 'B', '"Let''s" + base verb for suggestions.', 'Making Suggestions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'past-simple', NULL, 16, 'We ___ dinner at an Italian restaurant.', 'eat', 'ate', 'eaten', 'eats', 'B', '"Ate" is the past simple of "eat".', 'Past Simple: Irregular Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'past-simple', NULL, 16, 'I ___ a strange noise during the night.', 'heared', 'hear', 'heard', 'hearing', 'C', '"Heard" is the past simple of "hear".', 'Past Simple: Irregular Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'past-simple', NULL, 17, 'They ___ to Spain on holiday last year.', 'fly', 'flied', 'flew', 'flown', 'C', '"Flew" is the past simple of "fly".', 'Past Simple: Irregular Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'past-simple', NULL, 17, 'She ___ her key and couldn''t open the door.', 'lose', 'losed', 'lost', 'loosing', 'C', '"Lost" is the past simple of "lose".', 'Past Simple: Irregular Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'there-was-were', NULL, 13, 'There ___ a big storm last night.', 'is', 'was', 'were', 'are', 'B', '"There was" + singular noun for past existence.', 'There was/There were', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'there-was-were', NULL, 14, 'There ___ many people at the concert.', 'is', 'was', 'were', 'are', 'C', '"There were" + plural noun for past existence.', 'There was/There were', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'reflexive-pronouns', NULL, 16, 'Be careful! You might hurt ___.', 'you', 'your', 'yourself', 'yours', 'C', '"Yourself" is the reflexive pronoun when subject and object are the same.', 'Reflexive Pronouns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'reflexive-pronouns', NULL, 17, 'The children made the cake by ___.', 'them', 'their', 'themselves', 'theirs', 'C', '"By themselves" means without help.', 'Reflexive Pronouns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'could-past', NULL, 15, 'When I was young, I ___ run very fast.', 'can', 'could', 'was able', 'am able', 'B', '"Could" is used for general past ability.', 'Could for Past Ability', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'could-past', NULL, 16, 'She ___ read when she was four years old.', 'can', 'could', 'was can', 'did can', 'B', '"Could" expresses ability in the past.', 'Could for Past Ability', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'possessive-pronouns', NULL, 16, 'Is this your book? No, it''s ___.', 'her', 'hers', 'she', 'herself', 'B', '"Hers" is a possessive pronoun that replaces "her book".', 'Possessive Pronouns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'possessive-pronouns', NULL, 17, 'That car is ___. We bought it last week.', 'our', 'us', 'ours', 'we', 'C', '"Ours" is a possessive pronoun standing alone.', 'Possessive Pronouns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'prepositions', NULL, 17, 'I arrived ___ the airport two hours before my flight.', 'to', 'in', 'at', 'on', 'C', '"At" is used with the airport, station, and specific locations.', 'Prepositions of Place', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'prepositions', NULL, 18, 'She''s been waiting ___ 3 o''clock.', 'for', 'since', 'from', 'at', 'B', '"Since" is used with a specific point in time.', 'Prepositions of Time', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'directions', NULL, 15, 'Go ___ at the traffic lights.', 'on straight', 'straight on', 'straightly', 'to straight', 'B', '"Straight on" or "straight ahead" means continue forward.', 'Giving Directions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'directions', NULL, 16, 'Turn right and the bank is ___ the left.', 'at', 'in', 'on', 'to', 'C', '"On the left/right" for positions.', 'Giving Directions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'should-advice', NULL, 16, 'You ___ eat too much sugar. It''s bad for you.', 'should', 'shouldn''t', 'must', 'can', 'B', '"Shouldn''t" is used for gentle advice against something.', 'Should for Advice', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'should-advice', NULL, 17, 'You look tired. You ___ go to bed.', 'should', 'shouldn''t', 'must', 'can', 'A', '"Should" gives friendly advice.', 'Should for Advice', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'like-vs-would-like', NULL, 17, 'She likes ___ in the morning.', 'swim', 'swimming', 'to swimming', 'swims', 'B', '"Like + -ing" for enjoyment of activities in general.', 'Like + -ing / Would like + to', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'like-vs-would-like', NULL, 18, 'I''d like ___ to Paris one day.', 'going', 'go', 'to go', 'went', 'C', '"Would like + to + base verb" for specific wishes/desires.', 'Like + -ing / Would like + to', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'present-perfect', NULL, 24, 'She has ___ been to Italy. This is her first time.', 'ever', 'never', 'already', 'just', 'B', '"Never" in present perfect for something that has not happened at any time.', 'Present Perfect: ever/never', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'present-perfect', NULL, 28, 'How long ___ you known each other?', 'did', 'do', 'have', 'are', 'C', '"How long have you...?" for duration questions with present perfect.', 'Present Perfect: for/since', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'modals', 'ought-to', 26, 'You ___ to apologise. It was your fault.', 'should', 'ought', 'must', 'have', 'B', '"Ought to" is similar to "should" for strong advice.', 'Ought to', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'modals', 'had-better', 28, 'You''d better ___ now or you''ll miss the train.', 'to leave', 'leaving', 'leave', 'left', 'C', '"Had better + base verb" for strong advice/warning.', 'Had Better', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'conditionals', 'first conditional', 28, 'If she ___ enough money, she will buy a new phone.', 'saves', 'will save', 'saved', 'would save', 'A', 'First conditional if-clause uses present simple.', 'First Conditional', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'conditionals', 'first conditional', 29, 'I won''t go out unless it ___ raining.', 'will stop', 'stopped', 'stops', 'would stop', 'C', '"Unless" = "if not" and takes present simple in first conditional.', 'Unless in Conditionals', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'passive', NULL, 27, 'This song ___ written by a famous artist.', 'is', 'was', 'has', 'had', 'B', 'Past simple passive: was/were + past participle.', 'Passive Voice: Past', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'passive', NULL, 28, 'These cars ___ made in Germany.', 'is', 'was', 'are', 'been', 'C', 'Present simple passive with plural subject: are + past participle.', 'Passive Voice: Present', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'used-to', NULL, 25, 'I ___ live in the countryside, but now I live in the city.', 'used to', 'use to', 'used', 'am used to', 'A', '"Used to + base verb" for past habits no longer true.', 'Used to', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'used-to', NULL, 26, 'Did you ___ wear glasses?', 'used to', 'use to', 'used', 'using to', 'B', 'In questions with "did", we use "use to" (not "used to").', 'Used to', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'gerund-subject', NULL, 26, '___ is good for your health.', 'Swim', 'Swimming', 'To swimming', 'The swim', 'B', 'Gerunds (-ing) can be used as the subject of a sentence.', 'Gerunds as Subject', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'passive', 'present-perfect', 29, 'The door ___ been locked.', 'is', 'was', 'has', 'had', 'C', 'Present perfect passive: has/have been + past participle.', 'Passive Voice: Present Perfect', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'agreement', NULL, 27, '"I love pizza." "___ do I."', 'So', 'Neither', 'Either', 'Too', 'A', '"So do I" shows agreement with a positive statement.', 'So do I / Neither do I', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'agreement', NULL, 28, '"I don''t like snakes." "___ do I."', 'So', 'Neither', 'Either', 'Not', 'B', '"Neither do I" shows agreement with a negative statement.', 'So do I / Neither do I', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'comparisons', NULL, 26, 'This exercise is not as ___ as the last one.', 'harder', 'hard', 'hardest', 'more hard', 'B', '"Not as + adjective + as" for comparisons of inequality.', 'As...as Comparisons', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'comparisons', NULL, 27, 'That''s ___ interesting book I''ve ever read.', 'more', 'most', 'the more', 'the most', 'D', '"The most + adjective" for superlatives with long adjectives.', 'Superlatives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'conditionals', 'second conditional', 33, 'If I ___ you, I''d take the job.', 'am', 'was', 'were', 'will be', 'C', '"Were" is the formal/correct form for all subjects in second conditional.', 'Second Conditional', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'conditionals', 'third conditional', 38, 'If we had left earlier, we ___ caught the train.', 'will have', 'would have', 'should have', 'could', 'B', 'Third conditional: would have + past participle for unreal past.', 'Third Conditional', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'passive-reporting', NULL, 37, 'The suspect is ___ to be hiding in the area.', 'think', 'thinking', 'thought', 'thinks', 'C', 'Passive reporting: subject + is + past participle (thought/believed/said) + to + verb.', 'Passive with Reporting Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'passive-reporting', NULL, 38, 'It is ___ that the president will resign.', 'reported', 'reporting', 'report', 'reports', 'A', '"It is reported/believed/said that..." for impersonal reporting.', 'Passive with Reporting Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'gerunds-infinitives', 'advanced', 36, 'I remember ___ the door, but it was open when I came back.', 'to lock', 'locking', 'lock', 'locked', 'B', '"Remember + -ing" = remember something you did before.', 'Remember/Forget + gerund/infinitive', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'gerunds-infinitives', 'advanced', 37, 'Please remember ___ the lights when you leave.', 'turning off', 'turn off', 'to turn off', 'turned off', 'C', '"Remember + to + verb" = don''t forget to do something.', 'Remember/Forget + gerund/infinitive', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'gerunds-infinitives', 'advanced', 38, 'He stopped ___ a cigarette. (He paused his walk to smoke.)', 'smoking', 'to smoke', 'smoke', 'smoked', 'B', '"Stop + to + verb" = pause in order to do something.', 'Stop + gerund/infinitive', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'subject-verb-agreement', NULL, 35, 'Neither the students nor the teacher ___ happy about the change.', 'are', 'were', 'was', 'have been', 'C', 'With "neither...nor", the verb agrees with the nearest subject (teacher = singular).', 'Subject-Verb Agreement', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'subject-verb-agreement', NULL, 36, 'A number of students ___ absent today.', 'is', 'was', 'are', 'has been', 'C', '"A number of" + plural noun takes a plural verb.', 'Subject-Verb Agreement', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'subject-verb-agreement', NULL, 37, 'The number of applicants ___ increased this year.', 'have', 'has', 'are', 'were', 'B', '"The number of" takes a singular verb.', 'Subject-Verb Agreement', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'inversion-basic', NULL, 39, 'Not only ___ she win the race, but she also broke the record.', 'did', 'has', 'was', 'had', 'A', '"Not only" triggers inversion: auxiliary + subject + verb.', 'Basic Inversion', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'inversion-basic', NULL, 40, 'Rarely ___ I seen such talent.', 'did', 'have', 'was', 'am', 'B', '"Rarely + have I" with present perfect inversion.', 'Basic Inversion', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'conjunctions-advanced', NULL, 36, 'She studied hard ___ she could pass the exam.', 'so that', 'in case', 'although', 'even though', 'A', '"So that" expresses purpose.', 'Advanced Conjunctions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'conjunctions-advanced', NULL, 37, 'Take an umbrella ___ it rains.', 'so that', 'in case', 'although', 'unless', 'B', '"In case" means as a precaution against something.', 'In Case / So That', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'conjunctions-advanced', NULL, 38, '___ tired she was, she finished the project.', 'Despite', 'in spite of', 'However', 'Although', 'C', '"However + adjective + subject + be" for concession.', 'However / Whatever / Wherever', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'purpose-reason', NULL, 35, '___ to the bad weather, the match was cancelled.', 'Because', 'Due', 'Since', 'As', 'B', '"Due to" + noun phrase for giving reasons.', 'Due to / Owing to / Because of', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'purpose-reason', NULL, 36, 'She went to the library ___ order to study.', 'for', 'in', 'so', 'with', 'B', '"In order to" + base verb for formal expression of purpose.', 'In Order To / So As To', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'inversion', NULL, 48, 'No sooner ___ he arrived than the meeting started.', 'did', 'had', 'has', 'was', 'B', '"No sooner had... than..." uses past perfect with inversion.', 'Inversion: No Sooner / Hardly', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'inversion', NULL, 49, 'At no time ___ the defendant show any remorse.', 'has', 'had', 'did', 'was', 'C', '"At no time" triggers inversion with "did" for past simple.', 'Inversion with Negative Adverbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'determiners-advanced', NULL, 45, '___ student must submit the assignment by Friday.', 'Every', 'All', 'Each', 'Both A and C', 'D', 'Both "Every" and "Each" + singular noun are correct here.', 'Every / Each / All', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'it-there', NULL, 46, 'There ___ to be a problem with the system.', 'seems', 'appears', 'Both A and B', 'looks', 'C', 'Both "seems" and "appears" work with "there" for impersonal observations.', 'There seems/appears to be', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'speculation', NULL, 47, 'He can''t ___ the thief. He was with me all evening.', 'be', 'have been', 'being', 'to be', 'B', '"Can''t have been" for impossibility in the past.', 'Modal Verbs: Past Speculation', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'complex-noun-phrases', NULL, 48, 'The decision ___ by the board last month has been overturned.', 'made', 'making', 'to make', 'which making', 'A', 'Reduced relative clause using past participle: "The decision made (=which was made) by..."', 'Reduced Relative Clauses', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'complex-noun-phrases', NULL, 49, 'The issues ___ in the report need urgent attention.', 'raising', 'raised', 'to raise', 'being raise', 'B', '"The issues raised" = "the issues that were raised" (reduced passive relative clause).', 'Reduced Relative Clauses', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'distancing', NULL, 48, 'The economy ___ said to be recovering.', 'has', 'is', 'was been', 'being', 'B', '"Is said to be" is a distancing expression used in news reporting.', 'Distancing Language', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'distancing', NULL, 49, '___ would appear that the policy has failed.', 'This', 'It', 'There', 'That', 'B', '"It would appear that..." is a formal distancing expression.', 'Distancing Language', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'literary-forms', NULL, 56, 'Whichever way you look at it, the fact ___ that we are losing money.', 'remains', 'remaining', 'is remaining', 'has remained', 'A', '"The fact remains that..." is a formal emphatic structure.', 'Formal Written Structures', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'literary-forms', NULL, 57, '___ I to disagree, it would make no difference.', 'If', 'Should', 'Were', 'Had', 'C', '"Were I to disagree" is a formal inverted second conditional.', 'Formal Conditional Inversion', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'literary-forms', NULL, 58, 'Suffice ___ to say, the experiment was a complete failure.', 'it', 'this', 'that', 'enough', 'A', '"Suffice it to say" is a fixed formal expression meaning "it is enough to say".', 'Formal Fixed Expressions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'emphasis-advanced', NULL, 57, 'It is precisely ___ reason that I refuse to participate.', 'for this', 'because of', 'of this', 'due to this', 'A', '"It is precisely for this reason that..." is a cleft sentence for precise emphasis.', 'Advanced Emphasis', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'emphasis-advanced', NULL, 58, 'Not for one moment ___ I doubt your sincerity.', 'have', 'did', 'do', 'had', 'C', '"Not for one moment do I..." is emphatic inversion in present tense.', 'Emphatic Inversion', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'circumlocution', NULL, 58, 'To all intents and ___, the project has been abandoned.', 'means', 'purposes', 'reasons', 'effects', 'B', '"To all intents and purposes" is a fixed expression meaning "in every practical sense".', 'Fixed Formal Expressions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'subjunctive', 'were', 56, 'If I ___ in your position, I would accept the offer.', 'am', 'was', 'were', 'would be', 'C', '"Were" is used for all subjects in formal/written second conditional (subjunctive).', 'Subjunctive Were', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'negation', NULL, 57, 'She is not so much lazy ___ unmotivated.', 'than', 'as', 'but', 'like', 'B', '"Not so much X as Y" means more Y than X.', 'Nuanced Negation', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'negation', NULL, 58, 'The decision was nothing ___ controversial.', 'but', 'short of', 'more than', 'if not', 'D', '"Nothing if not" means extremely; it intensifies the adjective.', 'Emphatic Negation', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'be-verb', NULL, 2, 'We ___ students at this school.', 'am', 'is', 'are', 'be', 'C', '"We" takes "are".', 'Verb to Be', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'be-verb', NULL, 3, 'It ___ cold today.', 'am', 'is', 'are', 'be', 'B', '"It" takes "is".', 'Verb to Be', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'be-verb', NULL, 4, 'He ___ not a doctor. He is a nurse.', 'am', 'is', 'are', 'be', 'B', '"He" takes "is" in negative: "He is not".', 'Verb to Be: Negatives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'plurals', NULL, 3, 'The ___ are playing in the garden.', 'babys', 'babyes', 'babies', 'baby', 'C', 'Words ending in consonant + y: change y to i and add -es.', 'Plural Nouns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'plurals', NULL, 4, 'I have three ___.', 'watchs', 'watches', 'watchies', 'watch', 'B', 'Words ending in -ch add -es.', 'Plural Nouns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'plurals', NULL, 4, 'There are two ___ in the basket.', 'loafs', 'loaves', 'loafes', 'loaf', 'B', 'Words ending in -f change to -ves: loaf > loaves.', 'Plural Nouns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'present-simple', NULL, 2, 'I ___ English and French.', 'speaks', 'speaking', 'speak', 'am speak', 'C', '"I" uses the base form in present simple.', 'Present Simple', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'can-ability', NULL, 3, '___ she drive a car?', 'Does', 'Is', 'Can', 'Has', 'C', '"Can" is used to ask about ability.', 'Can for Ability', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'prepositions', 'place', 3, 'The children are ___ school.', 'in', 'at', 'on', 'to', 'B', 'We say "at school" when referring to being there for its purpose.', 'Prepositions of Place', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'prepositions', 'time', 5, 'We don''t work ___ weekends.', 'in', 'on', 'at', 'for', 'C', '"At weekends" (British English) or "on weekends" (American English). Both are acceptable.', 'Prepositions of Time', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'pronouns', NULL, 4, 'Maria and ___ are going to the cinema.', 'me', 'my', 'I', 'mine', 'C', '"Maria and I" is the subject, so use subject pronoun "I".', 'Personal Pronouns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'possessives', NULL, 4, 'The ___ toys are in the box.', 'childrens', 'children''s', 'childrens''', 'children', 'B', 'Irregular plurals add ''s: children''s.', 'Possessive ''s', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'have-got', NULL, 4, 'They ___ got a big garden.', 'has', 'have', 'is', 'are', 'B', '"They" takes "have got".', 'Have/Has Got', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'there-is-are', NULL, 5, 'There ___ some water on the floor.', 'are', 'is', 'am', 'have', 'B', '"Water" is uncountable, so "There is".', 'There is/There are', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'word-order', NULL, 5, 'Which sentence is correct?', 'She likes very much chocolate.', 'She very much likes chocolate.', 'She likes chocolate very much.', 'Very much she likes chocolate.', 'C', 'Adverb phrases like "very much" go at the end of the sentence.', 'Word Order', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'question-words', NULL, 5, '___ much is this T-shirt?', 'What', 'How', 'Which', 'Why', 'B', '"How much" asks about price.', 'Question Words', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'present-simple', NULL, 5, 'She ___ to bed late on Fridays.', 'go', 'goes', 'going', 'gone', 'B', 'Third person singular + present simple = add -es to "go".', 'Present Simple', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'adjectives-basic', NULL, 4, 'The film was very ___.', 'interest', 'interesting', 'interested', 'interestingly', 'B', '-ing adjectives describe things. The film was interesting.', 'Basic Adjectives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'adjectives-basic', NULL, 5, 'I am very ___ in history.', 'interest', 'interesting', 'interested', 'interestedly', 'C', '-ed adjectives describe feelings. "I am interested."', 'Basic Adjectives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'articles', NULL, 6, '___ United Kingdom is in Europe.', 'A', 'An', 'The', 'no article', 'C', '"The" is used with country names that include Union, Republic, Kingdom, States.', 'Articles: a/an/the', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'past-simple', NULL, 18, 'Who ___ this painting?', 'paint', 'painted', 'did paint', 'paints', 'B', 'When "who" is the subject, we don''t use "did": "Who painted this?"', 'Past Simple: Subject Questions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'past-simple', NULL, 18, 'The meeting ___ two hours.', 'last', 'lasted', 'lasting', 'lasts', 'B', 'Regular past simple: add -ed to "last".', 'Past Simple: Regular Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'present-continuous', NULL, 16, 'Why ___ you wearing a coat? It''s hot!', 'do', 'are', 'is', 'did', 'B', 'Present continuous question: "Why are you wearing..."', 'Present Continuous: Questions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'present-continuous', NULL, 17, 'She ___ dinner at the moment.', 'cooks', 'cook', 'is cooking', 'cooked', 'C', '"At the moment" signals present continuous.', 'Present Continuous', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'future-going-to', NULL, 15, 'What ___ you going to do this weekend?', 'do', 'are', 'is', 'will', 'B', 'Going to questions: "What are you going to do?"', 'Going to for Future Plans', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'comparatives', NULL, 14, 'My car is ___ than your car.', 'fast', 'faster', 'fastest', 'more fast', 'B', 'Short adjectives: add -er for comparative.', 'Comparatives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'comparatives', NULL, 17, 'She is ___ intelligent than her brother.', 'most', 'more', 'very', 'much', 'B', 'Long adjectives use "more" for comparative.', 'Comparatives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'superlatives', NULL, 17, 'He is the ___ person I know.', 'funnyer', 'funniest', 'most funny', 'funnier', 'B', '"Funny" ends in consonant + y: change y to i and add -est.', 'Superlatives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'adverbs-manner', NULL, 16, 'She sang the song ___.', 'beautiful', 'beautifully', 'beauty', 'more beautiful', 'B', 'Adverbs of manner modify verbs; add -ly to "beautiful".', 'Adverbs of Manner', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'adverbs-frequency', NULL, 14, 'We ___ go to the beach in winter.', 'hardly ever', 'ever hardly', 'hard ever', 'hardest ever', 'A', '"Hardly ever" means almost never.', 'Adverbs of Frequency', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'conjunctions', NULL, 17, 'I like science ___ I find it interesting.', 'so', 'but', 'because', 'although', 'C', '"Because" gives the reason.', 'Conjunctions: and/but/so/because', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'there-was-were', NULL, 15, 'There ___ any milk in the fridge yesterday.', 'wasn''t', 'weren''t', 'isn''t', 'didn''t', 'A', '"Milk" is uncountable, so "wasn''t" (singular).', 'There was/There were', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'will-future', NULL, 17, '"The phone is ringing!" "I ___ answer it."', 'am going to', 'will', 'am', 'do', 'B', '"Will" for instant/spontaneous decisions.', 'Will for Spontaneous Decisions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'will-future', NULL, 18, 'I promise I ___ be late again.', 'don''t', 'am not', 'won''t', 'wasn''t', 'C', '"Will" is used for promises: "I won''t be late."', 'Will for Promises', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'countable-uncountable', NULL, 16, 'Can I have ___ water, please?', 'a', 'an', 'some', 'any', 'C', '"Some" with uncountable nouns in requests.', 'Some/Any', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'past-continuous', NULL, 19, 'It ___ raining when I left the house.', 'is', 'was', 'were', 'been', 'B', '"It" + "was" + -ing for past continuous.', 'Past Continuous', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'present-simple-vs-continuous', NULL, 18, 'I ___ this book belongs to you.', 'am thinking', 'think', 'thinking', 'thinks', 'B', '"Think" (= believe) is a stative verb; use present simple.', 'Stative Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'present-simple-vs-continuous', NULL, 19, 'She ___ three languages fluently.', 'is speaking', 'speaking', 'speaks', 'speak', 'C', 'Permanent abilities/facts use present simple.', 'Present Simple vs Continuous', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'reflexive-pronouns', NULL, 18, 'I cut ___ while I was cooking.', 'me', 'my', 'myself', 'mine', 'C', 'Reflexive pronoun when the subject and object are the same person.', 'Reflexive Pronouns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'some-any', NULL, 16, 'Have you got ___ brothers or sisters?', 'some', 'any', 'much', 'a', 'B', '"Any" is used in questions.', 'Some/Any', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'present-perfect', NULL, 25, 'I haven''t seen her ___ last week.', 'for', 'since', 'from', 'during', 'B', '"Since" with a specific point in time.', 'Present Perfect: for/since', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'present-perfect', NULL, 26, 'They ___ already left when I arrived.', 'has', 'have', 'had', 'are', 'C', '"Had already left" is past perfect, showing the earlier action.', 'Past Perfect', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'present-perfect-continuous', NULL, 26, 'How long ___ you been learning English?', 'did', 'have', 'are', 'do', 'B', '"How long have you been..." for present perfect continuous.', 'Present Perfect Continuous', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'modals', 'deduction', 27, 'He ___ be at home. His car is in the driveway.', 'might', 'can', 'must', 'should', 'C', '"Must" for strong logical deduction in the present.', 'Modal Verbs: Deduction', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'modals', 'deduction', 28, 'She ___ be Spanish. She doesn''t speak any Spanish.', 'might not', 'can''t', 'mustn''t', 'shouldn''t', 'B', '"Can''t" for strong negative deduction (it''s impossible).', 'Modal Verbs: Deduction', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'passive', NULL, 29, 'The match ___ postponed because of the weather.', 'is', 'was', 'has', 'had', 'B', 'Past simple passive: was/were + past participle.', 'Passive Voice: Past', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'passive', NULL, 30, 'Champagne ___ produced in France.', 'is', 'was', 'are', 'were', 'A', 'Present simple passive for facts: is + past participle.', 'Passive Voice: Present', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'relative-clauses', NULL, 29, 'The hotel ___ we stayed was very comfortable.', 'who', 'which', 'where', 'whose', 'C', '"Where" for places in relative clauses.', 'Relative Clauses: where', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'gerunds-infinitives', NULL, 29, 'She can''t stand ___ in a queue.', 'wait', 'waiting', 'to wait', 'waited', 'B', '"Can''t stand" is followed by a gerund.', 'Gerunds and Infinitives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'gerunds-infinitives', NULL, 30, 'He offered ___ me home after the party.', 'driving', 'drive', 'to drive', 'drove', 'C', '"Offer" is followed by the infinitive.', 'Gerunds and Infinitives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'reported-speech', NULL, 30, 'She asked me ___ I wanted to go.', 'that', 'whether', 'do', 'did', 'B', '"Whether/if" is used for reported yes/no questions.', 'Reported Questions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'conditionals', 'zero conditional', 24, 'If you press this button, the machine ___.', 'will start', 'starts', 'would start', 'started', 'B', 'Zero conditional: if + present, present. For things that always happen.', 'Zero Conditional', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'question-tags', NULL, 29, 'They won''t be late, ___ they?', 'won''t', 'will', 'do', 'don''t', 'B', 'Negative statement + positive tag: "will they?"', 'Question Tags', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'question-tags', NULL, 30, 'Let''s go to the park, ___ we?', 'don''t', 'let''s', 'shall', 'will', 'C', '"Let''s" takes "shall we?" as a tag question.', 'Question Tags', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'verb-patterns', NULL, 27, 'My parents don''t allow me ___ out late.', 'stay', 'staying', 'to stay', 'stayed', 'C', '"Allow + object + to + verb" is the correct pattern.', 'Verb Patterns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'verb-patterns', NULL, 28, 'She made me ___ my homework again.', 'to do', 'doing', 'do', 'done', 'C', '"Make + object + base verb" (no "to").', 'Verb Patterns: let/make/help', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'conditionals', 'mixed', 39, 'If she had set an alarm, she ___ late now.', 'wouldn''t be', 'won''t be', 'isn''t', 'wasn''t', 'A', 'Mixed conditional: past condition, present result: "wouldn''t be...now".', 'Mixed Conditionals', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'wish-if-only', NULL, 37, 'I wish I ___ more time for hobbies.', 'have', 'had', 'would have', 'am having', 'B', 'Wish + past simple for unreal present situations.', 'Wish / If Only', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'wish-if-only', NULL, 38, 'If only I ___ accepted that offer last year.', 'have', 'had', 'would', 'could', 'B', 'If only + past perfect for past regrets.', 'Wish / If Only: Past', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'used-to', NULL, 35, 'I ___ getting up early. I do it every day.', 'used to', 'am used to', 'was used to', 'use to', 'B', '"Am used to + -ing" means accustomed to.', 'Be Used to / Get Used to', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'phrasal-verbs', NULL, 38, 'The concert was ___ due to bad weather.', 'called off', 'called on', 'called up', 'called out', 'A', '"Call off" means to cancel.', 'Phrasal Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'phrasal-verbs', NULL, 39, 'She ___ the story to entertain the children.', 'made up', 'made out', 'made off', 'made over', 'A', '"Make up" can mean to invent (a story).', 'Phrasal Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'phrasal-verbs', NULL, 39, 'I can''t ___ what it says. The writing is too small.', 'make up', 'make out', 'make off', 'make over', 'B', '"Make out" means to see/read/understand with difficulty.', 'Phrasal Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'linking-words', NULL, 38, 'He was wealthy; ___, he was not happy.', 'furthermore', 'moreover', 'nevertheless', 'therefore', 'C', '"Nevertheless" introduces a contrast.', 'Linking Words: nevertheless/nonetheless', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'linking-words', NULL, 39, 'The food was delicious. ___, the service was excellent.', 'However', 'Although', 'Despite', 'Moreover', 'D', '"Moreover" adds supporting information.', 'Linking Words: moreover/furthermore', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'passive', 'modals', 37, 'This homework must ___ by tomorrow.', 'finish', 'be finished', 'be finishing', 'finished', 'B', 'Modal passive: must + be + past participle.', 'Passive Voice: Modals', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'passive', 'modals', 38, 'The report should ___ submitted next week.', 'have been', 'be', 'being', 'is', 'B', 'Modal passive: should + be + past participle.', 'Passive Voice: Modals', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'have-something-done', NULL, 38, 'We had our house ___ last summer.', 'paint', 'painted', 'painting', 'to paint', 'B', 'Causative: had + object + past participle.', 'Have Something Done (Causative)', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'future-perfect', NULL, 35, 'By 2030, scientists ___ a cure for the disease.', 'will find', 'will be finding', 'will have found', 'are finding', 'C', 'Future perfect: will have + past participle for completion before a future point.', 'Future Perfect', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'future-continuous', NULL, 34, 'Don''t call at 9 PM. I ___ the children to bed.', 'will put', 'will be putting', 'am putting', 'put', 'B', 'Future continuous for an action in progress at a specific future time.', 'Future Continuous', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'determiners', NULL, 37, '___ of the options suits me. I''ll take any one.', 'Both', 'Either', 'Neither', 'All', 'B', '"Either" means any one of two options.', 'Both / Either / Neither', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'so-such', NULL, 35, 'She speaks ___ quickly that no one can understand her.', 'such', 'so', 'very', 'too', 'B', '"So + adverb + that" for emphasis.', 'So / Such', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'articles-advanced', NULL, 36, 'My brother plays ___ guitar in a band.', 'a', 'an', 'the', 'no article', 'C', '"The" is used with musical instruments: "play the guitar".', 'Articles: Advanced Uses', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'subject-verb-agreement', NULL, 38, 'The news ___ very surprising.', 'are', 'were', 'is', 'have been', 'C', '"News" is uncountable and takes a singular verb.', 'Subject-Verb Agreement', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'ing-ed-adjectives', NULL, 34, 'The instructions were very ___. I didn''t understand them.', 'confused', 'confusing', 'confuse', 'confusedly', 'B', '-ing adjective describes the thing causing the feeling.', '-ing vs -ed Adjectives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'narrative-tenses', NULL, 35, 'After she ___ the letter, she threw it away.', 'read', 'had read', 'has read', 'reading', 'B', 'Past perfect for the action that happened first.', 'Narrative Tenses', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'inversion', NULL, 47, 'Only by working hard ___ you succeed.', 'will', 'do', 'can', 'Both A and C', 'D', '"Only by..." triggers inversion. Both "will" and "can" work.', 'Inversion: Only', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'inversion', NULL, 48, 'Little ___ he know what was about to happen.', 'did', 'had', 'was', 'has', 'A', '"Little did he know..." is a common past tense inversion.', 'Inversion with Negative Adverbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'modals', 'needn''t have', 46, 'You ___ have worried. Everything turned out fine.', 'mustn''t', 'needn''t', 'shouldn''t', 'couldn''t', 'B', '"Needn''t have + past participle" means it was unnecessary (but you did it anyway).', 'Needn''t have / Didn''t need to', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'modals', 'needn''t have', 47, 'She ___ to tell him. He already knew. (She told him, but it was unnecessary.)', 'needn''t', 'didn''t need', 'needn''t have needed', 'Both A and B', 'A', '"Needn''t have told" = she told him, but it wasn''t necessary.', 'Needn''t have / Didn''t need to', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'subjunctive', NULL, 47, 'The committee demanded that the report ___ completed by Friday.', 'is', 'be', 'was', 'will be', 'B', 'Subjunctive after "demand": base form of the verb.', 'Subjunctive Mood', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'participle-clauses', NULL, 48, '___ from above, the city looks beautiful.', 'Seeing', 'Seen', 'To see', 'Having seen', 'B', 'Past participle clause with passive meaning: "When seen from above..."', 'Participle Clauses', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'participle-clauses', NULL, 49, '___ the difficulties, she remained optimistic.', 'Despite', 'Although', 'Notwithstanding', 'Both A and C', 'D', 'Both "Despite" and "Notwithstanding" work before a noun phrase.', 'Concessive Structures', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'emphasis', NULL, 47, 'What annoys me most ___ his constant lateness.', 'was', 'is', 'are', 'were', 'B', '"What" clause as subject + "is" for emphasis.', 'Emphasis: What-clefts', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'future-in-past', NULL, 46, 'She said she ___ call me the next day.', 'will', 'would', 'is going to', 'can', 'B', '"Would" is the past form of "will" in reported speech.', 'Future in the Past', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'would-rather', NULL, 46, 'I''d rather ___ at home tonight.', 'to stay', 'staying', 'stay', 'stayed', 'C', '"Would rather + base verb" for personal preferences.', 'Would Rather', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'linking', NULL, 49, 'Our sales increased by 10% last quarter. ___, profits have declined.', 'Conversely', 'Similarly', 'Accordingly', 'Likewise', 'A', '"Conversely" introduces an opposite or contrasting situation.', 'Advanced Linking Words', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'linking', NULL, 50, 'The experiment failed; ___, we gained valuable insights.', 'hence', 'meanwhile', 'nonetheless', 'likewise', 'C', '"Nonetheless" means despite that / even so.', 'Advanced Linking Words', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'concession', NULL, 49, 'Interesting as the idea ___, it is not practical.', 'is', 'was', 'may be', 'Both A and C', 'D', '"Adjective + as + subject + verb" for concession; both present and "may be" work.', 'Concessive Structures', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'advanced-passives', NULL, 48, 'The building is ___ to have been designed by a famous architect.', 'think', 'thinking', 'thought', 'thinks', 'C', 'Passive reporting with perfect infinitive: is thought to have been.', 'Impersonal Passive', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'complex-sentences', NULL, 49, 'No matter how hard she ___, she couldn''t finish on time.', 'tries', 'tried', 'try', 'has tried', 'B', '"No matter how + adjective/adverb + subject + past simple" for past concession.', 'No Matter / Whatever / However', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'ellipsis', NULL, 47, '"Did he pass the test?" "I believe ___."', 'it', 'that', 'so', 'yes', 'C', '"I believe so" replaces the whole clause: "I believe that he passed."', 'Ellipsis and Substitution', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'reported-speech', 'patterns', 48, 'She reminded me ___ my passport.', 'bringing', 'to bring', 'bring', 'brought', 'B', '"Remind + object + to + verb" for reported reminders.', 'Reporting Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'reported-speech', 'patterns', 49, 'He apologised ___ being late.', 'about', 'to', 'for', 'of', 'C', '"Apologise for + -ing" is the correct pattern.', 'Reporting Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'register', NULL, 48, 'Which is appropriate in a formal report?', 'We figured out the problem.', 'We identified the issue.', 'We got to the bottom of it.', 'We worked out what went wrong.', 'B', '"Identified the issue" is formal register suitable for reports.', 'Formal vs Informal Register', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'inversion', 'literary', 55, 'On no account ___ this door be left unlocked.', 'should', 'must', 'Both A and B', 'can', 'C', '"On no account" triggers inversion with modal verbs.', 'Advanced Inversion Patterns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'inversion', 'literary', 56, 'In no way ___ responsible for the accident.', 'was he', 'he was', 'he is', 'is he', 'A', '"In no way + inversion" for emphatic denial.', 'Advanced Inversion Patterns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'collocations', NULL, 55, 'The company has ___ a significant profit this year.', 'done', 'made', 'earned', 'gained', 'B', '"Make a profit" is the standard collocation.', 'Advanced Collocations', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'collocations', NULL, 56, 'He ___ a glance at the clock and realised he was late.', 'gave', 'threw', 'cast', 'All are acceptable', 'D', 'All three verbs collocate with "a glance": gave/threw/cast a glance.', 'Advanced Collocations', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'discourse-markers', NULL, 54, 'The results were unexpected. ___, they prompted a revision of the hypothesis.', 'Nevertheless', 'Accordingly', 'Conversely', 'Alternatively', 'B', '"Accordingly" means as a result of this, and therefore.', 'Discourse Markers', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'discourse-markers', NULL, 55, 'The study has limitations. ___, the findings provide valuable insights.', 'Therefore', 'That said', 'Moreover', 'Hence', 'B', '"That said" concedes the previous point before introducing a positive.', 'Discourse Markers', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'near-synonyms', NULL, 55, 'The government ___ the new regulations immediately.', 'applied', 'enforced', 'implemented', 'practised', 'C', '"Implement regulations" is the precise academic collocation.', 'Near-Synonyms and Nuance', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'near-synonyms', NULL, 56, 'The speech was intended to ___ public opinion.', 'change', 'sway', 'alter', 'modify', 'B', '"Sway public opinion" is the most natural and precise collocation.', 'Near-Synonyms and Nuance', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'tense-nuance', NULL, 57, 'She ___ about leaving her job for months before she finally resigned.', 'thought', 'was thinking', 'had been thinking', 'has thought', 'C', 'Past perfect continuous for prolonged action before a past event.', 'Past Perfect Continuous Nuances', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'tense-nuance', NULL, 58, 'It ___ transpire that the witness had lied.', 'was to', 'would', 'should', 'Both A and B', 'D', 'Both "was to transpire" and "would transpire" express future in the past narrative.', 'Advanced Tense Usage', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'subjunctive', 'formal', 57, 'Heaven ___ that we should have to go through that again.', 'forbids', 'forbid', 'forbidden', 'forbade', 'B', '"Heaven forbid" is a fixed subjunctive expression.', 'Subjunctive in Fixed Expressions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'subjunctive', 'formal', 58, 'If need ___, I will provide additional documentation.', 'is', 'was', 'be', 'were', 'C', '"If need be" is a fixed subjunctive expression meaning "if necessary".', 'Subjunctive in Fixed Expressions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'nominal-clauses', NULL, 58, '___ he chose to resign remains a mystery.', 'That', 'Why', 'What', 'How', 'B', '"Why he chose..." is a nominal clause functioning as the subject.', 'Nominal Clauses', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'relative-clauses', 'reduced', 56, 'Anyone ___ to participate should register by Friday.', 'who wishes', 'wishing', 'wished', 'Both A and B', 'D', 'Both the full relative clause and the reduced form are correct.', 'Reduced Relative Clauses', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'fronting', NULL, 57, 'Remarkable though it ___, the story is entirely true.', 'seems', 'may seem', 'is seeming', 'Both A and B', 'D', 'Both "seems" and "may seem" work in fronted concessive structures.', 'Fronting for Emphasis', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'hedging', NULL, 57, 'It could ___ argued that the policy has been counterproductive.', 'have been', 'be', 'being', 'been', 'B', '"It could be argued that..." is a hedging expression in academic writing.', 'Hedging in Academic English', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'hedging', NULL, 58, 'The evidence ___ to suggest a correlation.', 'seems', 'appears', 'tends', 'All of the above', 'D', 'All three are hedging verbs used in academic writing to soften claims.', 'Hedging in Academic English', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'pragmatics', NULL, 59, 'I wonder if I ___ possibly ask you a favour.', 'can', 'could', 'may', 'might', 'D', '"I wonder if I might" is extremely polite indirect request.', 'Pragmatic Competence', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'pragmatics', NULL, 59, 'I''m not altogether ___ that this is the right approach.', 'sure', 'certain', 'convinced', 'All of the above', 'D', '"Not altogether sure/certain/convinced" is diplomatic hedging.', 'Diplomatic Language', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'lexical-precision', NULL, 59, 'The findings ___ the need for further research.', 'show', 'underline', 'underscore', 'Both B and C', 'D', 'Both "underline" and "underscore" mean to emphasise/highlight in academic style.', 'Academic Vocabulary', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'lexical-precision', NULL, 60, 'The study ___ a number of methodological flaws.', 'has', 'suffers from', 'exhibits', 'Both B and C', 'D', 'Both "suffers from" and "exhibits" are used to describe research flaws.', 'Academic Vocabulary', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'modality-advanced', NULL, 59, 'This ___ well be the most important discovery of the century.', 'should', 'may', 'would', 'could', 'B', '"May well be" expresses strong possibility with emphasis.', 'Nuanced Modal Usage', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'clause-linking', NULL, 59, 'Insofar ___ the data is reliable, the conclusions are sound.', 'that', 'as', 'which', 'so', 'B', '"Insofar as" means to the extent that.', 'Formal Clause Linking', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'advanced-verbs', NULL, 57, 'The situation ___ handling with extreme care.', 'warrants', 'merits', 'Both A and B', 'requires', 'C', 'Both "warrants" and "merits" mean "deserves/requires" in formal usage.', 'Advanced Verb Patterns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'vague-language', NULL, 58, 'It cost ___ the region of 500,000 dollars.', 'about', 'in', 'around', 'near', 'B', '"In the region of" is a formal way of saying approximately.', 'Formal Approximation', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'demonstratives', NULL, 3, '___ is my mother over there.', 'This', 'That', 'These', 'Those', 'B', '"That" for something far away. "Over there" signals distance.', 'This/That/These/Those', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'demonstratives', NULL, 4, '___ apples are delicious!', 'This', 'That', 'These', 'It', 'C', '"These" for plural things close by.', 'This/That/These/Those', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'present-simple', 'negative', 6, 'She ___ like spicy food.', 'don''t', 'doesn''t', 'isn''t', 'not', 'B', 'Third person singular negative: "doesn''t".', 'Present Simple: Negatives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'present-simple', 'questions', 7, '___ you like coffee?', 'Does', 'Do', 'Are', 'Is', 'B', '"Do you like...?" for present simple questions (I/you/we/they).', 'Present Simple: Questions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'object-pronouns', NULL, 5, 'I don''t know ___. What is her name?', 'she', 'her', 'hers', 'herself', 'B', 'Object pronouns go after the verb: "I don''t know her."', 'Object Pronouns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'object-pronouns', NULL, 6, 'Please give ___ the book.', 'I', 'my', 'me', 'mine', 'C', '"Me" is the object pronoun for "I".', 'Object Pronouns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'prepositions', 'time', 6, 'I was born ___ 1990.', 'at', 'on', 'in', 'to', 'C', '"In" is used with years: "in 1990".', 'Prepositions of Time', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'imperatives', NULL, 4, '___ sit down, please.', 'You', 'Please', 'Do', 'no word needed', 'D', 'Imperatives start with the base verb. "Sit down, please" or "Please sit down."', 'Imperatives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'there-is-are', NULL, 3, '___ a bookshop near here?', 'Is there', 'Are there', 'There is', 'Has there', 'A', '"Bookshop" is singular, so "Is there a bookshop?"', 'There is / There are', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'have-got', NULL, 5, '___ she got any pets?', 'Does', 'Is', 'Has', 'Have', 'C', '"Has she got...?" for questions about possession.', 'Have/Has Got', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'let-allow', NULL, 8, 'My mother makes me ___ my bed every morning.', 'to make', 'making', 'make', 'made', 'C', '"Make" + object + base verb (no "to").', 'Make/Let', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'question-words', NULL, 3, '___ is your birthday?', 'What', 'When', 'Where', 'Who', 'B', '"When" asks about time.', 'Question Words', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'question-words', NULL, 4, '___ do you live?', 'What', 'When', 'Where', 'Who', 'C', '"Where" asks about place.', 'Question Words', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'can-ability', NULL, 5, 'He ___ swim when he was five years old.', 'can', 'could', 'is able', 'does', 'B', '"Could" is the past form of "can" for ability.', 'Could for Past Ability', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'articles', NULL, 7, 'She plays ___ piano very well.', 'a', 'an', 'the', 'no article', 'C', '"The" is used with musical instruments when talking about playing.', 'Articles', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'pronouns', NULL, 7, 'John and ___ went shopping yesterday.', 'me', 'I', 'my', 'mine', 'B', '"John and I" as subject pronoun.', 'Subject Pronouns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'be-verb', 'questions', 5, '___ you from Japan?', 'Do', 'Is', 'Are', 'Does', 'C', '"Are you...?" for questions with "you" + verb to be.', 'Verb to Be: Questions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'possessives', NULL, 6, 'Is this ___ pencil?', 'you', 'your', 'yours', 'you''re', 'B', '"Your" is a possessive adjective used before a noun.', 'Possessive Adjectives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'possessives', NULL, 7, '"Whose bag is this?" "It''s ___."', 'my', 'me', 'mine', 'I', 'C', '"Mine" is a possessive pronoun used without a noun.', 'Possessive Pronouns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A1', 'telling-time', NULL, 4, 'It''s half ___ nine.', 'to', 'past', 'after', 'before', 'B', '"Half past nine" means 9:30.', 'Telling the Time', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'past-simple', 'irregular', 13, 'I ___ my keys at home this morning.', 'leaved', 'left', 'leave', 'leaving', 'B', '"Left" is the past simple of "leave" (irregular).', 'Past Simple: Irregular Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'past-simple', 'irregular', 14, 'She ___ a letter to her grandmother.', 'write', 'writed', 'wrote', 'writing', 'C', '"Wrote" is the past simple of "write" (irregular).', 'Past Simple: Irregular Verbs', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'articles', 'no article', 18, 'I love ___. It''s my favourite sport.', 'the basketball', 'a basketball', 'basketball', 'an basketball', 'C', 'No article with sports in general.', 'Zero Article', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'too-enough', NULL, 16, 'She isn''t old ___ to drive.', 'too', 'very', 'enough', 'so', 'C', '"Adjective + enough" means sufficiently.', 'Too and Enough', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'too-enough', NULL, 17, 'This coffee is ___ hot to drink.', 'enough', 'very', 'too', 'so', 'C', '"Too + adjective" means excessively.', 'Too and Enough', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'first-conditional', NULL, 19, 'If it rains, we ___ stay at home.', 'would', 'will', 'do', 'are', 'B', 'First conditional: if + present, will + base verb.', 'First Conditional', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'should-advice', NULL, 15, 'You look tired. You ___ go to bed early tonight.', 'shall', 'must', 'should', 'would', 'C', '"Should" for advice.', 'Should for Advice', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'quantifiers', NULL, 18, 'There aren''t ___ students in the class today.', 'much', 'many', 'a lot', 'some', 'B', '"Many" with countable plural nouns in negative sentences.', 'Much / Many / A lot of', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'quantifiers', NULL, 19, 'She doesn''t have ___ money.', 'many', 'a lot', 'much', 'some', 'C', '"Much" with uncountable nouns in negative sentences.', 'Much / Many / A lot of', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'prepositions', 'movement', 14, 'The cat jumped ___ the table.', 'on', 'at', 'onto', 'in', 'C', '"Onto" for movement to a surface.', 'Prepositions of Movement', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'prepositions', 'movement', 15, 'We walked ___ the park to get to school.', 'across', 'along', 'through', 'Both A and C', 'D', 'Both "across" (over the surface) and "through" (inside and out) work.', 'Prepositions of Movement', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'present-perfect', 'experience', 20, 'Have you ever ___ sushi?', 'eat', 'ate', 'eaten', 'eating', 'C', 'Present perfect: have + past participle. "Eaten" is the past participle of "eat".', 'Present Perfect: Experience', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'present-perfect', 'just', 19, 'She has ___ arrived. She is taking off her coat.', 'already', 'yet', 'just', 'ever', 'C', '"Just" for very recent actions.', 'Present Perfect: just/already/yet', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'present-perfect', 'yet', 20, 'I haven''t finished my homework ___.', 'already', 'just', 'ever', 'yet', 'D', '"Yet" in negative present perfect sentences (at the end).', 'Present Perfect: just/already/yet', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'suggestions', NULL, 16, '___ about going to the cinema?', 'Why', 'How', 'What', 'Shall', 'C', '"What about + -ing?" for making suggestions.', 'Making Suggestions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'suggestions', NULL, 17, '___ we go for a walk?', 'Will', 'Shall', 'Would', 'Do', 'B', '"Shall we...?" for making suggestions.', 'Making Suggestions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'like-vs-would-like', NULL, 16, '"Would you like ___ to the party?" "Yes, please!"', 'come', 'coming', 'to come', 'came', 'C', '"Would like + to + base verb" for polite offers.', 'Would Like vs Like', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'possessive-pronouns', NULL, 17, '"Whose car is that?" "It''s ___.', 'their', 'them', 'they', 'theirs', 'D', '"Theirs" is a possessive pronoun (replaces "their car").', 'Possessive Pronouns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'directions', NULL, 14, 'To get to the library, go ___ and turn left.', 'ahead', 'straight', 'forward', 'along', 'B', '"Go straight" is the standard phrase for directions.', 'Giving Directions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'A2', 'can-request', NULL, 15, '___ you help me with my bag, please?', 'Do', 'Are', 'Could', 'Shall', 'C', '"Could you...?" for polite requests.', 'Polite Requests', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'second-conditional', NULL, 28, 'If I ___ a million dollars, I would travel the world.', 'have', 'had', 'will have', 'having', 'B', 'Second conditional: if + past simple, would + base verb.', 'Second Conditional', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'second-conditional', NULL, 29, 'What would you do if you ___ the president?', 'are', 'were', 'will be', 'being', 'B', 'Second conditional: "were" is preferred for all persons in the if-clause.', 'Second Conditional', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'third-conditional', NULL, 30, 'If I had studied harder, I ___ passed the exam.', 'will have', 'had', 'would have', 'have', 'C', 'Third conditional: if + past perfect, would have + past participle.', 'Third Conditional', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'used-to', NULL, 25, 'I ___ play tennis every weekend, but now I don''t.', 'use to', 'used to', 'am used to', 'was using', 'B', '"Used to" for past habits that are no longer true.', 'Used to', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'enough-too', NULL, 24, 'This bag isn''t big ___ to fit all my books.', 'too', 'enough', 'very', 'so', 'B', '"Big enough" means sufficiently big.', 'Too and Enough', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'purpose', NULL, 27, 'I went to the shop ___ buy some bread.', 'for', 'for to', 'to', 'so', 'C', '"To + verb" to express purpose.', 'Purpose: to / in order to / so that', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'purpose', NULL, 28, 'She whispered ___ the baby wouldn''t wake up.', 'for', 'because', 'to', 'so that', 'D', '"So that" + clause for purpose.', 'Purpose: to / in order to / so that', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'both-neither-either', NULL, 26, '___ of the restaurants was good. We were disappointed.', 'Both', 'Either', 'Neither', 'All', 'C', '"Neither" = not one and not the other.', 'Both / Either / Neither', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'defining-relative-clauses', NULL, 27, 'The man ___ lives next door is a doctor.', 'which', 'who', 'where', 'when', 'B', '"Who" for people in relative clauses.', 'Defining Relative Clauses', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'defining-relative-clauses', NULL, 28, 'The film ___ we saw last night was excellent.', 'who', 'whose', 'which', 'where', 'C', '"Which" or "that" for things in relative clauses.', 'Defining Relative Clauses', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'speculating', NULL, 26, '"Where is Tom?" "He ___ be at work."', 'might', 'must', 'should', 'will', 'A', '"Might" for uncertain speculation.', 'Might for Speculation', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'connectors', NULL, 28, '___ the rain, we went for a walk.', 'Although', 'Despite', 'However', 'But', 'B', '"Despite" + noun phrase for contrast.', 'Although / Despite / In spite of', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'connectors', NULL, 29, '___ she was tired, she continued working.', 'Despite', 'In spite of', 'Although', 'However', 'C', '"Although" + clause for concession.', 'Although / Despite / In spite of', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'passives', NULL, 26, 'English ___ spoken all over the world.', 'is', 'are', 'be', 'been', 'A', 'Present simple passive: is + past participle.', 'Passive Voice', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'question-forms', NULL, 27, 'Could you tell me where the station ___?', 'is', 'does', 'it is', 'is it', 'A', 'Indirect questions use statement word order, not question order.', 'Indirect Questions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'question-forms', NULL, 28, 'Do you know what time the shop ___?', 'does close', 'closes', 'close', 'is close', 'B', 'Indirect question: "what time the shop closes" (no auxiliary "does").', 'Indirect Questions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'present-perfect-vs-past', NULL, 26, 'I ___ to London many times.', 'went', 'have been', 'was', 'am going', 'B', '"Many times" = unfinished time period, so use present perfect.', 'Present Perfect vs Past Simple', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'present-perfect-vs-past', NULL, 27, 'I ___ to London last year.', 'went', 'have been', 'have gone', 'go', 'A', '"Last year" = finished time period, so use past simple.', 'Present Perfect vs Past Simple', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'so-neither', NULL, 25, '"I love pizza." "___ do I."', 'Neither', 'Nor', 'So', 'Either', 'C', '"So do I" for agreeing with positive statements.', 'So do I / Neither do I', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B1', 'so-neither', NULL, 26, '"I don''t like snakes." "___ do I."', 'So', 'Neither', 'Either', 'Also', 'B', '"Neither do I" for agreeing with negative statements.', 'So do I / Neither do I', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'reported-speech', NULL, 36, 'She told me she ___ to the party the following week.', 'will come', 'comes', 'would come', 'is coming', 'C', '"Will" changes to "would" in reported speech.', 'Reported Speech', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'reported-speech', NULL, 37, 'He asked me ___ I had finished the report.', 'that', 'if', 'what', 'when', 'B', '"If" is used for reported yes/no questions.', 'Reported Questions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'gerunds-infinitives', 'change meaning', 39, 'I remember ___ the door. (I have the memory of doing it.)', 'to lock', 'locking', 'lock', 'locked', 'B', '"Remember + -ing" means you have the memory of a past action.', 'Gerunds vs Infinitives: Change in Meaning', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'gerunds-infinitives', 'change meaning', 40, 'Remember ___ the door before you leave. (Don''t forget to do it.)', 'to lock', 'locking', 'lock', 'locked', 'A', '"Remember + to + verb" means don''t forget to do something.', 'Gerunds vs Infinitives: Change in Meaning', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'cleft-sentences', NULL, 37, 'It ___ the noise that bothered me most.', 'is', 'was', 'had', 'Both A and B', 'D', 'Cleft sentences can use "is" or "was": "It was/is the noise that..."', 'Cleft Sentences', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'substitution', NULL, 36, '"Is she coming to the party?" "She said she might ___."', 'do', 'come', 'do it', 'no word needed', 'D', 'After a modal verb, the rest can be omitted: "She said she might."', 'Substitution and Ellipsis', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'past-modals', NULL, 38, 'She ___ studied more. She failed the exam.', 'must have', 'should have', 'could have', 'would have', 'B', '"Should have + past participle" for criticism about the past.', 'Past Modals: should have / could have', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'past-modals', NULL, 39, 'He ___ been at work. I saw him at the shopping centre.', 'can''t have', 'mustn''t have', 'shouldn''t have', 'might not have', 'A', '"Can''t have + past participle" for impossible past deduction.', 'Past Modal Deduction', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'relative-clauses', 'non-defining', 38, 'My brother, ___ lives in Tokyo, is visiting us next month.', 'that', 'which', 'who', 'whom', 'C', 'Non-defining relative clauses use "who" (not "that") for people.', 'Non-defining Relative Clauses', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'relative-clauses', 'non-defining', 39, 'The Eiffel Tower, ___ is in Paris, was built in 1889.', 'that', 'which', 'who', 'what', 'B', 'Non-defining relative clauses use "which" (not "that") for things.', 'Non-defining Relative Clauses', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'emphasis', NULL, 38, 'What I ___ about this city is the architecture.', 'mostly like', 'like most', 'most like', 'like mostly', 'B', '"What I like most" uses a what-cleft for emphasis.', 'Emphasis: What-clefts', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'comparisons', NULL, 35, 'The more you practise, the ___ you''ll get.', 'good', 'well', 'better', 'best', 'C', '"The more...the better" is a double comparative structure.', 'Double Comparatives', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'comparisons', NULL, 36, 'This book is not nearly as ___ as the first one.', 'interested', 'interest', 'interesting', 'interestingly', 'C', '"Not nearly as good/interesting as..." for comparisons.', 'as...as Comparisons', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'would-used-to', NULL, 37, 'When I was a child, we ___ spend every summer at the beach.', 'would', 'used to', 'Both A and B', 'will', 'C', 'Both "would" and "used to" can describe repeated past actions.', 'Would vs Used to', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'conditionals', 'third', 40, 'If they ___ earlier, they wouldn''t have missed the train.', 'left', 'would leave', 'had left', 'have left', 'C', 'Third conditional: if + past perfect.', 'Third Conditional', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'formal-language', NULL, 37, 'I am writing ___ regard to your advertisement.', 'in', 'with', 'about', 'for', 'B', '"With regard to" is a formal way of saying "about".', 'Formal Language', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'present-perfect-continuous', NULL, 36, 'She ___ working here for three years.', 'is', 'was', 'has been', 'had been', 'C', '"Has been + -ing + for" = present perfect continuous.', 'Present Perfect Continuous', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'quantifiers', NULL, 35, 'He ate ___ all the cake.', 'nearly', 'most', 'a few', 'hardly', 'A', '"Nearly all" means almost all (adverb + quantifier).', 'Advanced Quantifiers', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'future-forms', NULL, 36, 'The match ___ at 3 PM tomorrow.', 'starts', 'is starting', 'will start', 'All are possible', 'D', 'Present simple, present continuous, and will can all describe scheduled future events.', 'Future Forms Review', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'B2', 'as-like', NULL, 35, 'She works ___ a teacher in a secondary school.', 'like', 'as', 'such as', 'for', 'B', '"As + noun" for role/function. "Like" for comparison.', 'As vs Like', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'conditional-inversion', NULL, 49, '___ I known about the delay, I would have taken a different route.', 'If', 'Had', 'Should', 'Were', 'B', 'Inverted conditional: "Had I known" = "If I had known".', 'Conditional Inversion', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'conditional-inversion', NULL, 50, '___ the need arise, please don''t hesitate to contact us.', 'If', 'Had', 'Should', 'Were', 'C', 'Inverted first conditional: "Should the need arise" = "If the need arises".', 'Conditional Inversion', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'unreal-past', NULL, 46, 'It''s time we ___ a decision.', 'make', 'made', 'to make', 'making', 'B', '"It''s time" + past simple for unreal/desired present.', 'Unreal Past', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'unreal-past', NULL, 47, 'I''d sooner you ___ tell anyone about this.', 'don''t', 'didn''t', 'won''t', 'not', 'B', '"I''d sooner + subject + past simple" for preferences about others.', 'Unreal Past', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'advanced-modals', NULL, 48, 'She ___ have arrived by now. The flight was three hours ago.', 'must', 'can', 'should', 'Both A and C', 'D', 'Both "must have" (strong deduction) and "should have" (expectation) work.', 'Advanced Modal Usage', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'comment-adverbials', NULL, 46, '___, the project was a success despite the initial problems.', 'Hopeful', 'In the end', 'Fortunately', 'Both B and C', 'D', 'Both "In the end" and "Fortunately" are sentence adverbials.', 'Comment Adverbials', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'emphasis', 'cleft', 48, 'It was only when I arrived ___ I realised I had forgotten my wallet.', 'that', 'when', 'which', 'what', 'A', '"It was only when...that..." is an emphatic cleft.', 'It-cleft Sentences', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'emphasis', 'cleft', 49, 'What really ___ me is the lack of transparency.', 'concerns', 'concern', 'concerning', 'concerned', 'A', '"What really concerns me is..." (singular verb as "what" substitutes for "the thing that").', 'What-cleft Sentences', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'complex-prepositions', NULL, 46, 'She succeeded ___ of great opposition.', 'despite', 'in the face', 'regardless', 'in spite', 'B', '"In the face of" means despite, in the presence of.', 'Complex Prepositions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'complex-prepositions', NULL, 47, 'The policy was changed ___ to public pressure.', 'because', 'since', 'due', 'owing', 'C', '"Due to" means because of (more formal).', 'Complex Prepositions', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'nominalization', NULL, 48, 'The ___ of the event was handled by a professional team.', 'organising', 'organisation', 'organised', 'Both A and B', 'D', 'Both the gerund "organising" and noun "organisation" work here.', 'Nominalization', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'passive', 'advanced', 48, 'He is believed ___ left the country.', 'to have been', 'to have', 'having', 'has', 'B', 'Passive reporting: "is believed to have left" (perfect infinitive).', 'Advanced Passive Reporting', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'gerunds-infinitives', 'advanced', 49, 'The suspect denied ___ been at the scene.', 'to have', 'having', 'he has', 'that he', 'B', '"Deny + having + past participle" for past actions.', 'Advanced Gerund/Infinitive Patterns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'mixed-modals', NULL, 49, 'She ___ have been promoted. She''s clearly upset about something else.', 'might not', 'can''t', 'shouldn''t', 'mustn''t', 'A', '"Might not have" = It''s possible she wasn''t promoted (uncertain deduction).', 'Past Modal Deduction', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'adverb-position', NULL, 47, 'She has ___ finished the assignment.', 'already hardly', 'hardly already', 'already', 'hard', 'C', '"Already" goes between the auxiliary and the main verb.', 'Adverb Position', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'verb-patterns', 'complex', 48, 'The doctor advised him ___ more exercise.', 'taking', 'to take', 'take', 'took', 'B', '"Advise + object + to + infinitive" for reported advice.', 'Complex Verb Patterns', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'so-adj-that', NULL, 46, 'So ___ was the damage that the building had to be demolished.', 'great', 'greatly', 'greater', 'greatest', 'A', '"So + adjective + inversion: "So great was the damage that..."', 'So/Such...that with Inversion', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'formal-subjunctive', NULL, 48, 'It is essential that every student ___ the form.', 'completes', 'complete', 'completing', 'will complete', 'B', 'Formal subjunctive after "essential": base form of verb.', 'Formal Subjunctive', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'discourse', NULL, 47, 'There were, ___, a number of issues that needed addressing.', 'but', 'however', 'although', 'despite', 'B', '"However" used parenthetically between commas.', 'Discourse Management', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C1', 'advanced-passives', 'get-passive', 47, 'He ___ fired from his job last week.', 'was', 'got', 'Both A and B', 'had', 'C', 'Both "was fired" and "got fired" are acceptable (got = informal passive).', 'Get Passive', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'distancing', NULL, 54, 'The figures ___ to be accurate, but further checks are needed.', 'seem', 'appear', 'Both A and B', 'prove', 'C', 'Both "seem" and "appear" are distancing devices in formal writing.', 'Distancing Language', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'distancing', NULL, 55, 'It is ___ that the results may not be generalisable.', 'acknowledged', 'conceded', 'Both A and B', 'known', 'C', 'Both are formal distancing verbs in academic writing.', 'Distancing Language', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'emphasis-advanced', NULL, 56, 'Not until the results were published ___ the significance of the study become apparent.', 'did', 'had', 'was', 'has', 'A', '"Not until" triggers inversion: "did the significance become..."', 'Advanced Emphatic Structures', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'emphasis-advanced', NULL, 57, 'Under no circumstances ___ unauthorised personnel enter this area.', 'should', 'must', 'shall', 'Any of the above', 'D', '"Under no circumstances" triggers inversion; any modal can follow.', 'Advanced Emphatic Structures', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'advanced-conditionals', NULL, 58, '___ it not for his timely intervention, the situation could have escalated.', 'Were', 'Had', 'Should', 'If', 'A', '"Were it not for" = "If it weren''t for" (formal inverted conditional).', 'Advanced Conditional Structures', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'advanced-conditionals', NULL, 59, 'But for the quick thinking of the pilot, the passengers ___ not have survived.', 'might', 'would', 'could', 'Any of the above', 'D', '"But for" = "If it hadn''t been for" + any modal perfect.', 'Advanced Conditional Structures', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'literary-forms', NULL, 57, 'So it was that the old man ___ to tell his story once more.', 'began', 'begins', 'begin', 'has begun', 'A', '"So it was that..." is a narrative literary device using past simple.', 'Literary and Narrative Forms', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'literary-forms', NULL, 58, 'Scarcely ___ we arrived when it began to pour with rain.', 'have', 'had', 'did', 'were', 'B', '"Scarcely had we...when..." = literary inversion for near-simultaneous events.', 'Literary Inversion', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'complex-noun-phrases', NULL, 57, 'The ___ scale of the devastation was hard to comprehend.', 'sheer', 'pure', 'utter', 'mere', 'A', '"Sheer scale" is the natural collocation meaning absolute/complete.', 'Complex Noun Phrases', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'complex-noun-phrases', NULL, 58, 'The ever-___ gap between rich and poor is a cause for concern.', 'growing', 'widening', 'increasing', 'All are acceptable', 'D', '"Ever-growing/widening/increasing gap" are all natural collocations.', 'Complex Noun Phrases', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'circumlocution', NULL, 58, 'What we are essentially dealing with here ___ a failure of communication.', 'was', 'is', 'are', 'were', 'B', '"What...is" takes singular verb; this is a formal circumlocution.', 'Formal Circumlocution', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'nuanced-negation', NULL, 59, 'She is not ___ unaware of the consequences.', 'altogether', 'completely', 'entirely', 'Any of the above', 'D', 'Double hedging: "not altogether/completely/entirely unaware" = partially aware.', 'Nuanced Negation (Litotes)', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'nuanced-negation', NULL, 59, 'The proposal is not without its ___.', 'problems', 'merits', 'drawbacks', 'All are acceptable', 'D', '"Not without its..." is litotes meaning "has some..." (problems/merits/drawbacks).', 'Nuanced Negation (Litotes)', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'speculation', NULL, 56, 'He may ___ well have been the greatest scientist of his generation.', 'very', 'quite', 'no word needed', 'Both A and C', 'C', '"May well have been" = strong possibility. No extra word needed.', 'Advanced Speculation', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'academic-style', NULL, 58, 'The analysis ___ light on several previously overlooked factors.', 'sheds', 'throws', 'casts', 'All are acceptable', 'D', '"Shed/throw/cast light on" are all acceptable academic collocations.', 'Academic Collocations', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'academic-style', NULL, 59, 'This paper ___ to examine the impact of globalisation on local cultures.', 'intends', 'purposes', 'seeks', 'Both A and C', 'D', '"This paper intends/seeks to..." are standard academic introductions.', 'Academic Writing Style', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'it-there', NULL, 56, '___ remains to be seen whether this approach will work.', 'There', 'It', 'What', 'That', 'B', '"It remains to be seen" is a fixed formal expression.', 'It/There Structures', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'it-there', NULL, 57, '___ is no denying that the situation is serious.', 'It', 'There', 'This', 'That', 'B', '"There is no denying" (existential there + gerund).', 'It/There Structures', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'word-formation', NULL, 58, 'The ___ of the new policy has led to widespread criticism.', 'implementation', 'implementing', 'implementer', 'implemental', 'A', '"Implementation" is the correct noun form in this formal context.', 'Word Formation', NULL, true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'grammar', 'C2', 'word-formation', NULL, 59, 'His ___ remarks did nothing to improve the situation.', 'unhelpful', 'unhelpfully', 'helpless', 'unhelped', 'A', '"Unhelpful" = not helpful (prefix un- + adjective).', 'Word Formation: Prefixes', NULL, true, CURRENT_TIMESTAMP);

-- ============================================================
-- READING QUESTIONS (64 total)
-- ============================================================

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'A1', 'reading-comprehension', NULL, 2, '[My Daily Routine] What is Maria''s job?', 'Doctor', 'Teacher', 'Nurse', 'Student', 'B', 'The passage says "I am a teacher."', 'Reading Comprehension A1', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'My Daily Routine' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'A1', 'reading-comprehension', NULL, 3, '[My Daily Routine] How does Maria go to school?', 'By car', 'By train', 'By bus', 'On foot', 'C', 'The passage says "I go to school by bus."', 'Reading Comprehension A1', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'My Daily Routine' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'A1', 'reading-comprehension', NULL, 3, '[My Daily Routine] What does Maria have for breakfast?', 'Eggs and coffee', 'Cereal and milk', 'Toast and orange juice', 'Nothing', 'C', 'The passage says "I usually eat toast and drink orange juice."', 'Reading Comprehension A1', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'My Daily Routine' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'A1', 'reading-comprehension', NULL, 4, '[My Daily Routine] What time does Maria go to bed?', '9 PM', '10 PM', '11 PM', '12 AM', 'C', 'The passage says "I go to bed at 11 PM."', 'Reading Comprehension A1', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'My Daily Routine' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'A1', 'reading-comprehension', NULL, 4, '[My Daily Routine] What does Maria do after work?', 'She studies.', 'She goes shopping.', 'She goes to the gym.', 'She visits friends.', 'C', 'The passage says "After work, I go to the gym."', 'Reading Comprehension A1', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'My Daily Routine' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'A1', 'reading-comprehension', NULL, 4, '[The Park] What is in the middle of the park?', 'A playground', 'A fountain', 'A small lake', 'A statue', 'C', 'The passage says "There is a small lake in the middle of the park."', 'Reading Comprehension A1', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'The Park' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'A1', 'reading-comprehension', NULL, 5, '[The Park] When does the family go to the park?', 'Every day', 'On Saturdays', 'On Sundays', 'On weekdays', 'C', 'The passage says "My family goes to the park on Sundays."', 'Reading Comprehension A1', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'The Park' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'A1', 'reading-comprehension', NULL, 5, '[The Park] How many playgrounds are there?', 'One', 'Two', 'Three', 'Four', 'B', 'The passage says "There are two playgrounds."', 'Reading Comprehension A1', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'The Park' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'A1', 'reading-comprehension', NULL, 5, '[The Park] What is the dog''s name?', 'Max', 'Buddy', 'Rex', 'Lucky', 'C', 'The passage says "My dog Rex loves the park."', 'Reading Comprehension A1', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'The Park' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'A2', 'reading-comprehension', NULL, 13, '[A Weekend Trip] How long was the drive to the beach?', 'About one hour', 'About two hours', 'About three hours', 'About four hours', 'B', 'The passage says "The drive took about two hours."', 'Reading Comprehension A2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'A Weekend Trip' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'A2', 'reading-comprehension', NULL, 14, '[A Weekend Trip] What did they eat for lunch?', 'Pizza', 'Sandwiches', 'Fish and chips', 'Burgers', 'C', 'The passage says "we ate fish and chips at a restaurant."', 'Reading Comprehension A2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'A Weekend Trip' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'A2', 'reading-comprehension', NULL, 14, '[A Weekend Trip] What was the weather like?', 'Cloudy and cold', 'Rainy', 'Beautiful and sunny', 'Windy', 'C', 'The passage says "the weather was beautiful and sunny."', 'Reading Comprehension A2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'A Weekend Trip' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'A2', 'reading-comprehension', NULL, 15, '[A Weekend Trip] What did they do in the afternoon?', 'They went shopping.', 'They went for a walk.', 'They played football.', 'They went surfing.', 'B', 'The passage says "In the afternoon, we went for a long walk along the coast."', 'Reading Comprehension A2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'A Weekend Trip' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'A2', 'reading-comprehension', NULL, 15, '[A Weekend Trip] How did they feel at the end of the trip?', 'Bored', 'Angry', 'Tired but happy', 'Sad', 'C', 'The passage says "We were tired but happy."', 'Reading Comprehension A2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'A Weekend Trip' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'A2', 'reading-comprehension', NULL, 15, '[My New Apartment] Which floor is the apartment on?', 'First', 'Second', 'Third', 'Fourth', 'C', 'The passage says "It is on the third floor."', 'Reading Comprehension A2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'My New Apartment' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'A2', 'reading-comprehension', NULL, 16, '[My New Apartment] What is the biggest room?', 'The kitchen', 'The bedroom', 'The bathroom', 'The living room', 'D', 'The passage says "The living room is the biggest room."', 'Reading Comprehension A2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'My New Apartment' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'A2', 'reading-comprehension', NULL, 16, '[My New Apartment] Why is the writer saving money?', 'The rent is cheap.', 'The writer no longer needs a car.', 'The writer got a pay rise.', 'The writer eats at home.', 'B', 'The passage says "I am saving money because I don''t need my car any more."', 'Reading Comprehension A2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'My New Apartment' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'A2', 'reading-comprehension', NULL, 17, '[My New Apartment] How long does it take to walk to work?', '5 minutes', '10 minutes', '15 minutes', '20 minutes', 'C', 'The passage says "I walk to work in 15 minutes."', 'Reading Comprehension A2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'My New Apartment' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'B1', 'reading-comprehension', NULL, 24, '[Working from Home] What is one advantage of working from home?', 'Better technology', 'Higher salaries', 'No need to commute', 'More promotions', 'C', 'The passage states workers "save time and money because they don''t need to commute."', 'Reading Comprehension B1', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'Working from Home' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'B1', 'reading-comprehension', NULL, 25, '[Working from Home] What is one disadvantage mentioned?', 'It costs more money.', 'Workers miss social interaction.', 'Technology doesn''t work well.', 'There is too much supervision.', 'B', 'The passage says "Many workers say they miss the social interaction of the office."', 'Reading Comprehension B1', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'Working from Home' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'B1', 'reading-comprehension', NULL, 26, '[Working from Home] What is a "hybrid model"?', 'Working only from home', 'Working only in the office', 'Working from home and the office on different days', 'Working for two companies', 'C', 'The passage explains it as "employees work from home two or three days a week and go to the office for the rest."', 'Reading Comprehension B1', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'Working from Home' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'B1', 'reading-comprehension', NULL, 27, '[Working from Home] What started the trend of working from home?', 'New technology', 'The pandemic', 'Company policy changes', 'Government rules', 'B', 'The passage begins "Since the pandemic, many people have been working from home."', 'Reading Comprehension B1', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'Working from Home' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'B1', 'reading-comprehension', NULL, 26, '[The Benefits of Reading] What do regular readers have?', 'Better health', 'Better memory and concentration', 'More friends', 'Higher incomes', 'B', 'The passage says "people who read regularly have better memory and concentration."', 'Reading Comprehension B1', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'The Benefits of Reading' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'B1', 'reading-comprehension', NULL, 27, '[The Benefits of Reading] Why are fiction readers more empathetic?', 'They are more intelligent.', 'They read more than others.', 'They see the world from different perspectives.', 'They have more free time.', 'C', 'The passage says fiction readers "are used to seeing the world from different perspectives."', 'Reading Comprehension B1', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'The Benefits of Reading' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'B1', 'reading-comprehension', NULL, 28, '[The Benefits of Reading] How long should you read daily?', 'At least 10 minutes', 'At least 20 minutes', 'At least 30 minutes', 'At least 1 hour', 'B', 'The passage says "Experts recommend reading for at least 20 minutes a day."', 'Reading Comprehension B1', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'The Benefits of Reading' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'B2', 'reading-comprehension', NULL, 34, '[The Gig Economy] What does the gig economy involve?', 'Long-term contracts', 'Government employment', 'Short-term or freelance work', 'Full-time employment only', 'C', 'The passage defines it as "short-term contracts or freelance jobs."', 'Reading Comprehension B2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'The Gig Economy' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'B2', 'reading-comprehension', NULL, 35, '[The Gig Economy] According to critics, what do gig workers lack?', 'Skills', 'Technology', 'Job security and benefits', 'Customers', 'C', 'Critics say "gig workers often lack job security, health insurance, and paid holidays."', 'Reading Comprehension B2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'The Gig Economy' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'B2', 'reading-comprehension', NULL, 36, '[The Gig Economy] Why do critics say companies are exploiting workers?', 'They pay too little.', 'They make workers use their own tools.', 'They classify workers as contractors instead of employees.', 'They charge high fees.', 'C', 'The passage says companies exploit workers "by classifying them as independent contractors rather than employees."', 'Reading Comprehension B2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'The Gig Economy' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'B2', 'reading-comprehension', NULL, 37, '[The Gig Economy] What have some countries started doing?', 'Banning the gig economy', 'Introducing legislation to protect workers', 'Creating their own platforms', 'Taxing gig workers more', 'B', 'The passage says "Several countries have started introducing legislation to protect gig workers'' rights."', 'Reading Comprehension B2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'The Gig Economy' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'B2', 'reading-comprehension', NULL, 36, '[AI in Education] What can AI tutoring systems do?', 'Replace all teachers', 'Adapt to individual learning pace and style', 'Write exams', 'Grade essays perfectly', 'B', 'The passage says AI systems "can adapt to individual students'' learning pace and style."', 'Reading Comprehension B2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'AI in Education' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'B2', 'reading-comprehension', NULL, 37, '[AI in Education] What worry do some educators have?', 'AI is too expensive.', 'Students don''t like technology.', 'Critical thinking skills could be undermined.', 'AI makes too many mistakes.', 'C', 'Educators worry that "over-reliance on technology could undermine the development of critical thinking skills."', 'Reading Comprehension B2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'AI in Education' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'B2', 'reading-comprehension', NULL, 38, '[AI in Education] What is the main challenge described?', 'Making AI cheaper', 'Training teachers to use AI', 'Balancing AI benefits with human elements', 'Getting students to accept AI', 'C', '"The challenge lies in harnessing the benefits of AI while preserving the human elements."', 'Reading Comprehension B2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'AI in Education' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'C1', 'reading-comprehension', NULL, 45, '[Decision Making] What did Kahneman demonstrate about human decision-making?', 'It is always logical.', 'It relies on mental shortcuts that cause errors.', 'It improves with more information.', 'It is completely random.', 'B', 'Kahneman "demonstrated that people rely on mental shortcuts, or heuristics, which can lead to systematic errors."', 'Reading Comprehension C1', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'Decision Making' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'C1', 'reading-comprehension', NULL, 46, '[Decision Making] What is the "availability heuristic"?', 'People prefer available options.', 'People overestimate the likelihood of easily recalled events.', 'People always choose the first option.', 'People make decisions based on availability of resources.', 'B', 'The passage explains it "causes people to overestimate the likelihood of events that are easily recalled."', 'Reading Comprehension C1', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'Decision Making' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'C1', 'reading-comprehension', NULL, 47, '[Decision Making] What does "loss aversion" mean?', 'People avoid making decisions.', 'People fear losing more than they enjoy gaining.', 'People always make bad financial decisions.', 'People prefer to keep the status quo.', 'B', '"The pain of losing something is psychologically about twice as powerful as the pleasure of gaining something of equivalent value."', 'Reading Comprehension C1', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'Decision Making' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'C1', 'reading-comprehension', NULL, 48, '[Decision Making] What is "nudge theory"?', 'Forcing people to make good decisions', 'Designing choice architectures to help people decide better', 'Removing all choices from people', 'Teaching people about cognitive biases', 'B', 'Nudge theory "seeks to design choice architectures that help people make better decisions without restricting their freedom."', 'Reading Comprehension C1', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'Decision Making' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'C1', 'reading-comprehension', NULL, 46, '[Urban Green Spaces] What health benefits are linked to green spaces?', 'Lower rates of cardiovascular disease', 'Better eyesight', 'Stronger muscles', 'Longer life span', 'A', 'Residents near green space "have significantly lower rates of cardiovascular disease, diabetes, and depression."', 'Reading Comprehension C1', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'Urban Green Spaces' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'C1', 'reading-comprehension', NULL, 47, '[Urban Green Spaces] What does environmental psychology research show?', 'People prefer indoor activities.', 'Brief exposure to nature reduces cortisol and improves cognition.', 'Urban parks are too noisy.', 'Exercise is more important than nature.', 'B', '"Even brief exposure to natural settings can reduce cortisol levels and improve cognitive function."', 'Reading Comprehension C1', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'Urban Green Spaces' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'C1', 'reading-comprehension', NULL, 48, '[Urban Green Spaces] What issue of inequality is mentioned?', 'Income inequality', 'Educational inequality', 'Unequal distribution of green spaces', 'Healthcare inequality', 'C', '"Urban green spaces are unequally distributed, with lower-income neighbourhoods typically having less access."', 'Reading Comprehension C1', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'Urban Green Spaces' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'C1', 'reading-comprehension', NULL, 49, '[Urban Green Spaces] What do advocates call for?', 'More private gardens', 'Green space to be treated as essential public infrastructure', 'Higher taxes for parks', 'Fewer buildings in cities', 'B', 'There are "calls for green space to be treated as essential public infrastructure rather than a luxury amenity."', 'Reading Comprehension C1', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'Urban Green Spaces' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'C2', 'reading-comprehension', NULL, 54, '[Paradox of Expertise] What did Tetlock''s study reveal about political experts?', 'They were the best forecasters.', 'They performed no better than educated laypeople.', 'They rarely made predictions.', 'They only predicted economic events.', 'B', '"Experts were, on average, no better at predicting geopolitical events than educated laypeople."', 'Reading Comprehension C2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'Paradox of Expertise' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'C2', 'reading-comprehension', NULL, 55, '[Paradox of Expertise] What is "the curse of knowledge"?', 'Knowing too many facts', 'Difficulty appreciating how non-experts perceive situations', 'Forgetting basic information', 'Being unable to learn new things', 'B', 'Experts "may struggle to appreciate how situations appear to those without specialised knowledge."', 'Reading Comprehension C2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'Paradox of Expertise' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'C2', 'reading-comprehension', NULL, 56, '[Paradox of Expertise] In which type of environment is expertise most reliable?', 'Complex political environments', '"Wicked" environments', '"Kind" learning environments', 'Interdisciplinary environments', 'C', 'Expertise is most valuable "in ''kind'' learning environments, where patterns repeat and feedback is immediate."', 'Reading Comprehension C2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'Paradox of Expertise' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'C2', 'reading-comprehension', NULL, 57, '[Paradox of Expertise] Why do experts sometimes perform worse than non-experts?', 'They lack motivation.', 'They over-apply domain-specific frameworks.', 'They don''t have access to data.', 'They work alone.', 'B', '"Experts are susceptible to domain-specific cognitive biases; for instance, economists may over-apply market-based frameworks."', 'Reading Comprehension C2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'Paradox of Expertise' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'C2', 'reading-comprehension', NULL, 55, '[Linguistic Determinism] What is the Sapir-Whorf hypothesis?', 'All languages are essentially the same.', 'Language structure shapes cognition and worldview.', 'Language learning is impossible after age 12.', 'Some languages are superior to others.', 'B', 'It "posits that the structure of a language fundamentally shapes its speakers'' cognition and worldview."', 'Reading Comprehension C2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'Linguistic Determinism' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'C2', 'reading-comprehension', NULL, 56, '[Linguistic Determinism] What did Boroditsky''s research show?', 'All languages describe space identically.', 'Speakers of different spatial reference systems navigate space differently.', 'English speakers are the best at navigation.', 'Spatial language has no effect on behaviour.', 'B', '"Speakers of languages with different spatial reference systems navigate physical space differently."', 'Reading Comprehension C2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'Linguistic Determinism' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'C2', 'reading-comprehension', NULL, 57, '[Linguistic Determinism] What is the modern understanding of language and thought?', 'Language completely determines thought.', 'Language has no effect on thought.', 'Language is one of several cognitive resources that shapes experience.', 'Only grammar affects cognition.', 'C', 'The research reveals "language as one of several interacting cognitive resources that collectively shape, without absolutely constraining, human experience."', 'Reading Comprehension C2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'Linguistic Determinism' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'C2', 'reading-comprehension', NULL, 58, '[Linguistic Determinism] Why did the strong version of the hypothesis fall out of favour?', 'New languages were discovered.', 'Chomsky''s universalist revolution in linguistics', 'Political reasons', 'Lack of interest', 'B', '"Linguistic determinism fell into disrepute following Chomsky''s universalist revolution in linguistics."', 'Reading Comprehension C2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'Linguistic Determinism' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'A1', 'reading-comprehension', NULL, 3, '[My Daily Routine] Where does Maria live?', 'Paris', 'Madrid', 'London', 'Rome', 'B', 'The passage says "I live in Madrid, Spain."', 'Reading Comprehension A1', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'My Daily Routine' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'A1', 'reading-comprehension', NULL, 4, '[My Daily Routine] When do Maria''s classes finish?', '1 PM', '2 PM', '3 PM', '4 PM', 'C', 'The passage says "finish at 3 PM."', 'Reading Comprehension A1', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'My Daily Routine' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'A1', 'reading-comprehension', NULL, 5, '[The Park] What do the family do at the park?', 'Play football', 'Have a picnic', 'Go swimming', 'Read books', 'B', 'The passage says "We always have a picnic."', 'Reading Comprehension A1', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'The Park' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'A2', 'reading-comprehension', NULL, 14, '[A Weekend Trip] When did they leave for the beach?', 'Friday evening', 'Saturday morning', 'Sunday morning', 'Saturday afternoon', 'B', 'The passage says "We left on Saturday morning at 8 AM."', 'Reading Comprehension A2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'A Weekend Trip' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'A2', 'reading-comprehension', NULL, 16, '[My New Apartment] How are the neighbours?', 'Quiet', 'Noisy', 'Friendly', 'Unfriendly', 'C', 'The passage says "My neighbours are very friendly."', 'Reading Comprehension A2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'My New Apartment' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'A2', 'reading-comprehension', NULL, 17, '[My New Apartment] How many bedrooms does the apartment have?', 'One', 'Two', 'Three', 'Four', 'B', 'The passage says "There are two bedrooms."', 'Reading Comprehension A2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'My New Apartment' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'B1', 'reading-comprehension', NULL, 27, '[Working from Home] What do some people find difficult?', 'Learning new technology', 'Working longer hours', 'Separating work and personal life', 'Finding a quiet space', 'C', '"Some people find it difficult to separate their work life from their personal life."', 'Reading Comprehension B1', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'Working from Home' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'B1', 'reading-comprehension', NULL, 28, '[The Benefits of Reading] What does reading improve?', 'Physical health', 'Eyesight', 'Vocabulary and writing skills', 'Mathematical ability', 'C', '"Reading also improves your vocabulary and writing skills."', 'Reading Comprehension B1', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'The Benefits of Reading' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'B2', 'reading-comprehension', NULL, 36, '[The Gig Economy] Which companies are mentioned as examples?', 'Google, Apple, and Microsoft', 'Uber, Deliveroo, and Fiverr', 'Facebook, Twitter, and Instagram', 'Amazon, Netflix, and Spotify', 'B', '"Companies like Uber, Deliveroo, and Fiverr" are mentioned as examples.', 'Reading Comprehension B2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'The Gig Economy' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'B2', 'reading-comprehension', NULL, 38, '[AI in Education] What do language learning apps use AI for?', 'Writing essays', 'Translating documents', 'Simulating conversations and correcting pronunciation', 'Creating study timetables', 'C', '"Language learning apps use AI to simulate conversations and correct pronunciation errors."', 'Reading Comprehension B2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'AI in Education' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'B2', 'reading-comprehension', NULL, 39, '[AI in Education] What concern about data is raised?', 'Data storage is expensive', 'Data is inaccurate', 'Privacy concerns about data collection', 'There is not enough data', 'C', '"There are also concerns about data privacy, as these systems collect vast amounts of information."', 'Reading Comprehension B2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'AI in Education' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'C1', 'reading-comprehension', NULL, 47, '[Decision Making] What is the "anchoring effect"?', 'People always make the same decisions', 'Initial information disproportionately influences later decisions', 'People prefer familiar options', 'First impressions are always correct', 'B', '"Initial information disproportionately influences subsequent decisions, even when that information is arbitrary."', 'Reading Comprehension C1', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'Decision Making' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'C1', 'reading-comprehension', NULL, 48, '[Urban Green Spaces] What mechanisms explain the health benefits?', 'Better diet and sleep', 'Encouraging exercise, reducing pollution and noise, social interaction', 'Lower crime rates', 'Better healthcare access', 'B', 'The passage lists: encouraging physical activity, reducing pollution, decreasing noise, and providing social interaction.', 'Reading Comprehension C1', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'Urban Green Spaces' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'C2', 'reading-comprehension', NULL, 56, '[Paradox of Expertise] What is a "wicked" learning environment?', 'A deliberately difficult learning space', 'An environment where cause and effect are clear', 'An environment where feedback is delayed or ambiguous', 'A harmful or unethical learning system', 'C', '"Wicked" environments are where "cause and effect are obscure and feedback is delayed or ambiguous."', 'Reading Comprehension C2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'Paradox of Expertise' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'C2', 'reading-comprehension', NULL, 57, '[Linguistic Determinism] What do languages with evidentiality markers require?', 'Speakers to use formal grammar', 'Speakers to be more precise about knowledge sources', 'Speakers to learn multiple languages', 'Speakers to write more than they speak', 'B', 'Languages with evidentiality "compel their speakers to be more precise about the sources of their knowledge."', 'Reading Comprehension C2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'Linguistic Determinism' LIMIT 1), true, CURRENT_TIMESTAMP);

INSERT INTO "PlacementQuestion" ("id", "section", "cefrLevel", "topic", "subtopic", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation", "recommendedTopic", "readingPassageId", "active", "createdAt")
VALUES (gen_random_uuid()::text, 'reading', 'C2', 'reading-comprehension', NULL, 58, '[Linguistic Determinism] What effect does grammatical gender have?', 'It makes language harder to learn', 'It influences speakers'' associations with gendered objects', 'It has no measurable effect', 'It only affects written language', 'B', 'Languages with grammatical gender "appear to influence speakers'' associations with those objects."', 'Reading Comprehension C2', (SELECT "id" FROM "ReadingPassage" WHERE "title" = 'Linguistic Determinism' LIMIT 1), true, CURRENT_TIMESTAMP);

COMMIT;

-- ============================================================
-- SUMMARY
-- Reading Passages: 12
-- Grammar Questions: 652
-- Reading Questions: 64
-- TOTAL QUESTIONS: 716
-- ============================================================

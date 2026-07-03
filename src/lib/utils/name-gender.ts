/**
 * Best-effort gender guess from a first name, used to pick TTS voices for
 * dialogue characters in lessons generated before characters carried a
 * gender field. New lessons include gender in the dialogue content, which
 * always takes precedence over this heuristic.
 */

const FEMALE = new Set([
  'emma', 'sarah', 'sara', 'anna', 'maria', 'marie', 'sofia', 'sophia', 'sophie',
  'laura', 'julia', 'giulia', 'elena', 'lena', 'lisa', 'nina', 'clara', 'chiara',
  'amira', 'yuki', 'mei', 'aiko', 'hana', 'priya', 'ana', 'lucia', 'camila',
  'isabella', 'isabel', 'olivia', 'mia', 'ava', 'chloe', 'zoe', 'grace', 'ella',
  'lily', 'ruby', 'alice', 'kate', 'katie', 'jane', 'jessica', 'jennifer',
  'rachel', 'rebecca', 'hannah', 'megan', 'lauren', 'amy', 'emily', 'charlotte',
  'lucy', 'holly', 'natasha', 'tanya', 'irina', 'olga', 'svetlana', 'ingrid',
  'astrid', 'freya', 'carmen', 'rosa', 'valentina', 'francesca', 'martina',
  'simone', 'nicole', 'monica', 'sandra', 'petra', 'eva', 'ines', 'fatima',
  'leila', 'yasmin', 'noor', 'aisha', 'zara', 'diana', 'linda', 'karen',
  'susan', 'nancy', 'helen', 'ellen', 'claire', 'louise', 'margaret', 'heidi',
])

const MALE = new Set([
  'marcus', 'mark', 'marco', 'james', 'john', 'jack', 'david', 'daniel', 'dan',
  'michael', 'mike', 'thomas', 'tom', 'peter', 'paul', 'carlos', 'juan', 'jose',
  'luis', 'diego', 'pablo', 'andrea', 'luca', 'matteo', 'giovanni', 'giuseppe',
  'antonio', 'francesco', 'alessandro', 'lorenzo', 'stefan', 'stefano', 'hans',
  'klaus', 'lars', 'erik', 'sven', 'henrik', 'kenji', 'hiroshi', 'takeshi',
  'raj', 'arjun', 'omar', 'ahmed', 'ali', 'hassan', 'ivan', 'dmitri', 'sergei',
  'alexei', 'boris', 'viktor', 'adam', 'ben', 'sam', 'max', 'leo', 'oscar',
  'henry', 'william', 'will', 'george', 'charlie', 'oliver', 'harry', 'noah',
  'ethan', 'liam', 'lucas', 'mason', 'logan', 'alexander', 'alex', 'ryan',
  'nathan', 'kevin', 'brian', 'chris', 'christopher', 'steve', 'steven',
  'robert', 'rob', 'richard', 'martin', 'simon', 'philip', 'felix', 'hugo',
  'andre', 'bruno', 'rafael', 'gabriel', 'miguel', 'pedro', 'fernando',
])

export function guessGenderFromName(name: string): 'male' | 'female' | null {
  const first = (name || '').trim().split(/\s+/)[0]?.toLowerCase()
  if (!first) return null
  if (FEMALE.has(first)) return 'female'
  if (MALE.has(first)) return 'male'
  return null
}

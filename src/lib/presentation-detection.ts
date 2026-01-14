/**
 * Presentation Lesson Detection
 * Identifies when a lesson topic/title should be generated as a presentation lesson
 */

const PRESENTATION_KEYWORDS = [
  'presentation',
  'presenting',
  'pitch',
  'present',
  'public speaking',
  'conference presentation',
  'keynote',
];

interface PresentationDetectionContext {
  title: string;
  objective?: string;
  endGoals?: string;
  occupation?: string | null;
  methodology?: string;
}

/**
 * Determines if a lesson should be rendered as a presentation lesson
 * Only returns true for EXPLICIT presentation-focused lessons
 * Checks lesson title and description
 * @param context - The lesson context to analyze
 * @returns true if this should be a presentation lesson
 */
export function isPresentationLesson(context: PresentationDetectionContext): boolean {
  const titleLower = (context.title || '').toLowerCase();
  const objectiveLower = (context.objective || '').toLowerCase();

  // Check title and description for explicit presentation keywords
  const hasExplicitPresentationKeyword = PRESENTATION_KEYWORDS.some(keyword =>
    titleLower.includes(keyword) || objectiveLower.includes(keyword)
  );

  return hasExplicitPresentationKeyword;
}

/**
 * Extracts presentation context from lesson information
 */
export function extractPresentationContext(
  title: string,
  endGoals?: string,
  occupation?: string
): {
  presentationType: string;
  audience: string;
} {
  const title_lower = title.toLowerCase();
  const goals_lower = (endGoals || '').toLowerCase();

  // Determine presentation type
  let presentationType = 'General Presentation';
  if (title_lower.includes('pitch') || goals_lower.includes('pitch')) {
    presentationType = 'Business Pitch';
  } else if (title_lower.includes('product')) {
    presentationType = 'Product Presentation/Demo';
  } else if (title_lower.includes('training') || title_lower.includes('teach')) {
    presentationType = 'Training/Educational Presentation';
  } else if (title_lower.includes('report') || title_lower.includes('update')) {
    presentationType = 'Status Report/Team Update';
  } else if (title_lower.includes('proposal')) {
    presentationType = 'Proposal Presentation';
  } else if (title_lower.includes('conference') || title_lower.includes('keynote')) {
    presentationType = 'Conference/Keynote Presentation';
  }

  // Determine audience
  let audience = 'General Audience';
  if (title_lower.includes('client') || goals_lower.includes('client')) {
    audience = 'Clients/External Stakeholders';
  } else if (title_lower.includes('team') || occupation === 'manager') {
    audience = 'Team Members/Internal Audience';
  } else if (title_lower.includes('executive') || title_lower.includes('c-level')) {
    audience = 'Senior Management/Executives';
  } else if (title_lower.includes('investor')) {
    audience = 'Investors';
  } else if (occupation?.toLowerCase().includes('trainer') || title_lower.includes('training')) {
    audience = 'Students/Trainees';
  }

  return { presentationType, audience };
}

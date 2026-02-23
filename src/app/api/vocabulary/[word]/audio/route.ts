import { NextRequest, NextResponse } from 'next/server';
import { generateVocabularyAudio, getVocabularyAudioUrl } from '@/lib/vocabulary-audio';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';
import { stripHtml } from '@/lib/sanitize';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { canAccessVocabAudio } from '@/lib/feature-gates';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ word: string }> }
) {
  try {
    // Pro+ plan check
    const session = await getServerSession(authOptions) as { user?: { id?: string } } | null;
    if (session?.user?.id) {
      const hasAccess = await canAccessVocabAudio(session.user.id);
      if (!hasAccess) {
        return NextResponse.json(
          { error: 'Vocabulary audio is a Pro feature. Upgrade your plan to unlock it.', upgrade: true },
          { status: 403 }
        );
      }
    }

    // Apply rate limiting
    const identifier = getClientIdentifier(request);
    const rateLimit = checkRateLimit(identifier, RATE_LIMITS.API_VOCABULARY_AUDIO);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { 
          error: 'Too many requests',
          message: 'Please wait before requesting more audio',
          retryAfter: Math.ceil((rateLimit.reset - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimit.limit.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimit.reset).toISOString(),
            'Retry-After': Math.ceil((rateLimit.reset - Date.now()) / 1000).toString(),
          }
        }
      );
    }

    const { word } = await params;

    if (!word || word.trim().length === 0) {
      return NextResponse.json(
        { error: 'Word parameter is required' },
        { status: 400 }
      );
    }

    // Decode URL-encoded characters (e.g., %20 -> space)
    const decodedWord = decodeURIComponent(word);
    
    // Sanitize input to prevent XSS and injection attacks
    const sanitizedWord = stripHtml(decodedWord.trim());
    
    // Validate word length and characters
    if (sanitizedWord.length > 100) {
      return NextResponse.json(
        { error: 'Word too long' },
        { status: 400 }
      );
    }
    
    // Only allow alphanumeric, spaces, and common punctuation
    if (!/^[a-zA-Z0-9\s\-',.!?]+$/.test(sanitizedWord)) {
      return NextResponse.json(
        { error: 'Invalid characters in word' },
        { status: 400 }
      );
    }

    // Check if audio already exists
    const existingUrl = await getVocabularyAudioUrl(sanitizedWord);
    if (existingUrl) {
      return NextResponse.json({
        audioUrl: existingUrl,
        cached: true
      }, {
        headers: {
          'X-RateLimit-Limit': rateLimit.limit.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimit.reset).toISOString(),
        }
      });
    }

    // Generate new audio
    const result = await generateVocabularyAudio(sanitizedWord);

    return NextResponse.json(result, {
      headers: {
        'X-RateLimit-Limit': rateLimit.limit.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': new Date(rateLimit.reset).toISOString(),
      }
    });
  } catch (error) {
    console.error('Vocabulary audio generation error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isElevenLabsError = errorMessage.includes('ElevenLabs API error');
    const isTimeout = errorMessage.includes('timeout') || errorMessage.includes('connect');
    
    return NextResponse.json(
      { 
        error: 'Failed to generate audio',
        message: isElevenLabsError || isTimeout
          ? 'Audio generation service temporarily unavailable. Please try again later.' 
          : errorMessage,
        retryable: isElevenLabsError || isTimeout,
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: isTimeout ? 504 : 503 }
    );
  }
}

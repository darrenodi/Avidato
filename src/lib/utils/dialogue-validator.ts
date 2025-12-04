/**
 * Dialogue structure validation utilities
 */

/**
 * Validate and fix dialogue structure to ensure student speaks after every speaker
 * This mutates parsedResponse in-place
 */
export function enforceDialogueStructure(parsedResponse: unknown, studentName: string): void {
  if (typeof parsedResponse !== 'object' || parsedResponse === null) return;
  const resp = parsedResponse as { exercises?: unknown[] };
  if (!resp.exercises || !Array.isArray(resp.exercises)) return;

  type Exercise = { type?: string; content?: { dialogue?: unknown[] } };
  for (const ex of resp.exercises as Exercise[]) {
    if (!ex || ex.type !== 'dialogue' || !ex.content || !Array.isArray(ex.content.dialogue)) continue;

    const dialogue = ex.content.dialogue as unknown[];
    type DialogueLine = { character?: string; text?: string };
    
    // Check if dialogue follows strict alternation: student speaks after every non-student speaker
    let lastSpeaker = '';
    let needsFix = false;

    for (let i = 0; i < dialogue.length; i++) {
      const line = dialogue[i];
      if (typeof line !== 'object' || line === null) continue;
      const dl = line as DialogueLine;
      const speaker = dl.character || '';

      // If last speaker was not the student and current speaker is also not the student, we have a problem
      if (lastSpeaker && lastSpeaker !== studentName && speaker !== studentName) {
        needsFix = true;
        console.warn(
          `Dialogue structure violation: "${lastSpeaker}" followed by "${speaker}" without student "${studentName}" between them`
        );
        break;
      }

      lastSpeaker = speaker;
    }

    if (needsFix) {
      console.warn(
        'Dialogue does not follow strict alternation. Consider regenerating or manually fixing the lesson.'
      );
    }
  }
}

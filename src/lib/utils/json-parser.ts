/**
 * JSON parsing utilities for AI-generated responses
 */

/**
 * Extract JSON from text that may contain markdown or other formatting
 */
export function extractJSONFromText(text: string): string {
  const startIdx = text.indexOf('{');
  const lastIdx = text.lastIndexOf('}');

  if (startIdx === -1 || lastIdx === -1 || startIdx >= lastIdx) {
    throw new Error('No valid JSON found in AI response');
  }

  return text.substring(startIdx, lastIdx + 1);
}

/**
 * Clean and parse JSON with multiple fallback strategies
 */
export function cleanAndParseJSON<T>(jsonStr: string): T {
  // Clean the JSON string intelligently
  let cleanedJson = jsonStr
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/[\r\t]/g, ' ') // Replace tabs and remaining carriage returns with spaces
    .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
    .replace(/  +/g, ' '); // Collapse multiple spaces to one

  try {
    return JSON.parse(cleanedJson) as T;
  } catch (firstError) {
    // Log the problematic JSON segment around error position
    const syntaxError = firstError as SyntaxError;
    const positionMatch = syntaxError.message.match(/position (\d+)/);
    const errorPos = positionMatch ? parseInt(positionMatch[1]) : -1;
    
    if (errorPos > 0) {
      const start = Math.max(0, errorPos - 100);
      const end = Math.min(cleanedJson.length, errorPos + 100);
      console.error(
        `JSON syntax error at position ${errorPos}:`,
        cleanedJson.substring(start, end)
      );
    }

    // Second attempt with more aggressive cleanup
    cleanedJson = cleanedJson
      .replace(/[\x00-\x1F\x7F]/g, ' ') // Replace control characters with spaces
      .replace(/\\\\n/g, ' ') // Fix double-escaped newlines
      .replace(/\\\\t/g, ' ') // Fix double-escaped tabs
      .replace(/  +/g, ' ') // Collapse spaces again
      .replace(/,\s*]/g, ']') // Remove trailing commas in arrays
      .replace(/,\s*}/g, '}'); // Remove trailing commas in objects

    // Fix unescaped quotes within string values by properly escaping them
    // Split by quote boundaries and fix quotes only within string values
    const parts = cleanedJson.split('"');
    for (let i = 1; i < parts.length; i += 2) {
      // Odd indices are content within quotes - escape any unescaped quotes
      parts[i] = parts[i].replace(/\\"/g, '\\"').replace(/"/g, '\\"');
    }
    cleanedJson = parts.join('"');

    // Third pass: fix common JSON structural issues
    cleanedJson = cleanedJson
      .replace(/}\s+{/g, '},{') // Fix missing commas between objects
      .replace(/]\s+{/g, '],[') // Fix missing commas between array and object
      .replace(/}\s+\[/g, '},[') // Fix missing commas between object and array
      .replace(/]\s+[{[\d"]/g, (match) => '],' + match.slice(1)) // Fix missing commas after arrays
      .replace(/}\s+[{[\d"]/g, (match) => '},' + match.slice(1)); // Fix missing commas after objects

    console.error(
      'JSON parse failed on first attempt. Error:',
      syntaxError.message
    );

    return JSON.parse(cleanedJson) as T;
  }
}

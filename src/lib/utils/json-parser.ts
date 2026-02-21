/**
 * JSON parsing utilities for AI-generated responses
 */

/**
 * Strip markdown code fences (```json ... ```) that LLMs (especially Gemini)
 * commonly wrap around JSON output.
 */
export function stripMarkdownFences(text: string): string {
  return text
    .replace(/^```(?:json)?\s*\n?/i, '')
    .replace(/\n?\s*```\s*$/i, '')
    .trim();
}

/**
 * Extract JSON from text that may contain markdown or other formatting.
 * Handles both top-level objects ({...}) and arrays ([...]).
 */
export function extractJSONFromText(text: string): string {
  // First strip any markdown fences
  const cleaned = stripMarkdownFences(text);

  // Try to find a JSON object
  const objStart = cleaned.indexOf('{');
  const objEnd = cleaned.lastIndexOf('}');

  // Try to find a JSON array
  const arrStart = cleaned.indexOf('[');
  const arrEnd = cleaned.lastIndexOf(']');

  const hasObj = objStart !== -1 && objEnd !== -1 && objEnd > objStart;
  const hasArr = arrStart !== -1 && arrEnd !== -1 && arrEnd > arrStart;

  if (!hasObj && !hasArr) {
    throw new Error('No valid JSON found in AI response');
  }

  // Pick whichever starts first (outermost structure)
  if (hasObj && hasArr) {
    if (objStart <= arrStart) {
      return cleaned.substring(objStart, objEnd + 1);
    }
    return cleaned.substring(arrStart, arrEnd + 1);
  }

  if (hasObj) {
    return cleaned.substring(objStart, objEnd + 1);
  }

  return cleaned.substring(arrStart, arrEnd + 1);
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

    // Fix unescaped quotes within string values using character-by-character parsing
    let fixedJson = '';
    let inString = false;
    let escapeNext = false;

    for (let i = 0; i < cleanedJson.length; i++) {
      const char = cleanedJson[i];
      
      if (escapeNext) {
        fixedJson += char;
        escapeNext = false;
        continue;
      }
      
      if (char === '\\') {
        fixedJson += char;
        escapeNext = true;
        continue;
      }
      
      if (char === '"') {
        inString = !inString;
        fixedJson += char;
        
        if (!inString) {
          // We just closed a string. Check for missing comma.
          let j = i + 1;
          while (j < cleanedJson.length && /\s/.test(cleanedJson[j])) {
            j++;
          }
          if (j < cleanedJson.length) {
            const nextChar = cleanedJson[j];
            // If next char is a value starter or key starter, insert comma
            if (nextChar === '"' || nextChar === '{' || nextChar === '[' || /[\d-]/.test(nextChar)) {
              fixedJson += ',';
            }
          }
        }
        continue;
      }
      
      fixedJson += char;
    }
    
    cleanedJson = fixedJson;

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

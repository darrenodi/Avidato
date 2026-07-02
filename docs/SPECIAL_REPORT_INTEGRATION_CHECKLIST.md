# Special Report Integration Checklist

## Integration Steps for Lesson Display

To integrate the Special Report lesson type into your lesson page display logic:

### Step 1: Import Components

In your `src/app/lessons/[id]/page.tsx`:

```typescript
import { SpecialReportLessonDisplay } from '@/lib/lesson-displays'
```

### Step 2: Add Type Check

In your lesson display logic, add a check for `special-report`:

```typescript
// Around line 780 in page.tsx (with Under-18 check)
{lesson.content.lessonType === 'special-report' ? (
  <SpecialReportLessonDisplay
    lesson={lesson.content as SpecialReportLessonContent}
    showObjectives={true}
    showProgressBar={true}
    showHeader={true}
    isTutorView={true}
  />
) : lesson.content.lessonType === 'Under-18' ? (
  // ... existing Under-18 logic
) : ...}
```

### Step 3: Add to Share Page

In your `src/app/lessons/[id]/share/page.tsx`:

```typescript
import { SpecialReportLessonDisplay } from '@/lib/lesson-displays'

// In the lesson display section:
lesson.content?.lessonType === 'special-report' ? (
  <SpecialReportLessonDisplay
    lesson={lesson.content as SpecialReportLessonContent}
    showObjectives={true}
    showProgressBar={true}
    showHeader={true}
    isTutorView={false}  // Student view
  />
) : ...
```

### Step 4: Import Type

Make sure to import the type:

```typescript
import { SpecialReportLessonContent } from '@/types/module-lesson'
```

## Example Integration

Here's how to add it to the existing conditional rendering:

```typescript
// Before (existing logic)
if (lesson.content?.lessonType === 'instant') {
  // instant lesson display
} else if (lesson.content?.lessonType === 'modular') {
  // modular lesson display
} else if (lesson.content?.lessonType === 'Under-18') {
  // Under-18 lesson display
}

// After (with Special Report added)
if (lesson.content?.lessonType === 'instant') {
  // instant lesson display
} else if (lesson.content?.lessonType === 'modular') {
  // modular lesson display
} else if (lesson.content?.lessonType === 'special-report') {
  // Special Report lesson display
  return (
    <SpecialReportLessonDisplay
      lesson={lesson.content}
      showObjectives={true}
      showProgressBar={true}
      showHeader={true}
      isTutorView={true}
    />
  )
} else if (lesson.content?.lessonType === 'Under-18') {
  // Under-18 lesson display
}
```

## Files to Update

### Primary Files

✅ `src/app/lessons/[id]/page.tsx`
- Import `SpecialReportLessonDisplay`
- Import `SpecialReportLessonContent` type
- Add conditional check for `lessonType === 'special-report'`
- Render the display component

✅ `src/app/lessons/[id]/share/page.tsx`
- Same as above but with `isTutorView={false}`

### Optional Files (if needed)

- `src/app/api/lessons/route.ts` - If generating lessons
- `src/lib/gemini.ts` or `src/lib/openai.ts` - If generating via AI
- Database schema - If storing in Prisma

## Testing Checklist

After integration:

- [ ] Lesson page loads without errors
- [ ] Special Report lesson displays correctly
- [ ] All 11 modules render
- [ ] Navigation tabs work
- [ ] Progress tracking works
- [ ] Dark mode works
- [ ] Responsive design works (mobile/tablet/desktop)
- [ ] Share page displays correctly
- [ ] Tutor view shows properly
- [ ] Student view hides answers
- [ ] No console errors
- [ ] TypeScript compilation succeeds

## Sample Lesson for Testing

Use the included example in `special-report-template.ts`:

```typescript
import { digitalNomadSpecialReportExample } from '@/lib/lesson-templates/special-report-template'

// Test by creating a lesson object with this data
const testLesson = {
  id: 'test-123',
  content: digitalNomadSpecialReportExample,
  student: {
    id: 'student-1',
    name: 'John Doe',
    targetLanguage: 'English',
    level: 'Advanced'
  }
}
```

## Complete Integration Code

Here's a complete code block to add to your lesson page:

```typescript
// ─── Imports ─────────────────────────────────────────────────────────

import { SpecialReportLessonDisplay } from '@/lib/lesson-displays'
import { SpecialReportLessonContent } from '@/types/module-lesson'

// ─── In your lesson rendering logic ──────────────────────────────────

{!loading && !error && lesson && (
  <>
    {lesson.content?.lessonType === 'instant' ? (
      // existing instant logic
    ) : lesson.content?.lessonType === 'modular' ? (
      // existing modular logic
    ) : lesson.content?.lessonType === 'special-report' ? (
      <div className="space-y-4 sm:space-y-6">
        {/* Header with back button and actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            href={`/dashboard/students/${lesson.student.id}`}
            className="inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {lesson.student.name}
          </Link>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setRefineOpen(true)}
              className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-brand-primary text-brand-primary rounded-lg hover:bg-brand-primary/5 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Refine
            </button>
            <button
              onClick={copyShareLink}
              className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm flex-1 sm:flex-none"
            >
              Share
            </button>
          </div>
        </div>

        {/* Lesson Display */}
        <SpecialReportLessonDisplay
          lesson={lesson.content as SpecialReportLessonContent}
          showObjectives={true}
          showProgressBar={true}
          showHeader={true}
          isTutorView={true}
        />
      </div>
    ) : lesson.content?.lessonType === 'Under-18' ? (
      // existing Under-18 logic
    ) : (
      // existing default logic
    )}
  </>
)}
```

## Integration Points

### In Lesson Page (`[id]/page.tsx`)

**Location:** Around line 780 (with other lesson type checks)  
**Action:** Add Special Report conditional before rendering  
**Props:** 
- `lesson` - The lesson content object
- `showObjectives={true}` - Display learning objectives
- `showProgressBar={true}` - Show progress bar
- `showHeader={true}` - Show lesson metadata
- `isTutorView={true}` - Show tutor features

### In Share Page (`[id]/share/page.tsx`)

**Location:** Around line 820 (similar to above)  
**Action:** Add Special Report conditional  
**Props:** Same as above, but `isTutorView={false}` for student view

## Database Consideration

If lessons are generated:

Add to your AI prompt:

```
If the lesson topic is business-related and should follow a special report 
structure (listening, reading, vocabulary, discussion), set:
"lessonType": "special-report"

And structure the modules as 11 distinct components following the template at:
src/lib/lesson-templates/special-report-template.ts
```

## Deployment Checklist

Before deploying to production:

- [ ] All integration code added
- [ ] TypeScript compiles without errors
- [ ] All imports resolved
- [ ] Tested with example lesson
- [ ] Tested with custom lesson
- [ ] Dark mode tested
- [ ] Responsive design tested
- [ ] All 11 modules tested
- [ ] Navigation works
- [ ] Progress tracking works
- [ ] Share functionality works
- [ ] Tutor view works
- [ ] Student view works
- [ ] Console has no errors
- [ ] Ready for launch 🚀

## Support

If you need help:

1. Check the type definitions: `src/types/module-lesson.ts`
2. Review the component: `src/lib/lesson-displays/special-report-display.tsx`
3. See the example: `src/lib/lesson-templates/special-report-template.ts`
4. Read the docs: `docs/SPECIAL_REPORT_LESSON_TYPE.md`

---

**That's it!** Once integrated, Special Report lessons will display automatically whenever a lesson has `lessonType: 'special-report'`.

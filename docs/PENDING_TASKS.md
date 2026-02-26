# Pending Tasks

## 1. Simplify lesson text colors
- White theme: black text everywhere. Dark theme: white text everywhere.
- Remove all the colored text variations (amber, violet, indigo, teal, rose, blue, etc.) across all lesson displays.
- Affected files: YouTube lesson page, YouTube lesson detail page, YouTube share page, regular lesson page, lesson share page, instant lesson, and all renderer components in `src/lib/lesson-displays/renderers/`.

## 2. Remove Grammar Lesson Generator entirely
- Delete the grammar generation API route and related code.
- Remove the grammar tool from the tools page / dashboard.
- Clean up any sidebar links, navigation, or references to grammar lessons.

## 3. Vocabulary structure consistency
- The vocabulary section in **YouTube lessons** and **Instant Lesson Generator** should match the structure/display used in the **normal Lesson Planner** (the standard lesson at `/lessons/[id]`).
- Align the pre-teach / vocabulary rendering so all three lesson types look the same.

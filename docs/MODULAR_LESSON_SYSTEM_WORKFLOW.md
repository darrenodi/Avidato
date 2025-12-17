# Modular Lesson System Workflow

## Overview

This document outlines the architecture and workflow for the modular, type-aware lesson generation and rendering system. The system creates diverse, goal-aligned lessons based on student profiles and renders them using type-specific components.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         STUDENT PROFILE                             │
│                  (goals, level, profession, etc.)                   │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
        ┌────────────────────────────────────────┐
        │   LEARNING PLAN GENERATION             │
        │   (Type Selection & Sequencing)        │
        │   → Select 10 diverse lesson types     │
        │   → Order based on learning path       │
        │   → 6 pathways × methodology selection │
        └────────────────────┬───────────────────┘
                             │
        ┌────────────────────▼───────────────────┐
        │    LESSON METADATA                     │
        │  (Type + Topic + Duration)             │
        │  [Email, Speaking, Grammar, ...]       │
        └────────────────────┬───────────────────┘
                             │
                             ▼
        ┌────────────────────────────────────────┐
        │  TYPE-AWARE LESSON GENERATION          │
        │  (Content Creation)                    │
        │  → Email lesson → writing-focused      │
        │  → Speaking lesson → speaking guides   │
        │  → Grammar lesson → grammar-centered   │
        │  → [10 lesson types total]             │
        └────────────────────┬───────────────────┘
                             │
        ┌────────────────────▼───────────────────┐
        │    GENERATED LESSON DATA               │
        │  (Exercises + Metadata + Type)         │
        └────────────────────┬───────────────────┘
                             │
                             ▼
        ┌────────────────────────────────────────┐
        │  LESSON DISPLAY & RENDERING            │
        │  (Type-Aware Dispatch)                 │
        │  → Detect lesson type                  │
        │  → Use appropriate renderer            │
        │  → Display type-specific UI            │
        └────────────────────┬───────────────────┘
                             │
        ┌────────────────────▼───────────────────┐
        │   RENDERED LESSON VIEW                 │
        │  (Student & Tutor Views)               │
        │  [Lesson completed / shared]           │
        └────────────────────────────────────────┘
```

---

## Four Core Requirements

### 1. Type-Aware Learning Plan Generation

**Purpose**: Select diverse lesson types that align with student goals

**Current State**:
- Learning plan generation creates 10 generic topics
- Doesn't differentiate lesson structures
- One-size-fits-all approach

**Required Changes**:
- Modify `generateLearningPlan()` to return lesson types, not just topics
- Add type selection logic based on:
  - Student's professional goals (email writing, presentations, negotiations)
  - Student's learning level (grammar-heavy early, conversational later)
  - Methodology selection (CLT, TBLT, PPP, TTT)
- Ensure variety: 10 different lesson types across 10 lessons
- Support 6 business pathways:
  - General Workplace
  - Emails & Reports
  - Presentations
  - Meetings & Negotiations
  - Customer Service
  - Leadership

**Location**: `/src/lib/openai.ts` + `/src/lib/AIAGENT/gemini.ts`

**Output**: LearningPlan with lesson types + topics + metadata

---

### 2. Type-Specific Lesson Generation

**Purpose**: Generate content tailored to lesson type

**Current State**:
- Lesson generation is type-agnostic
- All lessons use same prompting strategy
- No awareness of lesson objectives

**Required Changes**:
- Create lesson type enum (10 types)
- Build type-specific prompt builders
- Modify `generateLesson()` to accept lesson type
- Generate appropriate exercises per type:
  - **Email Lesson** → email writing scenarios, formatting, tone exercises
  - **Speaking Lesson** → dialogue practice, pronunciation guides, fluency exercises
  - **Grammar Lesson** → grammar rules, exercises, error correction
  - **Presentation Lesson** → structure, slides outline, delivery tips
  - **Meeting Lesson** → discussion phrases, turn-taking, negotiation
  - **Listening Lesson** → audio comprehension, note-taking
  - **Reading Lesson** → comprehension, vocabulary, inference
  - **Vocabulary Lesson** → word lists, collocations, usage
  - **Discussion Lesson** → debate topics, argument structure
  - **Roleplay Lesson** → scenarios, character cards, interaction patterns

**Location**: `/src/lib/openai.ts` + `/src/lib/AIAGENT/gemini.ts`

**Output**: GeneratedLesson with type-specific exercises and metadata

---

### 3. Modular Type-Specific Renderers

**Purpose**: Display lessons using type-appropriate components

**Current State**:
- Single monolithic EngooLessonDisplay (799 lines)
- Handles all exercise types manually
- Not scalable for new lesson types

**Required Approach**:
- Create base renderer interface
- Build 10 independent renderers (200-300 lines each):
  - `EmailLessonRenderer`
  - `SpeakingLessonRenderer`
  - `GrammarLessonRenderer`
  - `PresentationLessonRenderer`
  - `MeetingLessonRenderer`
  - `ListeningLessonRenderer`
  - `ReadingLessonRenderer`
  - `VocabularyLessonRenderer`
  - `DiscussionLessonRenderer`
  - `RoleplayLessonRenderer`

**Design Principles**:
- Each renderer handles its own exercise display
- Each renderer manages its own validation logic
- Each renderer controls its own UX interactions
- Adding new type = creating new renderer only
- No central switch statement for exercise types

**Location**: `/src/components/lesson/renderers/`

**Structure**:
```
renderers/
├── base/
│   ├── BaseLessonRenderer.tsx      (abstract interface)
│   └── LessonRendererFactory.tsx   (dispatch mechanism)
├── EmailLessonRenderer.tsx
├── SpeakingLessonRenderer.tsx
├── GrammarLessonRenderer.tsx
├── [7 more renderers...]
└── index.ts                         (exports)
```

**Key Feature**: Renderer selection via factory pattern
```typescript
const renderer = LessonRendererFactory.getRenderer(lesson.type);
return renderer.render(lesson);
```

---

### 4. Type-Aware Display & Sharing

**Purpose**: Dynamically detect and render lessons; preserve sharing functionality

**Current State**:
- Single lesson display uses hardcoded Engoo renderer
- No type detection
- Monolithic component structure

**Required Changes**:
- Add lesson type detection from metadata
- Implement renderer factory dispatch
- Preserve lesson metadata for sharing
- Support both student & tutor views
- Maintain consistent UX across types

**Location**: `/src/app/lessons/[id]/page.tsx`

**Updated Flow**:
1. Load lesson from database
2. Extract lesson type from metadata
3. Get appropriate renderer via factory
4. Render lesson with type-aware component
5. Show sharing/download options

---

## Data Flow Deep Dive

### Phase 1: Learning Plan Creation

**Input**: Student profile with goals, level, methodology

**Process**:
```typescript
// Current approach (generic)
const plan = await generateLearningPlan(student);
// Returns: { lessons: [{ topic: "business email" }, ...] }

// New approach (type-aware)
const plan = await generateLearningPlanWithTypes(student, pathway);
// Returns: {
//   lessons: [
//     { type: 'email', topic: "formal business email", duration: 45 },
//     { type: 'speaking', topic: "phone conversation", duration: 50 },
//     { type: 'grammar', topic: "conditional structures", duration: 40 },
//     ...
//   ]
// }
```

**Selection Logic**:
- Week 1-3: Grammar + foundational types (vocabulary, reading)
- Week 4-6: Skills application (email, speaking, listening)
- Week 7-8: Advanced (presentations, meetings, discussions)
- Vary based on pathway (emails pathway = more email lessons)
- Vary based on methodology (TBLT = more task-focused types)

**Storage**: Lessons table includes `type` field with enum values

---

### Phase 2: Lesson Generation

**Input**: Student, lesson type, topic, duration

**Process**:
```typescript
// Type-specific generation
const lesson = await generateLessonByType({
  student,
  type: 'email',           // NEW: explicit type
  topic: 'formal proposal',
  duration: 45,
  pathway: 'emails-reports'
});

// Returns structure specific to type:
// - Email lesson: focuses on tone, structure, formality
// - Speaking lesson: includes dialogue, pronunciation, fluency cues
// - Grammar lesson: includes explanations, pattern drills, corrections
```

**Type-Specific Prompting**:
- Each type has custom prompt template
- Prompt includes type-specific instructions
- Exercises generated match lesson type requirements
- Metadata includes type for later dispatch

**Storage**: Lessons table stores full generated content + type

---

### Phase 3: Lesson Rendering

**Input**: Lesson from database with type metadata

**Process**:
```typescript
// Type detection
const lessonType = lesson.metadata.type;

// Renderer selection
const renderer = LessonRendererFactory.getRenderer(lessonType);

// Rendering
const component = renderer.render(lesson);
```

**Renderer Responsibilities**:
- Format exercises appropriately
- Handle validation logic
- Manage user interactions
- Display feedback/progress
- Support audio/visual elements if needed

**Output**: Interactive lesson view

---

## Modularity Principles

### 1. Independence
- Each renderer is completely independent
- No shared renderer logic between types
- Each can evolve independently
- No central coordinating component

### 2. Extensibility
- Adding new lesson type:
  1. Create new renderer component
  2. Add type to enum
  3. Add type-specific prompt builder
  4. Register in factory
  5. Done (no changes to existing files)

### 3. Type Safety
- Lesson type as strict enum, not string
- TypeScript ensures type coverage
- Factory enforces type-renderer mapping
- Compilation errors if type missing renderer

### 4. Separation of Concerns
- Learning plan generation ≠ rendering
- Lesson generation ≠ lesson display
- Type selection ≠ content creation
- Content creation ≠ presentation

---

## File Structure

```
src/
├── lib/
│   ├── openai.ts                          (modify for type-aware generation)
│   │   ├── generateLearningPlanWithTypes()
│   │   ├── generateLessonByType()
│   │   └── buildTypeSpecificPrompt()
│   ├── AIAGENT/
│   │   └── gemini.ts                      (modify for type-aware generation)
│   └── types/
│       └── lesson.ts                      (lesson type enum + interfaces)
│
├── components/
│   └── lesson/
│       ├── renderers/
│       │   ├── base/
│       │   │   ├── BaseLessonRenderer.tsx
│       │   │   └── LessonRendererFactory.tsx
│       │   ├── EmailLessonRenderer.tsx
│       │   ├── SpeakingLessonRenderer.tsx
│       │   ├── GrammarLessonRenderer.tsx
│       │   ├── PresentationLessonRenderer.tsx
│       │   ├── MeetingLessonRenderer.tsx
│       │   ├── ListeningLessonRenderer.tsx
│       │   ├── ReadingLessonRenderer.tsx
│       │   ├── VocabularyLessonRenderer.tsx
│       │   ├── DiscussionLessonRenderer.tsx
│       │   ├── RoleplayLessonRenderer.tsx
│       │   └── index.ts
│       └── [existing components]
│
├── app/
│   ├── lessons/
│   │   └── [id]/
│   │       └── page.tsx                   (update for type-aware dispatch)
│   └── api/
│       └── lessons/
│           └── route.ts                   (update for type-aware generation)
│
└── types/
    └── lesson.ts                          (new: lesson type definitions)
```

---

## Implementation Sequence

### Step 1: Define Types & Interfaces
- Create `LessonType` enum (10 types)
- Create lesson interfaces per type
- Create type-specific configs

### Step 2: Modify Learning Plan Generation
- Update `generateLearningPlan()` to select types
- Add pathway-aware type selection logic
- Add methodology-aware sequencing

### Step 3: Enhance Lesson Generation
- Create type-specific prompt builders
- Update `generateLesson()` to accept type
- Test generation with each type

### Step 4: Build Renderer Base
- Create base renderer interface
- Create factory for type dispatch
- Set up file structure

### Step 5: Implement Renderers (10 total)
- Build each type renderer independently
- Test each renderer separately
- Ensure consistent baseline UX

### Step 6: Update Display Component
- Modify lesson page to detect type
- Add renderer factory integration
- Test across all lesson types

### Step 7: Update API Routes
- Modify lesson generation endpoint
- Accept type parameter
- Return type in metadata

### Step 8: Testing & Refinement
- Test learning plan variety
- Test lesson generation per type
- Test rendering per type
- Test sharing functionality

---

## Key Design Decisions

### Why This Approach?

1. **Modularity First**: Each component is independent, not interconnected
2. **Type-First Design**: Type is first-class, not afterthought
3. **Scalability**: Adding types doesn't affect existing code
4. **Maintainability**: Each renderer is isolated, easier to debug
5. **Extensibility**: Easy to swap renderers, add visualization, etc.

### Why Not Monolithic?

- Single component for all types becomes unmaintainable (1000+ lines)
- Adding exercise type = modifying existing code
- Debugging mixed logic difficult
- Testing all permutations complex
- Performance burden of rendering all features

### Why Factory Pattern?

- Type-to-renderer mapping is explicit
- Missing type throws compile error
- Supports future: swappable renderers, decorators, etc.
- Single dispatch point for all rendering

---

## Success Criteria

✅ Learning plan contains 10 diverse lesson types per student  
✅ Each lesson type has distinct generation prompt  
✅ Each lesson type has independent renderer  
✅ Lesson display auto-detects type and renders appropriately  
✅ Sharing preserves lesson type metadata  
✅ Adding new lesson type requires no changes to existing code  
✅ Build compiles with strict TypeScript  
✅ All 10 types functional and tested  

---

## References

- Existing learning plan: `/src/lib/openai.ts` lines 87-236
- Existing lesson generation: `/src/lib/openai.ts` lines 313-387
- Current monolithic renderer: `/src/components/lesson/EngooLessonComponents.tsx` (799 lines)
- Lesson display: `/src/app/lessons/[id]/page.tsx`
- API route: `/src/app/api/lessons/route.ts`


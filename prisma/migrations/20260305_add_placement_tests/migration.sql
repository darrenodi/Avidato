-- Placement Test System
-- Production migration - DO NOT modify existing tables

-- ============================================================
-- 1. Question Pool (800+ questions, never regenerated)
-- ============================================================
CREATE TABLE "PlacementQuestion" (
    "id"              TEXT NOT NULL,
    "section"         TEXT NOT NULL,            -- 'grammar' | 'reading'
    "cefrLevel"       TEXT NOT NULL,            -- 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
    "topic"           TEXT NOT NULL,            -- e.g. 'articles', 'conditionals', 'inversion'
    "subtopic"        TEXT,                     -- e.g. 'zero conditional', 'first conditional'
    "difficulty"      INTEGER NOT NULL,         -- 1-60 (linear scale across all levels)
    "stem"            TEXT NOT NULL,            -- The question text
    "optionA"         TEXT NOT NULL,
    "optionB"         TEXT NOT NULL,
    "optionC"         TEXT NOT NULL,
    "optionD"         TEXT NOT NULL,
    "correctAnswer"   TEXT NOT NULL,            -- 'A' | 'B' | 'C' | 'D'
    "explanation"     TEXT NOT NULL,            -- Why the answer is correct
    "recommendedTopic" TEXT NOT NULL,           -- lesson topic to recommend on mistake
    "readingPassageId" TEXT,                    -- links to ReadingPassage for reading questions
    "active"          BOOLEAN NOT NULL DEFAULT true,
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlacementQuestion_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PlacementQuestion_section_idx" ON "PlacementQuestion"("section");
CREATE INDEX "PlacementQuestion_cefrLevel_idx" ON "PlacementQuestion"("cefrLevel");
CREATE INDEX "PlacementQuestion_topic_idx" ON "PlacementQuestion"("topic");
CREATE INDEX "PlacementQuestion_difficulty_idx" ON "PlacementQuestion"("difficulty");
CREATE INDEX "PlacementQuestion_section_difficulty_idx" ON "PlacementQuestion"("section", "difficulty");
CREATE INDEX "PlacementQuestion_section_cefrLevel_idx" ON "PlacementQuestion"("section", "cefrLevel");

-- ============================================================
-- 2. Reading Passages (for reading section questions)
-- ============================================================
CREATE TABLE "ReadingPassage" (
    "id"        TEXT NOT NULL,
    "cefrLevel" TEXT NOT NULL,
    "title"     TEXT NOT NULL,
    "content"   TEXT NOT NULL,
    "wordCount" INTEGER NOT NULL,
    "source"    TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReadingPassage_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "PlacementQuestion"
    ADD CONSTRAINT "PlacementQuestion_readingPassageId_fkey"
    FOREIGN KEY ("readingPassageId") REFERENCES "ReadingPassage"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================================
-- 3. Test Assignments (teacher assigns to student)
-- ============================================================
CREATE TABLE "PlacementTestAssignment" (
    "id"             TEXT NOT NULL,
    "studentId"      TEXT NOT NULL,
    "assignedById"   TEXT NOT NULL,            -- teacher user ID
    "sections"       TEXT[] NOT NULL,           -- ['grammar'] or ['grammar','reading']
    "status"         TEXT NOT NULL DEFAULT 'assigned',  -- 'assigned' | 'in_progress' | 'completed'
    "shareToken"     TEXT NOT NULL,             -- unique token for student link
    "studentFullName" TEXT,                     -- optional full name for certificate
    "emailOnComplete" BOOLEAN NOT NULL DEFAULT true,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt"    TIMESTAMP(3),

    CONSTRAINT "PlacementTestAssignment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PlacementTestAssignment_shareToken_key" ON "PlacementTestAssignment"("shareToken");
CREATE INDEX "PlacementTestAssignment_studentId_idx" ON "PlacementTestAssignment"("studentId");
CREATE INDEX "PlacementTestAssignment_assignedById_idx" ON "PlacementTestAssignment"("assignedById");
CREATE INDEX "PlacementTestAssignment_shareToken_idx" ON "PlacementTestAssignment"("shareToken");
CREATE INDEX "PlacementTestAssignment_status_idx" ON "PlacementTestAssignment"("status");

ALTER TABLE "PlacementTestAssignment"
    ADD CONSTRAINT "PlacementTestAssignment_studentId_fkey"
    FOREIGN KEY ("studentId") REFERENCES "Student"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PlacementTestAssignment"
    ADD CONSTRAINT "PlacementTestAssignment_assignedById_fkey"
    FOREIGN KEY ("assignedById") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
-- 4. Section Attempts (one per section per assignment)
-- ============================================================
CREATE TABLE "PlacementSectionAttempt" (
    "id"             TEXT NOT NULL,
    "assignmentId"   TEXT NOT NULL,
    "section"        TEXT NOT NULL,            -- 'grammar' | 'reading'
    "status"         TEXT NOT NULL DEFAULT 'not_started',  -- 'not_started' | 'in_progress' | 'completed'
    "currentLevel"   TEXT NOT NULL DEFAULT 'B1',  -- adaptive: current bracket
    "questionsAsked" INTEGER NOT NULL DEFAULT 0,
    "correctCount"   INTEGER NOT NULL DEFAULT 0,
    "consecutiveCorrect" INTEGER NOT NULL DEFAULT 0,
    "consecutiveWrong"   INTEGER NOT NULL DEFAULT 0,
    "determinedLevel" TEXT,                    -- final CEFR level result
    "score"          DOUBLE PRECISION,         -- 0-100 percentage
    "startedAt"      TIMESTAMP(3),
    "completedAt"    TIMESTAMP(3),
    "timeSpentSecs"  INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PlacementSectionAttempt_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PlacementSectionAttempt_assignmentId_idx" ON "PlacementSectionAttempt"("assignmentId");
CREATE UNIQUE INDEX "PlacementSectionAttempt_assignmentId_section_key" ON "PlacementSectionAttempt"("assignmentId", "section");

ALTER TABLE "PlacementSectionAttempt"
    ADD CONSTRAINT "PlacementSectionAttempt_assignmentId_fkey"
    FOREIGN KEY ("assignmentId") REFERENCES "PlacementTestAssignment"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
-- 5. Individual Answers
-- ============================================================
CREATE TABLE "PlacementAnswer" (
    "id"           TEXT NOT NULL,
    "attemptId"    TEXT NOT NULL,
    "questionId"   TEXT NOT NULL,
    "selectedAnswer" TEXT NOT NULL,            -- 'A' | 'B' | 'C' | 'D'
    "isCorrect"    BOOLEAN NOT NULL,
    "timeTakenSecs" INTEGER NOT NULL DEFAULT 0,
    "questionOrder" INTEGER NOT NULL,          -- order in which it was shown
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlacementAnswer_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PlacementAnswer_attemptId_idx" ON "PlacementAnswer"("attemptId");
CREATE INDEX "PlacementAnswer_questionId_idx" ON "PlacementAnswer"("questionId");

ALTER TABLE "PlacementAnswer"
    ADD CONSTRAINT "PlacementAnswer_attemptId_fkey"
    FOREIGN KEY ("attemptId") REFERENCES "PlacementSectionAttempt"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PlacementAnswer"
    ADD CONSTRAINT "PlacementAnswer_questionId_fkey"
    FOREIGN KEY ("questionId") REFERENCES "PlacementQuestion"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- ============================================================
-- 6. Test Results (final summary per assignment)
-- ============================================================
CREATE TABLE "PlacementTestResult" (
    "id"               TEXT NOT NULL,
    "assignmentId"     TEXT NOT NULL,
    "overallLevel"     TEXT NOT NULL,           -- CEFR level
    "grammarLevel"     TEXT,
    "readingLevel"     TEXT,
    "grammarScore"     DOUBLE PRECISION,
    "readingScore"     DOUBLE PRECISION,
    "strengths"        TEXT[] NOT NULL DEFAULT '{}',
    "weaknesses"       TEXT[] NOT NULL DEFAULT '{}',
    "recommendations"  JSONB NOT NULL DEFAULT '[]',  -- [{topic, level, description}]
    "totalTimeSecs"    INTEGER NOT NULL DEFAULT 0,
    "certificateId"    TEXT,                    -- unique ID for certificate URL
    "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlacementTestResult_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PlacementTestResult_assignmentId_key" ON "PlacementTestResult"("assignmentId");
CREATE UNIQUE INDEX "PlacementTestResult_certificateId_key" ON "PlacementTestResult"("certificateId");
CREATE INDEX "PlacementTestResult_assignmentId_idx" ON "PlacementTestResult"("assignmentId");

ALTER TABLE "PlacementTestResult"
    ADD CONSTRAINT "PlacementTestResult_assignmentId_fkey"
    FOREIGN KEY ("assignmentId") REFERENCES "PlacementTestAssignment"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

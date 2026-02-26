-- YouTube Lesson Library: shared lessons accessible by all tutors
-- Unique by (sourceUrl, level) — same video at different CEFR levels = separate lessons

CREATE TABLE IF NOT EXISTS "YouTubeLesson" (
  "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "videoId"   TEXT NOT NULL,
  "sourceUrl" TEXT NOT NULL,
  "level"     TEXT NOT NULL,
  "title"     TEXT NOT NULL,
  "topic"     TEXT,
  "data"      JSONB NOT NULL,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "YouTubeLesson_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "YouTubeLesson_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Unique constraint: one lesson per URL + level
CREATE UNIQUE INDEX IF NOT EXISTS "YouTubeLesson_sourceUrl_level_key" ON "YouTubeLesson"("sourceUrl", "level");

-- Index for browsing by level
CREATE INDEX IF NOT EXISTS "YouTubeLesson_level_idx" ON "YouTubeLesson"("level");

-- Index for ordering by creation date
CREATE INDEX IF NOT EXISTS "YouTubeLesson_createdAt_idx" ON "YouTubeLesson"("createdAt");

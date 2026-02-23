-- Add YouTube lesson generation tracking fields to User table
ALTER TABLE "User" ADD COLUMN "youtubeGenerationCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "lastYoutubeGenerationDate" TIMESTAMP(3);

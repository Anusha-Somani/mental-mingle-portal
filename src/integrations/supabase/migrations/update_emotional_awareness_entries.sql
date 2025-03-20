
-- Add the drawing column to the emotional_awareness_entries table if it doesn't exist
ALTER TABLE IF EXISTS emotional_awareness_entries 
ADD COLUMN IF NOT EXISTS drawing TEXT DEFAULT NULL;


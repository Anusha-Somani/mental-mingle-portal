
-- Create the emotional_hacking_data table
CREATE TABLE IF NOT EXISTS emotional_hacking_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id INTEGER NOT NULL,
  completed_exercises TEXT[] DEFAULT '{}',
  favorite_exercises TEXT[] DEFAULT '{}',
  journal_entries JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Each user can have only one entry per module
  UNIQUE(user_id, module_id)
);

-- Add RLS policies
ALTER TABLE emotional_hacking_data ENABLE ROW LEVEL SECURITY;

-- Users can only read their own data
CREATE POLICY "Users can read their own emotional hacking data" 
  ON emotional_hacking_data 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "Users can insert their own emotional hacking data" 
  ON emotional_hacking_data 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "Users can update their own emotional hacking data" 
  ON emotional_hacking_data 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create index on user_id and module_id for faster lookups
CREATE INDEX IF NOT EXISTS emotional_hacking_data_user_module_idx 
  ON emotional_hacking_data(user_id, module_id);

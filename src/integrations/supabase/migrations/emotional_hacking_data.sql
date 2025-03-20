
-- Create emotional_hacking_data table
CREATE TABLE IF NOT EXISTS emotional_hacking_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id INTEGER NOT NULL,
  completed_exercises TEXT[] DEFAULT '{}',
  favorite_exercises TEXT[] DEFAULT '{}',
  journal_entries JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- Create a trigger to update the updated_at column
CREATE TRIGGER update_emotional_hacking_data_updated_at
BEFORE UPDATE ON emotional_hacking_data
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE emotional_hacking_data ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to select their own data
CREATE POLICY select_own_emotional_hacking_data ON emotional_hacking_data
  FOR SELECT USING (auth.uid() = user_id);

-- Policy to allow users to insert their own data
CREATE POLICY insert_own_emotional_hacking_data ON emotional_hacking_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own data
CREATE POLICY update_own_emotional_hacking_data ON emotional_hacking_data
  FOR UPDATE USING (auth.uid() = user_id);


-- Create a table to store emotional awareness activity entries
CREATE TABLE IF NOT EXISTS public.emotional_awareness_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id INTEGER NOT NULL,
  location TEXT,
  appearance TEXT,
  intensity TEXT,
  volume TEXT,
  message TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- Enable Row Level Security
ALTER TABLE public.emotional_awareness_entries ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view their own entries
CREATE POLICY "Users can view their own entries" 
  ON public.emotional_awareness_entries 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to insert their own entries
CREATE POLICY "Users can insert their own entries" 
  ON public.emotional_awareness_entries 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to update their own entries
CREATE POLICY "Users can update their own entries" 
  ON public.emotional_awareness_entries 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_emotional_awareness_entries_updated_at
  BEFORE UPDATE ON public.emotional_awareness_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

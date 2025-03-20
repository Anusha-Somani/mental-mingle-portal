
export interface EmotionalHackingData {
  id?: string;
  user_id: string;
  module_id: number;
  completed_exercises: string[];
  favorite_exercises: string[];
  journal_entries: Record<string, string>;
  created_at?: string;
  updated_at?: string;
}

export interface Exercise {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  instructions: string;
}

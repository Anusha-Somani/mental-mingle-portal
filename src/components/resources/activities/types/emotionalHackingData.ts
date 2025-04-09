
// Define the structure of the emotional_hacking_data table
export interface EmotionalHackingData {
  id: string;
  user_id: string;
  journal_entries: string[];
  completed_exercises: string[];
  favorite_exercises: string[];
  created_at: string;
  updated_at: string;
}

// Define the structure for inserting new data
export interface EmotionalHackingDataInsert {
  user_id: string;
  journal_entries?: string[];
  completed_exercises?: string[];
  favorite_exercises?: string[];
  created_at?: string;
}

// Define the structure for updating existing data
export interface EmotionalHackingDataUpdate {
  journal_entries?: string[];
  completed_exercises?: string[];
  favorite_exercises?: string[];
  updated_at?: string;
}

// Define a type to properly assert the data when working with Supabase
export const asEmotionalHackingData = (data: any): EmotionalHackingData => {
  return data as EmotionalHackingData;
};

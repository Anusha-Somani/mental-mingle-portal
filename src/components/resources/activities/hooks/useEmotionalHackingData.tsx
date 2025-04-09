
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  EmotionalHackingData, 
  EmotionalHackingDataInsert,
  asEmotionalHackingData 
} from "../types/emotionalHackingData";

interface JournalEntries {
  [key: string]: string;
}

const useEmotionalHackingData = (userId: string | null, isOpen: boolean) => {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<EmotionalHackingData | null>(null);
  const [journalEntries, setJournalEntries] = useState<JournalEntries>({});
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [favoriteExercises, setFavoriteExercises] = useState<string[]>([]);
  const { toast } = useToast();

  // Fetch user's emotional hacking data
  const fetchData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Using type assertion to bypass TypeScript's type checking for Supabase tables
      const { data: emotionalHackingData, error } = await supabase
        .from('emotional_hacking_data' as any)
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Record not found, create a new one
          return await createInitialData();
        } else {
          console.error("Error fetching emotional hacking data:", error);
          setError(error.message);
          toast({
            title: "Error",
            description: "Failed to load your data. Please try again later.",
            variant: "destructive",
          });
        }
      } else if (emotionalHackingData) {
        // Convert the data to our defined type
        const typedData = asEmotionalHackingData(emotionalHackingData);
        
        // Update local state with fetched data
        setData(typedData);
        
        // Create journal entries object from fetched data
        const journalObj: JournalEntries = {};
        if (typedData.journal_entries && typedData.journal_entries.length) {
          // Assuming journal_entries is stored as an array of strings in the format "exerciseId:content"
          typedData.journal_entries.forEach(entry => {
            const [id, ...content] = entry.split(':');
            if (id) journalObj[id] = content.join(':') || '';
          });
        }
        
        setJournalEntries(journalObj);
        setCompletedExercises(typedData.completed_exercises || []);
        setFavoriteExercises(typedData.favorite_exercises || []);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred");
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create initial data record for a new user
  const createInitialData = async () => {
    try {
      const newData: EmotionalHackingDataInsert = {
        user_id: userId!,
        journal_entries: [],
        completed_exercises: [],
        favorite_exercises: [],
      };

      // Using type assertion to bypass TypeScript's type checking for Supabase tables
      const { data: createdData, error } = await supabase
        .from('emotional_hacking_data' as any)
        .insert(newData)
        .select()
        .single();

      if (error) {
        console.error("Error creating initial data:", error);
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to initialize your data. Please try again later.",
          variant: "destructive",
        });
      } else if (createdData) {
        // Convert the data to our defined type
        const typedData = asEmotionalHackingData(createdData);
        setData(typedData);
        setJournalEntries({});
        setCompletedExercises([]);
        setFavoriteExercises([]);
      }
    } catch (err) {
      console.error("Unexpected error creating data:", err);
      setError("An unexpected error occurred");
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Handle journal changes
  const handleJournalChange = (exerciseId: string, content: string) => {
    setJournalEntries(prev => ({
      ...prev,
      [exerciseId]: content
    }));
  };

  // Toggle favorite status for an exercise
  const handleToggleFavorite = (exerciseId: string) => {
    setFavoriteExercises(prev => {
      if (prev.includes(exerciseId)) {
        return prev.filter(id => id !== exerciseId);
      } else {
        return [...prev, exerciseId];
      }
    });
  };

  // Mark an exercise as completed
  const handleCompleteExercise = (exerciseId: string) => {
    if (!completedExercises.includes(exerciseId)) {
      setCompletedExercises(prev => [...prev, exerciseId]);
      
      // Also save progress to database
      saveProgress();
      
      toast({
        title: "Exercise Completed",
        description: "Great job! You've completed this exercise.",
      });
    }
  };

  // Save all progress to the database
  const saveProgress = async () => {
    if (!userId || !data) return;

    setIsSubmitting(true);
    try {
      // Convert journal entries object to array format for storage
      const journalArray = Object.entries(journalEntries).map(
        ([id, content]) => `${id}:${content}`
      );

      const updatePayload = {
        journal_entries: journalArray,
        completed_exercises: completedExercises,
        favorite_exercises: favoriteExercises,
        updated_at: new Date().toISOString(),
      };

      // Using type assertion to bypass TypeScript's type checking for Supabase tables
      const { error } = await supabase
        .from('emotional_hacking_data' as any)
        .update(updatePayload)
        .eq('user_id', userId);

      if (error) {
        console.error(`Error updating data:`, error);
        setError(error.message);
        toast({
          title: "Error",
          description: `Failed to save your progress. Please try again later.`,
          variant: "destructive",
        });
      } else {
        // Update local state with the new data
        setData({
          ...data,
          journal_entries: journalArray,
          completed_exercises: completedExercises,
          favorite_exercises: favoriteExercises,
          updated_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error("Unexpected error saving data:", err);
      setError("An unexpected error occurred");
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch data when the component mounts or userId changes
  useEffect(() => {
    if (isOpen && userId) {
      fetchData();
    }
  }, [userId, isOpen]);

  return {
    journalEntries,
    completedExercises,
    favoriteExercises,
    loading,
    isSubmitting,
    error,
    handleJournalChange,
    handleToggleFavorite,
    handleCompleteExercise,
    saveProgress,
  };
};

export default useEmotionalHackingData;

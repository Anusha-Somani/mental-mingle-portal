
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EmotionalHackingData } from "../types/emotionalHackingTypes";

export const useEmotionalHackingData = (userId: string | null, isOpen: boolean) => {
  const { toast } = useToast();
  const [journalEntries, setJournalEntries] = useState<Record<string, string>>({});
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [favoriteExercises, setFavoriteExercises] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load existing data if available
  useEffect(() => {
    const loadExistingData = async () => {
      if (!userId || !isOpen) return;
      
      try {
        // Type assertion to work around the TypeScript type system
        // We know this table exists in our database but TypeScript doesn't know about it yet
        const { data, error } = await supabase
          .from('emotional_hacking_data')
          .select('*')
          .eq('user_id', userId)
          .eq('module_id', 202) // Emotional Hacking module ID
          .single();
          
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          console.error("Error loading data:", error);
          return;
        }
        
        if (data) {
          setJournalEntries(data.journal_entries || {});
          setCompletedExercises(data.completed_exercises || []);
          setFavoriteExercises(data.favorite_exercises || []);
        }
      } catch (error) {
        console.error("Failed to load existing data:", error);
      }
    };
    
    loadExistingData();
  }, [userId, isOpen]);

  const handleJournalChange = (exerciseId: string, content: string) => {
    setJournalEntries(prev => ({
      ...prev,
      [exerciseId]: content
    }));
  };

  const handleToggleFavorite = (exerciseId: string) => {
    setFavoriteExercises(prev => {
      if (prev.includes(exerciseId)) {
        return prev.filter(id => id !== exerciseId);
      } else {
        return [...prev, exerciseId];
      }
    });
  };

  const saveProgress = async (
    completed: string[] = completedExercises,
    favorites: string[] = favoriteExercises,
    journals: Record<string, string> = journalEntries
  ) => {
    if (!userId) return;
    
    setIsSubmitting(true);
    
    try {
      // Save responses to Supabase with type assertion
      const { error } = await supabase
        .from('emotional_hacking_data')
        .upsert({
          user_id: userId,
          module_id: 202, // Emotional Hacking module ID
          completed_exercises: completed,
          favorite_exercises: favorites,
          journal_entries: journals,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,module_id'
        });
        
      if (error) throw error;
      
      // Mark the module as completed in user_progress if user completed at least 3 exercises
      if (completed.length >= 3) {
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('completed_modules, xp')
          .eq('user_id', userId)
          .single();
        
        if (progressData) {
          const completedModules = progressData.completed_modules || [];
          const moduleId = 202; // Emotional Hacking module ID
          
          if (!completedModules.includes(moduleId)) {
            const updatedModules = [...completedModules, moduleId];
            const updatedXP = (progressData.xp || 0) + 150; // XP for this module
            
            await supabase
              .from('user_progress')
              .upsert({
                user_id: userId,
                completed_modules: updatedModules,
                xp: updatedXP
              });
              
            toast({
              title: "Module completed!",
              description: "You've earned 150 XP!",
            });
          }
        }
      }
    } catch (error) {
      console.error("Error saving progress:", error);
      toast({
        title: "Error",
        description: "Failed to save your progress",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteExercise = async (exerciseId: string) => {
    if (!userId) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your progress",
        variant: "destructive"
      });
      return;
    }
    
    if (!completedExercises.includes(exerciseId)) {
      const updatedCompletedExercises = [...completedExercises, exerciseId];
      setCompletedExercises(updatedCompletedExercises);
      
      // Save to database
      await saveProgress(updatedCompletedExercises, favoriteExercises, journalEntries);
      
      toast({
        title: "Exercise completed!",
        description: "Your progress has been saved",
      });
    }
  };

  return {
    journalEntries,
    completedExercises,
    favoriteExercises,
    isSubmitting,
    handleJournalChange,
    handleToggleFavorite,
    handleCompleteExercise,
    saveProgress
  };
};

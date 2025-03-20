
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  Power,
  Sparkles,
  Brain,
  BookOpen,
  Music,
  Eye,
  HeartPulse,
  Footprints
} from "lucide-react";

interface EmotionalHackingActivityProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

interface EmotionalHackingData {
  id?: string;
  user_id: string;
  module_id: number;
  completed_exercises: string[];
  favorite_exercises: string[];
  journal_entries: Record<string, string>;
  created_at?: string;
  updated_at?: string;
}

// Define all the emotional hacking exercises
const exercises = [
  {
    id: "digital-detox",
    name: "Digital Detox",
    icon: <Power className="h-6 w-6 text-[#FC68B3]" />,
    description: "Give yourself a mental break by unplugging from all electronic devices. Taking a \"vacation\" from screens can help you reset and refocus. Use this time to connect with yourself or the physical world around you.",
    instructions: "Set a timer for 15-30 minutes and put away all electronic devices. Notice how you feel before, during, and after."
  },
  {
    id: "box-breathing",
    name: "Box Breathing",
    icon: <Sparkles className="h-6 w-6 text-[#3DFDFF]" />,
    description: "Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, and hold again for 4 seconds. This rhythmic breathing pattern can calm your nervous system.",
    instructions: "Imagine tracing a box in the air as you do this breathing exercise. Focus on making each side of the box equal in length."
  },
  {
    id: "free-writing",
    name: "Free Writing",
    icon: <BookOpen className="h-6 w-6 text-[#F5DF4D]" />,
    description: "Take a moment to write down whatever you're feeling. Don't censor yourself, just let the words flow. This can help you process your emotions and clear your mind.",
    instructions: "Write continuously for 5 minutes without stopping or judging what comes out."
  },
  {
    id: "five-senses",
    name: "5-4-3-2-1 Grounding",
    icon: <Brain className="h-6 w-6 text-[#FF8A48]" />,
    description: "Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
    instructions: "Take your time with each sense, really focusing on the details of what you're experiencing."
  },
  {
    id: "music-immersion",
    name: "Music Immersion",
    icon: <Music className="h-6 w-6 text-[#2AC20E]" />,
    description: "Put on your favorite song and really focus on the lyrics, beats, or instruments. Try to hum along or tap your fingers to the rhythm.",
    instructions: "Close your eyes while listening to increase your focus on the auditory experience."
  },
  {
    id: "sensory-focus",
    name: "Sensory Focus",
    icon: <Eye className="h-6 w-6 text-[#D5D5F1]" />,
    description: "Pop a piece of gum or a mint in your mouth and focus on the flavor, texture, and how it feels as you chew.",
    instructions: "Notice how the flavor changes over time and how the sensation affects your mood."
  },
  {
    id: "walk-it-out",
    name: "Walk It Out",
    icon: <Footprints className="h-6 w-6 text-[#FC68B3]" />,
    description: "Take a walk, even if it's just around your room. Notice the feeling of your feet hitting the ground. Bonus: Walk barefoot on grass!",
    instructions: "Pay attention to each step and how your body feels as you move."
  },
  {
    id: "color-hunt",
    name: "Color Hunt",
    icon: <Eye className="h-6 w-6 text-[#3DFDFF]" />,
    description: "Pick a color and find 5 things around you that match it. This distracts your brain and brings you back to the present.",
    instructions: "Choose a different color each time you practice this exercise."
  },
  {
    id: "memory-rewind",
    name: "Memory Rewind",
    icon: <Brain className="h-6 w-6 text-[#F5DF4D]" />,
    description: "Think of a happy or funny memory and walk yourself through the details—what were you wearing? Who was there? What did it smell like?",
    instructions: "Try to engage all your senses as you recall this positive memory."
  }
];

const EmotionalHackingActivity: React.FC<EmotionalHackingActivityProps> = ({
  isOpen,
  onClose,
  userId
}) => {
  const { toast } = useToast();
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [journalEntries, setJournalEntries] = useState<Record<string, string>>({});
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [favoriteExercises, setFavoriteExercises] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing data if available
  useEffect(() => {
    const loadExistingData = async () => {
      if (!userId || !isOpen) return;
      
      try {
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

  const handleExerciseSelect = (exerciseId: string) => {
    setSelectedExercise(exerciseId);
  };

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

  const saveProgress = async (
    completed: string[] = completedExercises,
    favorites: string[] = favoriteExercises,
    journals: Record<string, string> = journalEntries
  ) => {
    if (!userId) return;
    
    setIsSubmitting(true);
    
    try {
      // Save responses to Supabase
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
  
  const handleBackToExercises = () => {
    setSelectedExercise(null);
  };
  
  const handleCloseDialog = () => {
    // Save any unsaved progress before closing
    if (userId) {
      saveProgress();
    }
    onClose();
  };

  // Render the selected exercise
  const renderExerciseContent = () => {
    if (!selectedExercise) return null;
    
    const exercise = exercises.find(ex => ex.id === selectedExercise);
    if (!exercise) return null;
    
    return (
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          onClick={handleBackToExercises}
          className="mb-4"
        >
          ← Back to exercises
        </Button>
        
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 rounded-full bg-primary/10 mb-2">
            {exercise.icon}
          </div>
          <h3 className="text-2xl font-bold">{exercise.name}</h3>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <p className="text-lg mb-4">{exercise.description}</p>
            <div className="bg-[#F5DF4D]/10 p-4 rounded-lg mb-6">
              <h4 className="font-bold mb-2">Instructions:</h4>
              <p>{exercise.instructions}</p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-bold">Reflection:</h4>
              <Textarea
                placeholder="How did this exercise make you feel? What did you notice?"
                className="min-h-[120px]"
                value={journalEntries[selectedExercise] || ''}
                onChange={(e) => handleJournalChange(selectedExercise, e.target.value)}
              />
              
              <div className="flex justify-between mt-4">
                <Button
                  variant="outline"
                  onClick={() => handleToggleFavorite(selectedExercise)}
                  className={favoriteExercises.includes(selectedExercise) ? "bg-[#F5DF4D]/20" : ""}
                >
                  {favoriteExercises.includes(selectedExercise) ? "★ Favorited" : "☆ Add to Favorites"}
                </Button>
                
                <Button
                  onClick={() => handleCompleteExercise(selectedExercise)}
                  disabled={isSubmitting || completedExercises.includes(selectedExercise)}
                  style={{ backgroundColor: completedExercises.includes(selectedExercise) ? "#2AC20E" : "#FC68B3" }}
                >
                  {completedExercises.includes(selectedExercise) ? "Completed ✓" : "Mark as Complete"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg">
        <div className="p-6 bg-gradient-to-br from-[#D5D5F1]/30 to-[#FC68B3]/10 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-center font-bold text-3xl">
              <span className="text-[#FC68B3]">Emotional</span> <span className="text-[#3DFDFF]">Hacking</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-6">
            {!selectedExercise ? (
              <>
                <p className="text-center text-lg mb-8">
                  When emotions start to feel too intense, grounding techniques can help bring you 
                  back to the present moment. Grounding is like hitting a mental reset button, 
                  shifting your focus away from overwhelming thoughts and back to what's happening 
                  right now. It helps you pause and then take actions.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {exercises.map((exercise) => (
                    <motion.div
                      key={exercise.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`cursor-pointer h-full ${
                          completedExercises.includes(exercise.id) 
                            ? "border-green-400 border-2" 
                            : "border-gray-200"
                        }`}
                        onClick={() => handleExerciseSelect(exercise.id)}
                      >
                        <CardContent className="p-6 flex flex-col h-full">
                          <div className="flex items-center mb-4">
                            <div className="p-2 rounded-full bg-primary/10 mr-3">
                              {exercise.icon}
                            </div>
                            <h3 className="font-bold text-lg">{exercise.name}</h3>
                          </div>
                          <p className="text-sm text-gray-600 flex-grow">
                            {exercise.description.length > 100 
                              ? `${exercise.description.substring(0, 100)}...` 
                              : exercise.description}
                          </p>
                          <div className="flex justify-between items-center mt-4">
                            {completedExercises.includes(exercise.id) && (
                              <span className="text-green-500 text-sm font-medium">Completed ✓</span>
                            )}
                            {favoriteExercises.includes(exercise.id) && (
                              <span className="text-[#F5DF4D] text-sm font-medium">★ Favorite</span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                
                <div className="flex justify-between mt-8">
                  <p className="text-sm text-gray-600">
                    Complete at least 3 exercises to earn the module badge and XP.
                  </p>
                  <p className="text-sm font-medium">
                    {completedExercises.length} of {exercises.length} completed
                  </p>
                </div>
              </>
            ) : (
              renderExerciseContent()
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmotionalHackingActivity;

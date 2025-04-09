
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { exercises } from "./services/exercisesData";
import useEmotionalHackingData from "./hooks/useEmotionalHackingData";
import ExercisesGrid from "./components/ExercisesGrid";
import ExerciseDetails from "./components/ExerciseDetails";

interface EmotionalHackingActivityProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

const EmotionalHackingActivity: React.FC<EmotionalHackingActivityProps> = ({
  isOpen,
  onClose,
  userId
}) => {
  const { toast } = useToast();
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  
  const {
    journalEntries,
    completedExercises,
    favoriteExercises,
    isSubmitting,
    handleJournalChange,
    handleToggleFavorite,
    handleCompleteExercise,
    saveProgress
  } = useEmotionalHackingData(userId, isOpen);

  const handleExerciseSelect = (exerciseId: string) => {
    setSelectedExercise(exerciseId);
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

  // Find the selected exercise
  const currentExercise = selectedExercise 
    ? exercises.find(ex => ex.id === selectedExercise) 
    : null;

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
              <ExercisesGrid
                exercises={exercises}
                completedExercises={completedExercises}
                favoriteExercises={favoriteExercises}
                onSelectExercise={handleExerciseSelect}
              />
            ) : currentExercise ? (
              <ExerciseDetails
                exercise={currentExercise}
                onBackClick={handleBackToExercises}
                journalEntry={journalEntries[selectedExercise] || ''}
                onJournalChange={(content) => handleJournalChange(selectedExercise, content)}
                isFavorite={favoriteExercises.includes(selectedExercise)}
                onToggleFavorite={() => handleToggleFavorite(selectedExercise)}
                isCompleted={completedExercises.includes(selectedExercise)}
                onCompleteExercise={() => handleCompleteExercise(selectedExercise)}
                isSubmitting={isSubmitting}
              />
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmotionalHackingActivity;

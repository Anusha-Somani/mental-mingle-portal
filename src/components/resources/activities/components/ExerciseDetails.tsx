
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Exercise } from "../types/emotionalHackingTypes";

interface ExerciseDetailsProps {
  exercise: Exercise;
  onBackClick: () => void;
  journalEntry: string;
  onJournalChange: (content: string) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isCompleted: boolean;
  onCompleteExercise: () => void;
  isSubmitting: boolean;
}

const ExerciseDetails: React.FC<ExerciseDetailsProps> = ({
  exercise,
  onBackClick,
  journalEntry,
  onJournalChange,
  isFavorite,
  onToggleFavorite,
  isCompleted,
  onCompleteExercise,
  isSubmitting
}) => {
  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        onClick={onBackClick}
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
              value={journalEntry}
              onChange={(e) => onJournalChange(e.target.value)}
            />
            
            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={onToggleFavorite}
                className={isFavorite ? "bg-[#F5DF4D]/20" : ""}
              >
                {isFavorite ? "★ Favorited" : "☆ Add to Favorites"}
              </Button>
              
              <Button
                onClick={onCompleteExercise}
                disabled={isSubmitting || isCompleted}
                style={{ backgroundColor: isCompleted ? "#2AC20E" : "#FC68B3" }}
              >
                {isCompleted ? "Completed ✓" : "Mark as Complete"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExerciseDetails;

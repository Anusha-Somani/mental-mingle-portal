
import React from "react";
import ExerciseCard from "./ExerciseCard";
import { Exercise } from "../types/emotionalHackingTypes";

interface ExercisesGridProps {
  exercises: Exercise[];
  completedExercises: string[];
  favoriteExercises: string[];
  onSelectExercise: (exerciseId: string) => void;
}

const ExercisesGrid: React.FC<ExercisesGridProps> = ({
  exercises,
  completedExercises,
  favoriteExercises,
  onSelectExercise
}) => {
  return (
    <>
      <p className="text-center text-lg mb-8">
        When emotions start to feel too intense, grounding techniques can help bring you 
        back to the present moment. Grounding is like hitting a mental reset button, 
        shifting your focus away from overwhelming thoughts and back to what's happening 
        right now. It helps you pause and then take actions.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            id={exercise.id}
            name={exercise.name}
            icon={exercise.icon}
            description={exercise.description}
            isCompleted={completedExercises.includes(exercise.id)}
            isFavorite={favoriteExercises.includes(exercise.id)}
            onClick={() => onSelectExercise(exercise.id)}
          />
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
  );
};

export default ExercisesGrid;

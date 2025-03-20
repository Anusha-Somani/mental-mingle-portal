
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface ExerciseCardProps {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  isCompleted: boolean;
  isFavorite: boolean;
  onClick: () => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  name,
  icon,
  description,
  isCompleted,
  isFavorite,
  onClick
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className={`cursor-pointer h-full ${
          isCompleted ? "border-green-400 border-2" : "border-gray-200"
        }`}
        onClick={onClick}
      >
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-full bg-primary/10 mr-3">
              {icon}
            </div>
            <h3 className="font-bold text-lg">{name}</h3>
          </div>
          <p className="text-sm text-gray-600 flex-grow">
            {description.length > 100 
              ? `${description.substring(0, 100)}...` 
              : description}
          </p>
          <div className="flex justify-between items-center mt-4">
            {isCompleted && (
              <span className="text-green-500 text-sm font-medium">Completed ✓</span>
            )}
            {isFavorite && (
              <span className="text-[#F5DF4D] text-sm font-medium">★ Favorite</span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ExerciseCard;


import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface BingoBoardProps {
  completedActivities: number[];
  onActivityComplete: (id: number) => void;
  selectedActivityId: number | null;
}

const BingoBoard: React.FC<BingoBoardProps> = ({
  completedActivities,
  onActivityComplete,
  selectedActivityId
}) => {
  // Bingo activity titles
  const activityTitles = [
    "Deep Breathing",
    "Gratitude List",
    "Compliment Someone",
    "Nature Walk",
    "Media Break",
    "Talk About Feelings",
    "Help Someone",
    "Positive Affirmation", 
    "Try Something New",
    "Body Scan",
    "Listen to Music",
    "Stretch Break",
    "FREE SPACE",
    "Express Feelings",
    "Digital Cleanup",
    "Healthy Snack",
    "Say No",
    "Write a Thank You",
    "Face a Fear",
    "Read for Fun",
    "Dance Break",
    "Declutter Space",
    "Reach Out",
    "Rest Time",
    "Set a Goal"
  ];
  
  // Color options for cells
  const colors = [
    '#FC68B3', // Pink
    '#3DFDFF', // Cyan
    '#F5DF4D', // Yellow
    '#FF8A48', // Orange
    '#2AC20E', // Green
    '#D5D5F1'  // Lavender
  ];
  
  // Get color for cell index (using a pattern)
  const getCellColor = (index: number) => {
    if (index === 12) return '#D5D5F1'; // FREE SPACE is always lavender
    
    // Create a pattern for other cells
    const row = Math.floor(index / 5);
    const col = index % 5;
    
    // Use row and column to determine color
    const colorIndex = (row + col) % (colors.length - 1);
    return colors[colorIndex];
  };
  
  // Check if cell is part of a completed bingo line
  const isCellInBingoLine = (cellIndex: number): boolean => {
    // Skip if there aren't enough completed cells
    if (completedActivities.length < 5) return false;
    
    const row = Math.floor(cellIndex / 5);
    const col = cellIndex % 5;
    
    // Check row
    const rowCells = [0, 1, 2, 3, 4].map(c => row * 5 + c);
    if (rowCells.every(cell => completedActivities.includes(cell))) {
      return true;
    }
    
    // Check column
    const colCells = [0, 1, 2, 3, 4].map(r => r * 5 + col);
    if (colCells.every(cell => completedActivities.includes(cell))) {
      return true;
    }
    
    // Check diagonals
    const diagonal1 = [0, 6, 12, 18, 24];
    const diagonal2 = [4, 8, 12, 16, 20];
    
    if (diagonal1.includes(cellIndex) && diagonal1.every(cell => completedActivities.includes(cell))) {
      return true;
    }
    
    if (diagonal2.includes(cellIndex) && diagonal2.every(cell => completedActivities.includes(cell))) {
      return true;
    }
    
    return false;
  };
  
  // Render the bingo board
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
      <div className="grid grid-cols-5 gap-2">
        {activityTitles.map((title, index) => {
          const isCompleted = completedActivities.includes(index);
          const isSelected = selectedActivityId === index;
          const isInBingoLine = isCellInBingoLine(index);
          const cellColor = getCellColor(index);
          
          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative aspect-square rounded-lg flex flex-col items-center justify-center p-2 
                cursor-pointer text-center transition-all
                ${isSelected ? 'ring-4 ring-[#1A1F2C]' : ''}
                ${isInBingoLine ? 'ring-2 ring-white' : ''}
              `}
              style={{ 
                backgroundColor: isCompleted ? `${cellColor}` : `${cellColor}30`,
                color: isCompleted ? 'white' : '#1A1F2C',
              }}
              onClick={() => onActivityComplete(index)}
            >
              {isCompleted && (
                <div className="absolute top-1 right-1">
                  <Check className="w-4 h-4" />
                </div>
              )}
              
              {index === 12 ? (
                <div className="font-bold text-lg">FREE</div>
              ) : (
                <div className="text-xs sm:text-sm font-medium line-clamp-3">
                  {title}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-4 text-sm text-center text-gray-600">
        Click on a square to view the activity and mark it as complete
      </div>
    </div>
  );
};

export default BingoBoard;

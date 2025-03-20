import { motion } from "framer-motion";
import { Smile, Heart, Sun, Cloud, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MoodOption {
  emoji: React.ReactNode;
  label: string;
  value: string;
  color: string;
  description: string;
}

const moodOptions: MoodOption[] = [
  { 
    emoji: <Smile className="w-8 h-8" />, 
    label: "Happy", 
    value: "happy",
    color: "bg-[#4CAF50] text-white",
    description: "Feeling great!"
  },
  { 
    emoji: <Heart className="w-8 h-8" />, 
    label: "Excited", 
    value: "excited",
    color: "bg-[#FF9800] text-white",
    description: "Full of energy!"
  },
  { 
    emoji: <Sun className="w-8 h-8" />, 
    label: "Neutral", 
    value: "neutral",
    color: "bg-[#FFC107] text-white",
    description: "Just okay"
  },
  { 
    emoji: <Cloud className="w-8 h-8" />, 
    label: "Angry", 
    value: "angry",
    color: "bg-[#F44336] text-white",
    description: "Feeling frustrated"
  },
  { 
    emoji: <Moon className="w-8 h-8" />, 
    label: "Sad", 
    value: "sad",
    color: "bg-[#2196F3] text-white",
    description: "Not feeling great"
  }
];

interface MoodSelectorProps {
  selectedMood: string;
  onMoodSelect: (mood: string) => void;
  disabled?: boolean;
}

const MoodSelector = ({ selectedMood, onMoodSelect, disabled = false }: MoodSelectorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Select your mood
      </h2>
      <div className="flex flex-wrap gap-6 justify-center">
        {moodOptions.map((mood, index) => (
          <motion.div
            key={mood.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex flex-col items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => !disabled && onMoodSelect(mood.value)}
              disabled={disabled}
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center transition-all mb-2",
                mood.color,
                selectedMood === mood.value && "ring-4 ring-gray-200",
                disabled && "opacity-50 cursor-not-allowed",
                "shadow-lg hover:shadow-xl"
              )}
            >
              {mood.emoji}
            </motion.button>
            <span className="text-sm font-medium text-gray-700">{mood.label}</span>
            <span className="text-xs text-gray-500">{mood.description}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MoodSelector;
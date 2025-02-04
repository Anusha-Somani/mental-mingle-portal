import { motion } from "framer-motion";
import { Smile, Heart, Sun, Cloud, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MoodOption {
  emoji: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

const moodOptions: MoodOption[] = [
  { 
    emoji: <Smile className="w-8 h-8" />, 
    label: "Happy", 
    value: "happy",
    color: "bg-[#4CAF50] text-white"
  },
  { 
    emoji: <Heart className="w-8 h-8" />, 
    label: "Excited", 
    value: "excited",
    color: "bg-[#FF9800] text-white"
  },
  { 
    emoji: <Sun className="w-8 h-8" />, 
    label: "Neutral", 
    value: "neutral",
    color: "bg-[#FFC107] text-white"
  },
  { 
    emoji: <Cloud className="w-8 h-8" />, 
    label: "Angry", 
    value: "angry",
    color: "bg-[#F44336] text-white"
  },
  { 
    emoji: <Moon className="w-8 h-8" />, 
    label: "Sad", 
    value: "sad",
    color: "bg-[#2196F3] text-white"
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
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Select Mode type
      </h2>
      <div className="flex flex-wrap gap-4 justify-center">
        {moodOptions.map((mood, index) => (
          <motion.button
            key={mood.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => !disabled && onMoodSelect(mood.value)}
            disabled={disabled}
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center transition-all",
              mood.color,
              selectedMood === mood.value && "ring-4 ring-gray-200",
              disabled && "opacity-50 cursor-not-allowed",
              "shadow-lg hover:shadow-xl"
            )}
          >
            {mood.emoji}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default MoodSelector;
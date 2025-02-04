import { motion } from "framer-motion";
import { Leaf, Moon, Sun, Droplet, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface MoodOption {
  emoji: React.ReactNode;
  label: string;
  value: string;
  gradient: string;
}

const moodOptions: MoodOption[] = [
  { 
    emoji: <Leaf className="w-8 h-8 text-white stroke-[1.5]" />, 
    label: "Happy", 
    value: "happy",
    gradient: "bg-gradient-to-r from-[#D3E4FD] to-[#E5DEFF]"
  },
  { 
    emoji: <Heart className="w-8 h-8 text-white stroke-[1.5]" />, 
    label: "Excited", 
    value: "excited",
    gradient: "bg-gradient-to-r from-[#FDE1D3] to-[#FFDEE2]"
  },
  { 
    emoji: <Sun className="w-8 h-8 text-white stroke-[1.5]" />, 
    label: "Neutral", 
    value: "neutral",
    gradient: "bg-gradient-to-r from-[#FEF7CD] to-[#FEC6A1]"
  },
  { 
    emoji: <Moon className="w-8 h-8 text-white stroke-[1.5]" />, 
    label: "Angry", 
    value: "angry",
    gradient: "bg-gradient-to-r from-[#E5DEFF] to-[#FFDEE2]"
  },
  { 
    emoji: <Droplet className="w-8 h-8 text-white stroke-[1.5]" />, 
    label: "Sad", 
    value: "sad",
    gradient: "bg-gradient-to-r from-[#F2FCE2] to-[#D3E4FD]"
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
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        How are you feeling today?
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
              "p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all",
              mood.gradient,
              selectedMood === mood.value && "ring-2 ring-white/50 shadow-lg",
              disabled && "opacity-50 cursor-not-allowed",
              "shadow-md hover:shadow-lg"
            )}
          >
            {mood.emoji}
            <span className="font-medium text-white">{mood.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default MoodSelector;
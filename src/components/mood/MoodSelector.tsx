import { motion } from "framer-motion";
import { Smile, Heart, Meh, Frown, Angry } from "lucide-react";
import { cn } from "@/lib/utils"; // Add this import

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
    color: "bg-green-100 hover:bg-green-200"
  },
  { 
    emoji: <Heart className="w-8 h-8 text-pink-500" />, 
    label: "Excited", 
    value: "excited",
    color: "bg-pink-100 hover:bg-pink-200"
  },
  { 
    emoji: <Meh className="w-8 h-8" />, 
    label: "Neutral", 
    value: "neutral",
    color: "bg-blue-100 hover:bg-blue-200"
  },
  { 
    emoji: <Angry className="w-8 h-8 text-red-500" />, 
    label: "Angry", 
    value: "angry",
    color: "bg-red-100 hover:bg-red-200"
  },
  { 
    emoji: <Frown className="w-8 h-8 text-yellow-500" />, 
    label: "Sad", 
    value: "sad",
    color: "bg-yellow-100 hover:bg-yellow-200"
  }
];

interface MoodSelectorProps {
  selectedMood: string;
  onMoodSelect: (mood: string) => void;
}

const MoodSelector = ({ selectedMood, onMoodSelect }: MoodSelectorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full"
    >
      <h2 className="text-2xl font-semibold text-purple-600 mb-4">
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
            onClick={() => onMoodSelect(mood.value)}
            className={cn(
              "p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors",
              mood.color,
              selectedMood === mood.value && "ring-2 ring-purple-500"
            )}
          >
            {mood.emoji}
            <span className="font-medium">{mood.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default MoodSelector;
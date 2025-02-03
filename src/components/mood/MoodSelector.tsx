import { motion } from "framer-motion";
import { Smile, Heart, Meh, Frown, Angry } from "lucide-react";
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
    color: "bg-primary/10 hover:bg-primary/20"
  },
  { 
    emoji: <Heart className="w-8 h-8 text-secondary" />, 
    label: "Excited", 
    value: "excited",
    color: "bg-secondary/10 hover:bg-secondary/20"
  },
  { 
    emoji: <Meh className="w-8 h-8" />, 
    label: "Neutral", 
    value: "neutral",
    color: "bg-accent/10 hover:bg-accent/20"
  },
  { 
    emoji: <Angry className="w-8 h-8 text-destructive" />, 
    label: "Angry", 
    value: "angry",
    color: "bg-destructive/10 hover:bg-destructive/20"
  },
  { 
    emoji: <Frown className="w-8 h-8 text-muted-foreground" />, 
    label: "Sad", 
    value: "sad",
    color: "bg-muted hover:bg-muted/80"
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
      <h2 className="text-2xl font-semibold text-primary mb-4">
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
              "p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors",
              mood.color,
              selectedMood === mood.value && "ring-2 ring-primary",
              disabled && "opacity-50 cursor-not-allowed"
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
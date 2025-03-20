
import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import MoodSelector from "@/components/mood/MoodSelector";
import ContributingFactors from "@/components/mood/ContributingFactors";
import FeelingsJarActivity from "@/components/mood/FeelingsJarActivity";

interface MoodEntryCardProps {
  selectedMood: string;
  onMoodSelect: (mood: string) => void;
  journalEntry: string;
  setJournalEntry: (entry: string) => void;
  isDateDisabled: boolean;
  onSaveMood: () => void;
  selectedFactors: string[];
  onFactorSelect: (factors: string[]) => void;
}

const MoodEntryCard = ({
  selectedMood,
  onMoodSelect,
  journalEntry,
  setJournalEntry,
  isDateDisabled,
  onSaveMood,
  selectedFactors,
  onFactorSelect,
}: MoodEntryCardProps) => {
  const [isJarActivityOpen, setIsJarActivityOpen] = useState(false);
  
  const handleSaveMood = () => {
    // Check if mood requires jar activity
    const needsJarActivity = ["neutral", "angry", "sad"].includes(selectedMood);
    
    if (needsJarActivity) {
      setIsJarActivityOpen(true);
      // The actual save will happen after the activity
    } else {
      // For happy and excited moods, save directly
      onSaveMood();
    }
  };
  
  const handleJarActivityClose = () => {
    setIsJarActivityOpen(false);
    // Save the mood after the jar activity is completed
    onSaveMood();
  };

  return (
    <div className="space-y-6 font-poppins">
      <MoodSelector
        selectedMood={selectedMood}
        onMoodSelect={onMoodSelect}
        disabled={isDateDisabled}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <ContributingFactors
          selectedFactors={selectedFactors}
          onFactorSelect={onFactorSelect}
          disabled={isDateDisabled}
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="space-y-4"
      >
        <Textarea
          placeholder={isDateDisabled ? "Mood already logged for this date" : "How are you feeling? (Optional)"}
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          className="min-h-[100px] rounded-xl bg-white/10 text-[#1A1F2C] placeholder:text-[#403E43]/70 resize-none border-[#D6BCFA]/30"
          disabled={isDateDisabled}
        />
        <Button 
          onClick={handleSaveMood}
          className="w-full bg-[#FF8A48] hover:bg-[#FF8A48]/80 text-white font-medium rounded-xl py-3"
          disabled={isDateDisabled || !selectedMood}
        >
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Save Mood
          </motion.span>
        </Button>
      </motion.div>
      
      <FeelingsJarActivity 
        isOpen={isJarActivityOpen} 
        onClose={handleJarActivityClose} 
      />
    </div>
  );
};

export default MoodEntryCard;

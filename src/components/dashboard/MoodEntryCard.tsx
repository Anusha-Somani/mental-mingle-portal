import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import MoodSelector from "@/components/mood/MoodSelector";

interface MoodEntryCardProps {
  selectedMood: string;
  onMoodSelect: (mood: string) => void;
  journalEntry: string;
  setJournalEntry: (entry: string) => void;
  isDateDisabled: boolean;
  onSaveMood: () => void;
}

const MoodEntryCard = ({
  selectedMood,
  onMoodSelect,
  journalEntry,
  setJournalEntry,
  isDateDisabled,
  onSaveMood,
}: MoodEntryCardProps) => {
  return (
    <Card className="bg-white/95 backdrop-blur-sm border border-gray-100 shadow-sm">
      <CardContent className="pt-6">
        <MoodSelector
          selectedMood={selectedMood}
          onMoodSelect={onMoodSelect}
          disabled={isDateDisabled}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6"
        >
          <Textarea
            placeholder={isDateDisabled ? "Mood already logged for this date" : "How are you feeling? (Optional)"}
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            className="min-h-[100px] mb-4 bg-white/80 border-gray-200 placeholder:text-gray-500 text-gray-700"
            disabled={isDateDisabled}
          />
          <Button 
            onClick={onSaveMood}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium transition-colors duration-300"
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
      </CardContent>
    </Card>
  );
};

export default MoodEntryCard;

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { BookOpen, PenLine } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface JournalPrompt {
  id: string;
  category: string;
  prompt_text: string;
}

const JournalSection = () => {
  const [prompts, setPrompts] = useState<JournalPrompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<JournalPrompt | null>(null);
  const [journalEntry, setJournalEntry] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUserId(session.user.id);
    };

    checkAuth();
    loadPrompts();
  }, [navigate]);

  const loadPrompts = async () => {
    const { data, error } = await supabase
      .from('journal_prompts')
      .select('*');
    
    if (error) {
      toast({
        title: "Error loading prompts",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (data) {
      setPrompts(data);
      // Randomly select a prompt
      const randomPrompt = data[Math.floor(Math.random() * data.length)];
      setSelectedPrompt(randomPrompt);
    }
  };

  const saveJournalEntry = async () => {
    if (!selectedPrompt || !journalEntry.trim() || !userId) return;

    const { error } = await supabase
      .from('journal_entries')
      .insert({
        prompt_text: selectedPrompt.prompt_text,
        entry_text: journalEntry,
        user_id: userId
      });

    if (error) {
      toast({
        title: "Error saving journal entry",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Journal entry saved!",
      description: "Your thoughts have been recorded successfully.",
    });
    setJournalEntry("");
    // Get a new random prompt
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setSelectedPrompt(randomPrompt);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-lg p-6 space-y-6"
    >
      <div className="flex items-center gap-3 justify-center">
        <BookOpen className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-semibold text-gray-800">Journal Your Thoughts Away</h2>
      </div>

      {selectedPrompt && (
        <div className="space-y-4">
          <div className="bg-primary/10 p-4 rounded-xl">
            <p className="text-gray-700 text-lg">{selectedPrompt.prompt_text}</p>
          </div>

          <Textarea
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            placeholder="Start writing your thoughts here..."
            className="min-h-[200px] text-gray-700"
          />

          <Button
            onClick={saveJournalEntry}
            disabled={!journalEntry.trim()}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <PenLine className="w-4 h-4 mr-2" />
            Save Journal Entry
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default JournalSection;

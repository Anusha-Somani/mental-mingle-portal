import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format, startOfDay, isAfter } from "date-fns";
import MoodEntryCard from "@/components/dashboard/MoodEntryCard";
import QuoteCard from "@/components/dashboard/QuoteCard";
import DateDisplay from "@/components/dashboard/DateDisplay";
import Wave from "@/components/Wave";
import { Brain } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMood, setSelectedMood] = useState("");
  const [journalEntry, setJournalEntry] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userId, setUserId] = useState<string | null>(null);

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
  }, [navigate]);

  const { data: moodEntries = [] } = useQuery({
    queryKey: ['moodEntries', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const saveMoodMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("User not authenticated");
      if (!selectedMood) throw new Error("Please select a mood");
      
      const startDate = format(selectedDate, 'yyyy-MM-dd');
      const endDate = format(new Date(selectedDate).setDate(new Date(selectedDate).getDate() + 1), 'yyyy-MM-dd');
      
      const { data: existingEntry, error: checkError } = await supabase
        .from('mood_entries')
        .select('id')
        .eq('user_id', userId)
        .gte('created_at', startDate)
        .lt('created_at', endDate)
        .maybeSingle();

      if (checkError) throw checkError;
      
      if (existingEntry) {
        throw new Error("You've already logged your mood for this date");
      }

      const { error: insertError } = await supabase
        .from('mood_entries')
        .insert([
          {
            user_id: userId,
            emoji_type: selectedMood,
            mood_score: getMoodScore(selectedMood),
            journal_entry: journalEntry,
            created_at: selectedDate.toISOString(),
          }
        ]);
      
      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moodEntries'] });
      toast({
        title: "Mood saved!",
        description: "Your mood has been logged successfully.",
      });
      setJournalEntry("");
      setSelectedMood("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getMoodScore = (mood: string): number => {
    const moodScores: Record<string, number> = {
      happy: 100,
      excited: 90,
      neutral: 50,
      angry: 20,
      sad: 10,
    };
    return moodScores[mood] || 50;
  };

  const disabledDates = moodEntries.map(entry => new Date(entry.created_at));
  const today = startOfDay(new Date());
  const isDateDisabled = disabledDates.some(
    date => format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  ) || isAfter(selectedDate, today);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#F2FCE2]">
      <Navigation />
      <Wave />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Mental Health Quote Section */}
        <div className="mb-12">
          <QuoteCard />
        </div>

        {/* Greeting Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            Hello, how are you feeling today?
          </h1>
        </motion.div>

        {/* Mood Entry Section */}
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-lg p-6 mb-6"
          >
            <MoodEntryCard
              selectedMood={selectedMood}
              onMoodSelect={setSelectedMood}
              journalEntry={journalEntry}
              setJournalEntry={setJournalEntry}
              isDateDisabled={isDateDisabled}
              onSaveMood={() => saveMoodMutation.mutate()}
            />
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
};

export default Dashboard;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format, startOfDay, isAfter } from "date-fns";
import MoodEntryCard from "@/components/dashboard/MoodEntryCard";
import AchievementCard from "@/components/dashboard/AchievementCard";
import QuoteCard from "@/components/dashboard/QuoteCard";
import DateDisplay from "@/components/dashboard/DateDisplay";

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

  const { data: achievements = [] } = useQuery({
    queryKey: ['achievements', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', userId)
        .order('achieved_at', { ascending: false });
      
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
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] via-[#221F26] to-[#2A1F2C] relative overflow-hidden">
      {/* Animated background waves */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-0 left-0 right-0 h-[400px] bg-primary/20 transform animate-wave1" />
          <div className="absolute bottom-0 left-0 right-0 h-[350px] bg-primary/15 transform animate-wave2" />
          <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-primary/10 transform animate-wave3" />
          <div className="absolute bottom-0 left-0 right-0 h-[250px] bg-primary/5 transform animate-wave4" />
        </div>
      </div>

      <Navigation />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <DateDisplay date={selectedDate} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8"
        >
          <div className="lg:col-span-2">
            <MoodEntryCard
              selectedMood={selectedMood}
              onMoodSelect={setSelectedMood}
              journalEntry={journalEntry}
              setJournalEntry={setJournalEntry}
              isDateDisabled={isDateDisabled}
              onSaveMood={() => saveMoodMutation.mutate()}
            />
          </div>

          <div className="lg:col-span-1">
            <QuoteCard />
          </div>

          <div className="lg:col-span-3">
            <AchievementCard achievements={achievements} />
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default Dashboard;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MoodCalendar from "@/components/mood/MoodCalendar";
import MoodSelector from "@/components/mood/MoodSelector";
import { motion } from "framer-motion";
import { format, startOfDay, isAfter } from "date-fns";

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
      
      // Check if entry already exists for selected date
      const startDate = format(selectedDate, 'yyyy-MM-dd');
      const { data: existingEntry } = await supabase
        .from('mood_entries')
        .select('id')
        .eq('user_id', userId)
        .gte('created_at', startDate)
        .lt('created_at', format(new Date(startDate).setDate(new Date(startDate).getDate() + 1), 'yyyy-MM-dd'))
        .single();

      if (existingEntry) {
        throw new Error("You've already logged your mood for this date");
      }

      const { error } = await supabase
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
      
      if (error) throw error;
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
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <Card className="lg:col-span-1">
            <CardContent className="pt-6">
              <MoodCalendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                disabledDates={disabledDates}
              />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardContent className="pt-6">
              <MoodSelector
                selectedMood={selectedMood}
                onMoodSelect={setSelectedMood}
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
                  className="min-h-[100px] mb-4"
                  disabled={isDateDisabled}
                />
                <Button 
                  onClick={() => saveMoodMutation.mutate()}
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isDateDisabled || !selectedMood}
                >
                  Save Mood
                </Button>
              </motion.div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Trophy className="w-5 h-5" />
                Achievements
              </CardTitle>
              <CardDescription>Your mood tracking milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg shadow-sm border border-primary/10"
                  >
                    <Star className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium">{achievement.achievement_type}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(achievement.achieved_at).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
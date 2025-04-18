import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format, startOfDay, endOfDay } from "date-fns";
import MoodEntryCard from "@/components/dashboard/MoodEntryCard";
import QuoteCard from "@/components/dashboard/QuoteCard";
import ChatButton from "@/components/dashboard/ChatButton";
import JournalSection from "@/components/journal/JournalSection";
import JournalButton from "@/components/journal/JournalButton";
import StarryBackground from "@/components/StarryBackground";
import Wave from "@/components/Wave";
import ColorfulPopup from "@/components/mood/ColorfulPopup";
import FeelingsJarPreview from "@/components/mood/FeelingsJarPreview";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMood, setSelectedMood] = useState("");
  const [journalEntry, setJournalEntry] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [showSupportPopup, setShowSupportPopup] = useState(false);
  const [showJarPreview, setShowJarPreview] = useState(false);
  const [showJarFullscreen, setShowJarFullscreen] = useState(false);
  const [hasJarActivities, setHasJarActivities] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUserId(session.user.id);
      
      if (session.user) {
        const metadata = session.user.user_metadata;
        if (metadata && (metadata.full_name || metadata.name)) {
          const fullName = metadata.full_name || metadata.name;
          const firstName = fullName.split(' ')[0];
          setUserName(firstName);
        } else if (session.user.email) {
          const emailName = session.user.email.split('@')[0];
          setUserName(emailName.charAt(0).toUpperCase() + emailName.slice(1));
        }
      }
      
      const { data: jarActivities } = await supabase
        .from('journal_entries')
        .select('entry_text')
        .eq('user_id', session.user.id)
        .eq('prompt_text', 'Feelings Jar Activity')
        .limit(1);
      
      setHasJarActivities(!!jarActivities && jarActivities.length > 0);
      setShowJarPreview(!!jarActivities && jarActivities.length > 0);
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
      
      const recentEntries = data.filter(entry => {
        const entryDate = new Date(entry.created_at);
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        return entryDate > threeDaysAgo && ['neutral', 'angry', 'sad'].includes(entry.emoji_type);
      });
      
      if (recentEntries.length > 0 && !hasJarActivities) {
        setShowJarPreview(true);
      }
      
      return data;
    },
    enabled: !!userId,
  });

  const saveMoodMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("User not authenticated");
      if (!selectedMood) throw new Error("Please select a mood");
      
      const startDate = format(startOfDay(selectedDate), 'yyyy-MM-dd');
      const endDate = format(endOfDay(selectedDate), 'yyyy-MM-dd');
      
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
            contributing_factors: selectedFactors,
            created_at: selectedDate.toISOString(),
          }
        ]);
      
      if (insertError) throw insertError;
      
      if (['neutral', 'angry', 'sad'].includes(selectedMood)) {
        setShowSupportPopup(true);
        setShowJarPreview(true);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moodEntries'] });
      toast({
        title: "Mood saved!",
        description: "Your mood has been logged successfully.",
        duration: 5000,
      });
      
      if (!['neutral', 'angry', 'sad'].includes(selectedMood)) {
        setJournalEntry("");
        setSelectedMood("");
        setSelectedFactors([]);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 5000,
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

  const handlePopupClose = () => {
    setShowSupportPopup(false);
    setJournalEntry("");
    setSelectedMood("");
    setSelectedFactors([]);
  };

  const handleJarActivityCompleted = () => {
    setShowJarPreview(true);
    setHasJarActivities(true);
    
    if (userId) {
      queryClient.invalidateQueries({ queryKey: ['jarActivities', userId] });
    }
  };

  const handleShowFullJar = () => {
    setShowJarFullscreen(true);
  };

  const disabledDates = moodEntries.map(entry => new Date(entry.created_at));
  const today = endOfDay(new Date());
  const isDateDisabled = disabledDates.some(
    date => format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  return (
    <div className="min-h-screen relative overflow-hidden galaxy-bg">
      <StarryBackground />
      <Wave />
      <Navigation />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A1F2C] font-playfair drop-shadow-lg">
            Hi there, {userName ? `${userName}` : "how are you feeling today?"}
          </h1>
          {userName && (
            <p className="mt-2 text-xl text-[#403E43] font-light">
              How are you feeling today?
            </p>
          )}
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-8 relative">
          {showJarPreview && (
            <>
              <div className="hidden md:block fixed right-8 top-32 z-10">
                <FeelingsJarPreview onShowFullJar={handleShowFullJar} />
              </div>
              
              <div className="md:hidden mx-auto w-32">
                <FeelingsJarPreview onShowFullJar={handleShowFullJar} />
              </div>
            </>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl shadow-lg p-6 mb-6"
          >
            <MoodEntryCard
              selectedMood={selectedMood}
              onMoodSelect={setSelectedMood}
              journalEntry={journalEntry}
              setJournalEntry={setJournalEntry}
              isDateDisabled={isDateDisabled}
              onSaveMood={() => saveMoodMutation.mutate()}
              selectedFactors={selectedFactors}
              onFactorSelect={setSelectedFactors}
            />
          </motion.div>
          
          <JournalSection />
          <QuoteCard />
        </div>

        <ChatButton />
        <JournalButton userId={userId} />
      </motion.main>
      
      <ColorfulPopup 
        isOpen={showSupportPopup} 
        onClose={handlePopupClose}
        onComplete={handleJarActivityCompleted}
      />
      
      <ColorfulPopup 
        isOpen={showJarFullscreen} 
        onClose={() => setShowJarFullscreen(false)}
        showJarActivity={true}
      />
    </div>
  );
};

export default Dashboard;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import CalendarCard from "@/components/dashboard/CalendarCard";
import DateDisplay from "@/components/dashboard/DateDisplay";
import AchievementCard from "@/components/dashboard/AchievementCard";
import { format, startOfDay, endOfDay } from "date-fns";
import MoodEntryCard from "@/components/dashboard/MoodEntryCard";
import QuoteCard from "@/components/dashboard/QuoteCard";
import ChatButton from "@/components/dashboard/ChatButton";
import JournalSection from "@/components/journal/JournalSection";
import { useToast } from "@/hooks/use-toast";
import "@/styles/glass.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [journalEntry, setJournalEntry] = useState<string>("");
  const [userFirstName, setUserFirstName] = useState<string>("");
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [isDateDisabled, setIsDateDisabled] = useState<boolean>(false);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [journals, setJournals] = useState<any[]>([]);
  const [isLoadingJournals, setIsLoadingJournals] = useState<boolean>(false);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchUserName();
      await fetchAchievements();
      await fetchJournals();
      await fetchDisabledDates();
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    checkIfDateIsDisabled();
  }, [selectedDate]);

  const fetchUserName = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error fetching user:", userError);
      return;
    }

    if (userData?.user?.id) {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("first_name")
        .eq("id", userData.user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        return;
      }

      setUserFirstName(profileData?.first_name || "User");
    }
  };

  const fetchAchievements = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error fetching user:", userError);
      return;
    }

    if (userData?.user?.id) {
      const { data: achievementData, error: achievementError } = await supabase
        .from("achievements")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("achieved_at", { ascending: false });

      if (achievementError) {
        console.error("Error fetching achievements:", achievementError);
        return;
      }

      setAchievements(achievementData || []);
    }
  };

  const fetchJournals = async () => {
    setIsLoadingJournals(true);
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error fetching user:", userError);
      setIsLoadingJournals(false);
      return;
    }

    if (userData?.user?.id) {
      const { data: journalData, error: journalError } = await supabase
        .from("journals")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });

      if (journalError) {
        console.error("Error fetching journals:", journalError);
        setIsLoadingJournals(false);
        return;
      }

      setJournals(journalData || []);
    }
    setIsLoadingJournals(false);
  };

  const fetchDisabledDates = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error fetching user:", userError);
      return;
    }

    if (userData?.user?.id) {
      const { data: moodData, error: moodError } = await supabase
        .from("mood_entries")
        .select("date")
        .eq("user_id", userData.user.id);

      if (moodError) {
        console.error("Error fetching moods:", moodError);
        return;
      }

      const disabledDates = moodData
        ? moodData.map((mood) => new Date(mood.date))
        : [];
      setDisabledDates(disabledDates);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    checkIfDateIsDisabled();
  };

  const checkIfDateIsDisabled = () => {
    const isDateLogged = disabledDates.some(
      (disabledDate) =>
        format(disabledDate, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
    );
    setIsDateDisabled(isDateLogged);

    if (isDateLogged) {
      setSelectedMood("");
      setJournalEntry("");
      setSelectedFactors([]);
    }
  };

  const saveMoodEntry = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error fetching user:", userError);
      return;
    }

    if (userData?.user?.id) {
      const { error } = await supabase
        .from("mood_entries")
        .insert([
          {
            user_id: userData.user.id,
            date: format(selectedDate, "yyyy-MM-dd"),
            mood: selectedMood,
            journal_entry: journalEntry,
            factors: selectedFactors,
          },
        ]);

      if (error) {
        console.error("Error saving mood:", error);
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was an error saving your mood. Please try again.",
        });
      } else {
        toast({
          title: "Success!",
          description: "Your mood has been saved.",
        });
        await fetchDisabledDates();
        setIsDateDisabled(true);
        await fetchAchievements();
        await fetchJournals();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#3DFDFF]/20 via-white to-[#FF8A48]/20 font-poppins">
      <div className="relative z-20">
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="container max-w-screen-xl mx-auto px-4 pt-8 pb-28"
        >
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-primary mb-2">
              Hi there, {userFirstName}
            </h1>
            <p className="text-secondary">
              Track your mood, discover patterns, and gain insights.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 glass-card p-6 rounded-xl shadow-sm">
              <MoodEntryCard
                selectedMood={selectedMood}
                onMoodSelect={setSelectedMood}
                journalEntry={journalEntry}
                setJournalEntry={setJournalEntry}
                isDateDisabled={isDateDisabled}
                onSaveMood={saveMoodEntry}
                selectedFactors={selectedFactors}
                onFactorSelect={setSelectedFactors}
              />
            </div>

            <CalendarCard
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              disabledDates={disabledDates}
            />
          </div>

          <div className="mb-12">
            <JournalSection journals={journals} isLoading={isLoadingJournals} />
          </div>

          <AchievementCard
            achievements={achievements}
          />

          <QuoteCard />
        </div>

        <ChatButton />
      </motion.main>
    </div>
  );
};

export default Dashboard;

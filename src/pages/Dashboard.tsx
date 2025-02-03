import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Heart, Smile, Frown, Trophy, Star, ChartLine } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [mood, setMood] = useState(50);
  const [journalEntry, setJournalEntry] = useState("");
  const [userType, setUserType] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch user profile and set user ID
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      setUserId(session.user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", session.user.id)
        .single();

      if (profile) {
        setUserType(profile.user_type);
      }
    };

    checkAuth();
  }, [navigate]);

  // Fetch mood entries
  const { data: moodEntries = [] } = useQuery({
    queryKey: ['moodEntries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch achievements
  const { data: achievements = [] } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('achieved_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Save mood entry mutation
  const saveMoodMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('mood_entries')
        .insert([
          {
            user_id: userId,
            mood_score: mood,
            emoji_type: getMoodType(),
            journal_entry: journalEntry,
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
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save your mood. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getMoodType = () => {
    if (mood < 33) return "sad";
    if (mood < 66) return "neutral";
    return "happy";
  };

  const getMoodIcon = () => {
    if (mood < 33) return <Frown className="w-12 h-12 text-red-500" />;
    if (mood < 66) return <Smile className="w-12 h-12 text-yellow-500" />;
    return <Heart className="w-12 h-12 text-green-500" />;
  };

  // Format mood data for chart
  const chartData = moodEntries.slice(0, 7).reverse().map((entry) => ({
    date: new Date(entry.created_at).toLocaleDateString(),
    mood: entry.mood_score,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mood Meter Card */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>How are you feeling today?</CardTitle>
              <CardDescription>Move the slider to log your mood</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-6">
                {getMoodIcon()}
                <Slider
                  value={[mood]}
                  onValueChange={(value) => setMood(value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between w-full text-sm text-gray-600">
                  <span>Not Great</span>
                  <span>Okay</span>
                  <span>Amazing!</span>
                </div>
                <Textarea
                  placeholder="How are you feeling? (Optional)"
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  className="w-full h-24"
                />
                <Button 
                  onClick={() => saveMoodMutation.mutate()}
                  className="w-full"
                >
                  Save Mood
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Mood Trends Card */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartLine className="w-5 h-5" />
                Mood Trends
              </CardTitle>
              <CardDescription>Your mood patterns over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#2A9D8F"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Achievements Card */}
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Achievements
              </CardTitle>
              <CardDescription>Your mood tracking milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100"
                  >
                    <Star className="w-8 h-8 text-yellow-400" />
                    <div>
                      <p className="font-medium">{achievement.achievement_type}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(achievement.achieved_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
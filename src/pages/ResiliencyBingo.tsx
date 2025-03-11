
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PersonStanding, Sparkles, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import BingoBoard from "@/components/games/BingoBoard";
import { supabase } from "@/integrations/supabase/client";

const ResiliencyBingo = () => {
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [hasBingo, setHasBingo] = useState<boolean>(false);
  const [bingoCount, setBingoCount] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [completedActivities, setCompletedActivities] = useState<number[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUserId(data.session.user.id);
        
        // Since we don't have the bingo_progress table in Supabase types yet,
        // let's manually handle the data fetching and type it
        const { data: progressData, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', data.session.user.id)
          .single();
          
        if (progressData) {
          // If user has existing progress in user_progress, we can use that
          // In a real implementation, you'd want to migrate this to the new table
          setCompletedActivities(progressData.completed_modules || []);
        } else {
          // Default empty state
          setCompletedActivities([]);
          setBingoCount(0);
        }
      }
    };
    
    checkAuth();
  }, []);

  const handleActivityCompletion = async (activityId: number) => {
    if (completedActivities.includes(activityId)) {
      // Already completed
      setSelectedActivityId(activityId);
      return;
    }
    
    const newCompletedActivities = [...completedActivities, activityId];
    setCompletedActivities(newCompletedActivities);
    setSelectedActivityId(activityId);
    
    // Check for new bingos
    const newBingoCount = checkForBingos(newCompletedActivities);
    const hasDifferentBingoCount = newBingoCount > bingoCount;
    
    if (hasDifferentBingoCount) {
      setBingoCount(newBingoCount);
      setHasBingo(true);
      setShowConfetti(true);
      
      toast({
        title: "BINGO! 🎉",
        description: "You've achieved a bingo! Great job building resilience!",
      });
      
      // Hide confetti after a few seconds
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
    
    // Save progress if user is logged in
    if (userId) {
      try {
        // For now, let's use the user_progress table until the types are updated
        await supabase
          .from('user_progress')
          .upsert({
            user_id: userId,
            completed_modules: newCompletedActivities,
            updated_at: new Date().toISOString()
          });
      } catch (error) {
        console.error("Error saving progress:", error);
      }
    }
  };
  
  const checkForBingos = (completedCells: number[]): number => {
    let bingoCount = 0;
    
    // Check rows
    for (let row = 0; row < 5; row++) {
      const rowCells = [0, 1, 2, 3, 4].map(col => row * 5 + col);
      if (rowCells.every(cell => completedCells.includes(cell))) {
        bingoCount++;
      }
    }
    
    // Check columns
    for (let col = 0; col < 5; col++) {
      const colCells = [0, 1, 2, 3, 4].map(row => row * 5 + col);
      if (colCells.every(cell => completedCells.includes(cell))) {
        bingoCount++;
      }
    }
    
    // Check diagonals
    const diagonal1 = [0, 6, 12, 18, 24];
    const diagonal2 = [4, 8, 12, 16, 20];
    
    if (diagonal1.every(cell => completedCells.includes(cell))) {
      bingoCount++;
    }
    
    if (diagonal2.every(cell => completedCells.includes(cell))) {
      bingoCount++;
    }
    
    return bingoCount;
  };
  
  const resetBoard = async () => {
    setCompletedActivities([]);
    setHasBingo(false);
    setBingoCount(0);
    setSelectedActivityId(null);
    
    // Reset progress in database if user is logged in
    if (userId) {
      try {
        await supabase
          .from('user_progress')
          .upsert({
            user_id: userId,
            completed_modules: [],
            updated_at: new Date().toISOString()
          });
          
        toast({
          title: "Board Reset",
          description: "Your bingo board has been reset. Ready for a new game!",
        });
      } catch (error) {
        console.error("Error resetting progress:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FC68B3]/10 to-[#3DFDFF]/10">
      <Navigation />
      
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute top-0 left-1/4">
            <Award className="w-16 h-16 text-[#F5DF4D] animate-bounce" />
          </div>
          <div className="absolute top-10 right-1/4">
            <Award className="w-16 h-16 text-[#FC68B3] animate-bounce" />
          </div>
          <div className="absolute bottom-10 left-1/3">
            <Award className="w-16 h-16 text-[#3DFDFF] animate-bounce" />
          </div>
          <div className="absolute top-1/3 right-1/3">
            <Award className="w-16 h-16 text-[#FF8A48] animate-bounce" />
          </div>
        </div>
      )}
      
      <main className="container mx-auto p-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-[#1A1F2C] mb-2">Resiliency Bingo</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Complete activities to build resilience and mental well-being. Mark off cells as you go and try to get BINGO!
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Bingo board */}
            <div className="md:flex-1">
              <BingoBoard 
                completedActivities={completedActivities}
                onActivityComplete={handleActivityCompletion}
                selectedActivityId={selectedActivityId}
              />
              
              <div className="mt-4 flex justify-center gap-4">
                <Button 
                  onClick={resetBoard}
                  variant="outline"
                  className="bg-white/50"
                >
                  Reset Board
                </Button>
                
                {hasBingo && (
                  <Button 
                    className="bg-[#F5DF4D] hover:bg-[#F5DF4D]/80 text-black"
                  >
                    <Award className="mr-2 h-4 w-4" />
                    You have {bingoCount} Bingo{bingoCount > 1 ? 's' : ''}!
                  </Button>
                )}
              </div>
            </div>
            
            {/* Activity details */}
            <div className="md:w-80">
              <Card className="bg-white/80 backdrop-blur-sm sticky top-4">
                <CardContent className="p-6">
                  {selectedActivityId !== null ? (
                    <ActivityDetails 
                      activityId={selectedActivityId} 
                      isCompleted={completedActivities.includes(selectedActivityId)}
                      onComplete={() => handleActivityCompletion(selectedActivityId)}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <PersonStanding className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-700">Select an activity</h3>
                      <p className="text-gray-500 text-sm mt-2">
                        Click on any square to view activity details and mark it as complete
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm mt-4">
                <CardContent className="p-6">
                  <h2 className="font-bold flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-[#FC68B3]" />
                    How to Play
                  </h2>
                  
                  <ol className="space-y-2 text-sm">
                    <li>1. Click on a square to view the activity</li>
                    <li>2. Complete the activity in real life</li>
                    <li>3. Mark it as complete on your board</li>
                    <li>4. Get 5 in a row (horizontally, vertically, or diagonally) for BINGO!</li>
                    <li>5. Try to complete as many activities as you can for multiple BINGOs</li>
                  </ol>
                  
                  {!userId && (
                    <div className="mt-4 p-3 bg-[#F5DF4D]/20 rounded-lg text-sm">
                      <p className="font-medium">Sign in to save your progress!</p>
                      <Button 
                        onClick={() => window.location.href = '/auth'}
                        className="w-full mt-2 bg-[#F5DF4D] hover:bg-[#F5DF4D]/80 text-black"
                        size="sm"
                      >
                        Sign In
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

interface ActivityDetailsProps {
  activityId: number;
  isCompleted: boolean;
  onComplete: () => void;
}

const ActivityDetails: React.FC<ActivityDetailsProps> = ({ 
  activityId, 
  isCompleted,
  onComplete
}) => {
  const getActivityDetails = (id: number) => {
    const allActivities = [
      { 
        id: 0, 
        title: "Deep Breathing", 
        description: "Practice deep breathing for 2 minutes. Breathe in for 4 counts, hold for 4, out for 6.",
        category: "Mindfulness"
      },
      { 
        id: 1, 
        title: "Gratitude List", 
        description: "Write down 3 things you're grateful for today.",
        category: "Positive Thinking"
      },
      { 
        id: 2, 
        title: "Compliment Someone", 
        description: "Give a genuine compliment to a friend or family member.",
        category: "Social"
      },
      { 
        id: 3, 
        title: "Nature Walk", 
        description: "Take a 10-minute walk outside and notice 5 beautiful things.",
        category: "Physical"
      },
      { 
        id: 4, 
        title: "Media Break", 
        description: "Take a 30-minute break from all screens.",
        category: "Self-care"
      },
      { 
        id: 5, 
        title: "Talk About Feelings", 
        description: "Share how you're feeling with someone you trust.",
        category: "Emotional"
      },
      { 
        id: 6, 
        title: "Help Someone", 
        description: "Offer help to someone who needs it without being asked.",
        category: "Kindness"
      },
      { 
        id: 7, 
        title: "Positive Affirmation", 
        description: "Say a positive statement about yourself out loud 3 times.",
        category: "Self-esteem"
      },
      { 
        id: 8, 
        title: "Try Something New", 
        description: "Do one small thing you've never done before.",
        category: "Growth"
      },
      { 
        id: 9, 
        title: "Body Scan", 
        description: "Lie down and mentally scan your body from head to toe, relaxing each part.",
        category: "Mindfulness"
      },
      { 
        id: 10, 
        title: "Listen to Music", 
        description: "Listen to a song that makes you feel good and really focus on it.",
        category: "Mood"
      },
      { 
        id: 11, 
        title: "Stretch Break", 
        description: "Take 5 minutes to stretch your body.",
        category: "Physical"
      },
      { 
        id: 12, 
        title: "FREE SPACE", 
        description: "You got this one for free! Self-care is important.",
        category: "Self-care"
      },
      { 
        id: 13, 
        title: "Express Feelings", 
        description: "Draw, write, or talk about how you're feeling right now.",
        category: "Emotional"
      },
      { 
        id: 14, 
        title: "Digital Cleanup", 
        description: "Delete 5 unused apps or organize your digital files.",
        category: "Organization"
      },
      { 
        id: 15, 
        title: "Healthy Snack", 
        description: "Choose a healthy snack instead of a processed one.",
        category: "Nutrition"
      },
      { 
        id: 16, 
        title: "Say No", 
        description: "Politely decline a request that doesn't serve your wellbeing.",
        category: "Boundaries"
      },
      { 
        id: 17, 
        title: "Write a Thank You", 
        description: "Write a thank you note to someone who helped you.",
        category: "Gratitude"
      },
      { 
        id: 18, 
        title: "Face a Fear", 
        description: "Do one small thing that makes you nervous (but is safe).",
        category: "Courage"
      },
      { 
        id: 19, 
        title: "Read for Fun", 
        description: "Read something you enjoy for 15 minutes.",
        category: "Leisure"
      },
      { 
        id: 20, 
        title: "Dance Break", 
        description: "Put on a song and dance for the entire duration.",
        category: "Joy"
      },
      { 
        id: 21, 
        title: "Declutter Space", 
        description: "Spend 10 minutes tidying up your room or workspace.",
        category: "Environment"
      },
      { 
        id: 22, 
        title: "Reach Out", 
        description: "Message or call a friend you haven't talked to in a while.",
        category: "Connection"
      },
      { 
        id: 23, 
        title: "Rest Time", 
        description: "Take a 20-minute nap or rest with your eyes closed.",
        category: "Rest"
      },
      { 
        id: 24, 
        title: "Set a Goal", 
        description: "Write down one specific, achievable goal for this week.",
        category: "Planning"
      }
    ];
    
    return allActivities.find(a => a.id === id) || allActivities[0];
  };
  
  const activity = getActivityDetails(activityId);
  
  return (
    <div>
      <h3 className="text-xl font-bold text-[#1A1F2C] mb-2">
        {activity.title}
      </h3>
      
      <Badge className="mb-3">
        {activity.category}
      </Badge>
      
      <p className="text-gray-600 mb-4">
        {activity.description}
      </p>
      
      <Button 
        onClick={onComplete}
        className={`w-full ${
          isCompleted ? 
            'bg-green-500 hover:bg-green-600' : 
            'bg-[#FC68B3] hover:bg-[#FC68B3]/80'
        }`}
        disabled={isCompleted}
      >
        {isCompleted ? 'Completed!' : 'Mark as Complete'}
      </Button>
    </div>
  );
};

export default ResiliencyBingo;

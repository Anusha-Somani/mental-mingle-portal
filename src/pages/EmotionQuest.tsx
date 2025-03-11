
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import EmotionQuestGame from "@/components/games/EmotionQuestGame";

const EmotionQuest = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
    };
    
    checkUser();
  }, []);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FC68B3]/10 to-[#F5DF4D]/10">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {!gameStarted ? (
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6 text-[#1A1F2C]"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Emotion Quest
            </motion.h1>
            
            <motion.div
              className="mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-lg mb-4">
                Navigate the path of emotions in this journey of resilience and growth.
                Roll the dice, move around the board, and complete emotional challenges to build your resilience score!
              </p>
              <p className="text-md mb-6 text-gray-600">
                Complete activities, collect emotion cards, and learn strategies to manage feelings
                along the way. Will you become an emotion master?
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-12"
            >
              <Card className="p-6 bg-white shadow-lg mx-auto max-w-2xl bg-gradient-to-r from-[#3DFDFF]/20 to-[#FF8A48]/20">
                <h2 className="text-2xl font-bold mb-4">How To Play</h2>
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="inline-block bg-[#FF8A48] text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">1</span>
                    <span>Roll the dice and move your token around the board</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block bg-[#3DFDFF] text-[#1A1F2C] rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">2</span>
                    <span>Land on an emotion space and complete the activity</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block bg-[#F5DF4D] text-[#1A1F2C] rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">3</span>
                    <span>Collect emotion cards and build your resilience score</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block bg-[#FC68B3] text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">4</span>
                    <span>Use strategy cards to navigate difficult emotions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block bg-[#2AC20E] text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">5</span>
                    <span>The first player to reach 50 resilience points wins!</span>
                  </li>
                </ul>
                <Button 
                  onClick={handleStartGame}
                  className="w-full bg-gradient-to-r from-[#FF8A48] to-[#FC68B3] hover:opacity-90 text-white font-medium text-lg py-6"
                >
                  Start Your Emotional Journey
                </Button>
              </Card>
            </motion.div>
            
            {!userId && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-8 p-4 bg-[#D5D5F1]/30 rounded-lg text-center"
              >
                <p className="mb-2">Sign in to save your progress and track your emotional growth!</p>
                <Button 
                  onClick={() => window.location.href = '/auth'}
                  className="bg-[#D5D5F1] hover:bg-[#D5D5F1]/80 text-[#1A1F2C]"
                >
                  Sign In
                </Button>
              </motion.div>
            )}
          </div>
        ) : (
          <EmotionQuestGame userId={userId} />
        )}
      </main>
    </div>
  );
};

export default EmotionQuest;

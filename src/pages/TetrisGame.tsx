
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pause, Play, RefreshCw, Volume2, VolumeX } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import MindfulTetris from "@/components/games/MindfulTetris";
import BreathingGuide from "@/components/games/BreathingGuide";

const TetrisGame = () => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [clearedLines, setClearedLines] = useState(0);
  const [showBreathingGuide, setShowBreathingGuide] = useState(false);
  const [muted, setMuted] = useState(false);

  // Handle game start/pause
  const togglePlay = useCallback(() => {
    if (!isPlaying) {
      toast({
        title: "Game Started",
        description: "Take a deep breath and enjoy the calm experience",
      });
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, toast]);

  // Handle game restart
  const restartGame = useCallback(() => {
    setScore(0);
    setLevel(1);
    setClearedLines(0);
    setIsPlaying(false);
    toast({
      title: "Game Reset",
      description: "Ready for a fresh start",
    });
  }, [toast]);

  // Handle level up based on cleared lines
  useEffect(() => {
    if (clearedLines >= level * 5) {
      setLevel(prevLevel => prevLevel + 1);
      toast({
        title: `Level ${level + 1}!`,
        description: "Great mindful focus. Keep breathing.",
      });
    }
  }, [clearedLines, level, toast]);

  // Toggle breathing guide
  const toggleBreathingGuide = useCallback(() => {
    setShowBreathingGuide(!showBreathingGuide);
  }, [showBreathingGuide]);

  // Toggle sound
  const toggleSound = useCallback(() => {
    setMuted(!muted);
  }, [muted]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#D5D5F1]/30 to-[#3DFDFF]/10">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#1A1F2C]">
          Mindful Blocks
        </h1>
        <p className="text-center mb-8 max-w-2xl mx-auto text-gray-600">
          A calming block-stacking game designed to reduce anxiety. Focus on your breathing while arranging the blocks. The gentle pace and colors promote mindfulness.
        </p>
        
        <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
          {/* Game Controls and Stats */}
          <div className="lg:w-1/4 space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold text-[#1A1F2C]">Game Controls</h2>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={togglePlay}
                    className={isPlaying ? "bg-[#FF8A48]" : "bg-[#2AC20E]"}
                  >
                    {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                  
                  <Button 
                    onClick={restartGame}
                    variant="outline"
                    className="border-[#FC68B3] text-[#FC68B3]"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                  
                  <Button
                    onClick={toggleBreathingGuide}
                    className={`col-span-2 ${showBreathingGuide ? "bg-[#3DFDFF]" : "bg-[#D5D5F1]"}`}
                  >
                    {showBreathingGuide ? "Hide" : "Show"} Breathing Guide
                  </Button>
                  
                  <Button
                    onClick={toggleSound}
                    variant="outline"
                    className="col-span-2 border-[#F5DF4D] text-[#F5DF4D]"
                  >
                    {muted ? <VolumeX className="mr-2 h-4 w-4" /> : <Volume2 className="mr-2 h-4 w-4" />}
                    {muted ? "Unmute" : "Mute"} Sounds
                  </Button>
                </div>
                
                <div className="pt-4 border-t">
                  <h2 className="text-xl font-semibold mb-4 text-[#1A1F2C]">Stats</h2>
                  <div className="grid grid-cols-2 gap-y-2">
                    <div className="text-gray-600">Score:</div>
                    <div className="font-medium text-[#FC68B3]">{score}</div>
                    
                    <div className="text-gray-600">Level:</div>
                    <div className="font-medium text-[#3DFDFF]">{level}</div>
                    
                    <div className="text-gray-600">Lines:</div>
                    <div className="font-medium text-[#FF8A48]">{clearedLines}</div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h2 className="text-xl font-semibold mb-2 text-[#1A1F2C]">How to Play</h2>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Arrow keys to move blocks</li>
                    <li>Up arrow to rotate</li>
                    <li>Down arrow to speed up</li>
                    <li>Space to drop instantly</li>
                    <li>P key to pause/play</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Game Area */}
          <div className="lg:w-2/4">
            <Card className="bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-4 flex justify-center">
                <div className="relative">
                  <MindfulTetris
                    isPlaying={isPlaying}
                    level={level}
                    muted={muted}
                    onScoreChange={setScore}
                    onLinesChange={setClearedLines}
                    onGameOver={() => {
                      setIsPlaying(false);
                      toast({
                        title: "Game Over",
                        description: `You scored ${score} points. Take a moment to breathe deeply.`,
                      });
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Breathing Guide and Mindfulness Tips */}
          <div className="lg:w-1/4 space-y-4">
            {showBreathingGuide && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-[#D5D5F1]/50 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-[#1A1F2C]">Breathing Guide</h2>
                    <BreathingGuide />
                  </CardContent>
                </Card>
              </motion.div>
            )}
            
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-[#1A1F2C]">Mindfulness Tips</h2>
                <div className="space-y-4 text-gray-600">
                  <p>• Focus on your breathing as you play</p>
                  <p>• Notice the colors and shapes without judgment</p>
                  <p>• If you feel stressed, pause and take 3 deep breaths</p>
                  <p>• Remember this is about focus, not just winning</p>
                  <p>• Enjoy the process rather than worrying about the outcome</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TetrisGame;

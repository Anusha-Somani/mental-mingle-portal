
import { useState, useEffect } from "react";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import MindfulTetris from "@/components/games/MindfulTetris";
import BreathingGuide from "@/components/games/BreathingGuide";
import { useToast } from "@/hooks/use-toast";

const TetrisGame = () => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [lines, setLines] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [muted, setMuted] = useState<boolean>(false);
  const [showBreathingGuide, setShowBreathingGuide] = useState<boolean>(false);

  // Advance level based on lines cleared
  useEffect(() => {
    setLevel(Math.floor(lines / 10) + 1);
  }, [lines]);

  // Show breathing guide after game over
  useEffect(() => {
    if (gameOver) {
      const timer = setTimeout(() => {
        setShowBreathingGuide(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [gameOver]);

  const startGame = () => {
    if (gameOver) {
      setScore(0);
      setLines(0);
      setLevel(1);
      setGameOver(false);
    }
    setIsPlaying(true);
    setShowBreathingGuide(false);
  };

  const pauseGame = () => {
    setIsPlaying(false);
  };

  const handleGameOver = () => {
    setGameOver(true);
    setIsPlaying(false);
    
    if (score > 0) {
      toast({
        title: "Game Over",
        description: `You scored ${score} points and cleared ${lines} lines. Great job!`,
      });
    }
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3DFDFF]/10 to-[#FF8A48]/10">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Game area */}
            <div className="md:flex-1">
              {showBreathingGuide ? (
                <BreathingGuide 
                  onFinish={() => {
                    setShowBreathingGuide(false);
                    startGame();
                  }}
                />
              ) : (
                <Card className="h-full bg-white/80 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-0 flex justify-center">
                    <MindfulTetris 
                      isPlaying={isPlaying}
                      level={level}
                      muted={muted}
                      onScoreChange={setScore}
                      onLinesChange={setLines}
                      onGameOver={handleGameOver}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Controls and info */}
            <div className="md:w-72 flex flex-col gap-4">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h1 className="text-2xl font-bold text-center mb-6 text-[#1A1F2C]">
                    Mindful Blocks Game
                  </h1>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span>Score:</span>
                      <span className="font-bold">{score}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lines:</span>
                      <span className="font-bold">{lines}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Level:</span>
                      <span className="font-bold">{level}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {!isPlaying ? (
                      <Button 
                        onClick={startGame}
                        className="w-full bg-[#3DFDFF] hover:bg-[#3DFDFF]/80 text-[#1A1F2C]"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        {gameOver ? "Play Again" : "Start Game"}
                      </Button>
                    ) : (
                      <Button 
                        onClick={pauseGame}
                        className="w-full bg-[#FF8A48] hover:bg-[#FF8A48]/80"
                      >
                        <Pause className="mr-2 h-4 w-4" />
                        Pause Game
                      </Button>
                    )}
                    
                    <Button 
                      onClick={toggleMute}
                      variant="outline"
                      className="w-full"
                    >
                      {muted ? (
                        <>
                          <VolumeX className="mr-2 h-4 w-4" />
                          Unmute
                        </>
                      ) : (
                        <>
                          <Volume2 className="mr-2 h-4 w-4" />
                          Mute
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h2 className="font-bold mb-2">How to Play</h2>
                  <ul className="text-sm space-y-2">
                    <li>← → : Move left/right</li>
                    <li>↑ : Rotate piece</li>
                    <li>↓ : Soft drop</li>
                    <li>Space : Hard drop</li>
                  </ul>
                  
                  <div className="mt-4 p-3 bg-[#F5DF4D]/20 rounded-lg text-sm">
                    <p className="font-medium">Mindfulness Tip:</p>
                    <p>Take deep breaths while playing to stay calm and focused. Notice when you feel tension and try to relax.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TetrisGame;

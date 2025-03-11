
import { useState, useEffect } from "react";
import { Dice5, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import EmotionQuestBoard from "@/components/games/EmotionQuestBoard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Space {
  id: number;
  type: "start" | "emotion" | "challenge" | "reflection" | "resource" | "bonus";
  label: string;
  description?: string;
  color: string;
  position: { x: number; y: number };
}

interface PlayerToken {
  id: number;
  position: number;
  color: string;
}

const EmotionQuest = () => {
  const { toast } = useToast();
  const [diceValue, setDiceValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [players, setPlayers] = useState<PlayerToken[]>([
    { id: 1, position: 0, color: "#FC68B3" },
    { id: 2, position: 0, color: "#3DFDFF" }
  ]);
  const [activeSpaceInfo, setActiveSpaceInfo] = useState<Space | null>(null);
  const [resilience, setResilience] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUserId(data.session.user.id);
      }
    };
    checkAuth();
  }, []);

  // Generate board spaces
  const generateBoardSpaces = (): Space[] => {
    const spaces: Space[] = [];
    const totalSpaces = 20;
    
    // Starting position
    spaces.push({
      id: 0,
      type: "start",
      label: "Start",
      color: "#2AC20E",
      position: { x: 50, y: 50 }
    });
    
    // Generate board positions in a rectangle path
    for (let i = 1; i < totalSpaces; i++) {
      let position = { x: 0, y: 0 };
      
      if (i < 5) {
        // Top edge (moving right)
        position = { x: 50 + (i * 250), y: 50 };
      } else if (i < 10) {
        // Right edge (moving down)
        position = { x: 1050, y: 50 + ((i - 4) * 125) };
      } else if (i < 15) {
        // Bottom edge (moving left)
        position = { x: 1050 - ((i - 9) * 250), y: 550 };
      } else {
        // Left edge (moving up)
        position = { x: 50, y: 550 - ((i - 14) * 125) };
      }
      
      // Determine space type
      let type: Space["type"] = "emotion";
      
      if (i % 5 === 0) type = "bonus";
      else if (i % 4 === 0) type = "resource";
      else if (i % 3 === 0) type = "reflection";
      else if (i % 2 === 0) type = "challenge";
      
      spaces.push({
        id: i,
        type,
        label: getSpaceLabel(type),
        color: getSpaceColor(type),
        position
      });
    }
    
    return spaces;
  };
  
  const getSpaceLabel = (type: Space["type"]): string => {
    switch (type) {
      case "start": return "Start";
      case "emotion": return "Emotion";
      case "challenge": return "Challenge";
      case "reflection": return "Reflect";
      case "resource": return "Resource";
      case "bonus": return "Bonus";
      default: return "";
    }
  };
  
  const getSpaceColor = (type: Space["type"]): string => {
    switch (type) {
      case "start": return "#2AC20E";
      case "emotion": return "#FC68B3";
      case "challenge": return "#FF8A48";
      case "reflection": return "#3DFDFF";
      case "resource": return "#F5DF4D";
      case "bonus": return "#D5D5F1";
      default: return "#FFFFFF";
    }
  };

  const rollDice = () => {
    setIsRolling(true);
    
    // Simulate dice rolling
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
    }, 100);
    
    // Stop rolling after a delay
    setTimeout(() => {
      clearInterval(rollInterval);
      const finalDiceValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(finalDiceValue);
      movePlayer(finalDiceValue);
      setIsRolling(false);
    }, 1000);
  };
  
  const movePlayer = (steps: number) => {
    const player = players[currentPlayerIndex];
    const spaces = generateBoardSpaces();
    const newPosition = (player.position + steps) % spaces.length;
    
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex] = {
      ...player,
      position: newPosition
    };
    
    setPlayers(updatedPlayers);
    
    // Get the space the player landed on
    const landedSpace = spaces[newPosition];
    setActiveSpaceInfo(landedSpace);
    
    // Award resilience points based on space type
    let pointsAwarded = 0;
    switch (landedSpace.type) {
      case "emotion": pointsAwarded = 5; break;
      case "challenge": pointsAwarded = 10; break;
      case "reflection": pointsAwarded = 15; break;
      case "resource": pointsAwarded = 20; break;
      case "bonus": pointsAwarded = 25; break;
      default: pointsAwarded = 0;
    }
    
    if (pointsAwarded > 0) {
      setResilience(prev => prev + pointsAwarded);
      toast({
        title: `${pointsAwarded} Resilience Points!`,
        description: `You earned ${pointsAwarded} points by landing on ${landedSpace.label}`,
      });
    }
    
    // Next player's turn
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
  };
  
  const handleLandOnSpace = (space: Space) => {
    setActiveSpaceInfo(space);
  };

  const boardSpaces = generateBoardSpaces();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#D5D5F1]/10 to-[#FC68B3]/10">
      <Navigation />
      
      <main className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Game board */}
          <div className="md:flex-1">
            <EmotionQuestBoard 
              spaces={boardSpaces}
              playerTokens={players}
              currentPlayerIndex={currentPlayerIndex}
              onLandOnSpace={handleLandOnSpace}
              className="mb-4"
            />
          </div>
          
          {/* Game controls */}
          <div className="md:w-80 space-y-4">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 text-[#1A1F2C]">Game Controls</h2>
                
                <div className="flex justify-between items-center mb-6">
                  <div className="text-center">
                    <Badge className="bg-[#3DFDFF] mb-2">Player {currentPlayerIndex + 1}</Badge>
                    <div 
                      className="w-8 h-8 rounded-full mx-auto" 
                      style={{ backgroundColor: players[currentPlayerIndex].color }}
                    ></div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xl font-bold mb-2">{diceValue}</div>
                    <Button 
                      onClick={rollDice}
                      disabled={isRolling}
                      className="bg-[#FF8A48] hover:bg-[#FF8A48]/80"
                    >
                      <Dice5 className="mr-2 h-4 w-4" />
                      Roll Dice
                    </Button>
                  </div>
                  
                  <div className="text-center">
                    <Badge className="bg-[#F5DF4D] text-black mb-2">
                      <Trophy className="mr-1 h-3 w-3" />
                      Points
                    </Badge>
                    <div className="text-xl font-bold">{resilience}</div>
                  </div>
                </div>
                
                {activeSpaceInfo && (
                  <div className="p-4 rounded-lg" style={{ backgroundColor: `${activeSpaceInfo.color}20` }}>
                    <h3 className="font-medium flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: activeSpaceInfo.color }}
                      ></div>
                      {activeSpaceInfo.label} Space
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {activeSpaceInfo.type === "emotion" && "Share an emotion you felt today"}
                      {activeSpaceInfo.type === "challenge" && "Complete a small challenge"}
                      {activeSpaceInfo.type === "reflection" && "Reflect on a past experience"}
                      {activeSpaceInfo.type === "resource" && "Discover a helpful resource"}
                      {activeSpaceInfo.type === "bonus" && "Bonus points!"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 text-[#1A1F2C]">How to Play</h2>
                <ul className="space-y-2 text-sm">
                  <li>1. Roll the dice on your turn</li>
                  <li>2. Move your token around the board</li>
                  <li>3. Complete activities based on where you land</li>
                  <li>4. Earn Resilience Points for each completed activity</li>
                  <li>5. The player with the most points after all turns wins!</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmotionQuest;

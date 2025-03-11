
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { 
  Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, 
  Heart, Brain, Trophy, Star, Info,
  Smile, Frown, Meh, Angry, User2, 
  ArrowRight, X, HelpCircle,
  Laugh, BookOpen
} from "lucide-react";
import EmotionQuestBoard from "@/components/games/EmotionQuestBoard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Player {
  id: number;
  name: string;
  position: number;
  avatar: number;
  resiliencePoints: number;
  cards: EmotionCard[];
}

interface EmotionCard {
  id: number;
  type: "joy" | "sadness" | "anger" | "fear" | "disgust" | "surprise";
  title: string;
  description: string;
  activity: string;
  points: number;
  color: string;
}

interface EmotionQuestGameProps {
  userId: string | null;
}

const AVATARS = [
  "👧", "👦", "👩", "👨", "👱‍♀️", "👱", "👴", "👵", 
  "👲", "👳‍♀️", "👳", "🧕", "👮‍♀️", "👮", "👷‍♀️", "👷"
];

const PLAYER_COLORS = [
  "#FF8A48", "#3DFDFF", "#FC68B3", "#F5DF4D"
];

const EmotionQuestGame: React.FC<EmotionQuestGameProps> = ({ userId }) => {
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "You", position: 0, avatar: 0, resiliencePoints: 0, cards: [] }
  ]);
  
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [activeCard, setActiveCard] = useState<EmotionCard | null>(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [tempPlayerName, setTempPlayerName] = useState("");
  const [tempAvatarIndex, setTempAvatarIndex] = useState(0);
  const [gamePhase, setGamePhase] = useState<"setup" | "playing" | "finished">("setup");
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0);

  const { toast } = useToast();
  const diceRef = useRef<HTMLDivElement>(null);

  // Emotion cards database
  const emotionCards: EmotionCard[] = [
    // Joy cards
    {
      id: 1,
      type: "joy",
      title: "Express Gratitude",
      description: "Write 3 things you're grateful for today",
      activity: "Take a moment to reflect on three things in your life you're grateful for. This can boost positive emotions and help build resilience.",
      points: 3,
      color: "#F5DF4D"
    },
    {
      id: 2,
      type: "joy",
      title: "Share a Happy Memory",
      description: "Tell others about a time you felt really happy",
      activity: "Think of a specific moment when you felt genuine happiness and share the details with another player.",
      points: 2,
      color: "#F5DF4D"
    },
    {
      id: 3,
      type: "joy",
      title: "Create a Joy Playlist",
      description: "Make a playlist of songs that make you feel good",
      activity: "Think about 5 songs that bring you joy and energize you. Consider creating this playlist in real life!",
      points: 3,
      color: "#F5DF4D"
    },
    {
      id: 4,
      type: "joy",
      title: "Laugh Out Loud",
      description: "Share a joke or funny story with the group",
      activity: "Laughter is great medicine for stress! Share something that makes you laugh with the other players.",
      points: 2,
      color: "#F5DF4D"
    },
    
    // Sadness cards
    {
      id: 5,
      type: "sadness",
      title: "Comfort Strategies",
      description: "List 3 healthy ways to cope when feeling sad",
      activity: "Think about strategies that help you feel better when you're sad. Examples might include talking to a friend, going for a walk, or listening to music.",
      points: 3,
      color: "#3DFDFF"
    },
    {
      id: 6,
      type: "sadness",
      title: "Express Your Feelings",
      description: "Draw or describe how sadness feels to you",
      activity: "Sadness is a natural emotion. Take a moment to consider how it feels in your body and mind, and how you might express it constructively.",
      points: 3,
      color: "#3DFDFF"
    },
    {
      id: 7,
      type: "sadness",
      title: "Support Network",
      description: "Name 3 people you can talk to when feeling down",
      activity: "Having people to talk to when you're sad is important. Who are the people in your life you trust with your feelings?",
      points: 2,
      color: "#3DFDFF"
    },
    
    // Anger cards
    {
      id: 8,
      type: "anger",
      title: "Anger Management",
      description: "Practice a calming technique for 30 seconds",
      activity: "Try deep breathing: Inhale slowly for 4 counts, hold for 4 counts, exhale for 6 counts. Repeat several times.",
      points: 3,
      color: "#FC68B3"
    },
    {
      id: 9,
      type: "anger",
      title: "Anger Alternatives",
      description: "List 3 healthy ways to express anger",
      activity: "Anger is natural, but how we express it matters. What are some constructive ways to handle anger?",
      points: 3,
      color: "#FC68B3"
    },
    {
      id: 10,
      type: "anger",
      title: "Identify Triggers",
      description: "What situations tend to make you angry?",
      activity: "Recognizing what triggers your anger is the first step to managing it better. Reflect on situations that commonly frustrate you.",
      points: 2,
      color: "#FC68B3"
    },
    
    // Fear cards
    {
      id: 11,
      type: "fear",
      title: "Face Your Fears",
      description: "Name something that makes you anxious and one small step to address it",
      activity: "Breaking down fears into small, manageable steps can help us overcome them gradually.",
      points: 4,
      color: "#D5D5F1"
    },
    {
      id: 12,
      type: "fear",
      title: "Courage Building",
      description: "Share a time when you did something despite being afraid",
      activity: "Courage isn't the absence of fear but acting despite it. Reflect on a time you showed courage.",
      points: 3,
      color: "#D5D5F1"
    },
    {
      id: 13,
      type: "fear",
      title: "Reframe Worries",
      description: "Take a worry and find a more positive/realistic perspective",
      activity: "Our minds often jump to worst-case scenarios. Practice reframing a worry into a more balanced thought.",
      points: 3,
      color: "#D5D5F1"
    },
    
    // Surprise cards
    {
      id: 14,
      type: "surprise",
      title: "Adaptability Challenge",
      description: "Describe how you'd handle an unexpected situation",
      activity: "Life is full of surprises! How would you handle suddenly having to change your plans for something important?",
      points: 3,
      color: "#FF8A48"
    },
    {
      id: 15,
      type: "surprise",
      title: "Comfort Zone Stretch",
      description: "Share one way you could step out of your comfort zone",
      activity: "Growth happens when we try new things. What's a small step you could take outside your usual routine?",
      points: 3,
      color: "#FF8A48"
    },
    {
      id: 16,
      type: "surprise",
      title: "Embracing Change",
      description: "Reflect on a positive change that was initially difficult",
      activity: "Sometimes changes that seem hard at first turn out to be good for us. Can you think of an example from your life?",
      points: 3,
      color: "#FF8A48"
    },
    
    // Disgust cards
    {
      id: 17,
      type: "disgust",
      title: "Boundary Setting",
      description: "Practice saying no to something you're uncomfortable with",
      activity: "Setting healthy boundaries is important. Practice a polite but firm way to decline something that doesn't feel right for you.",
      points: 3,
      color: "#2AC20E"
    },
    {
      id: 18,
      type: "disgust",
      title: "Values Clarification",
      description: "Name 3 personal values that are important to you",
      activity: "Our values guide our decisions. What principles or qualities do you consider most important in life?",
      points: 2,
      color: "#2AC20E"
    },
    {
      id: 19,
      type: "disgust",
      title: "Healthy Choices",
      description: "Describe a situation where you chose what was right over what was easy",
      activity: "Sometimes the right choice isn't the easiest one. Reflect on a time you made a tough but good decision.",
      points: 3,
      color: "#2AC20E"
    },
    {
      id: 20,
      type: "disgust",
      title: "Mindful Nutrition",
      description: "Name 3 foods that make your body feel good and energized",
      activity: "What we eat affects how we feel. What foods help you feel your best?",
      points: 2,
      color: "#2AC20E"
    }
  ];

  // Tutorial content
  const tutorialSteps = [
    {
      title: "Welcome to Emotion Quest!",
      content: "This game will help you understand and navigate your emotions while building resilience."
    },
    {
      title: "The Game Board",
      content: "The board represents your emotional journey. Each space corresponds to a different emotion or challenge."
    },
    {
      title: "Taking Your Turn",
      content: "On your turn, roll the dice and move your token around the board. Land on different emotion spaces to collect cards."
    },
    {
      title: "Emotion Cards",
      content: "When you land on an emotion space, you'll draw a card that presents an activity or reflection related to that emotion."
    },
    {
      title: "Building Resilience",
      content: "Complete the activities on the cards to earn resilience points. The more you engage with different emotions, the more resilient you become!"
    },
    {
      title: "Winning the Game",
      content: "The first player to reach 50 resilience points wins the game, but everyone wins by learning valuable emotional skills!"
    }
  ];

  // Board spaces configuration
  const boardSpaces = [
    { type: "start", label: "START" },
    { type: "joy", label: "Joy" },
    { type: "surprise", label: "Surprise" },
    { type: "neutral", label: "Take a break" },
    { type: "sadness", label: "Sadness" },
    { type: "neutral", label: "Reflect" },
    { type: "anger", label: "Anger" },
    { type: "bonus", label: "Bonus Points" },
    { type: "fear", label: "Fear" },
    { type: "neutral", label: "Deep breath" },
    { type: "joy", label: "Joy" },
    { type: "disgust", label: "Disgust" },
    { type: "neutral", label: "Share a thought" },
    { type: "surprise", label: "Surprise" },
    { type: "anger", label: "Anger" },
    { type: "neutral", label: "Self-care" },
    { type: "sadness", label: "Sadness" },
    { type: "bonus", label: "Bonus Points" },
    { type: "fear", label: "Fear" },
    { type: "joy", label: "Joy" },
    { type: "neutral", label: "Mindfulness" },
    { type: "disgust", label: "Disgust" },
    { type: "surprise", label: "Surprise" },
    { type: "neutral", label: "Gratitude" }
  ];

  // Set up game with custom players
  const setupGame = () => {
    if (players.length === 1 && players[0].name === "You") {
      setShowPlayerModal(true);
    } else {
      setGamePhase("playing");
      toast({
        title: "Game Started!",
        description: `${players[0].name}'s turn to roll the dice!`,
      });
    }
  };

  // Add a player to the game
  const addPlayer = () => {
    if (tempPlayerName.trim() === "") {
      toast({
        title: "Name Required",
        description: "Please enter a player name",
        variant: "destructive",
      });
      return;
    }

    if (players.length >= 4) {
      toast({
        title: "Maximum Players Reached",
        description: "The game can have a maximum of 4 players",
        variant: "destructive",
      });
      return;
    }

    const newPlayer = {
      id: players.length + 1,
      name: tempPlayerName,
      position: 0,
      avatar: tempAvatarIndex,
      resiliencePoints: 0,
      cards: []
    };

    setPlayers([...players, newPlayer]);
    setTempPlayerName("");
    setTempAvatarIndex(Math.floor(Math.random() * AVATARS.length));
    
    toast({
      title: "Player Added",
      description: `${tempPlayerName} has joined the game!`,
    });
  };

  // Roll the dice and move player
  const rollDice = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    
    // Visual rolling effect
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
    }, 100);
    
    // Stop rolling after 1 second
    setTimeout(() => {
      clearInterval(rollInterval);
      const finalValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(finalValue);
      
      // Move player
      const currentPlayer = { ...players[currentPlayerIndex] };
      const newPosition = (currentPlayer.position + finalValue) % boardSpaces.length;
      
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex] = {
        ...currentPlayer,
        position: newPosition
      };
      
      setPlayers(updatedPlayers);
      
      // Check if player landed on an emotion space
      const landedSpace = boardSpaces[newPosition];
      
      if (landedSpace.type !== "neutral" && landedSpace.type !== "start" && landedSpace.type !== "bonus") {
        // Draw a random card of the corresponding emotion
        const matchingCards = emotionCards.filter(card => card.type === landedSpace.type);
        const randomCard = matchingCards[Math.floor(Math.random() * matchingCards.length)];
        setActiveCard(randomCard);
        
        setTimeout(() => {
          setShowCardModal(true);
        }, 1000);
      } else if (landedSpace.type === "bonus") {
        // Give bonus points
        const bonusPoints = Math.floor(Math.random() * 3) + 1;
        const playerWithBonus = { ...players[currentPlayerIndex] };
        playerWithBonus.resiliencePoints += bonusPoints;
        
        const updatedPlayersWithBonus = [...players];
        updatedPlayersWithBonus[currentPlayerIndex] = playerWithBonus;
        
        setPlayers(updatedPlayersWithBonus);
        
        toast({
          title: "Bonus Points!",
          description: `${playerWithBonus.name} received ${bonusPoints} bonus resilience points!`,
        });
        
        // Move to next player after a delay
        setTimeout(() => {
          nextPlayer();
        }, 2000);
      } else {
        // If neutral space, just move to next player after a delay
        setTimeout(() => {
          nextPlayer();
        }, 2000);
      }
      
      setIsRolling(false);
    }, 1000);
  };

  // Complete a card activity
  const completeActivity = () => {
    if (!activeCard) return;
    
    // Add card to player's collection
    const updatedPlayer = { ...players[currentPlayerIndex] };
    updatedPlayer.cards.push(activeCard);
    updatedPlayer.resiliencePoints += activeCard.points;
    
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex] = updatedPlayer;
    
    setPlayers(updatedPlayers);
    setShowCardModal(false);
    setActiveCard(null);
    
    // Check if player won
    if (updatedPlayer.resiliencePoints >= 50) {
      setGamePhase("finished");
      toast({
        title: "We Have a Winner!",
        description: `${updatedPlayer.name} has reached 50 resilience points and won the game!`,
      });
    } else {
      toast({
        title: "Activity Completed",
        description: `${updatedPlayer.name} earned ${activeCard.points} resilience points!`,
      });
      
      // Move to next player
      nextPlayer();
    }
  };

  // Move to next player's turn
  const nextPlayer = () => {
    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
  };

  // Render dice face based on value
  const renderDiceFace = () => {
    switch (diceValue) {
      case 1: return <Dice1 className="w-10 h-10" />;
      case 2: return <Dice2 className="w-10 h-10" />;
      case 3: return <Dice3 className="w-10 h-10" />;
      case 4: return <Dice4 className="w-10 h-10" />;
      case 5: return <Dice5 className="w-10 h-10" />;
      case 6: return <Dice6 className="w-10 h-10" />;
      default: return <Dice1 className="w-10 h-10" />;
    }
  };

  // Get emotion icon based on type
  const getEmotionIcon = (type: string) => {
    switch (type) {
      case "joy": return <Smile className="w-5 h-5" style={{ color: "#F5DF4D" }} />;
      case "sadness": return <Frown className="w-5 h-5" style={{ color: "#3DFDFF" }} />;
      case "anger": return <Angry className="w-5 h-5" style={{ color: "#FC68B3" }} />;
      case "fear": return <Meh className="w-5 h-5" style={{ color: "#D5D5F1" }} />;
      case "surprise": return <Laugh className="w-5 h-5" style={{ color: "#FF8A48" }} />;
      case "disgust": return <BookOpen className="w-5 h-5" style={{ color: "#2AC20E" }} />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  // Save game progress if logged in
  useEffect(() => {
    if (userId && gamePhase === "finished") {
      const saveGameResult = async () => {
        try {
          const { error } = await supabase
            .from('game_results')
            .insert({
              user_id: userId,
              game_type: 'emotion_quest',
              score: players.find(p => p.id === 1)?.resiliencePoints || 0,
              completed: true,
              metadata: { 
                players: players.map(p => ({ 
                  name: p.name, 
                  score: p.resiliencePoints,
                  cards_collected: p.cards.length
                }))
              }
            });
            
          if (error) throw error;
        } catch (error) {
          console.error('Error saving game result:', error);
        }
      };
      
      saveGameResult();
    }
  }, [gamePhase, userId, players]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Tutorial Dialog */}
      <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{tutorialSteps[tutorialStep].title}</DialogTitle>
            <DialogDescription>
              {tutorialSteps[tutorialStep].content}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setTutorialStep(Math.max(0, tutorialStep - 1))}
              disabled={tutorialStep === 0}
            >
              Previous
            </Button>
            <Button
              onClick={() => {
                if (tutorialStep < tutorialSteps.length - 1) {
                  setTutorialStep(tutorialStep + 1);
                } else {
                  setShowTutorial(false);
                }
              }}
            >
              {tutorialStep < tutorialSteps.length - 1 ? "Next" : "Start Playing"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Player Setup Modal */}
      <Dialog open={showPlayerModal} onOpenChange={setShowPlayerModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Setup Your Game</DialogTitle>
            <DialogDescription>
              Add players to get started with Emotion Quest.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="playerName" className="text-sm font-medium">Player Name</label>
              <div className="flex gap-2">
                <input
                  id="playerName"
                  value={tempPlayerName}
                  onChange={(e) => setTempPlayerName(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter player name"
                />
                
                <Button onClick={() => setTempAvatarIndex((prev) => (prev + 1) % AVATARS.length)} variant="outline">
                  <div className="text-xl">{AVATARS[tempAvatarIndex]}</div>
                </Button>
              </div>
            </div>
            
            <Button onClick={addPlayer}>Add Player</Button>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Current Players:</h4>
              <div className="space-y-2">
                {players.map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                        <span className="text-lg">{AVATARS[player.avatar]}</span>
                      </div>
                      <span>{player.name}</span>
                    </div>
                    {index > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setPlayers(players.filter(p => p.id !== player.id))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={() => {
                setShowPlayerModal(false);
                setGamePhase("playing");
              }}
              disabled={players.length === 0}
            >
              Start Game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Emotion Card Modal */}
      <Dialog open={showCardModal} onOpenChange={setShowCardModal}>
        <DialogContent className="sm:max-w-md">
          {activeCard && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  {getEmotionIcon(activeCard.type)}
                  <DialogTitle>{activeCard.title}</DialogTitle>
                </div>
                <DialogDescription>
                  {activeCard.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="p-4 bg-gray-100 rounded-md my-4">
                <h4 className="font-medium mb-2">Activity:</h4>
                <p>{activeCard.activity}</p>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span>Completing this earns you {activeCard.points} resilience points</span>
              </div>
              
              <DialogFooter>
                <Button onClick={completeActivity}>
                  I've Completed This Activity
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Game Setup Phase */}
      {gamePhase === "setup" && (
        <div className="text-center mb-8">
          <Button 
            onClick={setupGame} 
            className="bg-gradient-to-r from-[#FF8A48] to-[#FC68B3] hover:opacity-90 py-6 px-8 text-lg"
          >
            Set Up Game
          </Button>
        </div>
      )}

      {/* Main Game Board and UI */}
      {gamePhase === "playing" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Game Board */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden h-full">
              <CardHeader className="bg-gradient-to-r from-[#3DFDFF]/20 to-[#FC68B3]/20">
                <CardTitle className="flex justify-between items-center">
                  <span>Emotion Quest Board</span>
                  <Button variant="outline" size="sm" onClick={() => setShowTutorial(true)}>
                    <HelpCircle className="h-4 w-4 mr-1" /> Help
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative p-4 flex items-center justify-center">
                  <EmotionQuestBoard 
                    spaces={boardSpaces} 
                    players={players}
                    currentPlayerIndex={currentPlayerIndex}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Player Info and Controls */}
          <div>
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">
                  Current Turn: 
                  <span className="ml-2 font-bold" style={{ color: PLAYER_COLORS[currentPlayerIndex % PLAYER_COLORS.length] }}>
                    {players[currentPlayerIndex].name}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: PLAYER_COLORS[currentPlayerIndex % PLAYER_COLORS.length] + "30" }}
                    >
                      {AVATARS[players[currentPlayerIndex].avatar]}
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Resilience Points:</div>
                      <div className="font-bold text-xl">{players[currentPlayerIndex].resiliencePoints}/50</div>
                    </div>
                  </div>
                  
                  <div 
                    ref={diceRef} 
                    className={`w-20 h-20 rounded-xl flex items-center justify-center bg-white shadow-md border-2 ${isRolling ? "animate-spin" : ""}`}
                    style={{ borderColor: PLAYER_COLORS[currentPlayerIndex % PLAYER_COLORS.length] }}
                  >
                    {diceValue ? renderDiceFace() : <Dice1 className="w-10 h-10 text-gray-400" />}
                  </div>
                </div>
                
                <Button 
                  onClick={rollDice} 
                  disabled={isRolling}
                  className="w-full py-6 text-lg"
                  style={{ 
                    backgroundColor: PLAYER_COLORS[currentPlayerIndex % PLAYER_COLORS.length],
                    color: ["#F5DF4D", "#2AC20E"].includes(PLAYER_COLORS[currentPlayerIndex % PLAYER_COLORS.length]) ? "#1A1F2C" : "white"
                  }}
                >
                  Roll Dice
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Players' Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="progress" className="w-full">
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="progress">Progress</TabsTrigger>
                    <TabsTrigger value="cards">Emotion Cards</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="progress" className="mt-0">
                    <div className="space-y-4">
                      {players.map((player, index) => (
                        <div key={player.id} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                                style={{ backgroundColor: PLAYER_COLORS[index % PLAYER_COLORS.length] + "30" }}
                              >
                                {AVATARS[player.avatar]}
                              </div>
                              <span 
                                className="font-medium"
                                style={{ color: index === currentPlayerIndex ? PLAYER_COLORS[index % PLAYER_COLORS.length] : "inherit" }}
                              >
                                {player.name}
                              </span>
                            </div>
                            <span className="text-sm">{player.resiliencePoints}/50</span>
                          </div>
                          <Progress value={(player.resiliencePoints / 50) * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="cards" className="mt-0">
                    <div className="space-y-4">
                      {players.map((player) => (
                        <div key={player.id} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-6 h-6 rounded-full flex items-center justify-center text-sm"
                              style={{ backgroundColor: PLAYER_COLORS[(player.id - 1) % PLAYER_COLORS.length] + "30" }}
                            >
                              {AVATARS[player.avatar]}
                            </div>
                            <span className="font-medium">{player.name}'s Cards</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {player.cards.length === 0 ? (
                              <p className="text-sm text-gray-500 italic">No cards collected yet</p>
                            ) : (
                              player.cards.map((card, cardIndex) => (
                                <Badge
                                  key={`${card.id}-${cardIndex}`}
                                  className="cursor-pointer"
                                  style={{ backgroundColor: card.color, color: ["#F5DF4D", "#2AC20E"].includes(card.color) ? "#1A1F2C" : "white" }}
                                  onClick={() => {
                                    setActiveCard(card);
                                    setShowCardModal(true);
                                  }}
                                >
                                  {getEmotionIcon(card.type)}
                                  <span className="ml-1">{card.type}</span>
                                </Badge>
                              ))
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Game Finished */}
      {gamePhase === "finished" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <h2 className="text-3xl font-bold mb-6">Game Completed!</h2>
          
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-[#3DFDFF]/20 to-[#FC68B3]/20">
            <CardHeader>
              <CardTitle>Final Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Winner */}
                {players.sort((a, b) => b.resiliencePoints - a.resiliencePoints).map((player, index) => (
                  <div 
                    key={player.id}
                    className={`flex items-center gap-4 p-4 rounded-lg ${index === 0 ? 'bg-yellow-100' : ''}`}
                  >
                    <div className="relative">
                      <Avatar className="w-16 h-16 text-4xl border-2 border-[#FF8A48]">
                        {AVATARS[player.avatar]}
                      </Avatar>
                      {index === 0 && (
                        <div className="absolute -top-2 -right-2 bg-[#F5DF4D] text-black rounded-full w-8 h-8 flex items-center justify-center">
                          <Trophy className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-xl">{player.name}</h3>
                          <p className="text-gray-600">{player.cards.length} emotion cards collected</p>
                        </div>
                        <div className="text-2xl font-bold">{player.resiliencePoints} pts</div>
                      </div>
                      <Progress value={(player.resiliencePoints / 50) * 100} className="h-2 mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <Button 
                onClick={() => window.location.href = '/resources'} 
                variant="outline"
              >
                Return to Resources
              </Button>
              <Button 
                onClick={() => {
                  setPlayers([
                    { id: 1, name: players[0].name, position: 0, avatar: players[0].avatar, resiliencePoints: 0, cards: [] }
                  ]);
                  setCurrentPlayerIndex(0);
                  setDiceValue(null);
                  setGamePhase("setup");
                }} 
                className="bg-[#FF8A48]"
              >
                Play Again
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default EmotionQuestGame;

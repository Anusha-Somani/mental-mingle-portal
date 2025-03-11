
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, User, Trophy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import EmotionQuestBoard from "./EmotionQuestBoard";

// Space types
type SpaceType = "start" | "emotion" | "challenge" | "reflection" | "resource" | "bonus";

// Game space definition
interface Space {
  id: number;
  type: SpaceType;
  label: string;
  description: string;
  action?: string;
  options?: string[];
  points?: number;
  color: string;
  position: { x: number; y: number };
}

// Player token
interface PlayerToken {
  id: number;
  position: number;
  color: string;
  points: number;
  name: string;
  completedChallenges: number[];
}

// Game states
type GameState = "setup" | "rolling" | "action" | "completed";

// Actions for different space types
interface ActionContent {
  emotion: {
    title: string;
    descriptions: string[];
    reflections: string[];
  }[];
  challenge: {
    title: string;
    descriptions: string[];
    tasks: string[];
  }[];
  reflection: {
    title: string;
    descriptions: string[];
    questions: string[];
  }[];
  resource: {
    title: string;
    descriptions: string[];
    tips: string[];
  }[];
  bonus: {
    title: string;
    descriptions: string[];
    rewards: string[];
  }[];
}

// Main game component
const EmotionQuestGame: React.FC = () => {
  // State
  const [gameState, setGameState] = useState<GameState>("setup");
  const [playerTokens, setPlayerTokens] = useState<PlayerToken[]>([
    {
      id: 1,
      position: 0,
      color: "#3DFDFF",
      points: 0,
      name: "Player 1",
      completedChallenges: [],
    },
  ]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [currentSpace, setCurrentSpace] = useState<Space | null>(null);
  const [actionCompleted, setActionCompleted] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [gameCompletionMessage, setGameCompletionMessage] = useState("");

  const { toast } = useToast();

  // Board spaces
  const spaces: Space[] = [
    {
      id: 0,
      type: "start",
      label: "Start",
      description: "Begin your emotional journey!",
      color: "#2AC20E",
      position: { x: 550, y: 550 },
    },
    {
      id: 1,
      type: "emotion",
      label: "Anxiety",
      description: "Explore feelings of anxiety and worry",
      points: 5,
      color: "#FC68B3",
      position: { x: 450, y: 550 },
    },
    {
      id: 2,
      type: "challenge",
      label: "Deep Breathing",
      description: "Complete a breathing exercise",
      points: 10,
      color: "#FF8A48",
      position: { x: 350, y: 550 },
    },
    {
      id: 3,
      type: "reflection",
      label: "Self-Talk",
      description: "Reflect on your inner dialogue",
      points: 5,
      color: "#3DFDFF",
      position: { x: 250, y: 550 },
    },
    {
      id: 4,
      type: "resource",
      label: "Coping Skills",
      description: "Learn a new coping skill",
      points: 5,
      color: "#F5DF4D",
      position: { x: 150, y: 550 },
    },
    {
      id: 5,
      type: "bonus",
      label: "Self-Care",
      description: "Bonus points for self-care practice",
      points: 15,
      color: "#D5D5F1",
      position: { x: 50, y: 550 },
    },
    {
      id: 6,
      type: "emotion",
      label: "Anger",
      description: "Explore feelings of anger and frustration",
      points: 5,
      color: "#FC68B3",
      position: { x: 50, y: 450 },
    },
    {
      id: 7,
      type: "challenge",
      label: "Mindfulness",
      description: "Practice being present in the moment",
      points: 10,
      color: "#FF8A48",
      position: { x: 50, y: 350 },
    },
    {
      id: 8,
      type: "reflection",
      label: "Values",
      description: "Reflect on personal values",
      points: 5,
      color: "#3DFDFF",
      position: { x: 50, y: 250 },
    },
    {
      id: 9,
      type: "resource",
      label: "Support System",
      description: "Identify people who support you",
      points: 5,
      color: "#F5DF4D",
      position: { x: 50, y: 150 },
    },
    {
      id: 10,
      type: "bonus",
      label: "Resilience",
      description: "Bonus for identifying strengths",
      points: 15,
      color: "#D5D5F1",
      position: { x: 50, y: 50 },
    },
    {
      id: 11,
      type: "emotion",
      label: "Joy",
      description: "Explore feelings of happiness and joy",
      points: 5,
      color: "#FC68B3",
      position: { x: 150, y: 50 },
    },
    {
      id: 12,
      type: "challenge",
      label: "Gratitude",
      description: "Practice expressing gratitude",
      points: 10,
      color: "#FF8A48",
      position: { x: 250, y: 50 },
    },
    {
      id: 13,
      type: "reflection",
      label: "Goals",
      description: "Reflect on personal goals",
      points: 5,
      color: "#3DFDFF",
      position: { x: 350, y: 50 },
    },
    {
      id: 14,
      type: "resource",
      label: "Healthy Habits",
      description: "Learn about building healthy habits",
      points: 5,
      color: "#F5DF4D",
      position: { x: 450, y: 50 },
    },
    {
      id: 15,
      type: "bonus",
      label: "Confidence",
      description: "Bonus for building confidence",
      points: 15,
      color: "#D5D5F1",
      position: { x: 550, y: 50 },
    },
    {
      id: 16,
      type: "emotion",
      label: "Sadness",
      description: "Explore feelings of sadness",
      points: 5,
      color: "#FC68B3",
      position: { x: 550, y: 150 },
    },
    {
      id: 17,
      type: "challenge",
      label: "Self-Compassion",
      description: "Practice being kind to yourself",
      points: 10,
      color: "#FF8A48",
      position: { x: 550, y: 250 },
    },
    {
      id: 18,
      type: "reflection",
      label: "Strengths",
      description: "Reflect on personal strengths",
      points: 5,
      color: "#3DFDFF",
      position: { x: 550, y: 350 },
    },
    {
      id: 19,
      type: "resource",
      label: "Communication",
      description: "Learn effective communication skills",
      points: 5,
      color: "#F5DF4D",
      position: { x: 550, y: 450 },
    },
  ];

  // Content for different space types
  const actionContent: ActionContent = {
    emotion: [
      {
        title: "Understanding Anxiety",
        descriptions: [
          "Anxiety is a normal emotion that everyone experiences at times.",
          "It's your body's natural response to stress.",
        ],
        reflections: [
          "When was the last time you felt anxious?",
          "What physical sensations do you notice when you're anxious?",
          "What helps you feel calmer when you're anxious?",
        ],
      },
      {
        title: "Managing Anger",
        descriptions: [
          "Anger is a natural emotion that signals when something feels unfair or threatening.",
          "Learning to express anger appropriately is an important skill.",
        ],
        reflections: [
          "What triggers your anger?",
          "How do you typically express anger?",
          "What are healthier ways you could express your feelings when angry?",
        ],
      },
      {
        title: "Finding Joy",
        descriptions: [
          "Joy comes from noticing and appreciating positive experiences.",
          "Small moments of joy can have a big impact on your wellbeing.",
        ],
        reflections: [
          "What brought you joy today?",
          "What activities reliably bring you happiness?",
          "How could you incorporate more joy into your daily routine?",
        ],
      },
      {
        title: "Processing Sadness",
        descriptions: [
          "Sadness is a normal response to loss or disappointment.",
          "Allowing yourself to feel sad is an important part of emotional health.",
        ],
        reflections: [
          "How do you typically respond when you feel sad?",
          "Who can you talk to when you're feeling down?",
          "What self-care activities help when you're feeling sad?",
        ],
      },
    ],
    challenge: [
      {
        title: "Deep Breathing Exercise",
        descriptions: [
          "Deep breathing activates your parasympathetic nervous system, which helps reduce stress.",
        ],
        tasks: [
          "Breathe in slowly through your nose for 4 counts.",
          "Hold your breath for 2 counts.",
          "Exhale slowly through your mouth for 6 counts.",
          "Repeat this cycle 5 times.",
        ],
      },
      {
        title: "Mindfulness Practice",
        descriptions: [
          "Mindfulness means paying attention to the present moment without judgment.",
        ],
        tasks: [
          "Take 3 minutes to focus completely on your surroundings.",
          "Notice 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
          "When your mind wanders, gently bring it back to your senses.",
        ],
      },
      {
        title: "Gratitude Practice",
        descriptions: [
          "Practicing gratitude regularly can improve your mood and outlook on life.",
        ],
        tasks: [
          "Write down 3 things you're grateful for right now.",
          "Include one person, one opportunity, and one quality about yourself.",
          "Take a moment to really feel the gratitude for each item.",
        ],
      },
      {
        title: "Self-Compassion Exercise",
        descriptions: [
          "Self-compassion means treating yourself with the same kindness you would show a good friend.",
        ],
        tasks: [
          "Think of a recent mistake or setback.",
          "Imagine what you would say to a friend in the same situation.",
          "Now say those same supportive words to yourself.",
          "Place a hand on your heart and take a deep breath.",
        ],
      },
    ],
    reflection: [
      {
        title: "Examining Self-Talk",
        descriptions: [
          "The way you talk to yourself affects how you feel and what you believe is possible.",
        ],
        questions: [
          "What negative things do you often say to yourself?",
          "How would you feel if someone else spoke to you this way?",
          "How could you reframe these statements to be more supportive?",
        ],
      },
      {
        title: "Clarifying Values",
        descriptions: [
          "Values are the principles that guide your decisions and actions.",
        ],
        questions: [
          "What matters most to you in life?",
          "When do you feel most fulfilled?",
          "What kind of person do you want to be?",
        ],
      },
      {
        title: "Setting Meaningful Goals",
        descriptions: [
          "Goals that align with your values give direction and purpose to your life.",
        ],
        questions: [
          "What's one goal you'd like to accomplish in the next month?",
          "How does this goal connect to your values?",
          "What small steps could you take toward this goal?",
        ],
      },
      {
        title: "Recognizing Strengths",
        descriptions: [
          "Everyone has unique strengths and qualities that can help them overcome challenges.",
        ],
        questions: [
          "What are three of your personal strengths?",
          "When have you used these strengths successfully?",
          "How could these strengths help you with current challenges?",
        ],
      },
    ],
    resource: [
      {
        title: "Coping Skills Toolkit",
        descriptions: [
          "Having multiple coping skills helps you handle different types of stress.",
        ],
        tips: [
          "For physical tension: Progressive muscle relaxation or exercise",
          "For racing thoughts: Journaling or talking to someone",
          "For overwhelming emotions: Grounding techniques or creative expression",
          "For social stress: Setting boundaries or practicing assertive communication",
        ],
      },
      {
        title: "Building a Support System",
        descriptions: [
          "A strong support system is essential for mental well-being.",
        ],
        tips: [
          "Identify trusted adults you can talk to about serious concerns.",
          "Nurture friendships with peers who accept and support you.",
          "Know when and how to access professional help when needed.",
          "Remember that reaching out for help is a sign of strength, not weakness.",
        ],
      },
      {
        title: "Developing Healthy Habits",
        descriptions: [
          "Daily habits have a powerful impact on your mental health.",
        ],
        tips: [
          "Aim for 8-10 hours of sleep each night.",
          "Stay hydrated and eat regular, balanced meals.",
          "Get at least 30 minutes of physical activity daily.",
          "Take breaks from social media and screens.",
        ],
      },
      {
        title: "Effective Communication Skills",
        descriptions: [
          "Good communication helps build stronger relationships and resolve conflicts.",
        ],
        tips: [
          "Use \"I\" statements to express your feelings without blaming others.",
          "Practice active listening without planning your response.",
          "Be aware of your body language and tone of voice.",
          "It's okay to take a break when emotions are running high.",
        ],
      },
    ],
    bonus: [
      {
        title: "Self-Care Superstar",
        descriptions: [
          "Taking care of yourself isn't selfish—it's necessary for your well-being.",
        ],
        rewards: [
          "You've earned 15 resilience points!",
          "Challenge: Create a personalized self-care menu with activities for different situations.",
          "Remember that consistent small acts of self-care are more effective than occasional big ones.",
        ],
      },
      {
        title: "Resilience Champion",
        descriptions: [
          "Resilience is the ability to bounce back from difficulties and grow from challenges.",
        ],
        rewards: [
          "You've earned 15 resilience points!",
          "Challenge: Reflect on a past difficulty and identify how it helped you grow stronger.",
          "Your resilience is like a muscle that gets stronger each time you use it.",
        ],
      },
      {
        title: "Confidence Builder",
        descriptions: [
          "Confidence comes from recognizing your worth and believing in your abilities.",
        ],
        rewards: [
          "You've earned 15 resilience points!",
          "Challenge: Do one thing outside your comfort zone this week.",
          "Remember that confidence grows with practice and experience.",
        ],
      },
    ],
  };

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUserId(data.session.user.id);
      }
    };
    checkAuth();
  }, []);

  // Roll the dice
  const rollDice = () => {
    if (isRolling) return;

    setIsRolling(true);
    setActionCompleted(false);

    // Animate dice roll
    let rollCount = 0;
    const maxRolls = 10;
    const rollInterval = setInterval(() => {
      setDiceRoll(Math.floor(Math.random() * 6) + 1);
      rollCount++;

      if (rollCount >= maxRolls) {
        clearInterval(rollInterval);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setDiceRoll(finalRoll);
        setIsRolling(false);

        // Move player
        movePlayer(finalRoll);
      }
    }, 100);
  };

  // Move player token
  const movePlayer = (steps: number) => {
    setPlayerTokens((prevTokens) => {
      const updatedTokens = [...prevTokens];
      const player = { ...updatedTokens[currentPlayerIndex] };
      player.position = (player.position + steps) % spaces.length;
      updatedTokens[currentPlayerIndex] = player;

      // Get the space player landed on
      const landedSpace = spaces[player.position];
      setCurrentSpace(landedSpace);
      setGameState("action");

      return updatedTokens;
    });
  };

  // Handle space action completion
  const completeAction = () => {
    if (!currentSpace) return;

    // Award points based on space type
    setPlayerTokens((prevTokens) => {
      const updatedTokens = [...prevTokens];
      const player = { ...updatedTokens[currentPlayerIndex] };

      // Add points based on space type
      if (currentSpace.points) {
        player.points += currentSpace.points;
      }

      // Mark challenge as completed
      if (!player.completedChallenges.includes(currentSpace.id)) {
        player.completedChallenges = [...player.completedChallenges, currentSpace.id];
      }

      updatedTokens[currentPlayerIndex] = player;

      // Save progress if logged in
      if (userId) {
        const saveGameProgress = async () => {
          try {
            const { error } = await supabase.from("user_progress").upsert({
              user_id: userId,
              game_type: "emotion_quest",
              score: player.points,
              completed_challenges: player.completedChallenges,
              last_played_at: new Date().toISOString(),
            });

            if (error) {
              console.error("Error saving progress:", error);
            }
          } catch (err) {
            console.error("Failed to save progress:", err);
          }
        };

        saveGameProgress();
      }

      return updatedTokens;
    });

    // Check if game should end (completed full circuit or reached point threshold)
    const currentPlayer = playerTokens[currentPlayerIndex];
    if (
      currentPlayer.completedChallenges.length >= spaces.length / 2 ||
      currentPlayer.points >= 100
    ) {
      setGameState("completed");
      
      // Generate completion message
      const points = currentPlayer.points;
      let message = "";
      
      if (points >= 100) {
        message = "Outstanding achievement! You've mastered emotional resilience skills!";
      } else if (points >= 75) {
        message = "Great job! You're developing strong emotional intelligence!";
      } else if (points >= 50) {
        message = "Well done! You're building valuable resilience skills!";
      } else {
        message = "Good start! Continue your journey to emotional resilience!";
      }
      
      setGameCompletionMessage(message);
      
      // Save game completion if logged in
      if (userId) {
        const saveGameResult = async () => {
          try {
            await supabase.from("user_progress").upsert({
              user_id: userId,
              game_type: "emotion_quest",
              score: currentPlayer.points,
              completed_challenges: currentPlayer.completedChallenges,
              completed: true,
              last_played_at: new Date().toISOString(),
            });
          } catch (err) {
            console.error("Failed to save game result:", err);
          }
        };
        
        saveGameResult();
      }
    } else {
      setActionCompleted(true);
      setGameState("rolling");
    }

    toast({
      title: "Action Completed!",
      description: `You earned ${currentSpace.points || 0} resilience points!`,
    });
  };

  // Reset game
  const resetGame = () => {
    setGameState("setup");
    setPlayerTokens([
      {
        id: 1,
        position: 0,
        color: "#3DFDFF",
        points: 0,
        name: playerName || "Player 1",
        completedChallenges: [],
      },
    ]);
    setCurrentPlayerIndex(0);
    setDiceRoll(null);
    setCurrentSpace(null);
    setActionCompleted(false);
  };

  // Start game with player name
  const startGame = () => {
    if (playerName.trim() === "") {
      setPlayerName("Player 1");
    }
    
    setPlayerTokens([
      {
        id: 1,
        position: 0,
        color: "#3DFDFF",
        points: 0,
        name: playerName || "Player 1",
        completedChallenges: [],
      },
    ]);
    
    setGameState("rolling");
  };

  // Render dice based on current roll
  const renderDice = () => {
    if (diceRoll === null) return null;

    const DiceIcon = {
      1: Dice1,
      2: Dice2,
      3: Dice3,
      4: Dice4,
      5: Dice5,
      6: Dice6,
    }[diceRoll];

    return (
      <div className="flex justify-center my-4">
        <motion.div
          animate={{ rotate: isRolling ? 360 : 0 }}
          transition={{ duration: 0.5, repeat: isRolling ? Infinity : 0 }}
          className="bg-white p-4 rounded-lg shadow-md"
        >
          <DiceIcon size={48} className="text-[#FF8A48]" />
        </motion.div>
      </div>
    );
  };

  // Render content based on space type
  const renderSpaceContent = () => {
    if (!currentSpace) return null;

    let content;
    let contentIndex = 0;

    // Determine which content to show based on space type and id
    if (currentSpace.type !== "start") {
      // Map space id to content index
      const typeSpaces = spaces.filter((s) => s.type === currentSpace.type);
      contentIndex = typeSpaces.findIndex((s) => s.id === currentSpace.id) % 4;
      contentIndex = contentIndex >= 0 ? contentIndex : 0;
    }

    switch (currentSpace.type) {
      case "start":
        content = (
          <div className="text-center p-4">
            <h3 className="text-xl font-bold mb-4">Begin Your Journey!</h3>
            <p>
              Welcome to Emotion Quest! Roll the dice to move around the board and
              explore different emotional intelligence and resilience activities.
            </p>
          </div>
        );
        break;
      case "emotion":
        const emotionContent = actionContent.emotion[contentIndex];
        content = (
          <div className="p-4">
            <h3 className="text-xl font-bold mb-4 text-[#FC68B3]">
              {emotionContent.title}
            </h3>
            {emotionContent.descriptions.map((desc, i) => (
              <p key={i} className="mb-2">
                {desc}
              </p>
            ))}
            <div className="mt-4 bg-[#FC68B3]/10 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Reflection Questions:</h4>
              <ul className="list-disc pl-5">
                {emotionContent.reflections.map((reflection, i) => (
                  <li key={i} className="mb-1">
                    {reflection}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
        break;
      case "challenge":
        const challengeContent = actionContent.challenge[contentIndex];
        content = (
          <div className="p-4">
            <h3 className="text-xl font-bold mb-4 text-[#FF8A48]">
              {challengeContent.title}
            </h3>
            {challengeContent.descriptions.map((desc, i) => (
              <p key={i} className="mb-2">
                {desc}
              </p>
            ))}
            <div className="mt-4 bg-[#FF8A48]/10 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Challenge Steps:</h4>
              <ol className="list-decimal pl-5">
                {challengeContent.tasks.map((task, i) => (
                  <li key={i} className="mb-1">
                    {task}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        );
        break;
      case "reflection":
        const reflectionContent = actionContent.reflection[contentIndex];
        content = (
          <div className="p-4">
            <h3 className="text-xl font-bold mb-4 text-[#3DFDFF]">
              {reflectionContent.title}
            </h3>
            {reflectionContent.descriptions.map((desc, i) => (
              <p key={i} className="mb-2">
                {desc}
              </p>
            ))}
            <div className="mt-4 bg-[#3DFDFF]/10 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Reflect on:</h4>
              <ul className="list-disc pl-5">
                {reflectionContent.questions.map((question, i) => (
                  <li key={i} className="mb-1">
                    {question}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
        break;
      case "resource":
        const resourceContent = actionContent.resource[contentIndex];
        content = (
          <div className="p-4">
            <h3 className="text-xl font-bold mb-4 text-[#F5DF4D]">
              {resourceContent.title}
            </h3>
            {resourceContent.descriptions.map((desc, i) => (
              <p key={i} className="mb-2">
                {desc}
              </p>
            ))}
            <div className="mt-4 bg-[#F5DF4D]/10 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Helpful Tips:</h4>
              <ul className="list-disc pl-5">
                {resourceContent.tips.map((tip, i) => (
                  <li key={i} className="mb-1">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
        break;
      case "bonus":
        const bonusContent = actionContent.bonus[contentIndex];
        content = (
          <div className="p-4">
            <h3 className="text-xl font-bold mb-4 text-[#D5D5F1]">
              {bonusContent.title}
            </h3>
            {bonusContent.descriptions.map((desc, i) => (
              <p key={i} className="mb-2">
                {desc}
              </p>
            ))}
            <div className="mt-4 bg-[#D5D5F1]/10 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Bonus Reward:</h4>
              <ul className="list-disc pl-5">
                {bonusContent.rewards.map((reward, i) => (
                  <li key={i} className="mb-1">
                    {reward}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
        break;
      default:
        content = <div>Unknown space type</div>;
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>{currentSpace.label}</CardTitle>
          <CardDescription>{currentSpace.description}</CardDescription>
        </CardHeader>
        <CardContent>{content}</CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={completeAction} 
            className="bg-[#FF8A48] hover:bg-[#FF8A48]/80"
          >
            Complete Activity
          </Button>
        </CardFooter>
      </Card>
    );
  };

  // Game setup screen
  if (gameState === "setup") {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Emotion Quest</CardTitle>
            <CardDescription className="text-center">
              A board game journey to emotional resilience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                Emotion Quest is a board game designed to help build emotional
                intelligence and resilience skills. Roll the dice, move around the board,
                and complete activities to earn resilience points!
              </p>
              <div className="mt-4">
                <label htmlFor="playerName" className="block text-sm font-medium mb-1">
                  Your Name:
                </label>
                <input
                  type="text"
                  id="playerName"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              onClick={startGame}
              className="bg-[#FC68B3] hover:bg-[#FC68B3]/80"
            >
              Start Game
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Game completed screen
  if (gameState === "completed") {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center text-2xl flex items-center justify-center">
              <Trophy className="mr-2 text-[#F5DF4D]" /> Game Completed!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-xl mb-4">
              Congratulations, {playerTokens[currentPlayerIndex].name}!
            </p>
            <p className="mb-4">{gameCompletionMessage}</p>
            <div className="bg-[#3DFDFF]/10 p-4 rounded-lg mb-6">
              <p className="font-bold text-lg">
                Final Score: {playerTokens[currentPlayerIndex].points} Resilience Points
              </p>
              <p>
                Challenges Completed: {playerTokens[currentPlayerIndex].completedChallenges.length}
              </p>
            </div>
            <p>
              Remember that emotional resilience is a skill that grows with practice.
              Continue to use these strategies in your daily life!
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              onClick={resetGame}
              className="bg-[#FF8A48] hover:bg-[#FF8A48]/80"
            >
              Play Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Main game screen
  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Game header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            Emotion Quest
            <span className="ml-2 text-sm bg-[#3DFDFF]/20 px-2 py-1 rounded">
              Building Resilience
            </span>
          </h2>
        </div>
        <div className="flex items-center mt-2 md:mt-0">
          <div className="flex items-center mr-4">
            <User className="mr-1 h-4 w-4" />
            <span className="font-medium">
              {playerTokens[currentPlayerIndex].name}
            </span>
          </div>
          <div className="flex items-center bg-[#FC68B3]/10 px-3 py-1 rounded-full">
            <Trophy className="mr-1 h-4 w-4 text-[#FC68B3]" />
            <span className="font-medium">
              {playerTokens[currentPlayerIndex].points} Points
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game board */}
        <div className="lg:col-span-2">
          <EmotionQuestBoard
            spaces={spaces}
            playerTokens={playerTokens}
            currentPlayerIndex={currentPlayerIndex}
            onLandOnSpace={() => {}}
            className="mb-4"
          />
        </div>

        {/* Game controls and information */}
        <div className="space-y-4">
          {gameState === "rolling" && (
            <Card>
              <CardHeader>
                <CardTitle>Your Turn</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Roll the dice to move around the board!</p>
                {renderDice()}
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button
                  onClick={rollDice}
                  disabled={isRolling}
                  className="bg-[#3DFDFF] hover:bg-[#3DFDFF]/80 text-[#1A1F2C]"
                >
                  Roll Dice
                </Button>
              </CardFooter>
            </Card>
          )}

          {gameState === "action" && currentSpace && renderSpaceContent()}

          {/* Player progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Progress Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <div>
                  <span className="font-medium">Spaces Visited:</span>{" "}
                  {playerTokens[currentPlayerIndex].completedChallenges.length}
                </div>
                <div>
                  <span className="font-medium">Current Position:</span>{" "}
                  {spaces[playerTokens[currentPlayerIndex].position].label}
                </div>
                <div>
                  <span className="font-medium">Resilience Points:</span>{" "}
                  {playerTokens[currentPlayerIndex].points}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmotionQuestGame;

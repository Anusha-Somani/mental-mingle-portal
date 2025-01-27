import { useState, useEffect } from "react";
import { Send, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";

type Message = {
  text: string;
  isUser: boolean;
  timestamp: string;
};

type MoodEntry = {
  mood: string;
  timestamp: string;
  note: string;
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi! I'm here to listen and help. How are you feeling today? You can also type 'track mood' to log your mood or 'tips' for confidence-building advice!",
      isUser: false,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [showMoodTracker, setShowMoodTracker] = useState(false);

  const confidenceTips = [
    "Remember that everyone has unique strengths. What's one thing you're proud of?",
    "Try setting small, achievable goals each day. Success builds confidence!",
    "Practice positive self-talk. Replace 'I can't' with 'I'm learning to'.",
    "Celebrate your small wins - they add up to big achievements!",
    "Remember that mistakes are opportunities to learn and grow.",
    "Take care of your body with exercise and good sleep - it boosts confidence!",
    "Write down three things you're grateful for each day.",
    "Help others - it reminds you of your own value and capabilities.",
  ];

  const getMentalHealthResponse = (userMessage: string) => {
    const lowercaseMessage = userMessage.toLowerCase();
    
    if (lowercaseMessage === "track mood") {
      setShowMoodTracker(true);
      return "Let's track your mood! How are you feeling right now? (Type: great, good, okay, down, or struggling)";
    }

    if (lowercaseMessage === "tips") {
      return confidenceTips[Math.floor(Math.random() * confidenceTips.length)];
    }

    if (showMoodTracker && ["great", "good", "okay", "down", "struggling"].includes(lowercaseMessage)) {
      const newMoodEntry: MoodEntry = {
        mood: lowercaseMessage,
        timestamp: new Date().toLocaleTimeString(),
        note: "",
      };
      setMoodHistory([...moodHistory, newMoodEntry]);
      setShowMoodTracker(false);
      return `Thanks for sharing! I've recorded that you're feeling ${lowercaseMessage}. Remember, your feelings are valid, and it's okay to have ups and downs. Would you like a confidence-building tip? Just type 'tips'!`;
    }
    
    if (lowercaseMessage.includes("anxious") || lowercaseMessage.includes("anxiety")) {
      return "I understand that anxiety can be overwhelming. Would you like to try a quick breathing exercise together? Also, remember that feeling anxious doesn't diminish your worth - you're stronger than you think!";
    }
    if (lowercaseMessage.includes("sad") || lowercaseMessage.includes("depressed")) {
      return "I'm sorry you're feeling this way. Would you like to talk about what's troubling you? Sometimes sharing our feelings can help. Remember, this feeling is temporary, and you have overcome difficult times before.";
    }
    if (lowercaseMessage.includes("stress") || lowercaseMessage.includes("stressed")) {
      return "Stress can be really challenging. Would you like to explore some stress management techniques together? Remember, facing stress means you're pushing yourself to grow - that's admirable!";
    }
    if (lowercaseMessage.includes("happy") || lowercaseMessage.includes("good")) {
      return "I'm glad you're feeling positive! Would you like to share what's making you feel good today? These moments are great to reflect on when you need a confidence boost!";
    }
    return "Thank you for sharing. Could you tell me more about how that makes you feel? Remember, expressing your feelings is a sign of strength!";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = {
        text: getMentalHealthResponse(input),
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  useEffect(() => {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      <div className="bg-primary/10 p-4 flex justify-between items-center">
        <h3 className="font-semibold">Mental Health Support</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowMoodTracker(true)}
          className="flex items-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          Track Mood
        </Button>
      </div>
      <div 
        id="chat-container"
        className="flex-1 p-4 overflow-y-auto space-y-4"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isUser
                  ? "bg-primary text-white"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              <div className="text-sm">{message.text}</div>
              <div className="text-xs mt-1 opacity-70">{message.timestamp}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-secondary text-secondary-foreground max-w-[80%] p-3 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message... (try 'tips' or 'track mood')"
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSend}
            className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
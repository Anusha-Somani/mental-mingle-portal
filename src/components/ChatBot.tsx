import { useState, useEffect } from "react";
import { Send } from "lucide-react";

type Message = {
  text: string;
  isUser: boolean;
  timestamp: string;
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi! I'm here to listen and help. How are you feeling today?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const getMentalHealthResponse = (userMessage: string) => {
    const lowercaseMessage = userMessage.toLowerCase();
    
    if (lowercaseMessage.includes("anxious") || lowercaseMessage.includes("anxiety")) {
      return "I understand that anxiety can be overwhelming. Would you like to try a quick breathing exercise together?";
    }
    if (lowercaseMessage.includes("sad") || lowercaseMessage.includes("depressed")) {
      return "I'm sorry you're feeling this way. Would you like to talk about what's troubling you? Sometimes sharing our feelings can help.";
    }
    if (lowercaseMessage.includes("stress") || lowercaseMessage.includes("stressed")) {
      return "Stress can be really challenging. Would you like to explore some stress management techniques together?";
    }
    if (lowercaseMessage.includes("happy") || lowercaseMessage.includes("good")) {
      return "I'm glad you're feeling positive! Would you like to share what's making you feel good today?";
    }
    return "Thank you for sharing. Could you tell me more about how that makes you feel?";
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

    // Simulate bot thinking and typing
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
    // Scroll to bottom when new messages arrive
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
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
            placeholder="Type your message..."
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
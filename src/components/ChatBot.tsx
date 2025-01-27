import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const ChatBot = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/auth';
        return;
      }
      createConversation(session.user.id);
    };
    
    checkSession();
  }, []);

  const createConversation = async (userId: string) => {
    const { data, error } = await supabase
      .from("conversations")
      .insert([{
        user_id: userId,
        title: "New Conversation"
      }])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create conversation",
        variant: "destructive",
      });
      return;
    }

    setConversationId(data.id);
    
    // Add initial bot message
    const { error: messageError } = await supabase
      .from("chat_messages")
      .insert([
        {
          message: "Hi! I'm here to listen and help. How are you feeling today?",
          is_bot: true,
          conversation_id: data.id,
          user_id: userId
        },
      ]);

    if (!messageError) {
      setMessages([
        {
          text: "Hi! I'm here to listen and help. How are you feeling today?",
          isUser: false,
        },
      ]);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !conversationId) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = '/auth';
      return;
    }

    // Add user message to UI
    setMessages((prev) => [...prev, { text: input, isUser: true }]);
    
    // Store user message in database
    const { error: userMessageError } = await supabase
      .from("chat_messages")
      .insert([
        {
          message: input,
          is_bot: false,
          conversation_id: conversationId,
          user_id: session.user.id
        },
      ]);

    if (userMessageError) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      return;
    }

    setInput("");

    try {
      // Get AI response
      const response = await fetch("/functions/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          message: input,
          conversationId,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Add bot response to UI
      setMessages((prev) => [...prev, { text: data.message, isUser: false }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.isUser ? "flex justify-end" : "flex justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isUser
                  ? "bg-primary text-white"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
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
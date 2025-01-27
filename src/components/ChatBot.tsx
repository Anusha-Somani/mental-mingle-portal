import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import ChatMessages from "./chat/ChatMessages";
import ChatInput from "./chat/ChatInput";

const ChatBot = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const createInitialConversation = async () => {
      // Create a new conversation without requiring auth for now
      const { data, error } = await supabase
        .from("conversations")
        .insert([{
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
            conversation_id: data.id
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
    
    createInitialConversation();
  }, [toast]);

  const handleSend = async () => {
    if (!input.trim() || !conversationId) return;

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
      // Get AI response using Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('chat', {
        body: {
          message: input,
          conversationId,
        },
      });

      if (error) {
        throw error;
      }

      // Add bot response to UI
      setMessages((prev) => [...prev, { text: data.message, isUser: false }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      <ChatMessages messages={messages} />
      <ChatInput input={input} setInput={setInput} handleSend={handleSend} />
    </div>
  );
};

export default ChatBot;
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
    const loadOrCreateConversation = async () => {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      // Try to find an existing conversation for the user
      const { data: existingConversations, error: fetchError } = await supabase
        .from("conversations")
        .select("id")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") { // PGRST116 is "no rows returned"
        toast({
          title: "Error",
          description: "Failed to fetch conversation history",
          variant: "destructive",
        });
        return;
      }

      let currentConversationId;

      if (!existingConversations) {
        // Create a new conversation
        const { data: newConversation, error: createError } = await supabase
          .from("conversations")
          .insert([{
            title: "New Conversation",
            user_id: userId
          }])
          .select()
          .single();

        if (createError) {
          toast({
            title: "Error",
            description: "Failed to create conversation",
            variant: "destructive",
          });
          return;
        }

        currentConversationId = newConversation.id;

        // Add initial bot message
        const { error: messageError } = await supabase
          .from("chat_messages")
          .insert([
            {
              message: "Hi! I'm here to listen and help. How are you feeling today?",
              is_bot: true,
              conversation_id: currentConversationId,
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
      } else {
        currentConversationId = existingConversations.id;

        // Load existing messages
        const { data: existingMessages, error: messagesError } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("conversation_id", currentConversationId)
          .order("created_at", { ascending: true });

        if (messagesError) {
          toast({
            title: "Error",
            description: "Failed to load message history",
            variant: "destructive",
          });
          return;
        }

        if (existingMessages) {
          setMessages(
            existingMessages.map((msg) => ({
              text: msg.message,
              isUser: !msg.is_bot,
            }))
          );
        }
      }

      setConversationId(currentConversationId);
    };
    
    loadOrCreateConversation();
  }, [toast]);

  const handleSend = async () => {
    if (!input.trim() || !conversationId) return;

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

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
          user_id: userId
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
          userId
        },
      });

      if (error) {
        throw error;
      }

      // Add bot response to UI
      setMessages((prev) => [...prev, { text: data.message, isUser: false }]);

      // Store bot response in database
      await supabase
        .from("chat_messages")
        .insert([
          {
            message: data.message,
            is_bot: true,
            conversation_id: conversationId,
            user_id: userId
          },
        ]);
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
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, conversationId } = await req.json();
    console.log('Received message:', message);
    console.log('Conversation ID:', conversationId);

    // Get relevant knowledge base entries
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { data: knowledgeBase, error: knowledgeBaseError } = await supabaseClient
      .from('knowledge_base')
      .select('content')
      .limit(5);

    if (knowledgeBaseError) {
      console.error('Error fetching knowledge base:', knowledgeBaseError);
      throw new Error('Failed to fetch knowledge base');
    }

    const contextPrompt = knowledgeBase?.map(k => k.content).join('\n') || '';
    console.log('Context prompt prepared');

    // Generate AI response using OpenAI
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using the recommended smaller model
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant. Use this knowledge base information to inform your responses: ${contextPrompt}`,
          },
          { role: 'user', content: message },
        ],
        max_tokens: 500,
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const aiResponse = await openAIResponse.json();
    console.log('Received AI response');

    const botMessage = aiResponse.choices[0].message.content;

    // Store the bot's response in the database
    const { error: insertError } = await supabaseClient
      .from('chat_messages')
      .insert([
        {
          message: botMessage,
          is_bot: true,
          conversation_id: conversationId,
        },
      ]);

    if (insertError) {
      console.error('Error storing bot message:', insertError);
      throw new Error('Failed to store bot message');
    }

    return new Response(
      JSON.stringify({ message: botMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
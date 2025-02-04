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

    // Generate embedding for the user's message
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: message,
      }),
    });

    if (!embeddingResponse.ok) {
      const error = await embeddingResponse.json();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const {
      data: [{ embedding }],
    } = await embeddingResponse.json();

    // Search for relevant content in the knowledge base
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { data: relevantContent, error: searchError } = await supabaseClient.rpc(
      'match_embeddings',
      {
        query_embedding: embedding,
        match_threshold: 0.7,
        match_count: 5,
      }
    );

    if (searchError) {
      console.error('Error searching embeddings:', searchError);
      throw new Error('Failed to search knowledge base');
    }

    // Prepare context from relevant content
    const context = relevantContent
      ?.map((item: any) => item.content)
      .join('\n\n');

    // Generate AI response using OpenAI
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant. Use this knowledge base information to inform your responses: ${context}`,
          },
          { role: 'user', content: message },
        ],
        max_tokens: 500,
      }),
    });

    if (!openAIResponse.ok) {
      const error = await openAIResponse.json();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
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
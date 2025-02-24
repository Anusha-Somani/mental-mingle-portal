import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TriggerWord {
  word: string;
  severity: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, conversationId, userId } = await req.json();
    console.log('Received message:', message);

    // First, get relevant context from our embeddings
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

    const embeddingData = await embeddingResponse.json();
    const embedding = embeddingData.data[0].embedding;

    // Query for similar content
    const { data: similarContent } = await supabaseAdmin.rpc(
      'match_embeddings',
      {
        query_embedding: embedding,
        match_threshold: 0.7,
        match_count: 5,
      }
    );

    // Prepare context from similar content
    const context = similarContent
      ? similarContent.map(item => item.content).join('\n\n')
      : '';

    // Check trigger words
    const { data: triggerWords, error: triggerError } = await supabaseAdmin
      .from('trigger_words')
      .select('word, severity');

    if (triggerError) {
      console.error('Error fetching trigger words:', triggerError);
      throw new Error('Failed to fetch trigger words');
    }

    let maxSeverity = 0;
    if (triggerWords) {
      for (const { word, severity } of triggerWords) {
        if (message.toLowerCase().includes(word.toLowerCase())) {
          maxSeverity = Math.max(maxSeverity, severity);
        }
      }
    }

    if (maxSeverity >= 7) {
      const { data: conversation, error: conversationError } = await supabaseAdmin
        .from('conversations')
        .select('title')
        .eq('id', conversationId)
        .single();

      if (conversationError) {
        console.error('Error fetching conversation:', conversationError);
        throw new Error('Failed to fetch conversation');
      }

      const { data: user, error: userError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) {
        console.error('Error fetching user:', userError);
        throw new Error('Failed to fetch user');
      }

      const { data: counselorEmails, error: counselorError } = await supabaseAdmin
        .from('counselors')
        .select('email')
        .eq('school_id', '79a49af4-5419-4551-8a7a-544041301493');

      if (counselorError) {
        console.error('Error fetching counselors:', counselorError);
        throw new Error('Failed to fetch counselors');
      }

      if (counselorEmails && counselorEmails.length > 0) {
        for (const counselor of counselorEmails) {
          try {
            await resend.emails.send({
              from: "Mindvincible <onboarding@resend.dev>",
              to: [counselor.email],
              subject: "High Severity Alert",
              html: `
                <p>A user has triggered a high severity alert.</p>
                <p>Conversation: ${conversation?.title}</p>
                <p>User ID: ${userId}</p>
                <p>User Type: ${user?.user_type}</p>
                <p>Message: ${message}</p>
              `,
            });
            console.log(`Email sent to ${counselor.email}`);
          } catch (resendError) {
            console.error("Error sending email:", resendError);
          }
        }
      }
    }

    // Generate AI response with context
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
            content: `You are a supportive and empathetic AI assistant. Use the following context to inform your responses, but maintain a natural conversational tone. If users express thoughts of self-harm or severe distress, acknowledge their feelings and encourage them to seek help from their school counselor or a mental health professional. Provide the suicide prevention hotline number (988) when appropriate.\n\nContext:\n${context}`
          },
          { role: 'user', content: message }
        ],
      }),
    });

    const aiResponse = await openAIResponse.json();
    const botMessage = aiResponse.choices[0].message.content;

    return new Response(
      JSON.stringify({ message: botMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

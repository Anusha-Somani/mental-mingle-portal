
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

    // Get all trigger words from the database
    const { data: triggerWords, error: triggerError } = await supabaseAdmin
      .from('trigger_words')
      .select('word, severity');

    if (triggerError) {
      console.error('Error fetching trigger words:', triggerError);
      throw new Error('Failed to fetch trigger words');
    }

    // Check if message contains any trigger words
    const foundTriggers = (triggerWords as TriggerWord[]).filter(tw => 
      message.toLowerCase().includes(tw.word.toLowerCase())
    );

    if (foundTriggers.length > 0) {
      console.log('Found trigger words:', foundTriggers);

      // Get user details
      const { data: userData, error: userError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError);
        throw new Error('Failed to fetch user data');
      }

      // Get active counselors
      const { data: counselors, error: counselorError } = await supabaseAdmin
        .from('counselors')
        .select('*')
        .eq('is_active', true);

      if (counselorError) {
        console.error('Error fetching counselors:', counselorError);
        throw new Error('Failed to fetch counselors');
      }

      // Send notification to each counselor
      for (const counselor of counselors) {
        try {
          await resend.emails.send({
            from: "MindVincible Alert <alerts@yourdomain.com>",
            to: [counselor.email],
            subject: "Urgent: Student Support Required",
            html: `
              <h1>Student Support Alert</h1>
              <p>A student has used concerning language in their chat that requires immediate attention.</p>
              <h2>Details:</h2>
              <ul>
                <li><strong>Trigger Words Detected:</strong> ${foundTriggers.map(t => t.word).join(', ')}</li>
                <li><strong>Severity Level:</strong> ${Math.max(...foundTriggers.map(t => t.severity))}</li>
                <li><strong>Message:</strong> "${message}"</li>
                <li><strong>Conversation ID:</strong> ${conversationId}</li>
              </ul>
              <p>Please review this conversation and take appropriate action according to your protocols.</p>
            `,
          });
          console.log(`Notification sent to counselor: ${counselor.email}`);
        } catch (emailError) {
          console.error(`Failed to send email to ${counselor.email}:`, emailError);
        }
      }
    }

    // Generate AI response
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
            content: 'You are a supportive and empathetic AI assistant. If users express thoughts of self-harm or severe distress, acknowledge their feelings and encourage them to seek help from their school counselor or a mental health professional. Provide the suicide prevention hotline number (988) when appropriate.'
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

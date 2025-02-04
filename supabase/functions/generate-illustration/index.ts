import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Generate two illustrations - one featuring a feminine figure and one masculine
    const prompts = [
      `Create an illustration of a peaceful teenage girl with long flowing hair, 
      in a minimalist, modern illustration style. She should be wearing a soft yellow sweater 
      and be surrounded by small green plants and yellow flowers. The background should be light 
      and airy. The style should be gentle and supportive, similar to modern vector illustrations 
      with clean lines and simple shapes. The illustration should convey growth and positivity.`,
      
      `Create an illustration of a peaceful teenage boy with a gentle expression, 
      in the same minimalist, modern illustration style. He should be wearing a soft green sweater 
      and be surrounded by yellow flowers and green leaves. The background should be light and airy, 
      matching the first illustration. Use the same gentle and supportive style with clean lines 
      and simple shapes. The illustration should convey growth and positivity.`
    ];

    const illustrations = await Promise.all(prompts.map(async (prompt) => {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          response_format: "url",
        }),
      });

      const data = await response.json();
      return data;
    }));

    return new Response(
      JSON.stringify({ data: [
        { url: illustrations[0].data[0].url },
        { url: illustrations[1].data[0].url }
      ]}),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error generating illustrations:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
});
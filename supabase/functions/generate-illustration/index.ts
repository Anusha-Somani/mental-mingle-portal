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
    const prompt = `Create a peaceful illustration in a modern, minimalist style with soft, flowing shapes. 
    Include gentle curves representing a cloud-like formation in soft pink (#FFD9E6), surrounded by delicate 
    flowers in soft yellow (#FEF7CD) and white daisies. Add small green leaves (#F2FCE2) scattered throughout. 
    The style should be similar to a hand-drawn illustration with clean lines and organic shapes, 
    focusing on mental wellness and tranquility. The background must be completely transparent. 
    The illustration should feel light, airy, and calming, perfect for a mental health and wellness application. 
    Use only soft, muted colors: pink (#FFD9E6), yellow (#FEF7CD), and sage green (#F2FCE2). 
    The composition should be balanced and flowing, similar to a modern botanical illustration 
    but more abstract and peaceful. IMPORTANT: The background must be completely transparent, 
    not white or any other color.`;

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
    console.log('Generated illustration data:', data);
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    return new Response(
      JSON.stringify({ data: [{ url: data.data[0].url }] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating illustration:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
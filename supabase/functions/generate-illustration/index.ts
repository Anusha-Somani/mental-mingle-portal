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
    const prompt = `Create a vibrant and fun illustration of a brain blooming with flowers in a modern, 
    whimsical style. The brain should be in a soft magenta pink (#D946EF) with gentle curves and a playful, 
    abstract design. Surround it with bright, cheerful flowers in vivid purple (#8B5CF6), bright orange (#F97316), 
    and white daisies. Add flowing leaves in a soft green (#F2FCE2) creating movement around the brain. 
    The style should be modern and clean with organic shapes, focusing on growth and mental wellness. 
    The background must be completely transparent. The illustration should feel uplifting and energetic, 
    perfect for a mental health and wellness application. The composition should be balanced and dynamic, 
    with the brain as the central focus and flowers emerging from it in a natural, flowing pattern. 
    IMPORTANT: The background must be completely transparent, not white or any other color. 
    The overall effect should be both professional and playful, suitable for a modern wellness platform.`;

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
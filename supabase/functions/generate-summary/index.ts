
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { currentSummary, jobDescription, relevantSkills } = await req.json();

    const prompt = `You are a professional resume writer. Generate 3 different professional summary variations based on the following:

Current Summary: ${currentSummary}
Job Description: ${jobDescription}
Relevant Skills: ${relevantSkills.join(', ')}

Requirements:
- Each summary should be 2-4 sentences
- Tailor to the job description keywords
- Maintain the professional tone from the current summary
- Include relevant skills naturally
- Make each variation distinct (comprehensive, professional, personal)

Return ONLY a JSON array with 3 strings, no other text.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a professional resume writer that returns only valid JSON arrays.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    let generatedText = data.choices[0].message.content;
    
    console.log('Raw OpenAI response:', generatedText);
    
    // Clean up the response if it's wrapped in markdown code blocks
    if (generatedText.includes('```json')) {
      generatedText = generatedText.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
    }
    if (generatedText.includes('```')) {
      generatedText = generatedText.replace(/```\s*/g, '').trim();
    }
    
    console.log('Cleaned response:', generatedText);
    
    // Parse the JSON response
    const suggestions = JSON.parse(generatedText);

    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-summary function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

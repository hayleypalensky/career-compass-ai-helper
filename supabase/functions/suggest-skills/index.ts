
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
    const { jobDescription, currentSkills } = await req.json();

    const prompt = `You are a professional resume writer. Analyze this job description and suggest relevant skills that are missing from the current skill set:

Job Description: ${jobDescription}
Current Skills: ${currentSkills.join(', ')}

Requirements:
- Only suggest skills that are explicitly mentioned or clearly implied in the job description
- Don't suggest skills already in the current skills list
- Focus on technical skills, tools, and specific competencies
- Limit to 10 most relevant missing skills
- Return skills as they would appear on a resume

Return ONLY a JSON array of skill strings, no other text.`;

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
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const generatedText = data.choices[0].message.content;
    
    const suggestedSkills = JSON.parse(generatedText);

    return new Response(JSON.stringify({ suggestedSkills }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in suggest-skills function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

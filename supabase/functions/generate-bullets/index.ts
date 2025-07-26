
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
    const { currentBullet, jobTitle, jobDescription, relevantSkills, suggestionType } = await req.json();

    let prompt;

    if (suggestionType === 'job-focused') {
      // For JOB-FOCUSED suggestions - based solely on job description
      prompt = `You are a professional resume writer. Based ONLY on the job description provided, create 3 completely new and distinct bullet points for someone in this role:

Job Title: ${jobTitle}
Job Description: ${jobDescription}
Relevant Skills to Incorporate: ${relevantSkills.join(', ')}

Requirements:
- Create entirely NEW bullet points based ONLY on the job description requirements
- DO NOT reference any existing content or experience
- Start with strong action verbs (Led, Developed, Implemented, Designed, etc.)
- Include realistic but varied quantifiable achievements (use different percentages like 15%, 25%, 30%, etc.)
- Incorporate keywords and requirements directly from the job description
- Make them ATS-friendly and role-appropriate
- Each should be 1-2 lines maximum
- Focus on impact and results that would be relevant to this specific job

Return ONLY a JSON array with 3 strings, no other text.`;
    } else if (suggestionType === 'profile-based') {
      // For PROFILE-BASED suggestions - improve existing bullets using profile context
      prompt = `You are a professional resume writer. Improve and tailor the following bullet point to better match the job description while keeping the core experience:

Current Bullet Point: "${currentBullet}"
Job Title: ${jobTitle}
Job Description: ${jobDescription}
Relevant Skills to Incorporate: ${relevantSkills.join(', ')}

Requirements:
- Improve the EXISTING bullet point to better align with the job description
- Keep the core achievement/responsibility but enhance it with job-relevant keywords
- Start with strong action verbs (Led, Developed, Implemented, Designed, etc.)
- Add or adjust quantifiable results to be more impressive and relevant
- Incorporate keywords from the job description naturally
- Make it ATS-friendly and tailored to the specific role
- Keep it 1-2 lines maximum
- Focus on impact and results that match what the job is looking for

Return ONLY a JSON array with 3 improved versions of the bullet point, no other text.`;
    } else {
      // Fallback to original logic for backward compatibility
      const isNewBulletGeneration = !currentBullet || currentBullet.trim() === "" || 
                                    currentBullet === `Contributed to ${jobTitle} responsibilities`;

      if (isNewBulletGeneration) {
        prompt = `You are a professional resume writer. Based ONLY on the job description provided, create 3 completely new and distinct bullet points for someone in this role:

Job Title: ${jobTitle}
Job Description: ${jobDescription}
Relevant Skills to Incorporate: ${relevantSkills.join(', ')}

Requirements:
- Create entirely NEW bullet points based ONLY on the job description requirements
- DO NOT reference any existing content
- Start with strong action verbs (Led, Developed, Implemented, Designed, etc.)
- Include realistic but varied quantifiable achievements (use different percentages like 15%, 25%, 30%, etc.)
- Incorporate keywords and requirements directly from the job description
- Make them ATS-friendly and role-appropriate
- Each should be 1-2 lines maximum
- Focus on impact and results that would be relevant to this specific job

Return ONLY a JSON array with 3 strings, no other text.`;
      } else {
        prompt = `You are a professional resume writer. Improve and tailor the following bullet point to better match the job description:

Current Bullet Point: "${currentBullet}"
Job Title: ${jobTitle}
Job Description: ${jobDescription}
Relevant Skills to Incorporate: ${relevantSkills.join(', ')}

Requirements:
- Improve the EXISTING bullet point to better align with the job description
- Keep the core achievement/responsibility but enhance it with job-relevant keywords
- Start with strong action verbs (Led, Developed, Implemented, Designed, etc.)
- Add or adjust quantifiable results to be more impressive and relevant
- Incorporate keywords from the job description naturally
- Make it ATS-friendly and tailored to the specific role
- Keep it 1-2 lines maximum
- Focus on impact and results that match what the job is looking for

Return ONLY a JSON array with 3 improved versions of the bullet point, no other text.`;
      }
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a professional resume writer that creates ATS-optimized bullet points. Return only valid JSON arrays with no markdown formatting.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
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
    console.log('Request type:', suggestionType || 'legacy');
    
    const suggestions = JSON.parse(generatedText);

    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-bullets function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

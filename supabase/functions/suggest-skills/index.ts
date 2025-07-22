
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

    const prompt = `You are an expert ATS (Applicant Tracking System) analyzer and resume writer. Analyze this job description and identify the most important skills that should be on a resume to match this role:

Job Description: ${jobDescription}

Current Skills Already Listed: ${currentSkills.join(', ')}

Instructions:
1. Extract skills that are explicitly mentioned or strongly implied in the job description
2. Include technical skills, programming languages, frameworks, tools, certifications, and methodologies
3. Include soft skills that are specifically mentioned or critical for the role
4. Prioritize skills that appear multiple times or are emphasized in the job posting
5. Don't suggest skills already in the current skills list
6. Format skills exactly as they would appear on a professional resume (proper capitalization, common industry terms)
7. Limit to the 8 most critical missing skills for this specific role
8. Focus on skills that would help pass ATS screening

Return ONLY a JSON array of skill strings, no explanations or other text.

Examples of good skill formatting:
- "React.js" not "react" or "ReactJS"
- "Python" not "python programming"
- "Project Management" not "managing projects"
- "AWS" not "Amazon Web Services (AWS)"`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert ATS analyzer and resume writer. Return only valid JSON arrays of skills. Be precise and use proper skill formatting for professional resumes.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
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

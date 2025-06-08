
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
    const { profile, jobDescription, jobTitle, companyName, relevantSkills } = await req.json();

    console.log('Generating cover letter for:', {
      name: profile?.personalInfo?.name,
      jobTitle,
      companyName,
      relevantSkillsCount: relevantSkills?.length || 0
    });

    if (!profile || !jobDescription) {
      throw new Error('Profile and job description are required');
    }

    // Create a comprehensive prompt for cover letter generation
    const prompt = `Generate a professional cover letter based on the following information:

CANDIDATE PROFILE:
- Name: ${profile.personalInfo.name}
- Email: ${profile.personalInfo.email}
- Phone: ${profile.personalInfo.phone || 'Not provided'}
- Location: ${profile.personalInfo.location || 'Not provided'}
- Professional Summary: ${profile.personalInfo.summary}

WORK EXPERIENCE:
${profile.experiences?.map(exp => 
  `- ${exp.title} at ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'})
  Key achievements: ${exp.bullets.join('; ')}`
).join('\n') || 'No experience provided'}

SKILLS:
${profile.skills?.map(skill => skill.name).join(', ') || 'No skills provided'}

EDUCATION:
${profile.education?.map(edu => 
  `- ${edu.degree} in ${edu.field} from ${edu.institution} (${edu.graduationYear})`
).join('\n') || 'No education provided'}

JOB DETAILS:
- Position: ${jobTitle}
- Company: ${companyName}
- Job Description: ${jobDescription}

RELEVANT SKILLS FOR THIS ROLE:
${relevantSkills.join(', ')}

Please write a compelling, professional cover letter that:
1. Starts directly with "Dear Hiring Manager," - DO NOT include any header information like dates, addresses, or recipient details
2. Opens with a strong hook that mentions the specific position and company
3. Highlights the most relevant experience and achievements from the candidate's background
4. Demonstrates knowledge of the company and role requirements
5. Shows enthusiasm for the position and company
6. Includes a professional closing with a call to action
7. Is approximately 300-400 words long
8. Uses professional language while showing personality
9. Specifically addresses requirements mentioned in the job description
10. Emphasizes the relevant skills identified for this role
11. Ends with "Sincerely," followed by the candidate's name

Format the letter with appropriate paragraph spacing but WITHOUT any business letter header formatting (no dates, addresses, etc).`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert career counselor and professional writer specializing in creating compelling cover letters. You write in a professional yet engaging tone that helps candidates stand out while maintaining appropriate business communication standards. You NEVER include business letter headers, dates, or addresses - you start directly with the greeting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const coverLetter = data.choices[0]?.message?.content;

    if (!coverLetter) {
      throw new Error('No cover letter generated');
    }

    console.log('Cover letter generated successfully');

    return new Response(
      JSON.stringify({ coverLetter }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in generate-cover-letter function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate cover letter' 
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );
  }
});

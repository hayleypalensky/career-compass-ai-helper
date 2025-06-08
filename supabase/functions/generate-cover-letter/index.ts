
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
    const prompt = `Write me a personalized cover letter for the following job posting. I want it to sound warm, professional, and genuinely enthusiastic—like a thoughtful human wrote it, not a template. Please avoid repeating my resume line by line. Instead, help me tell a story about why I'm excited about this role and how my experience makes me a great fit. Keep the tone friendly, articulate, and confident, and use a clear structure: a compelling intro, a strong body that connects my background to their needs, and a respectful, authentic close.

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

Requirements:
- Start directly with "Dear Hiring Manager," - DO NOT include any header information like dates, addresses, or recipient details
- Write a compelling intro that shows genuine excitement for the specific position and company
- Tell a story that connects my experience to their specific needs rather than listing resume items
- Show authentic enthusiasm for the role and company culture
- Demonstrate understanding of what they're looking for and how I can contribute
- End with "Sincerely," followed by my name
- Keep it approximately 300-400 words
- Use warm, friendly but professional language that shows personality and genuine interest
- Format with appropriate paragraph spacing but WITHOUT any business letter header formatting`;

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
            content: 'You are an expert career counselor and professional writer specializing in creating compelling, warm, and authentic cover letters. You write in a friendly yet professional tone that helps candidates stand out while maintaining genuine human connection. You NEVER include business letter headers, dates, or addresses - you start directly with the greeting. Focus on creating personalized, story-driven cover letters that show genuine enthusiasm and connect the candidate\'s experience to the specific role in a natural, conversational way.'
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

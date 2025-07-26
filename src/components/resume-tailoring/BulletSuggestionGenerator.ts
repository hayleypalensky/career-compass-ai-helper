
import { Experience } from "@/components/ExperienceForm";
import { aiService } from "@/services/aiService";

// Generate suggestions for existing bullet points using AI service (considers current bullet + job description)
export const generateBulletSuggestions = async (
  experience: Experience,
  expIndex: number,
  bulletIndex: number,
  jobDescription: string,
  relevantSkills: string[]
): Promise<string[]> => {
  // If no job description, return empty array
  if (!jobDescription.trim()) {
    console.log('Missing job description, skipping AI generation');
    return [];
  }
  
  try {
    console.log('Calling AI service for existing bullet suggestions:', {
      jobTitle: experience.title,
      company: experience.company,
      hasJobDescription: !!jobDescription,
      relevantSkillsCount: relevantSkills.length,
      currentBullet: experience.bullets[bulletIndex]
    });
    
    // Use the actual current bullet point for context
    const currentBullet = experience.bullets[bulletIndex] || "";
    
    // Use AI service to generate suggestions based on current bullet + job description
    const aiSuggestions = await aiService.generateBulletPoints(
      currentBullet,
      experience.title,
      jobDescription,
      relevantSkills,
      'experience-based'
    );
    
    console.log('AI suggestions received for existing bullet:', aiSuggestions);
    return aiSuggestions;
  } catch (error) {
    console.error('Error generating AI bullet suggestions:', error);
    // Return empty array if AI fails
    return [];
  }
};

// Generate new bullet point suggestions based ONLY on job description (no existing bullet context)
export const generateNewBulletSuggestions = async (
  experience: Experience,
  jobDescription: string,
  relevantSkills: string[]
): Promise<string[]> => {
  // If no job description, return empty array
  if (!jobDescription.trim()) {
    console.log('Missing job description, skipping new bullet generation');
    return [];
  }
  
  try {
    console.log('Calling AI service for new bullet suggestions:', {
      jobTitle: experience.title,
      company: experience.company,
      hasJobDescription: !!jobDescription,
      relevantSkillsCount: relevantSkills.length
    });
    
    // Use a generic placeholder that doesn't influence the AI too much
    // This ensures suggestions are based primarily on job description requirements
    const genericPlaceholder = `Contributed to ${experience.title} responsibilities`;
    
    // Use AI service to generate suggestions based primarily on job description
    const aiSuggestions = await aiService.generateBulletPoints(
      genericPlaceholder,
      experience.title,
      jobDescription,
      relevantSkills,
      'experience-based'
    );
    
    console.log('AI suggestions received for new bullets:', aiSuggestions);
    return aiSuggestions;
  } catch (error) {
    console.error('Error generating new bullet suggestions:', error);
    // Return empty array if AI fails
    return [];
  }
};

// Generate job-focused bullet point suggestions based purely on job description requirements
export const generateJobFocusedSuggestions = async (
  experience: Experience,
  jobDescription: string,
  relevantSkills: string[]
): Promise<string[]> => {
  // If no job description, return empty array
  if (!jobDescription.trim()) {
    console.log('Missing job description, skipping job-focused generation');
    return [];
  }
  
  try {
    console.log('Calling AI service for job-focused suggestions:', {
      jobTitle: experience.title,
      company: experience.company,
      hasJobDescription: !!jobDescription,
      relevantSkillsCount: relevantSkills.length
    });
    
    // Use AI service to generate suggestions focused purely on job requirements
    const aiSuggestions = await aiService.generateBulletPoints(
      '', // Empty current bullet to focus on job description
      experience.title,
      jobDescription,
      relevantSkills,
      'job-focused'
    );
    
    console.log('AI job-focused suggestions received:', aiSuggestions);
    return aiSuggestions;
  } catch (error) {
    console.error('Error generating job-focused suggestions:', error);
    // Return empty array if AI fails
    return [];
  }
};

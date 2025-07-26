
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
      relevantSkills
    );
    
    console.log('AI suggestions received for existing bullet:', aiSuggestions);
    return aiSuggestions;
  } catch (error) {
    console.error('Error generating AI bullet suggestions:', error);
    // Return empty array if AI fails
    return [];
  }
};

// Generate bullet point suggestions based on user's profile and experience
export const generateProfileBasedSuggestions = async (
  experience: Experience,
  jobDescription: string,
  relevantSkills: string[]
): Promise<string[]> => {
  // If no job description, return empty array
  if (!jobDescription.trim()) {
    console.log('Missing job description, skipping profile-based generation');
    return [];
  }
  
  try {
    console.log('Calling AI service for profile-based bullet suggestions:', {
      jobTitle: experience.title,
      company: experience.company,
      hasJobDescription: !!jobDescription,
      relevantSkillsCount: relevantSkills.length
    });
    
    // Use the first bullet point as context for profile-based suggestions
    const contextBullet = experience.bullets[0] || `Contributed to ${experience.title} responsibilities`;
    
    // Use AI service to generate suggestions based on profile + job description
    const aiSuggestions = await aiService.generateBulletPoints(
      contextBullet,
      experience.title,
      jobDescription,
      relevantSkills,
      'profile-based'
    );
    
    console.log('AI suggestions received for profile-based bullets:', aiSuggestions);
    return aiSuggestions;
  } catch (error) {
    console.error('Error generating profile-based bullet suggestions:', error);
    // Return empty array if AI fails
    return [];
  }
};

// Generate bullet point suggestions based ONLY on job description (no existing bullet context)
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
    console.log('Calling AI service for job-focused bullet suggestions:', {
      jobTitle: experience.title,
      company: experience.company,
      hasJobDescription: !!jobDescription,
      relevantSkillsCount: relevantSkills.length
    });
    
    // Use empty string to ensure suggestions are based purely on job description
    const emptyContext = "";
    
    // Use AI service to generate suggestions based purely on job description
    const aiSuggestions = await aiService.generateBulletPoints(
      emptyContext,
      experience.title,
      jobDescription,
      relevantSkills,
      'job-focused'
    );
    
    console.log('AI suggestions received for job-focused bullets:', aiSuggestions);
    return aiSuggestions;
  } catch (error) {
    console.error('Error generating job-focused bullet suggestions:', error);
    // Return empty array if AI fails
    return [];
  }
};

// Legacy function for backward compatibility
export const generateNewBulletSuggestions = generateJobFocusedSuggestions;


import { Experience } from "@/components/ExperienceForm";
import { aiService } from "@/services/aiService";

// Generate suggestions for bullet points using AI service
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
    console.log('Calling AI service for bullet suggestions:', {
      jobTitle: experience.title,
      company: experience.company,
      hasJobDescription: !!jobDescription,
      relevantSkillsCount: relevantSkills.length
    });
    
    // Create a generic bullet template based on role and company without specific metrics
    const roleTemplate = `Contributed to ${experience.title} responsibilities at ${experience.company}`;
    
    // Use AI service to generate suggestions based on job description requirements
    const aiSuggestions = await aiService.generateBulletPoints(
      roleTemplate,
      experience.title,
      jobDescription,
      relevantSkills
    );
    
    console.log('AI suggestions received:', aiSuggestions);
    return aiSuggestions;
  } catch (error) {
    console.error('Error generating AI bullet suggestions:', error);
    // Return empty array if AI fails
    return [];
  }
};

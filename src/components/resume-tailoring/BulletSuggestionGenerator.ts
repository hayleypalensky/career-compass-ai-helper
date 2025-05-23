
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
  const currentBullet = experience.bullets[bulletIndex];
  
  // If no job description or current bullet is empty, return empty array
  if (!jobDescription.trim() || !currentBullet.trim()) {
    return [];
  }
  
  try {
    // Use AI service to generate suggestions
    const aiSuggestions = await aiService.generateBulletPoints(
      currentBullet,
      experience.title,
      jobDescription,
      relevantSkills
    );
    
    return aiSuggestions;
  } catch (error) {
    console.error('Error generating AI bullet suggestions:', error);
    // Fall back to empty array if AI fails
    return [];
  }
};

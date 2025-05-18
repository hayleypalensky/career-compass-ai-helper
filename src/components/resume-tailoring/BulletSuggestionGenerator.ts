
import { Experience } from "@/components/ExperienceForm";
import {
  extractKeywordsFromJobDescription,
  getContextRelevantDeliverable,
  getRelevantProject,
  getRandomTeamSize,
  getRandomActionVerb,
  getRandomTechnicalOutcome,
  getRandomTechnicalBenefit,
  getRandomDesignOutcome,
  getRandomBusinessMetric,
  getRandomBusinessOutcome
} from './textGenerationUtils';

// Generate suggestions for bullet points based on job description and relevant skills
export const generateBulletSuggestions = (
  experience: Experience,
  expIndex: number,
  bulletIndex: number,
  jobDescription: string,
  relevantSkills: string[]
): string[] => {
  const currentBullet = experience.bullets[bulletIndex];
  const suggestions: string[] = [];
  
  // Extract key terms from job description that are relevant to this specific experience
  const jobKeywords = extractKeywordsFromJobDescription(jobDescription);
  
  // Find skills that are relevant to both the experience and job
  const relevantTermsForExperience = jobKeywords.filter(term => 
    experience.title.toLowerCase().includes(term) || 
    experience.description?.toLowerCase().includes(term) ||
    term === experience.company.toLowerCase()
  );
  
  // Generate suggestions based on the experience type and job requirements
  const roleKeywords = experience.title.toLowerCase();
  const isLeadershipRole = roleKeywords.includes("manager") || roleKeywords.includes("lead") || 
                           roleKeywords.includes("director") || roleKeywords.includes("supervisor");
  
  const isTechnicalRole = roleKeywords.includes("engineer") || roleKeywords.includes("developer") || 
                          roleKeywords.includes("architect") || roleKeywords.includes("programmer");
  
  const isDesignRole = roleKeywords.includes("designer") || roleKeywords.includes("ux") || 
                       roleKeywords.includes("ui") || roleKeywords.includes("creative");
  
  // Add role-specific suggestions
  if (isLeadershipRole) {
    suggestions.push(
      `Led cross-functional team to deliver ${getContextRelevantDeliverable(experience.title)} resulting in ${getRandomBusinessOutcome()}`,
      `Managed ${getRandomTeamSize()} team members while implementing ${getRelevantProject(experience.title, experience.description, experience.company, jobKeywords)}`
    );
  }
  
  if (isTechnicalRole) {
    // Find technical skills in the relevant skills
    const technicalSkills = relevantSkills.filter(skill => 
      !["leadership", "communication", "teamwork", "management"].includes(skill.toLowerCase())
    );
    
    if (technicalSkills.length > 0) {
      const randomTechSkill = technicalSkills[Math.floor(Math.random() * technicalSkills.length)];
      suggestions.push(
        `Implemented ${randomTechSkill} solutions for ${getRelevantProject(experience.title, experience.description, experience.company, jobKeywords)} that ${getRandomTechnicalOutcome()}`,
        `Architected and developed ${getContextRelevantDeliverable(experience.title)} using ${randomTechSkill} to ${getRandomTechnicalBenefit()}`
      );
    }
  }
  
  if (isDesignRole) {
    suggestions.push(
      `Created user-centered designs for ${getRelevantProject(experience.title, experience.description, experience.company, jobKeywords)} resulting in ${getRandomDesignOutcome()}`,
      `Redesigned ${getContextRelevantDeliverable(experience.title)} to improve user experience, leading to ${getRandomBusinessMetric()}`
    );
  }
  
  // Add general suggestions based on the job description and relevant skills
  if (relevantTermsForExperience.length > 0) {
    const relevantTerm = relevantTermsForExperience[Math.floor(Math.random() * relevantTermsForExperience.length)];
    suggestions.push(
      `Demonstrated expertise in ${relevantTerm} by ${getRandomActionVerb()}ing ${getContextRelevantDeliverable(experience.title)}`,
      `Utilized knowledge of ${relevantTerm} to ${getRandomActionVerb()} ${getRelevantProject(experience.title, experience.description, experience.company, jobKeywords)}`
    );
  }
  
  // Add quantifiable suggestions based on the current bullet
  if (currentBullet && currentBullet.length > 10) {
    const cleanedBullet = currentBullet.replace(/^I |^Led |^Managed |^Developed /i, '');
    suggestions.push(
      `${getRandomActionVerb(true)} ${cleanedBullet}, resulting in ${getRandomBusinessMetric()}`,
      `Successfully ${getRandomActionVerb()} ${cleanedBullet} that led to ${getRandomBusinessOutcome()}`
    );
  }
  
  // Filter out empty suggestions and remove duplicates
  return [...new Set(suggestions.filter(s => s && s !== currentBullet))].slice(0, 3);
};


import { Profile } from '@/types/profile';
import { Experience } from '@/components/ExperienceForm';
import { Skill } from '@/components/SkillsForm';
import { generateBulletSuggestions } from '@/components/resume-tailoring/BulletSuggestionGenerator';

export const createUpdatedSkills = (
  profile: Profile, 
  skillsToAdd: string[], 
  skillsToRemove: string[]
): Skill[] => {
  // Create unique skills from the selected missing skills (prevent duplicates)
  const existingSkillNames = profile.skills
    .filter(skill => !skillsToRemove.includes(skill.id))
    .map(skill => skill.name.toLowerCase());
  
  // Filter out skills to add that already exist in profile (case insensitive)
  const uniqueSkillsToAdd = skillsToAdd.filter(skillName => 
    !existingSkillNames.includes(skillName.toLowerCase())
  );
  
  // Create new skills array
  return [
    ...profile.skills.filter(skill => !skillsToRemove.includes(skill.id)),
    ...uniqueSkillsToAdd.map((skillName) => ({
      id: crypto.randomUUID(),
      name: skillName,
      category: "Technical", // Default category
    })),
  ];
};

export const createBulletSuggestionsWrapper = (
  tailoredExperiences: Experience[],
  jobDescription: string,
  relevantSkills: string[]
) => {
  return async (expIndex: number, bulletIndex: number): Promise<string[]> => {
    const experience = tailoredExperiences[expIndex];
    return await generateBulletSuggestions(
      experience, 
      expIndex, 
      bulletIndex, 
      jobDescription, 
      relevantSkills
    );
  };
};

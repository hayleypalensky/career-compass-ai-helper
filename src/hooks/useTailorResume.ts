
import { Profile } from '@/types/profile';
import { Experience } from '@/components/ExperienceForm';
import { Skill } from '@/components/SkillsForm';
import { useToast } from '@/components/ui/use-toast';
import { useTailorResumeExperiences } from './useTailorResumeExperiences';
import { useTailorResumeSkills } from './useTailorResumeSkills';
import { useTailorResumeUI } from './useTailorResumeUI';
import { createUpdatedSkills, createBulletSuggestionsWrapper } from '@/utils/resumeTailoringUtils';

interface UseTailorResumeProps {
  profile: Profile;
  relevantSkills: string[];
  jobDescription: string;
  onUpdateResume: (experiences: Experience[], skills: Skill[]) => void;
}

export const useTailorResume = ({ 
  profile, 
  relevantSkills, 
  jobDescription,
  onUpdateResume 
}: UseTailorResumeProps) => {
  const { toast } = useToast();
  
  // Use specialized hooks
  const experienceHook = useTailorResumeExperiences({ profile });
  const skillsHook = useTailorResumeSkills({ profile });
  const uiHook = useTailorResumeUI({ profile });

  // Helper function to generate bullet suggestions using AI service
  const generateBulletSuggestions = createBulletSuggestionsWrapper(
    experienceHook.tailoredExperiences,
    jobDescription,
    relevantSkills
  );

  // Save the tailored resume
  const saveTailoredResume = () => {
    const newSkills = createUpdatedSkills(profile, skillsHook.skillsToAdd, skillsHook.skillsToRemove);

    // Create updated profile with new summary
    const updatedProfile = {
      ...profile,
      personalInfo: {
        ...profile.personalInfo,
        summary: uiHook.updatedSummary
      }
    };

    onUpdateResume(experienceHook.tailoredExperiences, newSkills);
    
    toast({
      title: "Resume tailored successfully",
      description: "Your resume has been updated with the tailored content.",
    });
  };

  return {
    // Experience management
    tailoredExperiences: experienceHook.tailoredExperiences,
    selectedExperienceIds: experienceHook.selectedExperienceIds,
    handleBulletChange: experienceHook.handleBulletChange,
    addBullet: experienceHook.addBullet,
    removeBullet: experienceHook.removeBullet,
    handleExperienceSelectionChange: experienceHook.handleExperienceSelectionChange,
    
    // Skills management
    skillsToAdd: skillsHook.skillsToAdd,
    skillsToRemove: skillsHook.skillsToRemove,
    toggleSkillSelection: skillsHook.toggleSkillSelection,
    toggleSkillRemoval: skillsHook.toggleSkillRemoval,
    
    // UI management
    selectedTheme: uiHook.selectedTheme,
    updatedSummary: uiHook.updatedSummary,
    handleThemeChange: uiHook.handleThemeChange,
    handleSummaryChange: uiHook.handleSummaryChange,
    
    // Utility functions
    generateBulletSuggestions,
    saveTailoredResume
  };
};

export default useTailorResume;

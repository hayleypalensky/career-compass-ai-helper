
import { Profile } from '@/types/profile';
import { Experience } from '@/components/ExperienceForm';
import { Skill } from '@/components/SkillsForm';
import { useToast } from '@/hooks/use-toast';
import { useTailorResumeExperiences } from './useTailorResumeExperiences';
import { useTailorResumeSkills } from './useTailorResumeSkills';
import { useTailorResumeUI } from './useTailorResumeUI';
import { createUpdatedSkills, createBulletSuggestionsWrapper } from '@/utils/resumeTailoringUtils';

interface UseTailorResumeProps {
  profile: Profile;
  relevantSkills: string[];
  jobDescription: string;
  onUpdateResume: (experiences: Experience[], skills: Skill[]) => void;
  onSummaryChange?: (summary: string) => void;
  tailoredSummary?: string;
}

export const useTailorResume = ({ 
  profile, 
  relevantSkills, 
  jobDescription,
  onUpdateResume,
  onSummaryChange,
  tailoredSummary = ""
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

  // Handle summary changes
  const handleSummaryChange = (summary: string) => {
    if (onSummaryChange) {
      onSummaryChange(summary);
    }
  };

  // Reset all tailored changes
  const resetTailoredResume = () => {
    // Reset experiences to original profile state
    experienceHook.resetExperiences();
    
    // Reset skills to original state
    skillsHook.resetSkills();
    
    // Reset UI to original state
    uiHook.resetUI();
    
    // Reset summary to profile default
    if (onSummaryChange) {
      onSummaryChange(profile.personalInfo.summary || "");
    }
    
    toast({
      title: "Resume reset",
      description: "All tailored changes have been cleared. Ready for a new job application.",
    });
  };

  // Save the tailored resume
  const saveTailoredResume = () => {
    const newSkills = createUpdatedSkills(profile, skillsHook.skillsToAdd, skillsHook.skillsToRemove);

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
    reorderBullets: experienceHook.reorderBullets,
    handleExperienceSelectionChange: experienceHook.handleExperienceSelectionChange,
    
    // Skills management
    skillsToAdd: skillsHook.skillsToAdd,
    skillsToRemove: skillsHook.skillsToRemove,
    toggleSkillSelection: skillsHook.toggleSkillSelection,
    toggleSkillRemoval: skillsHook.toggleSkillRemoval,
    
    // UI management
    selectedTheme: uiHook.selectedTheme,
    handleThemeChange: uiHook.handleThemeChange,
    
    // Summary management
    handleSummaryChange,
    
    // Utility functions
    generateBulletSuggestions,
    saveTailoredResume,
    resetTailoredResume
  };
};

export default useTailorResume;

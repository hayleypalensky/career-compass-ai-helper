
import { useState } from 'react';
import { Profile } from '@/types/profile';
import { Experience } from '@/components/ExperienceForm';
import { Skill } from '@/components/SkillsForm';
import { useToast } from '@/components/ui/use-toast';
import { generateBulletSuggestions } from '@/components/resume-tailoring/BulletSuggestionGenerator';

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
  const [tailoredExperiences, setTailoredExperiences] = useState<Experience[]>(
    JSON.parse(JSON.stringify(profile.experiences))
  );
  const [userResponses, setUserResponses] = useState<Record<string, string>>({});
  const [skillsToAdd, setSkillsToAdd] = useState<string[]>([]);
  const [skillsToRemove, setSkillsToRemove] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>("purple");
  const [updatedSummary, setUpdatedSummary] = useState<string>(profile.personalInfo.summary || "");

  // Handle changes to experience bullet points
  const handleBulletChange = (expIndex: number, bulletIndex: number, value: string) => {
    setTailoredExperiences((prevExperiences) => {
      const newExperiences = [...prevExperiences];
      if (newExperiences[expIndex]) {
        const newBullets = [...newExperiences[expIndex].bullets];
        newBullets[bulletIndex] = value;
        newExperiences[expIndex] = {
          ...newExperiences[expIndex],
          bullets: newBullets,
        };
      }
      return newExperiences;
    });
  };

  // Add a new bullet point to an experience
  const addBullet = (expIndex: number) => {
    setTailoredExperiences((prevExperiences) => {
      const newExperiences = [...prevExperiences];
      if (newExperiences[expIndex]) {
        newExperiences[expIndex] = {
          ...newExperiences[expIndex],
          bullets: [...newExperiences[expIndex].bullets, ""],
        };
      }
      return newExperiences;
    });
  };

  // Remove a bullet point from an experience
  const removeBullet = (expIndex: number, bulletIndex: number) => {
    setTailoredExperiences((prevExperiences) => {
      const newExperiences = [...prevExperiences];
      if (newExperiences[expIndex]) {
        const newBullets = newExperiences[expIndex].bullets.filter(
          (_, i) => i !== bulletIndex
        );
        newExperiences[expIndex] = {
          ...newExperiences[expIndex],
          bullets: newBullets,
        };
      }
      return newExperiences;
    });
  };

  // Toggle missing skill selection (prevent duplicates)
  const toggleSkillSelection = (skill: string) => {
    setSkillsToAdd((prev) => {
      // Check if skill already exists in the profile (case insensitive)
      const alreadyInProfile = profile.skills.some(
        existingSkill => existingSkill.name.toLowerCase() === skill.toLowerCase()
      );
      
      // If already in profile, don't add it to skillsToAdd
      if (alreadyInProfile) {
        toast({
          title: "Skill already exists",
          description: `"${skill}" is already in your profile.`,
          variant: "default",
        });
        return prev.filter(s => s !== skill); // Remove it if it was previously added
      }
      
      // Check if it's already in skillsToAdd list
      if (prev.includes(skill)) {
        return prev.filter(s => s !== skill);
      } else {
        return [...prev, skill];
      }
    });
  };

  // Toggle removal of a skill from profile
  const toggleSkillRemoval = (skillId: string) => {
    setSkillsToRemove((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    );
  };

  // Update user response for a missing skill
  const updateResponse = (skill: string, response: string) => {
    setUserResponses((prev) => ({
      ...prev,
      [skill]: response,
    }));
  };

  // Helper function to generate bullet suggestions using the utility function
  const generateBulletSuggestionsWrapper = (expIndex: number, bulletIndex: number) => {
    const experience = tailoredExperiences[expIndex];
    return generateBulletSuggestions(
      experience, 
      expIndex, 
      bulletIndex, 
      jobDescription, 
      relevantSkills
    );
  };

  // Handle color theme changes
  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
  };

  // Handle summary update
  const handleSummaryChange = (summary: string) => {
    setUpdatedSummary(summary);
  };

  // Save the tailored resume
  const saveTailoredResume = () => {
    // Create unique skills from the selected missing skills (prevent duplicates)
    const existingSkillNames = profile.skills
      .filter(skill => !skillsToRemove.includes(skill.id))
      .map(skill => skill.name.toLowerCase());
    
    // Filter out skills to add that already exist in profile (case insensitive)
    const uniqueSkillsToAdd = skillsToAdd.filter(skillName => 
      !existingSkillNames.includes(skillName.toLowerCase())
    );
    
    // Create new skills array
    const newSkills: Skill[] = [
      ...profile.skills.filter(skill => !skillsToRemove.includes(skill.id)),
      ...uniqueSkillsToAdd.map((skillName) => ({
        id: crypto.randomUUID(),
        name: skillName,
        category: "Technical", // Default category
      })),
    ];

    // Create updated profile with new summary
    const updatedProfile = {
      ...profile,
      personalInfo: {
        ...profile.personalInfo,
        summary: updatedSummary
      }
    };

    onUpdateResume(tailoredExperiences, newSkills);
    
    toast({
      title: "Resume tailored successfully",
      description: "Your resume has been updated with the tailored content.",
    });
  };

  return {
    tailoredExperiences,
    userResponses,
    skillsToAdd,
    skillsToRemove,
    selectedTheme,
    updatedSummary,
    handleBulletChange,
    addBullet,
    removeBullet,
    toggleSkillSelection,
    toggleSkillRemoval,
    updateResponse,
    generateBulletSuggestions: generateBulletSuggestionsWrapper,
    handleThemeChange,
    handleSummaryChange,
    saveTailoredResume
  };
};

export default useTailorResume;

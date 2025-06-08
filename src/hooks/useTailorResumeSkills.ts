
import { useState } from 'react';
import { Profile } from '@/types/profile';
import { useToast } from '@/components/ui/use-toast';

interface UseTailorResumeSkillsProps {
  profile: Profile;
}

export const useTailorResumeSkills = ({ profile }: UseTailorResumeSkillsProps) => {
  const { toast } = useToast();
  const [skillsToAdd, setSkillsToAdd] = useState<string[]>([]);
  const [skillsToRemove, setSkillsToRemove] = useState<string[]>([]);

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

  return {
    skillsToAdd,
    skillsToRemove,
    toggleSkillSelection,
    toggleSkillRemoval,
  };
};

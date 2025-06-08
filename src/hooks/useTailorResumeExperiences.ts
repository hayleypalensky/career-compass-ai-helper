
import { useState } from 'react';
import { Profile } from '@/types/profile';
import { Experience } from '@/components/ExperienceForm';

interface UseTailorResumeExperiencesProps {
  profile: Profile;
}

export const useTailorResumeExperiences = ({ profile }: UseTailorResumeExperiencesProps) => {
  // Initialize selected experiences to include all by default
  const [selectedExperienceIds, setSelectedExperienceIds] = useState<string[]>(
    profile.experiences.map(exp => exp.id)
  );
  
  // Filter experiences based on selection
  const selectedExperiences = profile.experiences.filter(exp => 
    selectedExperienceIds.includes(exp.id)
  );
  
  const [tailoredExperiences, setTailoredExperiences] = useState<Experience[]>(
    JSON.parse(JSON.stringify(selectedExperiences))
  );
  
  // Update tailored experiences when selection changes
  const handleExperienceSelectionChange = (selectedIds: string[]) => {
    setSelectedExperienceIds(selectedIds);
    const newSelectedExperiences = profile.experiences.filter(exp => 
      selectedIds.includes(exp.id)
    );
    setTailoredExperiences(JSON.parse(JSON.stringify(newSelectedExperiences)));
  };

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

  return {
    selectedExperienceIds,
    tailoredExperiences,
    handleExperienceSelectionChange,
    handleBulletChange,
    addBullet,
    removeBullet,
  };
};

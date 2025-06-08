import { useState, useEffect } from 'react';
import { Profile } from '@/types/profile';
import { Experience } from '@/components/ExperienceForm';

interface UseTailorResumeExperiencesProps {
  profile: Profile;
}

export const useTailorResumeExperiences = ({ profile }: UseTailorResumeExperiencesProps) => {
  // Debug logging
  console.log('useTailorResumeExperiences - Profile experiences:', profile.experiences);
  console.log('useTailorResumeExperiences - Number of experiences in profile:', profile.experiences.length);
  
  // Initialize selected experiences to include all by default
  const [selectedExperienceIds, setSelectedExperienceIds] = useState<string[]>(
    profile.experiences.map(exp => exp.id)
  );
  
  // Debug logging for initial state
  console.log('useTailorResumeExperiences - Initial selectedExperienceIds:', selectedExperienceIds);
  
  // Update selected experiences when profile changes to ensure all experiences are included
  useEffect(() => {
    const currentExperienceIds = profile.experiences.map(exp => exp.id);
    console.log('useTailorResumeExperiences - Current experience IDs from profile:', currentExperienceIds);
    
    setSelectedExperienceIds(currentIds => {
      console.log('useTailorResumeExperiences - Previous selected IDs:', currentIds);
      
      // Keep existing selections that are still valid, and add any new experiences
      const validExistingIds = currentIds.filter(id => currentExperienceIds.includes(id));
      const newIds = currentExperienceIds.filter(id => !currentIds.includes(id));
      
      const updatedIds = [...validExistingIds, ...newIds];
      console.log('useTailorResumeExperiences - Updated selected IDs:', updatedIds);
      
      return updatedIds;
    });
  }, [profile.experiences]);
  
  // Filter experiences based on selection
  const selectedExperiences = profile.experiences.filter(exp => 
    selectedExperienceIds.includes(exp.id)
  );
  
  console.log('useTailorResumeExperiences - Selected experiences:', selectedExperiences);
  console.log('useTailorResumeExperiences - Number of selected experiences:', selectedExperiences.length);
  
  const [tailoredExperiences, setTailoredExperiences] = useState<Experience[]>(
    JSON.parse(JSON.stringify(selectedExperiences))
  );
  
  // Update tailored experiences when selection changes or profile changes
  useEffect(() => {
    const newSelectedExperiences = profile.experiences.filter(exp => 
      selectedExperienceIds.includes(exp.id)
    );
    console.log('useTailorResumeExperiences - Updating tailored experiences:', newSelectedExperiences);
    setTailoredExperiences(JSON.parse(JSON.stringify(newSelectedExperiences)));
  }, [selectedExperienceIds, profile.experiences]);
  
  // Update tailored experiences when selection changes
  const handleExperienceSelectionChange = (selectedIds: string[]) => {
    console.log('useTailorResumeExperiences - Selection changed to:', selectedIds);
    setSelectedExperienceIds(selectedIds);
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

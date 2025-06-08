
import { useState, useEffect } from 'react';
import { Profile } from '@/types/profile';
import { Experience } from '@/components/ExperienceForm';

interface UseTailorResumeExperiencesProps {
  profile: Profile;
}

export const useTailorResumeExperiences = ({ profile }: UseTailorResumeExperiencesProps) => {
  // Debug logging - detailed profile inspection
  console.log('useTailorResumeExperiences - Received profile object:', profile);
  console.log('useTailorResumeExperiences - Profile keys:', Object.keys(profile));
  console.log('useTailorResumeExperiences - Profile.experiences exists?:', 'experiences' in profile);
  console.log('useTailorResumeExperiences - Profile.experiences value:', profile.experiences);
  console.log('useTailorResumeExperiences - Profile.experiences type:', typeof profile.experiences);
  console.log('useTailorResumeExperiences - Profile.experiences is array?:', Array.isArray(profile.experiences));
  console.log('useTailorResumeExperiences - Profile.experiences length:', profile.experiences?.length);
  
  // Initialize selected experiences to include all by default
  const [selectedExperienceIds, setSelectedExperienceIds] = useState<string[]>(() => {
    const initialIds = profile.experiences?.map(exp => exp.id) || [];
    console.log('useTailorResumeExperiences - Initial selectedExperienceIds:', initialIds);
    return initialIds;
  });
  
  // Update selected experiences when profile changes to ensure all experiences are included
  useEffect(() => {
    console.log('useTailorResumeExperiences - useEffect triggered with profile.experiences:', profile.experiences);
    
    const currentExperienceIds = profile.experiences?.map(exp => exp.id) || [];
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
  const selectedExperiences = profile.experiences?.filter(exp => 
    selectedExperienceIds.includes(exp.id)
  ) || [];
  
  console.log('useTailorResumeExperiences - Selected experiences:', selectedExperiences);
  console.log('useTailorResumeExperiences - Number of selected experiences:', selectedExperiences.length);
  
  const [tailoredExperiences, setTailoredExperiences] = useState<Experience[]>(() => {
    const initial = JSON.parse(JSON.stringify(selectedExperiences));
    console.log('useTailorResumeExperiences - Initial tailored experiences:', initial);
    return initial;
  });
  
  // Update tailored experiences when selection changes or profile changes
  useEffect(() => {
    const newSelectedExperiences = profile.experiences?.filter(exp => 
      selectedExperienceIds.includes(exp.id)
    ) || [];
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

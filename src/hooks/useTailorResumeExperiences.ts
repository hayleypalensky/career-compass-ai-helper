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
  const [selectedExperienceIds, setSelectedExperienceIds] = useState<string[]>([]);
  const [tailoredExperiences, setTailoredExperiences] = useState<Experience[]>([]);
  
  // Update selected experiences when profile changes to ensure all experiences are included
  useEffect(() => {
    console.log('useTailorResumeExperiences - useEffect triggered with profile.experiences:', profile.experiences);
    
    if (profile.experiences && Array.isArray(profile.experiences) && profile.experiences.length > 0) {
      const allExperienceIds = profile.experiences.map(exp => exp.id);
      console.log('useTailorResumeExperiences - All experience IDs from profile:', allExperienceIds);
      
      setSelectedExperienceIds(currentIds => {
        console.log('useTailorResumeExperiences - Previous selected IDs:', currentIds);
        
        // Always ensure we have all experiences selected if we don't have a complete set
        if (currentIds.length !== allExperienceIds.length) {
          console.log('useTailorResumeExperiences - Updating to select all experiences:', allExperienceIds);
          return allExperienceIds;
        }
        
        // Keep existing selections that are still valid, and add any new experiences
        const validExistingIds = currentIds.filter(id => allExperienceIds.includes(id));
        const newIds = allExperienceIds.filter(id => !currentIds.includes(id));
        
        if (newIds.length > 0) {
          const updatedIds = [...validExistingIds, ...newIds];
          console.log('useTailorResumeExperiences - Adding new experiences:', updatedIds);
          return updatedIds;
        }
        
        console.log('useTailorResumeExperiences - No changes needed, keeping current selection:', currentIds);
        return currentIds;
      });
    }
  }, [profile.experiences]);
  
  // Update tailored experiences when profile changes OR when selection changes
  useEffect(() => {
    if (profile.experiences && Array.isArray(profile.experiences)) {
      const newSelectedExperiences = profile.experiences.filter(exp => 
        selectedExperienceIds.includes(exp.id)
      );
      console.log('useTailorResumeExperiences - Updating tailored experiences with fresh profile data:', newSelectedExperiences);
      
      // Create a deep copy of the selected experiences to avoid mutation issues
      setTailoredExperiences(JSON.parse(JSON.stringify(newSelectedExperiences)));
    }
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

  // Reset experiences to original profile state
  const resetExperiences = () => {
    if (profile.experiences && Array.isArray(profile.experiences)) {
      const allExperienceIds = profile.experiences.map(exp => exp.id);
      setSelectedExperienceIds(allExperienceIds);
      setTailoredExperiences(JSON.parse(JSON.stringify(profile.experiences)));
    }
  };

  return {
    selectedExperienceIds,
    tailoredExperiences,
    handleExperienceSelectionChange,
    handleBulletChange,
    addBullet,
    removeBullet,
    resetExperiences,
  };
};

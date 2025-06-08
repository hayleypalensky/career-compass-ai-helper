
import { useState } from 'react';
import { Profile } from '@/types/profile';

interface UseTailorResumeUIProps {
  profile: Profile;
}

export const useTailorResumeUI = ({ profile }: UseTailorResumeUIProps) => {
  const [selectedTheme, setSelectedTheme] = useState<string>("purple");
  const [updatedSummary, setUpdatedSummary] = useState<string>(profile.personalInfo.summary || "");

  // Handle color theme changes
  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
  };

  // Handle summary update
  const handleSummaryChange = (summary: string) => {
    setUpdatedSummary(summary);
  };

  return {
    selectedTheme,
    updatedSummary,
    handleThemeChange,
    handleSummaryChange,
  };
};

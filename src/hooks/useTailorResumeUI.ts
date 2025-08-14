
import { useState } from 'react';
import { Profile } from '@/types/profile';

interface UseTailorResumeUIProps {
  profile: Profile;
}

export const useTailorResumeUI = ({ profile }: UseTailorResumeUIProps) => {
  const [selectedTheme, setSelectedTheme] = useState<string>("purple");
  const [customColor, setCustomColor] = useState<string>("#6B46C1");
  const [updatedSummary, setUpdatedSummary] = useState<string>(profile.personalInfo.summary || "");

  // Handle color theme changes
  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
  };

  // Handle custom color changes
  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
  };

  // Handle summary update
  const handleSummaryChange = (summary: string) => {
    setUpdatedSummary(summary);
  };

  // Reset UI to original state
  const resetUI = () => {
    setSelectedTheme("purple");
    setCustomColor("#6B46C1");
    setUpdatedSummary(profile.personalInfo.summary || "");
  };

  return {
    selectedTheme,
    customColor,
    updatedSummary,
    handleThemeChange,
    handleCustomColorChange,
    handleSummaryChange,
    resetUI,
  };
};

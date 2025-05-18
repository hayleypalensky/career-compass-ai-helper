
import { Button } from "@/components/ui/button";
import { Profile } from "@/types/profile";
import { Experience } from "@/components/ExperienceForm";
import { Skill } from "@/components/SkillsForm";

// Import refactored components
import RelevantSkillsCard from "./resume-tailoring/RelevantSkillsCard";
import MissingSkillsCard from "./resume-tailoring/MissingSkillsCard";
import ExperienceEditor from "./resume-tailoring/ExperienceEditor";
import ResumePreview from "./resume-tailoring/ResumePreview";
import SkillManagement from "./resume-tailoring/SkillManagement";
import ResumeColorSelector from "./resume-tailoring/ResumeColorSelector";
import SummaryEditor from "./resume-tailoring/SummaryEditor";

// Import our new hook
import useTailorResume from "@/hooks/useTailorResume";
import { useEffect } from "react";

interface TailorResumeProps {
  profile: Profile;
  relevantSkills: string[];
  missingSkills: string[];
  onUpdateResume: (experiences: Experience[], skills: Skill[]) => void;
  jobDescription?: string;
  onColorThemeChange?: (theme: string) => void; // Add this prop
}

const TailorResume = ({
  profile,
  relevantSkills,
  missingSkills,
  onUpdateResume,
  jobDescription = "",
  onColorThemeChange,
}: TailorResumeProps) => {
  // Use our custom hook for state and logic
  const {
    tailoredExperiences,
    skillsToAdd,
    skillsToRemove,
    selectedTheme,
    updatedSummary,
    handleBulletChange,
    addBullet,
    removeBullet,
    toggleSkillSelection,
    toggleSkillRemoval,
    generateBulletSuggestions,
    handleThemeChange,
    handleSummaryChange,
    saveTailoredResume
  } = useTailorResume({
    profile,
    relevantSkills,
    jobDescription,
    onUpdateResume
  });

  // Notify parent component when theme changes
  useEffect(() => {
    if (onColorThemeChange) {
      onColorThemeChange(selectedTheme);
    }
  }, [selectedTheme, onColorThemeChange]);

  return (
    <div className="space-y-8">
      <RelevantSkillsCard relevantSkills={relevantSkills} />

      <SummaryEditor
        currentSummary={profile.personalInfo.summary || ""}
        jobDescription={jobDescription}
        relevantSkills={relevantSkills}
        onSummaryChange={handleSummaryChange}
      />

      <SkillManagement
        profileSkills={profile.skills}
        relevantSkills={relevantSkills}
        missingSkills={missingSkills}
        skillsToAdd={skillsToAdd}
        skillsToRemove={skillsToRemove}
        onToggleSkillToAdd={toggleSkillSelection}
        onToggleSkillToRemove={toggleSkillRemoval}
      />

      <ResumeColorSelector 
        selectedTheme={selectedTheme} 
        onThemeChange={handleThemeChange}
      />

      <ExperienceEditor 
        experiences={tailoredExperiences}
        onBulletChange={handleBulletChange}
        onRemoveBullet={removeBullet}
        onAddBullet={addBullet}
        generateBulletSuggestions={generateBulletSuggestions}
        jobDescription={jobDescription}
        relevantSkills={relevantSkills}
      />

      <ResumePreview 
        profile={{
          ...profile,
          personalInfo: {
            ...profile.personalInfo,
            summary: updatedSummary
          }
        }}
        experiences={tailoredExperiences}
        skillsToAdd={skillsToAdd}
        skillsToRemove={skillsToRemove}
        relevantSkills={relevantSkills}
        colorTheme={selectedTheme}
      />

      <Button
        onClick={saveTailoredResume}
        className="w-full bg-navy-700 hover:bg-navy-800"
      >
        Save Tailored Resume
      </Button>
    </div>
  );
};

export default TailorResume;

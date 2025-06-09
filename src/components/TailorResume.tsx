
import { Button } from "@/components/ui/button";
import { Profile } from "@/types/profile";
import { Experience } from "@/components/ExperienceForm";
import { Skill } from "@/components/SkillsForm";
import { RotateCcw } from "lucide-react";

// Import refactored components
import RelevantSkillsCard from "./resume-tailoring/RelevantSkillsCard";
import MissingSkillsCard from "./resume-tailoring/MissingSkillsCard";
import ExperienceEditor from "./resume-tailoring/ExperienceEditor";
import ResumePreview from "./resume-tailoring/ResumePreview";
import SkillManagement from "./resume-tailoring/SkillManagement";
import ResumeColorSelector from "./resume-tailoring/ResumeColorSelector";
import SummaryEditor from "./resume-tailoring/SummaryEditor";
import ExperienceSelector from "./resume-tailoring/ExperienceSelector";
import CoverLetterGenerator from "./resume-tailoring/CoverLetterGenerator";

// Import our refactored hook
import useTailorResume from "@/hooks/useTailorResume";
import { useEffect } from "react";

interface TailorResumeProps {
  profile: Profile;
  relevantSkills: string[];
  missingSkills: string[];
  onUpdateResume: (experiences: Experience[], skills: Skill[]) => void;
  jobDescription?: string;
  onColorThemeChange?: (theme: string) => void;
}

const TailorResume = ({
  profile,
  relevantSkills,
  missingSkills,
  onUpdateResume,
  jobDescription = "",
  onColorThemeChange,
}: TailorResumeProps) => {
  // Use our refactored custom hook for state and logic
  const {
    tailoredExperiences,
    skillsToAdd,
    skillsToRemove,
    selectedTheme,
    updatedSummary,
    selectedExperienceIds,
    handleBulletChange,
    addBullet,
    removeBullet,
    toggleSkillSelection,
    toggleSkillRemoval,
    generateBulletSuggestions,
    handleThemeChange,
    handleSummaryChange,
    handleExperienceSelectionChange,
    saveTailoredResume,
    resetTailoredResume
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

      <ExperienceSelector
        experiences={profile.experiences}
        selectedExperiences={selectedExperienceIds}
        onSelectionChange={handleExperienceSelectionChange}
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

      <div className="flex gap-4">
        <Button
          onClick={saveTailoredResume}
          className="flex-1 bg-navy-700 hover:bg-navy-800"
        >
          Save Tailored Resume
        </Button>
        
        <Button
          onClick={resetTailoredResume}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset for New Job
        </Button>
      </div>
    </div>
  );
};

export default TailorResume;


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
  onResetForNewJob?: () => void;
  onSummaryChange?: (summary: string) => void;
  tailoredSummary?: string;
}

const TailorResume = ({
  profile,
  relevantSkills,
  missingSkills,
  onUpdateResume,
  jobDescription = "",
  onColorThemeChange,
  onResetForNewJob,
  onSummaryChange,
  tailoredSummary = "",
}: TailorResumeProps) => {
  // Use our refactored custom hook for state and logic
  const {
    tailoredExperiences,
    skillsToAdd,
    skillsToRemove,
    selectedTheme,
    selectedExperienceIds,
    handleBulletChange,
    addBullet,
    removeBullet,
    reorderBullets,
    toggleSkillSelection,
    toggleSkillRemoval,
    generateBulletSuggestions,
    handleThemeChange,
    handleExperienceSelectionChange,
    saveTailoredResume,
    resetTailoredResume,
    handleSummaryChange
  } = useTailorResume({
    profile,
    relevantSkills,
    jobDescription,
    onUpdateResume,
    onSummaryChange,
    tailoredSummary
  });

  // Notify parent component when theme changes
  useEffect(() => {
    if (onColorThemeChange) {
      onColorThemeChange(selectedTheme);
    }
  }, [selectedTheme, onColorThemeChange]);

  // Handle reset for new job - call both internal reset and parent reset
  const handleResetForNewJob = () => {
    resetTailoredResume();
    if (onResetForNewJob) {
      onResetForNewJob();
    }
  };

  // Handle syncing bullet changes back to profile
  const handleSyncToProfile = (experienceId: string, bulletIndex: number | null, newBullet: string) => {
    // Create updated experiences array
    const updatedExperiences = profile.experiences.map(exp => {
      if (exp.id === experienceId) {
        if (bulletIndex === null) {
          // Add new bullet
          return {
            ...exp,
            bullets: [...exp.bullets, newBullet]
          };
        } else {
          // Replace existing bullet
          const updatedBullets = [...exp.bullets];
          updatedBullets[bulletIndex] = newBullet;
          return {
            ...exp,
            bullets: updatedBullets
          };
        }
      }
      return exp;
    });

    // Update the profile with new experiences
    const updatedProfile = {
      ...profile,
      experiences: updatedExperiences
    };

    // Call the onUpdateResume callback to persist changes
    onUpdateResume(updatedExperiences, profile.skills);
  };

  return (
    <div className="space-y-8">
      <RelevantSkillsCard relevantSkills={relevantSkills} />

      <SummaryEditor
        currentSummary={tailoredSummary || profile.personalInfo.summary || ""}
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
        onReorderBullets={reorderBullets}
        generateBulletSuggestions={generateBulletSuggestions}
        jobDescription={jobDescription}
        relevantSkills={relevantSkills}
        profile={profile}
        onSyncToProfile={handleSyncToProfile}
      />

      <ResumePreview 
        profile={{
          ...profile,
          personalInfo: {
            ...profile.personalInfo,
            summary: tailoredSummary || profile.personalInfo.summary || ""
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
          onClick={handleResetForNewJob}
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

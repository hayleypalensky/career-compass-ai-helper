
import { Profile } from "@/types/profile";
import { Skill } from "@/components/SkillsForm";
import { ResumeColorTheme, colorThemes } from "./ResumeColorSelector";
import ResumeHeader from "./ResumeHeader";
import ResumeSummary from "./ResumeSummary";
import ResumeEducation from "./ResumeEducation";
import ResumeExperience from "./ResumeExperience";
import ResumeSkills from "./ResumeSkills";

interface ResumePreviewProps {
  profile: Profile;
  experiences: any[];
  skillsToAdd: string[];
  skillsToRemove: string[];
  relevantSkills: string[];
  colorTheme?: string;
}

const ResumePreview = ({ 
  profile, 
  experiences, 
  skillsToAdd,
  skillsToRemove,
  relevantSkills,
  colorTheme = "purple"
}: ResumePreviewProps) => {
  // Find the selected theme object
  const theme: ResumeColorTheme = colorThemes.find(theme => theme.id === colorTheme) || colorThemes[0];

  return (
    <div className="space-y-4" id="resume-content">
      <div className="p-4 border rounded-lg bg-white max-w-[800px] mx-auto resume-inner">
        {/* Header Section */}
        <ResumeHeader personalInfo={profile.personalInfo} theme={theme} />
        
        {/* Professional Summary */}
        <ResumeSummary summary={profile.personalInfo.summary} theme={theme} />
        
        {/* Education Section */}
        <ResumeEducation education={profile.education} theme={theme} />
        
        {/* Experience Section */}
        <ResumeExperience experiences={experiences} theme={theme} />
        
        {/* Skills Section */}
        <ResumeSkills 
          skills={profile.skills} 
          skillsToAdd={skillsToAdd} 
          skillsToRemove={skillsToRemove} 
          relevantSkills={relevantSkills} 
          theme={theme} 
        />
      </div>
    </div>
  );
};

export default ResumePreview;

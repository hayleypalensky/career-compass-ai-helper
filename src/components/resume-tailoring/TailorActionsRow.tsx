
import ResumePdfExport from "@/components/ResumePdfExport";
import ResumeApiExport from "@/components/ResumeApiExport";
import AddToJobTracker from "@/components/AddToJobTracker";
import { Profile } from "@/types/profile";
import { Experience } from "@/components/ExperienceForm";

interface TailorActionsRowProps {
  profile: Profile;
  jobTitle: string;
  companyName: string;
  location: string;
  remote: boolean;
  jobDescription: string;
  colorTheme: string;
  updatedSummary?: string;
  tailoredExperiences?: Experience[];
  skillsToAdd?: string[];
  skillsToRemove?: string[];
}

const TailorActionsRow = ({
  profile,
  jobTitle,
  companyName,
  location,
  remote,
  jobDescription,
  colorTheme,
  updatedSummary,
  tailoredExperiences = [],
  skillsToAdd = [],
  skillsToRemove = []
}: TailorActionsRowProps) => {
  // Always create a profile with the updated summary for PDF export
  const profileForPdf = {
    ...profile,
    personalInfo: {
      ...profile.personalInfo,
      summary: updatedSummary || profile.personalInfo.summary || ""
    }
  };

  console.log('TailorActionsRow - Updated summary for PDF:', updatedSummary);
  console.log('TailorActionsRow - Profile summary for PDF:', profileForPdf.personalInfo.summary);

  return (
    <div className="flex flex-col md:flex-row gap-4 mt-6">
      <ResumeApiExport 
        profile={profileForPdf}
        tailoredExperiences={tailoredExperiences}
        skillsToAdd={skillsToAdd}
        skillsToRemove={skillsToRemove}
        jobTitle={jobTitle}
        companyName={companyName}
      />
      
      <ResumePdfExport 
        profile={profileForPdf}
        jobTitle={jobTitle}
        companyName={companyName}
        colorTheme={colorTheme}
      />
      
      <AddToJobTracker
        key={`${jobTitle}-${companyName}-${location}`}
        jobTitle={jobTitle}
        companyName={companyName}
        location={location}
        remote={remote}
        jobDescription={jobDescription}
      />
    </div>
  );
};

export default TailorActionsRow;

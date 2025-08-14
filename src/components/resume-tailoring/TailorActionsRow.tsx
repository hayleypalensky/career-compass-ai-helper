
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
    <div className="space-y-6 mt-6">
      {/* Primary download section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg">Download Resume</h3>
          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">Recommended</span>
        </div>
        <ResumeApiExport 
          profile={profileForPdf}
          tailoredExperiences={tailoredExperiences}
          skillsToAdd={skillsToAdd}
          skillsToRemove={skillsToRemove}
          jobTitle={jobTitle}
          companyName={companyName}
        />
        <p className="text-sm text-muted-foreground">
          Professional formatting with optimized layout and styling
        </p>
      </div>

      {/* Action buttons row */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Basic PDF fallback */}
        <div className="flex-1">
          <ResumePdfExport 
            profile={profileForPdf}
            jobTitle={jobTitle}
            companyName={companyName}
            colorTheme={colorTheme}
          />
        </div>
        
        {/* Add to job tracker */}
        <div className="flex-1">
          <AddToJobTracker
            key={`${jobTitle}-${companyName}-${location}`}
            jobTitle={jobTitle}
            companyName={companyName}
            location={location}
            remote={remote}
            jobDescription={jobDescription}
          />
        </div>
      </div>
    </div>
  );
};

export default TailorActionsRow;

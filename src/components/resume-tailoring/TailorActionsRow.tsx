
import ResumePdfExport from "@/components/ResumePdfExport";
import AddToJobTracker from "@/components/AddToJobTracker";
import { Profile } from "@/types/profile";

interface TailorActionsRowProps {
  profile: Profile;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  colorTheme: string;
}

const TailorActionsRow = ({
  profile,
  jobTitle,
  companyName,
  jobDescription,
  colorTheme
}: TailorActionsRowProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mt-6">
      <ResumePdfExport 
        profile={profile}
        jobTitle={jobTitle}
        companyName={companyName}
        colorTheme={colorTheme}
      />
      
      <AddToJobTracker
        key={`${jobTitle}-${companyName}`}
        jobTitle={jobTitle}
        companyName={companyName}
        jobDescription={jobDescription}
      />
    </div>
  );
};

export default TailorActionsRow;

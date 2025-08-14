import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Download } from "lucide-react";
import { Profile } from "@/types/profile";
import { Experience } from "@/components/ExperienceForm";
import { transformProfileForApi, generateResumeFromApi, downloadResumeBlob } from "@/services/resumeApiService";

interface ResumeApiExportProps {
  profile: Profile;
  tailoredExperiences?: Experience[];
  skillsToAdd?: string[];
  skillsToRemove?: string[];
  jobTitle?: string;
  companyName?: string;
}

const ResumeApiExport = ({ 
  profile, 
  tailoredExperiences = [],
  skillsToAdd = [],
  skillsToRemove = [],
  jobTitle,
  companyName
}: ResumeApiExportProps) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const exportResume = async () => {
    setIsExporting(true);
    
    try {
      toast({
        title: "Generating professional resume",
        description: "Please wait while we create your formatted PDF...",
      });
      
      const apiData = transformProfileForApi(profile, tailoredExperiences, skillsToAdd, skillsToRemove);
      console.log('Transformed data for API:', JSON.stringify(apiData, null, 2));
      const blob = await generateResumeFromApi(apiData);
      
      const filename = jobTitle && companyName 
        ? `${profile.personalInfo.name.replace(/\s+/g, '_')}_${jobTitle}_${companyName}.pdf`.replace(/[^a-zA-Z0-9._-]/g, '')
        : `${profile.personalInfo.name.replace(/\s+/g, '_')}_resume.pdf`;
      
      downloadResumeBlob(blob, filename);
      
      toast({
        title: "Resume downloaded successfully",
        description: "Your professionally formatted resume has been downloaded.",
      });
    } catch (error) {
      console.error("Resume export error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to connect to resume API";
      toast({
        title: "Export failed",
        description: errorMessage.includes('CORS') || errorMessage.includes('connect') 
          ? "Unable to connect to the resume formatting service. The server may be unavailable or there may be a connection issue."
          : errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      onClick={exportResume} 
      variant="default" 
      disabled={isExporting}
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      {isExporting ? "Generating..." : "Download Professional Resume"}
    </Button>
  );
};

export default ResumeApiExport;
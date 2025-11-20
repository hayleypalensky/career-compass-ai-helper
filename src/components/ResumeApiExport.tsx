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
  selectedTheme?: string; // Add selectedTheme prop
  customColor?: string; // Add customColor prop
}

const ResumeApiExport = ({ 
  profile, 
  tailoredExperiences = [],
  skillsToAdd = [],
  skillsToRemove = [],
  jobTitle,
  companyName,
  selectedTheme = "purple",
  customColor
}: ResumeApiExportProps) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const exportResume = async () => {
    setIsExporting(true);
    
    try {
      toast({
        title: "Generating professional resume",
        description: "Please wait while we create your formatted PDF. This may take up to 60 seconds if the service needs to start up...",
      });
      
      console.log('ResumeApiExport - selectedTheme:', selectedTheme, 'customColor:', customColor);
      const apiData = transformProfileForApi(profile, tailoredExperiences, skillsToAdd, skillsToRemove, selectedTheme, customColor);
      console.log('API data being sent:', JSON.stringify(apiData, null, 2));
      const blob = await generateResumeFromApi(apiData);
      
      const filename = companyName 
        ? `${profile.personalInfo.name} Resume - ${companyName}.pdf`
        : `${profile.personalInfo.name} Resume.pdf`;
      
      
      downloadResumeBlob(blob, filename);
      
      toast({
        title: "Resume downloaded successfully",
        description: "Your professionally formatted resume has been downloaded.",
      });
    } catch (error) {
      console.error("Resume export error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to connect to resume API";
      
      // Show error with more specific guidance
      toast({
        title: "Professional PDF service unavailable",
        description: "The Render API is returning an error (500). Please check your Render logs or use the Basic PDF export as a fallback.",
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
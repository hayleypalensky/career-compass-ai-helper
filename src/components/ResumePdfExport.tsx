
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { FileText } from "lucide-react";
import { Profile } from "@/types/profile";
import { generatePdf } from "@/utils/pdfGenerator";

interface ResumePdfExportProps {
  profile: Profile;
  jobTitle?: string;
  companyName?: string;
  colorTheme?: string;
}

const ResumePdfExport = ({ profile, jobTitle, companyName, colorTheme = "purple" }: ResumePdfExportProps) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const exportToPdf = async () => {
    setIsExporting(true);
    
    try {
      toast({
        title: "Generating PDF",
        description: "Please wait while we create a high-quality PDF...",
      });
      
      await generatePdf({
        profile,
        jobTitle,
        companyName
      });
      
      toast({
        title: "PDF exported successfully",
        description: "Your tailored resume has been exported as a high-quality PDF",
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your resume to PDF",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      onClick={exportToPdf} 
      variant="outline" 
      disabled={isExporting}
      className="flex items-center gap-2"
    >
      <FileText className="h-4 w-4" />
      {isExporting ? "Generating PDF..." : "Export to PDF"}
    </Button>
  );
};

export default ResumePdfExport;

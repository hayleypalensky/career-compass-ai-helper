
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { FileText } from "lucide-react";
import { Profile } from "@/types/profile";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ResumePdfExportProps {
  profile: Profile;
  jobTitle?: string;
  companyName?: string;
  colorTheme?: string; // Added colorTheme prop
}

const ResumePdfExport = ({ profile, jobTitle, companyName, colorTheme = "purple" }: ResumePdfExportProps) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const exportToPdf = async () => {
    const resumeElement = document.getElementById("resume-content");
    
    if (!resumeElement) {
      toast({
        title: "Export failed",
        description: "Could not find resume content to export",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      // Create a temporary clone with proper styling for PDF
      const tempContainer = document.createElement("div");
      tempContainer.className = "pdf-export-container";
      tempContainer.style.width = "800px"; // Fixed width for PDF
      tempContainer.style.padding = "40px";
      tempContainer.style.backgroundColor = "white";
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px"; // Position off-screen
      
      // Add specific styles for PDF export to ensure proper vertical alignment
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        .pdf-export-container .skills-item {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          height: 100% !important;
          vertical-align: middle !important;
        }
        .pdf-export-container .skills-container {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 8px !important;
          margin: 0 10px !important;
        }
        .pdf-export-container .resume-content-inner {
          padding: 25px !important;
          margin: 15px !important;
        }
      `;
      document.head.appendChild(styleElement);
      
      // Clone the resume content
      const cloneContent = resumeElement.cloneNode(true) as HTMLElement;
      
      // Add classes to skills items in the clone for PDF export
      const skillItems = cloneContent.querySelectorAll('.skill-item');
      skillItems.forEach(item => {
        item.classList.add('skills-item');
      });
      
      const skillsContainer = cloneContent.querySelector('.skills-wrapper');
      if (skillsContainer) {
        skillsContainer.classList.add('skills-container');
      }
      
      // Add class for margins
      const resumeInner = cloneContent.querySelector('.resume-inner');
      if (resumeInner) {
        resumeInner.classList.add('resume-content-inner');
      }
      
      tempContainer.appendChild(cloneContent);
      document.body.appendChild(tempContainer);

      // Generate PDF from the temporary container
      const canvas = await html2canvas(tempContainer, {
        scale: 2, // Higher resolution
        logging: false,
        backgroundColor: "#ffffff",
      });
      
      document.body.removeChild(tempContainer);
      document.head.removeChild(styleElement); // Clean up the style

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      
      // Calculate dimensions
      const imgWidth = 210; // A4 width in mm (portrait)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      
      // Generate filename with job info if available
      const filenameParts = ["tailored_resume"];
      if (companyName) filenameParts.push(companyName.toLowerCase().replace(/\s+/g, "_"));
      if (jobTitle) filenameParts.push(jobTitle.toLowerCase().replace(/\s+/g, "_"));
      
      pdf.save(`${filenameParts.join("_")}.pdf`);
      
      toast({
        title: "PDF exported successfully",
        description: "Your tailored resume has been exported as a PDF",
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
      {isExporting ? "Exporting..." : "Export to PDF"}
    </Button>
  );
};

export default ResumePdfExport;


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
  colorTheme?: string;
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
        .pdf-export-container .skill-item {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          height: 32px !important; /* Fixed height */
          margin: 4px !important;
          padding: 0 12px !important;
          vertical-align: middle !important;
          line-height: 32px !important;
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
        /* Ensure the skills wrapper is visible */
        .pdf-export-container .skills-wrapper {
          display: block !important;
          width: 100% !important;
          margin-bottom: 16px !important;
        }
      `;
      document.head.appendChild(styleElement);
      
      // Clone the resume content
      const cloneContent = resumeElement.cloneNode(true) as HTMLElement;
      
      // Force display block on skills section
      const skillsSection = cloneContent.querySelector('.skills-wrapper');
      if (skillsSection) {
        skillsSection.setAttribute('style', 'display: block !important; width: 100% !important; margin-bottom: 16px !important;');
      }
      
      // Add classes to skills items in the clone for PDF export
      const skillItems = cloneContent.querySelectorAll('.skill-item');
      skillItems.forEach(item => {
        item.classList.add('skill-item'); // Make sure the class is applied
        (item as HTMLElement).style.display = 'inline-flex';
        (item as HTMLElement).style.alignItems = 'center';
        (item as HTMLElement).style.justifyContent = 'center';
      });
      
      const skillsContainer = cloneContent.querySelector('.skills-wrapper');
      if (skillsContainer) {
        skillsContainer.classList.add('skills-container');
        (skillsContainer as HTMLElement).style.display = 'block';
        (skillsContainer as HTMLElement).style.width = '100%';
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
        onclone: function(clonedDoc, element) {
          // Additional manipulation on the cloned document
          const skillsWrapper = element.querySelector('.skills-wrapper');
          if (skillsWrapper) {
            (skillsWrapper as HTMLElement).style.display = 'block';
            (skillsWrapper as HTMLElement).style.visibility = 'visible';
            (skillsWrapper as HTMLElement).style.opacity = '1';
          }
        }
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

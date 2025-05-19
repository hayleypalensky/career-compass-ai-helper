
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
      tempContainer.style.width = "794px"; // A4 width in pixels (slightly adjusted)
      tempContainer.style.padding = "30px";
      tempContainer.style.backgroundColor = "white";
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px"; // Position off-screen
      tempContainer.style.fontSize = "12px"; // Control font size to fit content
      
      // Add specific styles for PDF export to ensure proper layout
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        .pdf-export-container {
          font-size: 12px !important;
        }
        .pdf-export-container h2 {
          font-size: 18px !important;
          margin-bottom: 8px !important;
        }
        .pdf-export-container h3 {
          font-size: 14px !important;
          margin-bottom: 6px !important;
        }
        .pdf-export-container .skill-item {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          height: 24px !important; /* Smaller height */
          margin: 2px !important;
          padding: 0 8px !important;
          vertical-align: middle !important;
          line-height: 24px !important;
          font-size: 10px !important;
        }
        .pdf-export-container .skills-container {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 4px !important;
          margin: 0 5px !important;
        }
        .pdf-export-container .resume-content-inner {
          padding: 15px !important;
          margin: 10px !important;
        }
        /* Ensure the skills wrapper is visible */
        .pdf-export-container .skills-wrapper {
          display: block !important;
          width: 100% !important;
          margin-bottom: 10px !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        /* Reduce spacing between items */
        .pdf-export-container .mb-6 {
          margin-bottom: 12px !important;
        }
        .pdf-export-container .mb-3 {
          margin-bottom: 6px !important;
        }
        .pdf-export-container .space-y-4 {
          margin-top: 6px !important;
        }
        .pdf-export-container .space-y-3 {
          margin-top: 4px !important;
        }
        /* Make text smaller for descriptions */
        .pdf-export-container .text-xs {
          font-size: 9px !important;
        }
        .pdf-export-container .text-sm {
          font-size: 10px !important;
        }
      `;
      document.head.appendChild(styleElement);
      
      // Clone the resume content
      const cloneContent = resumeElement.cloneNode(true) as HTMLElement;
      
      // Force display of skills section
      const skillsSection = cloneContent.querySelector('.skills-wrapper');
      if (skillsSection) {
        (skillsSection as HTMLElement).style.display = 'block';
        (skillsSection as HTMLElement).style.width = '100%';
        (skillsSection as HTMLElement).style.marginBottom = '10px';
        (skillsSection as HTMLElement).style.visibility = 'visible';
        (skillsSection as HTMLElement).style.opacity = '1';
        (skillsSection as HTMLElement).style.position = 'relative';
      }
      
      // Add classes to skills items in the clone for PDF export
      const skillItems = cloneContent.querySelectorAll('.skill-item');
      skillItems.forEach(item => {
        item.classList.add('skill-item'); 
        (item as HTMLElement).style.display = 'inline-flex';
        (item as HTMLElement).style.alignItems = 'center';
        (item as HTMLElement).style.justifyContent = 'center';
        (item as HTMLElement).style.height = '24px';
        (item as HTMLElement).style.fontSize = '10px';
      });
      
      const skillsContainer = cloneContent.querySelector('.skills-wrapper .flex');
      if (skillsContainer) {
        skillsContainer.classList.add('skills-container');
        (skillsContainer as HTMLElement).style.display = 'flex';
        (skillsContainer as HTMLElement).style.flexWrap = 'wrap';
        (skillsContainer as HTMLElement).style.gap = '4px';
      }
      
      // Reduce spacing in the resume
      const marginElements = cloneContent.querySelectorAll('.mb-6');
      marginElements.forEach(el => {
        (el as HTMLElement).style.marginBottom = '12px';
      });
      
      // Add class for margins
      const resumeInner = cloneContent.querySelector('.resume-inner');
      if (resumeInner) {
        resumeInner.classList.add('resume-content-inner');
        (resumeInner as HTMLElement).style.padding = '15px';
      }
      
      tempContainer.appendChild(cloneContent);
      document.body.appendChild(tempContainer);

      // Generate PDF from the temporary container with optimized settings
      const canvas = await html2canvas(tempContainer, {
        scale: 1.5, // Reduced from 2 to 1.5 for smaller file size
        logging: false,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: true,
        imageTimeout: 0, // No timeout
        onclone: function(clonedDoc, element) {
          // Additional manipulation on the cloned document
          const skillsWrapper = element.querySelector('.skills-wrapper');
          if (skillsWrapper) {
            (skillsWrapper as HTMLElement).style.display = 'block';
            (skillsWrapper as HTMLElement).style.visibility = 'visible';
            (skillsWrapper as HTMLElement).style.opacity = '1';
          }
          
          // Make sure all skill items are visible
          const skillItems = element.querySelectorAll('.skill-item');
          skillItems.forEach(item => {
            (item as HTMLElement).style.display = 'inline-flex';
            (item as HTMLElement).style.visibility = 'visible';
            (item as HTMLElement).style.opacity = '1';
          });
        }
      });
      
      document.body.removeChild(tempContainer);
      document.head.removeChild(styleElement); // Clean up the style

      const imgData = canvas.toDataURL("image/jpeg", 0.85); // Use JPEG with 85% quality instead of PNG
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true, // Enable PDF compression
      });
      
      // Calculate dimensions to fit A4 page
      const imgWidth = 210; // A4 width in mm (portrait)
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // If the image height exceeds A4 height, scale it down
      if (imgHeight > pageHeight) {
        const scale = pageHeight / imgHeight * 0.95; // 95% of max height to add some margin
        pdf.addImage(imgData, "JPEG", 0, 0, imgWidth * scale, imgHeight * scale);
      } else {
        pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
      }
      
      // Generate filename with job info if available
      const filenameParts = ["tailored_resume"];
      if (companyName) filenameParts.push(companyName.toLowerCase().replace(/\s+/g, "_"));
      if (jobTitle) filenameParts.push(jobTitle.toLowerCase().replace(/\s+/g, "_"));
      
      // Set PDF metadata to optimize file size
      pdf.setProperties({
        title: `Resume for ${profile.personalInfo.name || 'Candidate'}`,
        subject: `Tailored resume for ${jobTitle || 'position'} at ${companyName || 'company'}`,
        creator: 'Resume Builder',
        producer: 'Resume Builder',
      });
      
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

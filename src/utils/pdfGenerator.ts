
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Profile } from "@/types/profile";
import { applyPdfStyles, getPdfStylesContent, styleSkillsForPdf } from "./pdfStyles";

export interface PdfExportOptions {
  profile: Profile;
  jobTitle?: string;
  companyName?: string;
}

/**
 * Prepares the DOM element for PDF export
 * @param resumeElement The original resume element
 * @returns A temporary container with the cloned content
 */
export const prepareElementForExport = (resumeElement: HTMLElement): { 
  tempContainer: HTMLElement; 
  styleElement: HTMLStyleElement;
} => {
  // Create a temporary clone with proper styling for PDF
  const tempContainer = document.createElement("div");
  applyPdfStyles(tempContainer);
  
  // Add specific styles for PDF export to ensure proper layout
  const styleElement = document.createElement('style');
  styleElement.textContent = getPdfStylesContent();
  document.head.appendChild(styleElement);
  
  // Clone the resume content
  const cloneContent = resumeElement.cloneNode(true) as HTMLElement;
  
  // Apply styles to ensure skills are visible in the PDF
  styleSkillsForPdf(cloneContent);
  
  tempContainer.appendChild(cloneContent);
  document.body.appendChild(tempContainer);

  return { tempContainer, styleElement };
};

/**
 * Generates a PDF file from the resume element
 * @param options The PDF export options
 * @returns A promise that resolves when the PDF is generated
 */
export const generatePdf = async (options: PdfExportOptions): Promise<void> => {
  const { profile, jobTitle, companyName } = options;
  const resumeElement = document.getElementById("resume-content");
  
  if (!resumeElement) {
    throw new Error("Could not find resume content to export");
  }

  const { tempContainer, styleElement } = prepareElementForExport(resumeElement);

  try {
    // Generate PDF from the temporary container with optimized settings for higher quality
    const canvas = await html2canvas(tempContainer, {
      scale: 2.5, // Increased from 1.5 to 2.5 for higher resolution
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
        
        // Remove asterisks from added skills in PDF export
        const addedSkills = element.querySelectorAll('.skill-item');
        addedSkills.forEach(item => {
          item.textContent = item.textContent?.replace('*', '');
        });
      }
    });
    
    // Use higher quality settings for image data
    const imgData = canvas.toDataURL("image/png", 1.0); // Use PNG with 100% quality instead of JPEG
    
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
      const scale = pageHeight / imgHeight * 0.98; // 98% of max height to add some margin
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth * scale, imgHeight * scale);
    } else {
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    }
    
    // Generate filename with job info if available
    const filenameParts = ["tailored_resume"];
    if (companyName) filenameParts.push(companyName.toLowerCase().replace(/\s+/g, "_"));
    if (jobTitle) filenameParts.push(jobTitle.toLowerCase().replace(/\s+/g, "_"));
    
    // Set PDF metadata to optimize file size
    pdf.setProperties({
      title: `Resume for ${profile.personalInfo.name || 'Candidate'}`,
      subject: `Tailored resume for ${jobTitle || 'position'} at ${companyName || 'company'}`,
      creator: 'Resume Builder'
    });
    
    pdf.save(`${filenameParts.join("_")}.pdf`);
    
    return Promise.resolve();
  } finally {
    // Clean up
    document.body.removeChild(tempContainer);
    document.head.removeChild(styleElement);
  }
};

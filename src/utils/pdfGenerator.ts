
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
      scale: 3, // Adjusted from 4 to 3 to better fit on a page
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
        
        // Apply font improvements for better text clarity
        const allTextElements = element.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, li');
        allTextElements.forEach(el => {
          const element = el as HTMLElement;
          // Use setProperty method for non-standard CSS properties
          element.style.setProperty('text-rendering', 'optimizeLegibility');
          element.style.setProperty('-webkit-font-smoothing', 'antialiased');
          element.style.setProperty('-moz-osx-font-smoothing', 'grayscale');
          element.style.letterSpacing = '-0.01em';
        });
        
        // Adjust spacing to fit better on one page
        const sectionHeaders = element.querySelectorAll('h2');
        sectionHeaders.forEach(header => {
          (header as HTMLElement).style.marginBottom = '4px';
        });
        
        const experienceItems = element.querySelectorAll('.experience-item');
        experienceItems.forEach(item => {
          (item as HTMLElement).style.marginBottom = '8px';
        });
        
        const bulletPoints = element.querySelectorAll('.bullet-point');
        bulletPoints.forEach(bullet => {
          (bullet as HTMLElement).style.marginBottom = '2px';
          (bullet as HTMLElement).style.lineHeight = '1.3';
        });
      }
    });
    
    // Use higher quality settings for image data
    const imgData = canvas.toDataURL("image/png", 1.0); // Use PNG with 100% quality
    
    // Create PDF with US Letter dimensions (8.5 x 11 inches)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "in",
      format: "letter", // US Letter (8.5 x 11 inches)
      compress: false, // Disable compression for better quality
      hotfixes: ["px_scaling"], // Apply hotfixes for better rendering
    });
    
    // Set 0.25 inch margins
    const margin = 0.25;
    const availableWidth = 8.5 - (margin * 2);
    const availableHeight = 11 - (margin * 2);
    
    // Calculate scaling to fit content to page with margins
    const contentAspectRatio = canvas.width / canvas.height;
    const pageAspectRatio = availableWidth / availableHeight;
    
    let scaledWidth, scaledHeight;
    
    if (contentAspectRatio > pageAspectRatio) {
      // Content is wider than page (relative to height)
      scaledWidth = availableWidth;
      scaledHeight = availableWidth / contentAspectRatio;
    } else {
      // Content is taller than page (relative to width)
      scaledHeight = availableHeight;
      scaledWidth = availableHeight * contentAspectRatio;
    }
    
    // Center the image on the page
    const xOffset = margin + (availableWidth - scaledWidth) / 2;
    const yOffset = margin + (availableHeight - scaledHeight) / 2;
    
    // Add the image to the PDF
    pdf.addImage(imgData, "PNG", xOffset, yOffset, scaledWidth, scaledHeight);
    
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

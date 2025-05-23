
import jsPDF from "jspdf";
import { Profile } from "@/types/profile";
import { COLORS, PDF_MARGINS } from "@/utils/pdf/constants";
import { ResumeColorTheme, colorThemes } from "@/components/resume-tailoring/ResumeColorSelector";
import { PdfExportOptions, PdfLayoutData } from "./pdf/types";
import { getSelectedTheme } from "./pdf/helpers";
import { renderHeaderSection } from "./pdf/sections/headerSection";
import { renderExperienceSection } from "./pdf/sections/experienceSection";
import { renderEducationSection } from "./pdf/sections/educationSection";
import { renderSkillsSection } from "./pdf/sections/skillsSection";
import { addFooter } from "./pdf/sections/footerSection";

/**
 * Generates an ATS-friendly PDF file from the resume data
 * @param options The PDF export options
 * @returns A promise that resolves when the PDF is generated
 */
export const generatePdf = async (options: PdfExportOptions): Promise<void> => {
  const { profile, jobTitle, companyName, colorTheme = "purple" } = options;
  
  try {
    // Create PDF with US Letter dimensions (8.5 x 11 inches)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "in",
      format: "letter", // US Letter (8.5 x 11 inches)
    });
    
    // Get selected color theme
    const themeColors = getSelectedTheme(colorTheme);
    
    // Set consistent margins
    const sideMargIn = PDF_MARGINS.left;
    const topBottomMargIn = PDF_MARGINS.top;

    // Set font for the entire document
    pdf.setFont("helvetica");
    
    // Layout data for sections
    const layoutData: PdfLayoutData = {
      yPos: topBottomMargIn,
      leftMargin: sideMargIn,
      pageWidth: 8.5 - (sideMargIn * 2),
      sideMargIn,
      topBottomMargIn,
      themeColors
    };
    
    // Render resume sections
    layoutData.yPos = renderHeaderSection(pdf, profile, layoutData);
    layoutData.yPos = renderExperienceSection(pdf, profile, layoutData);
    layoutData.yPos = renderEducationSection(pdf, profile, layoutData);
    layoutData.yPos = renderSkillsSection(pdf, profile, layoutData);
    
    // Add footer with page numbers
    addFooter(pdf, layoutData);
    
    // Set PDF metadata
    pdf.setProperties({
      title: `ATS-Friendly Resume for ${profile.personalInfo.name || 'Candidate'}`,
      subject: `Tailored resume for ${jobTitle || 'position'} at ${companyName || 'company'}`,
      creator: 'Resume Builder',
      keywords: 'resume, ats-friendly, job application'
    });
    
    // Generate filename with job info if available
    const filenameParts = ["ats_friendly_resume"];
    if (companyName) filenameParts.push(companyName.toLowerCase().replace(/\s+/g, "_"));
    if (jobTitle) filenameParts.push(jobTitle.toLowerCase().replace(/\s+/g, "_"));
    
    pdf.save(`${filenameParts.join("_")}.pdf`);
    
    return Promise.resolve();
  } catch (error) {
    console.error("PDF generation error:", error);
    return Promise.reject(error);
  }
};

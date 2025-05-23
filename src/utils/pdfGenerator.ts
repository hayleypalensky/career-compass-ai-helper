
import jsPDF from "jspdf";
import { Profile } from "@/types/profile";
import { PdfExportOptions } from "./pdf/types";
import { renderHeader } from "./pdf/sections/headerSection";
import { renderEducation } from "./pdf/sections/educationSection";
import { renderExperience } from "./pdf/sections/experienceSection";
import { renderSkills } from "./pdf/sections/skillsSection";
import { SPACING, PDF_DIMENSIONS } from "./pdf/constants";
import { getSelectedTheme } from "./pdf/helpers";

/**
 * Generates a clean, ATS-friendly PDF resume
 */
export const generatePdf = async (options: PdfExportOptions): Promise<void> => {
  const { profile, jobTitle, companyName, colorTheme } = options;
  
  try {
    // Create PDF with US Letter dimensions
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "in",
      format: "letter"
    });

    // Set consistent font
    pdf.setFont("helvetica");
    
    // Get theme colors
    const themeColors = getSelectedTheme(colorTheme);
    
    // Calculate content area
    const contentWidth = PDF_DIMENSIONS.width - (SPACING.margin * 2);
    const leftMargin = SPACING.margin;
    
    let yPosition = SPACING.margin;
    
    // Render sections in order: Header, Education, Experience, Skills
    yPosition = renderHeader(pdf, profile, leftMargin, contentWidth, yPosition, themeColors);
    yPosition = renderEducation(pdf, profile, leftMargin, contentWidth, yPosition, themeColors);
    yPosition = renderExperience(pdf, profile, leftMargin, contentWidth, yPosition, themeColors);
    yPosition = renderSkills(pdf, profile, leftMargin, contentWidth, yPosition, themeColors);
    
    // Set PDF metadata
    pdf.setProperties({
      title: `Resume - ${profile.personalInfo.name}`,
      subject: jobTitle ? `Resume for ${jobTitle}` : 'Professional Resume',
      creator: 'Resume Builder'
    });
    
    // Generate filename
    const fileName = [
      "resume",
      profile.personalInfo.name?.toLowerCase().replace(/\s+/g, "_"),
      companyName?.toLowerCase().replace(/\s+/g, "_"),
      jobTitle?.toLowerCase().replace(/\s+/g, "_")
    ].filter(Boolean).join("_") + ".pdf";
    
    pdf.save(fileName);
    
  } catch (error) {
    console.error("PDF generation error:", error);
    throw error;
  }
};

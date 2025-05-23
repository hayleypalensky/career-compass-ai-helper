
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
    const pageHeight = PDF_DIMENSIONS.height;
    const bottomMargin = SPACING.margin;
    const availableHeight = pageHeight - (SPACING.margin * 2); // Top and bottom margins
    
    let yPosition = SPACING.margin;
    
    // First pass: calculate content heights without rendering
    const headerHeight = calculateHeaderHeight(pdf, profile, leftMargin, contentWidth, themeColors);
    const educationHeight = calculateEducationHeight(pdf, profile, leftMargin, contentWidth, themeColors);
    const experienceHeight = calculateExperienceHeight(pdf, profile, leftMargin, contentWidth, themeColors);
    const skillsHeight = calculateSkillsHeight(pdf, profile, leftMargin, contentWidth, themeColors);
    
    // Calculate total content height
    const totalContentHeight = headerHeight + educationHeight + experienceHeight + skillsHeight;
    
    // Calculate spacing between sections to fill available space
    const sectionsCount = 4; // header, education, experience, skills
    const spacingBetweenSections = (availableHeight - totalContentHeight) / (sectionsCount - 1);
    
    // Render header section
    yPosition = renderHeader(pdf, profile, leftMargin, contentWidth, yPosition, themeColors);
    yPosition += spacingBetweenSections;
    
    // Render education section
    yPosition = renderEducation(pdf, profile, leftMargin, contentWidth, yPosition, themeColors);
    yPosition += spacingBetweenSections;
    
    // Calculate position for skills section (moved up 50px)
    // Convert 50px to inches (assuming 72dpi standard)
    const pixelsToInches = 50 / 72; // 50px converted to inches
    
    // Render skills section at an adjusted position (moved up)
    const skillsPosition = yPosition - pixelsToInches;
    yPosition = renderSkills(pdf, profile, leftMargin, contentWidth, skillsPosition, themeColors);
    
    // Then render experience section after skills 
    // (effectively swapping their order and moving skills up)
    yPosition = renderExperience(pdf, profile, leftMargin, contentWidth, yPosition, themeColors);
    
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

// Helper functions to calculate section heights
const calculateHeaderHeight = (
  pdf: jsPDF,
  profile: Profile,
  leftMargin: number,
  contentWidth: number,
  themeColors: { heading: string; accent: string; border: string }
): number => {
  const tempY = 100; // Temporary position
  const startY = tempY;
  const endY = renderHeader(pdf, profile, leftMargin, contentWidth, tempY, themeColors);
  return endY - startY - SPACING.section; // Subtract the section spacing added by renderHeader
};

const calculateEducationHeight = (
  pdf: jsPDF,
  profile: Profile,
  leftMargin: number,
  contentWidth: number,
  themeColors: { heading: string; accent: string; border: string }
): number => {
  if (!profile.education || profile.education.length === 0) {
    return 0;
  }
  const tempY = 100;
  const startY = tempY;
  const endY = renderEducation(pdf, profile, leftMargin, contentWidth, tempY, themeColors);
  return endY - startY - SPACING.section;
};

const calculateExperienceHeight = (
  pdf: jsPDF,
  profile: Profile,
  leftMargin: number,
  contentWidth: number,
  themeColors: { heading: string; accent: string; border: string }
): number => {
  if (!profile.experiences || profile.experiences.length === 0) {
    return 0;
  }
  const tempY = 100;
  const startY = tempY;
  const endY = renderExperience(pdf, profile, leftMargin, contentWidth, tempY, themeColors);
  return endY - startY - SPACING.section;
};

const calculateSkillsHeight = (
  pdf: jsPDF,
  profile: Profile,
  leftMargin: number,
  contentWidth: number,
  themeColors: { heading: string; accent: string; border: string }
): number => {
  if (!profile.skills || profile.skills.length === 0) {
    return 0;
  }
  const tempY = 100;
  const startY = tempY;
  const endY = renderSkills(pdf, profile, leftMargin, contentWidth, tempY, themeColors);
  return endY - startY;
};

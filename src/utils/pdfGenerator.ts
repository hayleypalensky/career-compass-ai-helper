
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
    const topMargin = SPACING.margin;
    const bottomMargin = SPACING.margin;
    const availableHeight = pageHeight - topMargin - bottomMargin;
    
    let yPosition = topMargin;
    
    // First pass: calculate content heights without rendering
    const headerHeight = calculateHeaderHeight(pdf, profile, leftMargin, contentWidth, themeColors);
    const educationHeight = calculateEducationHeight(pdf, profile, leftMargin, contentWidth, themeColors);
    const experienceHeight = calculateExperienceHeight(pdf, profile, leftMargin, contentWidth, themeColors);
    const skillsHeight = calculateSkillsHeight(pdf, profile, leftMargin, contentWidth, themeColors);
    
    // Calculate total content height
    const totalContentHeight = headerHeight + educationHeight + experienceHeight + skillsHeight;
    
    // Calculate spacing between sections - increased from previous value
    const sectionsCount = 4; // header, education, experience, skills
    const minSpacing = 0.2; // Increased minimum spacing between sections
    const maxAvailableForSpacing = availableHeight - totalContentHeight;
    const spacingBetweenSections = Math.max(minSpacing, Math.min(0.35, maxAvailableForSpacing / (sectionsCount - 1)));
    
    // If content is too tall, use minimum spacing
    if (totalContentHeight + (spacingBetweenSections * (sectionsCount - 1)) > availableHeight) {
      console.warn("Content may be too tall for single page, using minimum spacing");
    }
    
    // Render sections with calculated spacing
    yPosition = renderHeader(pdf, profile, leftMargin, contentWidth, yPosition, themeColors);
    yPosition += spacingBetweenSections;
    
    yPosition = renderEducation(pdf, profile, leftMargin, contentWidth, yPosition, themeColors);
    yPosition += spacingBetweenSections;
    
    yPosition = renderExperience(pdf, profile, leftMargin, contentWidth, yPosition, themeColors);
    yPosition += spacingBetweenSections;
    
    yPosition = renderSkills(pdf, profile, leftMargin, contentWidth, yPosition, themeColors);
    
    // Set PDF metadata
    pdf.setProperties({
      title: `Resume - ${profile.personalInfo.name}`,
      subject: jobTitle ? `Resume for ${jobTitle}` : 'Professional Resume',
      creator: 'Resume Builder'
    });
    
    // Generate filename with format: "Company Name - Full Name.pdf"
    let fileName = "";
    if (companyName && profile.personalInfo.name) {
      fileName = `${companyName} - ${profile.personalInfo.name}.pdf`;
    } else if (companyName) {
      fileName = `${companyName} - Resume.pdf`;
    } else if (profile.personalInfo.name) {
      fileName = `${profile.personalInfo.name} Resume.pdf`;
    } else {
      fileName = "Resume.pdf";
    }
    
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
  return endY - startY;
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
  return endY - startY;
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
  return endY - startY;
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

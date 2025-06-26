
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
 * Generates a clean, ATS-friendly PDF resume that adapts to fit on one page
 */
export const generatePdf = async (options: PdfExportOptions): Promise<void> => {
  const { profile, jobTitle, companyName, colorTheme } = options;
  
  console.log('PDF Generator - Profile summary:', profile.personalInfo.summary);
  
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
    
    // First pass: calculate content heights with normal sizing
    let scaleFactor = 1.0;
    let sectionSpacing = SPACING.section;
    
    // Try up to 3 iterations to find the right scale
    for (let attempt = 0; attempt < 3; attempt++) {
      const headerHeight = calculateHeaderHeight(pdf, profile, leftMargin, contentWidth, themeColors, scaleFactor);
      const educationHeight = calculateEducationHeight(pdf, profile, leftMargin, contentWidth, themeColors, scaleFactor);
      const experienceHeight = calculateExperienceHeight(pdf, profile, leftMargin, contentWidth, themeColors, scaleFactor);
      const skillsHeight = calculateSkillsHeight(pdf, profile, leftMargin, contentWidth, themeColors, scaleFactor);
      
      const totalContentHeight = headerHeight + educationHeight + experienceHeight + skillsHeight;
      const sectionsCount = 4; // header, education, experience, skills
      const totalHeightWithSpacing = totalContentHeight + (sectionSpacing * (sectionsCount - 1));
      
      console.log(`Attempt ${attempt + 1}: Total height ${totalHeightWithSpacing.toFixed(2)}, Available: ${availableHeight.toFixed(2)}, Scale: ${scaleFactor.toFixed(2)}`);
      
      if (totalHeightWithSpacing <= availableHeight) {
        // Content fits, proceed with rendering
        break;
      }
      
      if (attempt < 2) {
        // Adjust scale factor and spacing for next attempt
        const overage = totalHeightWithSpacing / availableHeight;
        scaleFactor = Math.max(0.7, scaleFactor / Math.sqrt(overage)); // Don't go below 70% scale
        sectionSpacing = Math.max(0.1, sectionSpacing * 0.7); // Reduce section spacing
      }
    }
    
    // Apply the final scale factor globally
    applyScaleFactor(pdf, scaleFactor);
    
    let yPosition = topMargin;
    
    // Render sections with calculated spacing and scale
    yPosition = renderHeader(pdf, profile, leftMargin, contentWidth, yPosition, themeColors, scaleFactor);
    yPosition += sectionSpacing;
    
    yPosition = renderEducation(pdf, profile, leftMargin, contentWidth, yPosition, themeColors, scaleFactor);
    yPosition += sectionSpacing;
    
    yPosition = renderExperience(pdf, profile, leftMargin, contentWidth, yPosition, themeColors, scaleFactor);
    yPosition += sectionSpacing;
    
    yPosition = renderSkills(pdf, profile, leftMargin, contentWidth, yPosition, themeColors, scaleFactor);
    
    console.log(`Final Y position: ${yPosition.toFixed(2)}, Page height: ${pageHeight.toFixed(2)}`);
    
    // Set PDF metadata
    pdf.setProperties({
      title: `Resume - ${profile.personalInfo.name}`,
      subject: jobTitle ? `Resume for ${jobTitle}` : 'Professional Resume',
      creator: 'Resume Builder'
    });
    
    // Generate filename with format: "Full Name Resume - Company Name.pdf"
    let fileName = "";
    if (profile.personalInfo.name && companyName) {
      fileName = `${profile.personalInfo.name} Resume - ${companyName}.pdf`;
    } else if (profile.personalInfo.name) {
      fileName = `${profile.personalInfo.name} Resume.pdf`;
    } else if (companyName) {
      fileName = `Resume - ${companyName}.pdf`;
    } else {
      fileName = "Resume.pdf";
    }
    
    pdf.save(fileName);
    
  } catch (error) {
    console.error("PDF generation error:", error);
    throw error;
  }
};

// Helper function to apply scale factor to PDF
const applyScaleFactor = (pdf: jsPDF, scaleFactor: number): void => {
  if (scaleFactor !== 1.0) {
    console.log(`Applying scale factor: ${scaleFactor.toFixed(2)}`);
    // The scale factor will be passed to individual render functions
    // This is a placeholder for any global scaling if needed
  }
};

// Helper functions to calculate section heights with scale factor
const calculateHeaderHeight = (
  pdf: jsPDF,
  profile: Profile,
  leftMargin: number,
  contentWidth: number,
  themeColors: { heading: string; accent: string; border: string },
  scaleFactor: number = 1.0
): number => {
  const tempY = 100; // Temporary position
  const startY = tempY;
  const endY = renderHeader(pdf, profile, leftMargin, contentWidth, tempY, themeColors, scaleFactor);
  return (endY - startY) * scaleFactor;
};

const calculateEducationHeight = (
  pdf: jsPDF,
  profile: Profile,
  leftMargin: number,
  contentWidth: number,
  themeColors: { heading: string; accent: string; border: string },
  scaleFactor: number = 1.0
): number => {
  if (!profile.education || profile.education.length === 0) {
    return 0;
  }
  const tempY = 100;
  const startY = tempY;
  const endY = renderEducation(pdf, profile, leftMargin, contentWidth, tempY, themeColors, scaleFactor);
  return (endY - startY) * scaleFactor;
};

const calculateExperienceHeight = (
  pdf: jsPDF,
  profile: Profile,
  leftMargin: number,
  contentWidth: number,
  themeColors: { heading: string; accent: string; border: string },
  scaleFactor: number = 1.0
): number => {
  if (!profile.experiences || profile.experiences.length === 0) {
    return 0;
  }
  const tempY = 100;
  const startY = tempY;
  const endY = renderExperience(pdf, profile, leftMargin, contentWidth, tempY, themeColors, scaleFactor);
  return (endY - startY) * scaleFactor;
};

const calculateSkillsHeight = (
  pdf: jsPDF,
  profile: Profile,
  leftMargin: number,
  contentWidth: number,
  themeColors: { heading: string; accent: string; border: string },
  scaleFactor: number = 1.0
): number => {
  if (!profile.skills || profile.skills.length === 0) {
    return 0;
  }
  const tempY = 100;
  const startY = tempY;
  const endY = renderSkills(pdf, profile, leftMargin, contentWidth, tempY, themeColors, scaleFactor);
  return (endY - startY) * scaleFactor;
};

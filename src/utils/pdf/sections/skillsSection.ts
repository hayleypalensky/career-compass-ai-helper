
import { Profile } from "@/types/profile";
import { COLORS } from "@/utils/pdf/constants";
import { jsPDF } from "jspdf";
import { PdfLayoutData } from "../types";

/**
 * Renders the skills section of the resume PDF
 */
export const renderSkillsSection = (
  pdf: jsPDF, 
  profile: Profile, 
  layoutData: PdfLayoutData
): number => {
  const { leftMargin, pageWidth, themeColors } = layoutData;
  let { yPos } = layoutData;

  if (!profile.skills || profile.skills.length === 0) {
    return yPos;
  }
  
  // Check if we need a new page before skills
  if (yPos > 9.5) {
    pdf.addPage();
    yPos = layoutData.topBottomMargIn + 0.2;
  }
  
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(themeColors.heading);
  pdf.text("Skills", leftMargin, yPos);
  yPos += 0.15;
  
  // Add a thin line under the section header
  pdf.setDrawColor(themeColors.border);
  pdf.setLineWidth(0.005);
  pdf.line(leftMargin, yPos, 8.5 - layoutData.sideMargIn, yPos);
  yPos += 0.2;
  
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(COLORS.black);
  
  // Group skills by category
  const skillsByCategory: Record<string, string[]> = {};
  profile.skills.forEach(skill => {
    if (!skillsByCategory[skill.category]) {
      skillsByCategory[skill.category] = [];
    }
    skillsByCategory[skill.category].push(skill.name);
  });
  
  // Display skills by category
  Object.entries(skillsByCategory).forEach(([category, skills], index) => {
    if (index > 0) yPos += 0.1;
    
    // Display category name in theme color
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(themeColors.heading);
    pdf.text(category + ":", leftMargin, yPos);
    
    // Calculate x position after category name
    const categoryWidth = pdf.getTextWidth(category + ": ");
    
    // Reset text color for skills
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(COLORS.black);
    
    // Join skills with commas
    const skillsText = skills.join(", ");
    const splitSkills = pdf.splitTextToSize(skillsText, pageWidth - categoryWidth - 0.1);
    
    // First line starts after category
    pdf.text(splitSkills[0], leftMargin + categoryWidth, yPos);
    
    // Subsequent lines start at left margin with proper indentation
    if (splitSkills.length > 1) {
      for (let i = 1; i < splitSkills.length; i++) {
        yPos += 0.15;
        pdf.text(splitSkills[i], leftMargin + 0.3, yPos);
      }
    }
    
    yPos += 0.2;
  });
  
  return yPos;
};


import { Profile } from "@/types/profile";
import { COLORS, FONT_SIZES, SPACING } from "@/utils/pdf/constants";
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
  
  // Section header
  pdf.setFontSize(FONT_SIZES.heading3);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(themeColors.heading);
  pdf.text("Skills", leftMargin, yPos);
  yPos += SPACING.xs;
  
  // Add a thin line under the section header
  pdf.setDrawColor(themeColors.border);
  pdf.setLineWidth(0.005);
  pdf.line(leftMargin, yPos, 8.5 - layoutData.sideMargIn, yPos);
  yPos += SPACING.sm;
  
  // Reset text settings
  pdf.setFontSize(FONT_SIZES.base);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(COLORS.black);
  
  // Extract all skill names without categories
  const allSkills = profile.skills.map(skill => skill.name);
  
  // Display all skills in a comma-separated list
  const skillsText = allSkills.join(", ");
  const splitSkills = pdf.splitTextToSize(skillsText, pageWidth);
  
  pdf.text(splitSkills, leftMargin, yPos);
  yPos += (splitSkills.length * 0.12); // Proper line spacing
  
  return yPos;
};


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
  
  // Section header - clean and consistent
  pdf.setFontSize(FONT_SIZES.heading3);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(themeColors.heading);
  pdf.text("SKILLS", leftMargin, yPos);
  yPos += SPACING.element;
  
  // Add a clean line under the section header
  pdf.setDrawColor(themeColors.border);
  pdf.setLineWidth(0.005);
  pdf.line(leftMargin, yPos, 8.5 - layoutData.sideMargIn, yPos);
  yPos += SPACING.md;
  
  // Reset text settings
  pdf.setFontSize(FONT_SIZES.base);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(COLORS.black);
  
  // Extract all skill names without categories
  const allSkills = profile.skills.map(skill => skill.name);
  
  // Display all skills in a clean, comma-separated list like reference
  const skillsText = allSkills.join(", ");
  const splitSkills = pdf.splitTextToSize(skillsText, pageWidth);
  
  pdf.text(splitSkills, leftMargin, yPos);
  yPos += (splitSkills.length * SPACING.bullet); // Clean skills line spacing
  
  return yPos;
};

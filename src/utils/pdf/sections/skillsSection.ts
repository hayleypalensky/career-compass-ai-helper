
import { Profile } from "@/types/profile";
import { COLORS, LETTER_SPACING } from "@/utils/pdf/constants";
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
  
  // Section header
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(themeColors.heading);
  pdf.setCharSpace(LETTER_SPACING.tight);
  pdf.text("Skills", leftMargin, yPos);
  pdf.setCharSpace(0);
  yPos += 0.15;
  
  // Add a thin line under the section header
  pdf.setDrawColor(themeColors.border);
  pdf.setLineWidth(0.005);
  pdf.line(leftMargin, yPos, 8.5 - layoutData.sideMargIn, yPos);
  yPos += 0.2;
  
  // Reset text settings
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(COLORS.black);
  pdf.setCharSpace(LETTER_SPACING.normal);
  
  // Extract all skill names without categories
  const allSkills = profile.skills.map(skill => skill.name);
  
  // Display all skills in a comma-separated list
  const skillsText = allSkills.join(", ");
  const splitSkills = pdf.splitTextToSize(skillsText, pageWidth);
  
  pdf.text(splitSkills, leftMargin, yPos);
  pdf.setCharSpace(0);
  yPos += (splitSkills.length * 0.15) + 0.1;
  
  return yPos;
};

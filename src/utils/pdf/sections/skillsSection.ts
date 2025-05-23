
import { jsPDF } from "jspdf";
import { Profile } from "@/types/profile";
import { FONT_SIZES, COLORS, SPACING } from "../constants";

export const renderSkills = (
  pdf: jsPDF,
  profile: Profile,
  leftMargin: number,
  contentWidth: number,
  yPos: number
): number => {
  if (!profile.skills || profile.skills.length === 0) {
    return yPos;
  }
  
  let currentY = yPos;
  
  // Section heading
  pdf.setFontSize(FONT_SIZES.heading);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(COLORS.black);
  pdf.text("SKILLS", leftMargin, currentY);
  currentY += SPACING.line;
  
  // Add line under heading
  pdf.setDrawColor(COLORS.black);
  pdf.setLineWidth(0.01);
  pdf.line(leftMargin, currentY, leftMargin + contentWidth, currentY);
  currentY += SPACING.line * 1.5;
  
  // Skills list
  pdf.setFontSize(FONT_SIZES.body);
  pdf.setFont("helvetica", "normal");
  
  const skillNames = profile.skills.map(skill => skill.name);
  const skillsText = skillNames.join(", ");
  const skillsLines = pdf.splitTextToSize(skillsText, contentWidth);
  
  pdf.text(skillsLines, leftMargin, currentY);
  currentY += skillsLines.length * SPACING.line;
  
  return currentY;
};

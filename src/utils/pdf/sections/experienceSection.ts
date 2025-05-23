
import { jsPDF } from "jspdf";
import { Profile } from "@/types/profile";
import { FONT_SIZES, COLORS, SPACING, BULLET_CHAR } from "../constants";
import { formatDate } from "../helpers";

export const renderExperience = (
  pdf: jsPDF,
  profile: Profile,
  leftMargin: number,
  contentWidth: number,
  yPos: number
): number => {
  if (!profile.experiences || profile.experiences.length === 0) {
    return yPos;
  }
  
  let currentY = yPos;
  
  // Section heading
  pdf.setFontSize(FONT_SIZES.heading);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(COLORS.black);
  pdf.text("EXPERIENCE", leftMargin, currentY);
  currentY += SPACING.line;
  
  // Add line under heading
  pdf.setDrawColor(COLORS.black);
  pdf.setLineWidth(0.01);
  pdf.line(leftMargin, currentY, leftMargin + contentWidth, currentY);
  currentY += SPACING.line * 1.5;
  
  // Experience entries
  for (const exp of profile.experiences) {
    // Job title
    pdf.setFontSize(FONT_SIZES.subheading);
    pdf.setFont("helvetica", "bold");
    pdf.text(exp.title, leftMargin, currentY);
    currentY += SPACING.line;
    
    // Company and dates
    pdf.setFontSize(FONT_SIZES.body);
    pdf.setFont("helvetica", "normal");
    
    const companyText = exp.company + (exp.location ? `, ${exp.location}` : '');
    const dateText = `${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}`;
    
    pdf.text(companyText, leftMargin, currentY);
    
    // Right-align dates
    const dateWidth = pdf.getTextWidth(dateText);
    pdf.text(dateText, leftMargin + contentWidth - dateWidth, currentY);
    currentY += SPACING.line;
    
    // Bullet points
    pdf.setFontSize(FONT_SIZES.small);
    const bulletIndent = 0.2;
    
    for (const bullet of exp.bullets.filter(b => b.trim())) {
      const bulletText = `${BULLET_CHAR} ${bullet}`;
      const bulletLines = pdf.splitTextToSize(bulletText, contentWidth - bulletIndent);
      
      pdf.text(bulletLines, leftMargin + bulletIndent, currentY);
      currentY += bulletLines.length * SPACING.line + SPACING.bullet;
    }
    
    currentY += SPACING.subsection;
  }
  
  return currentY + SPACING.section;
};

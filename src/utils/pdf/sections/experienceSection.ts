import { jsPDF } from "jspdf";
import { Profile } from "@/types/profile";
import { FONT_SIZES, SPACING, BULLET_CHAR } from "../constants";
import { formatDate } from "../helpers";

export const renderExperience = (
  pdf: jsPDF,
  profile: Profile,
  leftMargin: number,
  contentWidth: number,
  yPos: number,
  themeColors: { heading: string; accent: string; border: string }
): number => {
  if (!profile.experiences || profile.experiences.length === 0) {
    return yPos;
  }
  
  let currentY = yPos;
  
  // Section heading
  pdf.setFontSize(FONT_SIZES.heading);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(themeColors.heading);
  pdf.text("EXPERIENCE", leftMargin, currentY);
  currentY += SPACING.line;
  
  // Add line under heading
  pdf.setDrawColor(themeColors.heading);
  pdf.setLineWidth(0.01);
  pdf.line(leftMargin, currentY, leftMargin + contentWidth, currentY);
  currentY += SPACING.line * 1.5;
  
  // Experience entries
  for (const exp of profile.experiences) {
    // Job title
    pdf.setFontSize(FONT_SIZES.subheading);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor("#000000"); // Keep content black for readability
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
    if (exp.bullets && exp.bullets.length > 0) {
      pdf.setFontSize(FONT_SIZES.body);
      const bulletIndent = 0.15; // Indent for bullets
      
      for (const bullet of exp.bullets) {
        if (bullet.trim()) {
          // Add bullet character
          pdf.text(BULLET_CHAR, leftMargin + bulletIndent, currentY);
          
          // Wrap bullet text
          const bulletLines = pdf.splitTextToSize(bullet, contentWidth - bulletIndent - 0.1);
          pdf.text(bulletLines, leftMargin + bulletIndent + 0.1, currentY);
          currentY += bulletLines.length * SPACING.line;
        }
      }
    }
    
    currentY += SPACING.subsection;
  }
  
  return currentY;
};

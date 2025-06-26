
import jsPDF from "jspdf";
import { Profile } from "@/types/profile";
import { FONT_SIZES, SPACING, COLORS, BULLET_CHAR } from "../constants";

export const renderExperience = (
  pdf: jsPDF,
  profile: Profile,
  leftMargin: number,
  contentWidth: number,
  yPosition: number,
  themeColors: { heading: string; accent: string; border: string },
  scaleFactor: number = 1.0
): number => {
  if (!profile.experiences || profile.experiences.length === 0) {
    return yPosition;
  }
  
  let currentY = yPosition;
  
  // Scale font sizes and spacing
  const headingSize = Math.round(FONT_SIZES.heading * scaleFactor);
  const subheadingSize = Math.round(FONT_SIZES.subheading * scaleFactor);
  const bodySize = Math.round(FONT_SIZES.body * scaleFactor);
  const lineSpacing = SPACING.line * scaleFactor;
  const subsectionSpacing = SPACING.subsection * scaleFactor;
  const bulletSpacing = SPACING.bullet * scaleFactor;
  
  // Section heading
  pdf.setFontSize(headingSize);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(themeColors.heading);
  pdf.text("EXPERIENCE", leftMargin, currentY);
  currentY += lineSpacing;
  
  // Add underline
  pdf.setDrawColor(themeColors.border);
  pdf.setLineWidth(0.5);
  pdf.line(leftMargin, currentY, leftMargin + contentWidth, currentY);
  currentY += subsectionSpacing;
  
  // Experience entries
  profile.experiences.forEach((exp, index) => {
    if (index > 0) {
      currentY += subsectionSpacing;
    }
    
    // Job title
    pdf.setFontSize(subheadingSize);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(COLORS.black);
    pdf.text(exp.title || "", leftMargin, currentY);
    currentY += lineSpacing;
    
    // Company and dates
    pdf.setFontSize(bodySize);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(COLORS.gray);
    
    const companyLine = [];
    if (exp.company) companyLine.push(exp.company);
    if (exp.startDate || exp.endDate) {
      const dateRange = `${exp.startDate || ''} - ${exp.endDate || 'Present'}`;
      companyLine.push(dateRange);
    }
    
    if (companyLine.length > 0) {
      pdf.text(companyLine.join(" • "), leftMargin, currentY);
      currentY += lineSpacing;
    }
    
    // Bullet points
    if (exp.bullets && exp.bullets.length > 0) {
      currentY += bulletSpacing;
      
      exp.bullets.forEach((bullet) => {
        if (bullet.trim()) {
          pdf.setFontSize(bodySize);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(COLORS.black);
          
          // Add bullet point
          pdf.text(BULLET_CHAR, leftMargin + 0.1, currentY);
          
          // Wrap text for bullet points with scaled width
          const bulletText = bullet.trim();
          const maxBulletWidth = contentWidth - 0.3; // Account for bullet indent
          const wrappedLines = pdf.splitTextToSize(bulletText, maxBulletWidth);
          
          wrappedLines.forEach((line: string, lineIndex: number) => {
            const xOffset = lineIndex === 0 ? 0.2 : 0.2; // Indent wrapped lines
            pdf.text(line, leftMargin + xOffset, currentY);
            currentY += lineSpacing * 0.9; // Slightly tighter line spacing for bullets
          });
          
          currentY += bulletSpacing * 0.5;
        }
      });
    }
  });
  
  return currentY;
};

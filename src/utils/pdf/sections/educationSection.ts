import { jsPDF } from "jspdf";
import { Profile } from "@/types/profile";
import { FONT_SIZES, SPACING } from "../constants";
import { formatDate } from "../helpers";

export const renderEducation = (
  pdf: jsPDF,
  profile: Profile,
  leftMargin: number,
  contentWidth: number,
  yPos: number,
  themeColors: { heading: string; accent: string; border: string }
): number => {
  if (!profile.education || profile.education.length === 0) {
    return yPos;
  }
  
  let currentY = yPos;
  
  // Section heading
  pdf.setFontSize(FONT_SIZES.heading);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(themeColors.heading);
  pdf.text("EDUCATION", leftMargin, currentY);
  currentY += SPACING.line;
  
  // Add line under heading
  pdf.setDrawColor(themeColors.heading);
  pdf.setLineWidth(0.01);
  pdf.line(leftMargin, currentY, leftMargin + contentWidth, currentY);
  currentY += SPACING.line * 1.5;
  
  // Sort education by date (most recent first)
  const sortedEducation = [...profile.education].sort((a, b) => {
    const dateA = a.endDate || a.startDate;
    const dateB = b.endDate || b.startDate;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
  
  // Education entries
  for (let i = 0; i < sortedEducation.length; i++) {
    const edu = sortedEducation[i];
    
    // Degree and field
    pdf.setFontSize(FONT_SIZES.subheading);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor("#000000"); // Keep content black for readability
    pdf.text(`${edu.degree} in ${edu.field}`, leftMargin, currentY);
    currentY += SPACING.line;
    
    // School and dates
    pdf.setFontSize(FONT_SIZES.body);
    pdf.setFont("helvetica", "normal");
    
    const schoolText = edu.school + ('location' in edu && edu.location ? `, ${edu.location}` : '');
    const dateText = `${formatDate(edu.startDate)} - ${edu.endDate ? formatDate(edu.endDate) : 'Present'}`;
    
    pdf.text(schoolText, leftMargin, currentY);
    
    // Right-align dates
    const dateWidth = pdf.getTextWidth(dateText);
    pdf.text(dateText, leftMargin + contentWidth - dateWidth, currentY);
    currentY += SPACING.line;
    
    // Description if available
    if (edu.description) {
      pdf.setFontSize(FONT_SIZES.small);
      pdf.setTextColor("#666666");
      const descLines = pdf.splitTextToSize(edu.description, contentWidth);
      pdf.text(descLines, leftMargin, currentY);
      currentY += descLines.length * SPACING.line;
      pdf.setTextColor("#000000");
    }
    
    // Add spacing between education entries (but not after the last one)
    if (i < sortedEducation.length - 1) {
      currentY += SPACING.subsection;
    }
  }
  
  return currentY;
};

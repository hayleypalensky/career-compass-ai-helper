
import { jsPDF } from "jspdf";
import { Profile } from "@/types/profile";
import { FONT_SIZES, COLORS, SPACING } from "../constants";
import { formatDate } from "../helpers";

export const renderEducation = (
  pdf: jsPDF,
  profile: Profile,
  leftMargin: number,
  contentWidth: number,
  yPos: number
): number => {
  if (!profile.education || profile.education.length === 0) {
    return yPos;
  }
  
  let currentY = yPos;
  
  // Section heading
  pdf.setFontSize(FONT_SIZES.heading);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(COLORS.black);
  pdf.text("EDUCATION", leftMargin, currentY);
  currentY += SPACING.line;
  
  // Add line under heading
  pdf.setDrawColor(COLORS.black);
  pdf.setLineWidth(0.01);
  pdf.line(leftMargin, currentY, leftMargin + contentWidth, currentY);
  currentY += SPACING.line * 1.5;
  
  // Education entries
  for (const edu of profile.education) {
    // Degree and field
    pdf.setFontSize(FONT_SIZES.subheading);
    pdf.setFont("helvetica", "bold");
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
      pdf.setTextColor(COLORS.gray);
      const descLines = pdf.splitTextToSize(edu.description, contentWidth);
      pdf.text(descLines, leftMargin, currentY);
      currentY += descLines.length * SPACING.line;
      pdf.setTextColor(COLORS.black);
    }
    
    currentY += SPACING.subsection;
  }
  
  return currentY + SPACING.section;
};

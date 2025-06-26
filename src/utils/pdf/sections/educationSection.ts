
import jsPDF from "jspdf";
import { Profile } from "@/types/profile";
import { FONT_SIZES, SPACING, COLORS } from "../constants";

export const renderEducation = (
  pdf: jsPDF,
  profile: Profile,
  leftMargin: number,
  contentWidth: number,
  yPosition: number,
  themeColors: { heading: string; accent: string; border: string },
  scaleFactor: number = 1.0
): number => {
  if (!profile.education || profile.education.length === 0) {
    return yPosition;
  }
  
  let currentY = yPosition;
  
  // Scale font sizes and spacing
  const headingSize = Math.round(FONT_SIZES.heading * scaleFactor);
  const subheadingSize = Math.round(FONT_SIZES.subheading * scaleFactor);
  const bodySize = Math.round(FONT_SIZES.body * scaleFactor);
  const lineSpacing = SPACING.line * scaleFactor;
  const subsectionSpacing = SPACING.subsection * scaleFactor;
  
  // Section heading
  pdf.setFontSize(headingSize);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(themeColors.heading);
  pdf.text("EDUCATION", leftMargin, currentY);
  currentY += lineSpacing;
  
  // Add underline
  pdf.setDrawColor(themeColors.border);
  pdf.setLineWidth(0.5);
  pdf.line(leftMargin, currentY, leftMargin + contentWidth, currentY);
  currentY += subsectionSpacing;
  
  // Education entries
  profile.education.forEach((edu, index) => {
    if (index > 0) {
      currentY += subsectionSpacing * 0.8;
    }
    
    // Degree and field
    pdf.setFontSize(subheadingSize);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(COLORS.black);
    
    const degreeText = `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`;
    pdf.text(degreeText, leftMargin, currentY);
    currentY += lineSpacing;
    
    // School and date
    pdf.setFontSize(bodySize);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(COLORS.gray);
    
    const schoolLine = [];
    if (edu.school) schoolLine.push(edu.school);
    if (edu.endDate) {
      const dateText = edu.startDate ? `${edu.startDate} - ${edu.endDate}` : edu.endDate;
      schoolLine.push(dateText);
    } else if (edu.startDate) {
      schoolLine.push(`${edu.startDate} - Present`);
    }
    
    if (schoolLine.length > 0) {
      pdf.text(schoolLine.join(" • "), leftMargin, currentY);
      currentY += lineSpacing;
    }
    
    // Description if provided
    if (edu.description) {
      pdf.setFontSize(bodySize);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(COLORS.black);
      const wrappedDescription = pdf.splitTextToSize(edu.description, contentWidth);
      wrappedDescription.forEach((line: string) => {
        pdf.text(line, leftMargin, currentY);
        currentY += lineSpacing * 0.9;
      });
    }
  });
  
  return currentY;
};


import { Profile } from "@/types/profile";
import { COLORS, FONT_SIZES, SPACING } from "@/utils/pdf/constants";
import { jsPDF } from "jspdf";
import { formatDate } from "../helpers";
import { PdfLayoutData } from "../types";

/**
 * Renders the education section of the resume PDF
 */
export const renderEducationSection = (
  pdf: jsPDF, 
  profile: Profile, 
  layoutData: PdfLayoutData
): number => {
  const { leftMargin, pageWidth, themeColors } = layoutData;
  let { yPos } = layoutData;

  if (!profile.education || profile.education.length === 0) {
    return yPos;
  }
  
  // Section header
  pdf.setFontSize(FONT_SIZES.heading3);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(themeColors.heading);
  pdf.text("Education", leftMargin, yPos);
  yPos += SPACING.xs;
  
  // Add a thin line under the section header
  pdf.setDrawColor(themeColors.border);
  pdf.setLineWidth(0.005);
  pdf.line(leftMargin, yPos, 8.5 - layoutData.sideMargIn, yPos);
  yPos += SPACING.sm;
  
  for (const edu of profile.education) {
    // Degree
    pdf.setFontSize(FONT_SIZES.heading3);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(COLORS.black);
    pdf.text(`${edu.degree} in ${edu.field}`, leftMargin, yPos);
    yPos += SPACING.sm;
    
    // School and dates on the same line
    pdf.setFontSize(FONT_SIZES.base);
    pdf.setFont("helvetica", "normal");
    const dateText = `${formatDate(edu.startDate)} - ${edu.endDate ? formatDate(edu.endDate) : 'Present'}`;
    const dateWidth = pdf.getTextWidth(dateText);
    
    // Set school name in a slightly highlighted color
    pdf.setTextColor(themeColors.heading);
    pdf.text(edu.school + ('location' in edu && edu.location ? `, ${edu.location}` : ''), leftMargin, yPos);
    
    // Set date in regular black
    pdf.setTextColor(COLORS.black);
    pdf.text(dateText, 8.5 - layoutData.sideMargIn - dateWidth, yPos);
    
    yPos += SPACING.sm;
    
    if (edu.description) {
      pdf.setFontSize(FONT_SIZES.small);
      pdf.setTextColor(COLORS.black);
      const splitDesc = pdf.splitTextToSize(edu.description, pageWidth);
      pdf.text(splitDesc, leftMargin, yPos);
      yPos += (splitDesc.length * 0.12); // Proper line spacing
    }
    
    yPos += SPACING.lg; // Increased spacing between education entries
  }
  
  // Add section break spacing
  yPos += SPACING.section;
  
  return yPos;
};

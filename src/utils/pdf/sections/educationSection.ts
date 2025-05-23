
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
  
  // Section header - clean and consistent
  pdf.setFontSize(FONT_SIZES.heading3);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(themeColors.heading);
  pdf.text("EDUCATION", leftMargin, yPos);
  yPos += SPACING.element;
  
  // Add a clean line under the section header
  pdf.setDrawColor(themeColors.border);
  pdf.setLineWidth(0.005);
  pdf.line(leftMargin, yPos, 8.5 - layoutData.sideMargIn, yPos);
  yPos += SPACING.md;
  
  for (const edu of profile.education) {
    // Degree - clean and prominent
    pdf.setFontSize(FONT_SIZES.base);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(COLORS.black);
    pdf.text(`${edu.degree} in ${edu.field}`, leftMargin, yPos);
    yPos += SPACING.sm; // Clean spacing between degree and school
    
    // School and dates on the same line - consistent with experience
    pdf.setFontSize(FONT_SIZES.base);
    pdf.setFont("helvetica", "normal");
    const dateText = `${formatDate(edu.startDate)} - ${edu.endDate ? formatDate(edu.endDate) : 'Present'}`;
    const dateWidth = pdf.getTextWidth(dateText);
    
    // School name
    pdf.setTextColor(COLORS.black);
    pdf.text(edu.school + ('location' in edu && edu.location ? `, ${edu.location}` : ''), leftMargin, yPos);
    
    // Date right-aligned
    pdf.text(dateText, 8.5 - layoutData.sideMargIn - dateWidth, yPos);
    
    yPos += SPACING.element; // Clean spacing after school info
    
    if (edu.description) {
      pdf.setFontSize(FONT_SIZES.small);
      pdf.setTextColor(COLORS.black);
      const splitDesc = pdf.splitTextToSize(edu.description, pageWidth);
      pdf.text(splitDesc, leftMargin, yPos);
      yPos += (splitDesc.length * SPACING.bullet); // Clean description spacing
    }
    
    yPos += SPACING.lg; // Clean spacing between education entries
  }
  
  // Add clean section break
  yPos += SPACING.md;
  
  return yPos;
};

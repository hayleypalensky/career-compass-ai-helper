
import { Profile } from "@/types/profile";
import { COLORS, LETTER_SPACING } from "@/utils/pdf/constants";
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
  
  // Check if we need a new page before education
  if (yPos > 9) {
    pdf.addPage();
    yPos = layoutData.topBottomMargIn + 0.2;
  }
  
  // Section header with consistent formatting
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(themeColors.heading);
  pdf.setCharSpace(0.3); // Letter spacing for section headers
  pdf.text("Education", leftMargin, yPos);
  pdf.setCharSpace(0); // Reset char spacing
  yPos += 0.15;
  
  // Add a thin line under the section header
  pdf.setDrawColor(themeColors.border);
  pdf.setLineWidth(0.005);
  pdf.line(leftMargin, yPos, 8.5 - layoutData.sideMargIn, yPos);
  yPos += 0.2;
  
  // Consistent spacing between education items
  const itemSpacing = 0.2;
  
  for (const edu of profile.education) {
    // Degree with consistent formatting
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(COLORS.black);
    pdf.setCharSpace(0.2); // Letter spacing for degree titles
    pdf.text(`${edu.degree} in ${edu.field}`, leftMargin, yPos);
    pdf.setCharSpace(0); // Reset char spacing
    
    // School and dates on the same line
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setCharSpace(0.2); // Consistent letter spacing
    const dateText = `${formatDate(edu.startDate)} - ${edu.endDate ? formatDate(edu.endDate) : 'Present'}`;
    const dateWidth = pdf.getTextWidth(dateText);
    
    // Set school name in a slightly highlighted color
    pdf.setTextColor(themeColors.heading);
    pdf.text(edu.school + ('location' in edu && edu.location ? `, ${edu.location}` : ''), leftMargin, yPos + 0.15);
    
    // Set date in regular black
    pdf.setTextColor(COLORS.black);
    pdf.text(dateText, 8.5 - layoutData.sideMargIn - dateWidth, yPos + 0.15);
    pdf.setCharSpace(0); // Reset char spacing
    
    yPos += 0.3;
    
    if (edu.description) {
      pdf.setFontSize(9);
      pdf.setTextColor(COLORS.black);
      pdf.setCharSpace(0.2); // Letter spacing for descriptions
      const splitDesc = pdf.splitTextToSize(edu.description, pageWidth);
      pdf.text(splitDesc, leftMargin, yPos);
      pdf.setCharSpace(0); // Reset char spacing
      yPos += (splitDesc.length * 0.13);
    }
    
    yPos += itemSpacing;
  }
  
  return yPos;
};

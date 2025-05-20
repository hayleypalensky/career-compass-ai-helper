
import { Profile } from "@/types/profile";
import { COLORS } from "@/utils/pdf/constants";
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
  
  // Section header
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(themeColors.heading);
  pdf.text("Education", leftMargin, yPos);
  yPos += 0.15;
  
  // Add a thin line under the section header
  pdf.setDrawColor(themeColors.border);
  pdf.setLineWidth(0.005);
  pdf.line(leftMargin, yPos, 8.5 - layoutData.sideMargIn, yPos);
  yPos += 0.2;
  
  // Consistent spacing between education items
  const itemSpacing = 0.2;
  
  for (const edu of profile.education) {
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(COLORS.black);
    pdf.text(`${edu.degree} in ${edu.field}`, leftMargin, yPos);
    
    // School and dates on the same line
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    const dateText = `${formatDate(edu.startDate)} - ${edu.endDate ? formatDate(edu.endDate) : 'Present'}`;
    const dateWidth = pdf.getTextWidth(dateText);
    
    // Set school name in a slightly highlighted color
    pdf.setTextColor(themeColors.heading);
    pdf.text(edu.school + ('location' in edu && edu.location ? `, ${edu.location}` : ''), leftMargin, yPos + 0.15);
    
    // Set date in regular black
    pdf.setTextColor(COLORS.black);
    pdf.text(dateText, 8.5 - layoutData.sideMargIn - dateWidth, yPos + 0.15);
    
    yPos += 0.3;
    
    if (edu.description) {
      pdf.setFontSize(9);
      const splitDesc = pdf.splitTextToSize(edu.description, pageWidth);
      pdf.text(splitDesc, leftMargin, yPos);
      yPos += (splitDesc.length * 0.13); // Slightly reduced line height
    }
    
    yPos += itemSpacing;
  }
  
  return yPos;
};

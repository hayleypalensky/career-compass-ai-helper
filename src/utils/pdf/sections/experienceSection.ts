
import { Profile } from "@/types/profile";
import { COLORS } from "@/utils/pdf/constants";
import { jsPDF } from "jspdf";
import { formatDate } from "../helpers";
import { PdfLayoutData } from "../types";

/**
 * Renders the experience section of the resume PDF
 */
export const renderExperienceSection = (
  pdf: jsPDF, 
  profile: Profile, 
  layoutData: PdfLayoutData
): number => {
  const { leftMargin, pageWidth, themeColors } = layoutData;
  let { yPos } = layoutData;

  if (!profile.experiences || profile.experiences.length === 0) {
    return yPos;
  }
  
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(themeColors.heading);
  pdf.text("Experience", leftMargin, yPos);
  yPos += 0.15;
  
  // Add a thin line under the section header
  pdf.setDrawColor(themeColors.border);
  pdf.setLineWidth(0.005);
  pdf.line(leftMargin, yPos, 8.5 - layoutData.sideMargIn, yPos);
  yPos += 0.15;
  
  for (const exp of profile.experiences) {
    // Check if we need to add a new page
    if (yPos > 10 - layoutData.topBottomMargIn) {
      pdf.addPage();
      yPos = layoutData.topBottomMargIn + 0.2;
    }
    
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(COLORS.black);
    pdf.text(exp.title, leftMargin, yPos);
    
    // Company and dates on the same line, with dates right-aligned
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    const dateText = `${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}`;
    const dateWidth = pdf.getTextWidth(dateText);
    
    // Set company name in a slightly highlighted color
    pdf.setTextColor(themeColors.heading);
    pdf.text(exp.company + (exp.location ? `, ${exp.location}` : ''), leftMargin, yPos + 0.15);
    
    // Set date in regular black
    pdf.setTextColor(COLORS.black);
    pdf.text(dateText, 8.5 - layoutData.sideMargIn - dateWidth, yPos + 0.15);
    
    yPos += 0.3;
    
    // Add bullet points
    pdf.setFontSize(9);
    const bulletPoints = exp.bullets.filter(bullet => bullet.trim() !== "");
    for (const bullet of bulletPoints) {
      // Handle bullet points that may need multiple lines
      const bulletText = "• " + bullet;
      const splitBullet = pdf.splitTextToSize(bulletText, pageWidth - 0.1);
      
      // Check if we need to add a new page
      if (yPos + (splitBullet.length * 0.15) > 10.5 - layoutData.topBottomMargIn) {
        pdf.addPage();
        yPos = layoutData.topBottomMargIn + 0.2;
      }
      
      pdf.text(splitBullet, leftMargin + 0.1, yPos);
      yPos += (splitBullet.length * 0.15) + 0.08;
    }
    
    yPos += 0.15;
  }
  
  return yPos;
};

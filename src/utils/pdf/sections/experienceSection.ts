
import { Profile } from "@/types/profile";
import { COLORS, FONT_SIZES, SPACING, BULLET_CHAR } from "@/utils/pdf/constants";
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
  
  // Section header
  pdf.setFontSize(FONT_SIZES.heading3);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(themeColors.heading);
  pdf.text("Experience", leftMargin, yPos);
  yPos += SPACING.xs;
  
  // Add a thin line under the section header
  pdf.setDrawColor(themeColors.border);
  pdf.setLineWidth(0.005);
  pdf.line(leftMargin, yPos, 8.5 - layoutData.sideMargIn, yPos);
  yPos += SPACING.sm;
  
  for (const exp of profile.experiences) {
    // Job title
    pdf.setFontSize(FONT_SIZES.heading3);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(COLORS.black);
    pdf.text(exp.title, leftMargin, yPos);
    
    yPos += SPACING.element; // Increased spacing between title and company
    
    // Company and dates on the same line, with dates right-aligned
    pdf.setFontSize(FONT_SIZES.base);
    pdf.setFont("helvetica", "normal");
    const dateText = `${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}`;
    const dateWidth = pdf.getTextWidth(dateText);
    
    // Set company name in a slightly highlighted color
    pdf.setTextColor(themeColors.heading);
    pdf.text(exp.company + (exp.location ? `, ${exp.location}` : ''), leftMargin, yPos);
    
    // Set date in regular black
    pdf.setTextColor(COLORS.black);
    pdf.text(dateText, 8.5 - layoutData.sideMargIn - dateWidth, yPos);
    
    yPos += SPACING.element; // Increased spacing between company and bullets
    
    // Add bullet points
    pdf.setFontSize(FONT_SIZES.small);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(COLORS.black);
    
    const bulletPoints = exp.bullets.filter(bullet => bullet.trim() !== "");
    for (const bullet of bulletPoints) {
      // Handle bullet points that may need multiple lines
      const bulletText = BULLET_CHAR + " " + bullet;
      const splitBullet = pdf.splitTextToSize(bulletText, pageWidth - 0.1);
      
      pdf.text(splitBullet, leftMargin + 0.1, yPos);
      yPos += (splitBullet.length * 0.15); // Increased spacing for bullets
      
      // Add a bit more space between bullet points
      if (bulletPoints.indexOf(bullet) < bulletPoints.length - 1) {
        yPos += SPACING.xs;
      }
    }
    
    yPos += SPACING.lg; // Increased spacing between experiences
  }
  
  // Add section break spacing
  yPos += SPACING.section;
  
  return yPos;
};

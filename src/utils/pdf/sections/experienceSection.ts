
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
  
  // Section header - clean and bold like reference
  pdf.setFontSize(FONT_SIZES.heading3);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(themeColors.heading);
  pdf.text("EXPERIENCE", leftMargin, yPos);
  yPos += SPACING.element * 1.2; // Increased spacing after heading
  
  // Add a clean line under the section header - thinner for elegance
  pdf.setDrawColor(themeColors.border);
  pdf.setLineWidth(0.006);
  pdf.line(leftMargin, yPos, 8.5 - layoutData.sideMargIn, yPos);
  yPos += SPACING.md * 1.3; // Increased spacing after line
  
  for (const exp of profile.experiences) {
    // Job title - prominent and clean
    pdf.setFontSize(FONT_SIZES.base);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(COLORS.black);
    pdf.text(exp.title, leftMargin, yPos);
    
    yPos += SPACING.sm * 1.2; // Increased spacing between title and company
    
    // Company and dates on the same line - clean layout like reference
    pdf.setFontSize(FONT_SIZES.base);
    pdf.setFont("helvetica", "normal");
    const dateText = `${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}`;
    const dateWidth = pdf.getTextWidth(dateText);
    
    // Company name
    pdf.setTextColor(COLORS.black);
    pdf.text(exp.company + (exp.location ? `, ${exp.location}` : ''), leftMargin, yPos);
    
    // Date right-aligned
    pdf.text(dateText, 8.5 - layoutData.sideMargIn - dateWidth, yPos);
    
    yPos += SPACING.element * 1.2; // Increased spacing before bullets
    
    // Add bullet points with clean spacing like reference
    pdf.setFontSize(FONT_SIZES.small);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(COLORS.black);
    
    const bulletPoints = exp.bullets.filter(bullet => bullet.trim() !== "");
    for (const bullet of bulletPoints) {
      const bulletText = BULLET_CHAR + " " + bullet;
      const splitBullet = pdf.splitTextToSize(bulletText, pageWidth - 0.15);
      
      pdf.text(splitBullet, leftMargin + 0.15, yPos);
      yPos += (splitBullet.length * SPACING.bullet * 1.15); // Increased bullet spacing
      
      // Small gap between bullets
      if (bulletPoints.indexOf(bullet) < bulletPoints.length - 1) {
        yPos += SPACING.xs * 1.2; // Increased spacing between bullets
      }
    }
    
    yPos += SPACING.lg * 1.3; // Increased spacing between job entries
  }
  
  // Add clean section break
  yPos += SPACING.md;
  
  return yPos;
};

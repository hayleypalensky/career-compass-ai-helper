
import { Profile } from "@/types/profile";
import { COLORS, FONT_SIZES, SPACING, FONT_FAMILY, LINE_HEIGHTS } from "@/utils/pdf/constants";
import { jsPDF } from "jspdf";
import { PdfLayoutData } from "../types";

/**
 * Renders the header section of the resume PDF
 */
export const renderHeaderSection = (
  pdf: jsPDF, 
  profile: Profile, 
  layoutData: PdfLayoutData
): number => {
  const { leftMargin, pageWidth, themeColors } = layoutData;
  let { yPos } = layoutData;
  const rightMargin = 8.5 - layoutData.sideMargIn;
  
  // Name with theme color
  pdf.setFontSize(FONT_SIZES.heading2);
  pdf.setFont(FONT_FAMILY, "bold");
  pdf.setTextColor(themeColors.heading);
  pdf.text(profile.personalInfo.name || "Resume", leftMargin, yPos);
  yPos += SPACING.sm; // Reduced spacing after name
  
  // Add horizontal line with theme color
  pdf.setDrawColor(themeColors.border);
  pdf.setLineWidth(0.01);
  pdf.line(leftMargin, yPos, rightMargin, yPos);
  yPos += SPACING.sm; // Reduced spacing after line
  
  // Add contact information in a professional layout
  pdf.setFontSize(FONT_SIZES.base);
  pdf.setFont(FONT_FAMILY, "normal");
  pdf.setTextColor(COLORS.black);

  // Create array of contact items
  const contactItems = [];
  if (profile.personalInfo.email) contactItems.push(`Email: ${profile.personalInfo.email}`);
  if (profile.personalInfo.phone) contactItems.push(`Phone: ${profile.personalInfo.phone}`);
  if (profile.personalInfo.website) contactItems.push(`Website: ${profile.personalInfo.website}`);
  if (profile.personalInfo.location) contactItems.push(`Location: ${profile.personalInfo.location}`);
  
  // Only proceed with evenly spacing if we have contact items
  if (contactItems.length > 0) {
    // Calculate positions for evenly spaced contact info
    const availableWidth = rightMargin - leftMargin;
    
    if (contactItems.length === 1) {
      // If only one item, center it
      pdf.text(contactItems[0], leftMargin + (availableWidth / 2) - (pdf.getTextWidth(contactItems[0]) / 2), yPos);
    } else {
      // For multiple items, calculate even spacing
      const spacing = availableWidth / (contactItems.length - 1);
      
      // Position and render each contact item
      contactItems.forEach((item, index) => {
        const xPos = leftMargin + (spacing * index);
        
        // For first item, align left
        if (index === 0) {
          pdf.text(item, leftMargin, yPos);
        }
        // For last item, align right
        else if (index === contactItems.length - 1) {
          pdf.text(item, rightMargin - pdf.getTextWidth(item), yPos);
        }
        // For middle items, center at their position
        else {
          pdf.text(item, xPos - (pdf.getTextWidth(item) / 2), yPos);
        }
      });
    }
    
    yPos += SPACING.sm; // Reduced space after contact info
  }
  
  // Add summary if available
  if (profile.personalInfo.summary) {
    pdf.setFontSize(FONT_SIZES.heading3);
    pdf.setFont(FONT_FAMILY, "bold");
    pdf.setTextColor(themeColors.heading);
    pdf.text("Professional Summary", leftMargin, yPos);
    yPos += SPACING.sm; // Reduced spacing after the heading
    
    pdf.setFontSize(FONT_SIZES.base);
    pdf.setFont(FONT_FAMILY, "normal");
    pdf.setTextColor(COLORS.black);
    const splitSummary = pdf.splitTextToSize(profile.personalInfo.summary, pageWidth);
    pdf.text(splitSummary, leftMargin, yPos);
    
    // Use proper line height calculation instead of SPACING.md per line
    const lineHeight = (FONT_SIZES.base * LINE_HEIGHTS.normal) / 72; // Convert to inches
    yPos += (splitSummary.length * lineHeight) + SPACING.sm; // Reduced section spacing
  }
  
  return yPos;
};

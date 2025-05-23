
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
  
  // Name with theme color - clean and prominent like reference
  pdf.setFontSize(FONT_SIZES.heading2);
  pdf.setFont(FONT_FAMILY, "bold");
  pdf.setTextColor(themeColors.heading);
  pdf.text(profile.personalInfo.name || "Resume", leftMargin, yPos);
  yPos += SPACING.header * 1.5; // Increased spacing after name
  
  // Add horizontal line with theme color - thinner line for elegance
  pdf.setDrawColor(themeColors.border);
  pdf.setLineWidth(0.006);
  pdf.line(leftMargin, yPos, rightMargin, yPos);
  yPos += SPACING.sm * 1.3; // Increased spacing after line
  
  // Add contact information in a professional layout with adjusted spacing
  pdf.setFontSize(FONT_SIZES.base);
  pdf.setFont(FONT_FAMILY, "normal");
  pdf.setTextColor(COLORS.black);

  // Create array of contact items
  const contactItems = [];
  if (profile.personalInfo.email) contactItems.push(`${profile.personalInfo.email}`);
  if (profile.personalInfo.phone) contactItems.push(`${profile.personalInfo.phone}`);
  if (profile.personalInfo.website) contactItems.push(`${profile.personalInfo.website}`);
  if (profile.personalInfo.location) contactItems.push(`${profile.personalInfo.location}`);
  
  // Clean contact layout like reference
  if (contactItems.length > 0) {
    const contactLine = contactItems.join(" | ");
    const contactWidth = pdf.getTextWidth(contactLine);
    const centerX = leftMargin + (pageWidth / 2) - (contactWidth / 2);
    pdf.text(contactLine, centerX, yPos);
    yPos += SPACING.md * 1.3; // Increased spacing after contact info
  }
  
  // Add summary if available - clean section like reference
  if (profile.personalInfo.summary) {
    pdf.setFontSize(FONT_SIZES.heading3);
    pdf.setFont(FONT_FAMILY, "bold");
    pdf.setTextColor(themeColors.heading);
    pdf.text("PROFESSIONAL SUMMARY", leftMargin, yPos);
    yPos += SPACING.element * 1.2; // Increased spacing between header and content
    
    pdf.setFontSize(FONT_SIZES.base);
    pdf.setFont(FONT_FAMILY, "normal");
    pdf.setTextColor(COLORS.black);
    const splitSummary = pdf.splitTextToSize(profile.personalInfo.summary, pageWidth);
    pdf.text(splitSummary, leftMargin, yPos);
    
    // Clean line height calculation with increased spacing
    const lineHeight = (FONT_SIZES.base * LINE_HEIGHTS.normal) / 72;
    yPos += (splitSummary.length * lineHeight) + SPACING.section; // Increased section break
  } else {
    yPos += SPACING.md; // Add space even if no summary
  }
  
  return yPos;
};

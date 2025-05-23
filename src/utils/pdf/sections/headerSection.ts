
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
  yPos += SPACING.header; // Clean spacing after name
  
  // Add horizontal line with theme color
  pdf.setDrawColor(themeColors.border);
  pdf.setLineWidth(0.008);
  pdf.line(leftMargin, yPos, rightMargin, yPos);
  yPos += SPACING.sm; // Clean spacing after line
  
  // Add contact information in a professional layout
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
    yPos += SPACING.md; // Clean spacing after contact info
  }
  
  // Add summary if available - clean section like reference
  if (profile.personalInfo.summary) {
    pdf.setFontSize(FONT_SIZES.heading3);
    pdf.setFont(FONT_FAMILY, "bold");
    pdf.setTextColor(themeColors.heading);
    pdf.text("PROFESSIONAL SUMMARY", leftMargin, yPos);
    yPos += SPACING.element; // Clean spacing between header and content
    
    pdf.setFontSize(FONT_SIZES.base);
    pdf.setFont(FONT_FAMILY, "normal");
    pdf.setTextColor(COLORS.black);
    const splitSummary = pdf.splitTextToSize(profile.personalInfo.summary, pageWidth);
    pdf.text(splitSummary, leftMargin, yPos);
    
    // Clean line height calculation
    const lineHeight = (FONT_SIZES.base * LINE_HEIGHTS.normal) / 72;
    yPos += (splitSummary.length * lineHeight) + SPACING.section; // Clean section break
  }
  
  return yPos;
};

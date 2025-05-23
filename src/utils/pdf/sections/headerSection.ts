
import { Profile } from "@/types/profile";
import { COLORS, LETTER_SPACING, FONT_SIZES } from "@/utils/pdf/constants";
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
  
  // Set consistent font family for entire document
  pdf.setFont("helvetica");
  
  // Add header - Name with theme color
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(themeColors.heading);
  pdf.setCharSpace(LETTER_SPACING.tight);
  pdf.text(profile.personalInfo.name || "Resume", leftMargin, yPos);
  pdf.setCharSpace(0);
  yPos += 0.22;
  
  // Add horizontal line with theme color
  pdf.setDrawColor(themeColors.border);
  pdf.setLineWidth(0.01);
  pdf.line(leftMargin, yPos, rightMargin, yPos);
  yPos += 0.2;
  
  // Add contact information in a professional layout
  pdf.setFontSize(FONT_SIZES.base);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(COLORS.black);
  pdf.setCharSpace(LETTER_SPACING.normal);

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
    
    yPos += 0.25; // Add space after contact info
  }
  
  pdf.setCharSpace(0);
  
  // Add summary if available
  if (profile.personalInfo.summary) {
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(themeColors.heading);
    pdf.setCharSpace(LETTER_SPACING.tight);
    pdf.text("Professional Summary", leftMargin, yPos);
    pdf.setCharSpace(0);
    yPos += 0.18;
    
    pdf.setFontSize(FONT_SIZES.base);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(COLORS.black);
    pdf.setCharSpace(LETTER_SPACING.normal);
    const splitSummary = pdf.splitTextToSize(profile.personalInfo.summary, pageWidth);
    pdf.text(splitSummary, leftMargin, yPos);
    pdf.setCharSpace(0);
    yPos += (splitSummary.length * 0.13) + 0.25;
  }
  
  return yPos;
};

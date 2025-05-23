
import { Profile } from "@/types/profile";
import { COLORS, LETTER_SPACING } from "@/utils/pdf/constants";
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
  
  // Set consistent font family for entire document
  pdf.setFont("helvetica");
  
  // Add header - Name with theme color and consistent formatting
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(themeColors.heading);
  pdf.setCharSpace(0.5); // Increased letter spacing for readability
  pdf.text(profile.personalInfo.name || "Resume", leftMargin, yPos);
  pdf.setCharSpace(0); // Reset char spacing
  yPos += 0.22;
  
  // Add horizontal line with theme color
  pdf.setDrawColor(themeColors.border);
  pdf.setLineWidth(0.01);
  pdf.line(leftMargin, yPos, 8.5 - layoutData.sideMargIn, yPos);
  yPos += 0.2;
  
  // Add contact information in a professional layout
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(COLORS.black);
  pdf.setCharSpace(0.2); // Consistent letter spacing for contact info
  
  const contactItems = [];
  if (profile.personalInfo.email) contactItems.push(`Email: ${profile.personalInfo.email}`);
  if (profile.personalInfo.phone) contactItems.push(`Phone: ${profile.personalInfo.phone}`);
  if (profile.personalInfo.website) contactItems.push(`Website: ${profile.personalInfo.website}`);
  if (profile.personalInfo.location) contactItems.push(`Location: ${profile.personalInfo.location}`);
  
  // Create a nicely formatted contact row
  const contactText = contactItems.join(" | ");
  const splitContactInfo = pdf.splitTextToSize(contactText, pageWidth);
  pdf.text(splitContactInfo, leftMargin, yPos);
  pdf.setCharSpace(0); // Reset char spacing
  yPos += (splitContactInfo.length * 0.15) + 0.22;
  
  // Add summary if available
  if (profile.personalInfo.summary) {
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(themeColors.heading);
    pdf.setCharSpace(0.3); // Letter spacing for section headers
    pdf.text("Professional Summary", leftMargin, yPos);
    pdf.setCharSpace(0); // Reset char spacing
    yPos += 0.18;
    
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(COLORS.black);
    pdf.setCharSpace(0.2); // Letter spacing for body text
    const splitSummary = pdf.splitTextToSize(profile.personalInfo.summary, pageWidth);
    pdf.text(splitSummary, leftMargin, yPos);
    pdf.setCharSpace(0); // Reset char spacing
    yPos += (splitSummary.length * 0.13) + 0.25;
  }
  
  return yPos;
};

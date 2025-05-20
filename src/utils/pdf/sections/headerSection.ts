
import { Profile } from "@/types/profile";
import { COLORS } from "@/utils/pdf/constants";
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
  
  // Add header - Name with theme color
  pdf.setFontSize(16); // Reduced from 20 for consistency
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(themeColors.heading);
  pdf.text(profile.personalInfo.name || "Resume", leftMargin, yPos);
  yPos += 0.22; // Consistent spacing
  
  // Add horizontal line with theme color
  pdf.setDrawColor(themeColors.border);
  pdf.setLineWidth(0.01);
  pdf.line(leftMargin, yPos, 8.5 - layoutData.sideMargIn, yPos);
  yPos += 0.2;
  
  // Add contact information in a professional layout
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(COLORS.black);
  
  const contactItems = [];
  if (profile.personalInfo.email) contactItems.push(`Email: ${profile.personalInfo.email}`);
  if (profile.personalInfo.phone) contactItems.push(`Phone: ${profile.personalInfo.phone}`);
  if (profile.personalInfo.website) contactItems.push(`Website: ${profile.personalInfo.website}`);
  if (profile.personalInfo.location) contactItems.push(`Location: ${profile.personalInfo.location}`);
  
  // Create a nicely formatted contact row
  const contactText = contactItems.join(" | ");
  const splitContactInfo = pdf.splitTextToSize(contactText, pageWidth);
  pdf.text(splitContactInfo, leftMargin, yPos);
  yPos += (splitContactInfo.length * 0.15) + 0.22;
  
  // Add summary if available
  if (profile.personalInfo.summary) {
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(themeColors.heading);
    pdf.text("Professional Summary", leftMargin, yPos);
    yPos += 0.18; // Consistent spacing
    
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(COLORS.black);
    const splitSummary = pdf.splitTextToSize(profile.personalInfo.summary, pageWidth);
    pdf.text(splitSummary, leftMargin, yPos);
    yPos += (splitSummary.length * 0.13) + 0.25; // Consistent line spacing
  }
  
  return yPos;
};

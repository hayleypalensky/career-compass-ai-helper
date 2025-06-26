
import { jsPDF } from "jspdf";
import { Profile } from "@/types/profile";
import { FONT_SIZES, SPACING } from "../constants";

export const renderHeader = (
  pdf: jsPDF,
  profile: Profile,
  leftMargin: number,
  contentWidth: number,
  yPos: number,
  themeColors: { heading: string; accent: string; border: string }
): number => {
  let currentY = yPos;
  
  // Name
  pdf.setFontSize(FONT_SIZES.name);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(themeColors.heading);
  pdf.text(profile.personalInfo.name || "Resume", leftMargin, currentY);
  currentY += SPACING.line * 2;
  
  // Contact information
  pdf.setFontSize(FONT_SIZES.body);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor("#000000"); // Keep contact info black for readability
  
  const contactInfo = [];
  if (profile.personalInfo.email) contactInfo.push(profile.personalInfo.email);
  if (profile.personalInfo.phone) contactInfo.push(profile.personalInfo.phone);
  if (profile.personalInfo.location) contactInfo.push(profile.personalInfo.location);
  if (profile.personalInfo.website) contactInfo.push(profile.personalInfo.website);
  
  if (contactInfo.length > 0) {
    const contactLine = contactInfo.join(" | ");
    pdf.text(contactLine, leftMargin, currentY);
    currentY += SPACING.line;
  }
  
  // Professional Summary
  if (profile.personalInfo.summary) {
    currentY += SPACING.section; // Add consistent spacing before summary section
    
    pdf.setFontSize(FONT_SIZES.heading);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(themeColors.heading);
    pdf.text("PROFESSIONAL SUMMARY", leftMargin, currentY);
    currentY += SPACING.line;
    
    // Add line under heading
    pdf.setDrawColor(themeColors.heading);
    pdf.setLineWidth(0.01);
    pdf.line(leftMargin, currentY, leftMargin + contentWidth, currentY);
    currentY += SPACING.line;
    
    pdf.setFontSize(FONT_SIZES.body);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor("#000000"); // Keep body text black for readability
    const summaryLines = pdf.splitTextToSize(profile.personalInfo.summary, contentWidth);
    pdf.text(summaryLines, leftMargin, currentY);
    currentY += summaryLines.length * SPACING.line;
  }
  
  return currentY;
};

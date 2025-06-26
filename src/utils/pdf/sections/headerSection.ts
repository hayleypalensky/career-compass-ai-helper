
import jsPDF from "jspdf";
import { Profile } from "@/types/profile";
import { FONT_SIZES, SPACING, COLORS } from "../constants";

export const renderHeader = (
  pdf: jsPDF,
  profile: Profile,
  leftMargin: number,
  contentWidth: number,
  yPosition: number,
  themeColors: { heading: string; accent: string; border: string },
  scaleFactor: number = 1.0
): number => {
  let currentY = yPosition;
  const { personalInfo } = profile;
  
  // Scale font sizes
  const nameSize = Math.round(FONT_SIZES.name * scaleFactor);
  const bodySize = Math.round(FONT_SIZES.body * scaleFactor);
  const lineSpacing = SPACING.line * scaleFactor;
  
  // Name
  if (personalInfo.name) {
    pdf.setFontSize(nameSize);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(COLORS.black);
    pdf.text(personalInfo.name, leftMargin, currentY);
    currentY += lineSpacing * 1.5;
  }
  
  // Contact information line
  const contactInfo = [];
  if (personalInfo.email) contactInfo.push(personalInfo.email);
  if (personalInfo.phone) contactInfo.push(personalInfo.phone);
  if (personalInfo.location) contactInfo.push(personalInfo.location);
  if (personalInfo.linkedin) contactInfo.push(personalInfo.linkedin);
  if (personalInfo.website) contactInfo.push(personalInfo.website);
  
  if (contactInfo.length > 0) {
    pdf.setFontSize(bodySize);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(COLORS.gray);
    pdf.text(contactInfo.join(" • "), leftMargin, currentY);
    currentY += lineSpacing * 1.2;
  }
  
  return currentY + (SPACING.subsection * scaleFactor);
};

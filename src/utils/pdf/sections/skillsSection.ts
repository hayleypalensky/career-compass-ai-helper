
import jsPDF from "jspdf";
import { Profile } from "@/types/profile";
import { FONT_SIZES, SPACING, COLORS } from "../constants";

export const renderSkills = (
  pdf: jsPDF,
  profile: Profile,
  leftMargin: number,
  contentWidth: number,
  yPosition: number,
  themeColors: { heading: string; accent: string; border: string },
  scaleFactor: number = 1.0
): number => {
  if (!profile.skills || profile.skills.length === 0) {
    return yPosition;
  }
  
  let currentY = yPosition;
  
  // Scale font sizes and spacing
  const headingSize = Math.round(FONT_SIZES.heading * scaleFactor);
  const bodySize = Math.round(FONT_SIZES.body * scaleFactor);
  const lineSpacing = SPACING.line * scaleFactor;
  const subsectionSpacing = SPACING.subsection * scaleFactor;
  
  // Section heading
  pdf.setFontSize(headingSize);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(themeColors.heading);
  pdf.text("SKILLS", leftMargin, currentY);
  currentY += lineSpacing;
  
  // Add underline
  pdf.setDrawColor(themeColors.border);
  pdf.setLineWidth(0.5);
  pdf.line(leftMargin, currentY, leftMargin + contentWidth, currentY);
  currentY += subsectionSpacing;
  
  // Group skills by category
  const skillsByCategory = profile.skills.reduce((acc, skill) => {
    const category = skill.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);
  
  // Render skills by category with adaptive layout
  Object.entries(skillsByCategory).forEach(([category, skills], categoryIndex) => {
    if (categoryIndex > 0) {
      currentY += subsectionSpacing * 0.7;
    }
    
    // Category name (if there are multiple categories)
    const hasMultipleCategories = Object.keys(skillsByCategory).length > 1;
    if (hasMultipleCategories && category !== 'General') {
      pdf.setFontSize(Math.round(FONT_SIZES.subheading * scaleFactor));
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(COLORS.black);
      pdf.text(`${category}:`, leftMargin, currentY);
      currentY += lineSpacing;
    }
    
    // Skills as comma-separated text (more compact for PDF)
    pdf.setFontSize(bodySize);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(COLORS.black);
    
    const skillsText = skills.join(", ");
    const wrappedSkills = pdf.splitTextToSize(skillsText, contentWidth);
    
    wrappedSkills.forEach((line: string) => {
      pdf.text(line, leftMargin, currentY);
      currentY += lineSpacing * 0.9; // Slightly tighter spacing for skills
    });
  });
  
  return currentY;
};

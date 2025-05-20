
/**
 * Types for PDF generation
 */

export interface PdfExportOptions {
  profile: Profile;
  jobTitle?: string;
  companyName?: string;
  colorTheme?: string;
}

export interface PdfThemeColors {
  heading: string;
  accent: string;
  border: string;
}

export interface PdfLayoutData {
  yPos: number;
  leftMargin: number;
  pageWidth: number;
  sideMargIn: number;
  topBottomMargIn: number;
  themeColors: PdfThemeColors;
}

// Import only the types we need from the Profile interface
import { Profile } from "@/types/profile";

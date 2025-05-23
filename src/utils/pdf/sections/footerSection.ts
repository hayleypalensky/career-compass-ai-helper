
import { jsPDF } from "jspdf";
import { PdfLayoutData } from "../types";
import { FONT_SIZES, COLORS } from "../constants";

/**
 * Adds the footer to each page of the PDF
 */
export const addFooter = (
  pdf: jsPDF, 
  layoutData: PdfLayoutData
): void => {
  // Get the number of pages in the PDF
  const pageCount = pdf.getNumberOfPages();
  
  // Loop through each page
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    
    // Add page number at the bottom center
    const text = `Page ${i} of ${pageCount}`;
    
    pdf.setFontSize(FONT_SIZES.xsmall);
    pdf.setTextColor(COLORS.grayLight);
    
    // Calculate center position
    const textWidth = pdf.getTextWidth(text);
    const x = (8.5 - textWidth) / 2;
    
    // Position at bottom of page with small margin
    pdf.text(text, x, 10.8);
  }
};


import { jsPDF } from "jspdf";
import { COLORS } from "@/utils/pdf/constants";
import { PdfLayoutData } from "../types";

/**
 * Adds the footer to each page of the PDF
 */
export const addFooter = (
  pdf: jsPDF, 
  layoutData: PdfLayoutData
): void => {
  const totalPages = pdf.getNumberOfPages();
  
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(COLORS.black);
    pdf.text(
      `Page ${i} of ${totalPages}`, 
      8.5 - layoutData.sideMargIn - 1, 
      11 - 0.2
    );
  }
};

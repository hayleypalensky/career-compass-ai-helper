
import { jsPDF } from "jspdf";
import { PdfLayoutData } from "../types";

/**
 * Adds the footer to each page of the PDF
 * Currently empty as page numbers are removed
 */
export const addFooter = (
  pdf: jsPDF, 
  layoutData: PdfLayoutData
): void => {
  // Footer is empty as page numbers are removed
};

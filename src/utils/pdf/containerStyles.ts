
import { FONT_FAMILY, PDF_DIMENSIONS } from './constants';

/**
 * Applies basic container styles for PDF export
 * @param element The element to style for PDF export
 */
export const applyContainerStyles = (element: HTMLElement): void => {
  // Set container styles
  element.className = "pdf-export-container";
  element.style.width = PDF_DIMENSIONS.widthPx;
  element.style.padding = "0"; // Remove padding to allow precise margin control in PDF
  element.style.backgroundColor = "white";
  element.style.position = "absolute";
  element.style.left = "-9999px"; // Position off-screen
  element.style.fontSize = "12px"; // Reduced font size to fit more content
  element.style.fontFamily = FONT_FAMILY;
  element.style.color = "#000"; // Ensure sharp text
  element.style.textRendering = "optimizeLegibility"; // Improve text rendering
  
  // Add vendor-specific CSS properties with proper TypeScript handling
  element.style.setProperty("-webkit-font-smoothing", "antialiased");
  element.style.setProperty("-moz-osx-font-smoothing", "grayscale");
  element.style.setProperty("letter-spacing", "-0.01em"); // Slight letter spacing adjustment for clarity
};

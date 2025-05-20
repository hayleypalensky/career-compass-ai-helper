
import { FONT_FAMILY, FONT_SIZES, LINE_HEIGHTS, SPACING } from './constants';

/**
 * Returns CSS styles for PDF export as a string
 */
export const getPdfCssStyles = (): string => {
  return `
    .pdf-export-container {
      font-size: ${FONT_SIZES.base} !important;
      font-family: ${FONT_FAMILY} !important;
      color: #000000 !important;
      line-height: ${LINE_HEIGHTS.tight} !important;
      text-rendering: optimizeLegibility !important;
      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
      letter-spacing: -0.01em !important;
      padding: 0 !important;
    }
    .pdf-export-container h2 {
      font-size: ${FONT_SIZES.heading2} !important;
      font-weight: 700 !important;
      margin-bottom: ${SPACING.tiny} !important; /* Reduced spacing */
      color: #000000 !important;
      letter-spacing: -0.02em !important;
    }
    .pdf-export-container h3 {
      font-size: ${FONT_SIZES.heading3} !important;
      font-weight: 600 !important;
      margin-bottom: ${SPACING.tiny} !important; /* Reduced spacing */
      color: #000000 !important;
      letter-spacing: -0.015em !important;
    }
    .pdf-export-container .skill-item {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      height: 22px !important; /* Reduced height */
      margin: ${SPACING.tiny} !important; /* Reduced spacing */
      padding: 0 6px !important; /* Reduced padding */
      vertical-align: middle !important;
      line-height: 22px !important; /* Reduced line height */
      font-size: ${FONT_SIZES.small} !important;
      font-weight: 500 !important;
      border-radius: 3px !important;
    }
    .pdf-export-container .skills-container {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: ${SPACING.tiny} !important; /* Reduced gap */
      margin: 0 ${SPACING.tiny} !important; /* Reduced margin */
    }
    .pdf-export-container .resume-content-inner {
      padding: 0 !important;
      margin: 0 !important;
    }
    .pdf-export-container .skills-wrapper {
      display: block !important;
      width: 100% !important;
      margin-bottom: ${SPACING.small} !important; /* Reduced margin */
      visibility: visible !important;
      opacity: 1 !important;
    }
    .pdf-export-container .mb-6 {
      margin-bottom: ${SPACING.small} !important; /* Reduced margin */
    }
    .pdf-export-container .mb-3 {
      margin-bottom: 3px !important; /* Reduced margin */
    }
    .pdf-export-container .space-y-4 {
      margin-top: 4px !important; /* Reduced margin */
    }
    .pdf-export-container .space-y-3 {
      margin-top: 3px !important; /* Reduced margin */
    }
    .pdf-export-container .text-xs {
      font-size: ${FONT_SIZES.xsmall} !important;
      line-height: ${LINE_HEIGHTS.tight} !important;
    }
    .pdf-export-container .text-sm {
      font-size: ${FONT_SIZES.small} !important;
      line-height: ${LINE_HEIGHTS.tight} !important;
    }
    .pdf-export-container p, 
    .pdf-export-container span, 
    .pdf-export-container div,
    .pdf-export-container li {
      text-rendering: optimizeLegibility !important;
      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
      letter-spacing: -0.01em !important;
    }
    .pdf-export-container li {
      margin-bottom: ${SPACING.none} !important; /* Removed margin */
      line-height: ${LINE_HEIGHTS.tighter} !important; /* Tighter line height */
    }
    .pdf-export-container .section-header {
      margin-top: ${SPACING.small} !important; /* Reduced margin */
      margin-bottom: ${SPACING.tiny} !important; /* Reduced margin */
    }
    .pdf-export-container .experience-item {
      page-break-inside: avoid !important;
    }
    .pdf-export-container .p-8,
    .pdf-export-container .p-6 {
      padding: ${SPACING.small} !important; /* Reduced padding */
    }
  `;
};

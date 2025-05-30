
import { FONT_FAMILY, FONT_SIZES, LINE_HEIGHTS, SPACING } from './constants';

/**
 * Returns CSS styles for PDF export as a string
 */
export const getPdfCssStyles = (): string => {
  return `
    .pdf-export-container {
      font-size: ${FONT_SIZES.base}px !important;
      font-family: ${FONT_FAMILY} !important;
      color: #000000 !important;
      line-height: ${LINE_HEIGHTS.tight} !important;
      text-rendering: optimizeLegibility !important;
      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
      letter-spacing: 0.02em !important;
      padding: 0 !important;
    }
    .pdf-export-container h2 {
      font-size: ${FONT_SIZES.heading2}px !important;
      font-weight: 700 !important;
      font-family: ${FONT_FAMILY} !important;
      margin-bottom: ${SPACING.xs}in !important;
      color: #000000 !important;
      letter-spacing: 0.01em !important;
      text-rendering: optimizeLegibility !important;
      line-height: ${LINE_HEIGHTS.tight} !important;
    }
    .pdf-export-container h3 {
      font-size: ${FONT_SIZES.heading3}px !important;
      font-weight: 600 !important;
      font-family: ${FONT_FAMILY} !important;
      margin-bottom: ${SPACING.xs}in !important;
      color: #000000 !important;
      letter-spacing: 0.01em !important;
      text-rendering: optimizeLegibility !important;
      line-height: ${LINE_HEIGHTS.tight} !important;
    }
    .pdf-export-container h4 {
      font-size: ${FONT_SIZES.small}px !important;
      font-weight: 600 !important;
      font-family: ${FONT_FAMILY} !important;
      color: #000000 !important;
      letter-spacing: 0.02em !important;
      text-rendering: optimizeLegibility !important;
      line-height: ${LINE_HEIGHTS.tight} !important;
    }
    .pdf-export-container .skill-item {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      height: 22px !important;
      margin: ${SPACING.xs}in !important;
      padding: 0 6px !important;
      vertical-align: middle !important;
      line-height: 22px !important;
      font-size: ${FONT_SIZES.small}px !important;
      font-weight: 500 !important;
      font-family: ${FONT_FAMILY} !important;
      letter-spacing: 0.01em !important;
      border-radius: 3px !important;
      text-rendering: optimizeLegibility !important;
    }
    .pdf-export-container .skills-container {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: ${SPACING.xs}in !important;
      margin: 0 ${SPACING.xs}in !important;
    }
    .pdf-export-container .resume-content-inner {
      padding: 0 !important;
      margin: 0 !important;
    }
    .pdf-export-container .skills-wrapper {
      display: block !important;
      width: 100% !important;
      margin-bottom: ${SPACING.sm}in !important;
      visibility: visible !important;
      opacity: 1 !important;
      position: relative !important;
    }
    .pdf-export-container .mb-6 {
      margin-bottom: ${SPACING.sm}in !important;
    }
    .pdf-export-container .mb-3 {
      margin-bottom: ${SPACING.xs}in !important;
    }
    .pdf-export-container .space-y-4 {
      margin-top: ${SPACING.sm}in !important;
    }
    .pdf-export-container .space-y-3 {
      margin-top: ${SPACING.xs}in !important;
    }
    .pdf-export-container .text-xs {
      font-size: ${FONT_SIZES.xsmall}px !important;
      font-family: ${FONT_FAMILY} !important;
      line-height: ${LINE_HEIGHTS.tight} !important;
      letter-spacing: 0.02em !important;
    }
    .pdf-export-container .text-sm {
      font-size: ${FONT_SIZES.small}px !important;
      font-family: ${FONT_FAMILY} !important;
      line-height: ${LINE_HEIGHTS.tight} !important;
      letter-spacing: 0.02em !important;
    }
    .pdf-export-container p, 
    .pdf-export-container span, 
    .pdf-export-container div,
    .pdf-export-container li {
      font-family: ${FONT_FAMILY} !important;
      text-rendering: optimizeLegibility !important;
      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
      letter-spacing: 0.02em !important;
      line-height: ${LINE_HEIGHTS.normal} !important;
    }
    .pdf-export-container li {
      margin-bottom: 0 !important;
      line-height: ${LINE_HEIGHTS.tight} !important;
      font-family: ${FONT_FAMILY} !important;
      letter-spacing: 0.02em !important;
    }
    .pdf-export-container .section-header {
      margin-top: ${SPACING.sm}in !important;
      margin-bottom: ${SPACING.xs}in !important;
      font-family: ${FONT_FAMILY} !important;
      letter-spacing: 0.01em !important;
    }
    .pdf-export-container .experience-item {
      page-break-inside: avoid !important;
    }
    .pdf-export-container .p-8,
    .pdf-export-container .p-6 {
      padding: ${SPACING.sm}in !important;
    }
    .pdf-export-container .font-medium {
      font-weight: 600 !important;
      font-family: ${FONT_FAMILY} !important;
      letter-spacing: 0.01em !important;
    }
    .pdf-export-container .font-semibold {
      font-weight: 600 !important;
      font-family: ${FONT_FAMILY} !important;
      letter-spacing: 0.01em !important;
    }
    .pdf-export-container .font-bold {
      font-weight: 700 !important;
      font-family: ${FONT_FAMILY} !important;
      letter-spacing: 0.01em !important;
    }
  `;
};


/**
 * Constants used for PDF styling and formatting
 */

// Font sizes - numeric values for jsPDF
export const FONT_SIZES = {
  base: 10,         // Base font size for body text
  small: 9,         // Small text
  xsmall: 8,        // Extra small text
  heading2: 14,     // Main headings
  heading3: 11      // Section headings
};

// Line heights - optimized for PDF readability
export const LINE_HEIGHTS = {
  tight: 1.2,         // Tight for compact layout
  tighter: 1.15,      // Tighter for lists
  compact: 1.1        // Very compact for small text
};

// Spacing values - numeric values for jsPDF
export const SPACING = {
  none: 0,
  tiny: 0.02,          // Smallest spacing
  xsmall: 0.03,        // Very small gaps
  small: 0.04,         // Small gaps between elements
  medium: 0.06,        // Medium gaps
  base: 0.08,          // Base spacing
  large: 0.10          // Largest spacing
};

// PDF dimensions (US Letter)
export const PDF_DIMENSIONS = {
  width: 8.5,
  height: 11,
  widthPx: 794,
};

// Font families - simple and reliable for PDF
export const FONT_FAMILY = "helvetica";

// Letter spacing values - numeric for PDF clarity
export const LETTER_SPACING = {
  tight: 0,           // No extra spacing for headings
  normal: 0.1,        // Minimal spacing for body text
  loose: 0.2          // Slight spacing only when needed
};

// Common colors
export const COLORS = {
  black: '#000000',
  white: '#ffffff',
  grayLight: '#f3f4f6',
  gray: '#d1d5db'
};

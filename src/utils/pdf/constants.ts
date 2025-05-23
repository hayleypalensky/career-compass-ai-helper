
/**
 * Constants used for PDF styling and formatting
 */

// Font sizes - making more consistent
export const FONT_SIZES = {
  base: '10px',         // Base font size for body text
  small: '9px',         // Small text
  xsmall: '8px',        // Extra small text
  heading2: '14px',     // Main headings
  heading3: '11px'      // Section headings
};

// Line heights - optimized for PDF readability
export const LINE_HEIGHTS = {
  tight: '1.2',         // Tight for compact layout
  tighter: '1.15',      // Tighter for lists
  compact: '1.1'        // Very compact for small text
};

// Spacing values - optimized for PDF
export const SPACING = {
  none: '0',
  tiny: '2px',          // Smallest spacing
  xsmall: '3px',        // Very small gaps
  small: '4px',         // Small gaps between elements
  medium: '6px',        // Medium gaps
  base: '8px',          // Base spacing
  large: '10px'         // Largest spacing
};

// PDF dimensions (US Letter)
export const PDF_DIMENSIONS = {
  width: '8.5in',
  height: '11in',
  widthPx: '794px',
};

// Font families - simple and reliable for PDF
export const FONT_FAMILY = "helvetica";

// Letter spacing values - minimal for PDF clarity
export const LETTER_SPACING = {
  tight: '0',           // No extra spacing for headings
  normal: '0.1',        // Minimal spacing for body text
  loose: '0.2'          // Slight spacing only when needed
};

// Common colors
export const COLORS = {
  black: '#000000',
  white: '#ffffff',
  grayLight: '#f3f4f6',
  gray: '#d1d5db'
};

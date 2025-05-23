
/**
 * Constants used for PDF styling and formatting
 */

// Font sizes for jsPDF (numeric values)
export const FONT_SIZES = {
  base: 10,         // Base font size for body text
  small: 9,         // Small text
  xsmall: 8,        // Extra small text
  heading2: 14,     // Main headings
  heading3: 11      // Section headings
};

// Line heights (multipliers for font size)
export const LINE_HEIGHTS = {
  tight: 1.2,       // Tight for compact layout
  normal: 1.4,      // Normal for most text
  relaxed: 1.6      // Relaxed for better readability
};

// Spacing values in inches - optimized for consistent layout
export const SPACING = {
  xs: 0.08,         // Extra small spacing
  sm: 0.12,         // Small spacing
  md: 0.18,         // Medium spacing
  lg: 0.25,         // Large spacing
  xl: 0.35          // Extra large spacing
};

// PDF dimensions (US Letter)
export const PDF_DIMENSIONS = {
  width: 8.5,       // Width in inches
  height: 11,       // Height in inches
  widthPx: 794      // Width in pixels (for HTML preview)
};

// PDF margins in inches - reduced for better space utilization
export const PDF_MARGINS = {
  top: 0.5,
  bottom: 0.5,
  left: 0.6,
  right: 0.6
};

// Font family
export const FONT_FAMILY = "helvetica";

// Colors
export const COLORS = {
  black: '#000000',
  gray: '#4B5563',
  grayLight: '#9CA3AF',
  white: '#FFFFFF'
};

// Bullet point character
export const BULLET_CHAR = "•";

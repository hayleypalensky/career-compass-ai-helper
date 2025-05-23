
/**
 * Constants used for PDF styling and formatting
 */

// Font sizes for jsPDF (numeric values)
export const FONT_SIZES = {
  base: 10,         // Base font size for body text
  small: 9,         // Small text
  xsmall: 8,        // Extra small text
  heading2: 16,     // Main headings - increased for better hierarchy
  heading3: 12      // Section headings - increased slightly
};

// Line heights (multipliers for font size) - balanced for readability and space utilization
export const LINE_HEIGHTS = {
  tight: 1.2,       // Tight for compact layout
  normal: 1.3,      // Slightly increased from default
  relaxed: 1.4      // For better readability
};

// Spacing values in inches - adjusted for better page utilization
export const SPACING = {
  xs: 0.06,         // Extra small spacing - reduced
  sm: 0.10,         // Small spacing - reduced
  md: 0.16,         // Medium spacing - reduced
  lg: 0.22,         // Large spacing - reduced
  xl: 0.28          // Extra large spacing - reduced
};

// PDF dimensions (US Letter)
export const PDF_DIMENSIONS = {
  width: 8.5,       // Width in inches
  height: 11,       // Height in inches
  widthPx: 794      // Width in pixels (for HTML preview)
};

// PDF margins in inches - reduced for better space utilization
export const PDF_MARGINS = {
  top: 0.4,         // Reduced from 0.5
  bottom: 0.4,      // Reduced from 0.5
  left: 0.5,        // Reduced from 0.6
  right: 0.5        // Reduced from 0.6
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

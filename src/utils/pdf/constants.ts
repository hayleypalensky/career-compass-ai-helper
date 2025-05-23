
/**
 * Constants used for PDF styling and formatting
 */

// Font sizes for jsPDF (numeric values)
export const FONT_SIZES = {
  base: 10,         // Base font size for body text
  small: 9,         // Small text
  xsmall: 8,        // Extra small text
  heading2: 18,     // Main headings - increased for better hierarchy like reference
  heading3: 11      // Section headings - clean and readable
};

// Line heights (multipliers for font size) - optimized for clean readability
export const LINE_HEIGHTS = {
  tight: 1.1,       // Tight for compact layout
  normal: 1.25,     // Clean normal spacing like reference
  relaxed: 1.4      // For better readability
};

// Spacing values in inches - refined to match reference layout
export const SPACING = {
  xs: 0.08,         // Minimal spacing
  sm: 0.12,         // Small spacing between elements
  md: 0.18,         // Medium spacing for section breaks
  lg: 0.22,         // Large spacing between major elements
  xl: 0.28,         // Extra large spacing for section separation
  section: 0.32,    // Clean section breaks like reference
  element: 0.14,    // Spacing between related elements
  header: 0.16,     // Specific header spacing
  bullet: 0.12      // Clean bullet point spacing
};

// PDF dimensions (US Letter)
export const PDF_DIMENSIONS = {
  width: 8.5,       // Width in inches
  height: 11,       // Height in inches
  widthPx: 794      // Width in pixels (for HTML preview)
};

// PDF margins in inches - clean margins like reference
export const PDF_MARGINS = {
  top: 0.5,         // Clean top margin
  bottom: 0.5,      // Clean bottom margin
  left: 0.6,        // Professional left margin
  right: 0.6        // Professional right margin
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


/**
 * Constants used for PDF styling and formatting
 */

// Font sizes for jsPDF (numeric values)
export const FONT_SIZES = {
  base: 10,         // Base font size for body text
  small: 9,         // Small text (for descriptions)
  xsmall: 8,        // Extra small text (for footnotes)
  heading2: 16,     // Main headings - slightly reduced for better proportion
  heading3: 12      // Section headings - slightly increased for emphasis
};

// Line heights (multipliers for font size) - optimized for clean readability
export const LINE_HEIGHTS = {
  tight: 1.1,       // Tight for compact layout
  normal: 1.3,      // Improved spacing for better readability
  relaxed: 1.5      // For better readability in longer text
};

// Spacing values in inches - refined to match reference layout
export const SPACING = {
  xs: 0.07,         // Minimal spacing
  sm: 0.11,         // Small spacing between elements
  md: 0.2,          // Medium spacing for section breaks
  lg: 0.25,         // Large spacing between major elements
  xl: 0.35,         // Extra large spacing for major section separation
  section: 0.4,     // Section breaks (increased for better visual separation)
  element: 0.15,    // Spacing between related elements
  header: 0.18,     // Specific header spacing (increased)
  bullet: 0.14      // Bullet point spacing (increased for better readability)
};

// PDF dimensions (US Letter)
export const PDF_DIMENSIONS = {
  width: 8.5,       // Width in inches
  height: 11,       // Height in inches
  widthPx: 794      // Width in pixels (for HTML preview)
};

// PDF margins in inches - clean margins like reference
export const PDF_MARGINS = {
  top: 0.6,         // Increased top margin for better balance
  bottom: 0.6,      // Increased bottom margin for better balance
  left: 0.7,        // Increased left margin for better balance
  right: 0.7        // Increased right margin for better balance
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

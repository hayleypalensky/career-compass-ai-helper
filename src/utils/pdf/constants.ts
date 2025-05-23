
/**
 * Constants used for PDF styling and formatting
 */

// Font sizes for jsPDF (numeric values)
export const FONT_SIZES = {
  name: 18,         // Name/header
  heading: 14,      // Section headings
  subheading: 12,   // Job titles, degrees
  body: 10,         // Body text
  small: 9          // Dates, descriptions
};

// Line heights (multipliers for font size)
export const LINE_HEIGHTS = {
  tight: 1.2,
  normal: 1.4,
  loose: 1.6
};

// Spacing values in inches
export const SPACING = {
  section: 0.25,    // Between major sections
  subsection: 0.15, // Between items within sections
  line: 0.12,       // Between lines of text
  bullet: 0.08,     // Between bullet points
  margin: 0.75      // Page margins
};

// PDF dimensions (US Letter)
export const PDF_DIMENSIONS = {
  width: 8.5,
  height: 11
};

// Colors
export const COLORS = {
  black: '#000000',
  gray: '#666666',
  lightGray: '#999999'
};

// Font family
export const FONT_FAMILY = "helvetica";

// Bullet character
export const BULLET_CHAR = "•";

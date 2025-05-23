
/**
 * Constants used for PDF styling and formatting
 */

// Font sizes - making more consistent
export const FONT_SIZES = {
  base: '11px',         // Consistent base font size
  small: '10px',        // Small text
  xsmall: '9px',        // Extra small text
  heading2: '16px',     // Main headings reduced
  heading3: '13px'      // Section headings reduced
};

// Line heights - more consistent
export const LINE_HEIGHTS = {
  tight: '1.3',         // Slightly increased for better readability
  tighter: '1.25',      // Tighter for lists and compact areas
  compact: '1.2'        // Very compact for small text
};

// Spacing values - more consistent
export const SPACING = {
  none: '0',
  tiny: '1px',          // Smallest spacing
  xsmall: '2px',        // Very small gaps
  small: '3px',         // Small gaps between elements
  medium: '4px',        // Medium gaps
  base: '6px',          // Base spacing (reduced from 8px)
  large: '8px'          // Largest spacing (reduced from 10px)
};

// PDF dimensions (US Letter)
export const PDF_DIMENSIONS = {
  width: '8.5in',
  height: '11in',
  widthPx: '794px',     // 8.5in in pixels (slightly adjusted)
};

// Font families - ensuring consistency
export const FONT_FAMILY = "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";

// Letter spacing values for improved readability
export const LETTER_SPACING = {
  tight: '0.01em',      // For headings and bold text
  normal: '0.02em',     // For body text
  loose: '0.03em'       // For small text when needed
};

// Common colors
export const COLORS = {
  black: '#000000',
  white: '#ffffff',
  grayLight: '#f3f4f6',
  gray: '#d1d5db'
};

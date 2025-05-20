
import { applyContainerStyles } from './containerStyles';
import { getPdfCssStyles } from './cssStyles';
import { applySkillsStyles, applyLayoutStyles, applyTextStyles } from './elementStyles';

/**
 * Applies PDF-specific styles to prepare the resume for export
 * @param element The element to style for PDF export
 */
export const applyPdfStyles = (element: HTMLElement): void => {
  applyContainerStyles(element);
};

/**
 * Get CSS styles for PDF export
 * @returns CSS style content as string
 */
export const getPdfStylesContent = (): string => {
  return getPdfCssStyles();
};

/**
 * Applies comprehensive styling to ensure proper display in exported PDF
 * @param element The cloned content element
 */
export const styleSkillsForPdf = (element: HTMLElement): void => {
  // Apply all necessary styles to the element
  applySkillsStyles(element);
  applyLayoutStyles(element);
  applyTextStyles(element);
};

// Re-export everything for backward compatibility
export * from './containerStyles';
export * from './cssStyles';
export * from './elementStyles';
export * from './constants';

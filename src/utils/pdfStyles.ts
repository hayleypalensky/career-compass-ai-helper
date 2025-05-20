
/**
 * PDF export styling utilities
 * Contains styling constants and helper functions for PDF export
 */

/**
 * Applies PDF-specific styles to prepare the resume for export
 * @param element The element to style for PDF export
 */
export const applyPdfStyles = (element: HTMLElement): void => {
  // Set container styles
  element.className = "pdf-export-container";
  element.style.width = "794px"; // A4 width in pixels (slightly adjusted)
  element.style.padding = "30px";
  element.style.backgroundColor = "white";
  element.style.position = "absolute";
  element.style.left = "-9999px"; // Position off-screen
  element.style.fontSize = "14px"; // Increased font size for better readability
  element.style.fontFamily = "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"; // Use web-safe fonts
  element.style.color = "#000"; // Ensure sharp text
  element.style.textRendering = "optimizeLegibility"; // Improve text rendering
  
  // Add vendor-specific CSS properties with proper TypeScript handling
  (element.style as any)["-webkit-font-smoothing"] = "antialiased";
  (element.style as any)["-moz-osx-font-smoothing"] = "grayscale";
  (element.style as any).letterSpacing = "-0.01em"; // Slight letter spacing adjustment for clarity
};

/**
 * Get CSS styles for PDF export
 * @returns CSS style content as string
 */
export const getPdfStylesContent = (): string => {
  return `
    .pdf-export-container {
      font-size: 14px !important;
      font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif !important;
      color: #000000 !important;
      line-height: 1.5 !important;
      text-rendering: optimizeLegibility !important;
      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
      letter-spacing: -0.01em !important;
    }
    .pdf-export-container h2 {
      font-size: 22px !important;
      font-weight: 700 !important;
      margin-bottom: 8px !important;
      color: #000000 !important;
      letter-spacing: -0.02em !important;
    }
    .pdf-export-container h3 {
      font-size: 18px !important;
      font-weight: 600 !important;
      margin-bottom: 6px !important;
      color: #000000 !important;
      letter-spacing: -0.015em !important;
    }
    .pdf-export-container .skill-item {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      height: 28px !important; /* Slightly taller for better readability */
      margin: 3px !important;
      padding: 0 12px !important;
      vertical-align: middle !important;
      line-height: 28px !important;
      font-size: 13px !important;
      font-weight: 500 !important;
      border-radius: 4px !important;
    }
    .pdf-export-container .skills-container {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 5px !important;
      margin: 0 5px !important;
    }
    .pdf-export-container .resume-content-inner {
      padding: 25px !important;
      margin: 0 !important;
    }
    /* Ensure the skills wrapper is visible */
    .pdf-export-container .skills-wrapper {
      display: block !important;
      width: 100% !important;
      margin-bottom: 15px !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
    /* Reduce spacing between items */
    .pdf-export-container .mb-6 {
      margin-bottom: 18px !important;
    }
    .pdf-export-container .mb-3 {
      margin-bottom: 10px !important;
    }
    .pdf-export-container .space-y-4 {
      margin-top: 10px !important;
    }
    .pdf-export-container .space-y-3 {
      margin-top: 8px !important;
    }
    /* Make text more readable */
    .pdf-export-container .text-xs {
      font-size: 12px !important;
      line-height: 1.5 !important;
    }
    .pdf-export-container .text-sm {
      font-size: 13px !important;
      line-height: 1.5 !important;
    }
    /* Improve text rendering */
    .pdf-export-container p, 
    .pdf-export-container span, 
    .pdf-export-container div,
    .pdf-export-container li {
      text-rendering: optimizeLegibility !important;
      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
      letter-spacing: -0.01em !important;
    }
  `;
};

/**
 * Applies additional styling to ensure skills are visible in exported PDF
 * @param element The cloned content element
 */
export const styleSkillsForPdf = (element: HTMLElement): void => {
  // Force display of skills section
  const skillsSection = element.querySelector('.skills-wrapper');
  if (skillsSection) {
    (skillsSection as HTMLElement).style.display = 'block';
    (skillsSection as HTMLElement).style.width = '100%';
    (skillsSection as HTMLElement).style.marginBottom = '15px';
    (skillsSection as HTMLElement).style.visibility = 'visible';
    (skillsSection as HTMLElement).style.opacity = '1';
    (skillsSection as HTMLElement).style.position = 'relative';
  }
  
  // Style skills items for PDF export
  const skillItems = element.querySelectorAll('.skill-item');
  skillItems.forEach(item => {
    item.classList.add('skill-item'); 
    (item as HTMLElement).style.display = 'inline-flex';
    (item as HTMLElement).style.alignItems = 'center';
    (item as HTMLElement).style.justifyContent = 'center';
    (item as HTMLElement).style.height = '28px';
    (item as HTMLElement).style.fontSize = '13px';
    (item as HTMLElement).style.fontWeight = '500';
    (item as HTMLElement).style.margin = '3px';
    (item as HTMLElement).style.padding = '0 12px';
  });
  
  // Style skills container for PDF export
  const skillsContainer = element.querySelector('.skills-wrapper .flex');
  if (skillsContainer) {
    skillsContainer.classList.add('skills-container');
    (skillsContainer as HTMLElement).style.display = 'flex';
    (skillsContainer as HTMLElement).style.flexWrap = 'wrap';
    (skillsContainer as HTMLElement).style.gap = '5px';
    (skillsContainer as HTMLElement).style.margin = '0 5px';
  }
  
  // Reduce spacing in the resume
  const marginElements = element.querySelectorAll('.mb-6');
  marginElements.forEach(el => {
    (el as HTMLElement).style.marginBottom = '18px';
  });
  
  // Add class for margins
  const resumeInner = element.querySelector('.resume-inner');
  if (resumeInner) {
    resumeInner.classList.add('resume-content-inner');
    (resumeInner as HTMLElement).style.padding = '25px';
    (resumeInner as HTMLElement).style.margin = '0';
  }
  
  // Improve text rendering for all text elements
  const textElements = element.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, li');
  textElements.forEach(el => {
    (el as HTMLElement).style.textRendering = 'optimizeLegibility';
    (el as HTMLElement).style.letterSpacing = '-0.01em';
    
    // Use type casting to set vendor-specific properties
    const element = el as HTMLElement;
    (element.style as any)["-webkit-font-smoothing"] = "antialiased";
    (element.style as any)["-moz-osx-font-smoothing"] = "grayscale";
    
    element.style.color = '#000000';
  });
};

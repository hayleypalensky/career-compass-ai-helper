
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
  element.style.fontSize = "12px"; // Control font size to fit content
};

/**
 * Get CSS styles for PDF export
 * @returns CSS style content as string
 */
export const getPdfStylesContent = (): string => {
  return `
    .pdf-export-container {
      font-size: 12px !important;
    }
    .pdf-export-container h2 {
      font-size: 18px !important;
      margin-bottom: 8px !important;
    }
    .pdf-export-container h3 {
      font-size: 14px !important;
      margin-bottom: 6px !important;
    }
    .pdf-export-container .skill-item {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      height: 24px !important; /* Smaller height */
      margin: 2px !important;
      padding: 0 8px !important;
      vertical-align: middle !important;
      line-height: 24px !important;
      font-size: 10px !important;
    }
    .pdf-export-container .skills-container {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 4px !important;
      margin: 0 5px !important;
    }
    .pdf-export-container .resume-content-inner {
      padding: 15px !important;
      margin: 10px !important;
    }
    /* Ensure the skills wrapper is visible */
    .pdf-export-container .skills-wrapper {
      display: block !important;
      width: 100% !important;
      margin-bottom: 10px !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
    /* Reduce spacing between items */
    .pdf-export-container .mb-6 {
      margin-bottom: 12px !important;
    }
    .pdf-export-container .mb-3 {
      margin-bottom: 6px !important;
    }
    .pdf-export-container .space-y-4 {
      margin-top: 6px !important;
    }
    .pdf-export-container .space-y-3 {
      margin-top: 4px !important;
    }
    /* Make text smaller for descriptions */
    .pdf-export-container .text-xs {
      font-size: 9px !important;
    }
    .pdf-export-container .text-sm {
      font-size: 10px !important;
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
    (skillsSection as HTMLElement).style.marginBottom = '10px';
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
    (item as HTMLElement).style.height = '24px';
    (item as HTMLElement).style.fontSize = '10px';
  });
  
  // Style skills container for PDF export
  const skillsContainer = element.querySelector('.skills-wrapper .flex');
  if (skillsContainer) {
    skillsContainer.classList.add('skills-container');
    (skillsContainer as HTMLElement).style.display = 'flex';
    (skillsContainer as HTMLElement).style.flexWrap = 'wrap';
    (skillsContainer as HTMLElement).style.gap = '4px';
  }
  
  // Reduce spacing in the resume
  const marginElements = element.querySelectorAll('.mb-6');
  marginElements.forEach(el => {
    (el as HTMLElement).style.marginBottom = '12px';
  });
  
  // Add class for margins
  const resumeInner = element.querySelector('.resume-inner');
  if (resumeInner) {
    resumeInner.classList.add('resume-content-inner');
    (resumeInner as HTMLElement).style.padding = '15px';
  }
};

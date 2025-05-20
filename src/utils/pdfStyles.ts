
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
  element.style.padding = "20px"; // Reduced padding to fit more content
  element.style.backgroundColor = "white";
  element.style.position = "absolute";
  element.style.left = "-9999px"; // Position off-screen
  element.style.fontSize = "12px"; // Reduced font size to fit more content
  element.style.fontFamily = "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"; // Use web-safe fonts
  element.style.color = "#000"; // Ensure sharp text
  element.style.textRendering = "optimizeLegibility"; // Improve text rendering
  
  // Add vendor-specific CSS properties with proper TypeScript handling
  element.style.setProperty("-webkit-font-smoothing", "antialiased");
  element.style.setProperty("-moz-osx-font-smoothing", "grayscale");
  element.style.setProperty("letter-spacing", "-0.01em"); // Slight letter spacing adjustment for clarity
};

/**
 * Get CSS styles for PDF export
 * @returns CSS style content as string
 */
export const getPdfStylesContent = (): string => {
  return `
    .pdf-export-container {
      font-size: 12px !important; /* Reduced font size */
      font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif !important;
      color: #000000 !important;
      line-height: 1.3 !important; /* Tighter line height */
      text-rendering: optimizeLegibility !important;
      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
      letter-spacing: -0.01em !important;
      padding: 0.5in !important; /* 0.5 inch padding on all sides */
    }
    .pdf-export-container h2 {
      font-size: 18px !important; /* Reduced size */
      font-weight: 700 !important;
      margin-bottom: 4px !important; /* Reduced margin */
      color: #000000 !important;
      letter-spacing: -0.02em !important;
    }
    .pdf-export-container h3 {
      font-size: 14px !important; /* Reduced size */
      font-weight: 600 !important;
      margin-bottom: 3px !important; /* Reduced margin */
      color: #000000 !important;
      letter-spacing: -0.015em !important;
    }
    .pdf-export-container .skill-item {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      height: 24px !important; /* Reduced height */
      margin: 2px !important; /* Reduced margin */
      padding: 0 8px !important; /* Reduced padding */
      vertical-align: middle !important;
      line-height: 24px !important;
      font-size: 11px !important; /* Smaller font size */
      font-weight: 500 !important;
      border-radius: 3px !important; /* Slightly smaller radius */
    }
    .pdf-export-container .skills-container {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 3px !important; /* Reduced gap */
      margin: 0 3px !important; /* Reduced margin */
    }
    .pdf-export-container .resume-content-inner {
      padding: 15px !important; /* Reduced padding */
      margin: 0 !important;
    }
    /* Ensure the skills wrapper is visible */
    .pdf-export-container .skills-wrapper {
      display: block !important;
      width: 100% !important;
      margin-bottom: 10px !important; /* Reduced margin */
      visibility: visible !important;
      opacity: 1 !important;
    }
    /* Reduce spacing between items */
    .pdf-export-container .mb-6 {
      margin-bottom: 12px !important; /* Reduced margin */
    }
    .pdf-export-container .mb-3 {
      margin-bottom: 6px !important; /* Reduced margin */
    }
    .pdf-export-container .space-y-4 {
      margin-top: 8px !important; /* Reduced margin */
    }
    .pdf-export-container .space-y-3 {
      margin-top: 6px !important; /* Reduced margin */
    }
    /* Make text more readable but compact */
    .pdf-export-container .text-xs {
      font-size: 10px !important;
      line-height: 1.3 !important; /* Tighter line height */
    }
    .pdf-export-container .text-sm {
      font-size: 11px !important;
      line-height: 1.3 !important; /* Tighter line height */
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
    /* Reduce bullet point spacing */
    .pdf-export-container li {
      margin-bottom: 2px !important;
      line-height: 1.3 !important;
    }
    /* Make sure section headers have proper spacing */
    .pdf-export-container .section-header {
      margin-top: 10px !important;
      margin-bottom: 4px !important;
    }
    /* Ensure content wrapping */
    .pdf-export-container .experience-item {
      page-break-inside: avoid !important;
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
    (skillsSection as HTMLElement).style.marginBottom = '10px'; // Reduced margin
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
    (item as HTMLElement).style.height = '24px'; // Reduced height
    (item as HTMLElement).style.fontSize = '11px'; // Smaller font
    (item as HTMLElement).style.fontWeight = '500';
    (item as HTMLElement).style.margin = '2px'; // Reduced margin
    (item as HTMLElement).style.padding = '0 8px'; // Reduced padding
  });
  
  // Style skills container for PDF export
  const skillsContainer = element.querySelector('.skills-wrapper .flex');
  if (skillsContainer) {
    skillsContainer.classList.add('skills-container');
    (skillsContainer as HTMLElement).style.display = 'flex';
    (skillsContainer as HTMLElement).style.flexWrap = 'wrap';
    (skillsContainer as HTMLElement).style.gap = '3px'; // Reduced gap
    (skillsContainer as HTMLElement).style.margin = '0 3px'; // Reduced margin
  }
  
  // Reduce spacing in the resume
  const marginElements = element.querySelectorAll('.mb-6');
  marginElements.forEach(el => {
    (el as HTMLElement).style.marginBottom = '12px'; // Reduced margin
  });
  
  // Add class for margins
  const resumeInner = element.querySelector('.resume-inner');
  if (resumeInner) {
    resumeInner.classList.add('resume-content-inner');
    (resumeInner as HTMLElement).style.padding = '15px'; // Reduced padding
    (resumeInner as HTMLElement).style.margin = '0';
  }
  
  // Section headers should have less margin
  const sectionHeaders = element.querySelectorAll('h2');
  sectionHeaders.forEach(header => {
    header.classList.add('section-header');
    (header as HTMLElement).style.marginBottom = '4px'; // Reduced margin
    (header as HTMLElement).style.marginTop = '10px'; // Reduced margin
  });
  
  // Reduce bullet point spacing
  const bulletPoints = element.querySelectorAll('li, .bullet-point');
  bulletPoints.forEach(bullet => {
    (bullet as HTMLElement).style.marginBottom = '2px'; // Very small margin
    (bullet as HTMLElement).style.lineHeight = '1.3'; // Tight line height
  });
  
  // Improve text rendering for all text elements
  const textElements = element.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, li');
  textElements.forEach(el => {
    (el as HTMLElement).style.setProperty('text-rendering', 'optimizeLegibility');
    (el as HTMLElement).style.setProperty('-webkit-font-smoothing', 'antialiased');
    (el as HTMLElement).style.setProperty('-moz-osx-font-smoothing', 'grayscale');
    (el as HTMLElement).style.setProperty('letter-spacing', '-0.01em');
    
    (el as HTMLElement).style.color = '#000000';
  });
};

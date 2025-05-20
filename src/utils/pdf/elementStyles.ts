
/**
 * Applies styles to specific elements for PDF export
 */

/**
 * Styles skills elements to ensure proper display in PDF
 * @param element The cloned content element
 */
export const applySkillsStyles = (element: HTMLElement): void => {
  // Force display of skills section
  const skillsSection = element.querySelector('.skills-wrapper');
  if (skillsSection) {
    (skillsSection as HTMLElement).style.display = 'block';
    (skillsSection as HTMLElement).style.width = '100%';
    (skillsSection as HTMLElement).style.marginBottom = '8px';
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
    (item as HTMLElement).style.height = '22px';
    (item as HTMLElement).style.fontSize = '11px';
    (item as HTMLElement).style.fontWeight = '500';
    (item as HTMLElement).style.margin = '1px';
    (item as HTMLElement).style.padding = '0 6px';
  });
  
  // Style skills container for PDF export
  const skillsContainer = element.querySelector('.skills-wrapper .flex');
  if (skillsContainer) {
    skillsContainer.classList.add('skills-container');
    (skillsContainer as HTMLElement).style.display = 'flex';
    (skillsContainer as HTMLElement).style.flexWrap = 'wrap';
    (skillsContainer as HTMLElement).style.gap = '2px';
    (skillsContainer as HTMLElement).style.margin = '0 2px';
  }
};

/**
 * Applies spacing styles to improve layout in PDF
 * @param element The cloned content element
 */
export const applyLayoutStyles = (element: HTMLElement): void => {
  // Reduce spacing in the resume
  const marginElements = element.querySelectorAll('.mb-6');
  marginElements.forEach(el => {
    (el as HTMLElement).style.marginBottom = '10px';
  });
  
  // Add class for margins
  const resumeInner = element.querySelector('.resume-inner');
  if (resumeInner) {
    resumeInner.classList.add('resume-content-inner');
    (resumeInner as HTMLElement).style.padding = '10px';
    (resumeInner as HTMLElement).style.margin = '0';
  }
  
  // Section headers should have less margin
  const sectionHeaders = element.querySelectorAll('h2');
  sectionHeaders.forEach(header => {
    header.classList.add('section-header');
    (header as HTMLElement).style.marginBottom = '3px';
    (header as HTMLElement).style.marginTop = '8px';
  });
  
  // Reduce bullet point spacing
  const bulletPoints = element.querySelectorAll('li, .bullet-point');
  bulletPoints.forEach(bullet => {
    (bullet as HTMLElement).style.marginBottom = '1px';
    (bullet as HTMLElement).style.lineHeight = '1.25';
  });
};

/**
 * Enhances text rendering for better readability in PDF
 * @param element The cloned content element
 */
export const applyTextStyles = (element: HTMLElement): void => {
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


// Utility functions for generating text suggestions for resume tailoring

// Extract keywords from job description
export const extractKeywordsFromJobDescription = (description: string): string[] => {
  if (!description) return [];
  
  const commonJobTerms = [
    "leadership", "management", "development", "strategy", "analysis",
    "planning", "execution", "communication", "collaboration", "project",
    "innovation", "improvement", "efficiency", "skills", "experience",
    "implementation", "solution", "design", "customer", "client", 
    "stakeholder", "team", "budget", "revenue", "growth", "cost reduction"
  ];
  
  // Find terms in the job description
  return commonJobTerms.filter(term => 
    description.toLowerCase().includes(term.toLowerCase())
  );
};

// Helper function to generate role-appropriate deliverables
export const getContextRelevantDeliverable = (experienceTitle: string): string => {
  const roleKeywords = experienceTitle.toLowerCase();
  
  if (roleKeywords.includes("engineer") || roleKeywords.includes("developer")) {
    const deliverables = [
      "microservices architecture", "backend API", "frontend application", 
      "database optimization solution", "CI/CD pipeline", "cloud infrastructure"
    ];
    return deliverables[Math.floor(Math.random() * deliverables.length)];
  }
  
  if (roleKeywords.includes("manager") || roleKeywords.includes("lead")) {
    const deliverables = [
      "strategic initiative", "team restructuring plan", "process improvement", 
      "cross-departmental project", "resource allocation strategy"
    ];
    return deliverables[Math.floor(Math.random() * deliverables.length)];
  }
  
  if (roleKeywords.includes("designer") || roleKeywords.includes("ux")) {
    const deliverables = [
      "user interface redesign", "user experience flow", "design system", 
      "brand identity refresh", "interactive prototype"
    ];
    return deliverables[Math.floor(Math.random() * deliverables.length)];
  }
  
  // Default deliverables
  const defaultDeliverables = [
    "key project", "strategic initiative", "critical component", 
    "business solution", "customer-facing feature"
  ];
  return defaultDeliverables[Math.floor(Math.random() * defaultDeliverables.length)];
};

// Generate a relevant project based on experience and job keywords
export const getRelevantProject = (experienceTitle: string, experienceDescription: string | undefined, experienceCompany: string, jobKeywords: string[]): string => {
  // Try to find a project that matches both the experience and job keywords
  const relevantWords = jobKeywords.filter(word => 
    experienceDescription?.toLowerCase().includes(word) || 
    experienceCompany.toLowerCase().includes(word) ||
    experienceTitle.toLowerCase().includes(word)
  );
  
  if (relevantWords.length > 0) {
    const word = relevantWords[Math.floor(Math.random() * relevantWords.length)];
    const projects = [
      `${word}-focused projects`,
      `${word} initiative`,
      `${word} strategy implementation`,
      `enterprise ${word} solution`
    ];
    return projects[Math.floor(Math.random() * projects.length)];
  }
  
  // Default projects based on role
  const roleKeywords = experienceTitle.toLowerCase();
  
  if (roleKeywords.includes("engineer") || roleKeywords.includes("developer")) {
    const techProjects = [
      "system architecture redesign", 
      "application performance optimization", 
      "cloud migration project",
      "API integration framework"
    ];
    return techProjects[Math.floor(Math.random() * techProjects.length)];
  }
  
  return "key business initiatives";
};

// Generate random team size for leadership roles
export const getRandomTeamSize = (): string => {
  const sizes = ["3-5", "5-7", "8-10", "10+", "cross-functional"];
  return sizes[Math.floor(Math.random() * sizes.length)];
};

// Helper function to generate random action verbs
export const getRandomActionVerb = (capitalized = false): string => {
  const verbs = [
    "improved", "increased", "reduced", "developed", "implemented",
    "created", "established", "led", "managed", "coordinated",
    "streamlined", "enhanced", "optimized", "accelerated", "achieved",
    "designed", "deployed", "architected", "engineered", "delivered"
  ];
  
  const verb = verbs[Math.floor(Math.random() * verbs.length)];
  return capitalized ? verb.charAt(0).toUpperCase() + verb.slice(1) : verb;
};

// Helper function to generate random technical outcomes
export const getRandomTechnicalOutcome = (): string => {
  const outcomes = [
    "reduced server response time by 25%",
    "improved application performance by 30%",
    "decreased deployment time from hours to minutes",
    "reduced downtime by over 40%",
    "enabled seamless integration with third-party services",
    "eliminated critical security vulnerabilities"
  ];
  
  return outcomes[Math.floor(Math.random() * outcomes.length)];
};

// Helper function to generate random technical benefits
export const getRandomTechnicalBenefit = (): string => {
  const benefits = [
    "accelerate development cycles",
    "enhance system reliability",
    "improve data processing efficiency",
    "enable real-time analytics",
    "streamline user authentication processes",
    "scale operations efficiently"
  ];
  
  return benefits[Math.floor(Math.random() * benefits.length)];
};

// Helper function to generate random design outcomes
export const getRandomDesignOutcome = (): string => {
  const outcomes = [
    "a 35% increase in user engagement",
    "significantly improved usability test scores",
    "positive feedback from 90% of beta testers",
    "a streamlined user journey with 25% fewer steps",
    "a modern interface that increased conversion by 20%"
  ];
  
  return outcomes[Math.floor(Math.random() * outcomes.length)];
};

// Helper function to generate random business metrics
export const getRandomBusinessMetric = (): string => {
  const metrics = [
    "20% improvement in efficiency",
    "30% reduction in costs",
    "$100K in annual savings",
    "40% faster time-to-market",
    "95% customer satisfaction rating",
    "25% increase in team productivity"
  ];
  
  return metrics[Math.floor(Math.random() * metrics.length)];
};

// Helper function to generate random business outcomes
export const getRandomBusinessOutcome = (): string => {
  const outcomes = [
    "exceeding quarterly targets by 15%",
    "receiving recognition from senior leadership",
    "setting new performance benchmarks for the department",
    "establishing best practices adopted company-wide",
    "significantly improving stakeholder satisfaction"
  ];
  
  return outcomes[Math.floor(Math.random() * outcomes.length)];
};

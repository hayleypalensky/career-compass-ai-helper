
import { Profile } from "@/types/profile";

// Helper function to analyze job descriptions and extract relevant and missing skills
export const analyzeJobDescription = (
  jobDescription: string,
  profile: Profile
): { relevantSkills: string[]; missingSkills: string[] } => {
  // Convert job description and skills to lowercase for case-insensitive matching
  const lowercaseDescription = jobDescription.toLowerCase();
  
  // Find skills from the user's profile that are mentioned in the job description
  const userSkills = profile.skills.map(skill => skill.name.toLowerCase());
  const relevantSkills = profile.skills
    .filter(skill => lowercaseDescription.includes(skill.name.toLowerCase()))
    .map(skill => skill.name);

  // Find skills in the job description that aren't in the user's profile
  // Enhanced common skills list with more categories
  const commonSkills = [
    // Technical skills
    "javascript", "typescript", "react", "angular", "vue", "node", "express",
    "python", "java", "c#", ".net", "php", "ruby", "go", "rust", "swift",
    "kubernetes", "docker", "aws", "azure", "gcp", "sql", "nosql", "mongodb",
    "postgresql", "mysql", "redis", "graphql", "rest", "api", "ci/cd", "git",
    "testing", "unit testing", "integration testing", "automation", "devops",
    
    // AI and Data Science
    "machine learning", "artificial intelligence", "data science", "nlp",
    "computer vision", "big data", "data analysis", "data visualization", 
    "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy",
    
    // Cloud and Infrastructure
    "cloud computing", "infrastructure", "serverless", "saas", "microservices",
    "containers", "networking", "security", "cybersecurity", "authentication",
    
    // Project Management and Methodologies
    "agile", "scrum", "kanban", "waterfall", "lean", "project management",
    "product management", "requirements gathering", "user stories", "sprints",
    
    // Soft Skills
    "leadership", "communication", "problem-solving", "teamwork", "collaboration",
    "time management", "critical thinking", "creativity", "adaptability",
    "presentation", "negotiation", "mentoring", "conflict resolution",
    
    // Business Skills
    "strategic planning", "business analysis", "market research", "stakeholder management",
    "budget management", "resource allocation", "risk assessment", "quality assurance"
  ];
  
  const missingSkills = commonSkills.filter(skill => 
    lowercaseDescription.includes(skill) && !userSkills.includes(skill)
  );

  return { relevantSkills, missingSkills };
};

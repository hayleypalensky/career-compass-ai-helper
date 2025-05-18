
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
  // This is a simplified approach - in a real app, you'd use NLP or a skills database
  const commonSkills = [
    "javascript", "typescript", "react", "angular", "vue", "node", "express",
    "python", "java", "c#", ".net", "php", "ruby", "go", "rust", "swift",
    "kubernetes", "docker", "aws", "azure", "gcp", "sql", "nosql", "mongodb",
    "postgresql", "mysql", "redis", "graphql", "rest", "api", "ci/cd", "git",
    "agile", "scrum", "leadership", "communication", "problem-solving", "teamwork"
  ];
  
  const missingSkills = commonSkills.filter(skill => 
    lowercaseDescription.includes(skill) && !userSkills.includes(skill)
  );

  return { relevantSkills, missingSkills };
};

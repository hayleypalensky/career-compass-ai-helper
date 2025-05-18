
import { Profile } from "@/types/profile";

interface JobPosting {
  title: string;
  company?: string;
  description?: string;
  skills: string[];
  match: number; // Match percentage 0-100
}

// Common tech job titles for suggestions
export const commonJobTitles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "Product Manager",
  "Data Scientist",
  "DevOps Engineer",
  "QA Engineer",
  "Software Engineer",
  "Mobile Developer",
  "Cloud Engineer",
  "Machine Learning Engineer",
  "System Administrator",
  "Technical Writer",
  "Project Manager"
];

// Sample job postings for demo purposes
export const sampleJobPostings: JobPosting[] = [
  {
    title: "Frontend Developer",
    company: "TechCorp",
    description: "We're looking for a frontend developer with React experience to join our team.",
    skills: ["react", "javascript", "typescript", "css", "html", "tailwind"],
    match: 0
  },
  {
    title: "Full Stack Developer",
    company: "WebSolutions",
    description: "Full stack role working with React, Node.js and MongoDB.",
    skills: ["react", "node.js", "mongodb", "express", "javascript", "typescript"],
    match: 0
  },
  {
    title: "UI/UX Designer",
    company: "DesignStudio",
    description: "Create user-centered designs for web and mobile applications.",
    skills: ["figma", "sketch", "user research", "wireframing", "prototyping", "ui design"],
    match: 0
  },
  {
    title: "DevOps Engineer",
    company: "CloudTech",
    description: "Implement CI/CD pipelines and manage cloud infrastructure.",
    skills: ["aws", "docker", "kubernetes", "jenkins", "terraform", "git"],
    match: 0
  },
  {
    title: "Data Scientist",
    company: "DataInsights",
    description: "Analyze large datasets and build machine learning models.",
    skills: ["python", "machine learning", "sql", "pandas", "tensorflow", "data visualization"],
    match: 0
  },
  {
    title: "Product Manager",
    company: "ProductLabs",
    description: "Lead product development from conception to launch.",
    skills: ["product strategy", "user stories", "agile", "market research", "roadmapping", "stakeholder management"],
    match: 0
  },
  {
    title: "Software Engineer",
    company: "CodeWorks",
    description: "Build robust backend systems and APIs.",
    skills: ["java", "spring", "algorithms", "data structures", "rest apis", "microservices"],
    match: 0
  },
  {
    title: "Mobile Developer",
    company: "AppFactory",
    description: "Develop native mobile applications for iOS and Android.",
    skills: ["swift", "kotlin", "react native", "flutter", "mobile ui", "app store deployment"],
    match: 0
  }
];

// Calculate the match percentage between user profile and job postings
export const calculateJobMatches = (profile: Profile, jobs = sampleJobPostings): JobPosting[] => {
  if (!profile || !profile.skills || profile.skills.length === 0) {
    return jobs;
  }

  const profileSkills = profile.skills.map(skill => skill.name.toLowerCase());
  
  const matchedJobs = jobs.map(job => {
    // Count how many skills match
    const matchingSkills = job.skills.filter(skill => 
      profileSkills.some(userSkill => userSkill.includes(skill) || skill.includes(userSkill))
    );
    
    const matchPercentage = Math.round((matchingSkills.length / job.skills.length) * 100);
    
    return {
      ...job,
      match: matchPercentage
    };
  });
  
  // Sort by match percentage (descending)
  return matchedJobs.sort((a, b) => b.match - a.match);
};

// Find similar jobs based on a given job title
export const findSimilarJobs = (jobTitle: string, profile: Profile, jobs = sampleJobPostings): JobPosting[] => {
  // First, try to find an exact match
  const exactMatch = jobs.find(job => 
    job.title.toLowerCase() === jobTitle.toLowerCase()
  );
  
  if (exactMatch) {
    // If found, find jobs with similar skills
    const targetSkills = exactMatch.skills;
    
    const similarJobs = jobs
      .filter(job => job.title.toLowerCase() !== jobTitle.toLowerCase()) // Exclude the exact match
      .map(job => {
        // Calculate similarity based on shared skills
        const sharedSkills = job.skills.filter(skill => 
          targetSkills.includes(skill)
        );
        
        const similarityScore = Math.round((sharedSkills.length / targetSkills.length) * 100);
        
        return {
          ...job,
          match: similarityScore
        };
      })
      .sort((a, b) => b.match - a.match);
    
    return similarJobs;
  }
  
  // If no exact match, do a fuzzy search
  const fuzzyMatches = jobs.map(job => {
    // Simple fuzzy matching - check if words in titles overlap
    const jobTitleWords = job.title.toLowerCase().split(/\s+/);
    const searchTitleWords = jobTitle.toLowerCase().split(/\s+/);
    
    const matchingWords = jobTitleWords.filter(word => 
      searchTitleWords.some(searchWord => word.includes(searchWord) || searchWord.includes(word))
    );
    
    const fuzzyMatchScore = matchingWords.length > 0 
      ? Math.round((matchingWords.length / Math.max(jobTitleWords.length, searchTitleWords.length)) * 100)
      : 0;
    
    return {
      ...job,
      match: fuzzyMatchScore
    };
  }).sort((a, b) => b.match - a.match);
  
  // Return top matches (with at least some similarity)
  return fuzzyMatches.filter(job => job.match > 0);
};

// Get skill gaps between profile and a specific job
export const getSkillGaps = (profile: Profile, job: JobPosting): string[] => {
  if (!profile || !profile.skills) return job.skills;
  
  const profileSkills = profile.skills.map(skill => skill.name.toLowerCase());
  
  return job.skills.filter(skill => 
    !profileSkills.some(userSkill => userSkill.includes(skill) || skill.includes(userSkill))
  );
};

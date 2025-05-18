
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Profile } from "@/types/profile";
import { Experience } from "@/components/ExperienceForm";
import { Skill } from "@/components/SkillsForm";

// Import refactored components
import RelevantSkillsCard from "./resume-tailoring/RelevantSkillsCard";
import MissingSkillsCard from "./resume-tailoring/MissingSkillsCard";
import ExperienceEditor from "./resume-tailoring/ExperienceEditor";
import ResumePreview from "./resume-tailoring/ResumePreview";
import SkillManagement from "./resume-tailoring/SkillManagement";
import ResumeColorSelector from "./resume-tailoring/ResumeColorSelector";
import SummaryEditor from "./resume-tailoring/SummaryEditor";

interface TailorResumeProps {
  profile: Profile;
  relevantSkills: string[];
  missingSkills: string[];
  onUpdateResume: (experiences: Experience[], skills: Skill[]) => void;
  jobDescription?: string;
}

const TailorResume = ({
  profile,
  relevantSkills,
  missingSkills,
  onUpdateResume,
  jobDescription = "",
}: TailorResumeProps) => {
  const { toast } = useToast();
  const [tailoredExperiences, setTailoredExperiences] = useState<Experience[]>(
    JSON.parse(JSON.stringify(profile.experiences))
  );
  const [userResponses, setUserResponses] = useState<Record<string, string>>({});
  const [skillsToAdd, setSkillsToAdd] = useState<string[]>([]);
  const [skillsToRemove, setSkillsToRemove] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>("purple");
  const [updatedSummary, setUpdatedSummary] = useState<string>(profile.personalInfo.summary || "");

  // Handle changes to experience bullet points
  const handleBulletChange = (expIndex: number, bulletIndex: number, value: string) => {
    setTailoredExperiences((prevExperiences) => {
      const newExperiences = [...prevExperiences];
      if (newExperiences[expIndex]) {
        const newBullets = [...newExperiences[expIndex].bullets];
        newBullets[bulletIndex] = value;
        newExperiences[expIndex] = {
          ...newExperiences[expIndex],
          bullets: newBullets,
        };
      }
      return newExperiences;
    });
  };

  // Add a new bullet point to an experience
  const addBullet = (expIndex: number) => {
    setTailoredExperiences((prevExperiences) => {
      const newExperiences = [...prevExperiences];
      if (newExperiences[expIndex]) {
        newExperiences[expIndex] = {
          ...newExperiences[expIndex],
          bullets: [...newExperiences[expIndex].bullets, ""],
        };
      }
      return newExperiences;
    });
  };

  // Remove a bullet point from an experience
  const removeBullet = (expIndex: number, bulletIndex: number) => {
    setTailoredExperiences((prevExperiences) => {
      const newExperiences = [...prevExperiences];
      if (newExperiences[expIndex]) {
        const newBullets = newExperiences[expIndex].bullets.filter(
          (_, i) => i !== bulletIndex
        );
        newExperiences[expIndex] = {
          ...newExperiences[expIndex],
          bullets: newBullets,
        };
      }
      return newExperiences;
    });
  };

  // Toggle missing skill selection (prevent duplicates)
  const toggleSkillSelection = (skill: string) => {
    setSkillsToAdd((prev) => {
      // Check if skill already exists in the profile (case insensitive)
      const alreadyInProfile = profile.skills.some(
        existingSkill => existingSkill.name.toLowerCase() === skill.toLowerCase()
      );
      
      // If already in profile, don't add it to skillsToAdd
      if (alreadyInProfile) {
        toast({
          title: "Skill already exists",
          description: `"${skill}" is already in your profile.`,
          variant: "default",
        });
        return prev.filter(s => s !== skill); // Remove it if it was previously added
      }
      
      // Check if it's already in skillsToAdd list
      if (prev.includes(skill)) {
        return prev.filter(s => s !== skill);
      } else {
        return [...prev, skill];
      }
    });
  };

  // Toggle removal of a skill from profile
  const toggleSkillRemoval = (skillId: string) => {
    setSkillsToRemove((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    );
  };

  // Update user response for a missing skill
  const updateResponse = (skill: string, response: string) => {
    setUserResponses((prev) => ({
      ...prev,
      [skill]: response,
    }));
  };

  // Generate suggestions for bullet points based on job description and relevant skills
  const generateBulletSuggestions = (expIndex: number, bulletIndex: number) => {
    const experience = tailoredExperiences[expIndex];
    const currentBullet = experience.bullets[bulletIndex];
    const suggestions: string[] = [];
    
    // Extract key terms from job description that are relevant to this specific experience
    const jobKeywords = extractKeywordsFromJobDescription(jobDescription);
    
    // Find skills that are relevant to both the experience and job
    const relevantTermsForExperience = jobKeywords.filter(term => 
      experience.title.toLowerCase().includes(term) || 
      experience.description?.toLowerCase().includes(term) ||
      term === experience.company.toLowerCase()
    );
    
    // Generate suggestions based on the experience type and job requirements
    const roleKeywords = experience.title.toLowerCase();
    const isLeadershipRole = roleKeywords.includes("manager") || roleKeywords.includes("lead") || 
                             roleKeywords.includes("director") || roleKeywords.includes("supervisor");
    
    const isTechnicalRole = roleKeywords.includes("engineer") || roleKeywords.includes("developer") || 
                            roleKeywords.includes("architect") || roleKeywords.includes("programmer");
    
    const isDesignRole = roleKeywords.includes("designer") || roleKeywords.includes("ux") || 
                         roleKeywords.includes("ui") || roleKeywords.includes("creative");
    
    // Add role-specific suggestions
    if (isLeadershipRole) {
      suggestions.push(
        `Led cross-functional team to deliver ${getContextRelevantDeliverable(experience)} resulting in ${getRandomBusinessOutcome()}`,
        `Managed ${getRandomTeamSize()} team members while implementing ${getRelevantProject(experience, jobKeywords)}`
      );
    }
    
    if (isTechnicalRole) {
      // Find technical skills in the relevant skills
      const technicalSkills = relevantSkills.filter(skill => 
        !["leadership", "communication", "teamwork", "management"].includes(skill.toLowerCase())
      );
      
      if (technicalSkills.length > 0) {
        const randomTechSkill = technicalSkills[Math.floor(Math.random() * technicalSkills.length)];
        suggestions.push(
          `Implemented ${randomTechSkill} solutions for ${getRelevantProject(experience, jobKeywords)} that ${getRandomTechnicalOutcome()}`,
          `Architected and developed ${getContextRelevantDeliverable(experience)} using ${randomTechSkill} to ${getRandomTechnicalBenefit()}`
        );
      }
    }
    
    if (isDesignRole) {
      suggestions.push(
        `Created user-centered designs for ${getRelevantProject(experience, jobKeywords)} resulting in ${getRandomDesignOutcome()}`,
        `Redesigned ${getContextRelevantDeliverable(experience)} to improve user experience, leading to ${getRandomBusinessMetric()}`
      );
    }
    
    // Add general suggestions based on the job description and relevant skills
    if (relevantTermsForExperience.length > 0) {
      const relevantTerm = relevantTermsForExperience[Math.floor(Math.random() * relevantTermsForExperience.length)];
      suggestions.push(
        `Demonstrated expertise in ${relevantTerm} by ${getRandomActionVerb()}ing ${getContextRelevantDeliverable(experience)}`,
        `Utilized knowledge of ${relevantTerm} to ${getRandomActionVerb()} ${getRelevantProject(experience, jobKeywords)}`
      );
    }
    
    // Add quantifiable suggestions based on the current bullet
    if (currentBullet && currentBullet.length > 10) {
      const cleanedBullet = currentBullet.replace(/^I |^Led |^Managed |^Developed /i, '');
      suggestions.push(
        `${getRandomActionVerb(true)} ${cleanedBullet}, resulting in ${getRandomBusinessMetric()}`,
        `Successfully ${getRandomActionVerb()} ${cleanedBullet} that led to ${getRandomBusinessOutcome()}`
      );
    }
    
    // Filter out empty suggestions and remove duplicates
    return [...new Set(suggestions.filter(s => s && s !== currentBullet))].slice(0, 3);
  };
  
  // Helper function to extract keywords from job description
  const extractKeywordsFromJobDescription = (description: string): string[] => {
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
  const getContextRelevantDeliverable = (experience: Experience): string => {
    const roleKeywords = experience.title.toLowerCase();
    
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
  const getRelevantProject = (experience: Experience, jobKeywords: string[]): string => {
    // Try to find a project that matches both the experience and job keywords
    const relevantWords = jobKeywords.filter(word => 
      experience.description?.toLowerCase().includes(word) || 
      experience.company.toLowerCase().includes(word) ||
      experience.title.toLowerCase().includes(word)
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
    const roleKeywords = experience.title.toLowerCase();
    
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
  const getRandomTeamSize = (): string => {
    const sizes = ["3-5", "5-7", "8-10", "10+", "cross-functional"];
    return sizes[Math.floor(Math.random() * sizes.length)];
  };
  
  // Helper function to generate random action verbs
  const getRandomActionVerb = (capitalized = false): string => {
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
  const getRandomTechnicalOutcome = (): string => {
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
  const getRandomTechnicalBenefit = (): string => {
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
  const getRandomDesignOutcome = (): string => {
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
  const getRandomBusinessMetric = (): string => {
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
  const getRandomBusinessOutcome = (): string => {
    const outcomes = [
      "exceeding quarterly targets by 15%",
      "receiving recognition from senior leadership",
      "setting new performance benchmarks for the department",
      "establishing best practices adopted company-wide",
      "significantly improving stakeholder satisfaction"
    ];
    
    return outcomes[Math.floor(Math.random() * outcomes.length)];
  };

  // Handle color theme changes
  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
  };

  // Handle summary update
  const handleSummaryChange = (summary: string) => {
    setUpdatedSummary(summary);
  };

  // Save the tailored resume
  const saveTailoredResume = () => {
    // Create unique skills from the selected missing skills (prevent duplicates)
    const existingSkillNames = profile.skills
      .filter(skill => !skillsToRemove.includes(skill.id))
      .map(skill => skill.name.toLowerCase());
    
    // Filter out skills to add that already exist in profile (case insensitive)
    const uniqueSkillsToAdd = skillsToAdd.filter(skillName => 
      !existingSkillNames.includes(skillName.toLowerCase())
    );
    
    // Create new skills array
    const newSkills: Skill[] = [
      ...profile.skills.filter(skill => !skillsToRemove.includes(skill.id)),
      ...uniqueSkillsToAdd.map((skillName) => ({
        id: crypto.randomUUID(),
        name: skillName,
        category: "Technical", // Default category
      })),
    ];

    // Create updated profile with new summary
    const updatedProfile = {
      ...profile,
      personalInfo: {
        ...profile.personalInfo,
        summary: updatedSummary
      }
    };

    onUpdateResume(tailoredExperiences, newSkills);
    
    toast({
      title: "Resume tailored successfully",
      description: "Your resume has been updated with the tailored content.",
    });
  };

  return (
    <div className="space-y-8">
      <RelevantSkillsCard relevantSkills={relevantSkills} />

      <SummaryEditor
        currentSummary={profile.personalInfo.summary || ""}
        jobDescription={jobDescription}
        relevantSkills={relevantSkills}
        onSummaryChange={handleSummaryChange}
      />

      <SkillManagement
        profileSkills={profile.skills}
        relevantSkills={relevantSkills}
        missingSkills={missingSkills}
        skillsToAdd={skillsToAdd}
        skillsToRemove={skillsToRemove}
        onToggleSkillToAdd={toggleSkillSelection}
        onToggleSkillToRemove={toggleSkillRemoval}
      />

      <ResumeColorSelector 
        selectedTheme={selectedTheme} 
        onThemeChange={handleThemeChange}
      />

      <ExperienceEditor 
        experiences={tailoredExperiences}
        onBulletChange={handleBulletChange}
        onRemoveBullet={removeBullet}
        onAddBullet={addBullet}
        generateBulletSuggestions={generateBulletSuggestions}
        jobDescription={jobDescription}
        relevantSkills={relevantSkills}
      />

      <ResumePreview 
        profile={{
          ...profile,
          personalInfo: {
            ...profile.personalInfo,
            summary: updatedSummary
          }
        }}
        experiences={tailoredExperiences}
        skillsToAdd={skillsToAdd}
        skillsToRemove={skillsToRemove}
        relevantSkills={relevantSkills}
        colorTheme={selectedTheme}
      />

      <Button
        onClick={saveTailoredResume}
        className="w-full bg-navy-700 hover:bg-navy-800"
      >
        Save Tailored Resume
      </Button>
    </div>
  );
};

export default TailorResume;

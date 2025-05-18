import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Experience } from "@/components/ExperienceForm";
import ExperienceBulletPoint from "./ExperienceBulletPoint";
import { PlusCircle, Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface ExperienceEditorProps {
  experiences: Experience[];
  onBulletChange: (expIndex: number, bulletIndex: number, value: string) => void;
  onRemoveBullet: (expIndex: number, bulletIndex: number) => void;
  onAddBullet: (expIndex: number) => void;
  generateBulletSuggestions: (expIndex: number, bulletIndex: number) => string[];
  jobDescription?: string;
  relevantSkills: string[];
}

const ExperienceEditor = ({
  experiences,
  onBulletChange,
  onRemoveBullet,
  onAddBullet,
  generateBulletSuggestions,
  jobDescription = "",
  relevantSkills = [],
}: ExperienceEditorProps) => {
  const { toast } = useToast();
  const [expandedSuggestions, setExpandedSuggestions] = useState<number | null>(null);

  // Extract job responsibilities and requirements from the job description
  const extractJobResponsibilities = (jobDesc: string): string[] => {
    if (!jobDesc) return [];
    
    const responsibilities: string[] = [];
    
    // Look for common headers in job descriptions
    const sections = [
      "responsibilities", "duties", "what you'll do", "what you will do",
      "day to day", "day-to-day", "role description", "the role", "your role",
      "job duties", "key responsibilities", "main responsibilities"
    ];
    
    // Convert to lowercase for easier matching
    const lowerDesc = jobDesc.toLowerCase();
    
    // Find sentences that might contain responsibilities
    const sentences = jobDesc.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Look for sections with responsibilities
    let inResponsibilitiesSection = false;
    
    sentences.forEach(sentence => {
      const lowerSentence = sentence.toLowerCase().trim();
      
      // Check if this sentence starts a responsibilities section
      const isHeader = sections.some(section => lowerSentence.includes(section));
      
      if (isHeader) {
        inResponsibilitiesSection = true;
        return;
      }
      
      // Check if this sentence starts a new section (no longer responsibilities)
      if (inResponsibilitiesSection && 
          (lowerSentence.includes("requirements") || 
           lowerSentence.includes("qualifications") ||
           lowerSentence.includes("what you'll need") ||
           lowerSentence.includes("benefits") ||
           lowerSentence.includes("about us"))) {
        inResponsibilitiesSection = false;
        return;
      }
      
      // If we're in a responsibilities section, or the sentence contains action verbs
      // common in responsibilities, add it
      const hasActionVerb = ["develop", "create", "manage", "lead", "design", "implement", 
                           "build", "maintain", "coordinate", "analyze", "support", "ensure",
                           "collaborate", "communicate", "organize", "plan", "research"].some(verb => 
                            lowerSentence.includes(verb));
      
      if ((inResponsibilitiesSection || hasActionVerb) && 
          sentence.length > 20 && 
          !responsibilities.includes(sentence.trim())) {
        responsibilities.push(sentence.trim());
      }
    });
    
    // If we couldn't find explicit responsibilities, look for bullet points
    if (responsibilities.length === 0) {
      const bulletPoints = jobDesc.split('\n')
        .filter(line => line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*'))
        .map(line => line.trim().replace(/^[-•*]/, '').trim());
      
      responsibilities.push(...bulletPoints);
    }
    
    // Look for required skills and tools
    const requiredSkillsSection = false;
    const tools: string[] = [];
    
    // Common tools and technologies
    const techTools = ["figma", "sketch", "adobe", "photoshop", "illustrator", 
                      "react", "vue", "angular", "javascript", "typescript", 
                      "html", "css", "java", "python", "node", "aws", "azure",
                      "docker", "kubernetes", "jenkins", "git", "jira", "confluence",
                      "sql", "nosql", "mongodb", "mysql", "postgresql", "agile", "scrum"];
    
    // Find mentioned tools
    techTools.forEach(tool => {
      if (lowerDesc.includes(tool) && !tools.includes(tool)) {
        tools.push(tool);
      }
    });
    
    // Add tools as potential responsibilities (using them)
    tools.forEach(tool => {
      responsibilities.push(`Experience with ${tool}`);
    });
    
    return responsibilities;
  };

  // Generate 3 new bullet point suggestions for an experience
  const generateNewBulletSuggestions = (expIndex: number): string[] => {
    const experience = experiences[expIndex];
    
    // Get job responsibilities from the job description
    const jobResponsibilities = extractJobResponsibilities(jobDescription);
    
    // Match experience with relevant responsibilities
    const roleKeywords = experience.title.toLowerCase();
    const relevantResponsibilities = jobResponsibilities.filter(resp => {
      const respLower = resp.toLowerCase();
      // Check if responsibility matches experience title or description
      return roleKeywords.split(" ").some(word => 
        word.length > 3 && respLower.includes(word)
      ) || (experience.description && experience.description.toLowerCase().split(" ").some(word => 
        word.length > 3 && respLower.includes(word)
      ));
    });
    
    const suggestions: string[] = [];
    
    // First, directly use relevant responsibilities from job description
    if (relevantResponsibilities.length > 0) {
      // Take up to 2 responsibilities that are most relevant
      relevantResponsibilities.slice(0, 2).forEach(resp => {
        // Convert to bullet point format with action verb
        const cleanedResp = resp.trim().replace(/^I |^you will |^you'll /i, '');
        
        // Add appropriate action verb if needed
        let bulletPoint = cleanedResp;
        
        if (!bulletPoint.match(/^[A-Z][a-z]+ed|^[A-Z][a-z]+d|^[A-Z][a-z]+t/)) {
          // If doesn't start with past tense verb, add one
          const actionVerbs = ["Developed", "Implemented", "Created", "Managed", "Led", 
                              "Designed", "Built", "Maintained", "Coordinated", "Analyzed"];
          bulletPoint = `${actionVerbs[Math.floor(Math.random() * actionVerbs.length)]} ${bulletPoint}`;
        }
        
        // Add measurable outcome if not present
        if (!bulletPoint.includes("resulting in") && !bulletPoint.includes("led to")) {
          bulletPoint += `, resulting in ${getRandomBusinessOutcome()}`;
        }
        
        suggestions.push(bulletPoint);
      });
    }
    
    // Generate role-specific suggestions based on the experience type and job description
    const isLeadershipRole = roleKeywords.includes("manager") || roleKeywords.includes("lead") || 
                           roleKeywords.includes("director") || roleKeywords.includes("supervisor");
    
    const isTechnicalRole = roleKeywords.includes("engineer") || roleKeywords.includes("developer") || 
                          roleKeywords.includes("architect") || roleKeywords.includes("programmer");
    
    const isDesignRole = roleKeywords.includes("designer") || roleKeywords.includes("ux") || 
                       roleKeywords.includes("ui") || roleKeywords.includes("creative");
    
    // Extract key requirements from job description
    const requirements = extractRequirementsFromJobDescription(jobDescription);
    
    // Add role-specific suggestions
    if (isLeadershipRole) {
      const leadershipRequirements = requirements.filter(req => 
        req.includes("lead") || req.includes("manage") || req.includes("team") || 
        req.includes("strategy") || req.includes("direct")
      );
      
      if (leadershipRequirements.length > 0) {
        suggestions.push(
          `Led initiatives to ${leadershipRequirements[0].toLowerCase()}, resulting in ${getRandomBusinessMetric()}`
        );
      } else {
        suggestions.push(
          `Led cross-functional team to deliver ${getContextRelevantDeliverable(experience, jobDescription)} resulting in ${getRandomBusinessOutcome()}`
        );
      }
    }
    
    if (isTechnicalRole) {
      // Find technical requirements in the job description
      const technicalRequirements = requirements.filter(req => 
        req.includes("develop") || req.includes("code") || req.includes("build") || 
        req.includes("implement") || req.includes("architecture") || req.includes("design") ||
        req.includes("program")
      );
      
      // Find technical skills mentioned in the job that match your relevant skills
      const technicalSkills = relevantSkills.filter(skill => 
        !["leadership", "communication", "teamwork", "management"].includes(skill.toLowerCase()) &&
        jobDescription.toLowerCase().includes(skill.toLowerCase())
      );
      
      if (technicalRequirements.length > 0 && technicalSkills.length > 0) {
        suggestions.push(
          `Implemented ${technicalSkills[0]} solutions for ${technicalRequirements[0].toLowerCase()}, resulting in ${getRandomTechnicalOutcome()}`
        );
      } else if (technicalSkills.length > 0) {
        suggestions.push(
          `Architected and developed ${getContextRelevantDeliverable(experience, jobDescription)} using ${technicalSkills[0]} to ${getRandomTechnicalBenefit()}`
        );
      } else if (technicalRequirements.length > 0) {
        suggestions.push(
          `Developed solutions to ${technicalRequirements[0].toLowerCase()}, improving system performance by ${getRandomPercentage()}%`
        );
      }
    }
    
    if (isDesignRole) {
      // Find design requirements in the job description
      const designRequirements = requirements.filter(req => 
        req.includes("design") || req.includes("user") || req.includes("interface") || 
        req.includes("ux") || req.includes("ui") || req.includes("visual") ||
        req.includes("wireframe") || req.includes("prototype") || req.includes("figma") ||
        req.includes("sketch")
      );
      
      if (designRequirements.length > 0) {
        suggestions.push(
          `Created ${designRequirements[0].toLowerCase()}, resulting in ${getRandomDesignOutcome()}`
        );
      } else {
        suggestions.push(
          `Designed user-centered interfaces for ${getContextRelevantDeliverable(experience, jobDescription)}, leading to ${getRandomDesignOutcome()}`
        );
      }
    }
    
    // Add general suggestions based on required skills
    const jobKeywords = extractKeywordsFromJobDescription(jobDescription);
    const missingTools = jobKeywords.filter(keyword => 
      !relevantSkills.some(skill => skill.toLowerCase().includes(keyword))
    );
    
    if (missingTools.length > 0) {
      suggestions.push(
        `Utilized ${missingTools[0]} to ${getRandomActionVerb()} ${getRelevantProject(experience, jobKeywords)}, resulting in ${getRandomBusinessMetric()}`
      );
    }
    
    // Ensure we have enough suggestions
    while (suggestions.length < 3) {
      suggestions.push(
        `${getRandomActionVerb(true)} ${getContextRelevantDeliverable(experience, jobDescription)} that ${getRandomBusinessOutcome()}`,
        `Successfully ${getRandomActionVerb()} ${getRelevantProject(experience, jobKeywords)}, resulting in ${getRandomBusinessMetric()}`
      );
    }
    
    // Return 3 unique suggestions
    return [...new Set(suggestions)].slice(0, 3);
  };

  // Extract requirements from job description
  const extractRequirementsFromJobDescription = (jobDesc: string): string[] => {
    if (!jobDesc) return [];
    
    const requirements: string[] = [];
    
    // Look for common headers in job descriptions
    const sections = [
      "requirements", "qualifications", "what you'll need", "what you need",
      "skills", "experience", "you have", "you should have", "you must have"
    ];
    
    // Convert to lowercase for easier matching
    const lowerDesc = jobDesc.toLowerCase();
    
    // Find sentences that might contain requirements
    const sentences = jobDesc.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Look for sections with requirements
    let inRequirementsSection = false;
    
    sentences.forEach(sentence => {
      const lowerSentence = sentence.toLowerCase().trim();
      
      // Check if this sentence starts a requirements section
      const isHeader = sections.some(section => lowerSentence.includes(section));
      
      if (isHeader) {
        inRequirementsSection = true;
        return;
      }
      
      // Check if this sentence starts a new section (no longer requirements)
      if (inRequirementsSection && 
          (lowerSentence.includes("responsibilities") || 
           lowerSentence.includes("what you'll do") ||
           lowerSentence.includes("benefits") ||
           lowerSentence.includes("about us"))) {
        inRequirementsSection = false;
        return;
      }
      
      // If we're in a requirements section, or the sentence contains requirement indicators
      const isRequirement = ["experience", "knowledge", "ability", "proficient", "familiar", 
                            "degree", "years", "background", "skill"].some(indicator => 
                              lowerSentence.includes(indicator));
      
      if ((inRequirementsSection || isRequirement) && 
          sentence.length > 15 && 
          !requirements.includes(sentence.trim())) {
        requirements.push(sentence.trim());
      }
    });
    
    // If we couldn't find explicit requirements, look for bullet points
    if (requirements.length === 0) {
      const bulletPoints = jobDesc.split('\n')
        .filter(line => line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*'))
        .map(line => line.trim().replace(/^[-•*]/, '').trim());
      
      requirements.push(...bulletPoints);
    }
    
    return requirements;
  };

  // Helper functions
  const extractKeywordsFromJobDescription = (description: string): string[] => {
    if (!description) return [];
    
    const commonJobTerms = [
      "leadership", "management", "development", "strategy", "analysis",
      "planning", "execution", "communication", "collaboration", "project",
      "innovation", "improvement", "efficiency", "skills", "experience",
      "implementation", "solution", "design", "customer", "client", 
      "stakeholder", "team", "budget", "revenue", "growth", "cost reduction",
      // Add specific tools and technologies
      "figma", "sketch", "adobe", "photoshop", "illustrator", 
      "react", "vue", "angular", "javascript", "typescript", 
      "html", "css", "java", "python", "node", "aws", "azure",
      "docker", "kubernetes", "jenkins", "git", "jira", "confluence",
      "sql", "nosql", "mongodb", "mysql", "postgresql", "agile", "scrum"
    ];
    
    return commonJobTerms.filter(term => 
      description.toLowerCase().includes(term.toLowerCase())
    );
  };
  
  const getContextRelevantDeliverable = (experience: Experience, jobDesc: string): string => {
    // Try to extract from job description first
    const jobResponsibilities = extractJobResponsibilities(jobDesc);
    const relevantDeliverables = jobResponsibilities.filter(resp => 
      resp.includes("develop") || resp.includes("create") || resp.includes("build") ||
      resp.includes("implement") || resp.includes("design")
    ).map(resp => {
      // Extract what comes after "develop", "create", etc.
      const matches = resp.match(/(?:develop|create|build|implement|design)\s+([^,\.]+)/i);
      return matches ? matches[1].trim() : null;
    }).filter(Boolean);
    
    if (relevantDeliverables.length > 0) {
      return relevantDeliverables[0];
    }
    
    // Fall back to role-based deliverables
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

  const getContextRelevantSystem = (experience: Experience): string => {
    const roleKeywords = experience.title.toLowerCase();
    
    if (roleKeywords.includes("back") || roleKeywords.includes("server")) {
      return ["API response times", "database performance", "server infrastructure", 
             "authentication system", "data processing pipeline"][Math.floor(Math.random() * 5)];
    }
    
    if (roleKeywords.includes("front") || roleKeywords.includes("ui")) {
      return ["client-side rendering", "user interface components", "frontend architecture", 
             "application state management", "UI performance"][Math.floor(Math.random() * 5)];
    }
    
    return ["system architecture", "application performance", "code base", 
           "technical infrastructure", "deployment process"][Math.floor(Math.random() * 5)];
  };
  
  const getRelevantProject = (experience: Experience, jobKeywords: string[]): string => {
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
  
  const getRandomTeamSize = (): string => {
    const sizes = ["3-5", "5-7", "8-10", "10+", "cross-functional"];
    return sizes[Math.floor(Math.random() * sizes.length)];
  };
  
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
  
  const getRandomTechnicalMetric = (): string => {
    return ["memory usage", "load time", "API response time", 
            "database query time", "build time", "error rate"][Math.floor(Math.random() * 6)];
  };
  
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
  
  const getRandomBusinessProcess = (): string => {
    return ["workflow", "approval process", "onboarding", 
            "deployment", "reporting", "customer service"][Math.floor(Math.random() * 6)];
  };
  
  const getRandomBusinessOutcome = (): string => {
    const outcomes = [
      "exceeded quarterly targets by 15%",
      "received recognition from senior leadership",
      "set new performance benchmarks for the department",
      "established best practices adopted company-wide",
      "significantly improved stakeholder satisfaction"
    ];
    
    return outcomes[Math.floor(Math.random() * outcomes.length)];
  };
  
  const getRandomTeamOutcome = (): string => {
    const outcomes = [
      "improved team performance by 25%",
      "reduced turnover by 30%",
      "increased employee satisfaction scores by 20%",
      "developed two team members for promotion",
      "created a high-performing, collaborative culture"
    ];
    
    return outcomes[Math.floor(Math.random() * outcomes.length)];
  };
  
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
  
  const getRandomPercentage = (): number => {
    return Math.floor(Math.random() * 30) + 15; // Random number between 15 and 45
  };
  
  const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const handleAddSuggestion = (expIndex: number, suggestion: string) => {
    // First add a new bullet point
    onAddBullet(expIndex);
    
    // Then update the last bullet with the suggestion
    setTimeout(() => {
      const newBulletIndex = experiences[expIndex].bullets.length;
      onBulletChange(expIndex, newBulletIndex, suggestion);
      
      toast({
        title: "Bullet point added",
        description: "New bullet point has been added to your experience.",
      });
    }, 0);
  };

  const toggleSuggestions = (expIndex: number) => {
    setExpandedSuggestions(expandedSuggestions === expIndex ? null : expIndex);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tailor Experience Bullet Points</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {experiences.map((exp, expIndex) => (
            <div key={exp.id} className="p-4 border rounded-md space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{exp.title}</h3>
                <p className="text-navy-600">{exp.company}</p>
              </div>
              
              <div className="space-y-2">
                <Label>Bullet Points</Label>
                {exp.bullets.map((bullet, bulletIndex) => (
                  <ExperienceBulletPoint
                    key={bulletIndex}
                    bullet={bullet}
                    bulletIndex={bulletIndex}
                    expIndex={expIndex}
                    onBulletChange={onBulletChange}
                    onRemoveBullet={onRemoveBullet}
                    generateSuggestions={(expIndex, bulletIndex) => 
                      generateBulletSuggestions(expIndex, bulletIndex)
                    }
                    jobDescription={jobDescription}
                  />
                ))}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddBullet(expIndex)}
                  >
                    Add Bullet Point
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSuggestions(expIndex)}
                    className="flex items-center gap-1"
                  >
                    <PlusCircle className="h-4 w-4" />
                    {expandedSuggestions === expIndex ? 'Hide Suggestions' : 'Suggest Bullets'}
                  </Button>
                </div>

                {/* Suggestions for new bullet points - specifically based on job description */}
                {expandedSuggestions === expIndex && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-md border border-slate-200">
                    <h4 className="text-sm font-medium mb-2">Suggested bullet points based on the job description:</h4>
                    <div className="space-y-2">
                      {generateNewBulletSuggestions(expIndex).map((suggestion, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs h-auto py-1 px-2 flex items-center gap-1"
                            onClick={() => handleAddSuggestion(expIndex, suggestion)}
                          >
                            <Plus className="h-3 w-3" />
                            Add
                          </Button>
                          <p className="text-sm">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceEditor;

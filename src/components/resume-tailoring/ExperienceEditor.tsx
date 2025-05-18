
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Experience } from "@/components/ExperienceForm";
import ExperienceBulletPoint from "./ExperienceBulletPoint";
import { PlusCircle } from "lucide-react";
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

  // Generate 3 new bullet point suggestions for an experience
  const generateNewBulletSuggestions = (expIndex: number): string[] => {
    const experience = experiences[expIndex];
    
    // Extract keywords from job description that are relevant to this specific experience
    const jobKeywords = extractKeywordsFromJobDescription(jobDescription);
    
    // Generate suggestions based on the experience type and job requirements
    const roleKeywords = experience.title.toLowerCase();
    const isLeadershipRole = roleKeywords.includes("manager") || roleKeywords.includes("lead") || 
                           roleKeywords.includes("director") || roleKeywords.includes("supervisor");
    
    const isTechnicalRole = roleKeywords.includes("engineer") || roleKeywords.includes("developer") || 
                          roleKeywords.includes("architect") || roleKeywords.includes("programmer");
    
    const isDesignRole = roleKeywords.includes("designer") || roleKeywords.includes("ux") || 
                       roleKeywords.includes("ui") || roleKeywords.includes("creative");
    
    const isMarketingRole = roleKeywords.includes("market") || roleKeywords.includes("brand") || 
                          roleKeywords.includes("content") || roleKeywords.includes("social media");

    // Find relevant terms that match both the experience and job
    const relevantTermsForExperience = jobKeywords.filter(term => 
      experience.title.toLowerCase().includes(term) || 
      experience.description?.toLowerCase().includes(term) ||
      term === experience.company.toLowerCase()
    );
    
    // Start with empty suggestions array
    const suggestions: string[] = [];
    
    // Add role-specific suggestions
    if (isLeadershipRole) {
      suggestions.push(
        `Led strategic initiative to improve ${getRandomBusinessMetric()} across the organization`,
        `Mentored ${getRandomTeamSize()} team members, resulting in ${getRandomTeamOutcome()}`,
        `Established performance metrics and KPIs that improved ${getRandomBusinessProcess()} efficiency by ${getRandomPercentage()}%`
      );
    }
    
    if (isTechnicalRole) {
      // Find technical skills in the relevant skills
      const technicalSkills = relevantSkills.filter(skill => 
        !["leadership", "communication", "teamwork", "management"].includes(skill.toLowerCase())
      );
      
      if (technicalSkills.length > 0) {
        const randomTechSkill1 = technicalSkills[Math.floor(Math.random() * technicalSkills.length)];
        const randomTechSkill2 = technicalSkills.filter(s => s !== randomTechSkill1)[Math.floor(Math.random() * (technicalSkills.length - 1))] || randomTechSkill1;
        
        suggestions.push(
          `Architected and implemented ${randomTechSkill1} solutions that ${getRandomTechnicalOutcome()}`,
          `Optimized ${getContextRelevantSystem(experience)} using ${randomTechSkill2}, reducing ${getRandomTechnicalMetric()} by ${getRandomPercentage()}%`,
          `Collaborated with cross-functional teams to deliver ${getRelevantProject(experience, jobKeywords)} ahead of schedule`
        );
      } else {
        suggestions.push(
          `Developed scalable solutions for ${getRelevantProject(experience, jobKeywords)} that improved system performance by ${getRandomPercentage()}%`,
          `Implemented automated testing framework that reduced bug rate by ${getRandomPercentage()}%`,
          `Optimized database queries resulting in ${getRandomPercentage()}% faster load times`
        );
      }
    }
    
    if (isDesignRole) {
      suggestions.push(
        `Designed user interface that improved conversion rates by ${getRandomPercentage()}%`,
        `Created user-centered design system that standardized the product experience across ${getRandomNumber(3, 10)} platforms`,
        `Conducted ${getRandomNumber(5, 20)} user research sessions to inform design decisions for ${getRelevantProject(experience, jobKeywords)}`
      );
    }
    
    if (isMarketingRole) {
      suggestions.push(
        `Developed marketing campaign that increased customer acquisition by ${getRandomPercentage()}%`,
        `Managed social media strategy resulting in ${getRandomNumber(20, 200)}% growth in audience engagement`,
        `Created content strategy that generated ${getRandomNumber(30, 300)}% more qualified leads`
      );
    }
    
    // Add general suggestions based on the job description and relevant skills
    if (relevantTermsForExperience.length > 0) {
      const relevantTerm = relevantTermsForExperience[Math.floor(Math.random() * relevantTermsForExperience.length)];
      suggestions.push(
        `Leveraged expertise in ${relevantTerm} to implement solutions that ${getRandomBusinessOutcome()}`,
        `Applied knowledge of ${relevantTerm} to optimize ${getRandomBusinessProcess()}, resulting in ${getRandomBusinessMetric()}`
      );
    }
    
    // Ensure we have enough suggestions, add generics if needed
    while (suggestions.length < 3) {
      suggestions.push(
        `Spearheaded initiative that resulted in ${getRandomBusinessMetric()}`,
        `Collaborated with stakeholders to deliver ${getContextRelevantDeliverable(experience)} that ${getRandomBusinessOutcome()}`
      );
    }
    
    // Return 3 unique suggestions (or fewer if there are duplicates)
    return [...new Set(suggestions)].slice(0, 3);
  };

  // Helper functions
  const extractKeywordsFromJobDescription = (description: string): string[] => {
    if (!description) return [];
    
    const commonJobTerms = [
      "leadership", "management", "development", "strategy", "analysis",
      "planning", "execution", "communication", "collaboration", "project",
      "innovation", "improvement", "efficiency", "skills", "experience",
      "implementation", "solution", "design", "customer", "client", 
      "stakeholder", "team", "budget", "revenue", "growth", "cost reduction"
    ];
    
    return commonJobTerms.filter(term => 
      description.toLowerCase().includes(term.toLowerCase())
    );
  };
  
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

                {/* Suggestions for new bullet points */}
                {expandedSuggestions === expIndex && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-md border border-slate-200">
                    <h4 className="text-sm font-medium mb-2">Suggested bullet points based on the job description:</h4>
                    <div className="space-y-2">
                      {generateNewBulletSuggestions(expIndex).map((suggestion, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-xs h-auto py-1 px-2"
                            onClick={() => handleAddSuggestion(expIndex, suggestion)}
                          >
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


import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Experience } from "@/components/ExperienceForm";
import ExperienceBulletPoint from "./ExperienceBulletPoint";
import { PlusCircle, Plus, RefreshCw } from "lucide-react"; // Added RefreshCw import
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface ExperienceEditorProps {
  experiences: Experience[];
  onBulletChange: (expIndex: number, bulletIndex: number, value: string) => void;
  onRemoveBullet: (expIndex: number, bulletIndex: number) => void;
  onAddBullet: (expIndex: number) => void;
  generateBulletSuggestions: (expIndex: number, bulletIndex: number) => Promise<string[]>;
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
  const [loadingSuggestions, setLoadingSuggestions] = useState<number | null>(null);
  const [newSuggestions, setNewSuggestions] = useState<{ [key: number]: string[] }>({});

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
    
    return responsibilities;
  };

  // Extract keywords from job description
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

  // Generate 3 new bullet point suggestions for an experience using AI
  const generateNewBulletSuggestions = async (expIndex: number): Promise<string[]> => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job description required",
        description: "Please enter a job description to generate AI suggestions.",
        variant: "destructive",
      });
      return [];
    }

    try {
      setLoadingSuggestions(expIndex);
      
      console.log('Generating new bullet suggestions for experience:', experiences[expIndex].title);
      
      // Create a placeholder bullet if none exists
      const currentExperience = experiences[expIndex];
      const placeholderBullet = currentExperience.bullets.length > 0 ? 
        currentExperience.bullets[0] : 
        `${getRandomActionVerb(true)} projects at ${currentExperience.company}`;
      
      // Use the generateBulletSuggestions function with the placeholder bullet
      const aiSuggestions = await generateBulletSuggestions(expIndex, 0);
      
      console.log('Received AI suggestions:', aiSuggestions);
      
      if (aiSuggestions.length === 0) {
        toast({
          title: "No suggestions available",
          description: "Unable to generate AI suggestions for this experience.",
          variant: "default",
        });
      } else {
        // Store suggestions in state with experience index as key
        setNewSuggestions(prev => ({
          ...prev,
          [expIndex]: aiSuggestions
        }));
      }
      
      return aiSuggestions;
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast({
        title: "Error generating suggestions",
        description: "There was an error generating AI suggestions. Please try again.",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoadingSuggestions(null);
    }
  };

  // Helper function to generate random metric
  const getRandomMetric = (): string => {
    const metrics = [
      ", resulting in a 20% increase in efficiency",
      ", reducing costs by 15%",
      ", improving team productivity by 25%",
      ", accelerating delivery by 30%",
      ", achieving 95% customer satisfaction",
      " with 40% faster performance",
      ", saving $50K annually",
      " while reducing errors by 35%"
    ];
    
    return metrics[Math.floor(Math.random() * metrics.length)];
  };

  // Helper function to determine role type
  const determineRoleType = (title: string): 'technical' | 'leadership' | 'design' | 'general' => {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('engineer') || lowerTitle.includes('developer') || 
        lowerTitle.includes('architect') || lowerTitle.includes('programmer') ||
        lowerTitle.includes('analyst')) {
      return 'technical';
    }
    
    if (lowerTitle.includes('manager') || lowerTitle.includes('lead') || 
        lowerTitle.includes('director') || lowerTitle.includes('head') ||
        lowerTitle.includes('chief') || lowerTitle.includes('supervisor')) {
      return 'leadership';
    }
    
    if (lowerTitle.includes('design') || lowerTitle.includes('ux') || 
        lowerTitle.includes('ui') || lowerTitle.includes('creative') ||
        lowerTitle.includes('graphic')) {
      return 'design';
    }
    
    return 'general';
  };

  // Generate appropriate deliverable based on role type
  const getDeliverable = (roleType: 'technical' | 'leadership' | 'design' | 'general'): string => {
    if (roleType === 'technical') {
      return getTechnicalDeliverable();
    } else if (roleType === 'leadership') {
      return getLeadershipDeliverable();
    } else if (roleType === 'design') {
      return getDesignDeliverable();
    } else {
      const deliverables = [
        "key business initiative", "strategic project", "cross-functional program",
        "critical workflow improvement", "productivity enhancement solution"
      ];
      return deliverables[Math.floor(Math.random() * deliverables.length)];
    }
  };

  // Get technical deliverables
  const getTechnicalDeliverable = (role: string = ''): string => {
    const lowerRole = role.toLowerCase();
    
    if (lowerRole.includes('front')) {
      return ["responsive UI components", "interactive dashboard", "client-side application",
             "user authentication system", "data visualization module"][Math.floor(Math.random() * 5)];
    } else if (lowerRole.includes('back')) {
      return ["RESTful API", "database optimization solution", "authentication service",
             "caching mechanism", "microservices architecture"][Math.floor(Math.random() * 5)];
    } else if (lowerRole.includes('full')) {
      return ["end-to-end web application", "full-stack solution", "integrated system",
             "enterprise application", "cloud-based platform"][Math.floor(Math.random() * 5)];
    }
    
    const deliverables = [
      "software solution", "application feature", "automated system",
      "API integration", "data processing pipeline", "cloud infrastructure",
      "technical workflow", "CI/CD pipeline"
    ];
    return deliverables[Math.floor(Math.random() * deliverables.length)];
  };

  // Get leadership deliverables
  const getLeadershipDeliverable = (): string => {
    const deliverables = [
      "strategic initiative", "team restructuring plan", "process improvement",
      "cross-departmental project", "resource allocation strategy", "business unit transformation",
      "organizational efficiency program", "talent development framework"
    ];
    return deliverables[Math.floor(Math.random() * deliverables.length)];
  };

  // Get design deliverables
  const getDesignDeliverable = (): string => {
    const deliverables = [
      "user interface redesign", "user experience workflow", "design system",
      "brand identity package", "interactive prototype", "customer journey map",
      "responsive web design", "mobile application interface"
    ];
    return deliverables[Math.floor(Math.random() * deliverables.length)];
  };

  // Generate an achievement based on experience and skills
  const generateAchievement = (experience: Experience, relevantSkills: string[]): string => {
    const roleType = determineRoleType(experience.title);
    
    if (relevantSkills.length === 0) {
      return "";
    }
    
    const skill = relevantSkills[Math.floor(Math.random() * relevantSkills.length)];
    
    if (roleType === 'technical') {
      return `Leveraged ${skill} to implement ${getTechnicalDeliverable()} that ${getRandomTechnicalOutcome()}`;
    } else if (roleType === 'leadership') {
      return `Spearheaded ${skill}-focused initiatives that ${getRandomBusinessOutcome()}`;
    } else if (roleType === 'design') {
      return `Created ${skill}-based ${getDesignDeliverable()} that ${getRandomDesignOutcome()}`;
    } else {
      return `Utilized expertise in ${skill} to deliver solutions that ${getRandomBusinessOutcome()}`;
    }
  };

  // Random technical outcomes
  const getRandomTechnicalOutcome = (): string => {
    const outcomes = [
      "reduced processing time by 40%",
      "improved application performance by 25%",
      "decreased load time by 35%",
      "enabled real-time data processing",
      "enhanced security compliance by 30%",
      "scaled to support 2x more concurrent users"
    ];
    
    return outcomes[Math.floor(Math.random() * outcomes.length)];
  };

  // Random business outcomes
  const getRandomBusinessOutcome = (): string => {
    const outcomes = [
      "exceeded quarterly targets by 15%",
      "improved operational efficiency by 20%",
      "reduced time-to-market by 30%",
      "increased revenue by 25%",
      "achieved 40% cost reduction",
      "generated positive ROI within 6 months"
    ];
    
    return outcomes[Math.floor(Math.random() * outcomes.length)];
  };

  // Random design outcomes
  const getRandomDesignOutcome = (): string => {
    const outcomes = [
      "increased user engagement by 35%",
      "reduced bounce rate by 25%",
      "improved conversion rate by 20%",
      "enhanced user satisfaction scores by 40%",
      "decreased user errors by 30%",
      "received industry recognition for innovation"
    ];
    
    return outcomes[Math.floor(Math.random() * outcomes.length)];
  };

  const handleAddSuggestion = (expIndex: number, suggestion: string) => {
    // First add a new bullet point
    onAddBullet(expIndex);
    
    // Then update the last bullet with the suggestion
    setTimeout(() => {
      const newBulletIndex = experiences[expIndex].bullets.length;
      onBulletChange(expIndex, newBulletIndex - 1, suggestion);
      
      toast({
        title: "Bullet point added",
        description: "New AI-generated bullet point has been added to your experience.",
      });
    }, 0);
  };

  const toggleSuggestions = async (expIndex: number) => {
    if (expandedSuggestions === expIndex) {
      setExpandedSuggestions(null);
    } else {
      setExpandedSuggestions(expIndex);
      
      // Generate suggestions when expanding
      if (!loadingSuggestions) {
        await generateNewBulletSuggestions(expIndex);
      }
    }
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
                    generateSuggestions={generateBulletSuggestions}
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
                    disabled={loadingSuggestions === expIndex}
                  >
                    <PlusCircle className="h-4 w-4" />
                    {loadingSuggestions === expIndex ? 'Generating AI Suggestions...' : 
                     expandedSuggestions === expIndex ? 'Hide AI Suggestions' : 'Generate AI Suggestions'}
                  </Button>
                </div>

                {/* AI-powered suggestions for new bullet points */}
                {expandedSuggestions === expIndex && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-blue-800">
                        AI-Generated bullet points based on job description:
                      </h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => generateNewBulletSuggestions(expIndex)}
                        disabled={loadingSuggestions === expIndex}
                        className="h-7 text-xs flex items-center gap-1 text-blue-600"
                      >
                        <RefreshCw className={`h-3 w-3 ${loadingSuggestions === expIndex ? 'animate-spin' : ''}`} />
                        {loadingSuggestions === expIndex ? "Generating..." : "Regenerate"}
                      </Button>
                    </div>
                    {loadingSuggestions === expIndex ? (
                      <div className="text-sm text-blue-600">Generating suggestions with AI...</div>
                    ) : (
                      <div className="space-y-2">
                        {newSuggestions[expIndex] && newSuggestions[expIndex].length > 0 ? (
                          newSuggestions[expIndex].map((suggestion, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-xs whitespace-nowrap"
                                onClick={() => handleAddSuggestion(expIndex, suggestion)}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add
                              </Button>
                              <p className="text-sm">{suggestion}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-blue-600">
                            AI suggestions will appear here after generation is complete.
                          </div>
                        )}
                      </div>
                    )}
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

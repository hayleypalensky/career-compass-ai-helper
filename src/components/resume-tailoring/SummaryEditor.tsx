
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SummaryEditorProps {
  currentSummary: string;
  jobDescription: string;
  relevantSkills: string[];
  onSummaryChange: (summary: string) => void;
}

const SummaryEditor = ({
  currentSummary,
  jobDescription,
  relevantSkills,
  onSummaryChange,
}: SummaryEditorProps) => {
  const [editedSummary, setEditedSummary] = useState(currentSummary);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Generate summary suggestions based on job description and skills
  const generateSummarySuggestions = () => {
    setIsGenerating(true);
    
    try {
      // Extract key requirements from job description and current summary
      const requirements = extractRequirementsFromJobDescription(jobDescription);
      
      // Extract key phrases from current summary to maintain personal tone and background
      const currentSummaryKeyPhrases = extractKeyPhrasesFromSummary(currentSummary);
      
      // Generate 3 different summary suggestions
      const newSuggestions = [
        generateTargetedSummary(requirements, relevantSkills, "concise", currentSummaryKeyPhrases),
        generateTargetedSummary(requirements, relevantSkills, "achievement", currentSummaryKeyPhrases),
        generateTargetedSummary(requirements, relevantSkills, "collaborative", currentSummaryKeyPhrases)
      ];
      
      setSuggestions(newSuggestions);
      
      toast({
        title: "Suggestions generated",
        description: "Choose one of the suggested summaries or continue editing your own.",
      });
    } catch (error) {
      toast({
        title: "Error generating suggestions",
        description: "There was an error generating summary suggestions.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Extract key phrases from current summary
  const extractKeyPhrasesFromSummary = (summary: string): string[] => {
    if (!summary) return [];
    
    const keyPhrases: string[] = [];
    
    // Look for years of experience
    const yearsPattern = /(\d+)[+]?\s+years?/i;
    const yearsMatch = summary.match(yearsPattern);
    if (yearsMatch) {
      keyPhrases.push(yearsMatch[0]);
    }
    
    // Look for industries/domains mentioned
    const industryWords = ["healthcare", "finance", "technology", "education", "manufacturing", 
                          "retail", "government", "startup", "enterprise"];
    
    industryWords.forEach(industry => {
      if (summary.toLowerCase().includes(industry)) {
        keyPhrases.push(industry);
      }
    });
    
    // Look for specific qualifications
    const qualificationPatterns = [
      /certified\s+\w+/i,
      /\w+\s+certified/i,
      /\w+\s+degree/i,
      /degree\s+in\s+\w+/i,
      /expert\s+in\s+[\w\s]+/i,
      /specialist\s+in\s+[\w\s]+/i
    ];
    
    qualificationPatterns.forEach(pattern => {
      const matches = summary.match(pattern);
      if (matches) {
        keyPhrases.push(matches[0]);
      }
    });
    
    // Look for personal qualities often mentioned in summaries
    const personalQualities = ["detail-oriented", "team player", "self-motivated", "passionate",
                              "innovative", "analytical", "creative", "results-driven", "strategic"];
    
    personalQualities.forEach(quality => {
      if (summary.toLowerCase().includes(quality.toLowerCase())) {
        keyPhrases.push(quality);
      }
    });
    
    // Look for potential role indicators to avoid default engineering roles
    const roleIndicators = ["manager", "coordinator", "director", "assistant", "specialist", 
                           "consultant", "analyst", "designer", "developer", "administrator", 
                           "associate", "representative", "agent", "advisor"];
    
    roleIndicators.forEach(role => {
      if (summary.toLowerCase().includes(role.toLowerCase())) {
        keyPhrases.push(role);
      }
    });
    
    return keyPhrases;
  };
  
  // Extract requirements and role details from job description
  const extractRequirementsFromJobDescription = (description: string): string[] => {
    if (!description) return [];
    
    const requirements: string[] = [];
    const sections = [
      "requirements", "qualifications", "what you'll need", "what you need",
      "skills", "experience", "responsibilities", "about the role"
    ];
    
    // Find sentences or phrases that contain meaningful requirements
    const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    sentences.forEach(sentence => {
      const lowerSentence = sentence.toLowerCase().trim();
      
      // Check if this sentence contains requirement indicators
      const isRequirement = ["experience", "knowledge", "ability", "proficient", "familiar", 
                            "degree", "years", "background", "skill", "responsible", 
                            "develop", "create", "manage", "lead"].some(indicator => 
                              lowerSentence.includes(indicator));
      
      if (isRequirement && sentence.length > 15) {
        requirements.push(sentence.trim());
      }
    });
    
    return requirements;
  };
  
  // Generate a targeted summary based on requirements, resume skills, and current summary phrases
  const generateTargetedSummary = (
    requirements: string[], 
    skills: string[], 
    style: "concise" | "achievement" | "collaborative",
    currentSummaryPhrases: string[]
  ): string => {
    // Find the most relevant skills that match job requirements
    const relevantSkillsForSummary = skills.filter(skill => 
      requirements.some(req => req.toLowerCase().includes(skill.toLowerCase()))
    );
    
    // Get years of experience from requirements or current summary
    const yearsPattern = /(\d+)[+]?\s+years?/i;
    const yearsMatches = requirements.map(req => {
      const match = req.match(yearsPattern);
      return match ? parseInt(match[1]) : null;
    }).filter(y => y !== null);
    
    // Check current summary for years of experience
    let yearsFromCurrentSummary = null;
    for (const phrase of currentSummaryPhrases) {
      const match = phrase.match(yearsPattern);
      if (match) {
        yearsFromCurrentSummary = parseInt(match[1]);
        break;
      }
    }
    
    const requestedYears = yearsMatches.length > 0 
      ? Math.max(...yearsMatches as number[]) 
      : (yearsFromCurrentSummary || 3); // Use years from current summary or default to 3
    
    // IMPROVED: Identify the role/position from job description and existing summary
    // This is the part where we need to be more careful to prevent defaulting to "engineer"
    const roleKeywords = [
      "engineer", "developer", "designer", "manager", "lead", "specialist", 
      "director", "coordinator", "analyst", "assistant", "consultant", 
      "administrator", "associate", "representative", "agent", "advisor"
    ];
    
    // First check if any role keyword is in the existing summary
    const summaryRoles = currentSummaryPhrases.filter(phrase => 
      roleKeywords.some(role => phrase.toLowerCase().includes(role))
    );
    
    // Then check job description for role keywords
    const jobRoles = requirements.filter(req => 
      roleKeywords.some(role => req.toLowerCase().includes(role))
    );
    
    // Then check job description title if available
    const jobTitleMatch = jobDescription.match(/job title:?\s*([^.,:;\n]+)/i) || 
                          jobDescription.match(/position:?\s*([^.,:;\n]+)/i) ||
                          jobDescription.match(/role:?\s*([^.,:;\n]+)/i);
    
    let roleTitle = "professional"; // Default to generic "professional"
    
    // Try to find role from existing summary first (most accurate)
    if (summaryRoles.length > 0) {
      for (const keyword of roleKeywords) {
        if (summaryRoles.some(role => role.toLowerCase().includes(keyword))) {
          roleTitle = keyword;
          break;
        }
      }
    } 
    // Then try job description requirements
    else if (jobRoles.length > 0) {
      for (const keyword of roleKeywords) {
        if (jobRoles.some(role => role.toLowerCase().includes(keyword))) {
          roleTitle = keyword;
          break;
        }
      }
    }
    // Then try job title if found
    else if (jobTitleMatch && jobTitleMatch[1]) {
      const jobTitle = jobTitleMatch[1].toLowerCase();
      for (const keyword of roleKeywords) {
        if (jobTitle.includes(keyword)) {
          roleTitle = keyword;
          break;
        }
      }
    }
    
    // Extract industry mentions from current summary phrases
    const industryMentions = currentSummaryPhrases.filter(phrase => 
      ["healthcare", "finance", "technology", "education", "manufacturing", 
       "retail", "government", "startup", "enterprise"].some(industry => 
         phrase.toLowerCase().includes(industry))
    );
    
    // Get industry context if available
    const industryContext = industryMentions.length > 0 
      ? ` in the ${industryMentions[0]}` 
      : "";
    
    // Get personal qualities from current summary
    const personalQualityMatches = currentSummaryPhrases.filter(phrase => 
      ["detail-oriented", "team player", "self-motivated", "passionate",
       "innovative", "analytical", "creative", "results-driven", "strategic"].some(quality => 
         phrase.toLowerCase().includes(quality.toLowerCase()))
    );
    
    // Format personal qualities for inclusion
    const personalQualityText = personalQualityMatches.length > 0 
      ? ` and ${personalQualityMatches[0]}` 
      : "";
    
    // Generate different types of summaries based on style
    switch (style) {
      case "concise":
        return `Results-driven ${roleTitle} with ${requestedYears}+ years of experience${industryContext} specializing in ${
          relevantSkillsForSummary.slice(0, 3).join(", ") || "relevant industry skills"
        }${relevantSkillsForSummary.length > 3 ? ", and other technologies" : ""
        }. Committed to delivering high-quality solutions that meet business objectives and exceed client expectations${personalQualityText}. Proven track record of ${
          getRandomAccomplishment(roleTitle)
        } and ${
          getRandomStrength(roleTitle)
        }.`;
        
      case "achievement":
        return `Accomplished ${roleTitle} with ${requestedYears}+ years of extensive experience${industryContext} in ${
          relevantSkillsForSummary.slice(0, 2).join(" and ") || "key industry domains"
        }. Successfully delivered ${
          getRandomDeliverable(roleTitle)
        } resulting in ${
          getRandomOutcome()
        }${personalQualityText}. Demonstrated expertise in ${
          relevantSkillsForSummary.slice(2, 4).join(", ") || "critical business areas"
        } with a strong focus on ${
          getRandomFocus()
        }. Passionate about ${
          getRandomPassion(roleTitle)
        }.`;
        
      case "collaborative":
        return `Collaborative ${roleTitle} who thrives in team environments, bringing ${requestedYears}+ years of hands-on experience${industryContext} with ${
          relevantSkillsForSummary.slice(0, 3).join(", ") || "industry-relevant capabilities"
        } to deliver impactful solutions. Excels at ${
          getRandomStrength(roleTitle)
        }${personalQualityText} while focusing on ${
          getRandomFocus()
        }. Committed to continuous learning and staying current with industry trends to drive ${
          getRandomOutcome()
        }.`;
        
      default:
        return `Experienced ${roleTitle} with a proven track record${industryContext} in ${
          relevantSkillsForSummary.slice(0, 3).join(", ") || "key professional areas"
        } and a passion for delivering high-quality solutions. Demonstrated ability to ${
          getRandomStrength(roleTitle)
        }${personalQualityText} and drive results through ${
          getRandomApproach()
        }.`;
    }
  };
  
  // IMPROVED: Helper functions to generate role-appropriate phrases
  const getRandomAccomplishment = (role: string): string => {
    // Define role-specific accomplishments
    const roleSpecificAccomplishments: Record<string, string[]> = {
      "engineer": [
        "successfully delivering complex technical projects on time and within budget",
        "optimizing systems that resulted in significant performance improvements",
        "developing innovative solutions to challenging technical problems",
        "implementing scalable architectures that support business growth"
      ],
      "manager": [
        "leading teams to exceed targets and objectives",
        "developing and implementing strategic initiatives that improved operational efficiency",
        "building high-performing teams that consistently delivered results",
        "successfully managing complex projects with multiple stakeholders"
      ],
      "analyst": [
        "delivering data-driven insights that informed key business decisions",
        "identifying trends and patterns that led to process improvements",
        "creating comprehensive reports that guided strategic planning",
        "developing analytical frameworks that enhanced decision-making"
      ],
      "designer": [
        "creating user-centered designs that enhanced user experience",
        "developing design systems that improved brand consistency",
        "crafting visual solutions that effectively communicated complex information",
        "leading design projects that received positive client feedback"
      ],
      "consultant": [
        "providing strategic recommendations that improved client outcomes",
        "identifying and resolving business challenges for diverse clients",
        "delivering transformational solutions across multiple industries",
        "developing frameworks that enhanced client capabilities"
      ]
    };
    
    // Default accomplishments for any role
    const genericAccomplishments = [
      "successfully delivering projects that met or exceeded expectations",
      "optimizing processes that resulted in significant improvements",
      "demonstrating adaptability across diverse challenges and environments",
      "consistently meeting objectives while maintaining high quality standards"
    ];
    
    // Check if we have specific accomplishments for this role
    for (const [roleKey, accomplishments] of Object.entries(roleSpecificAccomplishments)) {
      if (role.toLowerCase().includes(roleKey)) {
        return accomplishments[Math.floor(Math.random() * accomplishments.length)];
      }
    }
    
    // Fall back to generic accomplishments
    return genericAccomplishments[Math.floor(Math.random() * genericAccomplishments.length)];
  };
  
  // IMPROVED: Generate role-appropriate strengths
  const getRandomStrength = (role: string): string => {
    // Define role-specific strengths
    const roleSpecificStrengths: Record<string, string[]> = {
      "engineer": [
        "architecting scalable solutions",
        "optimizing code performance",
        "implementing efficient algorithms",
        "translating business requirements into technical specifications"
      ],
      "manager": [
        "building and mentoring high-performing teams",
        "managing complex projects with multiple stakeholders",
        "developing strategic roadmaps aligned with business goals",
        "fostering collaboration across departments"
      ],
      "analyst": [
        "extracting meaningful insights from complex data",
        "creating comprehensive reports and visualizations",
        "identifying trends and patterns to solve business problems",
        "translating data into actionable recommendations"
      ],
      "designer": [
        "creating user-centered experiences",
        "developing design systems that ensure consistency",
        "translating requirements into visual solutions",
        "balancing aesthetics with functionality"
      ],
      "consultant": [
        "diagnosing complex business challenges",
        "developing tailored solutions for diverse clients",
        "delivering recommendations that drive measurable results",
        "building strong client relationships"
      ],
      "coordinator": [
        "managing complex schedules and priorities",
        "ensuring smooth communication between stakeholders",
        "organizing resources efficiently",
        "anticipating needs and resolving issues proactively"
      ],
      "specialist": [
        "applying deep domain knowledge to solve complex problems",
        "staying current with industry developments",
        "developing specialized solutions",
        "serving as a subject matter expert"
      ]
    };
    
    // General strengths for any role
    const generalStrengths = [
      "problem-solving in fast-paced environments",
      "adapting quickly to changing priorities",
      "communicating complex concepts to diverse audiences",
      "balancing quality and efficiency in deliverables",
      "building collaborative relationships with stakeholders"
    ];
    
    // Check if we have specific strengths for this role
    for (const [roleKey, strengths] of Object.entries(roleSpecificStrengths)) {
      if (role.toLowerCase().includes(roleKey)) {
        return strengths[Math.floor(Math.random() * strengths.length)];
      }
    }
    
    // Fall back to general strengths
    return generalStrengths[Math.floor(Math.random() * generalStrengths.length)];
  };
  
  // IMPROVED: Generate role-appropriate deliverables
  const getRandomDeliverable = (role: string): string => {
    // Define role-specific deliverables
    const roleSpecificDeliverables: Record<string, string[]> = {
      "engineer": [
        "enterprise-level applications",
        "scalable cloud infrastructure",
        "performance optimization solutions",
        "integrated data pipelines"
      ],
      "designer": [
        "user-centered interfaces",
        "comprehensive design systems",
        "interactive prototypes",
        "brand identity packages"
      ],
      "manager": [
        "strategic business initiatives",
        "team restructuring programs",
        "process improvement frameworks",
        "cross-departmental collaboration projects"
      ],
      "analyst": [
        "comprehensive business reports",
        "data-driven recommendations",
        "analytical frameworks",
        "performance tracking systems"
      ],
      "consultant": [
        "strategic transformation initiatives",
        "client-specific solutions",
        "advisory frameworks",
        "implementation roadmaps"
      ],
      "specialist": [
        "specialized solutions",
        "expert recommendations",
        "domain-specific frameworks",
        "targeted improvement initiatives"
      ],
      "coordinator": [
        "streamlined operational processes",
        "cross-functional programs",
        "communication frameworks",
        "resource optimization plans"
      ]
    };
    
    // General deliverables for any role
    const generalDeliverables = [
      "strategic initiatives",
      "business process improvements",
      "cross-functional projects",
      "customer-focused solutions",
      "efficiency-enhancing programs"
    ];
    
    // Check if we have specific deliverables for this role
    for (const [roleKey, deliverables] of Object.entries(roleSpecificDeliverables)) {
      if (role.toLowerCase().includes(roleKey)) {
        return deliverables[Math.floor(Math.random() * deliverables.length)];
      }
    }
    
    // Fall back to general deliverables
    return generalDeliverables[Math.floor(Math.random() * generalDeliverables.length)];
  };
  
  // Helper function to generate random outcomes
  const getRandomOutcome = (): string => {
    const outcomes = [
      "increased efficiency by 30%",
      "reduced costs while improving quality",
      "accelerated time-to-market by 25%",
      "enhanced customer satisfaction scores",
      "streamlined operations across departments",
      "improved team collaboration and productivity",
      "strengthened client relationships and retention"
    ];
    return outcomes[Math.floor(Math.random() * outcomes.length)];
  };
  
  // Helper function to generate random focus areas
  const getRandomFocus = (): string => {
    const focuses = [
      "delivering exceptional results",
      "continuous improvement and innovation",
      "quality and performance optimization",
      "solving complex business challenges",
      "sustainable and practical solutions",
      "client satisfaction and relationship building",
      "effective communication and collaboration"
    ];
    return focuses[Math.floor(Math.random() * focuses.length)];
  };
  
  // IMPROVED: Generate role-appropriate passions
  const getRandomPassion = (role: string): string => {
    // Define role-specific passions
    const roleSpecificPassions: Record<string, string[]> = {
      "engineer": [
        "leveraging technology to solve real-world problems",
        "building scalable and maintainable systems",
        "exploring new technologies and approaches",
        "optimizing performance and efficiency"
      ],
      "manager": [
        "developing team members' skills and careers",
        "aligning operational activities with strategic goals",
        "building high-performing, collaborative teams",
        "driving organizational transformation"
      ],
      "analyst": [
        "uncovering insights from complex data",
        "translating data into strategic recommendations",
        "optimizing decision-making processes",
        "identifying opportunities for improvement through analysis"
      ],
      "designer": [
        "creating intuitive and impactful user experiences",
        "solving complex problems through design thinking",
        "balancing aesthetics with functionality",
        "advocating for user-centered approaches"
      ]
    };
    
    // General passions for any role
    const generalPassions = [
      "delivering high-quality work that makes a difference",
      "continuous learning and professional development",
      "collaborating with diverse teams to achieve common goals",
      "staying at the forefront of industry developments",
      "finding innovative solutions to business challenges"
    ];
    
    // Check if we have specific passions for this role
    for (const [roleKey, passions] of Object.entries(roleSpecificPassions)) {
      if (role.toLowerCase().includes(roleKey)) {
        return passions[Math.floor(Math.random() * passions.length)];
      }
    }
    
    // Fall back to general passions
    return generalPassions[Math.floor(Math.random() * generalPassions.length)];
  };
  
  // Helper function to generate random approaches
  const getRandomApproach = (): string => {
    const approaches = [
      "methodical planning and execution",
      "data-driven decision making",
      "innovative problem-solving",
      "collaborative teamwork",
      "attention to detail and quality",
      "effective communication and transparency",
      "adaptability and continuous improvement"
    ];
    return approaches[Math.floor(Math.random() * approaches.length)];
  };

  // Apply a suggestion to the editor
  const applySuggestion = (suggestion: string) => {
    setEditedSummary(suggestion);
    onSummaryChange(suggestion);
    
    toast({
      title: "Summary updated",
      description: "The suggested summary has been applied.",
    });
  };

  // Handle manual edits to the summary
  const handleSummaryEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedSummary(e.target.value);
    onSummaryChange(e.target.value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Professional Summary</span>
          <Button
            variant="outline"
            size="sm"
            onClick={generateSummarySuggestions}
            disabled={isGenerating || !jobDescription}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Suggestions"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Textarea
              placeholder="Enter your professional summary"
              value={editedSummary}
              onChange={handleSummaryEdit}
              className="h-24"
            />
          </div>

          {suggestions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Suggested Summaries:</h3>
              {suggestions.map((suggestion, index) => (
                <div key={index} className="p-3 bg-slate-50 border rounded-md">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm">{suggestion}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => applySuggestion(suggestion)}
                      className="shrink-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="sr-only">Use this summary</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!jobDescription && (
            <p className="text-sm text-amber-600">
              Enter a job description in the analyzer above to generate targeted summary suggestions.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryEditor;


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
    
    // Identify the role/position from job description
    const roleKeywords = ["engineer", "developer", "designer", "manager", "lead", 
                        "specialist", "director", "coordinator", "analyst"];
    
    let roleTitle = "professional";
    for (const keyword of roleKeywords) {
      if (requirements.some(req => req.toLowerCase().includes(keyword))) {
        roleTitle = keyword;
        break;
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
          relevantSkillsForSummary.slice(0, 3).join(", ")
        }${relevantSkillsForSummary.length > 3 ? ", and other technologies" : ""
        }. Committed to delivering high-quality solutions that meet business objectives and exceed client expectations${personalQualityText}. Proven track record of ${
          getRandomAccomplishment(roleTitle)
        } and ${
          getRandomStrength(roleTitle)
        }.`;
        
      case "achievement":
        return `Accomplished ${roleTitle} with ${requestedYears}+ years of extensive experience${industryContext} in ${
          relevantSkillsForSummary.slice(0, 2).join(" and ")
        }. Successfully delivered ${
          getRandomDeliverable(roleTitle)
        } resulting in ${
          getRandomOutcome()
        }${personalQualityText}. Demonstrated expertise in ${
          relevantSkillsForSummary.slice(2, 4).join(", ")
        } with a strong focus on ${
          getRandomFocus()
        }. Passionate about ${
          getRandomPassion(roleTitle)
        }.`;
        
      case "collaborative":
        return `Collaborative ${roleTitle} who thrives in team environments, bringing ${requestedYears}+ years of hands-on experience${industryContext} with ${
          relevantSkillsForSummary.slice(0, 3).join(", ")
        } to deliver impactful solutions. Excels at ${
          getRandomStrength(roleTitle)
        }${personalQualityText} while focusing on ${
          getRandomFocus()
        }. Committed to continuous learning and staying current with industry trends to drive ${
          getRandomOutcome()
        }.`;
        
      default:
        return `Experienced ${roleTitle} with a proven track record${industryContext} in ${
          relevantSkillsForSummary.slice(0, 3).join(", ")
        } and a passion for delivering high-quality solutions. Demonstrated ability to ${
          getRandomStrength(roleTitle)
        }${personalQualityText} and drive results through ${
          getRandomApproach()
        }.`;
    }
  };
  
  // Helper functions to generate random professional phrases
  const getRandomAccomplishment = (role: string): string => {
    const accomplishments = [
      "successfully delivering complex projects on time and within budget",
      "optimizing processes that resulted in significant efficiency improvements",
      "leading cross-functional teams to achieve business objectives",
      "designing innovative solutions for challenging business problems"
    ];
    return accomplishments[Math.floor(Math.random() * accomplishments.length)];
  };
  
  const getRandomStrength = (role: string): string => {
    if (role.includes("engineer") || role.includes("developer")) {
      const techStrengths = [
        "architecting scalable solutions",
        "optimizing code performance",
        "implementing efficient algorithms",
        "translating business requirements into technical specifications"
      ];
      return techStrengths[Math.floor(Math.random() * techStrengths.length)];
    } else if (role.includes("manager") || role.includes("lead")) {
      const leadershipStrengths = [
        "building and mentoring high-performing teams",
        "managing complex projects with multiple stakeholders",
        "developing strategic roadmaps aligned with business goals",
        "fostering collaboration across departments"
      ];
      return leadershipStrengths[Math.floor(Math.random() * leadershipStrengths.length)];
    } else {
      const generalStrengths = [
        "problem-solving in fast-paced environments",
        "adapting quickly to changing priorities",
        "communicating complex concepts to diverse audiences",
        "balancing quality and efficiency in deliverables"
      ];
      return generalStrengths[Math.floor(Math.random() * generalStrengths.length)];
    }
  };
  
  const getRandomDeliverable = (role: string): string => {
    if (role.includes("engineer") || role.includes("developer")) {
      const techDeliverables = [
        "enterprise-level applications",
        "scalable cloud infrastructure",
        "performance optimization solutions",
        "integrated data pipelines"
      ];
      return techDeliverables[Math.floor(Math.random() * techDeliverables.length)];
    } else if (role.includes("designer")) {
      const designDeliverables = [
        "user-centered interfaces",
        "comprehensive design systems",
        "interactive prototypes",
        "brand identity packages"
      ];
      return designDeliverables[Math.floor(Math.random() * designDeliverables.length)];
    } else {
      const generalDeliverables = [
        "strategic initiatives",
        "business process improvements",
        "cross-functional projects",
        "customer-focused solutions"
      ];
      return generalDeliverables[Math.floor(Math.random() * generalDeliverables.length)];
    }
  };
  
  const getRandomOutcome = (): string => {
    const outcomes = [
      "increased efficiency by 30%",
      "reduced costs while improving quality",
      "accelerated time-to-market by 25%",
      "enhanced customer satisfaction scores",
      "streamlined operations across departments"
    ];
    return outcomes[Math.floor(Math.random() * outcomes.length)];
  };
  
  const getRandomFocus = (): string => {
    const focuses = [
      "delivering exceptional user experiences",
      "continuous improvement and innovation",
      "quality and performance optimization",
      "solving complex business challenges",
      "sustainable and maintainable solutions"
    ];
    return focuses[Math.floor(Math.random() * focuses.length)];
  };
  
  const getRandomPassion = (role: string): string => {
    const passions = [
      "leveraging technology to solve real-world problems",
      "continuous learning and professional development",
      "creating intuitive and efficient solutions",
      "collaborating with diverse teams to drive innovation",
      "staying at the forefront of industry developments"
    ];
    return passions[Math.floor(Math.random() * passions.length)];
  };
  
  const getRandomApproach = (): string => {
    const approaches = [
      "agile methodologies",
      "data-driven decision making",
      "innovative problem-solving",
      "collaborative teamwork",
      "attention to detail and quality"
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

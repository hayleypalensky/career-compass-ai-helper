
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
      
      // Generate 3 different summary suggestions with enhanced personalization
      const newSuggestions = [
        generateEnhancedSummary(requirements, relevantSkills, "comprehensive", currentSummaryKeyPhrases),
        generateEnhancedSummary(requirements, relevantSkills, "professional", currentSummaryKeyPhrases),
        generateEnhancedSummary(requirements, relevantSkills, "personal", currentSummaryKeyPhrases)
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
  
  // Extract comprehensive information from current summary
  const extractKeyPhrasesFromSummary = (summary: string): string[] => {
    if (!summary) return [];
    
    const keyPhrases: string[] = [];
    
    // Look for years of experience with improved pattern matching
    const yearsPattern = /(\d+)[\+]?\s+years?(?:\s+of\s+experience)?/i;
    const yearsMatch = summary.match(yearsPattern);
    if (yearsMatch) {
      keyPhrases.push(yearsMatch[0]);
    }
    
    // Look for industries/domains mentioned - expanded list
    const industryWords = [
      "healthcare", "finance", "technology", "education", "manufacturing", 
      "retail", "government", "startup", "enterprise", "nonprofit",
      "legal", "marketing", "sales", "hospitality", "customer service",
      "human resources", "accounting", "consulting", "media", "entertainment",
      "real estate", "insurance", "telecommunications", "automotive", "energy"
    ];
    
    industryWords.forEach(industry => {
      if (summary.toLowerCase().includes(industry)) {
        keyPhrases.push(industry);
      }
    });
    
    // Look for specific qualifications with improved patterns
    const qualificationPatterns = [
      /certified\s+[\w\s]+/i,
      /[\w\s]+\s+certified/i,
      /[\w\s]+\s+degree/i,
      /degree\s+in\s+[\w\s]+/i,
      /master['']?s\s+(?:degree\s+)?in\s+[\w\s]+/i,
      /bachelor['']?s\s+(?:degree\s+)?in\s+[\w\s]+/i,
      /phd\s+(?:degree\s+)?in\s+[\w\s]+/i,
      /expert\s+in\s+[\w\s]+/i,
      /specialist\s+in\s+[\w\s]+/i,
      /licensed\s+[\w\s]+/i,
      /accredited\s+[\w\s]+/i
    ];
    
    qualificationPatterns.forEach(pattern => {
      const matches = summary.match(pattern);
      if (matches) {
        keyPhrases.push(matches[0]);
      }
    });
    
    // Look for personal qualities - expanded list
    const personalQualities = [
      "detail-oriented", "team player", "self-motivated", "passionate",
      "innovative", "analytical", "creative", "results-driven", "strategic",
      "organized", "adaptable", "flexible", "proactive", "collaborative",
      "communicative", "efficient", "reliable", "resourceful", "dedicated",
      "empathetic", "motivated", "diligent", "versatile", "responsible",
      "goal-oriented", "customer-focused", "service-oriented", "problem-solver"
    ];
    
    personalQualities.forEach(quality => {
      if (summary.toLowerCase().includes(quality.toLowerCase())) {
        keyPhrases.push(quality);
      }
    });
    
    // Look for potential role indicators - comprehensive expanded list
    const roleIndicators = [
      "manager", "coordinator", "director", "assistant", "specialist", 
      "consultant", "analyst", "designer", "developer", "administrator", 
      "associate", "representative", "agent", "advisor", "officer",
      "supervisor", "lead", "head", "chief", "executive", "president",
      "vice president", "vp", "founder", "owner", "entrepreneur", 
      "contractor", "freelancer", "professional", "expert", "strategist",
      "coach", "mentor", "trainer", "teacher", "educator", "instructor",
      "researcher", "scientist", "writer", "editor", "marketer", "seller",
      "accountant", "auditor", "lawyer", "attorney", "paralegal",
      "recruiter", "hr", "therapist", "counselor", "nurse", "doctor",
      "physician", "technician", "architect", "planner", "associate",
      "partner", "support specialist", "customer service", "project manager",
      "program manager", "product manager", "product owner", "scrum master"
    ];
    
    roleIndicators.forEach(role => {
      // Use more flexible pattern matching for roles
      const rolePattern = new RegExp(`\\b${role}\\b`, 'i');
      if (rolePattern.test(summary.toLowerCase())) {
        keyPhrases.push(role);
      }
    });
    
    // Extract potential achievements - new!
    const achievementPatterns = [
      /increased\s+[\w\s]+\s+by\s+\d+[%]?/i,
      /reduced\s+[\w\s]+\s+by\s+\d+[%]?/i,
      /improved\s+[\w\s]+\s+by\s+\d+[%]?/i,
      /grew\s+[\w\s]+\s+by\s+\d+[%]?/i,
      /awarded\s+[\w\s]+/i,
      /recognized\s+[\w\s]+/i,
      /honored\s+[\w\s]+/i,
      /achieved\s+[\w\s]+/i,
      /completed\s+[\w\s]+/i,
      /delivered\s+[\w\s]+/i,
      /implemented\s+[\w\s]+/i,
      /succeeded\s+in\s+[\w\s]+/i
    ];
    
    achievementPatterns.forEach(pattern => {
      const matches = summary.match(pattern);
      if (matches) {
        keyPhrases.push(matches[0]);
      }
    });
    
    // Extract full sentences that might contain important context
    const sentences = summary.split(/[.!?]+/).filter(s => s.trim().length > 0);
    sentences.forEach(sentence => {
      const trimmed = sentence.trim();
      if (trimmed.length > 20 && trimmed.length < 100) {
        if (
          trimmed.includes("background in") || 
          trimmed.includes("specialize in") || 
          trimmed.includes("focused on") || 
          trimmed.includes("expertise in") ||
          trimmed.includes("passion for") ||
          trimmed.includes("committed to") ||
          trimmed.includes("skilled in") ||
          trimmed.includes("proven track record") ||
          trimmed.includes("history of")
        ) {
          keyPhrases.push(trimmed);
        }
      }
    });
    
    return keyPhrases;
  };
  
  // Extract requirements and role details from job description
  const extractRequirementsFromJobDescription = (description: string): string[] => {
    if (!description) return [];
    
    const requirements: string[] = [];
    
    // Find sentences or phrases that contain meaningful requirements
    const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    sentences.forEach(sentence => {
      const lowerSentence = sentence.toLowerCase().trim();
      
      // Check if this sentence contains requirement indicators - expanded list
      const isRequirement = [
        "experience", "knowledge", "ability", "proficient", "familiar", 
        "degree", "years", "background", "skill", "responsible", 
        "develop", "create", "manage", "lead", "qualification",
        "expertise", "understand", "work with", "capable of", "proficiency",
        "fluent in", "competent with", "trained in", "certified in",
        "demonstrated", "proven", "track record", "history of", "passion for",
        "dedicated to", "commitment to", "excellent", "strong", "exceptional",
        "outstanding", "superior", "looking for", "seeking", "ideal candidate",
        "required", "must have", "essential", "necessary", "preferred"
      ].some(indicator => lowerSentence.includes(indicator));
      
      if (isRequirement && sentence.length > 15) {
        requirements.push(sentence.trim());
      }
    });
    
    return requirements;
  };
  
  // Generate enhanced, personalized summaries
  const generateEnhancedSummary = (
    requirements: string[], 
    skills: string[], 
    style: "comprehensive" | "professional" | "personal",
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
    
    // ENHANCED: Identify professional role from job description and existing summary
    const roleKeywords = [
      // Management roles
      "manager", "director", "executive", "supervisor", "lead", "chief", "head", 
      "coordinator", "administrator", 
      
      // Professional services
      "consultant", "advisor", "specialist", "analyst", "strategist", "expert",
      
      // Creative roles
      "designer", "writer", "editor", "creator", "artist", "producer",
      
      // Sales/Marketing
      "marketer", "salesperson", "representative", "agent", "associate", 
      
      // HR/Recruiting
      "recruiter", "hr professional", "talent acquisition", "people operations",
      
      // Administrative
      "assistant", "secretary", "clerk", "receptionist", "coordinator",
      
      // Finance
      "accountant", "auditor", "bookkeeper", "controller", "treasurer",
      
      // Legal
      "lawyer", "attorney", "paralegal", "legal assistant", "counsel",
      
      // Healthcare
      "nurse", "doctor", "physician", "therapist", "technician", "aide",
      
      // Education
      "teacher", "instructor", "educator", "trainer", "professor", "tutor",
      
      // IT/Technology
      "developer", "engineer", "architect", "technician", "administrator",
      
      // Customer service
      "representative", "associate", "agent", "specialist"
    ];
    
    // First look for specific role mentions in the job description title
    const jobTitleMatch = jobDescription.match(/job title:?\s*([^.,:;\n]+)/i) || 
                          jobDescription.match(/position:?\s*([^.,:;\n]+)/i) ||
                          jobDescription.match(/role:?\s*([^.,:;\n]+)/i);
    
    let jobTitleRole = "";
    if (jobTitleMatch && jobTitleMatch[1]) {
      jobTitleRole = jobTitleMatch[1].trim();
    }
    
    // Then check if any role keyword is in the existing summary
    const summaryRoles = currentSummaryPhrases.filter(phrase => 
      roleKeywords.some(role => new RegExp(`\\b${role}\\b`, 'i').test(phrase))
    );
    
    // Start with a default role
    let roleTitle = "professional"; 
    
    // Prioritize finding the right role title
    // 1. First use the job title if it's specific and not generic
    if (jobTitleRole && !["professional", "position", "job", "role", "candidate"].includes(jobTitleRole.toLowerCase())) {
      roleTitle = jobTitleRole;
    } 
    // 2. Then try to use roles from the user's existing summary
    else if (summaryRoles.length > 0) {
      for (const phrase of summaryRoles) {
        for (const keyword of roleKeywords) {
          const roleRegex = new RegExp(`\\b${keyword}\\b`, 'i');
          if (roleRegex.test(phrase)) {
            roleTitle = keyword;
            break;
          }
        }
        if (roleTitle !== "professional") break;
      }
    }
    // 3. If we still don't have a specific role, look in job requirements
    else {
      const roleMatches = requirements.flatMap(req => {
        const matches = [];
        for (const role of roleKeywords) {
          const roleRegex = new RegExp(`\\b${role}\\b`, 'i');
          if (roleRegex.test(req)) {
            matches.push(role);
          }
        }
        return matches;
      });
      
      if (roleMatches.length > 0) {
        roleTitle = roleMatches[0];
      }
    }
    
    // Extract industry mentions from current summary phrases
    const industriesList = [
      "healthcare", "finance", "technology", "education", "manufacturing", 
      "retail", "government", "startup", "enterprise", "nonprofit",
      "legal", "marketing", "sales", "hospitality", "customer service",
      "human resources", "accounting", "consulting", "media", "entertainment"
    ];
    
    const industryMentions = currentSummaryPhrases.filter(phrase => 
      industriesList.some(industry => phrase.toLowerCase().includes(industry))
    );
    
    // Get industry context if available
    const industryContext = industryMentions.length > 0 
      ? ` in the ${industryMentions[0]} industry` 
      : "";
    
    // Get personal qualities from current summary
    const personalQualityList = [
      "detail-oriented", "team player", "self-motivated", "passionate",
      "innovative", "analytical", "creative", "results-driven", "strategic",
      "organized", "adaptable", "flexible", "proactive", "collaborative"
    ];
    
    const personalQualityMatches = currentSummaryPhrases.filter(phrase => 
      personalQualityList.some(quality => phrase.toLowerCase().includes(quality.toLowerCase()))
    );
    
    // Format personal qualities for inclusion
    const personalQualityText = personalQualityMatches.length > 0 
      ? ` and ${personalQualityMatches[0]}` 
      : "";
    
    // Extract educational background - new!
    const educationMatches = currentSummaryPhrases.filter(phrase => 
      phrase.toLowerCase().includes("degree") || 
      phrase.toLowerCase().includes("bachelor") ||
      phrase.toLowerCase().includes("master") ||
      phrase.toLowerCase().includes("phd") ||
      phrase.toLowerCase().includes("diploma") ||
      phrase.toLowerCase().includes("certificate")
    );
    
    const educationText = educationMatches.length > 0
      ? ` with ${educationMatches[0]}`
      : "";
    
    // Extract achievements - new!
    const achievementMatches = currentSummaryPhrases.filter(phrase => 
      phrase.toLowerCase().includes("increased") ||
      phrase.toLowerCase().includes("reduced") ||
      phrase.toLowerCase().includes("improved") ||
      phrase.toLowerCase().includes("awarded") ||
      phrase.toLowerCase().includes("recognized") ||
      phrase.toLowerCase().includes("achieved")
    );
    
    // Format key skills to emphasize in the summary
    const keySkillsPhrase = relevantSkillsForSummary.length > 0
      ? relevantSkillsForSummary.slice(0, 3).join(", ")
      : skills.slice(0, 3).join(", ");
    
    // Generate different types of enhanced summaries based on style
    switch (style) {
      case "comprehensive":
        return `${capitalize(roleTitle)} with ${requestedYears}+ years of experience${industryContext}${educationText}, specializing in ${
          keySkillsPhrase || "core competencies"
        }${relevantSkillsForSummary.length > 3 ? ", and related areas" : ""
        }. ${achievementMatches.length > 0 ? `${achievementMatches[0]}. ` : ""
        }Combines ${
          getRandomStrength(roleTitle)
        }${personalQualityText} with expertise in ${
          getRandomExpertiseDomain(roleTitle, industryContext)
        }. Demonstrated success in ${
          getContextualAccomplishment(roleTitle, industryContext, requirementsToGoals(requirements))
        }.`;
        
      case "professional":
        const professionalIntro = `${capitalize(roleTitle)} with a strong background in ${
          keySkillsPhrase || "relevant professional domains"
        }${industryContext}${educationText}. ${achievementMatches.length > 0 ? `${achievementMatches[0]}. ` : ""}`;
        
        const professionalBody = `Brings ${requestedYears}+ years of experience delivering ${
          getRandomDeliverable(roleTitle)
        } through ${
          getRandomApproach()
        }. Proven track record of ${
          getContextualAccomplishment(roleTitle, industryContext, requirementsToGoals(requirements))
        }${personalQualityText}.`;
        
        const professionalClosing = `Committed to ${
          getMeaningfulImpact(roleTitle, industryContext)
        } while continuously ${
          getGrowthMindset()
        }.`;
        
        return `${professionalIntro}${professionalBody} ${professionalClosing}`;
        
      case "personal":
        const personalIntro = `Passionate ${roleTitle.toLowerCase()} with ${requestedYears}+ years${industryContext}${educationText} who thrives on ${
          getPersonalMotivation(roleTitle)
        }.`;
        
        const personalBody = `Skilled in ${
          keySkillsPhrase || "key professional areas"
        }, with particular strength in ${
          getRandomStrength(roleTitle)
        }${personalQualityText}. ${achievementMatches.length > 0 ? `${achievementMatches[0]}. ` : ""}`;
        
        const personalClosing = `Seeking to leverage expertise in ${
          getRandomExpertiseDomain(roleTitle, industryContext)
        } to ${
          getMeaningfulImpact(roleTitle, industryContext)
        } while contributing to ${
          getTeamOrOrgContribution()
        }.`;
        
        return `${personalIntro} ${personalBody}${personalClosing}`;
        
      default:
        return `Experienced ${roleTitle.toLowerCase()} with ${requestedYears}+ years in ${
          keySkillsPhrase || "relevant professional areas"
        }${industryContext}${educationText}. Brings expertise in ${
          getRandomExpertiseDomain(roleTitle, industryContext)
        } and a passion for ${
          getPersonalMotivation(roleTitle)
        }${personalQualityText}. ${achievementMatches.length > 0 ? `${achievementMatches[0]}. ` : ""
        }Committed to ${
          getMeaningfulImpact(roleTitle, industryContext)
        }.`;
    }
  };
  
  // NEW: Helper function to convert requirements to goals
  const requirementsToGoals = (requirements: string[]): string[] => {
    if (requirements.length === 0) return [];
    
    const goals: string[] = [];
    const goalKeywords = [
      "increase", "improve", "enhance", "optimize", "maximize", "grow",
      "develop", "streamline", "accelerate", "strengthen", "advance"
    ];
    
    requirements.forEach(req => {
      // Look for measurable requirements that could be goals
      if (/\d+%|\d+ percent|growth|increase|improve|enhance|goal|target|objective/i.test(req)) {
        goals.push(req);
      }
      
      // Look for requirements that mention business outcomes
      if (/revenue|profit|sales|customer|client|market share|efficiency|productivity|cost|quality/i.test(req)) {
        // Transform to a goal format
        for (const keyword of goalKeywords) {
          if (goals.length < 3) { // Limit to 3 goals
            goals.push(`${keyword} ${req.toLowerCase().replace(/^(must|should|shall|required to|responsible for)/i, '')}`);
            break;
          }
        }
      }
    });
    
    return goals;
  };
  
  // NEW: Helper function to capitalize first letter
  const capitalize = (s: string): string => {
    if (!s) return "";
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  };
  
  // ENHANCED: Role-specific strengths with more diversity
  const getRandomStrength = (role: string): string => {
    // Define role-specific strengths based on job categories
    const roleSpecificStrengths: Record<string, string[]> = {
      // Management roles
      "manager": [
        "building and developing high-performing teams",
        "strategic planning and execution",
        "mentoring and talent development",
        "cross-functional collaboration",
        "resource optimization and prioritization"
      ],
      "director": [
        "organizational leadership",
        "strategic vision and roadmap development",
        "program governance and oversight",
        "stakeholder management and alignment",
        "driving operational excellence"
      ],
      "supervisor": [
        "team performance management",
        "workflow optimization",
        "quality control processes",
        "direct coaching and feedback",
        "operational problem-solving"
      ],
      "coordinator": [
        "multitasking and timeline management",
        "cross-departmental communication",
        "detail-oriented process implementation",
        "organizational effectiveness",
        "collaborative problem-solving"
      ],
      
      // Professional services
      "consultant": [
        "needs assessment and solution design",
        "client relationship management",
        "business process optimization",
        "strategic recommendations and implementation",
        "change management and adoption"
      ],
      "analyst": [
        "data-driven insights and recommendations",
        "pattern recognition and trend analysis",
        "research and information synthesis",
        "translating complex concepts for diverse audiences",
        "quantitative and qualitative analysis"
      ],
      "specialist": [
        "deep domain expertise application",
        "technical problem-solving",
        "best practices implementation",
        "knowledge sharing and documentation",
        "process standardization"
      ],
      
      // Administrative
      "assistant": [
        "administrative support and coordination",
        "scheduling and calendar management",
        "documentation and record-keeping",
        "communication facilitation",
        "anticipating needs and proactive problem-solving"
      ],
      "administrator": [
        "system and process optimization",
        "policy implementation and compliance",
        "documentation and knowledge management",
        "efficient resource allocation",
        "troubleshooting and operational support"
      ],
      
      // Marketing/Sales
      "marketer": [
        "campaign development and execution",
        "audience targeting and messaging",
        "channel strategy and optimization", 
        "performance analysis and optimization",
        "creative content development"
      ],
      "salesperson": [
        "relationship building and trust development",
        "needs assessment and solution alignment",
        "negotiation and deal structuring",
        "pipeline management and forecasting",
        "consultative selling approaches"
      ],
      "representative": [
        "customer relationship management",
        "clear and empathetic communication",
        "problem resolution and escalation management",
        "product/service knowledge application",
        "customer satisfaction and retention"
      ],
      
      // HR/Recruiting
      "recruiter": [
        "talent sourcing and attraction",
        "candidate assessment and selection",
        "interview process management",
        "employment brand advocacy",
        "hiring manager partnerships"
      ],
      "hr": [
        "employee relations and engagement",
        "policy development and implementation",
        "benefits administration and optimization",
        "performance management systems",
        "organizational development initiatives"
      ],
      
      // Customer service
      "customer service": [
        "client needs assessment and resolution",
        "relationship building and management",
        "issue de-escalation and conflict resolution",
        "exceeding service expectations",
        "process improvement identification"
      ],
      
      // Project management
      "project manager": [
        "timeline and resource management",
        "stakeholder communication and alignment",
        "risk identification and mitigation",
        "scope and change management",
        "team coordination and motivation"
      ]
    };
    
    // General professional strengths for any role
    const generalStrengths = [
      "effective communication across all levels",
      "collaborative problem-solving",
      "adaptability in dynamic environments",
      "balancing strategic vision with tactical execution",
      "continuous improvement and innovation",
      "relationship building and stakeholder management",
      "analytical thinking and data-driven decision making",
      "meticulous attention to detail and quality",
      "meeting commitments and delivering results"
    ];
    
    // Check if we have specific strengths for this role by looking for keywords
    for (const [roleKey, strengths] of Object.entries(roleSpecificStrengths)) {
      if (role.toLowerCase().includes(roleKey.toLowerCase())) {
        return strengths[Math.floor(Math.random() * strengths.length)];
      }
    }
    
    // Fall back to general strengths
    return generalStrengths[Math.floor(Math.random() * generalStrengths.length)];
  };
  
  // NEW: Helper function for contextual accomplishments
  const getContextualAccomplishment = (role: string, industry: string, goals: string[]): string => {
    // Use provided goals first if available
    if (goals.length > 0) {
      return goals[Math.floor(Math.random() * goals.length)];
    }
    
    // If no goals, generate role-specific accomplishments
    const roleSpecificAccomplishments: Record<string, string[]> = {
      // Management roles
      "manager": [
        "driving team performance and talent development",
        "implementing strategic initiatives that deliver measurable results",
        "optimizing operations while reducing costs",
        "leading organizational change and transformation",
        "developing and executing business plans that exceed targets"
      ],
      "director": [
        "setting strategic direction that aligns with organizational goals",
        "overseeing multiple high-impact programs and initiatives",
        "building and leading high-performing teams across functions",
        "driving innovation and continuous improvement",
        "delivering consistent results that impact bottom-line performance"
      ],
      
      // Professional services
      "consultant": [
        "delivering solutions that address complex client challenges",
        "identifying opportunities for operational and strategic improvement",
        "implementing frameworks that enhance organizational capabilities",
        "building long-term client relationships based on trust and results",
        "translating business requirements into actionable recommendations"
      ],
      "analyst": [
        "uncovering insights that drive strategic decision-making",
        "developing reports and presentations that tell compelling data stories",
        "identifying trends and patterns that reveal new opportunities",
        "conducting research that informs product and service development",
        "creating models and frameworks that enhance analytical capabilities"
      ],
      
      // Marketing/Sales roles
      "marketer": [
        "developing campaigns that increase brand awareness and engagement",
        "optimizing marketing channels to improve ROI",
        "creating content strategies that drive audience growth",
        "implementing data-driven approaches to marketing optimization",
        "aligning marketing activities with sales and business objectives"
      ],
      "salesperson": [
        "exceeding sales targets through relationship-based approaches",
        "expanding accounts and territories through strategic prospecting",
        "developing solutions that address complex client needs",
        "negotiating agreements that benefit all parties",
        "maintaining high customer satisfaction and retention rates"
      ],
      
      // Administrative roles
      "assistant": [
        "streamlining administrative processes for improved efficiency",
        "coordinating complex schedules and logistics seamlessly",
        "managing multiple priorities while maintaining quality",
        "supporting leadership through proactive problem-solving",
        "facilitating effective communication across departments"
      ],
      "administrator": [
        "implementing systems that enhance operational efficiency",
        "ensuring compliance with policies and procedures",
        "managing resources to optimize organizational performance",
        "developing documentation that improves knowledge sharing",
        "providing support that enables team success"
      ]
    };
    
    // Industry-specific accomplishments to add context
    const industryAccomplishments: Record<string, string[]> = {
      "healthcare": [
        "improving patient care outcomes and satisfaction",
        "streamlining healthcare processes and operations",
        "ensuring compliance with healthcare regulations",
        "implementing solutions that enhance care coordination"
      ],
      "finance": [
        "optimizing financial processes and controls",
        "developing strategies that improve financial performance",
        "ensuring regulatory compliance and risk management",
        "delivering insights that support investment decisions"
      ],
      "technology": [
        "implementing technological solutions that drive business outcomes",
        "leading digital transformation initiatives",
        "developing scalable technology strategies",
        "aligning technology capabilities with business objectives"
      ],
      "education": [
        "enhancing learning outcomes through innovative approaches",
        "developing curriculum and instructional materials",
        "improving educational program effectiveness",
        "supporting student success and achievement"
      ],
      "retail": [
        "enhancing customer experience and satisfaction",
        "optimizing merchandising and inventory management",
        "improving sales performance through strategic initiatives",
        "developing omnichannel retail strategies"
      ]
    };
    
    // General accomplishments for any role
    const generalAccomplishments = [
      "consistently delivering high-quality results that meet or exceed expectations",
      "identifying and implementing process improvements that enhance efficiency",
      "collaborating effectively across teams to achieve shared objectives",
      "developing innovative solutions to complex challenges",
      "building strong relationships with stakeholders at all levels"
    ];
    
    // Try to find role-specific accomplishments
    for (const [roleKey, accomplishments] of Object.entries(roleSpecificAccomplishments)) {
      if (role.toLowerCase().includes(roleKey.toLowerCase())) {
        return accomplishments[Math.floor(Math.random() * accomplishments.length)];
      }
    }
    
    // Try to find industry-specific accomplishments
    for (const [industryKey, accomplishments] of Object.entries(industryAccomplishments)) {
      if (industry.toLowerCase().includes(industryKey.toLowerCase())) {
        return accomplishments[Math.floor(Math.random() * accomplishments.length)];
      }
    }
    
    // Fall back to general accomplishments
    return generalAccomplishments[Math.floor(Math.random() * generalAccomplishments.length)];
  };
  
  // ENHANCED: Generate role-appropriate deliverables
  const getRandomDeliverable = (role: string): string => {
    // Define role-specific deliverables based on job categories
    const roleSpecificDeliverables: Record<string, string[]> = {
      // Management roles
      "manager": [
        "strategic initiatives and business plans",
        "team performance improvement programs",
        "operational efficiency enhancements",
        "cross-functional projects",
        "resource optimization strategies"
      ],
      "director": [
        "organizational strategies and roadmaps",
        "large-scale program implementations",
        "governance and oversight frameworks",
        "departmental transformations",
        "business growth initiatives"
      ],
      
      // Professional services
      "consultant": [
        "client solution frameworks",
        "strategic recommendations",
        "process improvement methodologies",
        "change management programs",
        "best practice implementations"
      ],
      "analyst": [
        "comprehensive analytical reports",
        "data-driven recommendations",
        "business intelligence dashboards",
        "trend analysis and forecasts",
        "performance measurement frameworks"
      ],
      
      // Marketing/Sales
      "marketer": [
        "integrated marketing campaigns",
        "brand positioning strategies",
        "customer journey optimizations",
        "content marketing programs",
        "marketing analytics frameworks"
      ],
      "salesperson": [
        "client acquisition strategies",
        "relationship management programs",
        "sales process improvements",
        "territory development plans",
        "customer retention initiatives"
      ],
      
      // Administrative
      "assistant": [
        "administrative process improvements",
        "documentation and knowledge bases",
        "coordination systems and workflows",
        "communication protocols",
        "scheduling and logistics solutions"
      ],
      "administrator": [
        "procedural documentation and guides",
        "system optimization recommendations",
        "compliance monitoring frameworks",
        "resource allocation models",
        "operational support structures"
      ],
      
      // Project management
      "project manager": [
        "comprehensive project plans",
        "risk management frameworks",
        "stakeholder communication strategies",
        "resource allocation models",
        "project tracking and reporting systems"
      ]
    };
    
    // General deliverables for any role
    const generalDeliverables = [
      "effective solutions to complex challenges",
      "quality deliverables that meet stakeholder needs",
      "process improvements that enhance efficiency",
      "strategic initiatives aligned with organizational goals",
      "collaborative outcomes that drive business results"
    ];
    
    // Check for role-specific deliverables
    for (const [roleKey, deliverables] of Object.entries(roleSpecificDeliverables)) {
      if (role.toLowerCase().includes(roleKey.toLowerCase())) {
        return deliverables[Math.floor(Math.random() * deliverables.length)];
      }
    }
    
    // Fall back to general deliverables
    return generalDeliverables[Math.floor(Math.random() * generalDeliverables.length)];
  };
  
  // NEW: Helper function for expertise domains
  const getRandomExpertiseDomain = (role: string, industry: string): string => {
    // Role-specific expertise domains
    const roleExpertiseDomains: Record<string, string[]> = {
      "manager": [
        "strategic planning and execution",
        "team development and performance management",
        "operational efficiency and process improvement",
        "budget management and resource allocation",
        "stakeholder management and communication"
      ],
      "consultant": [
        "business analysis and solution design",
        "client relationship management",
        "industry best practices implementation",
        "change management and organizational readiness",
        "business process reengineering"
      ],
      "analyst": [
        "data analysis and interpretation",
        "research methodology and synthesis",
        "report development and presentation",
        "statistical modeling and forecasting",
        "business intelligence tools and techniques"
      ],
      "marketer": [
        "campaign strategy and execution",
        "digital marketing channels optimization",
        "content development and management",
        "brand positioning and messaging",
        "marketing analytics and performance measurement"
      ],
      "salesperson": [
        "relationship-based selling approaches",
        "needs assessment and solution alignment",
        "negotiation and closing techniques",
        "customer relationship management",
        "territory management and development"
      ],
      "assistant": [
        "administrative support and coordination",
        "calendar and schedule management",
        "communication facilitation",
        "document preparation and management",
        "meeting and event planning"
      ],
      "project manager": [
        "project planning and execution",
        "scope and change management",
        "risk assessment and mitigation",
        "stakeholder communication",
        "resource allocation and tracking"
      ]
    };
    
    // Industry-specific expertise domains
    const industryExpertiseDomains: Record<string, string[]> = {
      "healthcare": [
        "healthcare operations and workflows",
        "patient care coordination",
        "healthcare compliance and regulations",
        "clinical documentation improvement",
        "healthcare technology implementation"
      ],
      "finance": [
        "financial analysis and reporting",
        "risk management and compliance",
        "investment strategy and portfolio management",
        "financial process optimization",
        "budgeting and forecasting"
      ],
      "technology": [
        "technology strategy and roadmap development",
        "software implementation and adoption",
        "digital transformation initiatives",
        "data management and governance",
        "technology vendor management"
      ],
      "education": [
        "curriculum development and assessment",
        "instructional design and delivery",
        "educational program management",
        "student success initiatives",
        "educational technology implementation"
      ],
      "retail": [
        "customer experience enhancement",
        "merchandising strategy and execution",
        "inventory management optimization",
        "retail operations improvement",
        "omnichannel retail strategy"
      ]
    };
    
    // General expertise domains
    const generalExpertiseDomains = [
      "strategic planning and implementation",
      "process optimization and continuous improvement",
      "stakeholder engagement and communication",
      "problem-solving and decision-making",
      "cross-functional collaboration",
      "project coordination and delivery"
    ];
    
    // Check for role-specific expertise
    for (const [roleKey, domains] of Object.entries(roleExpertiseDomains)) {
      if (role.toLowerCase().includes(roleKey.toLowerCase())) {
        return domains[Math.floor(Math.random() * domains.length)];
      }
    }
    
    // Check for industry-specific expertise
    for (const [industryKey, domains] of Object.entries(industryExpertiseDomains)) {
      if (industry.toLowerCase().includes(industryKey.toLowerCase())) {
        return domains[Math.floor(Math.random() * domains.length)];
      }
    }
    
    // Fall back to general expertise
    return generalExpertiseDomains[Math.floor(Math.random() * generalExpertiseDomains.length)];
  };
  
  // NEW: Helper function for personal motivations
  const getPersonalMotivation = (role: string): string => {
    // Role-specific motivations
    const roleMotivations: Record<string, string[]> = {
      "manager": [
        "developing high-performing teams that achieve exceptional results",
        "creating environments where individuals can thrive and grow",
        "implementing strategies that drive organizational success",
        "solving complex business challenges through effective leadership",
        "building sustainable processes that improve organizational effectiveness"
      ],
      "analyst": [
        "uncovering insights that drive strategic decision-making",
        "transforming complex data into actionable recommendations",
        "identifying patterns and trends that reveal new opportunities",
        "applying analytical rigor to solve business problems",
        "developing frameworks that enhance organizational intelligence"
      ],
      "marketer": [
        "creating campaigns that resonate with target audiences",
        "developing strategies that build brand awareness and loyalty",
        "measuring and optimizing marketing performance",
        "connecting products and services with customer needs",
        "leveraging data to inform marketing decisions"
      ],
      "customer service": [
        "resolving issues to ensure exceptional customer experiences",
        "building relationships that drive customer loyalty",
        "anticipating needs to provide proactive support",
        "turning challenging situations into positive outcomes",
        "continuously improving service quality and efficiency"
      ],
      "project manager": [
        "delivering projects that meet or exceed expectations",
        "coordinating complex initiatives with multiple stakeholders",
        "identifying and mitigating risks before they impact outcomes",
        "building project frameworks that ensure successful delivery",
        "managing resources effectively to optimize project performance"
      ]
    };
    
    // General motivations
    const generalMotivations = [
      "tackling complex challenges and finding effective solutions",
      "contributing to organizational success through excellence in all endeavors",
      "continuous learning and professional development",
      "collaborating with diverse teams to achieve common goals",
      "delivering high-quality work that makes a meaningful impact",
      "building relationships based on trust and mutual respect"
    ];
    
    // Check for role-specific motivations
    for (const [roleKey, motivations] of Object.entries(roleMotivations)) {
      if (role.toLowerCase().includes(roleKey.toLowerCase())) {
        return motivations[Math.floor(Math.random() * motivations.length)];
      }
    }
    
    // Fall back to general motivations
    return generalMotivations[Math.floor(Math.random() * generalMotivations.length)];
  };
  
  // NEW: Helper function for meaningful impacts
  const getMeaningfulImpact = (role: string, industry: string): string => {
    // Role-specific impacts
    const roleImpacts: Record<string, string[]> = {
      "manager": [
        "driving organizational performance while developing team capabilities",
        "implementing strategies that create sustainable business value",
        "building processes that enhance efficiency and effectiveness",
        "fostering environments that promote innovation and growth",
        "delivering results that exceed stakeholder expectations"
      ],
      "analyst": [
        "providing insights that enable data-driven decision making",
        "identifying opportunities that drive business improvement",
        "developing frameworks that enhance analytical capabilities",
        "translating complex data into actionable recommendations",
        "supporting strategic initiatives with rigorous analysis"
      ],
      "marketer": [
        "building brand awareness and engagement in target markets",
        "developing customer-centric marketing strategies",
        "optimizing marketing ROI through data-driven approaches",
        "creating content that resonates with target audiences",
        "driving qualified leads and supporting sales objectives"
      ],
      "salesperson": [
        "building long-term client relationships based on trust and value",
        "developing solutions that address complex customer needs",
        "exceeding revenue targets through consultative approaches",
        "expanding market share in key territories",
        "maintaining high levels of customer satisfaction and loyalty"
      ]
    };
    
    // Industry-specific impacts
    const industryImpacts: Record<string, string[]> = {
      "healthcare": [
        "improving patient care outcomes and experiences",
        "enhancing healthcare delivery efficiency and effectiveness",
        "supporting providers in delivering high-quality care",
        "advancing healthcare innovation and best practices",
        "ensuring compliance with evolving healthcare regulations"
      ],
      "education": [
        "enhancing learning outcomes for diverse student populations",
        "supporting educational institutions in achieving their missions",
        "developing programs that address educational challenges",
        "implementing approaches that improve educational access and equity",
        "fostering environments that promote lifelong learning"
      ],
      "nonprofit": [
        "advancing missions that create positive social change",
        "maximizing impact through efficient resource utilization",
        "building partnerships that amplify organizational reach",
        "developing sustainable programs that address community needs",
        "measuring and communicating program outcomes effectively"
      ],
      "technology": [
        "leveraging technology to solve complex business challenges",
        "driving digital transformation that creates competitive advantage",
        "implementing solutions that enhance user experiences",
        "ensuring technology alignment with business objectives",
        "developing scalable infrastructure that supports growth"
      ]
    };
    
    // General impacts
    const generalImpacts = [
      "delivering exceptional results that create value",
      "driving continuous improvement and innovation",
      "applying expertise to solve complex challenges",
      "building collaborative relationships that enhance outcomes",
      "contributing to organizational success through excellence",
      "ensuring high-quality standards in all deliverables"
    ];
    
    // Check for role-specific impacts
    for (const [roleKey, impacts] of Object.entries(roleImpacts)) {
      if (role.toLowerCase().includes(roleKey.toLowerCase())) {
        return impacts[Math.floor(Math.random() * impacts.length)];
      }
    }
    
    // Check for industry-specific impacts
    for (const [industryKey, impacts] of Object.entries(industryImpacts)) {
      if (industry.toLowerCase().includes(industryKey.toLowerCase())) {
        return impacts[Math.floor(Math.random() * impacts.length)];
      }
    }
    
    // Fall back to general impacts
    return generalImpacts[Math.floor(Math.random() * generalImpacts.length)];
  };
  
  // NEW: Helper function for team/organizational contributions
  const getTeamOrOrgContribution = (): string => {
    const contributions = [
      "team success through effective collaboration and knowledge sharing",
      "organizational growth through innovative approaches and continuous improvement",
      "positive workplace culture that values diversity and inclusion",
      "achieving shared goals through clear communication and alignment",
      "developing capabilities that enhance team and organizational performance",
      "building an environment of trust, respect, and professional excellence"
    ];
    
    return contributions[Math.floor(Math.random() * contributions.length)];
  };
  
  // NEW: Helper function for growth mindset
  const getGrowthMindset = (): string => {
    const mindsets = [
      "expanding knowledge and capabilities in evolving professional landscapes",
      "seeking opportunities to learn and develop new skills",
      "embracing challenges as opportunities for growth and innovation",
      "adapting to changing environments and requirements",
      "staying current with industry trends and best practices",
      "pursuing professional development through formal and informal learning"
    ];
    
    return mindsets[Math.floor(Math.random() * mindsets.length)];
  };
  
  // Helper function to generate random approaches
  const getRandomApproach = (): string => {
    const approaches = [
      "strategic planning and meticulous execution",
      "collaborative problem-solving and cross-functional alignment",
      "data-driven decision making and continuous evaluation",
      "innovative thinking and practical implementation",
      "effective communication and stakeholder management",
      "agile methodologies and iterative improvement"
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

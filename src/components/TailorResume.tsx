
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

  // Toggle missing skill selection
  const toggleSkillSelection = (skill: string) => {
    setSkillsToAdd((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
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
    
    // Extract key terms from job description
    const jobKeywords = extractKeywordsFromJobDescription(jobDescription);
    
    // Match experience with job requirements
    const relevantTerms = jobKeywords.filter(term => 
      experience.title.toLowerCase().includes(term) || 
      experience.description?.toLowerCase().includes(term)
    );
    
    // Generate suggestions based on job description and experience
    if (jobDescription) {
      // Add suggestions that incorporate relevant skills from the job
      relevantSkills.forEach(skill => {
        if (!currentBullet.toLowerCase().includes(skill.toLowerCase())) {
          suggestions.push(`Utilized ${skill} to ${getRandomActionVerb()} ${getRandomOutcome()}`);
        }
      });
      
      // Add suggestions based on job keywords
      if (relevantTerms.length > 0) {
        suggestions.push(
          `Demonstrated expertise in ${relevantTerms.slice(0, 2).join(" and ")} to ${getRandomActionVerb()} business objectives`,
          `Led initiatives focused on ${relevantTerms[0] || "key business areas"}, resulting in ${getRandomMetric()}`
        );
      }
    }
    
    // Add quantifiable suggestions
    suggestions.push(
      `${getRandomActionVerb(true)} ${currentBullet.replace(/^I |^Led |^Managed |^Developed /i, '')}, resulting in ${getRandomMetric()}`,
      `Collaborated with cross-functional teams to ${currentBullet.replace(/^I |^Led |^Managed |^Developed /i, '').toLowerCase()}`
    );
    
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
  
  // Helper function to generate random action verbs
  const getRandomActionVerb = (capitalized = false): string => {
    const verbs = [
      "improved", "increased", "reduced", "developed", "implemented",
      "created", "established", "led", "managed", "coordinated",
      "streamlined", "enhanced", "optimized", "accelerated", "achieved"
    ];
    
    const verb = verbs[Math.floor(Math.random() * verbs.length)];
    return capitalized ? verb.charAt(0).toUpperCase() + verb.slice(1) : verb;
  };
  
  // Helper function to generate random outcomes
  const getRandomOutcome = (): string => {
    const outcomes = [
      "improve team productivity",
      "enhance business processes",
      "drive customer satisfaction",
      "achieve business objectives",
      "maximize operational efficiency",
      "deliver project milestones",
      "streamline workflow"
    ];
    
    return outcomes[Math.floor(Math.random() * outcomes.length)];
  };
  
  // Helper function to generate random metrics
  const getRandomMetric = (): string => {
    const metrics = [
      "20% improvement in efficiency",
      "30% reduction in costs",
      "significant increase in team productivity",
      "substantial improvement in customer satisfaction",
      "measurable enhancement in quality metrics",
      "15% growth in key performance indicators",
      "positive feedback from stakeholders"
    ];
    
    return metrics[Math.floor(Math.random() * metrics.length)];
  };

  // Save the tailored resume
  const saveTailoredResume = () => {
    // Create new skills from the selected missing skills
    const newSkills: Skill[] = [
      ...profile.skills,
      ...skillsToAdd.map((skillName) => ({
        id: crypto.randomUUID(),
        name: skillName,
        category: "Technical", // Default category, could be improved
      })),
    ];

    onUpdateResume(tailoredExperiences, newSkills);
    
    toast({
      title: "Resume tailored successfully",
      description: "Your resume has been updated with the tailored content.",
    });
  };

  return (
    <div className="space-y-8">
      <RelevantSkillsCard relevantSkills={relevantSkills} />

      <MissingSkillsCard 
        missingSkills={missingSkills}
        skillsToAdd={skillsToAdd}
        userResponses={userResponses}
        onToggleSkill={toggleSkillSelection}
        onUpdateResponse={updateResponse}
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
        profile={profile}
        experiences={tailoredExperiences}
        skillsToAdd={skillsToAdd}
        relevantSkills={relevantSkills}
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

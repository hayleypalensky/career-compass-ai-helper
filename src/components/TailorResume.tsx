
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
}

const TailorResume = ({
  profile,
  relevantSkills,
  missingSkills,
  onUpdateResume,
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
    
    // Generate suggestions based on relevant skills and current bullet point
    // This is a simple implementation - in a real app, this would use more sophisticated NLP
    const suggestions = relevantSkills.map(skill => {
      if (!currentBullet.toLowerCase().includes(skill.toLowerCase())) {
        return `${currentBullet} utilizing ${skill} to improve outcomes`;
      }
      return `Enhanced ${skill} expertise through ${experience.title} role, resulting in measurable improvements`;
    });
    
    // Add quantifiable suggestions
    suggestions.push(
      `${currentBullet}, resulting in 20% improvement in efficiency`,
      `Led initiative to ${currentBullet.replace(/^I /i, '').replace(/^Led /i, '')} that saved the company resources`,
      `Collaborated with cross-functional teams to ${currentBullet.replace(/^I /i, '')}`
    );
    
    // Filter out empty suggestions
    return [...new Set(suggestions.filter(s => s && s !== currentBullet))].slice(0, 3);
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

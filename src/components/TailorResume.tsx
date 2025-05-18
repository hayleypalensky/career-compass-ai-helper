
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Profile } from "@/types/profile";
import { Experience } from "@/components/ExperienceForm";
import { Skill } from "@/components/SkillsForm";

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
      <Card>
        <CardHeader>
          <CardTitle>Relevant Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {relevantSkills.length > 0 ? (
              relevantSkills.map((skill, index) => (
                <Badge key={index} className="bg-green-600">
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-gray-500">No relevant skills identified.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Missing Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {missingSkills.length > 0 ? (
              missingSkills.map((skill, index) => (
                <div key={index} className="space-y-2 p-4 border rounded-md">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`skill-${index}`}
                      checked={skillsToAdd.includes(skill)}
                      onCheckedChange={() => toggleSkillSelection(skill)}
                    />
                    <Label htmlFor={`skill-${index}`} className="font-medium">
                      Do you have experience with {skill}?
                    </Label>
                  </div>
                  
                  {skillsToAdd.includes(skill) && (
                    <div className="ml-6 space-y-2">
                      <Label htmlFor={`response-${index}`}>
                        Describe your experience with {skill}:
                      </Label>
                      <Textarea
                        id={`response-${index}`}
                        value={userResponses[skill] || ""}
                        onChange={(e) => updateResponse(skill, e.target.value)}
                        placeholder={`Describe your experience with ${skill}...`}
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No missing skills identified.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tailor Experience Bullet Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {tailoredExperiences.map((exp, expIndex) => (
              <div key={exp.id} className="p-4 border rounded-md space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{exp.title}</h3>
                  <p className="text-navy-600">{exp.company}</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Bullet Points</Label>
                  {exp.bullets.map((bullet, bulletIndex) => (
                    <div key={bulletIndex} className="flex gap-2">
                      <Textarea
                        value={bullet}
                        onChange={(e) =>
                          handleBulletChange(expIndex, bulletIndex, e.target.value)
                        }
                        rows={2}
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeBullet(expIndex, bulletIndex)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addBullet(expIndex)}
                  >
                    Add Bullet Point
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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

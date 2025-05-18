
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { X, MessageSquare, Pencil } from "lucide-react"; 
import { Profile } from "@/types/profile";
import { Experience } from "@/components/ExperienceForm";
import { Skill } from "@/components/SkillsForm";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  const [showSuggestions, setShowSuggestions] = useState<Record<string, boolean>>({});

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

  // Toggle suggestions visibility for a specific bullet point
  const toggleSuggestions = (expIndex: number, bulletIndex: number) => {
    const key = `${expIndex}-${bulletIndex}`;
    setShowSuggestions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  // Apply a suggestion to a bullet point
  const applySuggestion = (expIndex: number, bulletIndex: number, suggestion: string) => {
    handleBulletChange(expIndex, bulletIndex, suggestion);
    
    // Close suggestions after applying
    const key = `${expIndex}-${bulletIndex}`;
    setShowSuggestions(prev => ({
      ...prev,
      [key]: false
    }));
    
    toast({
      title: "Suggestion applied",
      description: "The bullet point has been updated with the suggested content.",
    });
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
                    <div key={bulletIndex} className="space-y-2">
                      <div className="flex gap-2">
                        <Textarea
                          value={bullet}
                          onChange={(e) =>
                            handleBulletChange(expIndex, bulletIndex, e.target.value)
                          }
                          rows={2}
                          className="flex-1"
                        />
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => toggleSuggestions(expIndex, bulletIndex)}
                            title="Get suggestions"
                          >
                            <div className="relative">
                              <MessageSquare className="h-4 w-4" />
                              <Pencil className="h-3 w-3 absolute -bottom-1 -right-1" />
                            </div>
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => removeBullet(expIndex, bulletIndex)}
                            title="Remove bullet point"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Suggestions Collapsible */}
                      {showSuggestions[`${expIndex}-${bulletIndex}`] && (
                        <div className="ml-2 bg-slate-50 p-3 rounded-md border border-slate-200">
                          <h4 className="text-sm font-medium mb-2">Suggestions to improve ATS matching:</h4>
                          <div className="space-y-2">
                            {generateBulletSuggestions(expIndex, bulletIndex).map((suggestion, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-xs h-auto py-1 px-2"
                                  onClick={() => applySuggestion(expIndex, bulletIndex, suggestion)}
                                >
                                  Use
                                </Button>
                                <p className="text-sm">{suggestion}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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

      <div className="space-y-8" id="resume-content">
        <div className="p-6 border rounded-lg bg-white">
          <h2 className="text-2xl font-bold mb-2">{profile.personalInfo.name}</h2>
          
          {profile.personalInfo.email && (
            <p className="text-gray-600 mb-1">{profile.personalInfo.email}</p>
          )}
          
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.personalInfo.location && (
              <span className="text-gray-600">{profile.personalInfo.location}</span>
            )}
            {profile.personalInfo.phone && (
              <span className="text-gray-600">{profile.personalInfo.phone}</span>
            )}
            {/* Only render website if it exists on the PersonalInfo type */}
            {profile.personalInfo.website && 'website' in profile.personalInfo && (
              <span className="text-gray-600">{profile.personalInfo.website}</span>
            )}
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Professional Summary</h3>
            <p className="text-gray-800">{profile.personalInfo.summary}</p>
          </div>
          
          {tailoredExperiences.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold border-b pb-1 mb-4">Experience</h3>
              <div className="space-y-4">
                {tailoredExperiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between mb-1">
                      <h4 className="font-medium">{exp.title}</h4>
                      <span className="text-gray-600">{exp.startDate} - {exp.endDate || 'Present'}</span>
                    </div>
                    <p className="text-gray-700 mb-2">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                    <ul className="list-disc list-inside space-y-1">
                      {exp.bullets.map((bullet, idx) => (
                        <li key={idx} className="text-gray-800">{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {profile.education && profile.education.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold border-b pb-1 mb-4">Education</h3>
              <div className="space-y-4">
                {profile.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between mb-1">
                      <h4 className="font-medium">{edu.degree}</h4>
                      <span className="text-gray-600">{edu.startDate} - {edu.endDate || 'Present'}</span>
                    </div>
                    <p className="text-gray-700">{edu.school}{/* Only check for location if it exists on the Education type */}
                    {'location' in edu && edu.location ? `, ${edu.location}` : ''}</p>
                    {edu.description && <p className="text-gray-600 mt-1">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-semibold border-b pb-1 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span 
                  key={skill.id} 
                  className={`px-3 py-1 rounded-full text-sm ${
                    relevantSkills.includes(skill.name) 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {skill.name}
                </span>
              ))}
              {skillsToAdd.map((skill) => (
                <span key={skill} className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  {skill}*
                </span>
              ))}
            </div>
            {skillsToAdd.length > 0 && (
              <p className="text-sm mt-2 text-gray-500">* Skills added based on job requirements</p>
            )}
          </div>
        </div>
      </div>

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

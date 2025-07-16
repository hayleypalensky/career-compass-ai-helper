import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { X } from "lucide-react";

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description?: string;
  bullets: string[];
  excludeFromResume?: boolean; // Add option to exclude from resume
}

interface ExperienceFormProps {
  onSave: (experiences: Experience[]) => void;
  initialData?: Experience[];
}

const ExperienceForm = ({ onSave, initialData }: ExperienceFormProps) => {
  const { toast } = useToast();
  const [experiences, setExperiences] = useState<Experience[]>(
    initialData || []
  );
  const [currentExperience, setCurrentExperience] = useState<Experience>({
    id: crypto.randomUUID(),
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    bullets: [""],
    excludeFromResume: false,
  });
  const [editing, setEditing] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setCurrentExperience((prev) => ({ ...prev, [name]: value }));
  };

  const handleBulletChange = (index: number, value: string) => {
    setCurrentExperience((prev) => {
      const newBullets = [...prev.bullets];
      newBullets[index] = value;
      return { ...prev, bullets: newBullets };
    });
  };

  const addBullet = () => {
    setCurrentExperience((prev) => ({
      ...prev,
      bullets: [...prev.bullets, ""],
    }));
  };

  const removeBullet = (index: number) => {
    setCurrentExperience((prev) => {
      const newBullets = prev.bullets.filter((_, i) => i !== index);
      return { ...prev, bullets: newBullets.length ? newBullets : [""] };
    });
  };

  const handleAddExperience = () => {
    const nonEmptyBullets = currentExperience.bullets.filter((b) => b.trim());
    const expToAdd = {
      ...currentExperience,
      bullets: nonEmptyBullets.length ? nonEmptyBullets : [],
      id: crypto.randomUUID(),
      excludeFromResume: currentExperience.excludeFromResume,
    };

    if (editing !== null) {
      const updatedExperiences = [...experiences];
      updatedExperiences[editing] = expToAdd;
      setExperiences(updatedExperiences);
      setEditing(null);
    } else {
      setExperiences((prev) => [...prev, expToAdd]);
    }

    setCurrentExperience({
      id: crypto.randomUUID(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      bullets: [""],
      excludeFromResume: false,
    });

    toast({
      title: editing !== null ? "Experience updated" : "Experience added",
      description: editing !== null
        ? "Your experience has been updated successfully."
        : "New experience has been added to your profile.",
    });
  };

  const editExperience = (index: number) => {
    setCurrentExperience(experiences[index]);
    setEditing(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteExperience = (index: number) => {
    setExperiences((prev) => prev.filter((_, i) => i !== index));
    if (editing === index) {
      setEditing(null);
      setCurrentExperience({
        id: crypto.randomUUID(),
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        bullets: [""],
        excludeFromResume: false,
      });
    }
    toast({
      title: "Experience deleted",
      description: "The experience has been removed from your profile.",
    });
  };

  const handleSaveAll = () => {
    onSave(experiences);
    toast({
      title: "Experiences saved",
      description: "All your experiences have been saved successfully.",
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>
            {editing !== null ? "Edit Experience" : "Add Experience"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={currentExperience.title}
                  onChange={handleChange}
                  placeholder="Job Title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  value={currentExperience.company}
                  onChange={handleChange}
                  placeholder="Company Name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="month"
                  value={currentExperience.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (or Present)</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="month"
                  value={currentExperience.endDate}
                  onChange={handleChange}
                  placeholder="Present"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={currentExperience.location}
                  onChange={handleChange}
                  placeholder="City, State or Remote"
                />
              </div>
            </div>


            <div className="space-y-4">
              <Label>Bullet Points (Achievements & Responsibilities)</Label>
              {currentExperience.bullets.map((bullet, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={bullet}
                    onChange={(e) => handleBulletChange(index, e.target.value)}
                    placeholder="Describe an achievement or responsibility"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBullet(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addBullet}
              >
                Add Bullet Point
              </Button>
            </div>

            <Button
              onClick={handleAddExperience}
              className="w-full bg-navy-600 hover:bg-navy-700"
            >
              {editing !== null ? "Update Experience" : "Add Experience"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {experiences.length > 0 && (
        <>
          <div className="space-y-4">
            <h3>Your Experiences</h3>
            {experiences.map((exp, index) => (
              <Card key={exp.id} className="resume-card">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-lg">{exp.title}</h4>
                      <p className="text-navy-600">{exp.company}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>
                        {exp.startDate} - {exp.endDate || "Present"}
                      </p>
                      <p>{exp.location}</p>
                    </div>
                  </div>
                  {exp.bullets.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      {exp.bullets.map((bullet, i) => (
                        <li key={i} className="text-gray-700">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => editExperience(index)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteExperience(index)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            onClick={handleSaveAll}
            className="w-full bg-navy-700 hover:bg-navy-800"
          >
            Save All Experiences
          </Button>
        </>
      )}
    </div>
  );
};

export default ExperienceForm;

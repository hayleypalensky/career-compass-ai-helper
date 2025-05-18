
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export interface Skill {
  id: string;
  name: string;
  category: string;
}

interface SkillsFormProps {
  onSave: (skills: Skill[]) => void;
  initialData?: Skill[];
}

const categories = [
  "Technical",
  "Soft Skills",
  "Languages",
  "Tools",
  "Certifications",
  "Other",
];

const SkillsForm = ({ onSave, initialData }: SkillsFormProps) => {
  const { toast } = useToast();
  const [skills, setSkills] = useState<Skill[]>(initialData || []);
  const [newSkill, setNewSkill] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Technical");

  const handleAddSkill = () => {
    if (newSkill.trim() === "") return;

    const skillExists = skills.some(
      (s) => 
        s.name.toLowerCase() === newSkill.toLowerCase() && 
        s.category === selectedCategory
    );

    if (skillExists) {
      toast({
        title: "Skill already exists",
        description: `"${newSkill}" is already in your ${selectedCategory} skills.`,
        variant: "destructive",
      });
      return;
    }

    const newSkillObj: Skill = {
      id: crypto.randomUUID(),
      name: newSkill.trim(),
      category: selectedCategory,
    };

    setSkills((prev) => [...prev, newSkillObj]);
    setNewSkill("");
    
    toast({
      title: "Skill added",
      description: `"${newSkill}" has been added to your skills.`,
    });
  };

  const handleRemoveSkill = (id: string) => {
    setSkills((prev) => prev.filter((skill) => skill.id !== id));
  };

  const handleSave = () => {
    onSave(skills);
    toast({
      title: "Skills saved",
      description: "Your skills have been saved successfully.",
    });
  };

  // Group skills by category
  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`cursor-pointer ${
                    selectedCategory === category
                      ? "bg-navy-600 hover:bg-navy-700"
                      : ""
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>

            <div className="flex space-x-2">
              <div className="flex-grow">
                <Label htmlFor="skill" className="sr-only">
                  Skill
                </Label>
                <Input
                  id="skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder={`Add a ${selectedCategory.toLowerCase()} skill...`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
              </div>
              <Button
                onClick={handleAddSkill}
                className="bg-navy-600 hover:bg-navy-700"
              >
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {Object.keys(skillsByCategory).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Skills</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <div key={category} className="mb-6 last:mb-0">
                <h3 className="text-lg font-medium mb-2">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill) => (
                    <Badge
                      key={skill.id}
                      variant="secondary"
                      className="flex items-center gap-1 py-1 px-3"
                    >
                      {skill.name}
                      <button
                        onClick={() => handleRemoveSkill(skill.id)}
                        className="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
            
            <Button
              onClick={handleSave}
              className="w-full mt-4 bg-navy-700 hover:bg-navy-800"
            >
              Save Skills
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SkillsForm;

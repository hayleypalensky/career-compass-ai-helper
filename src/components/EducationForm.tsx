
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Trash, Plus, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

interface EducationFormProps {
  onSave: (education: Education[]) => void;
  initialData?: Education[];
}

const EducationForm = ({ onSave, initialData = [] }: EducationFormProps) => {
  const { toast } = useToast();
  const [educationList, setEducationList] = useState<Education[]>(
    initialData.length > 0
      ? initialData
      : []
  );

  const addEducation = () => {
    setEducationList([
      ...educationList,
      {
        id: crypto.randomUUID(),
        school: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        description: "",
        current: false,
      },
    ]);
  };

  const removeEducation = (id: string) => {
    setEducationList(educationList.filter((edu) => edu.id !== id));
  };

  const updateEducation = (id: string, field: keyof Education, value: string | boolean) => {
    setEducationList(
      educationList.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(educationList);
    toast({
      title: "Education saved",
      description: "Your education information has been updated successfully.",
    });
  };

  const toggleCurrent = (id: string, checked: boolean) => {
    updateEducation(id, "current", checked);
    if (checked) {
      updateEducation(id, "endDate", "");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Education
        </CardTitle>
        <Button variant="outline" size="sm" onClick={addEducation}>
          <Plus className="mr-1 h-4 w-4" /> Add Education
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {educationList.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No education entries yet. Add your education history.
            </div>
          ) : (
            educationList.map((education, index) => (
              <div
                key={education.id}
                className={cn(
                  "p-4 border rounded-md space-y-4",
                  index !== educationList.length - 1 && "mb-6"
                )}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">
                    {education.school || "New Education Entry"}
                  </h3>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeEducation(education.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`school-${education.id}`}>School/University</Label>
                    <Input
                      id={`school-${education.id}`}
                      value={education.school}
                      onChange={(e) =>
                        updateEducation(education.id, "school", e.target.value)
                      }
                      placeholder="University name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`degree-${education.id}`}>Degree</Label>
                    <Input
                      id={`degree-${education.id}`}
                      value={education.degree}
                      onChange={(e) =>
                        updateEducation(education.id, "degree", e.target.value)
                      }
                      placeholder="Bachelor's, Master's, etc."
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`field-${education.id}`}>Field of Study</Label>
                  <Input
                    id={`field-${education.id}`}
                    value={education.field}
                    onChange={(e) =>
                      updateEducation(education.id, "field", e.target.value)
                    }
                    placeholder="Computer Science, Business, etc."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`startDate-${education.id}`}>Start Date</Label>
                    <Input
                      id={`startDate-${education.id}`}
                      type="month"
                      value={education.startDate}
                      onChange={(e) =>
                        updateEducation(education.id, "startDate", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`endDate-${education.id}`}>End Date</Label>
                      <div className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          id={`current-${education.id}`}
                          checked={education.current}
                          onChange={(e) => toggleCurrent(education.id, e.target.checked)}
                          className="mr-1"
                        />
                        <Label htmlFor={`current-${education.id}`} className="text-sm cursor-pointer">
                          Current
                        </Label>
                      </div>
                    </div>
                    <Input
                      id={`endDate-${education.id}`}
                      type="month"
                      value={education.endDate}
                      onChange={(e) =>
                        updateEducation(education.id, "endDate", e.target.value)
                      }
                      disabled={education.current}
                      required={!education.current}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`description-${education.id}`}>Description</Label>
                  <Textarea
                    id={`description-${education.id}`}
                    value={education.description}
                    onChange={(e) =>
                      updateEducation(education.id, "description", e.target.value)
                    }
                    placeholder="Relevant coursework, honors, activities, etc."
                    rows={3}
                  />
                </div>
              </div>
            ))
          )}

          <Button
            type="submit"
            className="w-full bg-navy-600 hover:bg-navy-700"
          >
            Save Education
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EducationForm;


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface MissingSkillsCardProps {
  missingSkills: string[];
  skillsToAdd: string[];
  userResponses: Record<string, string>;
  onToggleSkill: (skill: string) => void;
  onUpdateResponse: (skill: string, response: string) => void;
}

const MissingSkillsCard = ({
  missingSkills,
  skillsToAdd,
  userResponses,
  onToggleSkill,
  onUpdateResponse,
}: MissingSkillsCardProps) => {
  return (
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
                    onCheckedChange={() => onToggleSkill(skill)}
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
                      onChange={(e) => onUpdateResponse(skill, e.target.value)}
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
  );
};

export default MissingSkillsCard;

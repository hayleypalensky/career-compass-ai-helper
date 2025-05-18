
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skill } from "@/components/SkillsForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, X, Check, AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SkillManagementProps {
  profileSkills: Skill[];
  relevantSkills: string[];
  missingSkills: string[];
  skillsToAdd: string[];
  skillsToRemove: string[];
  onToggleSkillToAdd: (skill: string) => void;
  onToggleSkillToRemove: (skillId: string) => void;
}

const SkillManagement = ({
  profileSkills,
  relevantSkills,
  missingSkills,
  skillsToAdd,
  skillsToRemove,
  onToggleSkillToAdd,
  onToggleSkillToRemove,
}: SkillManagementProps) => {
  // Group skills by relevance
  const [relevantProfileSkills, setRelevantProfileSkills] = useState<Skill[]>([]);
  const [nonRelevantProfileSkills, setNonRelevantProfileSkills] = useState<Skill[]>([]);

  // Prepare skill data when props change
  useEffect(() => {
    const relevant: Skill[] = [];
    const nonRelevant: Skill[] = [];

    profileSkills.forEach(skill => {
      if (relevantSkills.includes(skill.name)) {
        relevant.push(skill);
      } else {
        nonRelevant.push(skill);
      }
    });

    setRelevantProfileSkills(relevant);
    setNonRelevantProfileSkills(nonRelevant);
  }, [profileSkills, relevantSkills]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          Skill Management
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 ml-2 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Add missing skills or remove non-relevant skills to tailor your resume for this job.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="add">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="add">Add Skills</TabsTrigger>
            <TabsTrigger value="remove">Remove Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                Missing Skills from Job Description
              </h4>
              <div className="flex flex-wrap gap-2">
                {missingSkills.length > 0 ? (
                  missingSkills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      className={`cursor-pointer ${
                        skillsToAdd.includes(skill) 
                          ? "bg-blue-600 hover:bg-blue-700" 
                          : "bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-800"
                      }`}
                      onClick={() => onToggleSkillToAdd(skill)}
                    >
                      {skill}
                      {skillsToAdd.includes(skill) ? (
                        <Check className="ml-1 h-3 w-3" />
                      ) : (
                        <Plus className="ml-1 h-3 w-3" />
                      )}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No missing skills detected.</p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="remove" className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Relevant Skills (Recommended)
              </h4>
              <div className="flex flex-wrap gap-2">
                {relevantProfileSkills.length > 0 ? (
                  relevantProfileSkills.map((skill) => (
                    <Badge 
                      key={skill.id} 
                      className={`bg-green-100 text-green-800 ${
                        skillsToRemove.includes(skill.id) 
                          ? "line-through opacity-50 hover:bg-red-100 hover:text-red-800" 
                          : ""
                      }`}
                      onClick={() => onToggleSkillToRemove(skill.id)}
                    >
                      {skill.name}
                      {skillsToRemove.includes(skill.id) && (
                        <X className="ml-1 h-3 w-3" />
                      )}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No relevant skills found.</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-gray-500" />
                Non-Relevant Skills (Consider Removing)
              </h4>
              <div className="flex flex-wrap gap-2">
                {nonRelevantProfileSkills.length > 0 ? (
                  nonRelevantProfileSkills.map((skill) => (
                    <Badge 
                      key={skill.id} 
                      className={`cursor-pointer ${
                        skillsToRemove.includes(skill.id) 
                          ? "bg-red-100 text-red-800 line-through" 
                          : "bg-gray-100 text-gray-800 hover:bg-red-50 hover:text-red-700"
                      }`}
                      onClick={() => onToggleSkillToRemove(skill.id)}
                    >
                      {skill.name}
                      {skillsToRemove.includes(skill.id) ? (
                        <X className="ml-1 h-3 w-3" />
                      ) : (
                        <X className="ml-1 h-3 w-3 opacity-50" />
                      )}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No non-relevant skills found.</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Skills to add: {skillsToAdd.length}</span>
            <span className="text-gray-500">Skills to remove: {skillsToRemove.length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillManagement;

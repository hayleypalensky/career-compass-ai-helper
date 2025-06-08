
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Experience } from "@/components/ExperienceForm";
import { formatDate } from "@/utils/resumeFormatters";

interface ExperienceSelectorProps {
  experiences: Experience[];
  selectedExperiences: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

const ExperienceSelector = ({
  experiences,
  selectedExperiences,
  onSelectionChange,
}: ExperienceSelectorProps) => {
  // Enhanced debug logging
  console.log('ExperienceSelector - Received props:');
  console.log('  - experiences:', experiences);
  console.log('  - experiences type:', typeof experiences);
  console.log('  - experiences is array:', Array.isArray(experiences));
  console.log('  - experiences length:', experiences?.length);
  console.log('  - selectedExperiences:', selectedExperiences);
  console.log('  - selectedExperiences type:', typeof selectedExperiences);
  console.log('  - selectedExperiences is array:', Array.isArray(selectedExperiences));
  console.log('  - selectedExperiences length:', selectedExperiences?.length);
  
  const handleExperienceToggle = (experienceId: string, checked: boolean) => {
    console.log('ExperienceSelector - Toggling experience:', experienceId, 'to', checked);
    if (checked) {
      onSelectionChange([...selectedExperiences, experienceId]);
    } else {
      onSelectionChange(selectedExperiences.filter(id => id !== experienceId));
    }
  };

  const handleSelectAll = () => {
    if (selectedExperiences.length === experiences.length) {
      console.log('ExperienceSelector - Deselecting all experiences');
      onSelectionChange([]);
    } else {
      console.log('ExperienceSelector - Selecting all experiences');
      onSelectionChange(experiences.map(exp => exp.id));
    }
  };

  // Check if we have valid data
  if (!Array.isArray(experiences)) {
    console.error('ExperienceSelector - experiences is not an array:', experiences);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Select Experiences to Include</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">Error: Invalid experiences data</div>
        </CardContent>
      </Card>
    );
  }

  if (experiences.length === 0) {
    console.warn('ExperienceSelector - No experiences provided');
    return (
      <Card>
        <CardHeader>
          <CardTitle>Select Experiences to Include</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-500">No experiences found</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Select Experiences to Include</CardTitle>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              checked={selectedExperiences.length === experiences.length}
              onCheckedChange={handleSelectAll}
            />
            <label htmlFor="select-all" className="text-sm font-medium">
              Select All ({selectedExperiences.length}/{experiences.length})
            </label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {experiences.map((experience) => {
            const isSelected = selectedExperiences.includes(experience.id);
            console.log(`ExperienceSelector - Experience ${experience.title} (${experience.id}) selected:`, isSelected);
            
            return (
              <div key={experience.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={experience.id}
                  checked={isSelected}
                  onCheckedChange={(checked) => 
                    handleExperienceToggle(experience.id, checked as boolean)
                  }
                />
                <div className="flex-1">
                  <label htmlFor={experience.id} className="cursor-pointer">
                    <div className="font-medium">{experience.title}</div>
                    <div className="text-sm text-gray-600">{experience.company}</div>
                    <div className="text-xs text-gray-500">
                      {formatDate(experience.startDate)} - {experience.endDate ? formatDate(experience.endDate) : 'Present'}
                    </div>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceSelector;

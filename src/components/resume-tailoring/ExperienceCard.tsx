
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Experience } from "@/components/ExperienceForm";
import { Profile } from "@/types/profile";
import ExperienceBulletPoint from "./ExperienceBulletPoint";
import { PlusCircle, Plus, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateProfileBasedSuggestions, generateJobFocusedSuggestions } from "./BulletSuggestionGenerator";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";

interface ExperienceCardProps {
  experience: Experience;
  expIndex: number;
  onBulletChange: (expIndex: number, bulletIndex: number, value: string) => void;
  onRemoveBullet: (expIndex: number, bulletIndex: number) => void;
  onAddBullet: (expIndex: number) => void;
  onReorderBullets: (expIndex: number, oldIndex: number, newIndex: number) => void;
  generateBulletSuggestions: (expIndex: number, bulletIndex: number) => Promise<string[]>;
  jobDescription: string;
  relevantSkills: string[];
  profile: Profile;
  onSyncToProfile: (experienceId: string, bulletIndex: number | null, newBullet: string) => void;
  onSyncReorderedBullets: (experienceId: string, newBullets: string[]) => void;
}

const ExperienceCard = ({
  experience,
  expIndex,
  onBulletChange,
  onRemoveBullet,
  onAddBullet,
  onReorderBullets,
  generateBulletSuggestions,
  jobDescription,
  relevantSkills,
  profile,
  onSyncToProfile,
  onSyncReorderedBullets,
}: ExperienceCardProps) => {
  const { toast } = useToast();
  const [expandedProfileSuggestions, setExpandedProfileSuggestions] = useState(false);
  const [expandedJobSuggestions, setExpandedJobSuggestions] = useState(false);
  const [loadingProfileSuggestions, setLoadingProfileSuggestions] = useState(false);
  const [loadingJobSuggestions, setLoadingJobSuggestions] = useState(false);
  const [profileSuggestions, setProfileSuggestions] = useState<string[]>([]);
  const [jobSuggestions, setJobSuggestions] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = experience.bullets.findIndex((_, i) => `${expIndex}-${i}` === active.id);
      const newIndex = experience.bullets.findIndex((_, i) => `${expIndex}-${i}` === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        onReorderBullets(expIndex, oldIndex, newIndex);
        
        // Automatically sync the reordered bullets back to the profile
        const newBullets = [...experience.bullets];
        const [removed] = newBullets.splice(oldIndex, 1);
        newBullets.splice(newIndex, 0, removed);
        onSyncReorderedBullets(experience.id, newBullets);
      }
    }
  };

  // Generate profile-based bullet point suggestions
  const generateProfileBasedSuggestionsForExperience = async (): Promise<string[]> => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job description required",
        description: "Please enter a job description to generate AI suggestions.",
        variant: "destructive",
      });
      return [];
    }

    try {
      setLoadingProfileSuggestions(true);
      
      console.log('Generating profile-based bullet suggestions for experience:', experience.title);
      
      const aiSuggestions = await generateProfileBasedSuggestions(
        experience,
        jobDescription,
        relevantSkills
      );
      
      console.log('Received profile-based AI suggestions:', aiSuggestions);
      
      if (aiSuggestions.length === 0) {
        toast({
          title: "No suggestions available",
          description: "Unable to generate profile-based AI suggestions for this experience.",
          variant: "default",
        });
      } else {
        setProfileSuggestions(aiSuggestions);
        setExpandedProfileSuggestions(true);
      }
      
      return aiSuggestions;
    } catch (error) {
      console.error('Error generating profile-based suggestions:', error);
      toast({
        title: "Error generating suggestions",
        description: "There was an error generating profile-based AI suggestions. Please try again.",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoadingProfileSuggestions(false);
    }
  };

  // Generate job-focused bullet point suggestions
  const generateJobFocusedSuggestionsForExperience = async (): Promise<string[]> => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job description required",
        description: "Please enter a job description to generate AI suggestions.",
        variant: "destructive",
      });
      return [];
    }

    try {
      setLoadingJobSuggestions(true);
      
      console.log('Generating job-focused bullet suggestions for experience:', experience.title);
      
      const aiSuggestions = await generateJobFocusedSuggestions(
        experience,
        jobDescription,
        relevantSkills
      );
      
      console.log('Received job-focused AI suggestions:', aiSuggestions);
      
      if (aiSuggestions.length === 0) {
        toast({
          title: "No suggestions available",
          description: "Unable to generate job-focused AI suggestions for this experience.",
          variant: "default",
        });
      } else {
        setJobSuggestions(aiSuggestions);
        setExpandedJobSuggestions(true);
      }
      
      return aiSuggestions;
    } catch (error) {
      console.error('Error generating job-focused suggestions:', error);
      toast({
        title: "Error generating suggestions",
        description: "There was an error generating job-focused AI suggestions. Please try again.",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoadingJobSuggestions(false);
    }
  };

  const handleAddSuggestion = (suggestion: string) => {
    // First add a new bullet point
    onAddBullet(expIndex);
    
    // Then update the last bullet with the suggestion
    setTimeout(() => {
      const newBulletIndex = experience.bullets.length;
      onBulletChange(expIndex, newBulletIndex, suggestion);
      
      toast({
        title: "Bullet point added",
        description: "New AI-generated bullet point has been added to your experience.",
      });
    }, 0);
  };


  return (
    <div className="p-4 border rounded-md space-y-4">
      <div>
        <h3 className="font-semibold text-lg">{experience.title}</h3>
        <p className="text-navy-600">{experience.company}</p>
      </div>
      
      <div className="space-y-2">
        <Label>Bullet Points</Label>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        >
          <SortableContext
            items={experience.bullets.map((_, i) => `${expIndex}-${i}`)}
            strategy={verticalListSortingStrategy}
          >
            {experience.bullets.map((bullet, bulletIndex) => (
              <ExperienceBulletPoint
                key={`${expIndex}-${bulletIndex}`}
                id={`${expIndex}-${bulletIndex}`}
                bullet={bullet}
                bulletIndex={bulletIndex}
                expIndex={expIndex}
                onBulletChange={onBulletChange}
                onRemoveBullet={onRemoveBullet}
                generateSuggestions={generateBulletSuggestions}
                jobDescription={jobDescription}
                totalBullets={experience.bullets.length}
                profile={profile}
                onSyncToProfile={onSyncToProfile}
              />
            ))}
          </SortableContext>
        </DndContext>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddBullet(expIndex)}
          >
            Add Bullet Point
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={generateProfileBasedSuggestionsForExperience}
            className="flex items-center gap-1"
            disabled={loadingProfileSuggestions}
          >
            <PlusCircle className="h-4 w-4" />
            {loadingProfileSuggestions ? 'Generating...' : 'Generate Based on My Profile'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={generateJobFocusedSuggestionsForExperience}
            className="flex items-center gap-1"
            disabled={loadingJobSuggestions}
          >
            <PlusCircle className="h-4 w-4" />
            {loadingJobSuggestions ? 'Generating...' : 'Generate Based on Job Description'}
          </Button>
        </div>

        {/* Profile-based AI suggestions */}
        {expandedProfileSuggestions && profileSuggestions.length > 0 && (
          <div className="mt-3 p-3 bg-green-50 rounded-md border border-green-200">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-green-800">
                AI-Generated bullet points based on your profile:
              </h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setExpandedProfileSuggestions(false)}
                className="h-7 text-xs flex items-center gap-1 text-green-600"
              >
                Hide
              </Button>
            </div>
            <div className="space-y-2">
              {profileSuggestions.map((suggestion, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs whitespace-nowrap"
                    onClick={() => handleAddSuggestion(suggestion)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                  <p className="text-sm">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Job-focused AI suggestions */}
        {expandedJobSuggestions && jobSuggestions.length > 0 && (
          <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-blue-800">
                AI-Generated bullet points based on job description:
              </h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setExpandedJobSuggestions(false)}
                className="h-7 text-xs flex items-center gap-1 text-blue-600"
              >
                Hide
              </Button>
            </div>
            <div className="space-y-2">
              {jobSuggestions.map((suggestion, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs whitespace-nowrap"
                    onClick={() => handleAddSuggestion(suggestion)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                  <p className="text-sm">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceCard;

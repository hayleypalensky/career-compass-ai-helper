
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Experience } from "@/components/ExperienceForm";
import { Profile } from "@/types/profile";
import ExperienceBulletPoint from "./ExperienceBulletPoint";
import { PlusCircle, Plus, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateNewBulletSuggestions } from "./BulletSuggestionGenerator";
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
  onSyncBulletRemoval: (experienceId: string, bulletIndex: number) => void;
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
  onSyncBulletRemoval,
}: ExperienceCardProps) => {
  const { toast } = useToast();
  const [expandedSuggestions, setExpandedSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [newSuggestions, setNewSuggestions] = useState<string[]>([]);

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

  // Generate 3 new bullet point suggestions for an experience using AI (job description only)
  const generateNewSuggestionsForExperience = async (): Promise<string[]> => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job description required",
        description: "Please enter a job description to generate AI suggestions.",
        variant: "destructive",
      });
      return [];
    }

    try {
      setLoadingSuggestions(true);
      
      console.log('Generating new bullet suggestions for experience:', experience.title);
      
      // Use the new function that only considers job description
      const aiSuggestions = await generateNewBulletSuggestions(
        experience,
        jobDescription,
        relevantSkills
      );
      
      console.log('Received AI suggestions:', aiSuggestions);
      
      if (aiSuggestions.length === 0) {
        toast({
          title: "No suggestions available",
          description: "Unable to generate AI suggestions for this experience.",
          variant: "default",
        });
      } else {
        setNewSuggestions(aiSuggestions);
      }
      
      return aiSuggestions;
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast({
        title: "Error generating suggestions",
        description: "There was an error generating AI suggestions. Please try again.",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoadingSuggestions(false);
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

  const toggleSuggestions = async () => {
    if (expandedSuggestions) {
      setExpandedSuggestions(false);
    } else {
      setExpandedSuggestions(true);
      
      // Generate suggestions when expanding
      if (!loadingSuggestions) {
        await generateNewSuggestionsForExperience();
      }
    }
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
                onRemoveBullet={(expIdx, bulletIdx) => {
                  onRemoveBullet(expIdx, bulletIdx);
                  // Note: Not syncing bullet removal to profile - only affects tailored resume
                }}
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
            onClick={toggleSuggestions}
            className="flex items-center gap-1"
            disabled={loadingSuggestions}
          >
            <PlusCircle className="h-4 w-4" />
            {loadingSuggestions ? 'Generating AI Suggestions...' : 
             expandedSuggestions ? 'Hide AI Suggestions' : 'Generate AI Suggestions'}
          </Button>
        </div>

        {/* AI-powered suggestions for new bullet points */}
        {expandedSuggestions && (
          <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-blue-800">
                AI-Generated bullet points based on job description:
              </h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={generateNewSuggestionsForExperience}
                disabled={loadingSuggestions}
                className="h-7 text-xs flex items-center gap-1 text-blue-600"
              >
                <RefreshCw className={`h-3 w-3 ${loadingSuggestions ? 'animate-spin' : ''}`} />
                {loadingSuggestions ? "Generating..." : "Regenerate"}
              </Button>
            </div>
            {loadingSuggestions ? (
              <div className="text-sm text-blue-600">Generating suggestions with AI...</div>
            ) : (
              <div className="space-y-2">
                {newSuggestions.length > 0 ? (
                  newSuggestions.map((suggestion, idx) => (
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
                  ))
                ) : (
                  <div className="text-sm text-blue-600">
                    AI suggestions will appear here after generation is complete.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceCard;

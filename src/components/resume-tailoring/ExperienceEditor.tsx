
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Experience } from "@/components/ExperienceForm";
import ExperienceBulletPoint from "./ExperienceBulletPoint";
import { PlusCircle, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { generateNewBulletSuggestions } from "./BulletSuggestionGenerator";

interface ExperienceEditorProps {
  experiences: Experience[];
  onBulletChange: (expIndex: number, bulletIndex: number, value: string) => void;
  onRemoveBullet: (expIndex: number, bulletIndex: number) => void;
  onAddBullet: (expIndex: number) => void;
  generateBulletSuggestions: (expIndex: number, bulletIndex: number) => Promise<string[]>;
  jobDescription?: string;
  relevantSkills: string[];
}

const ExperienceEditor = ({
  experiences,
  onBulletChange,
  onRemoveBullet,
  onAddBullet,
  generateBulletSuggestions,
  jobDescription = "",
  relevantSkills = [],
}: ExperienceEditorProps) => {
  const { toast } = useToast();
  const [expandedSuggestions, setExpandedSuggestions] = useState<number | null>(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState<number | null>(null);
  const [newSuggestions, setNewSuggestions] = useState<{ [key: number]: string[] }>({});

  // Generate 3 new bullet point suggestions for an experience using AI (job description only)
  const generateNewSuggestionsForExperience = async (expIndex: number): Promise<string[]> => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job description required",
        description: "Please enter a job description to generate AI suggestions.",
        variant: "destructive",
      });
      return [];
    }

    try {
      setLoadingSuggestions(expIndex);
      
      console.log('Generating new bullet suggestions for experience:', experiences[expIndex].title);
      
      const currentExperience = experiences[expIndex];
      
      // Use the new function that only considers job description
      const aiSuggestions = await generateNewBulletSuggestions(
        currentExperience,
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
        // Store suggestions in state with experience index as key
        setNewSuggestions(prev => ({
          ...prev,
          [expIndex]: aiSuggestions
        }));
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
      setLoadingSuggestions(null);
    }
  };

  const handleAddSuggestion = (expIndex: number, suggestion: string) => {
    // First add a new bullet point
    onAddBullet(expIndex);
    
    // Then update the last bullet with the suggestion
    setTimeout(() => {
      const newBulletIndex = experiences[expIndex].bullets.length;
      onBulletChange(expIndex, newBulletIndex, suggestion);
      
      toast({
        title: "Bullet point added",
        description: "New AI-generated bullet point has been added to your experience.",
      });
    }, 0);
  };

  const toggleSuggestions = async (expIndex: number) => {
    if (expandedSuggestions === expIndex) {
      setExpandedSuggestions(null);
    } else {
      setExpandedSuggestions(expIndex);
      
      // Generate suggestions when expanding
      if (!loadingSuggestions) {
        await generateNewSuggestionsForExperience(expIndex);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tailor Experience Bullet Points</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {experiences.map((exp, expIndex) => (
            <div key={exp.id} className="p-4 border rounded-md space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{exp.title}</h3>
                <p className="text-navy-600">{exp.company}</p>
              </div>
              
              <div className="space-y-2">
                <Label>Bullet Points</Label>
                {exp.bullets.map((bullet, bulletIndex) => (
                  <ExperienceBulletPoint
                    key={bulletIndex}
                    bullet={bullet}
                    bulletIndex={bulletIndex}
                    expIndex={expIndex}
                    onBulletChange={onBulletChange}
                    onRemoveBullet={onRemoveBullet}
                    generateSuggestions={generateBulletSuggestions}
                    jobDescription={jobDescription}
                  />
                ))}
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
                    onClick={() => toggleSuggestions(expIndex)}
                    className="flex items-center gap-1"
                    disabled={loadingSuggestions === expIndex}
                  >
                    <PlusCircle className="h-4 w-4" />
                    {loadingSuggestions === expIndex ? 'Generating AI Suggestions...' : 
                     expandedSuggestions === expIndex ? 'Hide AI Suggestions' : 'Generate AI Suggestions'}
                  </Button>
                </div>

                {/* AI-powered suggestions for new bullet points */}
                {expandedSuggestions === expIndex && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-blue-800">
                        AI-Generated bullet points based on job description:
                      </h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => generateNewSuggestionsForExperience(expIndex)}
                        disabled={loadingSuggestions === expIndex}
                        className="h-7 text-xs flex items-center gap-1 text-blue-600"
                      >
                        <RefreshCw className={`h-3 w-3 ${loadingSuggestions === expIndex ? 'animate-spin' : ''}`} />
                        {loadingSuggestions === expIndex ? "Generating..." : "Regenerate"}
                      </Button>
                    </div>
                    {loadingSuggestions === expIndex ? (
                      <div className="text-sm text-blue-600">Generating suggestions with AI...</div>
                    ) : (
                      <div className="space-y-2">
                        {newSuggestions[expIndex] && newSuggestions[expIndex].length > 0 ? (
                          newSuggestions[expIndex].map((suggestion, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-xs whitespace-nowrap"
                                onClick={() => handleAddSuggestion(expIndex, suggestion)}
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceEditor;

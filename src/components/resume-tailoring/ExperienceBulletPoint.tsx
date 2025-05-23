
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X, MessageSquare, Pencil, RotateCw, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ExperienceBulletPointProps {
  bullet: string;
  bulletIndex: number;
  expIndex: number;
  onBulletChange: (expIndex: number, bulletIndex: number, value: string) => void;
  onRemoveBullet: (expIndex: number, bulletIndex: number) => void;
  generateSuggestions: (expIndex: number, bulletIndex: number) => Promise<string[]>;
  jobDescription?: string;
}

const ExperienceBulletPoint = ({
  bullet,
  bulletIndex,
  expIndex,
  onBulletChange,
  onRemoveBullet,
  generateSuggestions,
  jobDescription = "",
}: ExperienceBulletPointProps) => {
  const { toast } = useToast();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleSuggestions = async () => {
    if (!showSuggestions) {
      if (!jobDescription.trim()) {
        toast({
          title: "Job description required",
          description: "Please enter a job description to generate AI suggestions.",
          variant: "destructive",
        });
        return;
      }

      if (!bullet.trim()) {
        toast({
          title: "Bullet point required",
          description: "Please enter some content for this bullet point first.",
          variant: "destructive",
        });
        return;
      }

      setIsGenerating(true);
      try {
        const aiSuggestions = await generateSuggestions(expIndex, bulletIndex);
        setSuggestions(aiSuggestions);
        setShowSuggestions(true);
        
        if (aiSuggestions.length === 0) {
          toast({
            title: "No suggestions available",
            description: "Unable to generate suggestions for this bullet point.",
            variant: "default",
          });
        }
      } catch (error) {
        toast({
          title: "Error generating suggestions",
          description: "There was an error generating AI suggestions. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsGenerating(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const applySuggestion = (suggestion: string) => {
    onBulletChange(expIndex, bulletIndex, suggestion);
    setShowSuggestions(false);
    
    toast({
      title: "Suggestion applied",
      description: "The bullet point has been updated with the AI-generated content.",
    });
  };

  const replaceBullet = (suggestion: string) => {
    onBulletChange(expIndex, bulletIndex, suggestion);
    setShowSuggestions(false);
    
    toast({
      title: "Bullet point replaced",
      description: "Your bullet point has been replaced with the AI-generated content.",
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Textarea
          value={bullet}
          onChange={(e) => onBulletChange(expIndex, bulletIndex, e.target.value)}
          rows={2}
          className="flex-1"
        />
        <div className="flex flex-col gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSuggestions}
            disabled={isGenerating}
            title={isGenerating ? "Generating AI suggestions..." : "Get AI suggestions"}
          >
            <div className="relative">
              <MessageSquare className={`h-4 w-4 ${isGenerating ? 'animate-pulse' : ''}`} />
              <Pencil className="h-3 w-3 absolute -bottom-1 -right-1" />
            </div>
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onRemoveBullet(expIndex, bulletIndex)}
            title="Remove bullet point"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* AI Suggestions panel */}
      {showSuggestions && (
        <div className="ml-2 bg-slate-50 p-3 rounded-md border border-slate-200">
          <h4 className="text-sm font-medium mb-2">AI-Generated suggestions to improve ATS matching:</h4>
          <div className="space-y-2">
            {suggestions.length > 0 ? (
              suggestions.map((suggestion, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs h-auto py-1 px-2"
                      onClick={() => replaceBullet(suggestion)}
                      title="Replace existing bullet with this AI suggestion"
                    >
                      <RotateCw className="h-3 w-3 mr-1" />
                      Replace
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-xs h-auto py-1 px-2"
                      onClick={() => applySuggestion(suggestion)}
                      title="Use this AI suggestion"
                    >
                      Use
                    </Button>
                  </div>
                  <p className="text-sm">{suggestion}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No AI suggestions available for this bullet point.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceBulletPoint;

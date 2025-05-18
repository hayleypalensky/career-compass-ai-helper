
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
  generateSuggestions: (expIndex: number, bulletIndex: number) => string[];
  jobDescription?: string; // Add job description prop
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

  const toggleSuggestions = () => {
    setShowSuggestions(!showSuggestions);
  };

  const applySuggestion = (suggestion: string) => {
    onBulletChange(expIndex, bulletIndex, suggestion);
    setShowSuggestions(false);
    
    toast({
      title: "Suggestion applied",
      description: "The bullet point has been updated with the suggested content.",
    });
  };

  const replaceBullet = (suggestion: string) => {
    onBulletChange(expIndex, bulletIndex, suggestion);
    setShowSuggestions(false);
    
    toast({
      title: "Bullet point replaced",
      description: "Your bullet point has been replaced with the suggested content.",
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
            title="Get suggestions"
          >
            <div className="relative">
              <MessageSquare className="h-4 w-4" />
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
      
      {/* Suggestions panel */}
      {showSuggestions && (
        <div className="ml-2 bg-slate-50 p-3 rounded-md border border-slate-200">
          <h4 className="text-sm font-medium mb-2">Suggestions to improve ATS matching:</h4>
          <div className="space-y-2">
            {generateSuggestions(expIndex, bulletIndex).map((suggestion, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs h-auto py-1 px-2"
                    onClick={() => replaceBullet(suggestion)}
                    title="Replace existing bullet with this suggestion"
                  >
                    <RotateCw className="h-3 w-3 mr-1" />
                    Replace
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-xs h-auto py-1 px-2"
                    onClick={() => applySuggestion(suggestion)}
                    title="Use this suggestion (keeps your edits)"
                  >
                    Use
                  </Button>
                </div>
                <p className="text-sm">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceBulletPoint;

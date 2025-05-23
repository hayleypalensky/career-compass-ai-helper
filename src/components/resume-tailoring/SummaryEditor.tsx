
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, CheckCircle2, RotateCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { aiService } from "@/services/aiService";

interface SummaryEditorProps {
  currentSummary: string;
  jobDescription: string;
  relevantSkills: string[];
  onSummaryChange: (summary: string) => void;
}

const SummaryEditor = ({
  currentSummary,
  jobDescription,
  relevantSkills,
  onSummaryChange,
}: SummaryEditorProps) => {
  const [editedSummary, setEditedSummary] = useState(currentSummary);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Generate summary suggestions using AI service
  const generateSummarySuggestions = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job description required",
        description: "Please enter a job description to generate AI suggestions.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const aiSuggestions = await aiService.generateSummary(
        currentSummary,
        jobDescription,
        relevantSkills
      );
      
      setSuggestions(aiSuggestions);
      
      toast({
        title: "AI suggestions generated",
        description: "Choose one of the AI-generated summaries or continue editing your own.",
      });
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      toast({
        title: "Error generating suggestions",
        description: "There was an error generating AI summary suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Apply a suggestion to the editor
  const applySuggestion = (suggestion: string) => {
    setEditedSummary(suggestion);
    onSummaryChange(suggestion);
    
    toast({
      title: "Summary updated",
      description: "The AI-generated summary has been applied.",
    });
  };

  // Handle manual edits to the summary
  const handleSummaryEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedSummary(e.target.value);
    onSummaryChange(e.target.value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Professional Summary</span>
          <Button
            variant="outline"
            size="sm"
            onClick={generateSummarySuggestions}
            disabled={isGenerating || !jobDescription}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? "Generating with AI..." : suggestions.length > 0 ? "Regenerate Suggestions" : "Generate AI Suggestions"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Textarea
              placeholder="Enter your professional summary"
              value={editedSummary}
              onChange={handleSummaryEdit}
              className="h-24"
            />
          </div>

          {suggestions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">AI-Generated Summaries:</h3>
              {suggestions.map((suggestion, index) => (
                <div key={index} className="p-3 bg-slate-50 border rounded-md">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm">{suggestion}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => applySuggestion(suggestion)}
                      className="shrink-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="sr-only">Use this summary</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!jobDescription && (
            <p className="text-sm text-amber-600">
              Enter a job description in the analyzer above to generate AI-powered summary suggestions.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryEditor;

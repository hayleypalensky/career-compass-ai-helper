
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Profile } from "@/types/profile";

interface JobDescriptionAnalyzerProps {
  profile: Profile;
  onAnalysisComplete: (relevantSkills: string[], missingSkills: string[]) => void;
}

const JobDescriptionAnalyzer = ({
  profile,
  onAnalysisComplete,
}: JobDescriptionAnalyzerProps) => {
  const { toast } = useToast();
  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  // Simple analysis function that extracts potential skill keywords
  const analyzeJobDescription = () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Empty job description",
        description: "Please enter a job description to analyze.",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);

    try {
      // In a real app, this would be a more sophisticated algorithm or API call
      setTimeout(() => {
        // Convert description to lowercase for case-insensitive matching
        const descriptionLower = jobDescription.toLowerCase();
        
        // Get all skills from user profile and convert to lowercase
        const userSkills = profile.skills.map(skill => skill.name.toLowerCase());
        
        // Extract common keywords from the job description
        // This is a very simple implementation - in a real app, you'd use NLP or a more sophisticated analysis
        const commonSkillKeywords = [
          "javascript", "typescript", "react", "vue", "angular", "node", "python", 
          "java", "c#", "php", "ruby", "swift", "kotlin", "flutter", "react native",
          "aws", "azure", "gcp", "docker", "kubernetes", "git", "ci/cd", "agile",
          "scrum", "product management", "project management", "leadership",
          "communication", "problem solving", "analytical", "data analysis",
          "machine learning", "ai", "sql", "nosql", "mongodb", "postgresql",
          "mysql", "firebase", "figma", "sketch", "adobe", "ui/ux", "design",
          "marketing", "seo", "content", "social media", "paid advertising", 
          "customer service", "sales", "negotiation", "teamwork", "collaboration"
        ];
        
        // Find skills in job description
        const foundSkills = commonSkillKeywords.filter(skill => 
          descriptionLower.includes(skill)
        );
        
        // Separate into skills the user has and skills they're missing
        const relevantSkills = foundSkills.filter(skill => 
          userSkills.some(userSkill => userSkill.includes(skill) || skill.includes(userSkill))
        );
        
        const missingSkills = foundSkills.filter(skill => 
          !userSkills.some(userSkill => userSkill.includes(skill) || skill.includes(userSkill))
        );
        
        // Pass the results to the parent component
        onAnalysisComplete(relevantSkills, missingSkills);
        
        toast({
          title: "Analysis complete",
          description: "We've analyzed the job description and identified relevant and missing skills.",
        });
        
        setAnalyzing(false);
      }, 1500); // Simulate processing time
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "An error occurred while analyzing the job description.",
        variant: "destructive",
      });
      setAnalyzing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyze Job Description</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={10}
            className="resize-none"
          />
          
          <Button 
            onClick={analyzeJobDescription}
            disabled={analyzing || !jobDescription.trim()}
            className="w-full bg-navy-600 hover:bg-navy-700"
          >
            {analyzing ? "Analyzing..." : "Analyze Description"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobDescriptionAnalyzer;

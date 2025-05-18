
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Profile } from "@/types/profile";

interface JobDescriptionAnalyzerProps {
  profile: Profile;
  onAnalysisComplete: (
    relevantSkills: string[],
    missingSkills: string[],
    jobInfo: { title?: string; company?: string; description?: string }
  ) => void;
}

const JobDescriptionAnalyzer = ({ profile, onAnalysisComplete }: JobDescriptionAnalyzerProps) => {
  const { toast } = useToast();
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeJobDescription = () => {
    if (!jobDescription) {
      toast({
        title: "No job description",
        description: "Please enter a job description to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    // Extract skills mentioned in the job description
    // This is a basic implementation that looks for skills in the user's profile
    setTimeout(() => {
      try {
        // Convert job description and skills to lowercase for case-insensitive matching
        const lowercaseDescription = jobDescription.toLowerCase();
        
        // Find skills from the user's profile that are mentioned in the job description
        const userSkills = profile.skills.map(skill => skill.name.toLowerCase());
        const relevantSkills = profile.skills
          .filter(skill => lowercaseDescription.includes(skill.name.toLowerCase()))
          .map(skill => skill.name);

        // Find skills in the job description that aren't in the user's profile
        // This is a simplified approach - in a real app, you'd use NLP or a skills database
        const commonSkills = [
          "javascript", "typescript", "react", "angular", "vue", "node", "express",
          "python", "java", "c#", ".net", "php", "ruby", "go", "rust", "swift",
          "kubernetes", "docker", "aws", "azure", "gcp", "sql", "nosql", "mongodb",
          "postgresql", "mysql", "redis", "graphql", "rest", "api", "ci/cd", "git",
          "agile", "scrum", "leadership", "communication", "problem-solving", "teamwork"
        ];
        
        const missingSkills = commonSkills.filter(skill => 
          lowercaseDescription.includes(skill) && !userSkills.includes(skill)
        );

        // Pass the results back to the parent component
        onAnalysisComplete(
          relevantSkills, 
          missingSkills,
          { 
            title: jobTitle, 
            company: companyName,
            description: jobDescription 
          }
        );
        
        toast({
          title: "Analysis complete",
          description: `Found ${relevantSkills.length} matching skills and ${missingSkills.length} potential skill gaps.`,
        });
      } catch (error) {
        console.error("Error analyzing job description:", error);
        toast({
          title: "Analysis failed",
          description: "There was an error analyzing the job description.",
          variant: "destructive",
        });
      } finally {
        setIsAnalyzing(false);
      }
    }, 1000); // Simulating analysis time
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Description Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              placeholder="e.g., Software Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              placeholder="e.g., Acme Inc."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="jobDescription">Paste Job Description</Label>
          <Textarea
            id="jobDescription"
            placeholder="Paste the full job description here..."
            rows={8}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
        
        <Button
          onClick={analyzeJobDescription}
          disabled={isAnalyzing || !jobDescription.trim()}
          className="w-full"
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Job Description"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default JobDescriptionAnalyzer;

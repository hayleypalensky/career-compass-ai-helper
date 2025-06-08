
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Profile } from "@/types/profile";

// Import refactored components
import JobForm from "./JobForm";
import { analyzeJobDescription } from "./SkillAnalyzer";

interface JobDescriptionAnalyzerProps {
  profile: Profile;
  onAnalysisComplete: (
    relevantSkills: string[],
    missingSkills: string[],
    jobInfo: { title?: string; company?: string; location?: string; remote?: boolean; description?: string }
  ) => void;
}

const JobDescriptionAnalyzer = ({ profile, onAnalysisComplete }: JobDescriptionAnalyzerProps) => {
  const { toast } = useToast();
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [remote, setRemote] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!jobDescription) {
      toast({
        title: "No job description",
        description: "Please enter a job description to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    // Simulate processing time
    setTimeout(() => {
      try {
        // Use the skill analyzer utility
        const { relevantSkills, missingSkills } = analyzeJobDescription(jobDescription, profile);

        // Pass the results back to the parent component
        onAnalysisComplete(
          relevantSkills, 
          missingSkills,
          { 
            title: jobTitle, 
            company: companyName,
            location: location,
            remote: remote,
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
      <CardContent>
        <JobForm 
          jobTitle={jobTitle}
          companyName={companyName}
          location={location}
          remote={remote}
          jobDescription={jobDescription}
          isAnalyzing={isAnalyzing}
          onJobTitleChange={setJobTitle}
          onCompanyNameChange={setCompanyName}
          onLocationChange={setLocation}
          onRemoteChange={setRemote}
          onJobDescriptionChange={setJobDescription}
          onSubmit={handleAnalyze}
        />
      </CardContent>
    </Card>
  );
};

export default JobDescriptionAnalyzer;

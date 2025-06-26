
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Profile } from "@/types/profile";

// Import refactored components
import JobForm from "./JobForm";
import { analyzeJobDescription } from "./SkillAnalyzer";

interface JobDescriptionAnalyzerProps {
  profile: Profile;
  autoAddJobs: boolean;
  onAutoAddJobsChange: (value: boolean) => void;
  onAnalysisComplete: (
    relevantSkills: string[],
    missingSkills: string[],
    jobInfo: { title?: string; company?: string; location?: string; remote?: boolean; description?: string; notes?: string }
  ) => void;
  resetTrigger?: boolean;
}

const JobDescriptionAnalyzer = ({ 
  profile, 
  autoAddJobs, 
  onAutoAddJobsChange, 
  onAnalysisComplete, 
  resetTrigger 
}: JobDescriptionAnalyzerProps) => {
  const { toast } = useToast();
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [remote, setRemote] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Reset form fields when resetTrigger changes
  useEffect(() => {
    if (resetTrigger) {
      setJobTitle("");
      setCompanyName("");
      setLocation("");
      setRemote(false);
      setJobDescription("");
      setNotes("");
    }
  }, [resetTrigger]);

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
            description: jobDescription,
            notes: notes 
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
          notes={notes}
          isAnalyzing={isAnalyzing}
          autoAddJobs={autoAddJobs}
          onJobTitleChange={setJobTitle}
          onCompanyNameChange={setCompanyName}
          onLocationChange={setLocation}
          onRemoteChange={setRemote}
          onJobDescriptionChange={setJobDescription}
          onNotesChange={setNotes}
          onAutoAddJobsChange={onAutoAddJobsChange}
          onSubmit={handleAnalyze}
        />
      </CardContent>
    </Card>
  );
};

export default JobDescriptionAnalyzer;

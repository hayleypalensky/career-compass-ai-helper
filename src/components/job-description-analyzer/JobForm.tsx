
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface JobFormProps {
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  isAnalyzing: boolean;
  onJobTitleChange: (value: string) => void;
  onCompanyNameChange: (value: string) => void;
  onJobDescriptionChange: (value: string) => void;
  onSubmit: () => void;
}

const JobForm = ({
  jobTitle,
  companyName,
  jobDescription,
  isAnalyzing,
  onJobTitleChange,
  onCompanyNameChange,
  onJobDescriptionChange,
  onSubmit
}: JobFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input
            id="jobTitle"
            placeholder="e.g., Software Engineer"
            value={jobTitle}
            onChange={(e) => onJobTitleChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            placeholder="e.g., Acme Inc."
            value={companyName}
            onChange={(e) => onCompanyNameChange(e.target.value)}
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
          onChange={(e) => onJobDescriptionChange(e.target.value)}
        />
      </div>
      
      <Button
        onClick={onSubmit}
        disabled={isAnalyzing || !jobDescription.trim()}
        className="w-full"
      >
        {isAnalyzing ? "Analyzing..." : "Analyze Job Description"}
      </Button>
    </div>
  );
};

export default JobForm;

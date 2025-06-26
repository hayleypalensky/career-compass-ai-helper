
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface JobFormProps {
  jobTitle: string;
  companyName: string;
  location: string;
  remote: boolean;
  jobDescription: string;
  notes: string;
  isAnalyzing: boolean;
  autoAddJobs: boolean;
  onJobTitleChange: (value: string) => void;
  onCompanyNameChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onRemoteChange: (value: boolean) => void;
  onJobDescriptionChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onAutoAddJobsChange: (value: boolean) => void;
  onSubmit: () => void;
}

const JobForm = ({
  jobTitle,
  companyName,
  location,
  remote,
  jobDescription,
  notes,
  isAnalyzing,
  autoAddJobs,
  onJobTitleChange,
  onCompanyNameChange,
  onLocationChange,
  onRemoteChange,
  onJobDescriptionChange,
  onNotesChange,
  onAutoAddJobsChange,
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="e.g., San Francisco, CA"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="remote"
              checked={remote}
              onCheckedChange={onRemoteChange}
            />
            <Label htmlFor="remote">Remote Position</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-add-jobs"
              checked={autoAddJobs}
              onCheckedChange={onAutoAddJobsChange}
            />
            <div className="space-y-0.5">
              <Label htmlFor="auto-add-jobs" className="text-sm font-medium">
                Auto-add to Job Tracker
              </Label>
              <p className="text-xs text-gray-500">
                Automatically add this job to your tracker after analysis
              </p>
            </div>
          </div>
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

      {autoAddJobs && (
        <div className="space-y-2">
          <Label htmlFor="notes">Notes (will be added to job tracker)</Label>
          <Textarea
            id="notes"
            placeholder="Add any notes about this job application..."
            rows={3}
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
          />
        </div>
      )}
      
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

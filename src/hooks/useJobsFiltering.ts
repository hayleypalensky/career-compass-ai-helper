
import { useState, useMemo } from "react";
import { Job, JobStatus } from "@/types/job";

export const useJobsFiltering = (jobs: Job[], defaultActiveTab: JobStatus = "applied") => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<JobStatus>(defaultActiveTab);

  // Filter jobs based on search term only
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      return (
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [jobs, searchTerm]);

  // Sort jobs by creation order (newest first) - using updatedAt as proxy for creation time
  const sortedJobs = useMemo(() => {
    return [...filteredJobs].sort((a, b) => {
      // Sort by updatedAt (which reflects when jobs were created/modified), newest first
      const aTime = new Date(a.updatedAt || a.appliedDate).getTime();
      const bTime = new Date(b.updatedAt || b.appliedDate).getTime();
      
      return bTime - aTime;
    });
  }, [filteredJobs]);

  return {
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    filteredJobs: sortedJobs,
  };
};

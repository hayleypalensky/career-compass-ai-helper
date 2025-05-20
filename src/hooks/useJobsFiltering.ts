
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

  // Sort jobs by application date (newest first), then by creation order (using ID)
  const sortedJobs = useMemo(() => {
    return [...filteredJobs].sort((a, b) => {
      // First sort by date (newest first)
      const dateComparison = new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
      
      // If dates are the same, sort by ID (which reflects the order of creation)
      if (dateComparison === 0) {
        return a.id.localeCompare(b.id);
      }
      
      return dateComparison;
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


import { useState, useMemo } from "react";
import { Job, JobStatus } from "@/types/job";

export const useJobsFiltering = (jobs: Job[], defaultActiveTab: JobStatus = "applied") => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<JobStatus>(defaultActiveTab);

  const triggerSearch = () => {
    setActiveSearchTerm(searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setActiveSearchTerm("");
  };

  // Filter jobs based on active search term only
  const filteredJobs = useMemo(() => {
    if (!activeSearchTerm.trim()) {
      return jobs;
    }
    
    return jobs.filter((job) => {
      return (
        job.title.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
        job.notes?.toLowerCase().includes(activeSearchTerm.toLowerCase())
      );
    });
  }, [jobs, activeSearchTerm]);

  // Sort jobs by relevance when searching, otherwise by creation order
  const sortedJobs = useMemo(() => {
    if (!activeSearchTerm.trim()) {
      // No search term - sort by creation order (newest first)
      return [...filteredJobs].sort((a, b) => {
        const aTime = new Date(a.updatedAt || a.appliedDate).getTime();
        const bTime = new Date(b.updatedAt || b.appliedDate).getTime();
        return bTime - aTime;
      });
    }

    // Active search - sort by relevance
    const searchLower = activeSearchTerm.toLowerCase();
    
    return [...filteredJobs].sort((a, b) => {
      // Calculate relevance scores
      let scoreA = 0;
      let scoreB = 0;

      // Company name matches get highest priority (10 points)
      if (a.company.toLowerCase().includes(searchLower)) scoreA += 10;
      if (b.company.toLowerCase().includes(searchLower)) scoreB += 10;

      // Exact company name matches get even higher priority (20 points)
      if (a.company.toLowerCase() === searchLower) scoreA += 20;
      if (b.company.toLowerCase() === searchLower) scoreB += 20;

      // Job title matches get high priority (8 points)
      if (a.title.toLowerCase().includes(searchLower)) scoreA += 8;
      if (b.title.toLowerCase().includes(searchLower)) scoreB += 8;

      // Description matches get medium priority (3 points)
      if (a.description?.toLowerCase().includes(searchLower)) scoreA += 3;
      if (b.description?.toLowerCase().includes(searchLower)) scoreB += 3;

      // Notes matches get low priority (1 point)
      if (a.notes?.toLowerCase().includes(searchLower)) scoreA += 1;
      if (b.notes?.toLowerCase().includes(searchLower)) scoreB += 1;

      // Sort by relevance score (highest first), then by date if scores are equal
      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }

      // If relevance scores are equal, sort by date (newest first)
      const aTime = new Date(a.updatedAt || a.appliedDate).getTime();
      const bTime = new Date(b.updatedAt || b.appliedDate).getTime();
      return bTime - aTime;
    });
  }, [filteredJobs, activeSearchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    filteredJobs: sortedJobs,
    triggerSearch,
    clearSearch,
    hasActiveSearch: activeSearchTerm.trim().length > 0,
  };
};

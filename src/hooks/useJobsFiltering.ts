
import { useState, useMemo } from "react";
import { Job } from "@/types/job";

export const useJobsFiltering = (jobs: Job[], defaultActiveTab: string = "active") => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  // Filter jobs based on search term and active tab
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTab =
        activeTab === "active"
          ? job.status !== "archived"
          : job.status === "archived";
      
      return matchesSearch && matchesTab;
    });
  }, [jobs, searchTerm, activeTab]);

  // Sort jobs by application date (newest first)
  const sortedJobs = useMemo(() => {
    return [...filteredJobs].sort(
      (a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
    );
  }, [filteredJobs]);

  // Group jobs by status for active jobs
  const groupedActiveJobs = useMemo(() => {
    return sortedJobs.reduce(
      (groups, job) => {
        if (job.status !== "archived") {
          if (!groups[job.status]) {
            groups[job.status] = [];
          }
          groups[job.status].push(job);
        }
        return groups;
      },
      {} as Record<string, Job[]>
    );
  }, [sortedJobs]);

  return {
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    filteredJobs,
    sortedJobs,
    groupedActiveJobs,
  };
};

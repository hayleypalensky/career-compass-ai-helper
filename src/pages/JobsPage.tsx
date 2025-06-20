
import { useState, useEffect } from "react";
import { Tabs } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";

// Import our components
import JobsHeader from "@/components/jobs/JobsHeader";
import { useJobManagement } from "@/hooks/useJobManagement";
import { useJobsFiltering } from "@/hooks/useJobsFiltering";
import { useJobTrackerSettings } from "@/hooks/useJobTrackerSettings";
import { JobStatus } from "@/types/job";
import JobStatusCounts from "@/components/jobs/JobStatusCounts";
import JobSearchBar from "@/components/jobs/JobSearchBar";
import JobTabsContent from "@/components/jobs/JobTabsContent";
import JobsLoading from "@/components/jobs/JobsLoading";
import SearchResultsView from "@/components/jobs/SearchResultsView";
import JobTrackerSettings from "@/components/jobs/JobTrackerSettings";

const JobsPage = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showSettings, setShowSettings] = useState(false);
  
  // Get job management methods from our custom hook
  const { 
    jobs, 
    loading, 
    loadJobs, 
    addJob, 
    updateJob, 
    archiveJob, 
    deleteJob 
  } = useJobManagement({ user });
  
  // Get job filtering methods and data from our custom hook
  const {
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    filteredJobs,
    triggerSearch,
    clearSearch,
    hasActiveSearch
  } = useJobsFiltering(jobs, "applied");

  // Get job tracker settings
  const { autoAddJobs, toggleAutoAddJobs } = useJobTrackerSettings();
  
  // Load view preference from localStorage
  useEffect(() => {
    const savedViewMode = localStorage.getItem("jobsViewMode") as "list" | "grid" | null;
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, []);

  // Save view preference to localStorage
  useEffect(() => {
    localStorage.setItem("jobsViewMode", viewMode);
  }, [viewMode]);
  
  // Load jobs from Supabase
  useEffect(() => {
    loadJobs();
  }, [user]);

  if (loading) {
    return <JobsLoading />;
  }

  // Filter jobs based on the current tab from the already filtered/sorted jobs
  const tabJobs = filteredJobs.filter(job => job.status === activeTab);
  
  // Count jobs in each status category from the filtered results
  const statusCounts = {
    applied: filteredJobs.filter(job => job.status === "applied").length,
    interviewing: filteredJobs.filter(job => job.status === "interviewing").length,
    offered: filteredJobs.filter(job => job.status === "offered").length,
    rejected: filteredJobs.filter(job => job.status === "rejected").length,
    archived: filteredJobs.filter(job => job.status === "archived").length
  };

  const hasSearchResults = filteredJobs.length > 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1>Job Applications Tracker</h1>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {showSettings ? "Hide Settings" : "Settings"}
        </button>
      </div>

      {showSettings && (
        <JobTrackerSettings
          autoAddJobs={autoAddJobs}
          onToggleAutoAdd={toggleAutoAddJobs}
        />
      )}
      
      <div className="flex flex-col space-y-8">
        {/* Jobs header with add button and view toggle */}
        <JobsHeader 
          onAddJob={addJob} 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
        />
        
        {hasActiveSearch && hasSearchResults ? (
          // Show search results grouped by status
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-xl font-semibold">
                Search Results for "{searchTerm}" ({filteredJobs.length} found)
              </h2>
              <JobSearchBar 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSearch={triggerSearch}
                onClear={clearSearch}
                hasActiveSearch={hasActiveSearch}
              />
            </div>
            
            <SearchResultsView
              filteredJobs={filteredJobs}
              viewMode={viewMode}
              onUpdate={updateJob}
              onArchive={archiveJob}
              onDelete={deleteJob}
            />
          </div>
        ) : hasActiveSearch && !hasSearchResults ? (
          // Show no results message
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-xl font-semibold">
                No results found for "{searchTerm}"
              </h2>
              <JobSearchBar 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSearch={triggerSearch}
                onClear={clearSearch}
                hasActiveSearch={hasActiveSearch}
              />
            </div>
            <div className="text-center py-12">
              <p className="text-gray-500">No job applications match your search.</p>
              <p className="text-gray-400">Try adjusting your search terms.</p>
            </div>
          </div>
        ) : (
          // Show normal tabbed view when no search
          <Tabs 
            defaultValue="applied" 
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as JobStatus)}
            className="w-full"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <JobStatusCounts 
                statusCounts={statusCounts}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
              
              <JobSearchBar 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSearch={triggerSearch}
                onClear={clearSearch}
                hasActiveSearch={hasActiveSearch}
              />
            </div>
            
            <JobTabsContent 
              tabJobs={tabJobs}
              viewMode={viewMode}
              onUpdate={updateJob}
              onArchive={archiveJob}
              onDelete={deleteJob}
            />
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default JobsPage;

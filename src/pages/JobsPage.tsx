
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";

// Import our components
import JobsHeader from "@/components/jobs/JobsHeader";
import StatusJobsTab from "@/components/jobs/StatusJobsTab";
import { useJobManagement } from "@/hooks/useJobManagement";
import { useJobsFiltering } from "@/hooks/useJobsFiltering";
import { JobStatus } from "@/types/job";

const JobsPage = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  
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
    filteredJobs // This already contains the sorted jobs (newest first)
  } = useJobsFiltering(jobs, "applied"); // Default to "applied" tab
  
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
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy-600"></div>
      </div>
    );
  }

  // Filter jobs based on the current tab
  const tabJobs = filteredJobs.filter(job => job.status === activeTab);
  
  // Count jobs in each status category
  const statusCounts = {
    applied: filteredJobs.filter(job => job.status === "applied").length,
    interviewing: filteredJobs.filter(job => job.status === "interviewing").length,
    offered: filteredJobs.filter(job => job.status === "offered").length,
    rejected: filteredJobs.filter(job => job.status === "rejected").length,
    archived: filteredJobs.filter(job => job.status === "archived").length
  };

  return (
    <div className="space-y-8">
      <h1>Job Applications Tracker</h1>
      
      <div className="flex flex-col space-y-8">
        {/* Jobs header with add button and view toggle */}
        <JobsHeader 
          onAddJob={addJob} 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
        />
        
        <Tabs 
          defaultValue="applied" 
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as JobStatus)}
          className="w-full"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <TabsList className="flex-wrap">
              <TabsTrigger value="applied">
                Applied
                <Badge variant="secondary" className="ml-2 bg-slate-200">
                  {statusCounts.applied}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="interviewing">
                Interviewing
                <Badge variant="secondary" className="ml-2 bg-slate-200">
                  {statusCounts.interviewing}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="offered">
                Offered
                <Badge variant="secondary" className="ml-2 bg-slate-200">
                  {statusCounts.offered}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected
                <Badge variant="secondary" className="ml-2 bg-slate-200">
                  {statusCounts.rejected}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="archived">
                Archived
                <Badge variant="secondary" className="ml-2 bg-slate-200">
                  {statusCounts.archived}
                </Badge>
              </TabsTrigger>
            </TabsList>
            
            <div className="relative max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <TabsContent value="applied">
            <StatusJobsTab 
              jobs={tabJobs}
              viewMode={viewMode}
              onUpdate={updateJob}
              onArchive={archiveJob}
              onDelete={deleteJob}
              status="applied"
            />
          </TabsContent>
          
          <TabsContent value="interviewing">
            <StatusJobsTab 
              jobs={tabJobs}
              viewMode={viewMode}
              onUpdate={updateJob}
              onArchive={archiveJob}
              onDelete={deleteJob}
              status="interviewing"
            />
          </TabsContent>
          
          <TabsContent value="offered">
            <StatusJobsTab 
              jobs={tabJobs}
              viewMode={viewMode}
              onUpdate={updateJob}
              onArchive={archiveJob}
              onDelete={deleteJob}
              status="offered"
            />
          </TabsContent>
          
          <TabsContent value="rejected">
            <StatusJobsTab 
              jobs={tabJobs}
              viewMode={viewMode}
              onUpdate={updateJob}
              onArchive={archiveJob}
              onDelete={deleteJob}
              status="rejected"
            />
          </TabsContent>
          
          <TabsContent value="archived">
            <StatusJobsTab 
              jobs={tabJobs}
              viewMode={viewMode}
              onUpdate={updateJob}
              onArchive={archiveJob}
              onDelete={deleteJob}
              status="archived"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default JobsPage;

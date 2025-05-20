
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Import our new components
import JobsHeader from "@/components/jobs/JobsHeader";
import ActiveJobsTab from "@/components/jobs/ActiveJobsTab";
import ArchivedJobsTab from "@/components/jobs/ArchivedJobsTab";
import { useJobManagement } from "@/hooks/useJobManagement";
import { useJobsFiltering } from "@/hooks/useJobsFiltering";

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
    sortedJobs,
    groupedActiveJobs
  } = useJobsFiltering(jobs);
  
  // Status groups in specific order
  const statusOrder = ["interviewing", "applied", "offered", "rejected"];

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
          defaultValue="active" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
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
          
          <TabsContent value="active" className="space-y-8">
            <ActiveJobsTab 
              groupedJobs={groupedActiveJobs}
              statusOrder={statusOrder}
              viewMode={viewMode}
              onUpdate={updateJob}
              onArchive={archiveJob}
              onDelete={deleteJob}
            />
          </TabsContent>
          
          <TabsContent value="archived" className="space-y-4">
            <ArchivedJobsTab 
              jobs={sortedJobs}
              viewMode={viewMode}
              onUpdate={updateJob}
              onArchive={archiveJob}
              onDelete={deleteJob}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default JobsPage;

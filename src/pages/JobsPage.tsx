
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, LayoutList, LayoutGrid } from "lucide-react";
import JobCard from "@/components/JobCard";
import { Job } from "@/types/job";
import AddJobDialog from "@/components/AddJobDialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const JobsPage = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>(() => {
    // Try to get jobs from localStorage
    const savedJobs = localStorage.getItem("resumeJobs");
    if (savedJobs) {
      try {
        return JSON.parse(savedJobs);
      } catch (error) {
        console.error("Error parsing jobs from localStorage:", error);
        return [];
      }
    }
    return [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Save to localStorage whenever jobs changes
  useEffect(() => {
    localStorage.setItem("resumeJobs", JSON.stringify(jobs));
  }, [jobs]);

  // Save view preference to localStorage
  useEffect(() => {
    localStorage.setItem("jobsViewMode", viewMode);
  }, [viewMode]);

  // Load view preference from localStorage
  useEffect(() => {
    const savedViewMode = localStorage.getItem("jobsViewMode") as "list" | "grid" | null;
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, []);

  const handleAddJob = (newJob: Job) => {
    setJobs((prevJobs) => [...prevJobs, newJob]);
  };

  const handleUpdateJob = (updatedJob: Job) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => (job.id === updatedJob.id ? updatedJob : job))
    );
    
    toast({
      title: "Job updated",
      description: `"${updatedJob.title}" has been updated.`,
    });
  };

  const handleArchiveJob = (jobId: string) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId
          ? { ...job, status: "archived", updatedAt: new Date().toISOString() }
          : job
      )
    );
    
    toast({
      title: "Job archived",
      description: "The job application has been archived.",
    });
  };

  const handleDeleteJob = (jobId: string) => {
    const jobToDelete = jobs.find(job => job.id === jobId);
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
    
    toast({
      title: "Job deleted",
      description: jobToDelete ? `"${jobToDelete.title}" has been deleted.` : "The job application has been deleted.",
    });
  };

  // Filter jobs based on search term and active tab
  const filteredJobs = jobs.filter((job) => {
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

  // Sort jobs by application date (newest first)
  const sortedJobs = [...filteredJobs].sort(
    (a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
  );

  // Group jobs by status for active jobs
  const groupedActiveJobs = sortedJobs.reduce(
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

  // Status groups in specific order
  const statusOrder = ["interviewing", "applied", "offered", "rejected"];

  // Get appropriate CSS class for the job cards container based on view mode
  const getJobCardsContainerClass = () => {
    return viewMode === "grid" 
      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      : "flex flex-col space-y-4";
  };

  return (
    <div className="space-y-8">
      <h1>Job Applications Tracker</h1>
      
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <div className="w-auto">
            <AddJobDialog onAddJob={handleAddJob} />
          </div>
          
          <TooltipProvider>
            <ToggleGroup 
              type="single" 
              value={viewMode} 
              onValueChange={(value) => {
                if (value) setViewMode(value as "list" | "grid");
              }}
              className="border rounded-md"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="list" aria-label="List view">
                    <LayoutList className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>List view</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="grid" aria-label="Grid view">
                    <LayoutGrid className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Grid view</TooltipContent>
              </Tooltip>
            </ToggleGroup>
          </TooltipProvider>
        </div>
        
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
            {Object.keys(groupedActiveJobs).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No active job applications yet.</p>
                <p className="text-gray-400">Add your first job application using the button above.</p>
              </div>
            ) : (
              statusOrder.map((status) => {
                const statusJobs = groupedActiveJobs[status] || [];
                if (statusJobs.length === 0) return null;
                
                return (
                  <div key={status} className="space-y-4">
                    <h2 className="text-xl font-semibold capitalize">
                      {status} ({statusJobs.length})
                    </h2>
                    <div className={getJobCardsContainerClass()}>
                      {statusJobs.map((job) => (
                        <JobCard
                          key={job.id}
                          job={job}
                          isFullWidth={viewMode === "list"}
                          onUpdate={handleUpdateJob}
                          onArchive={handleArchiveJob}
                          onDelete={handleDeleteJob}
                        />
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </TabsContent>
          
          <TabsContent value="archived" className="space-y-4">
            {sortedJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No archived job applications yet.</p>
              </div>
            ) : (
              <div className={getJobCardsContainerClass()}>
                {sortedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isFullWidth={viewMode === "list"}
                    onUpdate={handleUpdateJob}
                    onArchive={handleArchiveJob}
                    onDelete={handleDeleteJob}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default JobsPage;

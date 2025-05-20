import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, LayoutList, LayoutGrid } from "lucide-react";
import JobCard from "@/components/JobCard";
import { Job, JobStatus } from "@/types/job";
import AddJobDialog from "@/components/AddJobDialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const JobsPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

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
    const fetchJobs = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('application_date', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data) {
          // Format the jobs to match our application's Job type
          const formattedJobs: Job[] = data.map(job => ({
            id: job.id,
            title: job.position,
            company: job.company,
            location: job.location || '',
            remote: job.remote || false,
            appliedDate: job.application_date,
            status: job.status as JobStatus,
            description: job.description || '',
            notes: '',
            updatedAt: job.updated_at
          }));
          
          setJobs(formattedJobs);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast({
          title: "Error",
          description: "Failed to load your job applications.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user, toast]);

  const handleAddJob = async (newJob: Job) => {
    if (!user) return;
    
    try {
      // Format the job data for Supabase but preserve the date exactly as entered
      // by the user, without any timezone manipulations
      const { data, error } = await supabase
        .from('jobs')
        .insert([{
          user_id: user.id,
          position: newJob.title,
          company: newJob.company,
          location: newJob.location,
          remote: newJob.remote,
          description: newJob.description,
          status: newJob.status,
          application_date: newJob.appliedDate, // Preserve exactly as entered
        }])
        .select();
        
      if (error) throw error;
      
      if (data && data[0]) {
        // Add the new job to the state
        const formattedJob: Job = {
          id: data[0].id,
          title: data[0].position,
          company: data[0].company,
          location: data[0].location || '',
          remote: data[0].remote || false,
          appliedDate: data[0].application_date, // Keep the exact date format
          status: data[0].status as JobStatus,
          description: data[0].description || '',
          notes: '',
          updatedAt: data[0].updated_at
        };
        
        setJobs((prevJobs) => [formattedJob, ...prevJobs]);
      }
    } catch (error) {
      console.error('Error adding job:', error);
      toast({
        title: "Error",
        description: "Failed to add the job application.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateJob = async (updatedJob: Job) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('jobs')
        .update({
          position: updatedJob.title,
          company: updatedJob.company,
          location: updatedJob.location,
          description: updatedJob.description,
          status: updatedJob.status,
          application_date: updatedJob.appliedDate, // Keep exact date format
        })
        .eq('id', updatedJob.id);
        
      if (error) throw error;
      
      // Update the job in the state
      setJobs((prevJobs) =>
        prevJobs.map((job) => (job.id === updatedJob.id ? updatedJob : job))
      );
      
      toast({
        title: "Job updated",
        description: `"${updatedJob.title}" has been updated.`,
      });
    } catch (error) {
      console.error('Error updating job:', error);
      toast({
        title: "Error",
        description: "Failed to update the job application.",
        variant: "destructive",
      });
    }
  };

  const handleArchiveJob = async (jobId: string) => {
    if (!user) return;
    
    try {
      const jobToArchive = jobs.find(job => job.id === jobId);
      
      if (!jobToArchive) return;
      
      const { error } = await supabase
        .from('jobs')
        .update({
          status: 'archived',
        })
        .eq('id', jobId);
        
      if (error) throw error;
      
      // Update the job in the state
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
    } catch (error) {
      console.error('Error archiving job:', error);
      toast({
        title: "Error",
        description: "Failed to archive the job application.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!user) return;
    
    try {
      const jobToDelete = jobs.find(job => job.id === jobId);
      
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);
        
      if (error) throw error;
      
      // Remove the job from the state
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
      
      toast({
        title: "Job deleted",
        description: jobToDelete ? `"${jobToDelete.title}" has been deleted.` : "The job application has been deleted.",
      });
    } catch (error) {
      console.error('Error deleting job:', error);
      toast({
        title: "Error",
        description: "Failed to delete the job application.",
        variant: "destructive",
      });
    }
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

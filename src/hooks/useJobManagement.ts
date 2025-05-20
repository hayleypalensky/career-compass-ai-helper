
import { useState } from "react";
import { Job, JobStatus } from "@/types/job";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchJobs, 
  createJob, 
  updateJobById, 
  updateJobStatus, 
  deleteJobById 
} from "@/services/jobService";

interface UseJobManagementProps {
  user: { id: string } | null;
}

export const useJobManagement = ({ user }: UseJobManagementProps) => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    if (!user) {
      setJobs([]);
      setLoading(false);
      return;
    }
    
    try {
      const loadedJobs = await fetchJobs(user.id);
      console.log("Loaded jobs:", loadedJobs);
      setJobs(loadedJobs);
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

  const addJob = async (newJob: Job) => {
    if (!user) return;
    
    try {
      const createdJob = await createJob(user.id, newJob);
      if (createdJob) {
        setJobs((prevJobs) => [createdJob, ...prevJobs]);
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

  const updateJob = async (updatedJob: Job) => {
    if (!user) return;
    
    try {
      await updateJobById(updatedJob.id, updatedJob);
      
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

  const archiveJob = async (jobId: string) => {
    if (!user) return;
    
    try {
      const jobToArchive = jobs.find(job => job.id === jobId);
      
      if (!jobToArchive) return;
      
      await updateJobStatus(jobId, 'archived');
      
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

  const deleteJob = async (jobId: string) => {
    if (!user) return;
    
    try {
      const jobToDelete = jobs.find(job => job.id === jobId);
      
      await deleteJobById(jobId);
      
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

  return {
    jobs,
    loading,
    loadJobs,
    addJob,
    updateJob,
    archiveJob,
    deleteJob,
  };
};

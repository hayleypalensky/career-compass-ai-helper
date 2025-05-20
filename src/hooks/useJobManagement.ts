
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Job, JobStatus } from "@/types/job";
import { useToast } from "@/hooks/use-toast";

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

  const addJob = async (newJob: Job) => {
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

  const updateJob = async (updatedJob: Job) => {
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

  const archiveJob = async (jobId: string) => {
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

  const deleteJob = async (jobId: string) => {
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

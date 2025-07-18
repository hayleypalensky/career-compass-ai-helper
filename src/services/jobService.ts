
import { supabase } from "@/integrations/supabase/client";
import { Job, JobStatus } from "@/types/job";
import { JobAttachment } from "@/services/attachmentService";

export interface JobData {
  id: string;
  position: string;
  company: string;
  location: string | null;
  remote: boolean | null;
  application_date: string;
  status: string;
  description: string | null;
  notes: string | null;
  updated_at: string;
  attachments: any; // Use any for the raw JSON data from database
}

/**
 * Converts database job data to application Job model
 */
export const formatJobFromDb = (jobData: JobData): Job => {
  // Parse attachments from JSON, ensuring it's always an array
  let attachments: JobAttachment[] = [];
  if (jobData.attachments) {
    try {
      attachments = Array.isArray(jobData.attachments) 
        ? jobData.attachments 
        : JSON.parse(jobData.attachments);
    } catch (error) {
      console.error('Error parsing attachments:', error);
      attachments = [];
    }
  }

  return {
    id: jobData.id,
    title: jobData.position,
    company: jobData.company,
    location: jobData.location || '',
    remote: jobData.remote || false,
    appliedDate: jobData.application_date,
    status: jobData.status as JobStatus,
    description: jobData.description || '',
    notes: jobData.notes || '',
    updatedAt: jobData.updated_at,
    attachments
  };
};

/**
 * Fetches all jobs for the current user
 */
export const fetchJobs = async (userId: string) => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('application_date', { ascending: false });
    
  if (error) {
    throw error;
  }
  
  // Sort by application date (most recent first) to ensure consistent ordering
  const jobs = data ? data.map(formatJobFromDb) : [];
  return jobs.sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());
};

/**
 * Creates a new job
 */
export const createJob = async (userId: string, job: Job) => {
  const { data, error } = await supabase
    .from('jobs')
    .insert({
      user_id: userId,
      position: job.title,
      company: job.company,
      location: job.location,
      remote: job.remote,
      description: job.description,
      notes: job.notes,
      status: job.status,
      application_date: job.appliedDate,
      attachments: JSON.stringify(job.attachments || []),
    })
    .select();
    
  if (error) throw error;
  
  return data ? formatJobFromDb(data[0]) : null;
};

/**
 * Updates an existing job
 */
export const updateJobById = async (jobId: string, job: Job) => {
  const { error } = await supabase
    .from('jobs')
    .update({
      position: job.title,
      company: job.company,
      location: job.location,
      remote: job.remote,
      description: job.description,
      notes: job.notes,
      status: job.status,
      application_date: job.appliedDate,
      attachments: JSON.stringify(job.attachments || []),
      updated_at: new Date().toISOString(),
    })
    .eq('id', jobId);
    
  if (error) throw error;
  
  return true;
};

/**
 * Updates a job's status
 */
export const updateJobStatus = async (jobId: string, status: JobStatus) => {
  const { error } = await supabase
    .from('jobs')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', jobId);
    
  if (error) throw error;
  
  return true;
};

/**
 * Deletes a job
 */
export const deleteJobById = async (jobId: string) => {
  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', jobId);
    
  if (error) throw error;
  
  return true;
};

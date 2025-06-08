
import { supabase } from "@/integrations/supabase/client";

export interface JobAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export const uploadJobAttachment = async (
  jobId: string,
  file: File
): Promise<JobAttachment> => {
  // Create unique filename with timestamp
  const timestamp = Date.now();
  const fileExtension = file.name.split('.').pop();
  const fileName = `${jobId}/${timestamp}-${file.name}`;

  // Upload file to storage
  const { data, error } = await supabase.storage
    .from('job-attachments')
    .upload(fileName, file);

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('job-attachments')
    .getPublicUrl(fileName);

  return {
    id: crypto.randomUUID(),
    name: file.name,
    url: publicUrl,
    type: file.type,
    size: file.size,
    uploadedAt: new Date().toISOString(),
  };
};

export const deleteJobAttachment = async (filePath: string): Promise<void> => {
  const { error } = await supabase.storage
    .from('job-attachments')
    .remove([filePath]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
};

export const getFilePathFromUrl = (url: string): string => {
  const urlParts = url.split('/job-attachments/');
  return urlParts[1] || '';
};

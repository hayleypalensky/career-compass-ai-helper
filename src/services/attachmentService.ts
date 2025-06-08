
import { supabase } from "@/integrations/supabase/client";

export interface JobAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

// Security: Define allowed file types and size limits
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png', 
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const validateFile = (file: File): string | null => {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return `File type ${file.type} is not allowed. Please use: images, PDF, Word documents, or text files.`;
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return `File size exceeds 10MB limit. Please choose a smaller file.`;
  }
  
  return null;
};

export const uploadJobAttachment = async (
  jobId: string,
  file: File
): Promise<JobAttachment> => {
  // Security: Validate file before upload
  const validationError = validateFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  // Get current user for security
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('Authentication required for file upload');
  }

  // Security: Create secure filename with user ID prefix and timestamp
  const timestamp = Date.now();
  const fileExtension = file.name.split('.').pop();
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `${user.id}/${jobId}/${timestamp}-${sanitizedFileName}`;

  // Upload file to storage with user-specific path
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
  // Security: Verify user can delete this file (path should start with their user ID)
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('Authentication required for file deletion');
  }

  if (!filePath.startsWith(user.id + '/')) {
    throw new Error('Unauthorized: Cannot delete files belonging to other users');
  }

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

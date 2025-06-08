
import { JobAttachment } from "@/services/attachmentService";

export type JobStatus = "applied" | "interviewing" | "offered" | "rejected" | "archived";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  description?: string;
  notes?: string;
  appliedDate: string;
  status: JobStatus;
  updatedAt?: string;
  attachments?: JobAttachment[];
}

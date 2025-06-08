
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { createJob } from "@/services/jobService";
import { Job } from "@/types/job";
import { JobAttachment } from "@/services/attachmentService";

interface UseAddJobFormProps {
  jobTitle?: string;
  companyName?: string;
  location?: string;
  remote?: boolean;
  jobDescription?: string;
  onSuccess?: () => void;
}

export const useAddJobForm = ({
  jobTitle = "",
  companyName = "",
  location = "",
  remote = false,
  jobDescription = "",
  onSuccess
}: UseAddJobFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<JobAttachment[]>([]);
  const [formData, setFormData] = useState<Omit<Job, "id" | "status" | "updatedAt">>({
    title: jobTitle,
    company: companyName,
    location: location,
    remote: remote,
    description: jobDescription,
    notes: "",
    appliedDate: new Date().toISOString().split("T")[0],
    attachments: [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, remote: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add jobs to your tracker.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newJob: Job = {
        ...formData,
        id: crypto.randomUUID(),
        status: "applied",
        updatedAt: new Date().toISOString(),
        attachments,
      };
      
      await createJob(user.id, newJob);
      
      toast({
        title: "Job added to tracker",
        description: `"${formData.title}" at "${formData.company}" has been added to your job tracker.`,
      });
      
      // Reset form
      setFormData({
        title: "",
        company: "",
        location: "",
        remote: false,
        description: "",
        notes: "",
        appliedDate: new Date().toISOString().split("T")[0],
        attachments: [],
      });
      setAttachments([]);
      
      onSuccess?.();
    } catch (error) {
      console.error("Error adding job:", error);
      toast({
        title: "Error",
        description: "Failed to add the job to your tracker. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: jobTitle,
      company: companyName,
      location: location,
      remote: remote,
      description: jobDescription,
      notes: "",
      appliedDate: new Date().toISOString().split("T")[0],
      attachments: [],
    });
    setAttachments([]);
  };

  return {
    formData,
    attachments,
    setAttachments,
    isSubmitting,
    handleChange,
    handleSwitchChange,
    handleSubmit,
    resetForm,
    user
  };
};

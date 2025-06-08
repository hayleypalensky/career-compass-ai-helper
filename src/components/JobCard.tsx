
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Job, JobStatus } from "@/types/job";
import JobEditDialog from "./JobEditDialog";
import JobDetails from "./jobs/JobDetails";
import JobDeleteDialog from "./jobs/JobDeleteDialog";
import JobCardHeader from "./jobs/JobCardHeader";
import JobCardMeta from "./jobs/JobCardMeta";
import JobCardNotes from "./jobs/JobCardNotes";
import JobActions from "./jobs/JobActions";
import JobAttachments from "./jobs/JobAttachments";
import { JobAttachment } from "@/services/attachmentService";

interface JobCardProps {
  job: Job;
  isFullWidth?: boolean;
  onUpdate: (updatedJob: Job) => void;
  onArchive: (jobId: string) => void;
  onDelete: (jobId: string) => void;
}

const JobCard = ({ job, isFullWidth = false, onUpdate, onArchive, onDelete }: JobCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleStatusChange = (newStatus: JobStatus) => {
    onUpdate({
      ...job,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAttachmentsChange = (attachments: JobAttachment[]) => {
    onUpdate({
      ...job,
      attachments,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <>
      <Card className={`transition-all duration-200 ${job.status === "archived" ? "opacity-75" : ""} ${isFullWidth ? "w-full" : ""}`}>
        <JobCardHeader 
          title={job.title} 
          company={job.company} 
          status={job.status} 
        />
        
        <CardContent>
          <JobCardMeta 
            location={job.location} 
            remote={job.remote} 
            appliedDate={job.appliedDate} 
          />

          <JobCardNotes 
            notes={job.notes}
            isCollapsed={!isExpanded}
          />

          {isExpanded && (
            <>
              <JobDetails
                description={job.description}
                updatedAt={job.updatedAt}
                appliedDate={job.appliedDate}
                showNotes={false}
              />
              
              <div className="mt-4">
                <JobAttachments
                  jobId={job.id}
                  attachments={job.attachments || []}
                  onAttachmentsChange={handleAttachmentsChange}
                />
              </div>
            </>
          )}

          <JobActions
            job={job}
            isFullWidth={isFullWidth}
            onStatusChange={handleStatusChange}
            onArchive={onArchive}
            onEditClick={() => setEditDialogOpen(true)}
            onDeleteClick={() => setDeleteDialogOpen(true)}
            isExpanded={isExpanded}
            onToggleExpand={() => setIsExpanded(!isExpanded)}
          />
        </CardContent>
      </Card>

      <JobDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={() => onDelete(job.id)}
        jobTitle={job.title}
        companyName={job.company}
      />

      <JobEditDialog 
        job={job}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={onUpdate}
      />
    </>
  );
};

export default JobCard;


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Job, JobStatus } from "@/types/job";
import JobEditDialog from "./JobEditDialog";
import JobStatusBadge from "./jobs/JobStatusBadge";
import JobActions from "./jobs/JobActions";
import JobDetails from "./jobs/JobDetails";
import JobDeleteDialog from "./jobs/JobDeleteDialog";
import { formatDate } from "@/utils/dateUtils";

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

  // Function to convert URLs in text to clickable links
  const renderTextWithLinks = (text: string) => {
    if (!text) return "No notes added yet.";
    
    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    
    // Split by URLs and map parts to either text or anchor elements
    const parts = text.split(urlRegex);
    const matches = text.match(urlRegex) || [];
    
    return parts.map((part, index) => {
      // Every even index is text, odd indices are URLs
      if (index % 2 === 0) {
        return <span key={index}>{part}</span>;
      } else {
        const url = matches[(index - 1) / 2];
        return (
          <a 
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {url}
          </a>
        );
      }
    });
  };

  return (
    <>
      <Card className={`transition-all duration-200 ${job.status === "archived" ? "opacity-75" : ""} ${isFullWidth ? "w-full" : ""}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle>{job.title}</CardTitle>
              <p className="text-gray-600">{job.company}</p>
            </div>
            <JobStatusBadge status={job.status} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-500 mb-3 flex items-center justify-between flex-wrap gap-2">
            <span>
              {job.location}
              {job.remote && " (Remote)"}
            </span>
            <span>Applied: {formatDate(job.appliedDate)}</span>
          </div>

          {/* Notes section always visible */}
          <div className="mb-4 text-sm">
            <h4 className="font-medium mb-1">Notes</h4>
            <div className="text-gray-700 whitespace-pre-wrap line-clamp-3">
              {job.notes ? renderTextWithLinks(job.notes) : "No notes added yet."}
            </div>
          </div>

          {isExpanded && (
            <JobDetails
              description={job.description}
              updatedAt={job.updatedAt}
              appliedDate={job.appliedDate}
              showNotes={false}
            />
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

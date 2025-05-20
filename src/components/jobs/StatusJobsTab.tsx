
import { Job, JobStatus } from "@/types/job";
import JobsList from "./JobsList";

interface StatusJobsTabProps {
  jobs: Job[]; // These jobs are already filtered by status and sorted by date (newest first)
  status: JobStatus;
  viewMode: "list" | "grid";
  onUpdate: (job: Job) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

const StatusJobsTab = ({ 
  jobs, 
  status, 
  viewMode, 
  onUpdate, 
  onArchive, 
  onDelete 
}: StatusJobsTabProps) => {
  // Display an empty state message when no jobs are found
  if (jobs.length === 0) {
    const emptyMessages: Record<JobStatus, string> = {
      applied: "No applications in this status yet.",
      interviewing: "No interviews scheduled yet.",
      offered: "No job offers yet. Keep applying!",
      rejected: "No rejected applications. Keep going!",
      archived: "No archived applications."
    };

    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessages[status]}</p>
        {(status === "applied") && (
          <p className="text-gray-400 mt-2">Add your first job application using the button above.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <JobsList 
        jobs={jobs} // Passing the already sorted jobs
        isFullWidth={viewMode === "list"}
        onUpdate={onUpdate}
        onArchive={onArchive}
        onDelete={onDelete}
      />
    </div>
  );
};

export default StatusJobsTab;


import { Job } from "@/types/job";
import JobsList from "./JobsList";

interface ArchivedJobsTabProps {
  jobs: Job[];
  viewMode: "list" | "grid";
  onUpdate: (job: Job) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

const ArchivedJobsTab = ({ 
  jobs, 
  viewMode, 
  onUpdate, 
  onArchive, 
  onDelete 
}: ArchivedJobsTabProps) => {
  return (
    <JobsList 
      jobs={jobs}
      isFullWidth={viewMode === "list"}
      onUpdate={onUpdate}
      onArchive={onArchive}
      onDelete={onDelete}
    />
  );
};

export default ArchivedJobsTab;

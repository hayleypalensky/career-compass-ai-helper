
import { Job, JobStatus } from "@/types/job";
import JobsList from "./JobsList";

interface SearchResultsViewProps {
  filteredJobs: Job[];
  viewMode: "list" | "grid";
  onUpdate: (job: Job) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

const SearchResultsView = ({ 
  filteredJobs, 
  viewMode, 
  onUpdate, 
  onArchive, 
  onDelete 
}: SearchResultsViewProps) => {
  // Group jobs by status
  const groupedJobs = filteredJobs.reduce((acc, job) => {
    if (!acc[job.status]) {
      acc[job.status] = [];
    }
    acc[job.status].push(job);
    return acc;
  }, {} as Record<JobStatus, Job[]>);

  // Define the order of statuses to display
  const statusOrder: JobStatus[] = ["applied", "interviewing", "offered", "rejected", "archived"];
  
  // Get status display names
  const statusDisplayNames: Record<JobStatus, string> = {
    applied: "Applied",
    interviewing: "Interviewing", 
    offered: "Offered",
    rejected: "Rejected",
    archived: "Archived"
  };

  return (
    <div className="space-y-8">
      {statusOrder.map((status) => {
        const statusJobs = groupedJobs[status] || [];
        if (statusJobs.length === 0) return null;
        
        return (
          <div key={status} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
              {statusDisplayNames[status]} ({statusJobs.length})
            </h3>
            <JobsList 
              jobs={statusJobs} 
              isFullWidth={viewMode === "list"} 
              onUpdate={onUpdate}
              onArchive={onArchive}
              onDelete={onDelete}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SearchResultsView;

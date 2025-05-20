
import { Job } from "@/types/job";
import JobsList from "./JobsList";

interface ActiveJobsTabProps {
  groupedJobs: Record<string, Job[]>;
  statusOrder: string[];
  viewMode: "list" | "grid";
  onUpdate: (job: Job) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

const ActiveJobsTab = ({ 
  groupedJobs, 
  statusOrder, 
  viewMode, 
  onUpdate, 
  onArchive, 
  onDelete 
}: ActiveJobsTabProps) => {
  if (Object.keys(groupedJobs).length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No active job applications yet.</p>
        <p className="text-gray-400">Add your first job application using the button above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {statusOrder.map((status) => {
        const statusJobs = groupedJobs[status] || [];
        if (statusJobs.length === 0) return null;
        
        return (
          <div key={status} className="space-y-4">
            <h2 className="text-xl font-semibold capitalize">
              {status} ({statusJobs.length})
            </h2>
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

export default ActiveJobsTab;

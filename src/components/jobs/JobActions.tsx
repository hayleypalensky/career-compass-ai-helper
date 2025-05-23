
import { Button } from "@/components/ui/button";
import { Job, JobStatus } from "@/types/job";
import { Trash2, Pencil, Undo } from "lucide-react";

interface JobActionsProps {
  job: Job;
  isFullWidth?: boolean;
  onStatusChange: (newStatus: JobStatus) => void;
  onArchive: (jobId: string) => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const JobActions = ({
  job,
  isFullWidth = false,
  onStatusChange,
  onArchive,
  onEditClick,
  onDeleteClick,
  isExpanded,
  onToggleExpand,
}: JobActionsProps) => {
  return (
    <div className={`flex ${isFullWidth ? 'flex-wrap' : 'flex-wrap'} gap-2 pt-3`}>
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleExpand}
      >
        {isExpanded ? "Show Less" : "Show More"}
      </Button>

      {job.status !== "archived" && (
        <>
          {/* Show "Return to Applied" button if the job is not in applied status */}
          {job.status !== "applied" && (
            <Button
              variant="outline"
              size="sm"
              className="border-blue-500 text-blue-600 hover:bg-blue-50 flex items-center gap-1"
              onClick={() => onStatusChange("applied")}
            >
              <Undo className="h-3 w-3" />
              Return to Applied
            </Button>
          )}
          
          {job.status !== "interviewing" && (
            <Button
              variant="outline"
              size="sm"
              className="border-amber-500 text-amber-600 hover:bg-amber-50"
              onClick={() => onStatusChange("interviewing")}
            >
              Mark Interviewing
            </Button>
          )}

          {job.status !== "offered" && (
            <Button
              variant="outline"
              size="sm"
              className="border-green-500 text-green-600 hover:bg-green-50"
              onClick={() => onStatusChange("offered")}
            >
              Mark Offered
            </Button>
          )}

          {job.status !== "rejected" && (
            <Button
              variant="outline"
              size="sm"
              className="border-red-500 text-red-600 hover:bg-red-50"
              onClick={() => onStatusChange("rejected")}
            >
              Mark Rejected
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            className="border-gray-500 text-gray-600 hover:bg-gray-50"
            onClick={() => onArchive(job.id)}
          >
            Archive
          </Button>
        </>
      )}

      {job.status === "archived" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onStatusChange("applied")}
          className="flex items-center gap-1"
        >
          <Undo className="h-3 w-3" />
          Unarchive
        </Button>
      )}
      
      <div className={`${isFullWidth ? 'ml-auto' : 'ml-auto'} flex gap-2`}>
        <Button
          variant="outline"
          size="sm"
          className="border-blue-500 text-blue-600 hover:bg-blue-50"
          onClick={onEditClick}
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="border-red-500 text-red-600 hover:bg-red-50"
          onClick={onDeleteClick}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </div>
  );
};

export default JobActions;

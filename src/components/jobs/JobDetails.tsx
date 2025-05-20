
import { formatDate } from "@/utils/dateUtils";

interface JobDetailsProps {
  description?: string;
  notes?: string;
  updatedAt?: string;
  appliedDate: string;
  showNotes?: boolean;
}

const JobDetails = ({ description, notes, updatedAt, appliedDate, showNotes = true }: JobDetailsProps) => {
  return (
    <div className="space-y-3 my-3 border-t border-b py-3">
      {description && (
        <div>
          <h4 className="font-medium mb-1">Description</h4>
          <div className="text-gray-700 text-sm whitespace-pre-wrap">
            {description}
          </div>
        </div>
      )}

      {showNotes && (
        <div>
          <h4 className="font-medium mb-1">Notes</h4>
          <div className="text-gray-700 text-sm whitespace-pre-wrap">
            {notes || "No notes added yet."}
          </div>
        </div>
      )}

      <div>
        <h4 className="font-medium mb-1">Last Updated</h4>
        <p className="text-gray-700 text-sm">
          {formatDate(updatedAt || appliedDate)}
        </p>
      </div>
    </div>
  );
};

export default JobDetails;

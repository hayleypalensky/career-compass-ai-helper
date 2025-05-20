
import { formatDate } from "@/utils/dateUtils";

interface JobDetailsProps {
  description?: string;
  notes?: string;
  updatedAt?: string;
  appliedDate: string;
  showNotes?: boolean;
}

const JobDetails = ({ description, notes, updatedAt, appliedDate, showNotes = true }: JobDetailsProps) => {
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
            {notes ? renderTextWithLinks(notes) : "No notes added yet."}
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

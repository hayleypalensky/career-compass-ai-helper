
import React from "react";
import LinkRenderer from "./LinkRenderer";

interface JobCardNotesProps {
  notes?: string;
  isCollapsed?: boolean;
}

const JobCardNotes = ({ notes, isCollapsed = true }: JobCardNotesProps) => {
  return (
    <div className="mb-4 text-sm">
      <h4 className="font-medium mb-1">Notes</h4>
      <div className={`text-gray-700 whitespace-pre-wrap ${isCollapsed ? "line-clamp-3" : ""}`}>
        <LinkRenderer text={notes || ""} />
      </div>
    </div>
  );
};

export default JobCardNotes;


import React from "react";
import { formatDate } from "@/utils/dateUtils";

interface JobCardMetaProps {
  location: string;
  remote: boolean;
  appliedDate: string;
}

const JobCardMeta = ({ location, remote, appliedDate }: JobCardMetaProps) => {
  return (
    <div className="text-sm text-gray-500 mb-3 flex items-center justify-between flex-wrap gap-2">
      <span>
        {location}
        {remote && " (Remote)"}
      </span>
      <span>Applied: {formatDate(appliedDate)}</span>
    </div>
  );
};

export default JobCardMeta;

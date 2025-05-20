
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Job } from "@/types/job";
import JobStatusBadge from "./JobStatusBadge";

interface JobCardHeaderProps {
  title: string;
  company: string;
  status: Job["status"];
}

const JobCardHeader = ({ title, company, status }: JobCardHeaderProps) => {
  return (
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <CardTitle>{title}</CardTitle>
          <p className="text-gray-600">{company}</p>
        </div>
        <JobStatusBadge status={status} />
      </div>
    </CardHeader>
  );
};

export default JobCardHeader;

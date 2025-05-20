
import { Job, JobStatus } from "@/types/job";
import { TabsContent } from "@/components/ui/tabs";
import StatusJobsTab from "./StatusJobsTab";

interface JobTabsContentProps {
  tabJobs: Job[];
  viewMode: "list" | "grid";
  onUpdate: (job: Job) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

const JobTabsContent = ({ 
  tabJobs, 
  viewMode, 
  onUpdate, 
  onArchive, 
  onDelete
}: JobTabsContentProps) => {
  return (
    <>
      <TabsContent value="applied">
        <StatusJobsTab 
          jobs={tabJobs}
          viewMode={viewMode}
          onUpdate={onUpdate}
          onArchive={onArchive}
          onDelete={onDelete}
          status="applied"
        />
      </TabsContent>
      
      <TabsContent value="interviewing">
        <StatusJobsTab 
          jobs={tabJobs}
          viewMode={viewMode}
          onUpdate={onUpdate}
          onArchive={onArchive}
          onDelete={onDelete}
          status="interviewing"
        />
      </TabsContent>
      
      <TabsContent value="offered">
        <StatusJobsTab 
          jobs={tabJobs}
          viewMode={viewMode}
          onUpdate={onUpdate}
          onArchive={onArchive}
          onDelete={onDelete}
          status="offered"
        />
      </TabsContent>
      
      <TabsContent value="rejected">
        <StatusJobsTab 
          jobs={tabJobs}
          viewMode={viewMode}
          onUpdate={onUpdate}
          onArchive={onArchive}
          onDelete={onDelete}
          status="rejected"
        />
      </TabsContent>
      
      <TabsContent value="archived">
        <StatusJobsTab 
          jobs={tabJobs}
          viewMode={viewMode}
          onUpdate={onUpdate}
          onArchive={onArchive}
          onDelete={onDelete}
          status="archived"
        />
      </TabsContent>
    </>
  );
};

export default JobTabsContent;

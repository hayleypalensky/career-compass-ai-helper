
import AddJobDialog from "@/components/AddJobDialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LayoutGrid, LayoutList } from "lucide-react";

interface JobsHeaderProps {
  onAddJob: (job: any) => void;
  viewMode: "list" | "grid";
  setViewMode: (mode: "list" | "grid") => void;
}

const JobsHeader = ({ onAddJob, viewMode, setViewMode }: JobsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="w-auto">
        <AddJobDialog onAddJob={onAddJob} />
      </div>
      
      <TooltipProvider>
        <ToggleGroup 
          type="single" 
          value={viewMode} 
          onValueChange={(value) => {
            if (value) setViewMode(value as "list" | "grid");
          }}
          className="border rounded-md"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem value="list" aria-label="List view">
                <LayoutList className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>List view</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Grid view</TooltipContent>
          </Tooltip>
        </ToggleGroup>
      </TooltipProvider>
    </div>
  );
};

export default JobsHeader;

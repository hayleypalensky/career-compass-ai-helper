
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface JobTrackerSettingsProps {
  autoAddJobs: boolean;
  onToggleAutoAdd: (enabled: boolean) => void;
}

const JobTrackerSettings = ({ autoAddJobs, onToggleAutoAdd }: JobTrackerSettingsProps) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">Job Tracker Settings</CardTitle>
        <CardDescription>
          Configure how jobs are added to your tracker
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto-add-jobs" className="text-sm font-medium">
              Auto-add from Tailor Resume
            </Label>
            <p className="text-xs text-gray-500">
              Automatically add jobs to tracker when analyzing in Tailor Resume page
            </p>
          </div>
          <Switch
            id="auto-add-jobs"
            checked={autoAddJobs}
            onCheckedChange={onToggleAutoAdd}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default JobTrackerSettings;

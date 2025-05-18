
import { useState } from "react";
import { Profile } from "@/types/profile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSkillGaps } from "@/utils/jobMatcher";

interface JobMatchCardProps {
  job: {
    title: string;
    company?: string;
    description?: string;
    skills: string[];
    match: number;
  };
  profile: Profile;
}

const JobMatchCard = ({ job, profile }: JobMatchCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const skillGaps = getSkillGaps(profile, job);

  // Helper function to determine match color
  const getMatchColor = (match: number): string => {
    if (match >= 80) return "bg-green-500";
    if (match >= 60) return "bg-blue-500";
    if (match >= 40) return "bg-gold-500";
    return "bg-gray-500";
  };

  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium">{job.title}</h3>
            {job.company && <p className="text-sm text-gray-600">{job.company}</p>}
          </div>
          <Badge className={getMatchColor(job.match)}>
            {job.match}% Match
          </Badge>
        </div>

        {isExpanded && (
          <div className="mt-3 space-y-3">
            {job.description && (
              <div>
                <h4 className="text-sm font-medium">Description:</h4>
                <p className="text-sm text-gray-700">{job.description}</p>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium">Required Skills:</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {job.skills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className={skillGaps.includes(skill) ? "border-red-300" : "border-green-300"}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {skillGaps.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-red-600">Skill Gaps:</h4>
                <p className="text-sm">
                  Consider adding these skills to your profile: {skillGaps.join(", ")}
                </p>
              </div>
            )}
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2"
        >
          {isExpanded ? "Show Less" : "Show More"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default JobMatchCard;

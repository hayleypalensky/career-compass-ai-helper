
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RelevantSkillsCardProps {
  relevantSkills: string[];
}

const RelevantSkillsCard = ({ relevantSkills }: RelevantSkillsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Relevant Skills</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {relevantSkills.length > 0 ? (
            relevantSkills.map((skill, index) => (
              <Badge key={index} className="bg-green-600">
                {skill}
              </Badge>
            ))
          ) : (
            <p className="text-gray-500">No relevant skills identified.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RelevantSkillsCard;

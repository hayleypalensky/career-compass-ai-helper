
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Experience } from "@/components/ExperienceForm";
import ExperienceCard from "./ExperienceCard";

interface ExperienceEditorProps {
  experiences: Experience[];
  onBulletChange: (expIndex: number, bulletIndex: number, value: string) => void;
  onRemoveBullet: (expIndex: number, bulletIndex: number) => void;
  onAddBullet: (expIndex: number) => void;
  generateBulletSuggestions: (expIndex: number, bulletIndex: number) => Promise<string[]>;
  jobDescription?: string;
  relevantSkills: string[];
}

const ExperienceEditor = ({
  experiences,
  onBulletChange,
  onRemoveBullet,
  onAddBullet,
  generateBulletSuggestions,
  jobDescription = "",
  relevantSkills = [],
}: ExperienceEditorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tailor Experience Bullet Points</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {experiences.map((exp, expIndex) => (
            <ExperienceCard
              key={exp.id}
              experience={exp}
              expIndex={expIndex}
              onBulletChange={onBulletChange}
              onRemoveBullet={onRemoveBullet}
              onAddBullet={onAddBullet}
              generateBulletSuggestions={generateBulletSuggestions}
              jobDescription={jobDescription}
              relevantSkills={relevantSkills}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceEditor;

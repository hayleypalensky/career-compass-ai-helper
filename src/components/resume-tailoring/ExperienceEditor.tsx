
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Experience } from "@/components/ExperienceForm";
import { Profile } from "@/types/profile";
import ExperienceCard from "./ExperienceCard";

interface ExperienceEditorProps {
  experiences: Experience[];
  onBulletChange: (expIndex: number, bulletIndex: number, value: string) => void;
  onRemoveBullet: (expIndex: number, bulletIndex: number) => void;
  onAddBullet: (expIndex: number) => void;
  onReorderBullets: (expIndex: number, oldIndex: number, newIndex: number) => void;
  generateBulletSuggestions: (expIndex: number, bulletIndex: number) => Promise<string[]>;
  jobDescription?: string;
  relevantSkills: string[];
  profile: Profile;
  onSyncToProfile: (experienceId: string, bulletIndex: number | null, newBullet: string) => void;
  onSyncReorderedBullets: (experienceId: string, newBullets: string[]) => void;
}

const ExperienceEditor = ({
  experiences,
  onBulletChange,
  onRemoveBullet,
  onAddBullet,
  onReorderBullets,
  generateBulletSuggestions,
  jobDescription = "",
  relevantSkills = [],
  profile,
  onSyncToProfile,
  onSyncReorderedBullets,
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
              onReorderBullets={onReorderBullets}
              generateBulletSuggestions={generateBulletSuggestions}
              jobDescription={jobDescription}
              relevantSkills={relevantSkills}
              profile={profile}
              onSyncToProfile={onSyncToProfile}
              onSyncReorderedBullets={onSyncReorderedBullets}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceEditor;


import { formatDate } from "@/utils/resumeFormatters";
import { ResumeColorTheme } from "./ResumeColorSelector";

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description?: string;
  bullets: string[];
}

interface ResumeExperienceProps {
  experiences: ExperienceItem[];
  theme: ResumeColorTheme;
}

const ResumeExperience = ({ experiences, theme }: ResumeExperienceProps) => {
  if (!experiences || experiences.length === 0) return null;
  
  const headerStyle = theme.id === "custom" ? { color: theme.hexColor } : {};
  const headerClass = theme.id === "custom" ? "text-base font-semibold border-b pb-1 mb-3" : `text-base font-semibold border-b pb-1 mb-3 ${theme.headingColor}`;
  
  return (
    <div className="mb-6">
      <h3 className={headerClass} style={headerStyle}>Experience</h3>
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="mb-3">
            <div className="flex justify-between mb-1">
              <h4 className="font-medium text-sm">{exp.title}</h4>
              <span className="text-gray-600 text-xs">{formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}</span>
            </div>
            <p className="text-gray-700 text-sm mb-2">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
            <ul className="text-xs space-y-1 ml-4">
              {exp.bullets
                .filter((bullet) => bullet.trim() !== "") // Filter out empty bullets
                .map((bullet, idx) => (
                  <li key={idx} className="text-gray-800 relative pl-3 before:content-['•'] before:absolute before:left-0 before:top-0 before:text-gray-600">
                    {bullet}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeExperience;

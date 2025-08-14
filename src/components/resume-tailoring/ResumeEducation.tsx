
import { Education } from "@/components/EducationForm";
import { ResumeColorTheme } from "./ResumeColorSelector";
import { formatDate } from "@/utils/resumeFormatters";

interface ResumeEducationProps {
  education: Education[];
  theme: ResumeColorTheme;
}

const ResumeEducation = ({ education, theme }: ResumeEducationProps) => {
  if (!education || education.length === 0) return null;

  const headerStyle = theme.id === "custom" ? { color: theme.hexColor } : {};
  const headerClass = theme.id === "custom" ? "text-base font-semibold border-b pb-1 mb-3" : `text-base font-semibold border-b pb-1 mb-3 ${theme.headingColor}`;

  return (
    <div className="mb-6">
      <h3 className={headerClass} style={headerStyle}>Education</h3>
      <div className="space-y-3">
        {education.map((edu) => (
          <div key={edu.id} className="mb-2">
            <div className="flex justify-between mb-1">
              <h4 className="font-medium text-sm">{edu.degree} in {edu.field}</h4>
              <span className="text-gray-600 text-xs">{formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}</span>
            </div>
            <p className="text-gray-700 text-sm">
              {edu.school}
              {'location' in edu && edu.location ? `, ${String(edu.location)}` : ''}
            </p>
            {edu.description && <p className="text-gray-600 text-xs mt-1">{edu.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeEducation;

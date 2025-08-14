
import { ResumeColorTheme } from "./ResumeColorSelector";

interface ResumeSummaryProps {
  summary: string;
  theme: ResumeColorTheme;
}

const ResumeSummary = ({ summary, theme }: ResumeSummaryProps) => {
  if (!summary) return null;
  
  const headerStyle = theme.id === "custom" ? { color: theme.hexColor } : {};
  const headerClass = theme.id === "custom" ? "text-base font-semibold mb-2 border-b pb-1" : `text-base font-semibold mb-2 ${theme.headingColor} border-b pb-1`;
  
  return (
    <div className="mb-6">
      <h3 className={headerClass} style={headerStyle}>Professional Summary</h3>
      <p className="text-gray-800 text-sm">{summary}</p>
    </div>
  );
};

export default ResumeSummary;

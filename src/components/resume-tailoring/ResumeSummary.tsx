
import { ResumeColorTheme } from "./ResumeColorSelector";

interface ResumeSummaryProps {
  summary: string;
  theme: ResumeColorTheme;
}

const ResumeSummary = ({ summary, theme }: ResumeSummaryProps) => {
  if (!summary) return null;
  
  return (
    <div className="mb-6">
      <h3 className={`text-base font-semibold mb-2 ${theme.headingColor} border-b pb-1`}>Professional Summary</h3>
      <p className="text-gray-800 text-sm">{summary}</p>
    </div>
  );
};

export default ResumeSummary;

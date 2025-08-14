
import { PersonalInfo } from "@/types/profile";
import { ResumeColorTheme } from "./ResumeColorSelector";
import { formatPhoneNumber } from "@/utils/resumeFormatters";

interface ResumeHeaderProps {
  personalInfo: PersonalInfo;
  theme: ResumeColorTheme;
}

const ResumeHeader = ({ personalInfo, theme }: ResumeHeaderProps) => {
  const headerStyle = theme.id === "custom" ? { color: theme.hexColor } : {};
  const headerClass = theme.id === "custom" ? "text-2xl font-bold mb-3" : `text-2xl font-bold mb-3 ${theme.headingColor}`;
  
  return (
    <div className="mb-6 pb-3 border-b">
      <h2 className={headerClass} style={headerStyle}>{personalInfo.name}</h2>
      
      <div className="flex flex-wrap gap-3 text-sm">
        {personalInfo.email && (
          <span className="text-gray-700 flex items-center">
            <span>Email:</span>
            <span className="ml-1">{personalInfo.email}</span>
          </span>
        )}
        {personalInfo.phone && (
          <span className="text-gray-700 flex items-center">
            <span>Phone:</span>
            <span className="ml-1">{formatPhoneNumber(personalInfo.phone)}</span>
          </span>
        )}
        {personalInfo.website && (
          <span className="text-gray-700 flex items-center">
            <span>Website:</span>
            <span className="ml-1">{personalInfo.website}</span>
          </span>
        )}
        {personalInfo.location && (
          <span className="text-gray-700 flex items-center">
            <span>Location:</span>
            <span className="ml-1">{personalInfo.location}</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default ResumeHeader;


import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface JobSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const JobSearchBar = ({ searchTerm, onSearchChange }: JobSearchBarProps) => {
  return (
    <div className="relative max-w-sm">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Search jobs..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-8"
      />
    </div>
  );
};

export default JobSearchBar;

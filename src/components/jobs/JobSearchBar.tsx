
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface JobSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  hasActiveSearch: boolean;
}

const JobSearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  onSearch, 
  onClear, 
  hasActiveSearch 
}: JobSearchBarProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="relative max-w-sm flex">
      <div className="relative flex-1">
        <Input
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pr-8"
        />
        {hasActiveSearch && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="absolute right-1 top-1 h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      <Button
        onClick={onSearch}
        size="sm"
        className="ml-2"
        disabled={!searchTerm.trim()}
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default JobSearchBar;

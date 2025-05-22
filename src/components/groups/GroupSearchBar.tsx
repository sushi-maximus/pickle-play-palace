
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface GroupSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function GroupSearchBar({ searchQuery, onSearchChange }: GroupSearchBarProps) {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search groups..."
        className="pl-8"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}

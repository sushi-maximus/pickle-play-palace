
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";

interface MobileGroupsHeaderProps {
  onSearchClick?: () => void;
  onCreateClick?: () => void;
}

export const MobileGroupsHeader = ({ 
  onSearchClick, 
  onCreateClick 
}: MobileGroupsHeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-[50] bg-slate-800 text-white px-4 py-3 flex items-center justify-between">
      <div className="flex-1">
        <h1 className="font-semibold text-lg">Groups</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-slate-700"
          onClick={onSearchClick}
          aria-label="Search groups"
        >
          <Search className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-slate-700"
          onClick={onCreateClick}
          aria-label="Create group"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

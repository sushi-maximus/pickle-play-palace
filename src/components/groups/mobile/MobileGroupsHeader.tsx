
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
    <header className="fixed top-0 left-0 right-0 z-[50] bg-gradient-to-r from-slate-800 to-slate-700 text-white px-4 py-3 flex items-center justify-between shadow-lg border-b border-slate-600/30">
      <div className="flex-1">
        <h1 className="font-semibold text-lg md:text-xl tracking-tight leading-tight">Groups</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-slate-600/50 transition-all duration-200 hover:scale-105"
          onClick={onSearchClick}
          aria-label="Search groups"
        >
          <Search className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-slate-600/50 transition-all duration-200 hover:scale-105"
          onClick={onCreateClick}
          aria-label="Create group"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

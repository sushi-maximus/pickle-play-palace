
import { ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface MobileGroupHeaderProps {
  groupName: string;
  groupCode?: string;
  memberCount?: number;
}

export const MobileGroupHeader = ({ groupName, groupCode, memberCount }: MobileGroupHeaderProps) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/groups");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[50] bg-slate-800 text-white px-4 py-3 flex items-center justify-between">
      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-slate-700 flex-shrink-0"
        onClick={handleGoBack}
        aria-label="Go back to groups"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      
      <div className="flex-1 text-center px-2">
        <h1 className="font-semibold text-lg truncate">{groupName}</h1>
        <div className="flex items-center justify-center gap-2 text-xs text-slate-300 mt-0.5">
          {memberCount !== undefined && (
            <span>{memberCount} {memberCount === 1 ? "member" : "members"}</span>
          )}
          {groupCode && memberCount !== undefined && <span>•</span>}
          {groupCode && <span>{groupCode}</span>}
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-slate-700 flex-shrink-0"
        aria-label="Group settings"
      >
        <Settings className="h-5 w-5" />
      </Button>
    </header>
  );
};


import { ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface MobileGroupHeaderProps {
  groupName: string;
  groupCode?: string;
  memberCount?: number;
}

export const MobileGroupHeader = ({ groupName, groupCode, memberCount }: MobileGroupHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Main header */}
      <header className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-slate-800 to-slate-700 text-white px-4 py-3 flex items-center justify-between shadow-lg border-b border-slate-600/30">
        {/* Left Back Button */}
        <div className="w-10 flex-shrink-0 flex items-center justify-start">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-slate-600/50 transition-all duration-200 hover:scale-105 p-0 h-8 w-8"
            onClick={() => navigate("/groups")}
            aria-label="Back to Groups"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 text-center px-2">
          <h1 className="font-semibold text-lg md:text-xl truncate tracking-tight leading-tight">{groupName}</h1>
          <div className="flex items-center justify-center gap-2 text-xs text-slate-300/90 mt-0.5">
            {memberCount !== undefined && (
              <span className="bg-slate-600/30 px-2 py-0.5 rounded-full font-medium leading-tight">
                {memberCount} {memberCount === 1 ? "member" : "members"}
              </span>
            )}
            {groupCode && (
              <span className="bg-primary/20 text-primary-foreground px-2 py-0.5 rounded-full font-medium leading-tight">
                {groupCode}
              </span>
            )}
          </div>
        </div>
        
        {/* Right Group Icon */}
        <div className="w-10 flex-shrink-0 flex items-center justify-end">
          <Users className="h-5 w-5 text-slate-300" />
        </div>
      </header>
    </>
  );
};

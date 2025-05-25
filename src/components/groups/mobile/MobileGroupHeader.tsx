
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileGroupHeaderProps {
  groupName: string;
  groupCode?: string;
  memberCount?: number;
}

export const MobileGroupHeader = ({ groupName, groupCode, memberCount }: MobileGroupHeaderProps) => {
  return (
    <>
      {/* Main header with reduced padding */}
      <header className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-slate-800 to-slate-700 text-white px-4 py-2.5 flex items-center justify-between shadow-lg border-b border-slate-600/30">
        {/* Left Groups Icon (non-clickable) */}
        <div className="w-10 flex-shrink-0 flex items-center justify-center">
          <Users className="h-5 w-5 text-white" />
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
        
        {/* Right Groups Icon (non-clickable) */}
        <div className="w-10 flex-shrink-0 flex items-center justify-center">
          <Users className="h-5 w-5 text-white" />
        </div>
      </header>
    </>
  );
};

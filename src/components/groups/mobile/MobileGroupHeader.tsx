
import { ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface MobileGroupHeaderProps {
  groupName: string;
  groupCode?: string;
}

export const MobileGroupHeader = ({ groupName, groupCode }: MobileGroupHeaderProps) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/groups");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[50] bg-slate-800 text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-slate-700"
          onClick={handleGoBack}
          aria-label="Go back to groups"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-semibold text-lg truncate max-w-[200px]">{groupName}</h1>
          {groupCode && (
            <p className="text-xs text-slate-300">{groupCode}</p>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-slate-700"
        aria-label="Group settings"
      >
        <Settings className="h-5 w-5" />
      </Button>
    </header>
  );
};

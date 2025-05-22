
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface GroupDetailActionsProps {
  isMember: boolean;
  joining: boolean;
  leaving: boolean;
  onJoin: () => Promise<void>;
  onLeave: () => Promise<void>;
}

export function GroupDetailActions({ 
  isMember, 
  joining, 
  leaving, 
  onJoin, 
  onLeave 
}: GroupDetailActionsProps) {
  if (!isMember) {
    return (
      <Button 
        onClick={onJoin} 
        disabled={joining}
        className="ml-4"
      >
        {joining ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Joining...
          </>
        ) : "Join Group"}
      </Button>
    );
  }
  
  return (
    <Button 
      variant="outline" 
      onClick={onLeave}
      disabled={leaving}
      className="ml-4"
    >
      {leaving ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Leaving...
        </>
      ) : "Leave Group"}
    </Button>
  );
}

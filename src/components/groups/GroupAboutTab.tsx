
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface GroupAboutTabProps {
  description: string | null;
  user: any | null;
  membershipStatus: {
    isMember: boolean;
    isPending: boolean;
    isAdmin: boolean;
  };
  onJoinRequest: () => void;
}

export const GroupAboutTab = ({ 
  description, 
  user, 
  membershipStatus, 
  onJoinRequest 
}: GroupAboutTabProps) => {
  return (
    <>
      <div className="prose dark:prose-invert">
        <h3 className="text-lg font-medium mb-2">About this group</h3>
        <p className="text-muted-foreground">
          {description || "No description provided."}
        </p>
      </div>
      
      {user && (
        <div className="mt-6 flex gap-4">
          {!membershipStatus.isMember && !membershipStatus.isPending && (
            <Button onClick={onJoinRequest}>
              {membershipStatus.isPending ? "Request Pending" : "Request to Join"}
            </Button>
          )}
          
          {membershipStatus.isPending && (
            <Button disabled variant="secondary" className="cursor-not-allowed flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Request Pending
            </Button>
          )}
          
          {membershipStatus.isMember && !membershipStatus.isAdmin && (
            <Button variant="secondary">Leave Group</Button>
          )}
          
          <Button variant="outline">Contact Admin</Button>
        </div>
      )}
    </>
  );
};


import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GroupDetailsHeader } from "@/components/groups/GroupDetailsHeader";
import { GroupDetailsTabs } from "./GroupDetailsTabs";
import { GroupJoinRequest } from "./GroupJoinRequest";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useGroupDetails } from "./hooks/useGroupDetails";
import type { Database } from "@/integrations/supabase/types";
import type { Profile } from "../posts/hooks/types/groupPostTypes";

type Group = Database['public']['Tables']['groups']['Row'];

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface MembershipStatus {
  isMember: boolean;
  isPending: boolean;
  isAdmin: boolean;
}

interface GroupDetailsContainerProps {
  id: string;
  user: Profile | null;
  breadcrumbItems: BreadcrumbItem[];
}

export const GroupDetailsContainer = ({ 
  id,
  user,
  breadcrumbItems 
}: GroupDetailsContainerProps) => {
  const navigate = useNavigate();
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  
  const {
    group,
    loading,
    membershipStatus,
    hasPendingRequests,
    handleMemberUpdate
  } = useGroupDetails(id, user?.id);
  
  const handleJoinRequest = () => {
    if (!user) {
      toast.error("You need to be logged in to request to join");
      navigate("/login", { state: { from: `/groups/${id}` } });
      return;
    }
    
    setJoinDialogOpen(true);
  };
  
  const handleJoinSuccess = () => {
    const updatedStatus: MembershipStatus = { ...membershipStatus, isPending: true };
  };

  if (loading) {
    return null; // Loading state is handled by parent component
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <GroupDetailsHeader 
        group={group} 
        breadcrumbItems={breadcrumbItems} 
      />
      
      <Card className="w-full mb-6 overflow-hidden">
        <CardContent className="pt-6">
          <GroupDetailsTabs
            group={group}
            membershipStatus={membershipStatus}
            user={user}
            hasPendingRequests={hasPendingRequests}
            onJoinRequest={handleJoinRequest}
            onMemberUpdate={handleMemberUpdate}
          />
        </CardContent>
      </Card>
      
      {group && user && (
        <GroupJoinRequest
          groupId={group.id}
          groupName={group.name}
          userId={user.id}
          isOpen={joinDialogOpen}
          onClose={() => setJoinDialogOpen(false)}
          onSuccess={handleJoinSuccess}
        />
      )}
    </div>
  );
};

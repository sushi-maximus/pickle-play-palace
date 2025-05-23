
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GroupDetailsHeader } from "@/components/groups/GroupDetailsHeader";
import { GroupDetailsTabs } from "./GroupDetailsTabs";
import { JoinRequestDialog } from "@/components/groups/JoinRequestDialog";
import { fetchGroupDetails } from "@/components/groups/utils";
import { checkMembershipStatus } from "@/components/groups/services";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface GroupDetailsContainerProps {
  id: string;
  user: any;
  breadcrumbItems: { label: string; href?: string }[];
}

export const GroupDetailsContainer = ({ 
  id,
  user,
  breadcrumbItems 
}: GroupDetailsContainerProps) => {
  const navigate = useNavigate();
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [membershipStatus, setMembershipStatus] = useState({
    isMember: false,
    isPending: false,
    isAdmin: false
  });
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [hasPendingRequests, setHasPendingRequests] = useState(false);
  
  useEffect(() => {
    const loadGroupDetails = async () => {
      setLoading(true);
      
      try {
        if (!id) {
          toast.error("Group ID is missing");
          navigate("/groups");
          return;
        }
        
        const groupData = await fetchGroupDetails(id);
        
        if (!groupData) {
          toast.error("Group not found");
          navigate("/groups");
          return;
        }
        
        setGroup(groupData);
      } catch (error) {
        console.error("Failed to load group details:", error);
        toast.error("Failed to load group details");
      } finally {
        setLoading(false);
      }
    };
    
    loadGroupDetails();
  }, [id, navigate]);
  
  useEffect(() => {
    const checkMembership = async () => {
      if (user && group) {
        const status = await checkMembershipStatus(user.id, group.id);
        setMembershipStatus(status);
      }
    };
    
    checkMembership();
  }, [user, group]);
  
  useEffect(() => {
    const checkPendingRequests = async () => {
      if (user && group && membershipStatus.isAdmin) {
        try {
          const { data, error } = await supabase
            .from("group_members")
            .select("id")
            .eq("group_id", group.id)
            .eq("status", "pending")
            .limit(1);
            
          if (!error && data) {
            setHasPendingRequests(data.length > 0);
          }
        } catch (error) {
          console.error("Error checking pending requests:", error);
        }
      }
    };
    
    checkPendingRequests();
  }, [group, user, membershipStatus.isAdmin]);
  
  const handleJoinRequest = () => {
    if (!user) {
      toast.error("You need to be logged in to request to join");
      navigate("/login", { state: { from: `/groups/${id}` } });
      return;
    }
    
    setJoinDialogOpen(true);
  };
  
  const handleJoinSuccess = () => {
    setMembershipStatus(prev => ({ ...prev, isPending: true }));
  };

  // Handler for member updates (promotion/removal)
  const handleMemberUpdate = async () => {
    if (id) {
      const updatedGroup = await fetchGroupDetails(id);
      if (updatedGroup) {
        setGroup(updatedGroup);
      }
    }
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
        <JoinRequestDialog
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

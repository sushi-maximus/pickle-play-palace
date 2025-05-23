
import { useState, useEffect } from "react";
import { fetchGroupDetails } from "@/components/groups/utils";
import { checkMembershipStatus } from "@/components/groups/services";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export interface MembershipStatus {
  isMember: boolean;
  isPending: boolean;
  isAdmin: boolean;
}

export function useGroupDetails(id: string, userId?: string) {
  const navigate = useNavigate();
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [membershipStatus, setMembershipStatus] = useState<MembershipStatus>({
    isMember: false,
    isPending: false,
    isAdmin: false
  });
  const [hasPendingRequests, setHasPendingRequests] = useState(false);
  
  // Load group details
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
  
  // Check membership status
  useEffect(() => {
    const checkMembership = async () => {
      if (userId && group) {
        const status = await checkMembershipStatus(userId, group.id);
        setMembershipStatus(status);
      }
    };
    
    checkMembership();
  }, [userId, group]);
  
  // Check for pending requests
  useEffect(() => {
    const checkPendingRequests = async () => {
      if (userId && group && membershipStatus.isAdmin) {
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
  }, [group, userId, membershipStatus.isAdmin]);

  // Function to update group data
  const handleMemberUpdate = async () => {
    if (id) {
      const updatedGroup = await fetchGroupDetails(id);
      if (updatedGroup) {
        setGroup(updatedGroup);
      }
    }
  };

  return {
    group,
    loading,
    membershipStatus,
    hasPendingRequests,
    handleMemberUpdate,
    setGroup
  };
}

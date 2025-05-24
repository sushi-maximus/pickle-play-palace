
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
  const [error, setError] = useState<string | null>(null);
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
      setError(null);
      
      try {
        if (!id) {
          setError("Group ID is missing");
          return;
        }
        
        // Validate that ID is a valid UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
          setError("Invalid group ID format");
          return;
        }
        
        console.log("Fetching group details for ID:", id);
        const groupData = await fetchGroupDetails(id);
        
        if (!groupData) {
          setError("Group not found");
          return;
        }
        
        console.log("Successfully loaded group:", groupData.name);
        setGroup(groupData);
      } catch (error) {
        console.error("Failed to load group details:", error);
        setError("Failed to load group details");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      loadGroupDetails();
    }
  }, [id]);
  
  // Check membership status
  useEffect(() => {
    const checkMembership = async () => {
      if (userId && group && !error) {
        try {
          const status = await checkMembershipStatus(userId, group.id);
          setMembershipStatus(status);
        } catch (error) {
          console.error("Failed to check membership status:", error);
          // Don't set error state for membership check failure
        }
      }
    };
    
    checkMembership();
  }, [userId, group, error]);
  
  // Check for pending requests
  useEffect(() => {
    const checkPendingRequests = async () => {
      if (userId && group && membershipStatus.isAdmin && !error) {
        try {
          const { data, error: requestError } = await supabase
            .from("group_members")
            .select("id")
            .eq("group_id", group.id)
            .eq("status", "pending")
            .limit(1);
            
          if (!requestError && data) {
            setHasPendingRequests(data.length > 0);
          }
        } catch (error) {
          console.error("Error checking pending requests:", error);
          // Don't set error state for pending requests check failure
        }
      }
    };
    
    checkPendingRequests();
  }, [group, userId, membershipStatus.isAdmin, error]);

  // Function to update group data
  const handleMemberUpdate = async () => {
    if (id && !error) {
      try {
        const updatedGroup = await fetchGroupDetails(id);
        if (updatedGroup) {
          setGroup(updatedGroup);
        }
      } catch (error) {
        console.error("Failed to update group data:", error);
      }
    }
  };

  return {
    group,
    loading,
    error,
    membershipStatus,
    hasPendingRequests,
    handleMemberUpdate,
    setGroup
  };
}

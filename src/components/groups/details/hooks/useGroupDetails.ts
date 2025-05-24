
import { useState, useEffect } from "react";
import { fetchGroupDetails } from "@/components/groups/utils";
import { checkMembershipStatus } from "@/components/groups/services";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";

type GroupData = Database['public']['Tables']['groups']['Row'] & {
  member_count: number;
  members: any[];
};

export interface MembershipStatus {
  isMember: boolean;
  isPending: boolean;
  isAdmin: boolean;
}

export function useGroupDetails(id: string, userId?: string) {
  const navigate = useNavigate();
  const [group, setGroup] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [membershipStatus, setMembershipStatus] = useState<MembershipStatus>({
    isMember: false,
    isPending: false,
    isAdmin: false
  });
  const [hasPendingRequests, setHasPendingRequests] = useState(false);
  
  console.log("useGroupDetails: Hook called with", { id, userId: !!userId });
  
  // Only fetch data if we have a valid ID
  const isValidId = id && id.trim() !== '' && id !== ':id';
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const isValidUUID = isValidId && uuidRegex.test(id);
  
  useEffect(() => {
    // Reset state first
    setGroup(null);
    setError(null);
    setLoading(false);
    
    if (!isValidId) {
      console.log("useGroupDetails: No valid ID provided, skipping data fetch");
      setError("Invalid group ID");
      return;
    }

    if (!isValidUUID) {
      console.log("useGroupDetails: Invalid UUID format, skipping data fetch");
      setError("Invalid group ID format");
      return;
    }

    // Start loading
    setLoading(true);
    
    const loadGroupDetails = async () => {
      try {
        console.log("useGroupDetails: Fetching group details for valid UUID:", id);
        const groupData = await fetchGroupDetails(id);
        
        if (!groupData) {
          console.warn("useGroupDetails: No group data returned");
          setError("Group not found");
          setLoading(false);
          return;
        }
        
        console.log("useGroupDetails: Successfully loaded group:", groupData.name);
        setGroup(groupData);
        setError(null);
      } catch (error) {
        console.error("useGroupDetails: Failed to load group details:", error);
        setError(error instanceof Error ? error.message : "Failed to load group details");
      } finally {
        setLoading(false);
      }
    };
    
    loadGroupDetails();
  }, [id, isValidId, isValidUUID]);
  
  // Check membership status
  useEffect(() => {
    const checkMembership = async () => {
      if (userId && group && !error && isValidUUID) {
        try {
          console.log("useGroupDetails: Checking membership for user:", userId, "in group:", group.id);
          const status = await checkMembershipStatus(userId, group.id);
          setMembershipStatus(status);
          console.log("useGroupDetails: Membership status:", status);
        } catch (error) {
          console.error("useGroupDetails: Failed to check membership status:", error);
          // Don't set error state for membership check failure
        }
      }
    };
    
    checkMembership();
  }, [userId, group, error, isValidUUID]);
  
  // Check for pending requests
  useEffect(() => {
    const checkPendingRequests = async () => {
      if (userId && group && membershipStatus.isAdmin && !error && isValidUUID) {
        try {
          console.log("useGroupDetails: Checking pending requests for admin user");
          const { data, error: requestError } = await supabase
            .from("group_members")
            .select("id")
            .eq("group_id", group.id)
            .eq("status", "pending")
            .limit(1);
            
          if (!requestError && data) {
            setHasPendingRequests(data.length > 0);
            console.log("useGroupDetails: Pending requests found:", data.length > 0);
          }
        } catch (error) {
          console.error("useGroupDetails: Error checking pending requests:", error);
          // Don't set error state for pending requests check failure
        }
      }
    };
    
    checkPendingRequests();
  }, [group, userId, membershipStatus.isAdmin, error, isValidUUID]);

  // Function to update group data
  const handleMemberUpdate = async () => {
    if (isValidUUID && !error) {
      try {
        console.log("useGroupDetails: Updating group data after member change");
        const updatedGroup = await fetchGroupDetails(id);
        if (updatedGroup) {
          setGroup(updatedGroup);
          console.log("useGroupDetails: Group data updated successfully");
        }
      } catch (error) {
        console.error("useGroupDetails: Failed to update group data:", error);
      }
    }
  };

  console.log("useGroupDetails: Returning state", {
    hasGroup: !!group,
    loading,
    error,
    membershipStatus,
    isValidId,
    isValidUUID
  });

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


import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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
  const [membershipStatus, setMembershipStatus] = useState<MembershipStatus>({
    isMember: false,
    isPending: false,
    isAdmin: false
  });
  const [hasPendingRequests, setHasPendingRequests] = useState(false);
  
  console.log("useGroupDetails: Hook called with", { id, userId: !!userId });
  
  // Validate ID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const isValidUUID = id && id.trim() !== '' && id !== ':id' && uuidRegex.test(id);
  
  console.log("useGroupDetails: ID validation", { id, isValidUUID });

  // Use React Query for group data with enabled condition
  const {
    data: group,
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['group-details', id],
    queryFn: async () => {
      console.log("useGroupDetails: Fetching group details for:", id);
      const groupData = await fetchGroupDetails(id);
      if (!groupData) {
        throw new Error("Group not found");
      }
      return groupData;
    },
    enabled: !!isValidUUID, // Only run query if we have a valid UUID
    retry: false, // Don't retry failed requests
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Check membership status when group data changes
  useEffect(() => {
    const checkMembership = async () => {
      if (userId && group && isValidUUID) {
        try {
          console.log("useGroupDetails: Checking membership for user:", userId, "in group:", group.id);
          const status = await checkMembershipStatus(userId, group.id);
          setMembershipStatus(status);
          console.log("useGroupDetails: Membership status:", status);
        } catch (error) {
          console.error("useGroupDetails: Failed to check membership status:", error);
        }
      }
    };
    
    checkMembership();
  }, [userId, group, isValidUUID]);
  
  // Check for pending requests
  useEffect(() => {
    const checkPendingRequests = async () => {
      if (userId && group && membershipStatus.isAdmin && isValidUUID) {
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
        }
      }
    };
    
    checkPendingRequests();
  }, [group, userId, membershipStatus.isAdmin, isValidUUID]);

  // Function to update group data
  const handleMemberUpdate = async () => {
    if (isValidUUID) {
      try {
        console.log("useGroupDetails: Updating group data after member change");
        await refetch();
        console.log("useGroupDetails: Group data updated successfully");
      } catch (error) {
        console.error("useGroupDetails: Failed to update group data:", error);
      }
    }
  };

  const errorMessage = error instanceof Error ? error.message : null;

  console.log("useGroupDetails: Returning state", {
    hasGroup: !!group,
    loading,
    error: errorMessage,
    membershipStatus,
    isValidUUID
  });

  return {
    group: group || null,
    loading,
    error: errorMessage,
    membershipStatus,
    hasPendingRequests,
    handleMemberUpdate,
    setGroup: () => {} // Keep for compatibility but use refetch instead
  };
}

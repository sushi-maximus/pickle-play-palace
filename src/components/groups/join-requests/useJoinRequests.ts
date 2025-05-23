
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { JoinRequest } from "./types";

export const useJoinRequests = (groupId: string) => {
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<JoinRequest | null>(null);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

  const fetchPendingRequests = async () => {
    setLoading(true);
    
    try {
      // Get all pending join requests for this group
      const { data: requestsData, error: requestsError } = await supabase
        .from("group_members")
        .select("id, user_id, status, request_message, joined_at")
        .eq("group_id", groupId)
        .eq("status", "pending");
        
      if (requestsError) {
        console.error("Error fetching join requests:", requestsError);
        toast.error("Failed to load join requests");
        return;
      }
      
      if (!requestsData || requestsData.length === 0) {
        setJoinRequests([]);
        setLoading(false);
        return;
      }
      
      // Get profiles for these users
      const userIds = requestsData.map(request => request.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, avatar_url")
        .in("id", userIds);
        
      if (profilesError) {
        console.error("Error fetching user profiles:", profilesError);
      }
      
      // Combine request data with profiles and map joined_at to created_at for type compatibility
      const requestsWithProfiles = requestsData.map(request => {
        const profile = profilesData?.find(p => p.id === request.user_id);
        return {
          ...request,
          created_at: request.joined_at, // Map joined_at to created_at for type compatibility
          profile
        };
      });
      
      setJoinRequests(requestsWithProfiles);
    } catch (error) {
      console.error("Error in fetchPendingRequests:", error);
      toast.error("Failed to load join requests");
    } finally {
      setLoading(false);
    }
  };

  // Use useEffect to call fetchPendingRequests when component mounts
  useEffect(() => {
    fetchPendingRequests();
  }, [groupId]);

  const handleAction = (request: JoinRequest, actionType: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setAction(actionType);
    setDialogOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedRequest || !action) return;
    
    setProcessingId(selectedRequest.id);
    
    try {
      if (action === 'approve') {
        const { error } = await supabase
          .from("group_members")
          .update({ status: "active" })
          .eq("id", selectedRequest.id);
          
        if (error) throw error;
        toast.success(`${selectedRequest.profile?.first_name} ${selectedRequest.profile?.last_name} has been added to the group`);
      } else {
        const { error } = await supabase
          .from("group_members")
          .delete()
          .eq("id", selectedRequest.id);
          
        if (error) throw error;
        toast.success(`Request from ${selectedRequest.profile?.first_name} ${selectedRequest.profile?.last_name} has been rejected`);
      }
      
      // Refresh the requests list
      fetchPendingRequests();
    } catch (error) {
      console.error(`Error ${action === 'approve' ? 'approving' : 'rejecting'} request:`, error);
      toast.error(`Failed to ${action} the request`);
    } finally {
      setProcessingId(null);
      setDialogOpen(false);
      setSelectedRequest(null);
      setAction(null);
    }
  };

  return {
    joinRequests,
    loading,
    processingId,
    dialogOpen,
    selectedRequest,
    action,
    handleAction,
    confirmAction,
    setDialogOpen
  };
};

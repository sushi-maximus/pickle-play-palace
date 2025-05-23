
import { useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, UserPlus, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getInitialsFromName } from "@/utils/stringUtils";
import { Avatar } from "@/components/ui/avatar";

interface JoinRequestsManagerProps {
  groupId: string;
  isAdmin: boolean;
}

interface JoinRequest {
  id: string;
  user_id: string;
  status: string;
  request_message?: string;
  created_at: string;
  profile?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  }
}

export const JoinRequestsManager = ({ groupId, isAdmin }: JoinRequestsManagerProps) => {
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<JoinRequest | null>(null);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

  useState(() => {
    fetchPendingRequests();
  }, [groupId]);

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
      
      // Combine request data with profiles
      const requestsWithProfiles = requestsData.map(request => {
        const profile = profilesData?.find(p => p.id === request.user_id);
        return {
          ...request,
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

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Join Requests
          </CardTitle>
          <CardDescription>
            Manage requests from users who want to join this group
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-6">Loading requests...</div>
          ) : joinRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pending join requests
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {joinRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                          <span>{getInitialsFromName(`${request.profile?.first_name} ${request.profile?.last_name}`)}</span>
                        </Avatar>
                        <span>{request.profile?.first_name} {request.profile?.last_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {request.request_message || <span className="text-muted-foreground italic">No message</span>}
                    </TableCell>
                    <TableCell>
                      {new Date(request.joined_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                          onClick={() => handleAction(request, 'approve')}
                          disabled={!!processingId}
                        >
                          <Check className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1 text-destructive border-destructive hover:bg-destructive/10"
                          onClick={() => handleAction(request, 'reject')}
                          disabled={!!processingId}
                        >
                          <X className="h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {action === 'approve' ? 'Approve Join Request' : 'Reject Join Request'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {action === 'approve' 
                ? `Are you sure you want to approve ${selectedRequest?.profile?.first_name} ${selectedRequest?.profile?.last_name}'s request to join this group?`
                : `Are you sure you want to reject ${selectedRequest?.profile?.first_name} ${selectedRequest?.profile?.last_name}'s request to join this group?`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={!!processingId}>
              Cancel
            </Button>
            <Button 
              onClick={confirmAction}
              disabled={!!processingId}
              variant={action === 'approve' ? 'default' : 'destructive'}
            >
              {processingId ? 'Processing...' : action === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

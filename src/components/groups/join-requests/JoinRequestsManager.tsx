
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { useJoinRequests } from "./useJoinRequests";
import { JoinRequestsTable } from "./JoinRequestsTable";
import { JoinRequestConfirmDialog } from "./JoinRequestConfirmDialog";

interface JoinRequestsManagerProps {
  groupId: string;
  isAdmin: boolean;
}

export const JoinRequestsManager = ({ groupId, isAdmin }: JoinRequestsManagerProps) => {
  const {
    joinRequests,
    loading,
    processingId,
    dialogOpen,
    selectedRequest,
    action,
    handleAction,
    confirmAction,
    setDialogOpen
  } = useJoinRequests(groupId);

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
            <JoinRequestsTable 
              requests={joinRequests} 
              onAction={handleAction} 
              processingId={processingId} 
            />
          )}
        </CardContent>
      </Card>

      <JoinRequestConfirmDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={confirmAction}
        selectedRequest={selectedRequest}
        action={action}
        isProcessing={!!processingId}
      />
    </div>
  );
};

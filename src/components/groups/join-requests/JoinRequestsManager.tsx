
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Users } from "lucide-react";
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

  // If no requests and not loading, don't render anything
  if (!loading && joinRequests.length === 0) {
    return null;
  }

  return (
    <>
      <Card className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-l-4 border-l-blue-500/30">
        <CardHeader className="px-3 py-4 md:px-6 md:py-6">
          <CardTitle className="flex items-center gap-2 text-sm md:text-base">
            <UserPlus className="h-4 w-4 text-blue-600" />
            Join Requests
            {joinRequests.length > 0 && (
              <span className="text-xs bg-blue-600 text-white rounded-full px-2 py-0.5">
                {joinRequests.length}
              </span>
            )}
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Manage requests from users who want to join this group
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 py-4 md:px-6 md:py-6 pt-0">
          {loading ? (
            <div className="text-center py-4 text-sm md:text-base text-muted-foreground">
              Loading requests...
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
    </>
  );
};

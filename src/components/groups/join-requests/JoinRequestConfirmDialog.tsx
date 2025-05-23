
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { JoinRequest } from "./types";

interface JoinRequestConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedRequest: JoinRequest | null;
  action: 'approve' | 'reject' | null;
  isProcessing: boolean;
}

export const JoinRequestConfirmDialog = ({ 
  isOpen,
  onClose,
  onConfirm,
  selectedRequest,
  action,
  isProcessing
}: JoinRequestConfirmDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
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
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={isProcessing}
            variant={action === 'approve' ? 'default' : 'destructive'}
          >
            {isProcessing ? 'Processing...' : action === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

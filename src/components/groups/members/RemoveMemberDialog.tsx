
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { removeMemberFromGroup } from "../utils"; // Updated import path
import { RemoveMemberDialogProps } from "./types";

export const RemoveMemberDialog = ({
  open,
  onOpenChange,
  member,
  groupId,
  onMemberUpdate,
}: RemoveMemberDialogProps) => {
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Handle removing a member
  const handleRemoveMember = async () => {
    if (!member) return;
    
    try {
      setActionLoading(true);
      await removeMemberFromGroup(member.id, groupId);
      toast.success("Member has been removed from the group");
      if (onMemberUpdate) onMemberUpdate();
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
    } finally {
      setActionLoading(false);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Remove Member
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove <strong>{member?.profiles.first_name} {member?.profiles.last_name}</strong> from this group? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={actionLoading}
            onClick={(e) => {
              e.preventDefault();
              handleRemoveMember();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {actionLoading ? "Removing..." : "Remove Member"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

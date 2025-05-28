
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
      <AlertDialogContent className="px-3 py-4 md:px-6 md:py-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-1 md:gap-2 text-sm md:text-base">
            <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-destructive" />
            Remove Member
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs md:text-sm">
            Are you sure you want to remove <strong>{member?.profile?.first_name} {member?.profile?.last_name}</strong> from this group? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-1 md:gap-2">
          <AlertDialogCancel 
            disabled={actionLoading}
            className="text-xs md:text-sm px-2 md:px-3"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={actionLoading}
            onClick={(e) => {
              e.preventDefault();
              handleRemoveMember();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs md:text-sm px-2 md:px-3"
          >
            {actionLoading ? "Removing..." : "Remove Member"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

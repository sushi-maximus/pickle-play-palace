
import { useState } from "react";
import { JoinRequestDialog } from "@/components/groups/JoinRequestDialog";

interface GroupJoinRequestProps {
  groupId: string;
  groupName: string;
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const GroupJoinRequest = ({ 
  groupId, 
  groupName, 
  userId, 
  isOpen, 
  onClose, 
  onSuccess 
}: GroupJoinRequestProps) => {
  return (
    <JoinRequestDialog
      groupId={groupId}
      groupName={groupName}
      userId={userId}
      isOpen={isOpen}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
};

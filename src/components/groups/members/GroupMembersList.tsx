
import { useState, useEffect } from "react";
import { GroupMembersListProps, GroupMember } from "./types";
import { GroupMemberCard } from "./GroupMemberCard";
import { RemoveMemberDialog } from "./RemoveMemberDialog";

export const GroupMembersList = ({ 
  members, 
  className, 
  isAdmin, 
  currentUserId, 
  groupId,
  onMemberUpdate 
}: GroupMembersListProps) => {
  const [openMemberId, setOpenMemberId] = useState<string | null>(null);
  const [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false);
  const [memberToRemove, setMemberToRemove] = useState<GroupMember | null>(null);
  
  useEffect(() => {
    // Event listener for member removal events
    const handleRemoveMemberEvent = (event: CustomEvent<GroupMember>) => {
      setMemberToRemove(event.detail);
      setRemoveDialogOpen(true);
    };

    // Add event listener with type casting
    document.addEventListener('removeMember', 
      handleRemoveMemberEvent as EventListener);

    // Cleanup listener on component unmount
    return () => {
      document.removeEventListener('removeMember', 
        handleRemoveMemberEvent as EventListener);
    };
  }, []);
  
  if (!members || members.length === 0) {
    return (
      <div className={`text-center py-6 ${className || ""}`}>
        <p className="text-muted-foreground">No members found</p>
      </div>
    );
  }

  // Sort members: admins first, then by join date
  const sortedMembers = [...members].sort((a, b) => {
    // Admins first
    if (a.role === "admin" && b.role !== "admin") return -1;
    if (a.role !== "admin" && b.role === "admin") return 1;
    
    // Then by join date (newest first)
    return new Date(b.joined_at).getTime() - new Date(a.joined_at).getTime();
  });

  return (
    <>
      <div className={`space-y-4 ${className || ""}`}>
        {sortedMembers.map((member) => (
          <GroupMemberCard
            key={member.id}
            member={member}
            isAdmin={isAdmin}
            currentUserId={currentUserId}
            groupId={groupId}
            onMemberUpdate={onMemberUpdate}
            isOpen={openMemberId === member.id}
            onOpenChange={setOpenMemberId}
          />
        ))}
      </div>

      {/* Confirmation dialog for removing a member */}
      <RemoveMemberDialog
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        member={memberToRemove}
        groupId={groupId}
        onMemberUpdate={onMemberUpdate}
      />
    </>
  );
};


import { useState, useEffect } from "react";
import { Users } from "lucide-react";
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
      <div className={`text-center py-8 sm:py-12 ${className || ""}`}>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8 animate-fade-in">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No members yet
              </h3>
              <p className="text-sm text-gray-600 max-w-sm">
                This group is just getting started. Be the first to join and connect with other players!
              </p>
            </div>
          </div>
        </div>
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
      <div className={`space-y-3 md:space-y-4 ${className || ""}`}>
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

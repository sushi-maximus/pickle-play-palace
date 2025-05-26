
import { useState, useEffect } from "react";
import { Users, UserPlus, Sparkles } from "lucide-react";
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
        {/* Enhanced Facebook-style empty state */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 animate-fade-in transform transition-all duration-300 hover:shadow-md">
          <div className="flex flex-col items-center space-y-4">
            {/* Enhanced icon with gradient background */}
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center ring-4 ring-blue-50 ring-opacity-50">
                <Users className="h-10 w-10 text-blue-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>
            
            <div className="text-center space-y-3">
              <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
                No members yet
              </h3>
              <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
                This group is just getting started. Invite friends to join and build an amazing community together!
              </p>
            </div>
            
            {/* Enhanced call-to-action */}
            <div className="pt-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
                <UserPlus className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Share group code to invite members</span>
              </div>
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
        {sortedMembers.map((member, index) => (
          <div
            key={member.id}
            className="transform transition-all duration-200 ease-out"
            style={{
              animationDelay: `${index * 50}ms`
            }}
          >
            <GroupMemberCard
              member={member}
              isAdmin={isAdmin}
              currentUserId={currentUserId}
              groupId={groupId}
              onMemberUpdate={onMemberUpdate}
              isOpen={openMemberId === member.id}
              onOpenChange={setOpenMemberId}
            />
          </div>
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

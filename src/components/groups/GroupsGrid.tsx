
import { GroupWithMemberCount } from "@/types/group";
import { GroupCard } from "./GroupCard";
import { Loader2 } from "lucide-react";

interface GroupsGridProps {
  groups: GroupWithMemberCount[];
  myGroupIds: string[];
  loading: boolean;
  emptyMessage: string;
  searchQuery: string;
  onJoinGroup: (groupId: string) => Promise<void>;
  onLeaveGroup: (groupId: string) => Promise<void>;
}

export function GroupsGrid({ 
  groups,
  myGroupIds,
  loading,
  emptyMessage,
  searchQuery,
  onJoinGroup,
  onLeaveGroup
}: GroupsGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No groups found</h3>
        <p className="text-muted-foreground mt-1">
          {searchQuery ? `No groups matching "${searchQuery}"` : emptyMessage}
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map(group => (
        <GroupCard
          key={group.id}
          group={group}
          isMember={myGroupIds.includes(group.id)}
          onJoin={onJoinGroup}
          onLeave={onLeaveGroup}
        />
      ))}
    </div>
  );
}

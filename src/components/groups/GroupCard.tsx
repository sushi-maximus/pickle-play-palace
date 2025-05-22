
import { GroupWithMemberCount } from "@/types/group";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface GroupCardProps {
  group: GroupWithMemberCount;
  isMember: boolean;
  onJoin: (groupId: string) => Promise<void>;
  onLeave: (groupId: string) => Promise<void>;
}

export function GroupCard({ group, isMember, onJoin, onLeave }: GroupCardProps) {
  const navigate = useNavigate();
  
  return (
    <div 
      className="border rounded-lg p-4 hover:shadow-md transition"
      onClick={() => navigate(`/groups/${group.id}`)}
    >
      <h3 className="font-semibold text-lg">{group.name}</h3>
      {group.description && (
        <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
          {group.description}
        </p>
      )}
      <div className="flex items-center mt-4">
        <span className="text-sm text-muted-foreground">
          {group.member_count} members
        </span>
        <Button 
          size="sm" 
          variant="outline" 
          className="ml-auto"
          onClick={(e) => {
            e.stopPropagation();
            isMember 
              ? onLeave(group.id)
              : onJoin(group.id);
          }}
        >
          {isMember ? "Leave" : "Join"}
        </Button>
      </div>
    </div>
  );
}

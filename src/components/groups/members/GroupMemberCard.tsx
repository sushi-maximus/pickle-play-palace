
import { User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import { MemberHoverCard } from "./MemberHoverCard";
import { GroupMemberCardProps } from "./types";

export const GroupMemberCard = ({ 
  member,
  isAdmin,
  currentUserId,
  groupId,
  onMemberUpdate,
  onOpenChange,
  isOpen
}: GroupMemberCardProps) => {
  return (
    <HoverCard 
      open={isOpen}
      onOpenChange={(open) => {
        // Only handle close events from the HoverCard component
        if (!open) {
          onOpenChange(null);
        }
      }}
    >
      <HoverCardTrigger asChild>
        <div 
          className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/10 cursor-pointer transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenChange(isOpen ? null : member.id);
          }}
        >
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={member.profiles.avatar_url || ""} 
                alt={`${member.profiles.first_name} ${member.profiles.last_name}`}
              />
              <AvatarFallback className="bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="font-medium flex items-center gap-2">
                <span>{member.profiles.first_name} {member.profiles.last_name}</span>
                {member.role === "admin" && (
                  <Badge className="text-xs">Admin</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Joined {formatDistanceToNow(new Date(member.joined_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>
      </HoverCardTrigger>
      
      {isOpen && (
        <MemberHoverCard
          member={member}
          isAdmin={isAdmin}
          currentUserId={currentUserId}
          groupId={groupId}
          onMemberUpdate={onMemberUpdate}
          onClose={() => onOpenChange(null)}
        />
      )}
    </HoverCard>
  );
};

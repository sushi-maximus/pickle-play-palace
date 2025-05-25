
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
          className="bg-white shadow-sm rounded-lg px-3 py-4 md:px-6 md:py-8 hover:shadow-md cursor-pointer transition-all duration-200"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenChange(isOpen ? null : member.id);
          }}
        >
          <div className="flex items-center space-x-2 md:space-x-3">
            <Avatar className="h-8 w-8 md:h-10 md:w-10">
              <AvatarImage 
                src={member.profiles.avatar_url || ""} 
                alt={`${member.profiles.first_name} ${member.profiles.last_name}`}
              />
              <AvatarFallback className="bg-primary/10">
                <User className="h-3 w-3 md:h-4 md:w-4 text-primary" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm md:text-base">
                  {member.profiles.first_name} {member.profiles.last_name}
                </span>
                {member.role === "admin" && (
                  <Badge className="text-xs">Admin</Badge>
                )}
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
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

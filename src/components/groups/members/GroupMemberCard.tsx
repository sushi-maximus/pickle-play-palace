
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
          className="bg-white shadow-sm rounded-lg px-3 py-4 sm:px-4 sm:py-5 hover:shadow-md cursor-pointer transition-all duration-200 min-h-[60px] sm:min-h-[72px] animate-fade-in"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenChange(isOpen ? null : member.id);
          }}
        >
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
              <AvatarImage 
                src={member.profiles.avatar_url || ""} 
                alt={`${member.profiles.first_name} ${member.profiles.last_name}`}
              />
              <AvatarFallback className="bg-primary/10">
                <User className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm sm:text-base text-gray-900 truncate">
                  {member.profiles.first_name} {member.profiles.last_name}
                </span>
                {member.role === "admin" && (
                  <Badge className="text-xs font-medium flex-shrink-0">Admin</Badge>
                )}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
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

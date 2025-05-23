import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { formatDistanceToNow, differenceInYears } from "date-fns";
import { 
  HoverCard, 
  HoverCardTrigger, 
  HoverCardContent 
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getSkillLevelColor } from "@/lib/constants/skill-levels";
import { useIsMobile } from "@/hooks/use-mobile";

type GroupMember = {
  id: string;
  role: "admin" | "member";
  joined_at: string;
  user_id: string;
  profiles: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
    skill_level?: string;
    dupr_rating?: number | null;
    birthday?: string | null;
  };
};

type GroupMembersListProps = {
  members: GroupMember[];
  className?: string;
};

export const GroupMembersList = ({ members, className }: GroupMembersListProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [openMemberId, setOpenMemberId] = useState<string | null>(null);

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

  // Calculate age from birthday
  const calculateAge = (birthday: string | null | undefined) => {
    if (!birthday) return null;
    return differenceInYears(new Date(), new Date(birthday));
  };

  // Get skill or DUPR rating display
  const getRatingDisplay = (member: GroupMember) => {
    if (member.profiles.dupr_rating) {
      return { label: "DUPR", value: member.profiles.dupr_rating };
    } else {
      return { label: "Skill Level", value: member.profiles.skill_level || "2.5" };
    }
  };

  return (
    <div className={`space-y-4 ${className || ""}`}>
      {sortedMembers.map((member) => (
        <HoverCard 
          key={member.id} 
          open={openMemberId === member.id}
          onOpenChange={(open) => {
            // Only handle close events from the HoverCard component
            // Open events are controlled by the onClick handler on the trigger element
            if (!open) {
              setOpenMemberId(null);
            }
          }}
        >
          <HoverCardTrigger asChild>
            <div 
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/10 cursor-pointer transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpenMemberId(openMemberId === member.id ? null : member.id);
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
              
              <Badge variant={member.role === "admin" ? "default" : "outline"} className="capitalize">
                {member.role}
              </Badge>
            </div>
          </HoverCardTrigger>
          
          <HoverCardContent className="w-80 p-0 fixed-center-popup" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col">
              <div className="flex items-center gap-4 p-4">
                <Avatar className="h-16 w-16 border-2" style={{ 
                  borderColor: getSkillLevelColor(member.profiles.dupr_rating, member.profiles.skill_level) 
                }}>
                  <AvatarImage 
                    src={member.profiles.avatar_url || ""} 
                    alt={`${member.profiles.first_name} ${member.profiles.last_name}`}
                  />
                  <AvatarFallback className="bg-primary/10 text-lg">
                    {member.profiles.first_name?.charAt(0)}{member.profiles.last_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="font-medium text-lg">
                    {member.profiles.first_name} {member.profiles.last_name}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {/* Skill Level or DUPR Rating */}
                    {getRatingDisplay(member).value && (
                      <Badge variant="outline" className="bg-primary/5">
                        {getRatingDisplay(member).label}: {getRatingDisplay(member).value}
                      </Badge>
                    )}
                    
                    {/* Age (if available) */}
                    {member.profiles.birthday && (
                      <Badge variant="outline" className="bg-secondary/5">
                        Age: {calculateAge(member.profiles.birthday)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="border-t p-3 bg-muted/30 flex justify-end">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setOpenMemberId(null);
                    navigate(`/profile/${member.user_id}`);
                  }}
                >
                  View Full Profile
                </Button>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
};

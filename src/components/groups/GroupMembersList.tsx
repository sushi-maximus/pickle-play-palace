
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
  };
};

type GroupMembersListProps = {
  members: GroupMember[];
  className?: string;
};

export const GroupMembersList = ({ members, className }: GroupMembersListProps) => {
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
    <div className={`space-y-4 ${className || ""}`}>
      {sortedMembers.map((member) => (
        <div 
          key={member.id}
          className="flex items-center justify-between p-3 rounded-lg border bg-card"
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
      ))}
    </div>
  );
};

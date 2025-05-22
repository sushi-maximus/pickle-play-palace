
import { Group } from "@/types/group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitialsFromName } from "@/utils/stringUtils";
import { MapPin, Users, Calendar, Shield, Lock, Unlock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface GroupHeaderProps {
  group: Group;
  memberCount: number;
  isAdmin: boolean;
}

export const GroupHeader = ({ group, memberCount, isAdmin }: GroupHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start p-6 bg-card rounded-lg shadow-sm border border-border">
      <Avatar className="h-24 w-24 border-2 border-border">
        <AvatarImage src={group.avatar_url || ""} alt={group.name} />
        <AvatarFallback className="text-xl">
          {getInitialsFromName(group.name)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-2">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {group.name}
              {group.is_private && <Lock className="h-4 w-4 text-amber-500" />}
              {!group.is_private && <Unlock className="h-4 w-4 text-emerald-500" />}
            </h1>
            {isAdmin && (
              <div className="inline-flex items-center text-xs font-medium mt-1 bg-primary/10 text-primary px-2 py-1 rounded">
                <Shield className="h-3 w-3 mr-1" /> Admin
              </div>
            )}
          </div>
        </div>
        
        <p className="mt-2 text-muted-foreground">
          {group.description || "No description provided."}
        </p>
        
        <div className="flex flex-wrap gap-4 mt-4">
          {group.location && (
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{group.location}</span>
            </div>
          )}
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-1" />
            <span>{memberCount} {memberCount === 1 ? "member" : "members"}</span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Created {formatDistanceToNow(new Date(group.created_at), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

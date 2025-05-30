
import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, MapPin } from "lucide-react";
import { OptimizedNavLink } from "@/components/navigation/OptimizedNavLink";
import type { Database } from "@/integrations/supabase/types";
import type { GroupMember } from "../members/types";

type Group = Database['public']['Tables']['groups']['Row'] & {
  members?: GroupMember[];
  member_count: number;
};

interface GroupCardHybrid1Props {
  group: Group;
  isAdmin?: boolean;
  className?: string;
}

const GroupCardHybrid1Component = ({ 
  group, 
  isAdmin = false, 
  className = "" 
}: GroupCardHybrid1Props) => {
  console.log("GroupCardHybrid1: Rendering group card for group:", group.id, group.name);

  return (
    <Card className={`group relative overflow-hidden border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${className}`}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: group.avatar_url 
            ? `url(${group.avatar_url})` 
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <CardContent className="relative z-10 p-6 text-white">
        {/* Header with badges */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Users className="w-3 h-3 mr-1" />
              {group.is_private ? 'Private' : 'Public'}
            </Badge>
            {isAdmin && (
              <Badge variant="secondary" className="bg-green-500/80 text-white border-green-400/50 backdrop-blur-sm">
                Admin
              </Badge>
            )}
          </div>
          
          {/* User avatar placeholder */}
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <span className="text-sm font-semibold">
              {group.name?.substring(0, 2).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{group.member_count || 0}</div>
            <div className="text-sm text-white/80">Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">24</div>
            <div className="text-sm text-white/80">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-white/80">Events</div>
          </div>
        </div>

        {/* Group Info */}
        <div className="space-y-2 mb-6">
          <h3 className="text-xl font-bold leading-tight">{group.name}</h3>
          
          {group.location && (
            <div className="flex items-center text-sm text-white/90">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{group.location}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <OptimizedNavLink 
          to={`/groups/${group.id}`}
          className="block w-full"
        >
          <Button 
            className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-200"
            size="lg"
          >
            View Group
          </Button>
        </OptimizedNavLink>
      </CardContent>
    </Card>
  );
};

export const GroupCardHybrid1 = memo(GroupCardHybrid1Component);

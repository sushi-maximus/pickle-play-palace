
import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MapPin, TrendingUp } from "lucide-react";
import { OptimizedNavLink } from "@/components/navigation/OptimizedNavLink";
import type { GroupCardProps } from "./types/GroupCardTypes";

const GroupCardHybrid3Component = ({ 
  group, 
  isAdmin = false, 
  className = "" 
}: GroupCardProps) => {
  return (
    <Card className={`group overflow-hidden border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${className}`}>
      {/* Header Image */}
      <div 
        className="relative h-32 bg-cover bg-center"
        style={{
          backgroundImage: group.avatar_url 
            ? `url(${group.avatar_url})` 
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute top-4 left-4 flex gap-2">
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
      </div>

      <CardContent className="p-6">
        {/* Group Info */}
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">{group.name}</h3>
          {group.location && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{group.location}</span>
            </div>
          )}
        </div>

        {/* Horizontal Stats */}
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">{group.member_count || 0} Members</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium">16 Posts</span>
          </div>
        </div>

        {/* Action Button */}
        <OptimizedNavLink 
          to={`/groups/${group.id}`}
          className="block w-full"
        >
          <Button className="w-full">
            View Group
          </Button>
        </OptimizedNavLink>
      </CardContent>
    </Card>
  );
};

export const GroupCardHybrid3 = memo(GroupCardHybrid3Component);

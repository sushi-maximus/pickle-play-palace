
import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Clock } from "lucide-react";
import { OptimizedNavLink } from "@/components/navigation/OptimizedNavLink";
import type { GroupCardProps } from "./types/GroupCardTypes";

const GroupCardHybrid2Component = ({ 
  group, 
  isAdmin = false, 
  className = "" 
}: GroupCardProps) => {
  return (
    <Card className={`group overflow-hidden border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${className}`}>
      <div className="grid grid-cols-2 h-64">
        {/* Left side - Image */}
        <div 
          className="relative bg-cover bg-center"
          style={{
            backgroundImage: group.avatar_url 
              ? `url(${group.avatar_url})` 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              {group.is_private ? 'Private' : 'Public'}
            </Badge>
          </div>
        </div>

        {/* Right side - Content */}
        <CardContent className="p-6 flex flex-col justify-between">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-bold leading-tight">{group.name}</h3>
              {isAdmin && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Admin
                </Badge>
              )}
            </div>
            
            {group.location && (
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="truncate">{group.location}</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{group.member_count || 0}</div>
              <div className="text-xs text-gray-500">Members</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">18</div>
              <div className="text-xs text-gray-500">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">8</div>
              <div className="text-xs text-gray-500">Events</div>
            </div>
          </div>

          {/* Action */}
          <OptimizedNavLink 
            to={`/groups/${group.id}`}
            className="block w-full"
          >
            <Button className="w-full" size="sm">
              View Group
            </Button>
          </OptimizedNavLink>
        </CardContent>
      </div>
    </Card>
  );
};

export const GroupCardHybrid2 = memo(GroupCardHybrid2Component);

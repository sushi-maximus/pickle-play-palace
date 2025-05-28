
import { memo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Calendar, Lock, Globe } from "lucide-react";
import { OptimizedNavLink } from "@/components/navigation/OptimizedNavLink";
import type { GroupCardProps } from "./types/GroupCardTypes";

const OptimizedGroupCardHybrid1Component = ({ 
  group, 
  isMember = false, 
  isAdmin = false, 
  className = "" 
}: GroupCardProps) => {
  const memberCount = group.member_count || 0;
  const privacyIcon = group.is_private ? Lock : Globe;
  const privacyLabel = group.is_private ? 'Private group' : 'Public group';
  
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      // The OptimizedNavLink will handle the navigation
      const linkElement = event.currentTarget.querySelector('a');
      if (linkElement) {
        linkElement.click();
      }
    }
  }, []);

  return (
    <Card 
      className={`group overflow-hidden border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${className}`}
      role="article"
      aria-labelledby={`group-name-${group.id}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Background Image with accessibility improvements */}
      <div 
        className="relative h-48 bg-cover bg-center"
        style={{
          backgroundImage: group.avatar_url 
            ? `url(${group.avatar_url})` 
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
        role="img"
        aria-label={`${group.name} group cover image`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Privacy and membership badges with improved accessibility */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge 
            variant="secondary" 
            className="bg-white/20 text-white border-white/30 backdrop-blur-sm"
            aria-label={privacyLabel}
          >
            {React.createElement(privacyIcon, { 
              className: "w-3 h-3 mr-1", 
              'aria-hidden': true 
            })}
            {group.is_private ? 'Private' : 'Public'}
          </Badge>
          {isMember && (
            <Badge 
              variant="secondary" 
              className="bg-green-500/80 text-white border-green-400/50 backdrop-blur-sm"
              aria-label="You are a member of this group"
            >
              Member
            </Badge>
          )}
          {isAdmin && (
            <Badge 
              variant="secondary" 
              className="bg-blue-500/80 text-white border-blue-400/50 backdrop-blur-sm"
              aria-label="You are an admin of this group"
            >
              Admin
            </Badge>
          )}
        </div>
        
        {/* Stats Grid with accessibility */}
        <div 
          className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-3 p-3 rounded-lg bg-black/40 backdrop-blur-sm"
          role="region"
          aria-label="Group statistics"
        >
          <div className="text-center">
            <div className="text-lg font-bold text-white" aria-label={`${memberCount} members`}>
              {memberCount}
            </div>
            <div className="text-xs text-white/80" aria-hidden="true">Members</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white" aria-label="12 posts">12</div>
            <div className="text-xs text-white/80" aria-hidden="true">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white" aria-label="5 events">5</div>
            <div className="text-xs text-white/80" aria-hidden="true">Events</div>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Group Info with semantic markup */}
        <div className="mb-4">
          <h3 
            id={`group-name-${group.id}`}
            className="text-xl font-bold mb-2"
          >
            {group.name}
          </h3>
          {group.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {group.description}
            </p>
          )}
          {group.location && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" aria-hidden="true" />
              <span>{group.location}</span>
            </div>
          )}
        </div>

        {/* Action Button with accessibility */}
        <OptimizedNavLink 
          to={`/groups/${group.id}`}
          className="block w-full"
          aria-label={`View details for ${group.name} group`}
        >
          <Button 
            className="w-full"
            aria-describedby={`group-name-${group.id}`}
          >
            View Group
          </Button>
        </OptimizedNavLink>
      </CardContent>
    </Card>
  );
};

export const OptimizedGroupCardHybrid1 = memo(OptimizedGroupCardHybrid1Component);

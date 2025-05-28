
import React, { memo, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Users, Globe, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { GroupCardHybridProps } from "./types/GroupCardTypes";

const OptimizedGroupCardHybrid1 = memo(({ group, isMember = false, isAdmin = false }: GroupCardHybridProps) => {
  const navigate = useNavigate();
  
  // Memoize all computed values to prevent recalculation
  const memberCount = useMemo(() => group.member_count || 0, [group.member_count]);
  const postCount = useMemo(() => Math.floor(memberCount * 0.27) || 24, [memberCount]);
  const eventCount = useMemo(() => Math.floor(memberCount * 0.13) || 12, [memberCount]);
  
  const initials = useMemo(() => 
    group.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  , [group.name]);

  const defaultBackgroundImage = useMemo(() => 
    group.avatar_url || "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=300&fit=crop&v=2"
  , [group.avatar_url]);

  const backgroundStyle = useMemo(() => ({
    backgroundImage: `url(${defaultBackgroundImage})`
  }), [defaultBackgroundImage]);

  // Memoize badge content
  const privacyBadgeContent = useMemo(() => (
    group.is_private ? (
      <>
        <Lock className="h-3 w-3 mr-1" />
        Private
      </>
    ) : (
      <>
        <Globe className="h-3 w-3 mr-1" />
        Public
      </>
    )
  ), [group.is_private]);

  const membershipBadgeContent = useMemo(() => {
    if (!isMember) return null;
    return (
      <Badge variant="outline" className="bg-green-500/90 border-green-400/30 text-white">
        <CheckCircle className="h-3 w-3 mr-1" />
        {isAdmin ? 'Admin' : 'Member'}
      </Badge>
    );
  }, [isMember, isAdmin]);

  // Memoize event handlers to prevent recreation
  const handleCardClick = useCallback(() => {
    navigate(`/groups/${group.id}`);
  }, [navigate, group.id]);

  const handleJoinClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Join button clicked for group:", group.id);
  }, [group.id]);

  const handleButtonClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  // Memoize button content and handler
  const buttonContent = useMemo(() => {
    if (isMember) {
      return {
        className: "w-full bg-green-500/20 text-white border border-green-400/30 hover:bg-green-500/30",
        onClick: handleButtonClick,
        text: "View Group"
      };
    }
    return {
      className: "w-full bg-white text-black hover:bg-white/90",
      onClick: handleJoinClick,
      text: group.is_private ? "Request to Join" : "Join Group"
    };
  }, [isMember, group.is_private, handleButtonClick, handleJoinClick]);

  return (
    <Card 
      className="h-80 overflow-hidden relative group cursor-pointer hover:shadow-xl transition-all duration-300 border-0"
      onClick={handleCardClick}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={backgroundStyle}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20" />
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6">
        {/* Top Section */}
        <div className="flex justify-between items-start">
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-white/20 border-white/30 text-white">
              {privacyBadgeContent}
            </Badge>
            {membershipBadgeContent}
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            {initials}
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
          <div className="text-center">
            <div className="text-xl font-bold text-white">{memberCount}</div>
            <div className="text-xs text-white/80">Members</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">{postCount}</div>
            <div className="text-xs text-white/80">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">{eventCount}</div>
            <div className="text-xs text-white/80">Events</div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="space-y-3">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">{group.name}</h3>
            <div className="flex items-center gap-1 text-white/80 text-sm">
              <Users className="h-4 w-4" />
              <span>{group.location || "Location not specified"}</span>
            </div>
          </div>
          
          <Button 
            className={buttonContent.className}
            onClick={buttonContent.onClick}
          >
            {buttonContent.text}
          </Button>
        </div>
      </div>
    </Card>
  );
});

OptimizedGroupCardHybrid1.displayName = "OptimizedGroupCardHybrid1";

// Enhanced memoization with specific prop comparison
export const OptimizedGroupCardHybrid1Memo = memo(OptimizedGroupCardHybrid1, (prevProps, nextProps) => {
  // Compare group properties that affect rendering
  if (
    prevProps.group.id !== nextProps.group.id ||
    prevProps.group.name !== nextProps.group.name ||
    prevProps.group.location !== nextProps.group.location ||
    prevProps.group.avatar_url !== nextProps.group.avatar_url ||
    prevProps.group.member_count !== nextProps.group.member_count ||
    prevProps.group.is_private !== nextProps.group.is_private
  ) {
    return false;
  }

  // Compare membership status
  if (
    prevProps.isMember !== nextProps.isMember ||
    prevProps.isAdmin !== nextProps.isAdmin
  ) {
    return false;
  }

  return true;
});

// Export the enhanced memoized version
export { OptimizedGroupCardHybrid1Memo as OptimizedGroupCardHybrid1 };


import React, { memo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Users, MessageCircle, Calendar, Globe, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { UnifiedGroup } from "../hooks/types/unifiedGroupTypes";

interface GroupCardHybrid1Props {
  group?: UnifiedGroup;
  isMember?: boolean;
}

const OptimizedGroupCardHybrid1 = memo(({ group, isMember = false }: GroupCardHybrid1Props) => {
  const navigate = useNavigate();
  
  // Memoize the card data to prevent unnecessary recalculations
  const cardData = React.useMemo(() => group || {
    id: "demo",
    name: "Tennis Club Downtown",
    description: "A community for tennis enthusiasts",
    location: "New York, NY",
    is_private: true,
    member_count: 89,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: "demo-user",
    avatar_url: null,
    skill_level_min: null,
    skill_level_max: null,
    max_members: null,
    isMember: false,
    membershipRole: undefined,
    membershipId: undefined
  }, [group]);

  // Memoize computed values
  const isUserMember = React.useMemo(() => group ? group.isMember : isMember, [group, isMember]);
  const membershipRole = React.useMemo(() => group?.membershipRole, [group?.membershipRole]);
  
  const memberCount = React.useMemo(() => cardData.member_count || 89, [cardData.member_count]);
  const postCount = React.useMemo(() => Math.floor(memberCount * 0.27) || 24, [memberCount]);
  const eventCount = React.useMemo(() => Math.floor(memberCount * 0.13) || 12, [memberCount]);
  
  const initials = React.useMemo(() => 
    cardData.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  , [cardData.name]);

  const defaultBackgroundImage = React.useMemo(() => 
    "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=300&fit=crop&v=2"
  , []);

  // Memoize event handlers
  const handleCardClick = useCallback(() => {
    navigate(`/groups/${cardData.id}`);
  }, [navigate, cardData.id]);

  const handleJoinClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Join button clicked for group:", cardData.id);
  }, [cardData.id]);

  const handleButtonClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <Card 
      className="h-80 overflow-hidden relative group cursor-pointer hover:shadow-xl transition-all duration-300 border-0"
      onClick={handleCardClick}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${defaultBackgroundImage})`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20" />
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6">
        {/* Top Section */}
        <div className="flex justify-between items-start">
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-white/20 border-white/30 text-white">
              {cardData.is_private ? (
                <>
                  <Lock className="h-3 w-3 mr-1" />
                  Private
                </>
              ) : (
                <>
                  <Globe className="h-3 w-3 mr-1" />
                  Public
                </>
              )}
            </Badge>
            {isUserMember && (
              <Badge variant="outline" className="bg-green-500/90 border-green-400/30 text-white">
                <CheckCircle className="h-3 w-3 mr-1" />
                {membershipRole === 'admin' ? 'Admin' : 'Member'}
              </Badge>
            )}
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
            <h3 className="text-2xl font-bold text-white mb-2">{cardData.name}</h3>
            <div className="flex items-center gap-1 text-white/80 text-sm">
              <Users className="h-4 w-4" />
              <span>{cardData.location || "Location not specified"}</span>
            </div>
          </div>
          
          {isUserMember ? (
            <Button 
              className="w-full bg-green-500/20 text-white border border-green-400/30 hover:bg-green-500/30"
              onClick={handleButtonClick}
            >
              View Group
            </Button>
          ) : (
            <Button 
              className="w-full bg-white text-black hover:bg-white/90"
              onClick={handleJoinClick}
            >
              {cardData.is_private ? "Request to Join" : "Join Group"}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
});

OptimizedGroupCardHybrid1.displayName = "OptimizedGroupCardHybrid1";

export { OptimizedGroupCardHybrid1 };

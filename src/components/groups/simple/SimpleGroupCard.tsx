
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MessageCircle, Calendar, MapPin, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";

type Group = Database['public']['Tables']['groups']['Row'];

interface SimpleGroupCardProps {
  group: Group;
}

export const SimpleGroupCard = ({ group }: SimpleGroupCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/groups/${group.id}`);
  };

  const getGroupInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="h-80 overflow-hidden relative group cursor-pointer hover:shadow-xl transition-all duration-300 border-0">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: group.avatar_url 
            ? `url(${group.avatar_url})` 
            : 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)'
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      {/* Content Overlay */}
      <CardContent className="relative z-10 h-full flex flex-col p-6 text-white">
        {/* Header with badges and avatar */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-white/20 border-white/30 text-white backdrop-blur-sm">
              {group.is_private ? (
                <>
                  <Lock className="h-3 w-3 mr-1" />
                  Private
                </>
              ) : (
                <>@ Public</>
              )}
            </Badge>
            {/* Admin badge - would need actual admin check */}
            <Badge variant="outline" className="bg-green-500/80 border-green-400/50 text-white backdrop-blur-sm">
              Admin
            </Badge>
          </div>
          
          {/* User avatar */}
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
            {getGroupInitials(group.name)}
          </div>
        </div>

        {/* Stats Grid */}
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
        <div className="mt-auto">
          <Button 
            onClick={handleCardClick}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            View Group
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

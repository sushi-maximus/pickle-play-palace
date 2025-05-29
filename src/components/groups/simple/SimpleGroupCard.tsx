
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Lock } from "lucide-react";
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
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] bg-white h-48 md:h-52"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2 md:pb-3">
        <div className="flex items-start gap-2 md:gap-3">
          <Avatar className="h-10 w-10 md:h-12 md:w-12">
            <AvatarImage src={group.avatar_url || undefined} alt={group.name} />
            <AvatarFallback className="bg-blue-500 text-white text-xs md:text-sm font-medium">
              {getGroupInitials(group.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 md:gap-2 mb-1">
              <h3 className="font-semibold text-sm md:text-base text-gray-900 truncate">
                {group.name}
              </h3>
              {group.is_private && (
                <Lock className="h-3 w-3 md:h-4 md:w-4 text-gray-500 flex-shrink-0" />
              )}
            </div>
            {group.location && (
              <div className="flex items-center gap-1 text-xs md:text-sm text-gray-600">
                <MapPin className="h-2 w-2 md:h-3 md:w-3" />
                <span className="truncate">{group.location}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 pb-2 md:pb-3">
        {group.description && (
          <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3 line-clamp-2">
            {group.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs md:text-sm text-gray-600">
            <Users className="h-3 w-3 md:h-4 md:w-4" />
            <span>{group.member_count || 0} member{(group.member_count || 0) !== 1 ? 's' : ''}</span>
          </div>
          
          {(group.skill_level_min || group.skill_level_max) && (
            <Badge variant="secondary" className="text-xs">
              {group.skill_level_min && group.skill_level_max && group.skill_level_min !== group.skill_level_max
                ? `${group.skill_level_min} - ${group.skill_level_max}`
                : group.skill_level_min || group.skill_level_max}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

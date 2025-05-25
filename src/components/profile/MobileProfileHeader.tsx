
import { ProfileAvatar } from "./ProfileAvatar";
import { skillLevelColors, getSkillLevelColor } from "@/lib/constants/skill-levels";
import { differenceInYears } from "date-fns";
import { ExternalLink, HelpCircle } from "lucide-react";
import { useTouchFeedback } from "@/hooks/useTouchFeedback";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

interface MobileProfileHeaderProps {
  profile: Profile;
}

export const MobileProfileHeader = ({ profile }: MobileProfileHeaderProps) => {
  const { isPressed: isTooltipPressed, touchProps: tooltipTouchProps } = useTouchFeedback();
  const { isPressed: isLinkPressed, touchProps: linkTouchProps } = useTouchFeedback();

  // Calculate age from birthday
  const calculateAge = () => {
    if (profile?.birthday) {
      const birthdayDate = new Date(profile.birthday);
      return differenceInYears(new Date(), birthdayDate);
    }
    return null;
  };

  // Get user initials from profile data
  const getInitials = () => {
    const firstName = profile?.first_name || '';
    const lastName = profile?.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Determine rating display
  const getRatingDisplay = () => {
    if (profile?.dupr_rating) {
      return { label: "DUPR", value: profile.dupr_rating };
    } else {
      return { label: "Skill Level", value: profile?.skill_level || "2.5" };
    }
  };

  const age = calculateAge();
  const ratingDisplay = getRatingDisplay();

  // Get the appropriate color based on DUPR or skill level
  const skillLevelColor = getSkillLevelColor(profile?.dupr_rating, profile?.skill_level);

  return (
    <div className="bg-white border border-gray-200 border-l-primary/30 border-l-4 hover:shadow-md transition-all duration-300 hover-lift rounded-lg p-4 mb-3 md:hidden animate-scale-in">
      <div className="flex flex-col items-center text-center space-y-3">
        {/* Avatar */}
        <div className="relative animate-fade-in">
          <ProfileAvatar 
            userId={profile.id}
            avatarUrl={profile.avatar_url}
            getInitials={getInitials}
          />
        </div>
        
        {/* Name */}
        <div className="animate-slide-in">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 leading-tight">
            {profile?.first_name} {profile?.last_name}
          </h2>
        </div>
        
        {/* Stats Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 animate-fade-in">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={`bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1 cursor-help leading-tight transition-all duration-150 hover-scale ${
                    isTooltipPressed ? 'scale-95 bg-primary/20' : ''
                  }`}
                  style={{ borderLeft: `3px solid ${skillLevelColor}` }}
                  {...tooltipTouchProps}
                >
                  {ratingDisplay.label}: {ratingDisplay.value}
                  <HelpCircle className="h-3 w-3 opacity-70" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="w-64 p-0">
                <div className="p-3">
                  <p className="text-sm font-medium mb-2 leading-tight">Skill Level Color Guide</p>
                  <div className="grid grid-cols-1 gap-1">
                    {Object.entries(skillLevelColors).map(([level, color]) => (
                      <div key={level} className="flex items-center text-xs leading-tight">
                        <div 
                          className="h-3 w-3 rounded-full mr-2" 
                          style={{ backgroundColor: color, border: color === "#FFFFFF" ? "1px solid #e2e8f0" : "none" }}
                        ></div>
                        <span>{level} - {level === "2.5" ? "Beginner" : 
                                         level === "3.0" ? "Intermediate" : 
                                         level === "3.5" ? "Advanced Intermediate" : 
                                         level === "4.0" ? "Advanced" :
                                         level === "4.5" ? "Highly Advanced" :
                                         level === "5.0" ? "Expert/Pro" : 
                                         "Professional/Elite"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {age !== null && (
            <div className="bg-secondary/10 text-secondary rounded-full px-3 py-1 text-xs font-medium leading-tight animate-fade-in hover-scale">
              Age: {age}
            </div>
          )}
          
          {profile?.dupr_profile_link && (
            <a 
              href={profile.dupr_profile_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`bg-blue-500/10 text-blue-500 rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1 transition-all duration-150 leading-tight hover-scale ${
                isLinkPressed ? 'scale-95 bg-blue-500/20' : 'hover:bg-blue-500/20'
              }`}
              {...linkTouchProps}
            >
              DUPR Profile 
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

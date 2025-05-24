
import { useState } from "react";
import { Tables } from "@/integrations/supabase/types";
import { User } from "@supabase/supabase-js";
import { differenceInYears } from "date-fns";
import { ProfileAvatar } from "./ProfileAvatar";
import { skillLevelColors, getSkillLevelColor } from "@/lib/constants/skill-levels";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  profile: Tables<"profiles">;
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  const [avatarLoading, setAvatarLoading] = useState(!!profile?.avatar_url);
  
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
  
  const handleAvatarLoaded = () => {
    setAvatarLoading(false);
  };

  return (
    <div className="flex flex-col items-center md:flex-row md:items-start md:gap-6 mb-8 p-6 bg-card rounded-lg shadow-sm border border-border">
      {profile && (
        <div className="relative">
          {avatarLoading && profile.avatar_url && (
            <Skeleton className="absolute inset-0 h-24 w-24 rounded-full z-10" />
          )}
          <ProfileAvatar 
            userId={profile.id}
            avatarUrl={profile.avatar_url}
            getInitials={getInitials}
            onAvatarLoaded={handleAvatarLoaded}
          />
        </div>
      )}
      <div className="mt-4 md:mt-0">
        <h2 className="text-xl md:text-2xl font-semibold leading-tight">
          {profile?.first_name} {profile?.last_name}
        </h2>
        <div className="flex flex-wrap gap-4 mt-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium flex items-center gap-1 cursor-help leading-tight"
                  style={{ borderLeft: `4px solid ${skillLevelColor}` }}
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
            <div className="bg-secondary/10 text-secondary rounded-full px-3 py-1 text-sm font-medium leading-tight">
              Age: {age}
            </div>
          )}
          {profile?.dupr_profile_link && (
            <a 
              href={profile.dupr_profile_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-500/10 text-blue-500 rounded-full px-3 py-1 text-sm font-medium flex items-center gap-1 hover:bg-blue-500/20 transition-colors leading-tight"
            >
              View DUPR Profile 
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};


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
import { HelpCircle } from "lucide-react";

interface ProfileHeaderProps {
  user: User;
  profile: Tables<"profiles"> | null;
  getInitials: () => string;
}

export const ProfileHeader = ({ user, profile, getInitials }: ProfileHeaderProps) => {
  // Calculate age from birthday
  const calculateAge = () => {
    if (profile?.birthday) {
      const birthdayDate = new Date(profile.birthday);
      return differenceInYears(new Date(), birthdayDate);
    }
    return null;
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
    <div className="flex flex-col items-center md:flex-row md:items-start md:gap-6 mb-8 p-6 bg-card rounded-lg shadow-sm border border-border">
      {user && profile && (
        <ProfileAvatar 
          userId={user.id}
          avatarUrl={profile.avatar_url}
          getInitials={getInitials}
        />
      )}
      <div className="mt-4 md:mt-0">
        <h2 className="text-xl font-semibold">
          {profile?.first_name} {profile?.last_name}
        </h2>
        <p className="text-muted-foreground">{user.email}</p>
        <div className="flex flex-wrap gap-4 mt-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium flex items-center gap-1 cursor-help"
                  style={{ borderLeft: `4px solid ${skillLevelColor}` }}
                >
                  {ratingDisplay.label}: {ratingDisplay.value}
                  <HelpCircle className="h-3 w-3 opacity-70" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="w-64 p-0">
                <div className="p-3">
                  <p className="text-sm font-medium mb-2">Skill Level Color Guide</p>
                  <div className="grid grid-cols-1 gap-1">
                    {Object.entries(skillLevelColors).map(([level, color]) => (
                      <div key={level} className="flex items-center text-xs">
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
            <div className="bg-secondary/10 text-secondary rounded-full px-3 py-1 text-sm font-medium">
              Age: {age}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

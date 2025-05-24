
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Database } from "@/integrations/supabase/types";
import { skillLevelOptions, getSkillLevelColor } from "@/lib/constants/skill-levels";

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProgressionCardProps {
  profile: Profile;
}

export const ProgressionCard = ({ profile }: ProgressionCardProps) => {
  // Get current skill level info
  const currentSkillLevel = profile.skill_level || "3.0";
  const duprRating = profile.dupr_rating;
  const skillLevelInfo = skillLevelOptions.find(option => option.value === currentSkillLevel);
  const borderColor = getSkillLevelColor(duprRating, currentSkillLevel);

  return (
    <Card className="border border-gray-200 border-l-primary/30 border-l-4 hover:shadow-md transition-shadow bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium">My Progression</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Current Level Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full border-2"
              style={{ 
                backgroundColor: borderColor,
                borderColor: borderColor === "#FFFFFF" ? "#e2e8f0" : borderColor
              }}
            />
            <h3 className="text-base font-semibold text-gray-900">Current Level</h3>
          </div>
          
          <div className="ml-7 space-y-2">
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className="text-sm font-medium"
                style={{ 
                  backgroundColor: `${borderColor}20`,
                  color: borderColor === "#FFFFFF" ? "#374151" : borderColor,
                  border: `1px solid ${borderColor}40`
                }}
              >
                {skillLevelInfo?.label || `${currentSkillLevel} - Intermediate`}
              </Badge>
              {duprRating && (
                <span className="text-sm text-gray-500">DUPR: {duprRating}</span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 leading-relaxed">
              {currentSkillLevel === "2.5" && "New to pickleball. Learning basic rules, shots, and positioning."}
              {currentSkillLevel === "3.0" && "Developing consistency in basic shots and can sustain rallies. Beginning to understand strategy."}
              {currentSkillLevel === "3.5" && "More consistent with all basic shots. Developing advanced shots and strategies. Can play at the non-volley zone."}
              {currentSkillLevel === "4.0" && "Consistent with all shots including directional control. Uses strategy effectively and can force errors."}
              {currentSkillLevel === "4.5" && "Very consistent with all shots. Anticipates opponent's shots and has developed power in shots."}
              {currentSkillLevel === "5.0" && "Highly skilled player with exceptional shot control, strategic play, and minimal unforced errors."}
              {currentSkillLevel === "5.5" && "Tournament-level player with advanced precision, power, and strategic mastery."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

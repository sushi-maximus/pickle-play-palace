
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Database } from "@/integrations/supabase/types";
import { skillLevelOptions, getSkillLevelColor, duprToSkillLevel } from "@/lib/constants/skill-levels";

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProgressionCardProps {
  profile: Profile;
}

export const ProgressionCard = ({ profile }: ProgressionCardProps) => {
  // Get current skill level info
  const currentSkillLevel = profile.skill_level || "3.0";
  const duprRating = profile.dupr_rating;
  
  // Use DUPR-based skill level if DUPR rating exists, otherwise use profile skill level
  const effectiveSkillLevel = duprRating ? duprToSkillLevel(duprRating) : currentSkillLevel;
  const skillLevelInfo = skillLevelOptions.find(option => option.value === effectiveSkillLevel);
  const borderColor = getSkillLevelColor(duprRating, currentSkillLevel);

  // Get next skill level
  const currentIndex = skillLevelOptions.findIndex(option => option.value === effectiveSkillLevel);
  const nextSkillLevel = currentIndex < skillLevelOptions.length - 1 ? skillLevelOptions[currentIndex + 1] : null;
  const nextLevelColor = nextSkillLevel ? getSkillLevelColor(null, nextSkillLevel.value) : "#e2e8f0";

  return (
    <Card className="border border-gray-200 border-l-primary/30 border-l-4 hover:shadow-md transition-shadow bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium">My Progression</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Level Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
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
                  {skillLevelInfo?.label || `${effectiveSkillLevel} - Intermediate`}
                </Badge>
                {duprRating && (
                  <span className="text-sm text-gray-500">DUPR: {duprRating}</span>
                )}
              </div>
            </div>
            
            <div className="ml-7">
              <p className="text-sm text-gray-600 leading-relaxed">
                {effectiveSkillLevel === "2.5" && "New to pickleball. Learning basic rules, shots, and positioning."}
                {effectiveSkillLevel === "3.0" && "Developing consistency in basic shots and can sustain rallies. Beginning to understand strategy."}
                {effectiveSkillLevel === "3.5" && "More consistent with all basic shots. Developing advanced shots and strategies. Can play at the non-volley zone."}
                {effectiveSkillLevel === "4.0" && "Consistent with all shots including directional control. Uses strategy effectively and can force errors."}
                {effectiveSkillLevel === "4.5" && "Very consistent with all shots. Anticipates opponent's shots and has developed power in shots."}
                {effectiveSkillLevel === "5.0" && "Highly skilled player with exceptional shot control, strategic play, and minimal unforced errors."}
                {effectiveSkillLevel === "5.5" && "Tournament-level player with advanced precision, power, and strategic mastery."}
              </p>
            </div>
          </div>

          {/* Next Level Section */}
          {nextSkillLevel && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full border-2 opacity-60"
                    style={{ 
                      backgroundColor: "transparent",
                      borderColor: nextLevelColor
                    }}
                  />
                  <h3 className="text-base font-semibold text-gray-700">Next Level</h3>
                </div>
                
                <Badge 
                  variant="outline" 
                  className="text-sm font-medium opacity-75"
                  style={{ 
                    borderColor: `${nextLevelColor}60`,
                    color: "#6b7280"
                  }}
                >
                  {nextSkillLevel.label}
                </Badge>
              </div>
              
              <div className="ml-7">
                <p className="text-sm text-gray-500 leading-relaxed">
                  {nextSkillLevel.value === "3.0" && "Work on developing consistency in basic shots and sustaining rallies. Begin to understand strategy."}
                  {nextSkillLevel.value === "3.5" && "Focus on consistency with all basic shots. Develop advanced shots and strategies. Learn to play at the non-volley zone."}
                  {nextSkillLevel.value === "4.0" && "Achieve consistency with all shots including directional control. Use strategy effectively and learn to force errors."}
                  {nextSkillLevel.value === "4.5" && "Develop very consistent shots. Learn to anticipate opponent's shots and develop power in your shots."}
                  {nextSkillLevel.value === "5.0" && "Master exceptional shot control, strategic play, and minimize unforced errors."}
                  {nextSkillLevel.value === "5.5" && "Achieve tournament-level precision, power, and strategic mastery."}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

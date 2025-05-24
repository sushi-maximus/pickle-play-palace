
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Database } from "@/integrations/supabase/types";
import { skillLevelOptions, getSkillLevelColor, duprToSkillLevel } from "@/lib/constants/skill-levels";
import { getCurrentLevelDescription, getNextLevelAdvice } from "@/lib/constants/skill-level-descriptions";

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

  // Get descriptions and advice
  const currentDescription = getCurrentLevelDescription(effectiveSkillLevel);
  const nextLevelAdvicePoints = nextSkillLevel ? getNextLevelAdvice(nextSkillLevel.value) : [];

  // Join current description into a single sentence
  const currentDescriptionSentence = currentDescription.join(", ") + ".";

  return (
    <Card className="border border-gray-200 border-l-primary/30 border-l-4 hover:shadow-md transition-shadow bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium">My Progression</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
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
            
            <div className="ml-7">
              <p className="text-sm text-gray-600 leading-relaxed">
                {currentDescriptionSentence}
              </p>
            </div>
          </div>

          {/* Next Level Section */}
          {nextSkillLevel && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full border-2"
                  style={{ 
                    backgroundColor: nextLevelColor,
                    borderColor: nextLevelColor === "#FFFFFF" ? "#e2e8f0" : nextLevelColor
                  }}
                />
                <h3 className="text-base font-semibold text-gray-700">Next Level</h3>
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
                <p className="text-sm font-medium text-gray-700 mb-2">Focus areas to reach the next level:</p>
                <ul className="space-y-1">
                  {nextLevelAdvicePoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-500 leading-relaxed">
                      <span className="w-1.5 h-1.5 bg-primary/60 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

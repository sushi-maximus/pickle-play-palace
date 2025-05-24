
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Database } from "@/integrations/supabase/types";
import { skillLevelOptions, getSkillLevelColor, duprToSkillLevel } from "@/lib/constants/skill-levels";
import { getCurrentLevelDescription, getNextLevelAdvice } from "@/lib/constants/skill-level-descriptions";
import { ThreeLevelStrategyTabs } from "@/components/ui/ThreeLevelStrategyTabs";
import { SkillLevelGuide } from "@/components/SkillLevelGuide";
import { Target, TrendingUp, BookOpen } from "lucide-react";

type Profile = Database['public']['Tables']['profiles']['Row'];

interface TrainingContentProps {
  profile: Profile | null;
}

export const TrainingContent = ({ profile }: TrainingContentProps) => {
  if (!profile) {
    return (
      <div className="space-y-3 md:space-y-4">
        {/* Guest Training Overview */}
        <Card className="border border-gray-200 border-l-primary/30 border-l-4 hover:shadow-md transition-shadow bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Welcome to Pickleball Training
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Learn about skill levels and effective training strategies to improve your pickleball game.
            </p>
            <div className="flex justify-center">
              <SkillLevelGuide />
            </div>
          </CardContent>
        </Card>

        {/* Three-Level Strategy for all players */}
        <ThreeLevelStrategyTabs 
          isCollapsible={false}
          headerText="The proven strategy for rapid improvement - play with three levels of players:"
        />
      </div>
    );
  }

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

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Current Level Overview */}
      <Card className="border border-gray-200 border-l-primary/30 border-l-4 hover:shadow-md transition-shadow bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Your Current Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-6 h-6 rounded-full border-2"
                style={{ 
                  backgroundColor: borderColor,
                  borderColor: borderColor === "#FFFFFF" ? "#e2e8f0" : borderColor
                }}
              />
              <Badge 
                variant="secondary" 
                className="text-base font-medium px-3 py-1"
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
            
            <div className="bg-gray-50 rounded-lg p-3 md:p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">What this level means:</p>
              <ul className="space-y-1">
                {currentDescription.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Level Goals */}
      {nextSkillLevel && (
        <Card className="border border-gray-200 border-l-primary/30 border-l-4 hover:shadow-md transition-shadow bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Your Next Level Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-6 h-6 rounded-full border-2"
                  style={{ 
                    backgroundColor: nextLevelColor,
                    borderColor: nextLevelColor === "#FFFFFF" ? "#e2e8f0" : nextLevelColor
                  }}
                />
                <Badge 
                  variant="outline" 
                  className="text-base font-medium px-3 py-1"
                  style={{ 
                    borderColor: `${nextLevelColor}60`,
                    color: "#6b7280"
                  }}
                >
                  {nextSkillLevel.label}
                </Badge>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-3 md:p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Focus areas to reach the next level:</p>
                <ul className="space-y-1">
                  {nextLevelAdvicePoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Three-Level Strategy */}
      <ThreeLevelStrategyTabs 
        isCollapsible={false}
        headerText="How to practice these skills - the three-level strategy:"
      />

      {/* Additional Resources */}
      <Card className="border border-gray-200 border-l-primary/30 border-l-4 hover:shadow-md transition-shadow bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">Additional Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <SkillLevelGuide 
              triggerElement={
                <button className="text-primary hover:underline text-sm font-medium">
                  View Complete Skill Level Guide
                </button>
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

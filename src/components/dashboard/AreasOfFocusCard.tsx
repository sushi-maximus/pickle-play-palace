import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { skillLevelOptions, getSkillLevelColor, duprToSkillLevel } from "@/lib/constants/skill-levels";
import { getNextLevelAdvice } from "@/lib/constants/skill-level-descriptions";
import { TrendingUp, Users, Target, Info } from "lucide-react";

export const AreasOfFocusCard = () => {
  const { profile } = useAuth();

  if (!profile) {
    return null;
  }

  // Get current skill level info
  const currentSkillLevel = profile.skill_level || "3.0";
  const duprRating = profile.dupr_rating;
  
  // Use DUPR-based skill level if DUPR rating exists, otherwise use profile skill level
  const effectiveSkillLevel = duprRating ? duprToSkillLevel(duprRating) : currentSkillLevel;

  // Get next skill level
  const currentIndex = skillLevelOptions.findIndex(option => option.value === effectiveSkillLevel);
  const nextSkillLevel = currentIndex < skillLevelOptions.length - 1 ? skillLevelOptions[currentIndex + 1] : null;
  const nextLevelColor = nextSkillLevel ? getSkillLevelColor(null, nextSkillLevel.value) : "#e2e8f0";

  // Get next level advice
  const nextLevelAdvicePoints = nextSkillLevel ? getNextLevelAdvice(nextSkillLevel.value) : [];

  if (!nextSkillLevel || nextLevelAdvicePoints.length === 0) {
    return (
      <Card className="border border-gray-200 border-l-primary/30 border-l-4 hover:shadow-md transition-shadow bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">My Areas of Focus</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            You've reached the highest skill level! Keep practicing to maintain your excellence.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 border-l-primary/30 border-l-4 hover:shadow-md transition-shadow bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium">My Areas of Focus</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Next Level Section */}
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
                className="text-sm font-medium"
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

          {/* Three-Level Strategy Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3 mb-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1">
                  Practice these focus areas by playing with three levels of players:
                </h4>
              </div>
            </div>
            
            <div className="space-y-3 ml-8">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Better players</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Challenges you to elevate skills and learn advanced techniques
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Users className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Similar-level players</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Builds consistency and mental toughness in competitive matches
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Target className="h-4 w-4 text-orange-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Less skilled players</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Allows experimentation and reinforces fundamentals with confidence
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

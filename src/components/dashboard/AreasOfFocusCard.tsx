
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { skillLevelOptions, getSkillLevelColor, duprToSkillLevel } from "@/lib/constants/skill-levels";
import { getNextLevelAdvice } from "@/lib/constants/skill-level-descriptions";
import { TrendingUp, Users, Target, Info, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

export const AreasOfFocusCard = () => {
  const { profile } = useAuth();
  const [isStrategyExpanded, setIsStrategyExpanded] = useState(false);

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

          {/* Collapsible Three-Level Strategy Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <button
              onClick={() => setIsStrategyExpanded(!isStrategyExpanded)}
              className="flex items-start gap-3 w-full text-left hover:bg-blue-100/50 -m-2 p-2 rounded transition-colors"
            >
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-900 mb-1">
                  Practice these focus areas by playing with three levels of players
                </h4>
                {!isStrategyExpanded && (
                  <p className="text-xs text-blue-700">Click to learn more about this strategy</p>
                )}
              </div>
              <div className="mt-0.5">
                {isStrategyExpanded ? (
                  <ChevronDown className="h-4 w-4 text-blue-600" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-blue-600" />
                )}
              </div>
            </button>
            
            {isStrategyExpanded && (
              <div className="mt-4 space-y-4 ml-8">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Better players</p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Challenges you to elevate your skills. You observe advanced techniques, strategies, and decision-making, pushing you to adapt and learn. It exposes weaknesses in your game and forces you to play at a higher intensity, accelerating skill development.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Users className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Similar-level players</p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Provides competitive practice where matches are evenly matched. This hones your consistency, mental toughness, and ability to execute under pressure. It's ideal for refining strategies and building confidence in close games.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Target className="h-4 w-4 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Less skilled players</p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Allows you to dominate and experiment with new shots or tactics in a low-pressure environment. It builds confidence, reinforces fundamentals, and lets you focus on precision and control. You can also practice leadership, like controlling the pace or setting up plays.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-blue-200 pt-3">
                  <p className="text-xs text-blue-800 italic leading-relaxed">
                    This mix ensures well-rounded growth: you're stretched by superiors, tested by peers, and empowered by teaching moments with beginners. Each level targets different aspects of skill, strategy, and mentality critical for improvement.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

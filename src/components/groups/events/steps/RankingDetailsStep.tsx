import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Target, Grid3X3, Users } from "lucide-react";

interface RankingDetailsStepProps {
  rankingMethod: string;
  skillCategory: string;
  onRankingMethodChange: (rankingMethod: string) => void;
  onSkillCategoryChange: (skillCategory: string) => void;
  errors?: {
    rankingMethod?: string;
    skillCategory?: string;
  };
  eventFormat?: string;
  eventType?: string;
}

const eventFormats = [
  { id: "ladder", label: "Ladder", icon: Zap },
  { id: "kings_court", label: "Kings Court", icon: Target },
  { id: "round_robin", label: "Round Robin", icon: Grid3X3 },
  { id: "single_court", label: "Single Court", icon: Users }
];

export const RankingDetailsStep = ({
  rankingMethod,
  skillCategory,
  onRankingMethodChange,
  onSkillCategoryChange,
  errors = {},
  eventFormat,
  eventType
}: RankingDetailsStepProps) => {
  const getFormatDisplay = () => {
    if (!eventFormat) return null;
    const format = eventFormats.find(f => f.id === eventFormat);
    if (!format) return null;
    
    const Icon = format.icon;
    return (
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">{format.label}</span>
      </div>
    );
  };

  const getEventTypeDisplay = () => {
    if (!eventType) return null;
    
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">
          {eventType === "one-time" ? "One-Time" : "Multi-Week"}
        </span>
      </div>
    );
  };

  return (
    <div className="flex-1 px-4 py-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">Ranking Details</h2>
        <p className="text-sm text-gray-600">
          Configure how players will be ranked and matched
        </p>
        
        {/* Selections Display */}
        {(eventFormat || eventType) && (
          <div className="flex items-center justify-center gap-4 mt-4">
            {eventFormat && getFormatDisplay()}
            {eventFormat && eventType && (
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            )}
            {eventType && getEventTypeDisplay()}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="ranking-method" className="text-base font-medium text-gray-900">
            Ranking Method
          </Label>
          <Select value={rankingMethod} onValueChange={onRankingMethodChange}>
            <SelectTrigger id="ranking-method" className="min-h-[48px]">
              <SelectValue placeholder="Select ranking method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ladder">Ladder</SelectItem>
              <SelectItem value="round-robin">Round Robin</SelectItem>
              <SelectItem value="elimination">Single Elimination</SelectItem>
              <SelectItem value="double-elimination">Double Elimination</SelectItem>
            </SelectContent>
          </Select>
          {errors.rankingMethod && (
            <p className="text-sm text-red-600">{errors.rankingMethod}</p>
          )}
          <p className="text-xs text-gray-500">
            Choose how players will compete and be ranked
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="skill-category" className="text-base font-medium text-gray-900">
            Skill Category
          </Label>
          <Select value={skillCategory} onValueChange={onSkillCategoryChange}>
            <SelectTrigger id="skill-category" className="min-h-[48px]">
              <SelectValue placeholder="Select skill category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Skill Restriction</SelectItem>
              <SelectItem value="beginner">Beginner (2.5-3.0)</SelectItem>
              <SelectItem value="intermediate">Intermediate (3.0-3.5)</SelectItem>
              <SelectItem value="advanced">Advanced (3.5-4.0)</SelectItem>
              <SelectItem value="expert">Expert (4.0+)</SelectItem>
            </SelectContent>
          </Select>
          {errors.skillCategory && (
            <p className="text-sm text-red-600">{errors.skillCategory}</p>
          )}
          <p className="text-xs text-gray-500">
            Restrict participation based on skill level
          </p>
        </div>
      </div>
    </div>
  );
};

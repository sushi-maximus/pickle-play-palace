
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RankingDetailsStepProps {
  rankingMethod: string;
  skillCategory: string;
  onRankingMethodChange: (rankingMethod: string) => void;
  onSkillCategoryChange: (skillCategory: string) => void;
  errors?: {
    rankingMethod?: string;
    skillCategory?: string;
  };
}

export const RankingDetailsStep = ({
  rankingMethod,
  skillCategory,
  onRankingMethodChange,
  onSkillCategoryChange,
  errors = {}
}: RankingDetailsStepProps) => {
  return (
    <div className="flex-1 px-4 py-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">Ranking Details</h2>
        <p className="text-sm text-gray-600">
          Configure how players will be ranked and matched
        </p>
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

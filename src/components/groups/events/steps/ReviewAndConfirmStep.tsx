
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, DollarSign, Target, Award, Zap, Grid3X3 } from "lucide-react";
import type { EventFormData } from "../types";

interface ReviewAndConfirmStepProps {
  formData: EventFormData;
  onSubmit: () => void;
  isLoading: boolean;
}

const eventFormats = [
  { id: "ladder", label: "Ladder", icon: Zap },
  { id: "kings_court", label: "Kings Court", icon: Target },
  { id: "round_robin", label: "Round Robin", icon: Grid3X3 },
  { id: "single_court", label: "Single Court", icon: Users }
];

export const ReviewAndConfirmStep = ({
  formData,
  onSubmit,
  isLoading
}: ReviewAndConfirmStepProps) => {
  const formatEventFormat = (format: string) => {
    const formats: Record<string, string> = {
      ladder: "Ladder",
      kings_court: "Kings Court",
      round_robin: "Round Robin",
      single_court: "Single Court"
    };
    return formats[format] || format;
  };

  const formatEventType = (type: string) => {
    const types: Record<string, string> = {
      "single-event": "Single Event",
      "multi-week": "Multi-Week Series"
    };
    return types[type] || type;
  };

  const formatSkillCategory = (category: string) => {
    const categories: Record<string, string> = {
      none: "No Skill Restriction",
      beginner: "Beginner (2.5-3.0)",
      intermediate: "Intermediate (3.0-3.5)",
      advanced: "Advanced (3.5-4.0)",
      expert: "Expert (4.0+)"
    };
    return categories[category] || category;
  };

  const formatRankingMethod = (method: string) => {
    const methods: Record<string, string> = {
      ladder: "Ladder",
      "round-robin": "Round Robin",
      elimination: "Single Elimination",
      "double-elimination": "Double Elimination"
    };
    return methods[method] || method;
  };

  const getFormatDisplay = () => {
    if (!formData.eventFormat) return null;
    const format = eventFormats.find(f => f.id === formData.eventFormat);
    if (!format) return null;
    
    const Icon = format.icon;
    return (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
          <Icon className="h-3 w-3 text-white" />
        </div>
        <span className="text-sm font-medium text-gray-700">{format.label}</span>
      </div>
    );
  };

  const getEventTypeDisplay = () => {
    if (!formData.eventType) return null;
    
    return (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
          <span className="text-xs text-white font-medium">
            {formData.eventType === "one-time" ? "1" : "M"}
          </span>
        </div>
        <span className="text-sm font-medium text-gray-700">
          {formData.eventType === "one-time" ? "One-Time Event" : "Multi-Week Event"}
        </span>
      </div>
    );
  };

  return (
    <div className="flex-1 px-4 py-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">Review and Confirm</h2>
        <p className="text-sm text-gray-600">
          Please review your event details before creating
        </p>
        
        {/* Selections Display */}
        {(formData.eventFormat || formData.eventType) && (
          <div className="flex items-center justify-center gap-4 mt-4">
            {formData.eventFormat && getFormatDisplay()}
            {formData.eventFormat && formData.eventType && (
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            )}
            {formData.eventType && getEventTypeDisplay()}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* Event Format & Type */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Event Format & Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Format:</span>
              <Badge variant="secondary">{formatEventFormat(formData.eventFormat)}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Type:</span>
              <Badge variant="secondary">{formatEventType(formData.eventType)}</Badge>
            </div>
            {formData.eventType === "multi-week" && formData.seriesTitle && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Series Title:</span>
                <span className="text-sm font-medium">{formData.seriesTitle}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Event Details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-medium text-gray-900">{formData.eventTitle}</h4>
              <p className="text-sm text-gray-600 mt-1">{formData.description}</p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{formData.eventDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{formData.eventTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{formData.location}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Player Details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Player Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-gray-500" />
              <span>Max Players: {formData.maxPlayers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Reserves:</span>
              <Badge variant={formData.allowReserves ? "default" : "secondary"}>
                {formData.allowReserves ? "Allowed" : "Not Allowed"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span>
                {formData.pricingModel === "free" 
                  ? "Free Event" 
                  : `$${formData.feeAmount} per player`
                }
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Ranking Details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Ranking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-gray-500" />
              <span>Method: {formatRankingMethod(formData.rankingMethod)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Award className="h-4 w-4 text-gray-500" />
              <span>Skill: {formatSkillCategory(formData.skillCategory)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="pt-4">
        <Button
          onClick={onSubmit}
          disabled={isLoading}
          className="w-full min-h-[48px] bg-primary hover:bg-primary/90"
        >
          {isLoading ? "Creating Event..." : "Create Event"}
        </Button>
      </div>
    </div>
  );
};

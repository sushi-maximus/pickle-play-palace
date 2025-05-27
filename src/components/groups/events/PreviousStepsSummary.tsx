
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { EventFormData } from "./types";

interface PreviousStepsSummaryProps {
  formData: EventFormData;
  currentStep: number;
}

export const PreviousStepsSummary = ({ formData, currentStep }: PreviousStepsSummaryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Only show if we have at least one completed step
  if (currentStep <= 1) return null;

  const getSummaryItems = () => {
    const items = [];

    // Step 1: Event Format
    if (currentStep > 1 && formData.eventFormat) {
      const formatIcons: Record<string, string> = {
        tennis: "🎾",
        pickleball: "🏓",
        padel: "🎾",
        racquetball: "🎾",
        table_tennis: "🏓",
        squash: "🎾",
        basketball: "🏀",
        soccer: "⚽",
        golf: "⛳",
        other: "🏆"
      };
      
      const formatLabels: Record<string, string> = {
        tennis: "Tennis",
        pickleball: "Pickleball", 
        padel: "Padel",
        racquetball: "Racquetball",
        table_tennis: "Table Tennis",
        squash: "Squash",
        basketball: "Basketball",
        soccer: "Soccer",
        golf: "Golf",
        other: "Other Sport"
      };

      items.push({
        step: 1,
        icon: formatIcons[formData.eventFormat] || "🏆",
        text: formatLabels[formData.eventFormat] || formData.eventFormat
      });
    }

    // Step 2: Event Type
    if (currentStep > 2 && formData.eventType) {
      const typeIcon = formData.eventType === "one-time" ? "📅" : "📊";
      const typeText = formData.eventType === "one-time" 
        ? "One-Time Event" 
        : `Multi-Week Series${formData.seriesTitle ? `: ${formData.seriesTitle}` : ""}`;
      
      items.push({
        step: 2,
        icon: typeIcon,
        text: typeText
      });
    }

    // Step 3: Event Details (show title if available)
    if (currentStep > 3 && formData.eventTitle) {
      items.push({
        step: 3,
        icon: "📝",
        text: formData.eventTitle
      });
    }

    return items;
  };

  const summaryItems = getSummaryItems();

  if (summaryItems.length === 0) return null;

  return (
    <Card className="mx-4 mb-4 bg-blue-50 border-blue-200">
      <div className="p-3">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between text-sm font-medium text-blue-800 hover:bg-blue-100 h-auto p-2"
        >
          <span>Previous Selections</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        
        {isExpanded && (
          <div className="mt-3 space-y-2 animate-fade-in">
            {summaryItems.map((item) => (
              <div key={item.step} className="flex items-center gap-2 text-sm text-blue-700">
                <span className="text-base">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

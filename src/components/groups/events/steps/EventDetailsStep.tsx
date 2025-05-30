import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Zap, Target, Grid3X3, Users } from "lucide-react";

interface EventDetailsStepProps {
  eventTitle: string;
  description: string;
  eventDate: string;
  eventTime: string;
  location: string;
  onEventTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onEventDateChange: (date: string) => void;
  onEventTimeChange: (time: string) => void;
  onLocationChange: (location: string) => void;
  errors?: {
    eventTitle?: string;
    description?: string;
    eventDate?: string;
    eventTime?: string;
    location?: string;
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

export const EventDetailsStep = ({
  eventTitle,
  description,
  eventDate,
  eventTime,
  location,
  onEventTitleChange,
  onDescriptionChange,
  onEventDateChange,
  onEventTimeChange,
  onLocationChange,
  errors = {},
  eventFormat,
  eventType
}: EventDetailsStepProps) => {
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
        <h2 className="text-xl font-semibold text-gray-900">Event Details</h2>
        <p className="text-sm text-gray-600">
          Enter the basic information for your event
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
          <Label htmlFor="event-title" className="text-base font-medium text-gray-900">
            Event Title
          </Label>
          <Input
            id="event-title"
            value={eventTitle}
            onChange={(e) => onEventTitleChange(e.target.value)}
            placeholder="e.g., Spring Ladder Event"
            className="min-h-[48px]"
            maxLength={100}
          />
          {errors.eventTitle && (
            <p className="text-sm text-red-600">{errors.eventTitle}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-base font-medium text-gray-900">
            Description
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="e.g., One-time competitive ladder match for intermediate players"
            className="min-h-[120px] resize-none"
            maxLength={500}
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description}</p>
          )}
          <p className="text-xs text-gray-500">{description.length}/500 characters</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="event-date" className="text-base font-medium text-gray-900">
              Date
            </Label>
            <Input
              id="event-date"
              type="date"
              value={eventDate}
              onChange={(e) => onEventDateChange(e.target.value)}
              min="2025-05-27"
              className="min-h-[48px]"
            />
            {errors.eventDate && (
              <p className="text-sm text-red-600">{errors.eventDate}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-time" className="text-base font-medium text-gray-900">
              Time
            </Label>
            <Input
              id="event-time"
              type="time"
              value={eventTime}
              onChange={(e) => onEventTimeChange(e.target.value)}
              className="min-h-[48px]"
            />
            {errors.eventTime && (
              <p className="text-sm text-red-600">{errors.eventTime}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-base font-medium text-gray-900">
            Location
          </Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="e.g., Downtown Courts, Central Park"
            className="min-h-[48px]"
            maxLength={200}
          />
          {errors.location && (
            <p className="text-sm text-red-600">{errors.location}</p>
          )}
        </div>
      </div>
    </div>
  );
};

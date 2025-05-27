import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Copy, Edit } from "lucide-react";
import { MultiWeekEventModal } from "./MultiWeekEventModal";
import type { MultiWeekEvent } from "../types";

interface EventTypeStepProps {
  eventType: string;
  seriesTitle: string;
  events: MultiWeekEvent[];
  onEventTypeChange: (eventType: string) => void;
  onSeriesTitleChange: (title: string) => void;
  onEventsChange: (events: MultiWeekEvent[]) => void;
  error?: string;
}

export const EventTypeStep = ({
  eventType,
  seriesTitle,
  events,
  onEventTypeChange,
  onSeriesTitleChange,
  onEventsChange,
  error
}: EventTypeStepProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<MultiWeekEvent | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddEvent = () => {
    setEditingEvent(null);
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: MultiWeekEvent, index: number) => {
    setEditingEvent(event);
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleCopyEvent = (event: MultiWeekEvent) => {
    setEditingEvent({ ...event, eventTitle: `${event.eventTitle} (Copy)` });
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (event: MultiWeekEvent) => {
    const newEvents = [...events];
    if (editingIndex !== null) {
      newEvents[editingIndex] = event;
    } else {
      newEvents.push(event);
    }
    onEventsChange(newEvents);
    setIsModalOpen(false);
    setEditingEvent(null);
    setEditingIndex(null);
  };

  const handleDeleteEvent = (index: number) => {
    const newEvents = events.filter((_, i) => i !== index);
    onEventsChange(newEvents);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-4 py-12 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Choose Event Type</h2>
          <p className="text-sm text-gray-600">
            Select whether you want to create a single event or a series of events
          </p>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium text-gray-900">Event Type</Label>
          <RadioGroup value={eventType} onValueChange={onEventTypeChange}>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors min-h-[48px]">
                <RadioGroupItem value="one-time" id="one-time" />
                <Label htmlFor="one-time" className="font-medium cursor-pointer flex-1">
                  One-Time Event
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors min-h-[48px]">
                <RadioGroupItem value="multi-week" id="multi-week" />
                <Label htmlFor="multi-week" className="font-medium cursor-pointer flex-1">
                  Multi-Week Events
                </Label>
              </div>
            </div>
          </RadioGroup>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        {eventType === "multi-week" && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <Label htmlFor="series-title" className="text-base font-medium text-gray-900">
                Series Title
              </Label>
              <Input
                id="series-title"
                value={seriesTitle}
                onChange={(e) => onSeriesTitleChange(e.target.value)}
                placeholder="e.g., Tom's Battle Series"
                className="min-h-[48px]"
                maxLength={100}
              />
              {!seriesTitle && eventType === "multi-week" && (
                <p className="text-sm text-red-600">Series title is required</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium text-gray-900">Events</Label>
                <Button
                  onClick={handleAddEvent}
                  className="min-h-[48px] min-w-[48px] bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </div>

              {events.length === 0 && eventType === "multi-week" && (
                <p className="text-sm text-red-600">At least one event is required</p>
              )}

              <div className="space-y-3">
                {events.map((event, index) => (
                  <Card key={index} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <h4 className="font-medium text-gray-900">{event.eventTitle}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span>📅 {event.eventDate}</span>
                          <span>🕐 {event.eventTime}</span>
                          <span>📍 {event.location}</span>
                          <span>👥 {event.maxPlayers} players</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyEvent(event)}
                          className="min-h-[40px] min-w-[40px] p-2"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditEvent(event, index)}
                          className="min-h-[40px] min-w-[40px] p-2"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        <MultiWeekEventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveEvent}
          onDelete={editingIndex !== null ? () => handleDeleteEvent(editingIndex) : undefined}
          event={editingEvent}
          isEditing={editingIndex !== null}
        />
      </div>
    </div>
  );
};

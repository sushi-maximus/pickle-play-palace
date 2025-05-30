
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";
import type { MultiWeekEvent } from "../types";

interface MultiWeekEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: MultiWeekEvent) => void;
  onDelete?: () => void;
  event?: MultiWeekEvent | null;
  isEditing?: boolean;
}

export const MultiWeekEventModal = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  event,
  isEditing = false
}: MultiWeekEventModalProps) => {
  const [formData, setFormData] = useState<MultiWeekEvent>({
    eventTitle: "",
    description: "",
    eventDate: "",
    eventTime: "",
    location: "",
    maxPlayers: 16,
    allowReserves: false,
    pricingModel: "free",
    feeAmount: null,
    rankingMethod: "",
    skillCategory: "none"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (event) {
      setFormData(event);
    } else {
      setFormData({
        eventTitle: "",
        description: "",
        eventDate: "",
        eventTime: "",
        location: "",
        maxPlayers: 16,
        allowReserves: false,
        pricingModel: "free",
        feeAmount: null,
        rankingMethod: "",
        skillCategory: "none"
      });
    }
    setErrors({});
  }, [event, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.eventTitle.trim()) {
      newErrors.eventTitle = "Event title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.eventDate) {
      newErrors.eventDate = "Date is required";
    } else {
      const eventDateTime = new Date(`${formData.eventDate}T${formData.eventTime || "00:00"}`);
      const currentTime = new Date(); // Use current time instead of hardcoded
      if (eventDateTime <= currentTime) {
        newErrors.eventDate = "Date/Time must be in the future";
      }
    }
    if (!formData.eventTime) {
      newErrors.eventTime = "Time is required";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    if (formData.maxPlayers < 8 || formData.maxPlayers > 64 || formData.maxPlayers % 4 !== 0) {
      newErrors.maxPlayers = "Max players must be 8-64 and a multiple of 4";
    }
    if (formData.pricingModel !== "free" && formData.feeAmount && (formData.feeAmount < 0 || formData.feeAmount > 100)) {
      newErrors.feeAmount = "Fee must be $0-$100";
    }
    if (!formData.rankingMethod) {
      newErrors.rankingMethod = "Ranking method is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      // Add haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
      onSave(formData);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      onClose();
    }
  };

  const maxPlayersOptions = [];
  for (let i = 8; i <= 64; i += 4) {
    maxPlayersOptions.push(i);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Event" : "Add Event"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event-title">Event Title</Label>
            <Input
              id="event-title"
              value={formData.eventTitle}
              onChange={(e) => setFormData({ ...formData, eventTitle: e.target.value })}
              placeholder="e.g., Week 1 Ladder Matchup"
              className="min-h-[48px]"
            />
            {errors.eventTitle && <p className="text-sm text-red-600">{errors.eventTitle}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Event description..."
              className="min-h-[80px]"
            />
            {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-date">Date</Label>
              <Input
                id="event-date"
                type="date"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                min="2025-05-27"
                className="min-h-[48px]"
              />
              {errors.eventDate && <p className="text-sm text-red-600">{errors.eventDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-time">Time</Label>
              <Input
                id="event-time"
                type="time"
                value={formData.eventTime}
                onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                className="min-h-[48px]"
              />
              {errors.eventTime && <p className="text-sm text-red-600">{errors.eventTime}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Central Park Courts"
              className="min-h-[48px]"
            />
            {errors.location && <p className="text-sm text-red-600">{errors.location}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-players">Max Players</Label>
            <Select
              value={formData.maxPlayers.toString()}
              onValueChange={(value) => setFormData({ ...formData, maxPlayers: parseInt(value) })}
            >
              <SelectTrigger className="min-h-[48px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {maxPlayersOptions.map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} players
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.maxPlayers && <p className="text-sm text-red-600">{errors.maxPlayers}</p>}
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="allow-reserves">Allow Reserves</Label>
            <Switch
              id="allow-reserves"
              checked={formData.allowReserves}
              onCheckedChange={(checked) => setFormData({ ...formData, allowReserves: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricing-model">Pricing</Label>
            <Select
              value={formData.pricingModel}
              onValueChange={(value) => setFormData({ ...formData, pricingModel: value, feeAmount: value === "free" ? null : 20 })}
            >
              <SelectTrigger className="min-h-[48px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="one-time">One-Time Fee</SelectItem>
                <SelectItem value="per-event">Per-Event Fee</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.pricingModel !== "free" && (
            <div className="space-y-2">
              <Label htmlFor="fee-amount">Fee Amount ($)</Label>
              <Input
                id="fee-amount"
                type="number"
                min="0"
                max="100"
                value={formData.feeAmount || ""}
                onChange={(e) => setFormData({ ...formData, feeAmount: e.target.value ? parseFloat(e.target.value) : null })}
                placeholder="20"
                className="min-h-[48px]"
              />
              {errors.feeAmount && <p className="text-sm text-red-600">{errors.feeAmount}</p>}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="ranking-method">Ranking Method</Label>
            <Select
              value={formData.rankingMethod}
              onValueChange={(value) => setFormData({ ...formData, rankingMethod: value })}
            >
              <SelectTrigger className="min-h-[48px]">
                <SelectValue placeholder="Select ranking method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="random">Random</SelectItem>
                <SelectItem value="skill-based">Skill-Based</SelectItem>
                <SelectItem value="dupr">DUPR</SelectItem>
              </SelectContent>
            </Select>
            {errors.rankingMethod && <p className="text-sm text-red-600">{errors.rankingMethod}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="skill-category">Skill Category</Label>
            <Select
              value={formData.skillCategory}
              onValueChange={(value) => setFormData({ ...formData, skillCategory: value })}
            >
              <SelectTrigger className="min-h-[48px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            {isEditing && onDelete && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="min-h-[48px] flex-1"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
            <Button
              variant="outline"
              onClick={onClose}
              className="min-h-[48px] flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="min-h-[48px] flex-1 bg-green-600 hover:bg-green-700"
            >
              {isEditing ? "Update" : "Add"} Event
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

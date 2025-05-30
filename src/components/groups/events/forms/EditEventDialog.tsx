
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditEventForm } from "./EditEventForm";
import { EditEventFormValidationTest } from "./validation/EditEventFormValidationTest";
import { useEditEvent } from "../hooks/useEditEvent";
import type { Event } from "./types/eventFormTypes";

interface EditEventDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const EditEventDialog = ({ event, open, onOpenChange, onSuccess }: EditEventDialogProps) => {
  const { editEvent, isEditing } = useEditEvent({
    eventId: event?.id || '',
    onSuccess: () => {
      onSuccess?.();
      onOpenChange(false);
    }
  });

  if (!event) return null;

  const handleSubmit = async (data: any) => {
    try {
      editEvent(data);
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        
        {/* Temporary validation test component for debugging */}
        <EditEventFormValidationTest event={event} />
        
        <EditEventForm
          event={event}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isEditing}
        />
      </DialogContent>
    </Dialog>
  );
};


import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { EditEventForm } from "./EditEventForm";
import { useEditEvent } from "../hooks/useEditEvent";
import { Trash2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import type { EventUpdateData } from "../services/eventUpdateService";

type Event = Database['public']['Tables']['events']['Row'];

interface EditEventDialogProps {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const EditEventDialog = ({ event, open, onOpenChange, onSuccess }: EditEventDialogProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const { editEvent, deleteEvent, isEditing, isDeleting } = useEditEvent({
    eventId: event.id,
    onSuccess: () => {
      onOpenChange(false);
      onSuccess?.();
    }
  });

  const handleSubmit = (data: EventUpdateData) => {
    editEvent(data);
  };

  const handleDelete = () => {
    deleteEvent();
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Edit Event</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <EditEventForm
            event={event}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            isLoading={isEditing}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{event.event_title}"? This action cannot be undone.
              All player registrations and related data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete Event"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

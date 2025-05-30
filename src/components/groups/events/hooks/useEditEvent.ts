
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventUpdateService, type EventUpdateData } from "../services/eventUpdateService";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";

interface UseEditEventProps {
  eventId: string;
  onSuccess?: () => void;
}

export const useEditEvent = ({ eventId, onSuccess }: UseEditEventProps) => {
  const queryClient = useQueryClient();

  const editMutation = useMutation({
    mutationFn: (updates: EventUpdateData) => eventUpdateService.updateEvent(eventId, updates),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Event updated successfully");
        
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ['event', eventId] });
        queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
        
        onSuccess?.();
      } else {
        toast.error(result.error || "Failed to update the event. Please try again.");
      }
    },
    onError: (error) => {
      console.error('[useEditEvent] Error:', error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => eventUpdateService.deleteEvent(eventId),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Event deleted successfully");
        
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
        
        onSuccess?.();
      } else {
        toast.error(result.error || "Failed to delete the event. Please try again.");
      }
    },
    onError: (error) => {
      console.error('[useEditEvent] Delete error:', error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  });

  return {
    editEvent: editMutation.mutate,
    deleteEvent: deleteMutation.mutate,
    isEditing: editMutation.isPending,
    isDeleting: deleteMutation.isPending,
    editError: editMutation.error,
    deleteError: deleteMutation.error
  };
};


import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventUpdateService, type EventUpdateData } from "../services/eventUpdateService";
import { useToast } from "@/hooks/use-toast";
import { queryKeys } from "@/lib/queryKeys";

interface UseEditEventProps {
  eventId: string;
  onSuccess?: () => void;
}

export const useEditEvent = ({ eventId, onSuccess }: UseEditEventProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const editMutation = useMutation({
    mutationFn: (updates: EventUpdateData) => eventUpdateService.updateEvent(eventId, updates),
    onSuccess: (result) => {
      if (result.success) {
        toast({
          title: "Event updated",
          description: "The event has been successfully updated.",
        });
        
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ['event', eventId] });
        queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
        
        onSuccess?.();
      } else {
        toast({
          title: "Error updating event",
          description: result.error || "Failed to update the event. Please try again.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error('[useEditEvent] Error:', error);
      toast({
        title: "Error updating event",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => eventUpdateService.deleteEvent(eventId),
    onSuccess: (result) => {
      if (result.success) {
        toast({
          title: "Event deleted",
          description: "The event has been successfully deleted.",
        });
        
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
        
        onSuccess?.();
      } else {
        toast({
          title: "Error deleting event",
          description: result.error || "Failed to delete the event. Please try again.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error('[useEditEvent] Delete error:', error);
      toast({
        title: "Error deleting event",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
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


import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { playerRegistrationService, type RegistrationResult } from "../services/playerRegistrationService";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "sonner";

interface UseEventRegistrationProps {
  eventId: string;
  playerId: string | null;
}

export const useEventRegistration = ({ eventId, playerId }: UseEventRegistrationProps) => {
  const queryClient = useQueryClient();
  const [isRegistering, setIsRegistering] = useState(false);

  // Get current registration status
  const { data: registration, isLoading: isLoadingRegistration } = useQuery({
    queryKey: ['player-registration', eventId, playerId],
    queryFn: () => playerId ? playerRegistrationService.getPlayerRegistration(eventId, playerId) : null,
    enabled: !!eventId && !!playerId,
    staleTime: 30 * 1000, // 30 seconds
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: () => {
      if (!playerId) throw new Error('Player ID is required');
      return playerRegistrationService.registerForEvent(eventId, playerId);
    },
    onMutate: () => {
      setIsRegistering(true);
    },
    onSuccess: (result: RegistrationResult) => {
      if (result.success) {
        toast.success(result.message);
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ['player-registration', eventId] });
        queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(eventId) });
      } else {
        toast.error(result.message);
      }
    },
    onError: (error) => {
      console.error('Registration error:', error);
      toast.error('Failed to register for event');
    },
    onSettled: () => {
      setIsRegistering(false);
    }
  });

  // Cancel registration mutation
  const cancelMutation = useMutation({
    mutationFn: () => {
      if (!playerId) throw new Error('Player ID is required');
      return playerRegistrationService.cancelRegistration(eventId, playerId);
    },
    onMutate: () => {
      setIsRegistering(true);
    },
    onSuccess: (result: RegistrationResult) => {
      if (result.success) {
        toast.success(result.message);
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ['player-registration', eventId] });
        queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(eventId) });
      } else {
        toast.error(result.message);
      }
    },
    onError: (error) => {
      console.error('Cancellation error:', error);
      toast.error('Failed to cancel registration');
    },
    onSettled: () => {
      setIsRegistering(false);
    }
  });

  const handleRegister = () => {
    if (!playerId) {
      toast.error('You must be logged in to register');
      return;
    }
    registerMutation.mutate();
  };

  const handleCancel = () => {
    if (!playerId) {
      toast.error('You must be logged in to cancel registration');
      return;
    }
    cancelMutation.mutate();
  };

  return {
    registration,
    isLoadingRegistration,
    isRegistering,
    handleRegister,
    handleCancel,
    isRegistered: !!registration,
    registrationStatus: registration?.status || null
  };
};

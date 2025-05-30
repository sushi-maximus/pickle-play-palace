
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";
import { queryKeys } from "@/lib/queryKeys";
import { playerRegistrationService } from "../services/playerRegistrationService";

type PlayerStatus = Database['public']['Tables']['player_status']['Row'];

interface UseEventRegistrationProps {
  eventId: string;
  playerId: string | null;
}

export const useEventRegistration = ({ eventId, playerId }: UseEventRegistrationProps) => {
  const queryClient = useQueryClient();
  const [isRegistering, setIsRegistering] = useState(false);

  // Get current registration status
  const { data: registration, isLoading: isLoadingRegistration } = useQuery({
    queryKey: queryKeys.events.registration(eventId, playerId || undefined),
    queryFn: async (): Promise<PlayerStatus | null> => {
      if (!playerId) return null;
      
      const { data, error } = await supabase
        .from('player_status')
        .select('*')
        .eq('event_id', eventId)
        .eq('player_id', playerId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data;
    },
    enabled: !!eventId && !!playerId,
    staleTime: 30 * 1000, // 30 seconds
  });

  // Register mutation using the service
  const registerMutation = useMutation({
    mutationFn: async () => {
      if (!playerId) throw new Error('Player ID is required');
      
      const result = await playerRegistrationService.registerForEvent(eventId, playerId);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      return result;
    },
    onMutate: () => {
      setIsRegistering(true);
    },
    onSuccess: (result) => {
      toast.success(result.message);
      // Invalidate related queries including next event queries
      queryClient.invalidateQueries({ queryKey: queryKeys.events.registration(eventId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.players(eventId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(eventId) });
      
      // Invalidate dashboard registered events queries
      queryClient.invalidateQueries({ queryKey: ['userRegisteredEvents'] });
      
      // Get the group ID from the event to invalidate next event queries
      queryClient.getQueryCache().findAll({ queryKey: ['events'] }).forEach(query => {
        if (query.queryKey.includes('next-event')) {
          queryClient.invalidateQueries({ queryKey: query.queryKey });
        }
      });
    },
    onError: (error: Error) => {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to register for event');
    },
    onSettled: () => {
      setIsRegistering(false);
    }
  });

  // Cancel registration mutation using the service
  const cancelMutation = useMutation({
    mutationFn: async () => {
      if (!playerId) throw new Error('Player ID is required');
      
      const result = await playerRegistrationService.cancelRegistration(eventId, playerId);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      return result;
    },
    onMutate: () => {
      setIsRegistering(true);
    },
    onSuccess: (result) => {
      toast.success(result.message);
      // Invalidate related queries including next event queries
      queryClient.invalidateQueries({ queryKey: queryKeys.events.registration(eventId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.players(eventId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(eventId) });
      
      // Invalidate dashboard registered events queries
      queryClient.invalidateQueries({ queryKey: ['userRegisteredEvents'] });
      
      // Get the group ID from the event to invalidate next event queries
      queryClient.getQueryCache().findAll({ queryKey: ['events'] }).forEach(query => {
        if (query.queryKey.includes('next-event')) {
          queryClient.invalidateQueries({ queryKey: query.queryKey });
        }
      });
    },
    onError: (error: Error) => {
      console.error('Cancellation error:', error);
      toast.error(error.message || 'Failed to cancel registration');
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

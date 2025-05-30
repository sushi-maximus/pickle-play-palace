
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

  // Get current registration status - ensuring consistent query key
  const { data: registration, isLoading: isLoadingRegistration } = useQuery({
    queryKey: ['playerRegistration', eventId, playerId],
    queryFn: async (): Promise<PlayerStatus | null> => {
      if (!playerId) return null;
      
      console.log('[Event Registration] Fetching registration status:', { eventId, playerId });
      
      const { data, error } = await supabase
        .from('player_status')
        .select('*')
        .eq('event_id', eventId)
        .eq('player_id', playerId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('[Event Registration] Fetch error:', error);
        throw error;
      }
      
      console.log('[Event Registration] Registration data:', data);
      return data;
    },
    enabled: !!eventId && !!playerId,
    staleTime: 10 * 1000, // 10 seconds - shorter than dashboard to ensure freshness
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
      
      // Invalidate ALL related queries with consistent keys
      queryClient.invalidateQueries({ queryKey: ['playerRegistration', eventId] });
      queryClient.invalidateQueries({ queryKey: ['userRegisteredEvents'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.players(eventId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(eventId) });
      
      // Invalidate next event queries for any group
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          return query.queryKey.some(key => 
            typeof key === 'string' && key.includes('next-event')
          );
        }
      });
      
      console.log('[Event Registration] Successfully registered, invalidated queries');
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
      
      // Invalidate ALL related queries with consistent keys
      queryClient.invalidateQueries({ queryKey: ['playerRegistration', eventId] });
      queryClient.invalidateQueries({ queryKey: ['userRegisteredEvents'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.players(eventId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(eventId) });
      
      // Invalidate next event queries for any group
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          return query.queryKey.some(key => 
            typeof key === 'string' && key.includes('next-event')
          );
        }
      });
      
      console.log('[Event Registration] Successfully cancelled, invalidated queries');
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

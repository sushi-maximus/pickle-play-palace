
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type PlayerStatus = Database['public']['Tables']['player_status']['Row'];

interface UseEventRegistrationProps {
  eventId: string;
  playerId: string | null;
}

interface RegistrationResult {
  success: boolean;
  message: string;
  status?: string;
}

export const useEventRegistration = ({ eventId, playerId }: UseEventRegistrationProps) => {
  const queryClient = useQueryClient();
  const [isRegistering, setIsRegistering] = useState(false);

  // Get current registration status
  const { data: registration, isLoading: isLoadingRegistration } = useQuery({
    queryKey: ['player-registration', eventId, playerId],
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

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (): Promise<RegistrationResult> => {
      if (!playerId) throw new Error('Player ID is required');
      
      // For now, simple registration - more complex logic will be added in later steps
      const { data, error } = await supabase
        .from('player_status')
        .insert({
          event_id: eventId,
          player_id: playerId,
          status: 'waitlist', // Default to waitlist, confirmation logic in later steps
          registration_timestamp: new Date().toISOString(),
          ranking_order: 0
        })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          message: error.message || 'Failed to register for event'
        };
      }

      return {
        success: true,
        message: 'Successfully registered for event!',
        status: data.status
      };
    },
    onMutate: () => {
      setIsRegistering(true);
    },
    onSuccess: (result: RegistrationResult) => {
      if (result.success) {
        toast.success(result.message);
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ['player-registration', eventId] });
        queryClient.invalidateQueries({ queryKey: ['events', 'detail', eventId] });
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
    mutationFn: async (): Promise<RegistrationResult> => {
      if (!playerId) throw new Error('Player ID is required');
      
      const { error } = await supabase
        .from('player_status')
        .delete()
        .eq('event_id', eventId)
        .eq('player_id', playerId);

      if (error) {
        return {
          success: false,
          message: error.message || 'Failed to cancel registration'
        };
      }

      return {
        success: true,
        message: 'Registration cancelled successfully!'
      };
    },
    onMutate: () => {
      setIsRegistering(true);
    },
    onSuccess: (result: RegistrationResult) => {
      if (result.success) {
        toast.success(result.message);
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ['player-registration', eventId] });
        queryClient.invalidateQueries({ queryKey: ['events', 'detail', eventId] });
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

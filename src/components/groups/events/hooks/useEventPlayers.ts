
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { queryKeys } from "@/lib/queryKeys";

type PlayerStatus = Database['public']['Tables']['player_status']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface EventPlayer extends PlayerStatus {
  profiles: Profile;
}

interface UseEventPlayersProps {
  eventId: string;
  enabled?: boolean;
}

export const useEventPlayers = ({ eventId, enabled = true }: UseEventPlayersProps) => {
  const { data: players = [], isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.events.players(eventId),
    queryFn: async (): Promise<EventPlayer[]> => {
      const { data, error } = await supabase
        .from('player_status')
        .select(`
          *,
          profiles!player_status_player_id_fkey (*)
        `)
        .eq('event_id', eventId)
        .order('ranking_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!eventId && enabled
  });

  // Separate confirmed and waitlisted players with proper ranking order
  const confirmedPlayers = players
    .filter(player => player.status === 'confirmed')
    .sort((a, b) => {
      // Primary sort by ranking_order, fallback to registration timestamp
      if (a.ranking_order !== b.ranking_order) {
        return a.ranking_order - b.ranking_order;
      }
      return new Date(a.registration_timestamp).getTime() - new Date(b.registration_timestamp).getTime();
    });

  const waitlistPlayers = players
    .filter(player => player.status === 'waitlist')
    .sort((a, b) => new Date(a.registration_timestamp).getTime() - new Date(b.registration_timestamp).getTime());

  return {
    players,
    confirmedPlayers,
    waitlistPlayers,
    isLoading,
    error,
    refetch
  };
};

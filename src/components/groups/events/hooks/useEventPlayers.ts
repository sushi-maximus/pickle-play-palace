
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

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
    queryKey: ['events', 'players', eventId],
    queryFn: async (): Promise<EventPlayer[]> => {
      const { data, error } = await supabase
        .from('player_status')
        .select(`
          *,
          profiles!player_status_player_id_fkey (
            id,
            first_name,
            last_name,
            dupr_rating,
            skill_level,
            avatar_url
          )
        `)
        .eq('event_id', eventId)
        .order('ranking_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!eventId && enabled
  });

  // Separate confirmed and waitlisted players
  const confirmedPlayers = players.filter(player => player.status === 'confirmed');
  const waitlistPlayers = players.filter(player => player.status === 'waitlist')
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

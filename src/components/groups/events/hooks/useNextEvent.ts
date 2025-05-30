
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { queryKeys } from "@/lib/queryKeys";
import type { Database } from "@/integrations/supabase/types";

type Event = Database['public']['Tables']['events']['Row'];
type PlayerStatus = Database['public']['Tables']['player_status']['Row'];

interface NextEventData {
  event: Event;
  registrationStatus: PlayerStatus | null;
}

interface UseNextEventProps {
  groupId: string;
  userId: string | null;
  enabled?: boolean;
}

export const useNextEvent = ({ groupId, userId, enabled = true }: UseNextEventProps) => {
  const {
    data: nextEventData,
    isLoading,
    error
  } = useQuery({
    queryKey: [...queryKeys.events.group(groupId), 'next-event', userId],
    queryFn: async (): Promise<NextEventData | null> => {
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

      // Get the next event within 7 days
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('group_id', groupId)
        .gte('event_date', new Date().toISOString().split('T')[0])
        .lte('event_date', sevenDaysFromNow.toISOString().split('T')[0])
        .order('event_date', { ascending: true })
        .order('event_time', { ascending: true })
        .limit(1);

      if (eventsError) {
        console.error('Error fetching next event:', eventsError);
        throw new Error(eventsError.message);
      }

      if (!events || events.length === 0) {
        return null;
      }

      const nextEvent = events[0];
      let registrationStatus: PlayerStatus | null = null;

      // Get user's registration status if logged in
      if (userId) {
        const { data: playerStatus, error: statusError } = await supabase
          .from('player_status')
          .select('*')
          .eq('event_id', nextEvent.id)
          .eq('player_id', userId)
          .maybeSingle();

        if (statusError) {
          console.error('Error fetching registration status:', statusError);
          // Don't throw error here, just log it and continue without status
        } else {
          registrationStatus = playerStatus;
        }
      }

      return {
        event: nextEvent,
        registrationStatus
      };
    },
    enabled: enabled && !!groupId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    nextEventData,
    isLoading,
    error: error as Error | null,
    hasNextEvent: !!nextEventData
  };
};

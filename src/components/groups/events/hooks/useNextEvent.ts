
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
    queryKey: ['nextEvent', groupId, userId],
    queryFn: async (): Promise<NextEventData | null> => {
      // Get today's date in local timezone (YYYY-MM-DD format)
      const today = new Date();
      const todayStr = today.getFullYear() + '-' + 
        String(today.getMonth() + 1).padStart(2, '0') + '-' + 
        String(today.getDate()).padStart(2, '0');

      // Get date 7 days from now in local timezone
      const sevenDaysFromNow = new Date(today);
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      const sevenDaysStr = sevenDaysFromNow.getFullYear() + '-' + 
        String(sevenDaysFromNow.getMonth() + 1).padStart(2, '0') + '-' + 
        String(sevenDaysFromNow.getDate()).padStart(2, '0');

      console.log('[Next Event] Date range:', { todayStr, sevenDaysStr, groupId });

      // Get the next event within 7 days (including today)
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('group_id', groupId)
        .gte('event_date', todayStr)
        .lte('event_date', sevenDaysStr)
        .order('event_date', { ascending: true })
        .order('event_time', { ascending: true })
        .limit(1);

      if (eventsError) {
        console.error('[Next Event] Error fetching events:', eventsError);
        throw new Error(eventsError.message);
      }

      if (!events || events.length === 0) {
        console.log('[Next Event] No events found in the next 7 days for group:', groupId);
        return null;
      }

      const nextEvent = events[0];
      console.log('[Next Event] Found next event:', nextEvent);
      let registrationStatus: PlayerStatus | null = null;

      // Get user's registration status if logged in - using consistent query approach
      if (userId) {
        console.log('[Next Event] Checking registration status for user:', userId);
        
        const { data: playerStatus, error: statusError } = await supabase
          .from('player_status')
          .select('*')
          .eq('event_id', nextEvent.id)
          .eq('player_id', userId)
          .maybeSingle();

        if (statusError) {
          console.error('[Next Event] Error fetching registration status:', statusError);
          // Don't throw error here, just log it and continue without status
        } else {
          registrationStatus = playerStatus;
          console.log('[Next Event] User registration status:', registrationStatus);
        }
      }

      return {
        event: nextEvent,
        registrationStatus
      };
    },
    enabled: enabled && !!groupId,
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
  });

  return {
    nextEventData,
    isLoading,
    error: error as Error | null,
    hasNextEvent: !!nextEventData
  };
};

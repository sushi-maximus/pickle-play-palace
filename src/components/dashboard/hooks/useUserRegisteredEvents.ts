
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

type Event = Database['public']['Tables']['events']['Row'];
type PlayerStatus = Database['public']['Tables']['player_status']['Row'];

export type RegisteredEvent = Event & {
  status: PlayerStatus['status'];
  registration_timestamp: string;
  ranking_order: number;
};

export const useUserRegisteredEvents = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userRegisteredEvents', user?.id],
    queryFn: async () => {
      console.log('Fetching registered events for user:', user?.id);

      // First get the player status records
      const { data: playerStatusData, error: playerStatusError } = await supabase
        .from('player_status')
        .select('*')
        .eq('player_id', user?.id!);

      if (playerStatusError) {
        console.error('Error fetching player status:', playerStatusError);
        throw playerStatusError;
      }

      console.log('Player status data:', playerStatusData);

      if (!playerStatusData || playerStatusData.length === 0) {
        console.log('No player status records found');
        return [];
      }

      // Get the event IDs from player status
      const eventIds = playerStatusData.map(ps => ps.event_id);

      // Now fetch the events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .in('id', eventIds)
        .order('event_date', { ascending: true })
        .order('event_time', { ascending: true });

      if (eventsError) {
        console.error('Error fetching events:', eventsError);
        throw eventsError;
      }

      console.log('Events data:', eventsData);

      // Combine the data
      const registeredEvents: RegisteredEvent[] = (eventsData || []).map(event => {
        const playerStatus = playerStatusData.find(ps => ps.event_id === event.id);
        return {
          ...event,
          status: playerStatus?.status || 'confirmed',
          registration_timestamp: playerStatus?.registration_timestamp || '',
          ranking_order: playerStatus?.ranking_order || 0,
        };
      });

      console.log('Transformed registered events:', registeredEvents);

      return registeredEvents;
    },
    enabled: !!user?.id,
  });
};

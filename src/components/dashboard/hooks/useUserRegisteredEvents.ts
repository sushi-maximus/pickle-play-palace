
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
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('player_status')
        .select(`
          status,
          registration_timestamp,
          ranking_order,
          events (
            id,
            event_title,
            event_date,
            event_time,
            location,
            description,
            group_id
          )
        `)
        .eq('player_id', user.id)
        .gte('events.event_date', new Date().toISOString().split('T')[0])
        .order('events.event_date', { ascending: true })
        .order('events.event_time', { ascending: true });

      if (error) {
        console.error('Error fetching registered events:', error);
        throw error;
      }

      // Transform the data to match our expected format
      const registeredEvents: RegisteredEvent[] = (data || [])
        .filter(item => item.events !== null)
        .map(item => ({
          ...(item.events as Event),
          status: item.status,
          registration_timestamp: item.registration_timestamp,
          ranking_order: item.ranking_order,
        }));

      return registeredEvents;
    },
    enabled: !!user?.id,
  });
};

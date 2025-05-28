
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { queryKeys } from "@/lib/queryKeys";
import type { Database } from "@/integrations/supabase/types";

type Event = Database['public']['Tables']['events']['Row'];

interface UseGroupEventsProps {
  groupId: string;
  enabled?: boolean;
}

interface UseGroupEventsResult {
  events: Event[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useGroupEvents = ({ groupId, enabled = true }: UseGroupEventsProps): UseGroupEventsResult => {
  const {
    data: events = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: queryKeys.events.group(groupId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('group_id', groupId)
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true })
        .order('event_time', { ascending: true });

      if (error) {
        console.error('Error fetching group events:', error);
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: enabled && !!groupId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    events,
    isLoading,
    error: error as Error | null,
    refetch
  };
};

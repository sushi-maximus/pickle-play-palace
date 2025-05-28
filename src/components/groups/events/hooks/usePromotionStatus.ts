
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { queryKeys } from "@/lib/queryKeys";
import type { Temp_ExtendedPlayerStatus } from "../types/promotionTypes";

interface UsePromotionStatusProps {
  eventId: string;
  playerId?: string;
}

export const usePromotionStatus = ({ eventId, playerId }: UsePromotionStatusProps) => {
  const { data: promotionStatus, isLoading } = useQuery({
    queryKey: [...queryKeys.events.registration(eventId, playerId), 'promotion'],
    queryFn: async (): Promise<Temp_ExtendedPlayerStatus | null> => {
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
      
      return data as Temp_ExtendedPlayerStatus;
    },
    enabled: !!eventId && !!playerId,
    staleTime: 30 * 1000, // 30 seconds
  });

  const wasPromoted = Boolean(promotionStatus?.promoted_at);
  const isRecentPromotion = promotionStatus?.promoted_at && 
    (Date.now() - new Date(promotionStatus.promoted_at).getTime()) < 24 * 60 * 60 * 1000; // 24 hours

  return {
    promotionStatus,
    wasPromoted,
    isRecentPromotion,
    isLoading,
    promotionReason: promotionStatus?.promotion_reason,
    promotedAt: promotionStatus?.promoted_at
  };
};

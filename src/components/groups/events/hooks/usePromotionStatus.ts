
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { queryKeys } from "@/lib/queryKeys";
import type { PlayerStatus } from "../types/promotionTypes";

interface UsePromotionStatusProps {
  eventId: string;
  playerId?: string;
}

export const usePromotionStatus = ({ eventId, playerId }: UsePromotionStatusProps) => {
  const { data: promotionStatus, isLoading } = useQuery({
    queryKey: [...queryKeys.events.registration(eventId, playerId), 'promotion'],
    queryFn: async (): Promise<PlayerStatus | null> => {
      if (!playerId) return null;
      
      console.log('[Promotion Validation] Fetching promotion status for:', { eventId, playerId });
      
      const { data, error } = await supabase
        .from('player_status')
        .select('*')
        .eq('event_id', eventId)
        .eq('player_id', playerId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('[Promotion Validation] Error fetching promotion status:', error);
        throw error;
      }
      
      console.log('[Promotion Validation] Promotion status data:', data);
      console.log('[Promotion Validation] Has promotion fields:', {
        promoted_at: data?.promoted_at,
        promotion_reason: data?.promotion_reason
      });
      
      return data;
    },
    enabled: !!eventId && !!playerId,
    staleTime: 30 * 1000, // 30 seconds
  });

  const wasPromoted = Boolean(promotionStatus?.promoted_at);
  const isRecentPromotion = promotionStatus?.promoted_at && 
    (Date.now() - new Date(promotionStatus.promoted_at).getTime()) < 24 * 60 * 60 * 1000; // 24 hours

  console.log('[Promotion Validation] Promotion status computed:', {
    wasPromoted,
    isRecentPromotion,
    promoted_at: promotionStatus?.promoted_at,
    promotion_reason: promotionStatus?.promotion_reason
  });

  return {
    promotionStatus,
    wasPromoted,
    isRecentPromotion,
    isLoading,
    promotionReason: promotionStatus?.promotion_reason,
    promotedAt: promotionStatus?.promoted_at
  };
};

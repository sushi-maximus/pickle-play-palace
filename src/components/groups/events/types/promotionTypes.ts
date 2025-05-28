
import type { Database } from "@/integrations/supabase/types";

// Temporarily extend PlayerStatus until Supabase types are regenerated
export type PlayerStatus = Database['public']['Tables']['player_status']['Row'] & {
  promoted_at?: string | null;
  promotion_reason?: string | null;
};

// Component props using extended types
export interface PromotionIndicatorProps {
  registration: PlayerStatus;
  size?: 'sm' | 'md';
}

export interface PromotionBannerProps {
  registration: PlayerStatus;
  className?: string;
}

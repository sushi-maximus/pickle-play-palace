
import type { Database } from "@/integrations/supabase/types";

// TODO: TEMPORARY TYPES - Remove after Supabase types regeneration
// These types extend the base PlayerStatus with promotion fields
// Once Supabase types are regenerated with promoted_at and promotion_reason columns,
// replace all usage with native Database['public']['Tables']['player_status']['Row']

type PlayerStatus = Database['public']['Tables']['player_status']['Row'];

export type Temp_ExtendedPlayerStatus = PlayerStatus & {
  promoted_at?: string | null;
  promotion_reason?: string | null;
};

// TODO: Remove this interface after type cleanup
export interface Temp_PromotionIndicatorProps {
  registration: Temp_ExtendedPlayerStatus;
  size?: 'sm' | 'md';
}

// TODO: Remove this interface after type cleanup  
export interface Temp_PromotionBannerProps {
  registration: Temp_ExtendedPlayerStatus;
  className?: string;
}


import type { Database } from "@/integrations/supabase/types";

// Native database types - promotion fields are now part of the schema
export type PlayerStatus = Database['public']['Tables']['player_status']['Row'];

// Component props using native types
export interface PromotionIndicatorProps {
  registration: PlayerStatus;
  size?: 'sm' | 'md';
}

export interface PromotionBannerProps {
  registration: PlayerStatus;
  className?: string;
}

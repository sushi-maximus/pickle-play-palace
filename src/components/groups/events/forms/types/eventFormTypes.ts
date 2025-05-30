
import type { Database } from "@/integrations/supabase/types";

export type Event = Database['public']['Tables']['events']['Row'];

export interface EventFormData {
  event_title: string;
  description: string;
  event_date: string; // Database format: "MM-DD-YY"
  event_time: string;
  location: string;
  max_players: number;
  allow_reserves: boolean;
  registration_open: boolean;
  pricing_model: "free" | "one-time" | "per-event";
  fee_amount: number | null;
}

export interface EventFormErrors {
  event_title?: string;
  description?: string;
  event_date?: string;
  event_time?: string;
  location?: string;
  max_players?: string;
  fee_amount?: string;
}

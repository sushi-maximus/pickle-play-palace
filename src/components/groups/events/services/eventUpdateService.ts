
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Event = Database['public']['Tables']['events']['Row'];
type EventUpdate = Partial<Omit<Event, 'id' | 'created_at' | 'group_id'>>;

export interface EventUpdateData {
  event_title?: string;
  description?: string;
  event_date?: string;
  event_time?: string;
  location?: string;
  max_players?: number;
  allow_reserves?: boolean;
  registration_open?: boolean;
  fee_amount?: number;
  pricing_model?: string;
}

export const eventUpdateService = {
  /**
   * Updates an event with the provided data
   */
  async updateEvent(eventId: string, updates: EventUpdateData): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('[Event Update Service] Updating event:', { eventId, updates });
      
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', eventId)
        .select()
        .single();

      if (error) {
        console.error('[Event Update Service] Error updating event:', error);
        return {
          success: false,
          error: error.message
        };
      }

      console.log('[Event Update Service] Event updated successfully:', data);
      return {
        success: true
      };
    } catch (error) {
      console.error('[Event Update Service] Unexpected error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  /**
   * Deletes an event (admin only)
   */
  async deleteEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('[Event Update Service] Deleting event:', eventId);
      
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) {
        console.error('[Event Update Service] Error deleting event:', error);
        return {
          success: false,
          error: error.message
        };
      }

      console.log('[Event Update Service] Event deleted successfully');
      return {
        success: true
      };
    } catch (error) {
      console.error('[Event Update Service] Unexpected error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};

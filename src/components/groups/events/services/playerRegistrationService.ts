
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type PlayerStatus = Database['public']['Tables']['player_status']['Row'];
type PlayerStatusInsert = Database['public']['Tables']['player_status']['Insert'];

export interface RegistrationResult {
  success: boolean;
  status: string;
  message: string;
  registrationData?: PlayerStatus;
}

export const playerRegistrationService = {
  async registerForEvent(eventId: string, playerId: string): Promise<RegistrationResult> {
    try {
      // Check if user is already registered
      const { data: existingRegistration } = await supabase
        .from('player_status')
        .select('*')
        .eq('event_id', eventId)
        .eq('player_id', playerId)
        .single();

      if (existingRegistration) {
        return {
          success: false,
          status: existingRegistration.status,
          message: `You are already ${existingRegistration.status} for this event`
        };
      }

      // Get event details to check capacity
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('max_players, allow_reserves')
        .eq('id', eventId)
        .single();

      if (eventError || !event) {
        return {
          success: false,
          status: 'error',
          message: 'Could not load event details'
        };
      }

      // Count current confirmed players
      const { count: confirmedCount } = await supabase
        .from('player_status')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('status', 'confirmed');

      // Determine registration status
      const isEventFull = (confirmedCount || 0) >= event.max_players;
      const registrationStatus = isEventFull && event.allow_reserves ? 'waitlist' : 'confirmed';

      // Calculate ranking order
      let rankingOrder = 1;
      if (registrationStatus === 'confirmed') {
        const { count } = await supabase
          .from('player_status')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', eventId)
          .eq('status', 'confirmed');
        rankingOrder = (count || 0) + 1;
      } else {
        const { count } = await supabase
          .from('player_status')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', eventId)
          .eq('status', 'waitlist');
        rankingOrder = (count || 0) + 1;
      }

      // Insert registration
      const registrationData: PlayerStatusInsert = {
        event_id: eventId,
        player_id: playerId,
        status: registrationStatus,
        ranking_order: rankingOrder,
        registration_timestamp: new Date().toISOString()
      };

      const { data: newRegistration, error: insertError } = await supabase
        .from('player_status')
        .insert(registrationData)
        .select()
        .single();

      if (insertError) {
        console.error('Registration error:', insertError);
        return {
          success: false,
          status: 'error',
          message: 'Failed to register for event'
        };
      }

      return {
        success: true,
        status: registrationStatus,
        message: registrationStatus === 'confirmed' 
          ? 'Successfully registered for event!' 
          : 'Added to waitlist',
        registrationData: newRegistration
      };

    } catch (error) {
      console.error('Registration service error:', error);
      return {
        success: false,
        status: 'error',
        message: 'An unexpected error occurred'
      };
    }
  },

  async cancelRegistration(eventId: string, playerId: string): Promise<RegistrationResult> {
    try {
      const { error } = await supabase
        .from('player_status')
        .delete()
        .eq('event_id', eventId)
        .eq('player_id', playerId);

      if (error) {
        console.error('Cancellation error:', error);
        return {
          success: false,
          status: 'error',
          message: 'Failed to cancel registration'
        };
      }

      // TODO: Implement waitlist promotion logic here
      // When a confirmed player cancels, promote first waitlist player

      return {
        success: true,
        status: 'cancelled',
        message: 'Registration cancelled successfully'
      };

    } catch (error) {
      console.error('Cancellation service error:', error);
      return {
        success: false,
        status: 'error',
        message: 'An unexpected error occurred'
      };
    }
  },

  async getPlayerRegistration(eventId: string, playerId: string): Promise<PlayerStatus | null> {
    try {
      const { data, error } = await supabase
        .from('player_status')
        .select('*')
        .eq('event_id', eventId)
        .eq('player_id', playerId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching player registration:', error);
        return null;
      }

      return data || null;
    } catch (error) {
      console.error('Service error:', error);
      return null;
    }
  }
};

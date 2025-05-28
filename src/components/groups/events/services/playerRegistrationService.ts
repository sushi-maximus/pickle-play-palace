
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

export interface PromotionResult {
  playerId: string;
  promoted: boolean;
  newStatus: string;
  promotionReason: string;
}

export const playerRegistrationService = {
  async registerForEvent(eventId: string, playerId: string): Promise<RegistrationResult> {
    try {
      console.log('[Registration Validation] Starting registration:', { eventId, playerId });
      
      // Check if user is already registered
      const { data: existingRegistration } = await supabase
        .from('player_status')
        .select('*')
        .eq('event_id', eventId)
        .eq('player_id', playerId)
        .single();

      if (existingRegistration) {
        console.log('[Registration Validation] User already registered:', existingRegistration);
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
        console.error('[Registration Validation] Event error:', eventError);
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

      console.log('[Registration Validation] Registration status determined:', {
        confirmedCount,
        maxPlayers: event.max_players,
        isEventFull,
        registrationStatus
      });

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

      console.log('[Registration Validation] Inserting registration:', registrationData);

      const { data: newRegistration, error: insertError } = await supabase
        .from('player_status')
        .insert(registrationData)
        .select()
        .single();

      if (insertError) {
        console.error('[Registration Validation] Insert error:', insertError);
        return {
          success: false,
          status: 'error',
          message: 'Failed to register for event'
        };
      }

      console.log('[Registration Validation] Registration successful:', newRegistration);

      return {
        success: true,
        status: registrationStatus,
        message: registrationStatus === 'confirmed' 
          ? 'Successfully registered for event!' 
          : 'Added to waitlist',
        registrationData: newRegistration
      };

    } catch (error) {
      console.error('[Registration Validation] Service error:', error);
      return {
        success: false,
        status: 'error',
        message: 'An unexpected error occurred'
      };
    }
  },

  async cancelRegistration(eventId: string, playerId: string): Promise<RegistrationResult> {
    try {
      console.log('[Cancellation Validation] Starting cancellation:', { eventId, playerId });
      
      // Get the player's current registration to check their status
      const { data: currentRegistration } = await supabase
        .from('player_status')
        .select('status')
        .eq('event_id', eventId)
        .eq('player_id', playerId)
        .single();

      if (!currentRegistration) {
        console.log('[Cancellation Validation] No registration found');
        return {
          success: false,
          status: 'error',
          message: 'Registration not found'
        };
      }

      console.log('[Cancellation Validation] Current registration:', currentRegistration);

      // Delete the registration
      const { error } = await supabase
        .from('player_status')
        .delete()
        .eq('event_id', eventId)
        .eq('player_id', playerId);

      if (error) {
        console.error('[Cancellation Validation] Delete error:', error);
        return {
          success: false,
          status: 'error',
          message: 'Failed to cancel registration'
        };
      }

      // If a confirmed player cancelled, promote waitlist players
      if (currentRegistration.status === 'confirmed') {
        console.log('[Cancellation Validation] Confirmed player cancelled, promoting waitlist...');
        await this.promoteWaitlistPlayers(eventId, 1);
      }

      console.log('[Cancellation Validation] Cancellation successful');

      return {
        success: true,
        status: 'cancelled',
        message: 'Registration cancelled successfully'
      };

    } catch (error) {
      console.error('[Cancellation Validation] Service error:', error);
      return {
        success: false,
        status: 'error',
        message: 'An unexpected error occurred'
      };
    }
  },

  async promoteWaitlistPlayers(eventId: string, slotsAvailable: number): Promise<PromotionResult[]> {
    try {
      console.log('[Promotion Validation] Starting promotion:', { eventId, slotsAvailable });
      
      // Get waitlisted players ordered by registration timestamp (first come, first served)
      const { data: waitlistPlayers, error: waitlistError } = await supabase
        .from('player_status')
        .select('player_id, ranking_order')
        .eq('event_id', eventId)
        .eq('status', 'waitlist')
        .order('registration_timestamp', { ascending: true })
        .limit(slotsAvailable);

      if (waitlistError) {
        console.error('[Promotion Validation] Waitlist fetch error:', waitlistError);
        return [];
      }

      if (!waitlistPlayers || waitlistPlayers.length === 0) {
        console.log('[Promotion Validation] No waitlist players to promote');
        return [];
      }

      console.log('[Promotion Validation] Found waitlist players:', waitlistPlayers);

      const promotionResults: PromotionResult[] = [];

      // Promote each waitlisted player
      for (const player of waitlistPlayers) {
        console.log('[Promotion Validation] Promoting player:', player.player_id);
        
        const promoted = await this.updatePlayerStatus(
          player.player_id, 
          eventId, 
          'confirmed', 
          'player_cancelled'
        );

        promotionResults.push({
          playerId: player.player_id,
          promoted,
          newStatus: promoted ? 'confirmed' : 'waitlist',
          promotionReason: 'player_cancelled'
        });

        if (promoted) {
          console.log('[Promotion Validation] Successfully promoted player:', player.player_id);
        }
      }

      console.log('[Promotion Validation] Promotion completed:', promotionResults);
      
      return promotionResults;

    } catch (error) {
      console.error('[Promotion Validation] Promotion error:', error);
      return [];
    }
  },

  async updatePlayerStatus(
    playerId: string, 
    eventId: string, 
    newStatus: string, 
    promotionReason?: string
  ): Promise<boolean> {
    try {
      console.log('[Status Update Validation] Updating player status:', {
        playerId,
        eventId,
        newStatus,
        promotionReason
      });
      
      const updateData: any = {
        status: newStatus
      };

      // If promoting from waitlist, add promotion tracking fields
      if (newStatus === 'confirmed' && promotionReason) {
        updateData.promoted_at = new Date().toISOString();
        updateData.promotion_reason = promotionReason;
        
        console.log('[Status Update Validation] Adding promotion fields:', {
          promoted_at: updateData.promoted_at,
          promotion_reason: updateData.promotion_reason
        });
      }

      const { error } = await supabase
        .from('player_status')
        .update(updateData)
        .eq('player_id', playerId)
        .eq('event_id', eventId);

      if (error) {
        console.error('[Status Update Validation] Update error:', error);
        return false;
      }

      console.log('[Status Update Validation] Status updated successfully');
      return true;

    } catch (error) {
      console.error('[Status Update Validation] Update service error:', error);
      return false;
    }
  },

  async getPlayerRegistration(eventId: string, playerId: string): Promise<PlayerStatus | null> {
    try {
      console.log('[Get Registration Validation] Fetching registration:', { eventId, playerId });
      
      const { data, error } = await supabase
        .from('player_status')
        .select('*')
        .eq('event_id', eventId)
        .eq('player_id', playerId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('[Get Registration Validation] Fetch error:', error);
        return null;
      }

      console.log('[Get Registration Validation] Registration data:', data);
      
      return data || null;
    } catch (error) {
      console.error('[Get Registration Validation] Service error:', error);
      return null;
    }
  }
};

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
      console.log('[Group Registration] Starting registration:', { eventId, playerId });
      
      // Check if user is already registered
      const { data: existingRegistration } = await supabase
        .from('player_status')
        .select('*')
        .eq('event_id', eventId)
        .eq('player_id', playerId)
        .single();

      if (existingRegistration) {
        console.log('[Group Registration] User already registered:', existingRegistration);
        return {
          success: false,
          status: existingRegistration.status,
          message: `You are already ${existingRegistration.status} for this event`
        };
      }

      // Get event details
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('max_players, allow_reserves')
        .eq('id', eventId)
        .single();

      if (eventError || !event) {
        console.error('[Group Registration] Event error:', eventError);
        return {
          success: false,
          status: 'error',
          message: 'Could not load event details'
        };
      }

      // Count current players by status
      const { count: confirmedCount } = await supabase
        .from('player_status')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('status', 'confirmed');

      const { count: waitlistCount } = await supabase
        .from('player_status')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('status', 'waitlist');

      console.log('[Group Registration] Current counts:', {
        confirmed: confirmedCount || 0,
        waitlist: waitlistCount || 0,
        maxPlayers: event.max_players
      });

      // Group-of-4 logic: determine if this player completes a group
      const currentWaitlist = waitlistCount || 0;
      const currentConfirmed = confirmedCount || 0;
      
      let registrationStatus: string;
      let shouldPromoteGroup = false;

      if (currentWaitlist === 3) {
        // This player would complete a group of 4
        if (currentConfirmed + 4 <= event.max_players) {
          // Space available for full group
          registrationStatus = 'confirmed';
          shouldPromoteGroup = true;
        } else {
          // Event would be full, add to waitlist
          registrationStatus = 'waitlist';
        }
      } else {
        // Not completing a group, add to waitlist
        registrationStatus = 'waitlist';
      }

      console.log('[Group Registration] Registration decision:', {
        registrationStatus,
        shouldPromoteGroup,
        currentWaitlist,
        currentConfirmed
      });

      if (shouldPromoteGroup) {
        // Promote the entire group of 4 (3 waitlisted + 1 new)
        return await this.promoteGroupOfFour(eventId, playerId);
      } else {
        // Add player to waitlist
        const rankingOrder = currentWaitlist + 1;
        
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
          console.error('[Group Registration] Insert error:', insertError);
          return {
            success: false,
            status: 'error',
            message: 'Failed to register for event'
          };
        }

        return {
          success: true,
          status: registrationStatus,
          message: 'Added to waitlist',
          registrationData: newRegistration
        };
      }

    } catch (error) {
      console.error('[Group Registration] Service error:', error);
      return {
        success: false,
        status: 'error',
        message: 'An unexpected error occurred'
      };
    }
  },

  async promoteGroupOfFour(eventId: string, newPlayerId: string): Promise<RegistrationResult> {
    try {
      console.log('[Group Promotion] Promoting group of 4 including:', newPlayerId);

      // Get the 3 waitlisted players
      const { data: waitlistedPlayers, error: waitlistError } = await supabase
        .from('player_status')
        .select('player_id, ranking_order')
        .eq('event_id', eventId)
        .eq('status', 'waitlist')
        .order('registration_timestamp', { ascending: true })
        .limit(3);

      if (waitlistError || !waitlistedPlayers || waitlistedPlayers.length !== 3) {
        console.error('[Group Promotion] Error fetching waitlisted players:', waitlistError);
        return {
          success: false,
          status: 'error',
          message: 'Error promoting group'
        };
      }

      // Get current confirmed count for ranking
      const { count: confirmedCount } = await supabase
        .from('player_status')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('status', 'confirmed');

      const baseRanking = (confirmedCount || 0) + 1;

      // Update the 3 waitlisted players to confirmed
      const playerIds = waitlistedPlayers.map(p => p.player_id);
      
      for (let i = 0; i < playerIds.length; i++) {
        await supabase
          .from('player_status')
          .update({
            status: 'confirmed',
            ranking_order: baseRanking + i,
            promoted_at: new Date().toISOString(),
            promotion_reason: 'group_completed'
          })
          .eq('event_id', eventId)
          .eq('player_id', playerIds[i]);
      }

      // Insert the new player as confirmed
      const newPlayerData: PlayerStatusInsert = {
        event_id: eventId,
        player_id: newPlayerId,
        status: 'confirmed',
        ranking_order: baseRanking + 3,
        registration_timestamp: new Date().toISOString()
      };

      const { data: newRegistration, error: insertError } = await supabase
        .from('player_status')
        .insert(newPlayerData)
        .select()
        .single();

      if (insertError) {
        console.error('[Group Promotion] New player insert error:', insertError);
        return {
          success: false,
          status: 'error',
          message: 'Failed to complete group registration'
        };
      }

      console.log('[Group Promotion] Successfully promoted group of 4');

      return {
        success: true,
        status: 'confirmed',
        message: 'Registered! Your group of 4 has been confirmed.',
        registrationData: newRegistration
      };

    } catch (error) {
      console.error('[Group Promotion] Service error:', error);
      return {
        success: false,
        status: 'error',
        message: 'An unexpected error occurred during group promotion'
      };
    }
  },

  async cancelRegistration(eventId: string, playerId: string): Promise<RegistrationResult> {
    try {
      console.log('[Group Cancellation] Starting cancellation:', { eventId, playerId });
      
      // Get the player's current registration
      const { data: currentRegistration } = await supabase
        .from('player_status')
        .select('status, ranking_order')
        .eq('event_id', eventId)
        .eq('player_id', playerId)
        .single();

      if (!currentRegistration) {
        return {
          success: false,
          status: 'error',
          message: 'Registration not found'
        };
      }

      console.log('[Group Cancellation] Current registration:', currentRegistration);

      // Delete the registration
      const { error: deleteError } = await supabase
        .from('player_status')
        .delete()
        .eq('event_id', eventId)
        .eq('player_id', playerId);

      if (deleteError) {
        console.error('[Group Cancellation] Delete error:', deleteError);
        return {
          success: false,
          status: 'error',
          message: 'Failed to cancel registration'
        };
      }

      // If a confirmed player cancelled, handle group breakage
      if (currentRegistration.status === 'confirmed') {
        await this.handleConfirmedCancellation(eventId);
      }

      return {
        success: true,
        status: 'cancelled',
        message: 'Registration cancelled successfully'
      };

    } catch (error) {
      console.error('[Group Cancellation] Service error:', error);
      return {
        success: false,
        status: 'error',
        message: 'An unexpected error occurred'
      };
    }
  },

  async handleConfirmedCancellation(eventId: string): Promise<void> {
    try {
      console.log('[Group Breakage] Handling confirmed player cancellation');

      // Get current confirmed count
      const { count: confirmedCount } = await supabase
        .from('player_status')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('status', 'confirmed');

      const currentConfirmed = confirmedCount || 0;
      console.log('[Group Breakage] Current confirmed count:', currentConfirmed);

      // If confirmed count is not divisible by 4, move excess players to waitlist
      const excessPlayers = currentConfirmed % 4;
      
      if (excessPlayers > 0) {
        console.log('[Group Breakage] Moving', excessPlayers, 'players to waitlist');

        // Get the excess players (those with highest ranking_order)
        const { data: excessPlayersList } = await supabase
          .from('player_status')
          .select('player_id, ranking_order')
          .eq('event_id', eventId)
          .eq('status', 'confirmed')
          .order('ranking_order', { ascending: false })
          .limit(excessPlayers);

        if (excessPlayersList && excessPlayersList.length > 0) {
          // Get current waitlist count for proper ranking
          const { count: waitlistCount } = await supabase
            .from('player_status')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', eventId)
            .eq('status', 'waitlist');

          let waitlistRanking = (waitlistCount || 0) + 1;

          // Move excess players to waitlist
          for (const player of excessPlayersList) {
            await supabase
              .from('player_status')
              .update({
                status: 'waitlist',
                ranking_order: waitlistRanking,
                promoted_at: null,
                promotion_reason: null
              })
              .eq('event_id', eventId)
              .eq('player_id', player.player_id);

            waitlistRanking++;
          }

          console.log('[Group Breakage] Moved excess players to waitlist');
        }
      }

    } catch (error) {
      console.error('[Group Breakage] Error handling cancellation:', error);
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

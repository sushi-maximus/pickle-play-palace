
import { supabase } from "@/integrations/supabase/client";
import type { DatabaseWithFunctions } from "./types/rpcTypes";

export interface RankingServiceResult {
  success: boolean;
  message: string;
  error?: string;
}

// Type-safe wrapper for supabase client with our custom functions
const typedSupabase = supabase as unknown as {
  rpc: <T extends keyof DatabaseWithFunctions['public']['Functions']>(
    fn: T,
    args: DatabaseWithFunctions['public']['Functions'][T]['Args']
  ) => Promise<{ data: DatabaseWithFunctions['public']['Functions'][T]['Returns']; error: any }>;
};

export const rankingService = {
  /**
   * Sets initial rankings for players when an event is created
   * Called automatically after an event is created or when the first player registers
   */
  async setInitialRankings(eventId: string): Promise<RankingServiceResult> {
    try {
      console.log('[Ranking Service] Setting initial rankings for event:', eventId);
      
      const { error } = await typedSupabase.rpc('set_initial_rankings', {
        p_event_id: eventId
      });

      if (error) {
        console.error('[Ranking Service] Error setting initial rankings:', error);
        return {
          success: false,
          message: 'Failed to set initial rankings',
          error: error.message
        };
      }

      console.log('[Ranking Service] Initial rankings set successfully');
      return {
        success: true,
        message: 'Initial rankings set successfully'
      };
    } catch (error) {
      console.error('[Ranking Service] Unexpected error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  /**
   * Reorganizes confirmed players based on skill level and DUPR rating
   * Only admins can perform this action
   */
  async reorganizeConfirmedPlayers(eventId: string, adminId: string): Promise<RankingServiceResult> {
    try {
      console.log('[Ranking Service] Reorganizing confirmed players:', { eventId, adminId });
      
      const { error } = await typedSupabase.rpc('reorganize_confirmed_players', {
        p_event_id: eventId,
        p_admin_id: adminId
      });

      if (error) {
        console.error('[Ranking Service] Error reorganizing players:', error);
        return {
          success: false,
          message: 'Failed to reorganize players',
          error: error.message
        };
      }

      console.log('[Ranking Service] Players reorganized successfully');
      return {
        success: true,
        message: 'Players reorganized successfully'
      };
    } catch (error) {
      console.error('[Ranking Service] Unexpected error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  /**
   * Allows manual reordering of confirmed players
   * Only admins can perform this action
   */
  async reorderPlayers(eventId: string, adminId: string, playerIds: string[]): Promise<RankingServiceResult> {
    try {
      console.log('[Ranking Service] Reordering players:', { eventId, adminId, playerCount: playerIds.length });
      
      const { error } = await typedSupabase.rpc('reorder_players', {
        p_event_id: eventId,
        p_admin_id: adminId,
        p_player_ids: playerIds
      });

      if (error) {
        console.error('[Ranking Service] Error reordering players:', error);
        return {
          success: false,
          message: 'Failed to reorder players',
          error: error.message
        };
      }

      console.log('[Ranking Service] Players reordered successfully');
      return {
        success: true,
        message: 'Players reordered successfully'
      };
    } catch (error) {
      console.error('[Ranking Service] Unexpected error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};

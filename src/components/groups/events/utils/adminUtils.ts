
import { supabase } from "@/integrations/supabase/client";

export interface AdminCheckResult {
  isAdmin: boolean;
  error?: string;
}

export const adminUtils = {
  /**
   * Checks if a user is an admin for a specific group
   * Returns true if the user has admin role and active status
   */
  async isGroupAdmin(userId: string, groupId: string): Promise<AdminCheckResult> {
    try {
      console.log('[Admin Utils] Checking admin status:', { userId, groupId });
      
      const { data, error } = await supabase
        .from('group_members')
        .select('role, status')
        .eq('group_id', groupId)
        .eq('user_id', userId)
        .eq('role', 'admin')
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('[Admin Utils] Error checking admin status:', error);
        return {
          isAdmin: false,
          error: error.message
        };
      }

      const isAdmin = !!data;
      console.log('[Admin Utils] Admin check result:', { isAdmin });
      
      return {
        isAdmin
      };
    } catch (error) {
      console.error('[Admin Utils] Unexpected error:', error);
      return {
        isAdmin: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  /**
   * Checks if a user is an admin for the group that owns a specific event
   */
  async isEventAdmin(userId: string, eventId: string): Promise<AdminCheckResult> {
    try {
      console.log('[Admin Utils] Checking event admin status:', { userId, eventId });
      
      // First get the group_id for the event
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('group_id')
        .eq('id', eventId)
        .single();

      if (eventError) {
        console.error('[Admin Utils] Error fetching event:', eventError);
        return {
          isAdmin: false,
          error: eventError.message
        };
      }

      if (!eventData) {
        return {
          isAdmin: false,
          error: 'Event not found'
        };
      }

      // Then check if user is admin of that group
      return await this.isGroupAdmin(userId, eventData.group_id);
    } catch (error) {
      console.error('[Admin Utils] Unexpected error:', error);
      return {
        isAdmin: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};

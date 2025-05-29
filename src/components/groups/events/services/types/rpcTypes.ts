
import type { Database } from "@/integrations/supabase/types";

// RPC function parameter types
export interface SetInitialRankingsParams {
  p_event_id: string;
}

export interface ReorganizeConfirmedPlayersParams {
  p_event_id: string;
  p_admin_id: string;
}

export interface ReorderPlayersParams {
  p_event_id: string;
  p_admin_id: string;
  p_player_ids: string[];
}

// RPC function definitions for type safety
export interface DatabaseFunctions {
  set_initial_rankings: {
    Args: SetInitialRankingsParams;
    Returns: void;
  };
  reorganize_confirmed_players: {
    Args: ReorganizeConfirmedPlayersParams;
    Returns: void;
  };
  reorder_players: {
    Args: ReorderPlayersParams;
    Returns: void;
  };
}

// Extend the Database type to include our functions
export type DatabaseWithFunctions = Database & {
  public: Database['public'] & {
    Functions: DatabaseFunctions;
  };
};

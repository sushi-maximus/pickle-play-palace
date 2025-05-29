
import type { Database } from "@/integrations/supabase/types";

type PlayerStatus = Database['public']['Tables']['player_status']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface EventPlayer extends PlayerStatus {
  profiles: Profile;
}

interface PlayerRankingProps {
  player: EventPlayer;
  showRanking?: boolean;
}

export const PlayerRanking = ({ player, showRanking = true }: PlayerRankingProps) => {
  if (!showRanking || player.ranking_order === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
      #{player.ranking_order}
    </div>
  );
};

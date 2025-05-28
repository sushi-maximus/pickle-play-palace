
import { Users, Clock } from "lucide-react";
import { useEventPlayers } from "../hooks/useEventPlayers";
import { LoadingContainer } from "@/components/ui/LoadingContainer";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

interface PlayersListProps {
  eventId: string;
  type: 'confirmed' | 'waitlist';
  currentUserId?: string;
}

interface PlayerCardProps {
  player: {
    player_id: string;
    profiles: Profile;
    ranking_order?: number;
  };
  isCurrentUser: boolean;
  showRanking?: boolean;
}

const PlayerCard = ({ player, isCurrentUser, showRanking }: PlayerCardProps) => {
  const { profiles } = player;
  
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm ${
      isCurrentUser ? 'bg-green-50 border-green-200' : ''
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {profiles.avatar_url ? (
            <img 
              src={profiles.avatar_url} 
              alt={`${profiles.first_name} ${profiles.last_name}`}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {profiles.first_name[0]}{profiles.last_name[0]}
              </span>
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900">
              {profiles.first_name} {profiles.last_name}
              {isCurrentUser && (
                <span className="ml-2 text-xs text-green-600 font-medium">(You)</span>
              )}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {profiles.dupr_rating && (
                <span>DUPR: {profiles.dupr_rating}</span>
              )}
              <span className="capitalize">{profiles.skill_level}</span>
            </div>
          </div>
        </div>
        {showRanking && player.ranking_order && (
          <div className="text-sm font-medium text-gray-500">
            #{player.ranking_order}
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ type }: { type: 'confirmed' | 'waitlist' }) => {
  const Icon = type === 'confirmed' ? Users : Clock;
  const title = type === 'confirmed' ? 'No confirmed players yet' : 'No waitlisted players';
  const description = type === 'confirmed' 
    ? 'Players will appear here once they register and are confirmed.'
    : 'Players on the waitlist will appear here.';

  return (
    <div className="text-center py-8">
      <Icon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export const PlayersList = ({ eventId, type, currentUserId }: PlayersListProps) => {
  const { confirmedPlayers, waitlistPlayers, isLoading } = useEventPlayers({ 
    eventId,
    enabled: !!eventId 
  });

  const players = type === 'confirmed' ? confirmedPlayers : waitlistPlayers;
  const showRanking = type === 'confirmed';

  return (
    <div className="p-4">
      <LoadingContainer 
        isLoading={isLoading} 
        skeleton="card" 
        skeletonCount={3}
        className="space-y-4"
      >
        {players.length > 0 ? (
          <div className="space-y-3">
            {players.map((player) => (
              <PlayerCard
                key={player.player_id}
                player={player}
                isCurrentUser={player.player_id === currentUserId}
                showRanking={showRanking}
              />
            ))}
          </div>
        ) : (
          <EmptyState type={type} />
        )}
      </LoadingContainer>
    </div>
  );
};

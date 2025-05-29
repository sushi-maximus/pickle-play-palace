
import { useState } from "react";
import { useEventPlayers } from "../hooks/useEventPlayers";
import { useEventAdminStatus } from "../hooks/useEventAdminStatus";
import { PlayerRanking } from "./PlayerRanking";
import { AdminRankingControls } from "./AdminRankingControls";
import { DragDropPlayerList } from "./DragDropPlayerList";
import { LoadingContainer } from "@/components/ui/LoadingContainer";
import { Users, Clock, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Database } from "@/integrations/supabase/types";

type Event = Database['public']['Tables']['events']['Row'];

interface PlayersListProps {
  event: Event;
  currentUserId?: string;
}

export const PlayersList = ({ event, currentUserId }: PlayersListProps) => {
  const [isReorderMode, setIsReorderMode] = useState(false);
  
  const { 
    confirmedPlayers, 
    waitlistPlayers, 
    isLoading, 
    error 
  } = useEventPlayers({ 
    eventId: event.id, 
    enabled: true 
  });

  const { isAdmin } = useEventAdminStatus({ 
    eventId: event.id, 
    enabled: !!currentUserId 
  });

  if (error) {
    return (
      <div className="text-center py-8 px-4">
        <p className="text-red-600">Error loading players. Please try again.</p>
      </div>
    );
  }

  return (
    <LoadingContainer 
      isLoading={isLoading} 
      skeleton="card" 
      skeletonCount={3}
      className="space-y-4"
    >
      <div className="space-y-6">
        {/* Admin Controls */}
        {!isReorderMode && (
          <AdminRankingControls 
            eventId={event.id}
            isAdmin={isAdmin}
            hasConfirmedPlayers={confirmedPlayers.length > 0}
          />
        )}

        {/* Manual Reorder Button */}
        {!isReorderMode && isAdmin && confirmedPlayers.length > 1 && (
          <div className="flex justify-end">
            <Button
              onClick={() => setIsReorderMode(true)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Edit3 className="h-4 w-4" />
              Manual Reorder
            </Button>
          </div>
        )}

        {/* Drag & Drop Reorder Mode */}
        {isReorderMode && (
          <DragDropPlayerList
            eventId={event.id}
            players={confirmedPlayers}
            isAdmin={isAdmin}
            onCancel={() => setIsReorderMode(false)}
          />
        )}

        {/* Regular Player Display */}
        {!isReorderMode && (
          <>
            {/* Confirmed Players Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirmed Players ({confirmedPlayers.length})
                </h3>
              </div>
              
              {confirmedPlayers.length > 0 ? (
                <div className="space-y-2">
                  {confirmedPlayers.map((player) => (
                    <div 
                      key={player.player_id} 
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <PlayerRanking player={player} showRanking={true} />
                        <div>
                          <p className="font-medium text-gray-900">
                            {player.profiles.first_name} {player.profiles.last_name}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            {player.profiles.skill_level && (
                              <span>Skill: {player.profiles.skill_level}</span>
                            )}
                            {player.profiles.dupr_rating && (
                              <span>• DUPR: {player.profiles.dupr_rating}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Registered: {new Date(player.registration_timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 px-4 bg-gray-50 rounded-lg">
                  <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No confirmed players yet</p>
                </div>
              )}
            </div>

            {/* Waitlist Players Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Waitlist ({waitlistPlayers.length})
                </h3>
              </div>
              
              {waitlistPlayers.length > 0 ? (
                <div className="space-y-2">
                  {waitlistPlayers.map((player, index) => (
                    <div 
                      key={player.player_id} 
                      className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {player.profiles.first_name} {player.profiles.last_name}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            {player.profiles.skill_level && (
                              <span>Skill: {player.profiles.skill_level}</span>
                            )}
                            {player.profiles.dupr_rating && (
                              <span>• DUPR: {player.profiles.dupr_rating}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Waitlisted: {new Date(player.registration_timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 px-4 bg-gray-50 rounded-lg">
                  <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No players on waitlist</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </LoadingContainer>
  );
};

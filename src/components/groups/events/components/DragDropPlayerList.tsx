
import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Check, X, GripVertical } from "lucide-react";
import { rankingService } from "../services/rankingService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import type { Database } from "@/integrations/supabase/types";

type PlayerStatus = Database['public']['Tables']['player_status']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface EventPlayer extends PlayerStatus {
  profiles: Profile;
}

interface DragDropPlayerListProps {
  eventId: string;
  players: EventPlayer[];
  isAdmin: boolean;
  onCancel: () => void;
}

export const DragDropPlayerList = ({ 
  eventId, 
  players, 
  isAdmin, 
  onCancel 
}: DragDropPlayerListProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [reorderedPlayers, setReorderedPlayers] = useState(players);
  const [isSaving, setIsSaving] = useState(false);

  if (!isAdmin) {
    return null;
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(reorderedPlayers);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setReorderedPlayers(items);
  };

  const handleSaveOrder = async () => {
    if (!user?.id) return;

    try {
      setIsSaving(true);
      
      // Add haptic feedback for mobile
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }

      const playerIds = reorderedPlayers.map(player => player.player_id);
      const result = await rankingService.reorderPlayers(eventId, user.id, playerIds);
      
      if (result.success) {
        toast({
          description: "Player order updated successfully"
        });
        
        // Refetch player data
        queryClient.invalidateQueries({
          queryKey: queryKeys.events.players(eventId)
        });
        
        onCancel(); // Exit reorder mode
      } else {
        toast({
          description: `Error: ${result.message}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('[DragDropPlayerList] Error reordering players:', error);
      toast({
        description: "Failed to update player order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div>
          <h3 className="text-sm font-medium text-blue-900">Reorder Players</h3>
          <p className="text-xs text-blue-700">Drag players to reorder them</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleSaveOrder}
            disabled={isSaving}
            size="sm"
            className="h-8 bg-green-600 hover:bg-green-700"
          >
            <Check className="h-3 w-3 mr-1" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button
            onClick={onCancel}
            disabled={isSaving}
            variant="outline"
            size="sm"
            className="h-8"
          >
            <X className="h-3 w-3 mr-1" />
            Cancel
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="players">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {reorderedPlayers.map((player, index) => (
                <Draggable
                  key={player.player_id}
                  draggableId={player.player_id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex items-center justify-between p-3 bg-white rounded-lg border ${
                        snapshot.isDragging 
                          ? 'border-blue-300 shadow-lg' 
                          : 'border-gray-200'
                      } transition-all duration-200`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          {...provided.dragHandleProps}
                          className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                        >
                          <GripVertical className="h-4 w-4" />
                        </div>
                        
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                          #{index + 1}
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
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

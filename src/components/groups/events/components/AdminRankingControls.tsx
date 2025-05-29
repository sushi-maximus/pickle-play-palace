
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Users } from "lucide-react";
import { rankingService } from "../services/rankingService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

interface AdminRankingControlsProps {
  eventId: string;
  isAdmin: boolean;
  hasConfirmedPlayers: boolean;
}

export const AdminRankingControls = ({ 
  eventId, 
  isAdmin, 
  hasConfirmedPlayers 
}: AdminRankingControlsProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isReorganizing, setIsReorganizing] = useState(false);

  if (!isAdmin || !hasConfirmedPlayers) {
    return null;
  }

  const handleReorganizePlayers = async () => {
    if (!user?.id) return;

    try {
      setIsReorganizing(true);
      
      // Add haptic feedback for mobile
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }

      const result = await rankingService.reorganizeConfirmedPlayers(eventId, user.id);
      
      if (result.success) {
        toast("Players reorganized successfully based on skill level and DUPR rating");
        
        // Refetch player data
        queryClient.invalidateQueries({
          queryKey: queryKeys.events.players(eventId)
        });
      } else {
        toast(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('[AdminRankingControls] Error reorganizing players:', error);
      toast("Failed to reorganize players. Please try again.");
    } finally {
      setIsReorganizing(false);
    }
  };

  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
      <h3 className="text-sm font-medium text-gray-900">Admin Controls</h3>
      
      <div className="flex flex-col space-y-2">
        <Button
          onClick={handleReorganizePlayers}
          disabled={isReorganizing}
          className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium"
          size="lg"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          {isReorganizing ? "Reorganizing..." : "Reorganize Players"}
        </Button>
        
        <p className="text-xs text-gray-600 text-center">
          Automatically reorganize players based on skill level and DUPR rating
        </p>
      </div>
    </div>
  );
};

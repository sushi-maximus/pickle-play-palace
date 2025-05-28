
import { CheckCircle, ArrowUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Database } from "@/integrations/supabase/types";

type PlayerStatus = Database['public']['Tables']['player_status']['Row'];

// Extended type to include promotion fields
type ExtendedPlayerStatus = PlayerStatus & {
  promoted_at?: string | null;
  promotion_reason?: string | null;
};

interface PromotionBannerProps {
  registration: ExtendedPlayerStatus;
  className?: string;
}

export const PromotionBanner = ({ registration, className }: PromotionBannerProps) => {
  // Only show for promoted players
  if (!registration.promoted_at || !registration.promotion_reason) {
    return null;
  }

  const getPromotionMessage = (reason: string) => {
    switch (reason) {
      case 'player_cancelled':
        return 'You were promoted when another player cancelled';
      case 'bulk_promotion':
        return 'You were promoted in a bulk update';
      case 'manual_promotion':
        return 'You were promoted by the organizer';
      default:
        return 'You were promoted from the waitlist';
    }
  };

  const formatPromotionTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className={cn(
      "bg-green-50 border border-green-200 rounded-lg p-4 mb-4",
      "flex items-start gap-3",
      className
    )}>
      <div className="flex-shrink-0">
        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
          <ArrowUp className="h-4 w-4 text-green-600" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-semibold text-green-800">
            Promoted to Confirmed!
          </h4>
          <Badge variant="default" className="bg-green-100 text-green-700 text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        </div>
        
        <p className="text-sm text-green-700 mb-2">
          {getPromotionMessage(registration.promotion_reason)}
        </p>
        
        <p className="text-xs text-green-600">
          Promoted {formatPromotionTime(registration.promoted_at)}
        </p>
      </div>
    </div>
  );
};

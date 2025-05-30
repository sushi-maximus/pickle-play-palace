

import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, Info } from "lucide-react";
import { useEventRegistration } from "../hooks/useEventRegistration";
import { usePromotionStatus } from "../hooks/usePromotionStatus";
import { useEventPlayers } from "../hooks/useEventPlayers";
import { PromotionIndicator } from "./PromotionIndicator";

interface EventRegistrationStatusProps {
  eventId: string;
  playerId: string | null;
}

export const EventRegistrationStatus = ({ eventId, playerId }: EventRegistrationStatusProps) => {
  const { registration, isLoadingRegistration } = useEventRegistration({ eventId, playerId });
  const { wasPromoted, isRecentPromotion } = usePromotionStatus({ eventId, playerId });
  const { players } = useEventPlayers({ eventId });

  if (!playerId || isLoadingRegistration) {
    return null;
  }

  if (!registration) {
    return null;
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'confirmed':
        return {
          icon: CheckCircle,
          variant: 'default' as const,
          color: 'bg-green-100 text-green-700',
          text: 'Confirmed'
        };
      case 'waitlist':
        return {
          icon: Clock,
          variant: 'secondary' as const,
          color: 'bg-yellow-100 text-yellow-700',
          text: 'Waitlisted'
        };
      case 'absent':
        return {
          icon: XCircle,
          variant: 'destructive' as const,
          color: 'bg-red-100 text-red-700',
          text: 'Absent'
        };
      default:
        return {
          icon: Clock,
          variant: 'outline' as const,
          color: 'bg-gray-100 text-gray-700',
          text: status
        };
    }
  };

  const config = getStatusConfig(registration.status);
  const Icon = config.icon;
  
  // Check if total registered players is 32 or less
  const totalRegisteredPlayers = players?.length || 0;
  const shouldShowWaitlistInfo = registration.status === 'waitlist' && totalRegisteredPlayers <= 32;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Badge variant={config.variant} className={`${config.color} flex items-center gap-1`}>
          <Icon className="h-3 w-3" />
          {config.text}
          {registration.ranking_order && registration.status === 'waitlist' && (
            <span className="ml-1">#{registration.ranking_order}</span>
          )}
        </Badge>
        
        {/* Show promotion indicator for recently promoted players */}
        {wasPromoted && isRecentPromotion && registration.status === 'confirmed' && (
          <PromotionIndicator registration={registration} size="sm" />
        )}
      </div>

      {/* Info section for waitlisted players when total players is 32 or less */}
      {shouldShowWaitlistInfo && (
        <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-md border border-blue-200">
          <Info className="h-3 w-3 md:h-4 md:w-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-700">
            Every 4 players registered will be confirmed.
          </p>
        </div>
      )}
    </div>
  );
};


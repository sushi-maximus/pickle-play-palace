
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { useEventRegistration } from "../hooks/useEventRegistration";

interface EventRegistrationStatusProps {
  eventId: string;
  playerId: string | null;
}

export const EventRegistrationStatus = ({ eventId, playerId }: EventRegistrationStatusProps) => {
  const { registration, isLoadingRegistration } = useEventRegistration({ eventId, playerId });

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

  return (
    <div className="flex items-center gap-2">
      <Badge variant={config.variant} className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.text}
        {registration.ranking_order && registration.status === 'waitlist' && (
          <span className="ml-1">#{registration.ranking_order}</span>
        )}
      </Badge>
    </div>
  );
};


import { Calendar, Clock, MapPin } from "lucide-react";
import { formatDateForDisplay } from "@/utils/dateUtils";
import type { Database } from "@/integrations/supabase/types";

type Event = Database['public']['Tables']['events']['Row'];
type PlayerStatus = Database['public']['Tables']['player_status']['Row'];

interface NextEventCardProps {
  event: Event;
  registrationStatus: PlayerStatus | null;
  onClick?: () => void;
}

export const NextEventCard = ({ event, registrationStatus, onClick }: NextEventCardProps) => {
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusBadge = () => {
    if (!registrationStatus) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          Not Registered
        </span>
      );
    }

    switch (registrationStatus.status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            Registered
          </span>
        );
      case 'waitlisted':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            Waitlisted
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            Not Registered
          </span>
        );
    }
  };

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow duration-200 touch-manipulation cursor-pointer"
      onClick={onClick}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight">
            {event.event_title}
          </h3>
          {getStatusBadge()}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
            <Calendar className="h-3 w-3 md:h-4 md:w-4 text-gray-400" />
            <span>{formatDateForDisplay(event.event_date)}</span>
            <Clock className="h-3 w-3 md:h-4 md:w-4 text-gray-400 ml-2" />
            <span>{formatTime(event.event_time)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
            <MapPin className="h-3 w-3 md:h-4 md:w-4 text-gray-400" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

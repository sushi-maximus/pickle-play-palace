import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { formatDateForDisplay } from "@/utils/dateUtils";
import type { Database } from "@/integrations/supabase/types";

type Event = Database['public']['Tables']['events']['Row'];

interface EventDetailsTabProps {
  event: Event;
}

export const EventDetailsTab = ({ event }: EventDetailsTabProps) => {
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">Date & Time</p>
            <p className="text-sm text-gray-600">
              {formatDateForDisplay(event.event_date)} at {formatTime(event.event_time)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">Location</p>
            <p className="text-sm text-gray-600">{event.location}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Users className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">Players</p>
            <p className="text-sm text-gray-600">
              Max {event.max_players} players
              {event.allow_reserves && " (reserves allowed)"}
            </p>
          </div>
        </div>
      </div>

      {event.description && (
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Description</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-medium text-gray-900 text-sm">Pricing</p>
          <p className="text-sm text-gray-600">
            {event.pricing_model === 'free' ? 'Free' : `$${event.fee_amount}`}
          </p>
        </div>
        <div>
          <p className="font-medium text-gray-900 text-sm">Skill Level</p>
          <p className="text-sm text-gray-600 capitalize">{event.skill_category}</p>
        </div>
      </div>

      <div>
        <p className="font-medium text-gray-900 text-sm">Ranking Method</p>
        <p className="text-sm text-gray-600 capitalize">{event.ranking_method.replace('-', ' ')}</p>
      </div>

      <div>
        <p className="font-medium text-gray-900 text-sm">Registration Status</p>
        <p className={`text-sm font-medium ${event.registration_open ? 'text-green-600' : 'text-red-600'}`}>
          {event.registration_open ? 'Open' : 'Closed'}
        </p>
      </div>
    </div>
  );
};

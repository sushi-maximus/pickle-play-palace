
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventRegistrationButton } from "./EventRegistrationButton";
import { EventRegistrationStatus } from "./EventRegistrationStatus";
import type { Database } from "@/integrations/supabase/types";

type Event = Database['public']['Tables']['events']['Row'];

interface EventDetailsHeaderProps {
  event: Event;
  groupId: string;
  userId?: string;
}

export const EventDetailsHeader = ({ event, groupId, userId }: EventDetailsHeaderProps) => {
  const navigate = useNavigate();
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="h-10 w-10 p-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 leading-tight">
              {event.event_title}
            </h1>
            <p className="text-sm text-gray-600">
              {formatDate(event.event_date)} at {formatTime(event.event_time)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <EventRegistrationStatus eventId={event.id} playerId={userId || null} />
          {event.registration_open && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              Open
            </span>
          )}
        </div>
      </div>
      
      {/* Registration Button */}
      <div className="px-4 pb-3">
        <EventRegistrationButton
          eventId={event.id}
          playerId={userId || null}
          groupId={groupId}
          isRegistrationOpen={event.registration_open}
          className="w-full"
        />
      </div>
    </div>
  );
};

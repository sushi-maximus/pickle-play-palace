
import { Calendar, MapPin, Clock, Users, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventRegistrationButton } from "./EventRegistrationButton";
import { EventRegistrationStatus } from "./EventRegistrationStatus";
import { PromotionBanner } from "./PromotionBanner";
import { EditEventDialog } from "../forms/EditEventDialog";
import { useEventRegistration } from "../hooks/useEventRegistration";
import { usePromotionStatus } from "../hooks/usePromotionStatus";
import { useEventAdminStatus } from "../hooks/useEventAdminStatus";
import { useState } from "react";
import type { Database } from "@/integrations/supabase/types";

type Event = Database['public']['Tables']['events']['Row'];

interface EventDetailsHeaderProps {
  event: Event;
  groupId: string;
  userId?: string;
  onEventUpdated?: () => void;
}

export const EventDetailsHeader = ({ event, groupId, userId, onEventUpdated }: EventDetailsHeaderProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  const { registration } = useEventRegistration({ eventId: event.id, playerId: userId });
  const { promotionStatus, wasPromoted, isRecentPromotion } = usePromotionStatus({ 
    eventId: event.id, 
    playerId: userId 
  });
  const { isAdmin, isLoading: isLoadingAdmin } = useEventAdminStatus({ 
    eventId: event.id,
    enabled: !!userId 
  });

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

  const showPromotionBanner = wasPromoted && 
    isRecentPromotion && 
    promotionStatus && 
    registration?.status === 'confirmed';

  return (
    <>
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto p-4">
          {/* Show promotion banner for recently promoted users */}
          {showPromotionBanner && promotionStatus && (
            <PromotionBanner registration={promotionStatus} className="mb-4" />
          )}

          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{event.event_title}</h1>
                {event.description && (
                  <p className="text-gray-600 mt-2">{event.description}</p>
                )}
              </div>
              
              {/* Admin Edit Button */}
              {isAdmin && !isLoadingAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEditDialog(true)}
                  className="ml-3 flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="font-medium">{formatDate(event.event_date)}</span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-700">
                <Clock className="h-5 w-5 text-gray-400" />
                <span>{formatTime(event.event_time)}</span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span>{event.location}</span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-700">
                <Users className="h-5 w-5 text-gray-400" />
                <span>Max {event.max_players} players</span>
                {event.allow_reserves && (
                  <span className="text-sm text-gray-500">• Waitlist available</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <EventRegistrationStatus 
                eventId={event.id} 
                playerId={userId || null}
              />
              
              <EventRegistrationButton
                eventId={event.id}
                playerId={userId || null}
                groupId={groupId}
                isRegistrationOpen={event.registration_open}
                className="px-6 py-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <EditEventDialog
        event={event}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={onEventUpdated}
      />
    </>
  );
};

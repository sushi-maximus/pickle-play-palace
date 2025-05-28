
import { useParams } from "react-router-dom";
import { useGroupEvents } from "./hooks/useGroupEvents";
import { LoadingContainer } from "@/components/ui/LoadingContainer";
import { EventDetailsHeader } from "./components/EventDetailsHeader";
import { EventDetailsTabs } from "./components/EventDetailsTabs";
import { useAuth } from "@/contexts/AuthContext";

export const EventDetailsPage = () => {
  const { groupId, eventId } = useParams<{ groupId: string; eventId: string }>();
  const { user } = useAuth();
  const { events, isLoading, error } = useGroupEvents({ 
    groupId: groupId || '', 
    enabled: !!groupId 
  });

  const event = events.find(e => e.id === eventId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingContainer isLoading={true} skeleton="card" skeletonCount={1}>
          <div />
        </LoadingContainer>
      </div>
    );
  }

  if (error || !event || !groupId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Event not found</h2>
          <p className="text-sm text-gray-600">The event you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EventDetailsHeader 
        event={event} 
        groupId={groupId} 
        userId={user?.id}
      />
      <EventDetailsTabs 
        event={event} 
        currentUserId={user?.id}
      />
    </div>
  );
};


import { EventCard } from "./EventCard";
import { useGroupEvents } from "./hooks/useGroupEvents";
import { Calendar } from "lucide-react";
import { LoadingContainer } from "@/components/ui/LoadingContainer";
import { useNavigate, useParams } from "react-router-dom";

interface EventsListProps {
  groupId: string;
  isAdmin: boolean;
}

const EmptyState = ({ isAdmin }: { isAdmin: boolean }) => (
  <div className="text-center py-12 px-4">
    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <Calendar className="h-8 w-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming events</h3>
    <p className="text-sm text-gray-600 mb-4">
      {isAdmin 
        ? "Create your first event to get started!" 
        : "Check back later for upcoming events"
      }
    </p>
  </div>
);

export const EventsList = ({ groupId, isAdmin }: EventsListProps) => {
  const navigate = useNavigate();
  const { events, isLoading, error, refetch } = useGroupEvents({ 
    groupId, 
    enabled: !!groupId 
  });

  const handleEventClick = (eventId: string) => {
    navigate(`/groups/${groupId}/events/${eventId}`);
  };

  if (error) {
    return (
      <div className="text-center py-12 px-4">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <Calendar className="h-8 w-8 text-red-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading events</h3>
        <p className="text-sm text-gray-600 mb-4">
          There was a problem loading the events. Please try again.
        </p>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <LoadingContainer 
      isLoading={isLoading} 
      skeleton="card" 
      skeletonCount={3}
      className="space-y-4"
    >
      {events.length > 0 ? (
        <div className="space-y-4">
          {events.map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              onClick={() => handleEventClick(event.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState isAdmin={isAdmin} />
      )}
    </LoadingContainer>
  );
};

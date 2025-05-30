
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCard } from "./EventCard";
import { useUpcomingEvents, usePastEvents } from "./hooks/useGroupEvents";
import { Calendar } from "lucide-react";
import { LoadingContainer } from "@/components/ui/LoadingContainer";
import { useNavigate } from "react-router-dom";

interface TabbedEventsListProps {
  groupId: string;
  isAdmin: boolean;
}

const EmptyState = ({ 
  isAdmin, 
  type 
}: { 
  isAdmin: boolean; 
  type: 'upcoming' | 'past';
}) => (
  <div className="text-center py-12 px-4">
    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <Calendar className="h-8 w-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      {type === 'upcoming' ? 'No upcoming events' : 'No past events yet'}
    </h3>
    <p className="text-sm text-gray-600 mb-4">
      {type === 'upcoming' 
        ? (isAdmin ? "Create your first event to get started!" : "Check back later for upcoming events")
        : "Past events will appear here after they occur"
      }
    </p>
  </div>
);

export const TabbedEventsList = ({ groupId, isAdmin }: TabbedEventsListProps) => {
  const navigate = useNavigate();
  
  const { 
    events: upcomingEvents, 
    isLoading: upcomingLoading, 
    error: upcomingError,
    refetch: refetchUpcoming 
  } = useUpcomingEvents({ groupId, enabled: !!groupId });
  
  const { 
    events: pastEvents, 
    isLoading: pastLoading, 
    error: pastError,
    refetch: refetchPast 
  } = usePastEvents({ groupId, enabled: !!groupId });

  const handleEventClick = (eventId: string) => {
    navigate(`/groups/${groupId}/events/${eventId}`);
  };

  const upcomingCount = upcomingEvents.length;
  const pastCount = pastEvents.length;

  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="upcoming" className="text-sm">
          Upcoming {upcomingCount > 0 && `(${upcomingCount})`}
        </TabsTrigger>
        <TabsTrigger value="past" className="text-sm">
          Past {pastCount > 0 && `(${pastCount})`}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming" className="mt-0">
        {upcomingError ? (
          <div className="text-center py-12 px-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading events</h3>
            <p className="text-sm text-gray-600 mb-4">
              There was a problem loading the upcoming events. Please try again.
            </p>
            <button 
              onClick={() => refetchUpcoming()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <LoadingContainer 
            isLoading={upcomingLoading} 
            skeleton="card" 
            skeletonCount={3}
            className="space-y-4"
          >
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onClick={() => handleEventClick(event.id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState isAdmin={isAdmin} type="upcoming" />
            )}
          </LoadingContainer>
        )}
      </TabsContent>

      <TabsContent value="past" className="mt-0">
        {pastError ? (
          <div className="text-center py-12 px-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading events</h3>
            <p className="text-sm text-gray-600 mb-4">
              There was a problem loading the past events. Please try again.
            </p>
            <button 
              onClick={() => refetchPast()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <LoadingContainer 
            isLoading={pastLoading} 
            skeleton="card" 
            skeletonCount={3}
            className="space-y-4"
          >
            {pastEvents.length > 0 ? (
              <div className="space-y-4">
                {pastEvents.map((event) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onClick={() => handleEventClick(event.id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState isAdmin={isAdmin} type="past" />
            )}
          </LoadingContainer>
        )}
      </TabsContent>
    </Tabs>
  );
};

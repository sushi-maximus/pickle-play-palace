
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUserRegisteredEvents } from './hooks/useUserRegisteredEvents';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useTouchFeedback } from '@/hooks/useTouchFeedback';
import { cn } from '@/lib/utils';

export const RegisteredEventsCard = () => {
  const { data: events, isLoading, error } = useUserRegisteredEvents();
  const navigate = useNavigate();

  console.log('RegisteredEventsCard - events:', events, 'isLoading:', isLoading, 'error:', error);

  // Find the next event (first event after current date/time)
  const nextEventId = useMemo(() => {
    if (!events || events.length === 0) return null;
    
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
    
    const nextEvent = events.find(event => {
      if (event.event_date > currentDate) return true;
      if (event.event_date === currentDate && event.event_time >= currentTime) return true;
      return false;
    });
    
    return nextEvent?.id || null;
  }, [events]);

  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default'; // Green background
      case 'waitlist':
        return 'secondary'; // Orange-ish background  
      default:
        return 'outline';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500 text-white hover:bg-green-600';
      case 'waitlist':
        return 'bg-orange-500 text-white hover:bg-orange-600';
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <Card className="px-3 py-4 md:px-6 md:py-8">
        <CardHeader className="pb-3">
          <CardTitle>My Registered Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="px-3 py-4 md:px-6 md:py-8">
        <CardHeader className="pb-3">
          <CardTitle>My Registered Events</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 text-center py-4">
            Error loading events. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Show empty state if no events instead of hiding card completely for debugging
  if (!events || events.length === 0) {
    return (
      <Card className="px-3 py-4 md:px-6 md:py-8">
        <CardHeader className="pb-3">
          <CardTitle>My Registered Events</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">
            No registered events found. Register for events to see them here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="px-3 py-4 md:px-6 md:py-8">
      <CardHeader className="pb-3">
        <CardTitle>My Registered Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 md:space-y-4">
        {events?.map((event) => {
          const { isPressed, touchProps } = useTouchFeedback();
          
          return (
            <div
              key={event.id}
              onClick={() => handleEventClick(event.id)}
              className={cn(
                "border border-gray-300 rounded-lg p-4 cursor-pointer transition-colors hover:bg-gray-50",
                "min-h-[48px] flex flex-col justify-center space-y-2",
                "touch-manipulation",
                isPressed && "bg-gray-100"
              )}
              {...touchProps}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-base truncate">
                      {event.event_title}
                    </h3>
                    {event.id === nextEventId && (
                      <Badge 
                        variant="default" 
                        className="bg-green-500 text-white hover:bg-green-600 text-xs"
                      >
                        Next Event
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>
                      {format(new Date(event.event_date), 'MMM d, yyyy')} at{' '}
                      {event.event_time}
                    </div>
                    <div>{event.location}</div>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-3">
                  <Badge
                    variant={getStatusBadgeVariant(event.status)}
                    className={cn(
                      getStatusBadgeClass(event.status),
                      "capitalize"
                    )}
                  >
                    {event.status}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

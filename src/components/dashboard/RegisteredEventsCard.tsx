
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserRegisteredEvents } from './hooks/useUserRegisteredEvents';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EventItem } from './EventItem';

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
        {events?.map((event) => (
          <EventItem
            key={event.id}
            event={event}
            isNextEvent={event.id === nextEventId}
            onEventClick={handleEventClick}
            getStatusBadgeVariant={getStatusBadgeVariant}
            getStatusBadgeClass={getStatusBadgeClass}
          />
        ))}
      </CardContent>
    </Card>
  );
};


import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LoadingContainer } from "@/components/ui/LoadingContainer";
import { EventDetailsHeader } from "./components/EventDetailsHeader";
import { EventDetailsTabs } from "./components/EventDetailsTabs";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Event = Database['public']['Tables']['events']['Row'];

export const EventDetailsPage = () => {
  const { groupId, eventId } = useParams<{ groupId?: string; eventId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch event details directly if we don't have groupId
  const { data: event, isLoading, error, refetch } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      console.log('Fetching event details for eventId:', eventId);
      
      if (!eventId || eventId.trim() === '') {
        throw new Error('Event ID is required');
      }

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId.trim())
        .single();

      if (error) {
        console.error('Error fetching event:', error);
        throw error;
      }

      console.log('Event data:', data);
      return data as Event;
    },
    enabled: !!eventId && eventId.trim() !== '',
  });

  const handleBack = () => {
    // Navigate back to the previous page or dashboard
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleEventUpdated = () => {
    // Refetch event data when it's updated
    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingContainer isLoading={true} skeleton="card" skeletonCount={1}>
          <div />
        </LoadingContainer>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Event not found</h2>
          <p className="text-sm text-gray-600">The event you're looking for doesn't exist.</p>
          <Button 
            onClick={handleBack}
            variant="outline"
            className="mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Safely get the group ID with null checks
  const effectiveGroupId = groupId && groupId.trim() !== '' 
    ? groupId.trim() 
    : (event.group_id && typeof event.group_id === 'string' ? event.group_id : '');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header with Back Button */}
      <header className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-slate-800 to-slate-700 text-white px-4 py-3 flex items-center shadow-lg border-b border-slate-600/30">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-slate-600/50 transition-all duration-200 hover:scale-105 mr-3 p-0 h-8 w-8"
          onClick={handleBack}
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex-1">
          <h1 className="font-semibold text-lg md:text-xl tracking-tight leading-tight truncate">
            {event.event_title || 'Event Details'}
          </h1>
        </div>
      </header>

      {/* Add top padding to account for fixed header */}
      <div className="pt-[60px]">
        <EventDetailsHeader 
          event={event} 
          groupId={effectiveGroupId} 
          userId={user?.id}
          onEventUpdated={handleEventUpdated}
        />
        <EventDetailsTabs 
          event={event} 
          currentUserId={user?.id}
        />
      </div>
    </div>
  );
};

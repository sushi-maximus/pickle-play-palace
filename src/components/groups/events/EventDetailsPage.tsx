
import { useParams, useNavigate } from "react-router-dom";
import { useGroupEvents } from "./hooks/useGroupEvents";
import { LoadingContainer } from "@/components/ui/LoadingContainer";
import { EventDetailsHeader } from "./components/EventDetailsHeader";
import { EventDetailsTabs } from "./components/EventDetailsTabs";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const EventDetailsPage = () => {
  const { groupId, eventId } = useParams<{ groupId: string; eventId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { events, isLoading, error } = useGroupEvents({ 
    groupId: groupId || '', 
    enabled: !!groupId 
  });

  const event = events.find(e => e.id === eventId);

  const handleBack = () => {
    // Navigate back to the previous page or group details if coming from dashboard
    if (window.history.length > 1) {
      navigate(-1);
    } else if (groupId) {
      navigate(`/groups/${groupId}`);
    } else {
      navigate('/dashboard');
    }
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
            {event.event_title}
          </h1>
        </div>
      </header>

      {/* Add top padding to account for fixed header */}
      <div className="pt-[60px]">
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
    </div>
  );
};

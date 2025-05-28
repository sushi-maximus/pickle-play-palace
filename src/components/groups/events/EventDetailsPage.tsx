import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGroupEvents } from "./hooks/useGroupEvents";
import { LoadingContainer } from "@/components/ui/LoadingContainer";
import type { Database } from "@/integrations/supabase/types";

type Event = Database['public']['Tables']['events']['Row'];

const EventDetailsHeader = ({ event }: { event: Event }) => {
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
        {event.registration_open && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            Open
          </span>
        )}
      </div>
    </div>
  );
};

const EventDetailsTab = ({ event }: { event: Event }) => {
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
    <div className="space-y-6 p-4">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">Date & Time</p>
            <p className="text-sm text-gray-600">
              {formatDate(event.event_date)} at {formatTime(event.event_time)}
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

const ConfirmedPlayersTab = () => {
  return (
    <div className="p-4">
      <div className="text-center py-8">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No confirmed players yet</h3>
        <p className="text-sm text-gray-600">
          Players will appear here once they register and are confirmed.
        </p>
      </div>
    </div>
  );
};

const WaitlistTab = () => {
  return (
    <div className="p-4">
      <div className="text-center py-8">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No waitlisted players</h3>
        <p className="text-sm text-gray-600">
          Players on the waitlist will appear here.
        </p>
      </div>
    </div>
  );
};

export const EventDetailsPage = () => {
  const { groupId, eventId } = useParams<{ groupId: string; eventId: string }>();
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

  if (error || !event) {
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
      <EventDetailsHeader event={event} />
      
      <div className="max-w-2xl mx-auto">
        <Tabs defaultValue="details" className="bg-white">
          <TabsList className="grid w-full grid-cols-3 bg-gray-50 p-1 rounded-none border-b">
            <TabsTrigger 
              value="details" 
              className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary"
            >
              Details
            </TabsTrigger>
            <TabsTrigger 
              value="confirmed" 
              className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary"
            >
              Confirmed
            </TabsTrigger>
            <TabsTrigger 
              value="waitlist" 
              className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary"
            >
              Waitlist
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-0">
            <EventDetailsTab event={event} />
          </TabsContent>

          <TabsContent value="confirmed" className="mt-0">
            <ConfirmedPlayersTab />
          </TabsContent>

          <TabsContent value="waitlist" className="mt-0">
            <WaitlistTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

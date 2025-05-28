
import { CreateEventButton } from "@/components/groups/events";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import type { Profile } from "../posts/hooks/types/groupPostTypes";

type Group = Database['public']['Tables']['groups']['Row'] & {
  member_count: number;
};

interface GroupCalendarTabProps {
  groupId: string;
  user: Profile | null;
  isAdmin: boolean;
}

// Mock event data for UI display - will be replaced with real data in next steps
const mockEvents = [
  {
    id: "1",
    event_title: "Week 1 Ladder Matchup",
    event_date: "2025-05-28",
    event_time: "18:00",
    location: "Central Park Courts",
    registration_open: true,
    description: "Competitive ladder matchup for all skill levels"
  },
  {
    id: "2", 
    event_title: "Friday Night Social",
    event_date: "2025-05-30",
    event_time: "19:30",
    location: "Riverside Courts",
    registration_open: true,
    description: "Casual social play and networking"
  }
];

const EventCard = ({ event }: { event: any }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
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
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-200 touch-manipulation min-h-[80px]">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 text-base leading-tight">
              {event.event_title}
            </h3>
            {event.registration_open && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                Open
              </span>
            )}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{formatDate(event.event_date)}</span>
              <Clock className="h-4 w-4 text-gray-400 ml-2" />
              <span>{formatTime(event.event_time)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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

const LoadingState = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        </div>
      </div>
    ))}
  </div>
);

export const GroupCalendarTab = ({ groupId, user, isAdmin }: GroupCalendarTabProps) => {
  // Mock loading state - will be replaced with real loading state in next steps
  const isLoading = false;
  const events = mockEvents;

  return (
    <main className="flex-1 bg-gray-50 overflow-hidden min-h-0">
      <div className="max-w-2xl mx-auto h-full flex flex-col">
        {/* Header with Create Event Button */}
        <div className="flex-shrink-0 bg-gray-50 pt-safe mb-4 animate-fade-in border-b border-gray-100/50">
          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 tracking-tight">Calendar</h3>
              <p className="text-sm text-gray-600 mt-1">Upcoming events and activities</p>
            </div>
            {isAdmin && (
              <CreateEventButton 
                groupId={groupId} 
                isAdmin={isAdmin}
                className="bg-green-600 hover:bg-green-700 text-white"
              />
            )}
          </div>
        </div>

        {/* Calendar Content */}
        <div className="flex-1 overflow-y-auto overscroll-behavior-y-contain min-h-0 scroll-smooth">
          <div className="p-4 pb-6 space-y-4">
            {isLoading ? (
              <LoadingState />
            ) : events.length > 0 ? (
              <div className="space-y-4">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <EmptyState isAdmin={isAdmin} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

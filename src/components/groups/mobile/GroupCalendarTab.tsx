
import { CreateEventButton, EventsList } from "@/components/groups/events";
import { Calendar } from "lucide-react";
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

export const GroupCalendarTab = ({ groupId, user, isAdmin }: GroupCalendarTabProps) => {
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

        {/* Calendar Content - Now using real EventsList component */}
        <div className="flex-1 overflow-y-auto overscroll-behavior-y-contain min-h-0 scroll-smooth">
          <div className="p-4 pb-6">
            <EventsList 
              groupId={groupId} 
              isAdmin={isAdmin}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

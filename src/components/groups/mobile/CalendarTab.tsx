
import { CreateEventButton } from "@/components/groups/events";
import { useParams } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

interface CalendarTabProps {
  isAdmin?: boolean;
}

export const CalendarTab = ({ isAdmin = false }: CalendarTabProps) => {
  const { id: groupId } = useParams<{ id: string }>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-4">
      {/* Header with Create Event button for admins */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Group Calendar</h2>
        
        {isAdmin && groupId && (
          <CreateEventButton groupId={groupId} isAdmin={isAdmin} />
        )}
      </div>

      {/* Calendar Component */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="w-full"
        />
      </div>

      {/* Events List - placeholder for now */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-medium text-gray-900 mb-3">Upcoming Events</h3>
        <div className="text-center py-8 text-gray-500">
          <p>No events scheduled</p>
          {isAdmin && (
            <p className="text-sm mt-2">Create your first event using the button above!</p>
          )}
        </div>
      </div>
    </div>
  );
};

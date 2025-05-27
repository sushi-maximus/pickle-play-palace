
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
      {/* Create Event button for admins - positioned at top right */}
      {isAdmin && groupId && (
        <div className="flex justify-end">
          <CreateEventButton groupId={groupId} isAdmin={isAdmin} />
        </div>
      )}

      {/* Calendar Component */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="w-full"
        />
      </div>
    </div>
  );
};

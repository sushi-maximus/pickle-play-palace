
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { formatDateForDisplay } from '@/utils/dateUtils';
import { useTouchFeedback } from '@/hooks/useTouchFeedback';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

interface EventItemProps {
  event: {
    id: string;
    event_title: string;
    event_date: string;
    event_time: string;
    location: string;
    status: string;
  };
  isNextEvent: boolean;
  onEventClick: (eventId: string) => void;
  getStatusBadgeVariant: (status: string) => "default" | "secondary" | "destructive" | "outline";
  getStatusBadgeClass: (status: string) => string;
}

export const EventItem = ({ 
  event, 
  isNextEvent, 
  onEventClick, 
  getStatusBadgeVariant, 
  getStatusBadgeClass 
}: EventItemProps) => {
  const { isPressed, touchProps } = useTouchFeedback();
  
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Registered';
      case 'waitlist':
        return 'Waitlisted';
      default:
        return 'Not Registered';
    }
  };
  
  return (
    <div
      onClick={() => onEventClick(event.id)}
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
            {isNextEvent && (
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
              {formatDateForDisplay(event.event_date)} at{' '}
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
            {getStatusDisplay(event.status)}
          </Badge>
        </div>
      </div>
      
      {/* Show info message for waitlisted events inside the card */}
      {event.status === 'waitlist' && (
        <div className="mt-2">
          <div className="inline-flex items-center gap-2 p-2 bg-blue-50 rounded-md border border-blue-200">
            <Info className="h-3 w-3 md:h-4 md:w-4 text-blue-500 flex-shrink-0" />
            <p className="text-xs text-blue-700">
              Every 4 players registered will be confirmed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};


import type { Database } from "@/integrations/supabase/types";

type Event = Database['public']['Tables']['events']['Row'];

export const useEditEventValidation = () => {
  const validateEditForm = (eventData: Partial<Event>): boolean => {
    if (!eventData.event_title?.trim()) return false;
    if (!eventData.description?.trim()) return false;
    if (!eventData.event_date) return false;
    if (!eventData.event_time) return false;
    if (!eventData.location?.trim()) return false;
    
    // For editing: Allow until end of event day (11:59 PM)
    const eventDate = new Date(eventData.event_date + "T00:00:00");
    const endOfEventDay = new Date(eventDate);
    endOfEventDay.setHours(23, 59, 59, 999);
    const now = new Date();
    
    if (now > endOfEventDay) return false;
    
    return true;
  };

  const getEditValidationErrors = (eventData: Partial<Event>) => {
    const errors: Record<string, string> = {};
    
    if (!eventData.event_title?.trim()) {
      errors.event_title = "Event title is required";
    }
    if (!eventData.description?.trim()) {
      errors.description = "Description is required";
    }
    if (!eventData.event_date) {
      errors.event_date = "Date is required";
    } else {
      const eventDate = new Date(eventData.event_date + "T00:00:00");
      const endOfEventDay = new Date(eventDate);
      endOfEventDay.setHours(23, 59, 59, 999);
      const now = new Date();
      
      if (now > endOfEventDay) {
        errors.event_date = "Cannot edit events after the event day has ended";
      }
    }
    if (!eventData.event_time) {
      errors.event_time = "Time is required";
    }
    if (!eventData.location?.trim()) {
      errors.location = "Location is required";
    }
    
    return errors;
  };

  return { validateEditForm, getEditValidationErrors };
};

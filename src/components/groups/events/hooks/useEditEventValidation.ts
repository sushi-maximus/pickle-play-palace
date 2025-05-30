
import type { Database } from "@/integrations/supabase/types";

type Event = Database['public']['Tables']['events']['Row'];

export const useEditEventValidation = () => {
  const validateEditForm = (eventData: Partial<Event>): boolean => {
    if (!eventData.event_title?.trim()) return false;
    if (!eventData.description?.trim()) return false;
    if (!eventData.event_date) return false;
    if (!eventData.event_time) return false;
    if (!eventData.location?.trim()) return false;
    
    // No date validation for editing - allow editing regardless of date
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
    }
    if (!eventData.event_time) {
      errors.event_time = "Time is required";
    }
    if (!eventData.location?.trim()) {
      errors.location = "Location is required";
    }
    
    // No date validation errors for editing
    return errors;
  };

  return { validateEditForm, getEditValidationErrors };
};

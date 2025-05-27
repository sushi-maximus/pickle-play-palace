
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { EventFormData } from "../types";

export const useEventSubmission = (groupId: string) => {
  const navigate = useNavigate();

  const handleEventSubmission = async (formData: EventFormData, dispatch: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast.error("You must be logged in to create an event");
        return;
      }

      if (formData.eventType === "multi-week") {
        // Create event series first
        const { data: seriesData, error: seriesError } = await supabase
          .from('event_series')
          .insert({
            group_id: groupId,
            organizer_id: user.id,
            series_title: formData.seriesTitle,
            event_type: formData.eventType,
            event_format: formData.eventFormat
          })
          .select()
          .single();

        if (seriesError) {
          toast.error("Failed to create event series");
          console.error("Series creation error:", seriesError);
          return;
        }

        // Create individual events
        const eventPromises = formData.events.map(event => 
          supabase.from('events').insert({
            series_id: seriesData.id,
            group_id: groupId,
            event_title: event.eventTitle,
            description: event.description,
            event_date: event.eventDate,
            event_time: event.eventTime,
            location: event.location,
            max_players: event.maxPlayers,
            allow_reserves: event.allowReserves,
            pricing_model: event.pricingModel,
            fee_amount: event.feeAmount,
            ranking_method: event.rankingMethod,
            skill_category: event.skillCategory,
            event_format: formData.eventFormat
          })
        );

        await Promise.all(eventPromises);
        toast.success("Multi-week event series created successfully!");
      } else {
        // Create single event series entry
        const { data: seriesData, error: seriesError } = await supabase
          .from('event_series')
          .insert({
            group_id: groupId,
            organizer_id: user.id,
            event_type: formData.eventType,
            event_format: formData.eventFormat
          })
          .select()
          .single();

        if (seriesError) {
          toast.error("Failed to create event series");
          console.error("Series creation error:", seriesError);
          return;
        }

        // Create single event
        const { error: eventError } = await supabase
          .from('events')
          .insert({
            series_id: seriesData.id,
            group_id: groupId,
            event_title: formData.eventTitle,
            description: formData.description,
            event_date: formData.eventDate,
            event_time: formData.eventTime,
            location: formData.location,
            max_players: formData.maxPlayers,
            allow_reserves: formData.allowReserves,
            pricing_model: formData.pricingModel,
            fee_amount: formData.feeAmount,
            ranking_method: formData.rankingMethod,
            skill_category: formData.skillCategory,
            event_format: formData.eventFormat
          });

        if (eventError) {
          toast.error("Failed to create event");
          console.error("Event creation error:", eventError);
          return;
        }

        toast.success("Event created successfully!");
      }

      // Navigate back to group page
      navigate(`/groups/${groupId}`);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return { handleEventSubmission };
};

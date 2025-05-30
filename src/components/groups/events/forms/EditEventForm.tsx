
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { EventDateField } from "./fields/EventDateField";
import { EventTimeField } from "./fields/EventTimeField";
import { EventBasicFields } from "./fields/EventBasicFields";
import { EventCapacityFields } from "./fields/EventCapacityFields";
import { EventPricingFields } from "./fields/EventPricingFields";
import type { Event, EventFormData } from "./types/eventFormTypes";
import type { EventUpdateData } from "../services/eventUpdateService";

interface EditEventFormProps {
  event: Event;
  onSubmit: (data: EventUpdateData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const EditEventForm = ({ event, onSubmit, onCancel, isLoading }: EditEventFormProps) => {
  console.log('EditEventForm - Event data:', event);
  
  const form = useForm<EventFormData>({
    defaultValues: {
      event_title: event.event_title,
      description: event.description,
      event_date: event.event_date || '',
      event_time: event.event_time,
      location: event.location,
      max_players: event.max_players,
      allow_reserves: event.allow_reserves,
      registration_open: event.registration_open,
      pricing_model: event.pricing_model as "free" | "one-time" | "per-event",
      fee_amount: event.fee_amount ? Number(event.fee_amount) : null
    }
  });

  const handleSubmit = (data: EventFormData) => {
    console.log('EditEventForm - Submitting form data:', data);
    onSubmit(data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 px-3 py-4 md:px-6 md:py-8">
        <EventBasicFields
          title={form.watch('event_title')}
          description={form.watch('description')}
          location={form.watch('location')}
          onTitleChange={(title) => form.setValue('event_title', title)}
          onDescriptionChange={(description) => form.setValue('description', description)}
          onLocationChange={(location) => form.setValue('location', location)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EventDateField
            value={form.watch('event_date')}
            onChange={(date) => form.setValue('event_date', date)}
          />
          <EventTimeField
            value={form.watch('event_time')}
            onChange={(time) => form.setValue('event_time', time)}
          />
        </div>

        <EventCapacityFields
          maxPlayers={form.watch('max_players')}
          allowReserves={form.watch('allow_reserves')}
          registrationOpen={form.watch('registration_open')}
          onMaxPlayersChange={(maxPlayers) => form.setValue('max_players', maxPlayers)}
          onAllowReservesChange={(allowReserves) => form.setValue('allow_reserves', allowReserves)}
          onRegistrationOpenChange={(registrationOpen) => form.setValue('registration_open', registrationOpen)}
        />

        <EventPricingFields
          pricingModel={form.watch('pricing_model')}
          feeAmount={form.watch('fee_amount')}
          onPricingModelChange={(model) => form.setValue('pricing_model', model)}
          onFeeAmountChange={(amount) => form.setValue('fee_amount', amount)}
        />

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

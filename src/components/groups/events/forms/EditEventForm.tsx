
import React, { useState } from "react";
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
  
  const [formData, setFormData] = useState<EventFormData>({
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
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('EditEventForm - Submitting form data:', formData);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 px-3 py-4 md:px-6 md:py-8">
      <EventBasicFields
        title={formData.event_title}
        description={formData.description}
        location={formData.location}
        onTitleChange={(title) => setFormData(prev => ({ ...prev, event_title: title }))}
        onDescriptionChange={(description) => setFormData(prev => ({ ...prev, description }))}
        onLocationChange={(location) => setFormData(prev => ({ ...prev, location }))}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EventDateField
          value={formData.event_date}
          onChange={(date) => setFormData(prev => ({ ...prev, event_date: date }))}
        />
        <EventTimeField
          value={formData.event_time}
          onChange={(time) => setFormData(prev => ({ ...prev, event_time: time }))}
        />
      </div>

      <EventCapacityFields
        maxPlayers={formData.max_players}
        allowReserves={formData.allow_reserves}
        registrationOpen={formData.registration_open}
        onMaxPlayersChange={(maxPlayers) => setFormData(prev => ({ ...prev, max_players: maxPlayers }))}
        onAllowReservesChange={(allowReserves) => setFormData(prev => ({ ...prev, allow_reserves: allowReserves }))}
        onRegistrationOpenChange={(registrationOpen) => setFormData(prev => ({ ...prev, registration_open: registrationOpen }))}
      />

      <EventPricingFields
        pricingModel={formData.pricing_model}
        feeAmount={formData.fee_amount}
        onPricingModelChange={(model) => setFormData(prev => ({ ...prev, pricing_model: model }))}
        onFeeAmountChange={(amount) => setFormData(prev => ({ ...prev, fee_amount: amount }))}
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
  );
};

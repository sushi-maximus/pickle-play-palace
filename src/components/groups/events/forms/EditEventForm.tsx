
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Database } from "@/integrations/supabase/types";
import type { EventUpdateData } from "../services/eventUpdateService";

type Event = Database['public']['Tables']['events']['Row'];

const editEventSchema = z.object({
  event_title: z.string().min(1, "Event title is required"),
  description: z.string().min(1, "Description is required"),
  event_time: z.string().min(1, "Event time is required"),
  location: z.string().min(1, "Location is required"),
  max_players: z.number().min(1, "Must have at least 1 player"),
  allow_reserves: z.boolean(),
  registration_open: z.boolean(),
  pricing_model: z.enum(["free", "one-time", "per-event"]),
  fee_amount: z.number().nullable()
});

type EditEventFormData = z.infer<typeof editEventSchema>;

interface EditEventFormProps {
  event: Event;
  onSubmit: (data: EventUpdateData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const EditEventForm = ({ event, onSubmit, onCancel, isLoading }: EditEventFormProps) => {
  // Debug the event object
  console.log('=== EVENT OBJECT DEBUG ===');
  console.log('Raw event object:', event);
  console.log('event.event_date value:', event.event_date);
  console.log('event.event_date type:', typeof event.event_date);
  
  // Force string conversion to prevent any Date object interference
  const cleanDateString = String(event.event_date);
  console.log('cleanDateString:', cleanDateString);
  
  // Use separate state for the date - completely isolated from react-hook-form
  const [dateValue, setDateValue] = useState(cleanDateString);
  
  console.log('useState initial dateValue:', dateValue);
  
  const form = useForm<EditEventFormData>({
    resolver: zodResolver(editEventSchema),
    defaultValues: {
      event_title: event.event_title,
      description: event.description,
      event_time: event.event_time,
      location: event.location,
      max_players: event.max_players,
      allow_reserves: event.allow_reserves,
      registration_open: event.registration_open,
      pricing_model: event.pricing_model as "free" | "one-time" | "per-event",
      fee_amount: event.fee_amount ? Number(event.fee_amount) : null
    }
  });

  const handleSubmit = (data: EditEventFormData) => {
    // Use our controlled date value instead of the form's value
    const submitData = {
      ...data,
      event_date: dateValue
    };
    console.log('Submitting event_date:', submitData.event_date);
    onSubmit(submitData);
  };

  const pricingModel = form.watch('pricing_model');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="event_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter event title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter event description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Standalone date input - completely separate from react-hook-form */}
          <div className="space-y-2">
            <label htmlFor="event-date" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Date
            </label>
            <Input 
              id="event-date"
              type="date" 
              value={dateValue}
              onChange={(e) => {
                console.log('Date input onChange:', e.target.value);
                setDateValue(e.target.value);
              }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            />
          </div>

          <FormField
            control={form.control}
            name="event_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input {...field} type="time" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter event location" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="max_players"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Players</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="number" 
                  min="1"
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pricing_model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pricing Model</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pricing model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="one-time">One-time Fee</SelectItem>
                  <SelectItem value="per-event">Per Event</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {pricingModel !== 'free' && (
          <FormField
            control={form.control}
            name="fee_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fee Amount ($)</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="number" 
                    step="0.01"
                    min="0"
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="space-y-3">
          <FormField
            control={form.control}
            name="allow_reserves"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Allow Reserves</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Allow players to join a waitlist when event is full
                  </div>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="registration_open"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Registration Open</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Allow new players to register for this event
                  </div>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

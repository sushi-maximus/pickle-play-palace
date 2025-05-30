import React from "react";
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
  event_date: z.string().min(1, "Event date is required"),
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
  // Helper function to format date for input (YYYY-MM-DD format)
  const formatDateForInput = (dateString: string) => {
    console.log('Original event.event_date from database:', dateString);
    
    // Create a date object treating the date string as local time to prevent timezone shifts
    const dateObj = new Date(dateString + 'T00:00:00');
    const formattedDate = dateObj.toISOString().split('T')[0];
    console.log('Formatted date for input field:', formattedDate);
    
    return formattedDate;
  };

  const form = useForm<EditEventFormData>({
    resolver: zodResolver(editEventSchema),
    defaultValues: {
      event_title: event.event_title,
      description: event.description,
      event_date: formatDateForInput(event.event_date),
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
    console.log('Form submission data - event_date:', data.event_date);
    onSubmit(data);
  };

  const pricingModel = form.watch('pricing_model');

  // Add debugging for form values
  const currentFormDate = form.watch('event_date');
  console.log('Current form date value:', currentFormDate);

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
          <FormField
            control={form.control}
            name="event_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="date" 
                    onChange={(e) => {
                      console.log('Date input changed to:', e.target.value);
                      field.onChange(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

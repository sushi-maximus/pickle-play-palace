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
  // CRITICAL DEBUG: Let's see exactly what we get from the database
  console.log('=== DATABASE EVENT OBJECT DEBUG ===');
  console.log('Raw event from database:', event);
  console.log('Event ID:', event.id);
  console.log('Event title:', event.event_title);
  console.log('Raw event_date from DB:', event.event_date);
  console.log('Type of event_date:', typeof event.event_date);
  console.log('event_date as JSON:', JSON.stringify(event.event_date));
  console.log('event_date length:', event.event_date?.length);
  
  // Let's see what happens with different parsing approaches
  console.log('--- PARSING TESTS ---');
  console.log('Direct string value:', event.event_date);
  console.log('new Date(event.event_date):', new Date(event.event_date));
  console.log('new Date(event.event_date).toISOString():', new Date(event.event_date).toISOString());
  console.log('new Date(event.event_date).toLocaleDateString():', new Date(event.event_date).toLocaleDateString());
  console.log('new Date(event.event_date).getDate():', new Date(event.event_date).getDate());
  console.log('new Date(event.event_date).getMonth():', new Date(event.event_date).getMonth());
  console.log('new Date(event.event_date).getFullYear():', new Date(event.event_date).getFullYear());
  
  // Test if it's a timezone issue
  console.log('--- TIMEZONE TESTS ---');
  console.log('Current timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
  console.log('UTC offset:', new Date().getTimezoneOffset());
  const testDate = new Date(event.event_date + 'T00:00:00');
  console.log('With T00:00:00 suffix:', testDate);
  console.log('With T00:00:00 suffix toDateString:', testDate.toDateString());
  
  // Test manual parsing
  console.log('--- MANUAL PARSING TEST ---');
  const parts = event.event_date.split('-');
  console.log('Split parts:', parts);
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1; // JS months are 0-indexed
  const day = parseInt(parts[2]);
  console.log('Parsed:', { year, month, day });
  const manualDate = new Date(year, month, day);
  console.log('Manual Date object:', manualDate);
  console.log('Manual toISOString:', manualDate.toISOString());
  console.log('Manual date only:', manualDate.toISOString().split('T')[0]);

  // Use the exact string from database without any processing
  const formDateValue = event.event_date;
  console.log('Form will use this date value:', formDateValue);

  const form = useForm<EditEventFormData>({
    resolver: zodResolver(editEventSchema),
    defaultValues: {
      event_title: event.event_title,
      description: event.description,
      event_date: formDateValue,
      event_time: event.event_time,
      location: event.location,
      max_players: event.max_players,
      allow_reserves: event.allow_reserves,
      registration_open: event.registration_open,
      pricing_model: event.pricing_model as "free" | "one-time" | "per-event",
      fee_amount: event.fee_amount ? Number(event.fee_amount) : null
    }
  });

  console.log('=== FORM INITIAL STATE ===');
  console.log('Form getValues():', form.getValues());
  console.log('Form event_date specifically:', form.getValues('event_date'));

  const handleSubmit = (data: EditEventFormData) => {
    console.log('=== FORM SUBMISSION ===');
    console.log('Submitting data:', data);
    console.log('Submitted event_date:', data.event_date);
    onSubmit(data);
  };

  const pricingModel = form.watch('pricing_model');

  // Real-time watching
  const watchedDate = form.watch('event_date');
  console.log('=== REAL-TIME WATCH ===');
  console.log('Currently watched date value:', watchedDate);

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
                      console.log('=== INPUT CHANGE EVENT ===');
                      console.log('Input event target value:', e.target.value);
                      console.log('Input valueAsDate:', e.target.valueAsDate);
                      console.log('Current field value before change:', field.value);
                      
                      // Let's see what the browser gives us
                      const inputValue = e.target.value;
                      console.log('Raw input value:', inputValue);
                      console.log('Input value type:', typeof inputValue);
                      
                      field.onChange(inputValue);
                      console.log('Field value after onChange:', inputValue);
                    }}
                    onFocus={(e) => {
                      console.log('=== INPUT FOCUS ===');
                      console.log('Input value on focus:', e.target.value);
                    }}
                    onBlur={(e) => {
                      console.log('=== INPUT BLUR ===');
                      console.log('Input value on blur:', e.target.value);
                      field.onBlur();
                    }}
                  />
                </FormControl>
                <FormMessage />
                <div className="text-xs text-gray-500 mt-1">
                  Debug: Current value = {field.value}
                </div>
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

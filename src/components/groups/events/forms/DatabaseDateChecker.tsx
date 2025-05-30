
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Event = Database['public']['Tables']['events']['Row'];

export const DatabaseDateChecker = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkDatabaseValue = async () => {
      console.log('=== DATABASE DATE CHECKER ===');
      
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', 'EVENT_1_ID_HERE') // Replace with actual Event 1 ID
          .single();

        if (error) {
          console.error('Error fetching event:', error);
          return;
        }

        console.log('Raw database event object:', data);
        console.log('Raw event_date from database:', data.event_date);
        console.log('Type of event_date:', typeof data.event_date);
        console.log('event_date as JSON:', JSON.stringify(data.event_date));

        // Check what we get when we parse it
        console.log('--- DATE PARSING TESTS ---');
        const dbDate = data.event_date;
        console.log('Direct database value:', dbDate);
        
        // Parse as Date object
        const dateObj = new Date(dbDate);
        console.log('new Date(dbDate):', dateObj);
        console.log('dateObj.toISOString():', dateObj.toISOString());
        console.log('dateObj.toDateString():', dateObj.toDateString());
        
        // Check UTC vs local time
        console.log('--- TIMEZONE ANALYSIS ---');
        console.log('UTC date:', dateObj.toUTCString());
        console.log('Local date:', dateObj.toLocaleDateString());
        console.log('Current timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
        console.log('Timezone offset (minutes):', dateObj.getTimezoneOffset());
        
        // Mountain Standard Time conversion
        console.log('--- MOUNTAIN TIME CONVERSION ---');
        const mstOptions: Intl.DateTimeFormatOptions = {
          timeZone: 'America/Denver', // Mountain Time
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        };
        console.log('Date in Mountain Time:', dateObj.toLocaleDateString('en-US', mstOptions));
        
        // What should we expect for 2025-05-30?
        console.log('--- EXPECTED VALUES ---');
        console.log('If you entered 5-30-25 (May 30, 2025):');
        console.log('Expected database value: 2025-05-30');
        console.log('Expected display: 2025-05-30 (no conversion needed for date-only values)');
        
        // Parse the database date manually
        console.log('--- MANUAL PARSING ---');
        const parts = dbDate.split('-');
        console.log('Date parts:', parts);
        if (parts.length === 3) {
          const year = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1; // JS months are 0-indexed
          const day = parseInt(parts[2]);
          console.log('Parsed components:', { year, month: month + 1, day });
          
          const manualDate = new Date(year, month, day);
          console.log('Manual Date object:', manualDate);
          console.log('Manual date toDateString:', manualDate.toDateString());
          console.log('Manual date for input field:', manualDate.toISOString().split('T')[0]);
        }

        setEvent(data);
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkDatabaseValue();
  }, []);

  if (loading) {
    return <div className="p-4">Checking database value...</div>;
  }

  if (!event) {
    return <div className="p-4 text-red-600">Could not fetch event data</div>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-2">Database Date Check Results</h3>
      <div className="space-y-2 text-sm">
        <div><strong>Event ID:</strong> {event.id}</div>
        <div><strong>Event Title:</strong> {event.event_title}</div>
        <div><strong>Raw DB Date:</strong> {event.event_date}</div>
        <div><strong>Expected:</strong> 2025-05-30 (if you entered 5-30-25)</div>
        <div className="text-xs text-gray-600 mt-2">
          Check console for detailed timezone analysis
        </div>
      </div>
    </div>
  );
};

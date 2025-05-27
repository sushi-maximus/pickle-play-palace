
/**
 * Purpose: Sends a notification to the organizer when an event or series of events is created successfully.
 * Usage: Triggered after an event is created in Step 6 of the Event Creation Wizard to notify the organizer of successful creation.
 * Parameters:
 *   request.body.event_id (UUID): The ID of the newly created event (for one-time events) or the first event in a series (for multi-week events).
 * Returns: An object with a success message (e.g., { message: "Notification sent successfully." }).
 * Example Call: Triggered automatically after inserting into the events table, e.g., notify_organizer_event_created({ event_id: '789e0123-e89b-12d3-a456-426614174000' });
 * Notes:
 *   - Fetches event and organizer details to construct a personalized notification message.
 *   - Currently logs the notification message; actual implementation should integrate with an email service or in-app notification system.
 *   - Assumes the organizer's email is stored in the auth.users table and linked via the profiles table.
 */
export default async function notify_organizer_event_created(request: Request) {
  try {
    const { event_id } = await request.json();
    
    if (!event_id) {
      return new Response(
        JSON.stringify({ error: "Event ID is required" }),
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Create Supabase client
    const supabaseUrl = "https://tkqiklfpleoiupgfvsxp.supabase.co";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseServiceKey) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");
    }

    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.49.7");
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('event_title, group_id, series_id')
      .eq('id', event_id)
      .single();
    
    if (eventError) {
      throw new Error(`Failed to fetch event: ${eventError.message}`);
    }

    // Fetch event series to get organizer_id
    const { data: series, error: seriesError } = await supabase
      .from('event_series')
      .select('organizer_id')
      .eq('id', event.series_id)
      .single();

    if (seriesError) {
      throw new Error(`Failed to fetch event series: ${seriesError.message}`);
    }

    // Fetch organizer profile
    const { data: organizerProfile, error: profileError } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', series.organizer_id)
      .single();

    if (profileError) {
      throw new Error(`Failed to fetch organizer profile: ${profileError.message}`);
    }

    // Fetch organizer auth data (for email)
    const { data: { user: organizerAuth }, error: authError } = await supabase.auth.admin.getUserById(series.organizer_id);

    if (authError || !organizerAuth) {
      throw new Error(`Failed to fetch organizer auth data: ${authError?.message || 'User not found'}`);
    }

    const fullName = `${organizerProfile.first_name} ${organizerProfile.last_name}`;

    // Log the notification (in production, this would send an actual email/notification)
    console.log(`Sending notification to ${organizerAuth.email} (${fullName}): Event "${event.event_title}" created successfully.`);

    return new Response(
      JSON.stringify({ message: "Notification sent successfully." }),
      { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error in notify_organizer_event_created:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to send notification",
        details: error.message 
      }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

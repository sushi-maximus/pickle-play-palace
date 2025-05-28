
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.7";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PromotionRequest {
  eventId: string;
  slotsAvailable: number;
  promotionReason?: string;
  testMode?: boolean;
  manual?: boolean;
  maxPromotions?: number;
}

interface PromotionResult {
  playerId: string;
  promoted: boolean;
  newStatus: string;
  promotionReason: string;
  previousRankingOrder: number;
  newRankingOrder: number;
  promotedAt: string;
}

interface PromotionResponse {
  success: boolean;
  message: string;
  totalPromoted: number;
  results: PromotionResult[];
  eventId: string;
  slotsRequested: number;
  auditLog: string[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { 
      eventId, 
      slotsAvailable, 
      promotionReason = 'bulk_promotion',
      testMode = false,
      manual = false,
      maxPromotions
    }: PromotionRequest = await req.json();

    console.log(`Advanced promotion request - Event: ${eventId}, Slots: ${slotsAvailable}, Test: ${testMode}, Manual: ${manual}`);

    const auditLog: string[] = [];
    auditLog.push(`Promotion started at ${new Date().toISOString()}`);
    auditLog.push(`Event ID: ${eventId}, Slots available: ${slotsAvailable}`);
    auditLog.push(`Promotion reason: ${promotionReason}, Manual: ${manual}, Test mode: ${testMode}`);

    // Validate event exists and get current state
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, max_players, allow_reserves, event_title')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      console.error('Event not found:', eventError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Event not found',
          auditLog: [...auditLog, 'ERROR: Event not found']
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    auditLog.push(`Event found: "${event.event_title}", Max players: ${event.max_players}`);

    // Get current confirmed and waitlisted players
    const { data: currentPlayers, error: playersError } = await supabase
      .from('player_status')
      .select('player_id, status, ranking_order, registration_timestamp')
      .eq('event_id', eventId)
      .order('registration_timestamp', { ascending: true });

    if (playersError) {
      console.error('Error fetching players:', playersError);
      auditLog.push(`ERROR: Failed to fetch players - ${playersError.message}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Failed to fetch player data',
          auditLog 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const confirmedPlayers = currentPlayers?.filter(p => p.status === 'confirmed') || [];
    const waitlistPlayers = currentPlayers?.filter(p => p.status === 'waitlist') || [];

    auditLog.push(`Current state: ${confirmedPlayers.length} confirmed, ${waitlistPlayers.length} waitlisted`);

    // Validate promotion request
    const effectiveMaxPromotions = maxPromotions || slotsAvailable;
    const playersToPromote = Math.min(
      waitlistPlayers.length,
      slotsAvailable,
      effectiveMaxPromotions
    );

    if (playersToPromote === 0) {
      auditLog.push('No players available for promotion');
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No players available for promotion',
          totalPromoted: 0,
          results: [],
          eventId,
          slotsRequested: slotsAvailable,
          auditLog
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    auditLog.push(`Will attempt to promote ${playersToPromote} players`);

    // Get players to promote (ordered by registration timestamp - first come, first served)
    const candidatesForPromotion = waitlistPlayers
      .sort((a, b) => new Date(a.registration_timestamp).getTime() - new Date(b.registration_timestamp).getTime())
      .slice(0, playersToPromote);

    auditLog.push(`Selected ${candidatesForPromotion.length} candidates for promotion`);

    const promotionResults: PromotionResult[] = [];
    const promotedAt = new Date().toISOString();

    // Process promotions
    for (let i = 0; i < candidatesForPromotion.length; i++) {
      const player = candidatesForPromotion[i];
      const newRankingOrder = confirmedPlayers.length + i + 1;
      
      auditLog.push(`Processing promotion for player ${player.player_id} (rank ${player.ranking_order} -> ${newRankingOrder})`);

      if (!testMode) {
        // Update player status in database
        const { error: updateError } = await supabase
          .from('player_status')
          .update({
            status: 'confirmed',
            ranking_order: newRankingOrder,
            promoted_at: promotedAt,
            promotion_reason: promotionReason
          })
          .eq('player_id', player.player_id)
          .eq('event_id', eventId);

        if (updateError) {
          console.error(`Failed to promote player ${player.player_id}:`, updateError);
          auditLog.push(`ERROR: Failed to promote player ${player.player_id} - ${updateError.message}`);
          
          promotionResults.push({
            playerId: player.player_id,
            promoted: false,
            newStatus: 'waitlist',
            promotionReason,
            previousRankingOrder: player.ranking_order,
            newRankingOrder: player.ranking_order,
            promotedAt
          });
          continue;
        }
      }

      // Record successful promotion
      promotionResults.push({
        playerId: player.player_id,
        promoted: true,
        newStatus: 'confirmed',
        promotionReason,
        previousRankingOrder: player.ranking_order,
        newRankingOrder,
        promotedAt
      });

      auditLog.push(`✓ Successfully promoted player ${player.player_id}`);
    }

    // Update remaining waitlist players' ranking orders if needed
    if (!testMode && promotionResults.some(r => r.promoted)) {
      const remainingWaitlistPlayers = waitlistPlayers
        .filter(p => !candidatesForPromotion.some(c => c.player_id === p.player_id))
        .sort((a, b) => new Date(a.registration_timestamp).getTime() - new Date(b.registration_timestamp).getTime());

      for (let i = 0; i < remainingWaitlistPlayers.length; i++) {
        const player = remainingWaitlistPlayers[i];
        const newRankingOrder = i + 1;
        
        if (player.ranking_order !== newRankingOrder) {
          await supabase
            .from('player_status')
            .update({ ranking_order: newRankingOrder })
            .eq('player_id', player.player_id)
            .eq('event_id', eventId);
          
          auditLog.push(`Updated waitlist ranking for player ${player.player_id}: ${player.ranking_order} -> ${newRankingOrder}`);
        }
      }
    }

    const totalPromoted = promotionResults.filter(r => r.promoted).length;
    auditLog.push(`Promotion completed: ${totalPromoted}/${playersToPromote} players promoted`);

    console.log(`Promotion completed for event ${eventId}: ${totalPromoted} players promoted`);

    const response: PromotionResponse = {
      success: true,
      message: testMode 
        ? `Test mode: Would promote ${totalPromoted} players`
        : `Successfully promoted ${totalPromoted} players`,
      totalPromoted,
      results: promotionResults,
      eventId,
      slotsRequested: slotsAvailable,
      auditLog
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in promote-waitlist-players function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Internal server error',
        error: error.message,
        auditLog: [`ERROR: ${error.message}`]
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);

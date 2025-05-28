
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventDetailsTab } from "./EventDetailsTab";
import { PlayersList } from "./PlayersList";
import { PromotionValidationTest } from "./PromotionValidationTest";
import type { Database } from "@/integrations/supabase/types";

type Event = Database['public']['Tables']['events']['Row'];

interface EventDetailsTabsProps {
  event: Event;
  currentUserId?: string;
}

export const EventDetailsTabs = ({ event, currentUserId }: EventDetailsTabsProps) => {
  return (
    <div className="max-w-2xl mx-auto">
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="mt-0">
          <EventDetailsTab event={event} />
        </TabsContent>
        
        <TabsContent value="confirmed" className="mt-0">
          <PlayersList 
            eventId={event.id} 
            type="confirmed" 
            currentUserId={currentUserId}
          />
        </TabsContent>
        
        <TabsContent value="waitlist" className="mt-0">
          <PlayersList 
            eventId={event.id} 
            type="waitlist" 
            currentUserId={currentUserId}
          />
        </TabsContent>

        <TabsContent value="validation" className="mt-0">
          {currentUserId && (
            <PromotionValidationTest 
              eventId={event.id} 
              playerId={currentUserId}
            />
          )}
          {!currentUserId && (
            <div className="p-4 text-center text-gray-600">
              Login required to run validation tests
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

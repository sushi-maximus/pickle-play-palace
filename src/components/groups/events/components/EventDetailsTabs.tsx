
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventDetailsTab } from "./EventDetailsTab";
import { PlayersList } from "./PlayersList";
import type { Database } from "@/integrations/supabase/types";

type Event = Database['public']['Tables']['events']['Row'];

interface EventDetailsTabsProps {
  event: Event;
  currentUserId?: string;
}

export const EventDetailsTabs = ({ event, currentUserId }: EventDetailsTabsProps) => {
  return (
    <div className="max-w-2xl mx-auto">
      <Tabs defaultValue="details" className="bg-white">
        <TabsList className="grid w-full grid-cols-3 bg-gray-50 p-1 rounded-none border-b">
          <TabsTrigger 
            value="details" 
            className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary"
          >
            Details
          </TabsTrigger>
          <TabsTrigger 
            value="confirmed" 
            className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary"
          >
            Confirmed
          </TabsTrigger>
          <TabsTrigger 
            value="waitlist" 
            className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary"
          >
            Waitlist
          </TabsTrigger>
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
      </Tabs>
    </div>
  );
};

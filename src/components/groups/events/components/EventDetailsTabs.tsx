
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
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="players">Players</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="mt-0">
          <EventDetailsTab event={event} />
        </TabsContent>
        
        <TabsContent value="players" className="mt-0">
          <PlayersList 
            event={event} 
            currentUserId={currentUserId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

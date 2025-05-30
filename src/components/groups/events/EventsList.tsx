
import { TabbedEventsList } from "./TabbedEventsList";
import type { Database } from "@/integrations/supabase/types";

type Group = Database['public']['Tables']['groups']['Row'] & {
  member_count: number;
};

interface EventsListProps {
  groupId: string;
  isAdmin: boolean;
}

export const EventsList = ({ groupId, isAdmin }: EventsListProps) => {
  return <TabbedEventsList groupId={groupId} isAdmin={isAdmin} />;
};

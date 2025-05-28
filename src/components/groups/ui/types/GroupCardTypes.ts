
import type { Database } from "@/integrations/supabase/types";
import type { GroupMember } from "../../members/types";

// Unified Group type for all group card components
export type Group = Database['public']['Tables']['groups']['Row'] & {
  members?: GroupMember[];
  member_count: number;
};

// Unified props interface for all group card components
export interface GroupCardProps {
  group: Group;
  isAdmin?: boolean;
  className?: string;
}

// Optional props for hybrid components that may have additional features
export interface GroupCardHybridProps extends GroupCardProps {
  isMember?: boolean;
}


import { Database } from "@/integrations/supabase/types";

type Group = Database['public']['Tables']['groups']['Row'];

export interface UnifiedGroup extends Group {
  isMember: boolean;
  membershipRole?: string;
  membershipId?: string;
}

export interface UnifiedMembership {
  id: string;
  role: string;
  group: Group;
}

export interface UseUnifiedGroupsOptions {
  mode: 'all' | 'my-groups';
  searchTerm: string;
  userId?: string;
}

export interface UseUnifiedGroupsReturn {
  allGroups: UnifiedGroup[];
  filteredGroups: UnifiedGroup[];
  loading: boolean;
  refreshData: () => Promise<void>;
  // Legacy compatibility properties
  groups: UnifiedGroup[];
  memberships: UnifiedMembership[];
}

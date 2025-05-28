
import type { Group, UnifiedGroup, GroupMembership, Profile, UnifiedMembership } from "../../types/GroupTypes";

// Re-export main types
export type { Group, UnifiedGroup, GroupMembership, Profile, UnifiedMembership } from "../../types/GroupTypes";

// Hook configuration options with strict typing
export interface UseUnifiedGroupsOptions {
  mode: 'all' | 'my-groups';
  searchTerm: string;
  userId?: string;
}

// Hook return type with enhanced type safety
export interface UseUnifiedGroupsReturn {
  // Primary data
  allGroups: UnifiedGroup[];
  filteredGroups: UnifiedGroup[];
  loading: boolean;
  error: Error | null;
  
  // Actions
  refreshData: () => Promise<void>;
  refetch: () => void;
  
  // Legacy compatibility (deprecated but maintained)
  groups: UnifiedGroup[];
  memberships: UnifiedMembership[];
}

// Additional utility types for group operations
export interface GroupFilters {
  searchTerm?: string;
  isPrivate?: boolean;
  skillLevel?: string;
  location?: string;
  hasOpenSlots?: boolean;
}

export interface GroupSortOptions {
  field: 'name' | 'created_at' | 'member_count' | 'location';
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

export interface UseGroupFilteringOptions {
  groups: UnifiedGroup[];
  filters: GroupFilters;
  sortOptions?: GroupSortOptions;
  pagination?: PaginationOptions;
}

export interface UseGroupFilteringReturn {
  filteredGroups: UnifiedGroup[];
  totalCount: number;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
}

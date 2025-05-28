
import type { Group, UnifiedGroup, Profile } from "../../types/GroupTypes";
import type { GroupMember } from "../../members/types";

// Re-export the main types for backward compatibility
export type { Group, UnifiedGroup, Profile } from "../../types/GroupTypes";

// Updated props interfaces using strict types
export interface GroupCardProps {
  group: Group;
  isAdmin?: boolean;
  className?: string;
}

// Extended props for hybrid components with membership info
export interface GroupCardHybridProps extends GroupCardProps {
  isMember?: boolean;
  membershipRole?: 'admin' | 'member';
}

// Props for components that work with unified group data
export interface UnifiedGroupCardProps {
  group: UnifiedGroup;
  className?: string;
}

// Grid component props with enhanced type safety
export interface GroupsGridProps {
  groups: Group[];
  loading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  onGroupClick?: (group: Group) => void;
  onError?: (error: Error) => void;
}

export interface UnifiedGroupsGridProps {
  groups: UnifiedGroup[];
  loading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  onGroupClick?: (group: UnifiedGroup) => void;
  onError?: (error: Error) => void;
}


import type { GroupMember, Profile, Group } from "../types/GroupTypes";

// Re-export main types for backward compatibility
export type { GroupMember, Profile, Group } from "../types/GroupTypes";

// Component-specific interfaces
export interface GroupMemberCardProps {
  member: GroupMember;
  isAdmin?: boolean;
  currentUserId?: string;
  groupId: string;
  onMemberUpdate?: () => void;
  isOpen: boolean;
  onOpenChange: (memberId: string | null) => void;
  className?: string;
}

export interface GroupMembersListProps {
  groupId: string;
  members: GroupMember[];
  isAdmin?: boolean;
  currentUserId?: string;
  loading?: boolean;
  onMemberUpdate?: () => void;
  className?: string;
}

export interface MemberHoverCardProps {
  member: GroupMember;
  trigger?: React.ReactNode;
  isAdmin?: boolean;
  currentUserId?: string;
  groupId: string;
  onMemberUpdate?: () => void;
  onClose: () => void;
}

export interface RemoveMemberDialogProps {
  member: GroupMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  onMemberUpdate?: () => void;
}

// Hook interfaces
export interface UseGroupMembersOptions {
  groupId: string;
  includeProfiles?: boolean;
}

export interface UseGroupMembersReturn {
  members: GroupMember[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  addMember: (userId: string, role?: 'admin' | 'member') => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
  updateMemberRole: (memberId: string, role: 'admin' | 'member') => Promise<void>;
}

// Utility types for member operations
export interface MemberInvitation {
  email: string;
  role: 'admin' | 'member';
  message?: string;
}

export interface MembershipRequest {
  userId: string;
  groupId: string;
  message?: string;
}

export interface MembershipAction {
  type: 'approve' | 'reject' | 'remove' | 'promote' | 'demote';
  memberId: string;
  reason?: string;
}

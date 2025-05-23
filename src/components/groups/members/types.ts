
export type GroupMember = {
  id: string;
  role: "admin" | "member";
  joined_at: string;
  user_id: string;
  profiles: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
    skill_level?: string;
    dupr_rating?: number | null;
    birthday?: string | null;
  };
};

export type GroupMembersListProps = {
  members: GroupMember[];
  className?: string;
  isAdmin: boolean;
  currentUserId: string;
  groupId: string;
  onMemberUpdate?: () => void;
};

export type MemberHoverCardProps = {
  member: GroupMember;
  isAdmin: boolean;
  currentUserId: string;
  groupId: string;
  onMemberUpdate?: () => void;
  onClose: () => void;
};

export type RemoveMemberDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: GroupMember | null;
  groupId: string;
  onMemberUpdate?: () => void;
};

export type GroupMemberCardProps = {
  member: GroupMember;
  isAdmin: boolean;
  currentUserId: string;
  groupId: string;
  onMemberUpdate?: () => void;
  onOpenChange: (id: string | null) => void;
  isOpen: boolean;
};

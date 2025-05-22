
import { Database } from "@/integrations/supabase/types";

export type GroupMemberRole = 'admin' | 'member';
export type GroupMemberStatus = 'active' | 'inactive' | 'pending';

export interface Group {
  id: string;
  name: string;
  description: string | null;
  creator_id: string;
  created_at: string;
  updated_at: string;
  location: string | null;
  is_private: boolean;
  invite_code: string | null;
  avatar_url: string | null;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: GroupMemberRole;
  joined_at: string;
  status: GroupMemberStatus;
}

export interface GroupWithMemberCount extends Group {
  member_count: number;
}

export interface MemberWithProfile extends GroupMember {
  id: string;
  profile: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    skill_level: string | null;
    dupr_rating: number | null;
  };
}

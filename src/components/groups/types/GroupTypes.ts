
import type { Database } from "@/integrations/supabase/types";

// Base types from database - using Omit to avoid conflicts with optional fields
export type DatabaseGroup = Database['public']['Tables']['groups']['Row'];
export type DatabaseProfile = Database['public']['Tables']['profiles']['Row'];
export type DatabaseGroupMember = Database['public']['Tables']['group_members']['Row'];

// Enhanced Group type with strict validation - properly handling optional fields
export interface Group {
  // Required fields with validation
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  is_private: boolean;
  member_count: number;
  
  // Optional fields with proper null handling
  description?: string | null;
  location?: string | null;
  avatar_url?: string | null;
  max_members?: number | null;
  skill_level_min?: string | null;
  skill_level_max?: string | null;
  updated_at?: string | null;
  
  // Computed/joined fields
  members?: GroupMember[];
  currentUserMembership?: GroupMembership | null;
}

// Enhanced Profile type - properly handling optional fields
export interface Profile {
  // Required fields
  id: string;
  first_name: string;
  last_name: string;
  skill_level: string;
  gender: string;
  created_at: string;
  updated_at: string;
  
  // Optional fields
  avatar_url?: string | null;
  phone_number?: string | null;
  dupr_rating?: number | null;
  dupr_profile_link?: string | null;
  birthday?: string | null;
}

// Enhanced GroupMember type - properly handling optional fields
export interface GroupMember {
  // Required fields
  id: string;
  group_id: string;
  user_id: string;
  role: 'admin' | 'member';
  status: 'active' | 'pending' | 'banned';
  joined_at: string;
  
  // Optional fields
  request_message?: string | null;
  
  // Joined profile data - using 'profile' instead of 'profiles'
  profile?: Profile;
}

// Group membership from user perspective
export interface GroupMembership {
  id: string;
  role: 'admin' | 'member';
  status: 'active' | 'pending' | 'banned';
  group: Group;
  joined_at: string;
}

// Unified group type for components
export interface UnifiedGroup extends Group {
  isMember: boolean;
  membershipRole?: 'admin' | 'member';
  membershipId?: string;
  membershipStatus?: 'active' | 'pending' | 'banned';
}

// Unified membership type for backward compatibility
export interface UnifiedMembership {
  id: string;
  role: 'admin' | 'member';
  group: Group;
}

// Type guards for runtime validation
export const isValidGroup = (group: any): group is Group => {
  return (
    group &&
    typeof group === 'object' &&
    typeof group.id === 'string' &&
    group.id.length > 0 &&
    typeof group.name === 'string' &&
    group.name.length > 0 &&
    typeof group.created_by === 'string' &&
    typeof group.is_private === 'boolean' &&
    typeof group.member_count === 'number' &&
    group.member_count >= 0
  );
};

export const isValidProfile = (profile: any): profile is Profile => {
  return (
    profile &&
    typeof profile === 'object' &&
    typeof profile.id === 'string' &&
    profile.id.length > 0 &&
    typeof profile.first_name === 'string' &&
    profile.first_name.length > 0 &&
    typeof profile.last_name === 'string' &&
    profile.last_name.length > 0 &&
    typeof profile.skill_level === 'string' &&
    typeof profile.gender === 'string'
  );
};

export const isValidGroupMember = (member: any): member is GroupMember => {
  return (
    member &&
    typeof member === 'object' &&
    typeof member.id === 'string' &&
    typeof member.group_id === 'string' &&
    typeof member.user_id === 'string' &&
    ['admin', 'member'].includes(member.role) &&
    ['active', 'pending', 'banned'].includes(member.status)
  );
};

// Utility types for component props
export type GroupWithMembers = Group & {
  members: GroupMember[];
};

export type GroupCardData = Pick<Group, 'id' | 'name' | 'location' | 'is_private' | 'member_count' | 'avatar_url'>;

export type GroupListData = Group[];

// Error types for better error handling
export interface GroupValidationError {
  field: string;
  message: string;
  value?: any;
}

export class GroupDataError extends Error {
  public readonly errors: GroupValidationError[];
  
  constructor(message: string, errors: GroupValidationError[] = []) {
    super(message);
    this.name = 'GroupDataError';
    this.errors = errors;
  }
}

// Constants for validation
export const GROUP_CONSTRAINTS = {
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
  LOCATION_MAX_LENGTH: 100,
  MAX_MEMBERS_MIN: 2,
  MAX_MEMBERS_MAX: 1000,
} as const;

// Validation functions
export const validateGroupName = (name: string): GroupValidationError[] => {
  const errors: GroupValidationError[] = [];
  
  if (!name || typeof name !== 'string') {
    errors.push({ field: 'name', message: 'Group name is required', value: name });
  } else if (name.length < GROUP_CONSTRAINTS.NAME_MIN_LENGTH) {
    errors.push({ field: 'name', message: `Group name must be at least ${GROUP_CONSTRAINTS.NAME_MIN_LENGTH} characters`, value: name });
  } else if (name.length > GROUP_CONSTRAINTS.NAME_MAX_LENGTH) {
    errors.push({ field: 'name', message: `Group name must be no more than ${GROUP_CONSTRAINTS.NAME_MAX_LENGTH} characters`, value: name });
  }
  
  return errors;
};

export const validateGroupData = (group: Partial<Group>): GroupValidationError[] => {
  const errors: GroupValidationError[] = [];
  
  // Validate required fields
  if (!group.name) {
    errors.push(...validateGroupName(''));
  } else {
    errors.push(...validateGroupName(group.name));
  }
  
  // Validate optional fields if provided
  if (group.description && group.description.length > GROUP_CONSTRAINTS.DESCRIPTION_MAX_LENGTH) {
    errors.push({ field: 'description', message: `Description must be no more than ${GROUP_CONSTRAINTS.DESCRIPTION_MAX_LENGTH} characters`, value: group.description });
  }
  
  if (group.location && group.location.length > GROUP_CONSTRAINTS.LOCATION_MAX_LENGTH) {
    errors.push({ field: 'location', message: `Location must be no more than ${GROUP_CONSTRAINTS.LOCATION_MAX_LENGTH} characters`, value: group.location });
  }
  
  if (group.max_members !== undefined && group.max_members !== null) {
    if (group.max_members < GROUP_CONSTRAINTS.MAX_MEMBERS_MIN) {
      errors.push({ field: 'max_members', message: `Maximum members must be at least ${GROUP_CONSTRAINTS.MAX_MEMBERS_MIN}`, value: group.max_members });
    } else if (group.max_members > GROUP_CONSTRAINTS.MAX_MEMBERS_MAX) {
      errors.push({ field: 'max_members', message: `Maximum members cannot exceed ${GROUP_CONSTRAINTS.MAX_MEMBERS_MAX}`, value: group.max_members });
    }
  }
  
  return errors;
};

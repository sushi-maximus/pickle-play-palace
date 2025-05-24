
import { Database } from "@/integrations/supabase/types";

// Use proper database types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Post = Database['public']['Tables']['posts']['Row'];
export type Group = Database['public']['Tables']['groups']['Row'];

// Enhanced post with joined profile data
export interface GroupPost {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  group_id: string;
  user_id: string;
  media_urls?: string[] | null;
  pinned?: boolean | null;
  // Profile data joined from the profiles table
  profiles?: Profile | null;
  // Computed fields for reactions and comments
  reactions: Record<string, number>;
  comments_count: number;
  user_reactions: Record<string, boolean>;
}

export interface UseGroupPostsProps {
  groupId: string;
  userId?: string;
}

export interface UseGroupPostsResult {
  posts: GroupPost[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  groupName: string;
  refreshPosts: () => Promise<void>;
}

// User-related types for components
export interface PostUser {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string | null;
}

// Component prop types to ensure type safety
export interface PostCardProps {
  post: GroupPost;
  user?: Profile;
  currentUserId?: string;
}

export interface PostListProps {
  posts: GroupPost[];
  user?: Profile;
  currentUserId?: string;
}

export interface FeedProps {
  groupId: string;
  user?: Profile;
  onPostCreated?: () => void;
}

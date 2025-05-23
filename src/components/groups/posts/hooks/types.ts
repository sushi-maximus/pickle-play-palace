
import { PostReactionType } from "./types/reactionTypes";

export interface PostUser {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string | null;
}

export interface GroupPost {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  media_urls?: string[] | null;
  user: PostUser;
  reactions: Record<PostReactionType, number>;
  comments_count: number;
  user_reactions: Record<PostReactionType, boolean>;
}

export interface UseGroupPostsProps {
  groupId: string;
  userId?: string;
}

export interface UseGroupPostsResult {
  posts: GroupPost[];
  loading: boolean;
  error: string | null;
  groupName: string;
  refreshPosts: () => Promise<void>;
}

// Renamed types to avoid conflict with the PostReactions component
export interface PostReactionsData {
  like: number;
  thumbsup: number;
  thumbsdown: number;
}

export interface PostUserReactionsData {
  like: boolean;
  thumbsup: boolean;
  thumbsdown: boolean;
}

export interface PostReactionSubmittingData {
  like: boolean;
  thumbsup: boolean;
  thumbsdown: boolean;
}

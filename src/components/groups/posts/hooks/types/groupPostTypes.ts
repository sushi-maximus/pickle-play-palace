
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

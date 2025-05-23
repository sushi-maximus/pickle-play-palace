
import { ReactionType } from "../useCommentReactions";

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  post_id: string;
  user_id: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
  };
  reactions?: Record<ReactionType, number>;
  user_reactions?: Record<ReactionType, boolean>;
}

export interface UseCommentsResult {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  refreshComments: () => Promise<void>;
}

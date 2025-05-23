
import { PostUser } from "../types";

export type ReactionType = "thumbsup" | "thumbsdown";

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  post_id: string;
  user_id: string;
  user: PostUser;
  reactions?: Record<ReactionType, number>;
  user_reactions?: Record<ReactionType, boolean>;
}

export interface UseCommentsResult {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  refreshComments: () => Promise<void>;
  addOptimisticComment: (newComment: Partial<Comment>) => string;
  updateOptimisticComment: (id: string, content: string) => void;
  removeOptimisticComment: (id: string) => void;
}

export interface OptimisticComment extends Partial<Comment> {
  isOptimistic?: boolean;
  tempId?: string;
}

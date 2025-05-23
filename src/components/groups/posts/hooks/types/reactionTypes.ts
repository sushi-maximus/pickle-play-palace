
export type PostReactionType = "like" | "thumbsup" | "thumbsdown";

export interface UsePostReactionsProps {
  postId: string;
  userId?: string;
  initialReactions?: Record<PostReactionType, number>;
  initialUserReactions?: Record<PostReactionType, boolean>;
}

export interface UsePostReactionsResult {
  reactions: Record<PostReactionType, number>;
  userReactions: Record<PostReactionType, boolean>;
  isSubmitting: Record<PostReactionType, boolean>;
  toggleReaction: (reactionType: PostReactionType) => Promise<void>;
}

// Rename these types to avoid naming conflicts
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

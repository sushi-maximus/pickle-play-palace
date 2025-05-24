
export type CommentReactionType2 = "thumbsup" | "thumbsdown";

export interface UseCommentReactions2Props {
  commentId: string;
  userId?: string;
  initialThumbsUp: number;
  initialThumbsDown: number;
  initialUserThumbsUp: boolean;
  initialUserThumbsDown: boolean;
}

export interface CommentReactionState {
  thumbsUpCount: number;
  thumbsDownCount: number;
  isThumbsUpActive: boolean;
  isThumbsDownActive: boolean;
  isThumbsUpSubmitting: boolean;
  isThumbsDownSubmitting: boolean;
}

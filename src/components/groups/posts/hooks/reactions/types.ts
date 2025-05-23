
export type PostReactionType2 = "thumbsup" | "thumbsdown" | "heart";

export interface UsePostReactions2Props {
  postId: string;
  userId?: string;
  initialThumbsUp: number;
  initialThumbsDown: number;
  initialHeart: number;
  initialUserThumbsUp: boolean;
  initialUserThumbsDown: boolean;
  initialUserHeart: boolean;
}

export interface ReactionState {
  thumbsUpCount: number;
  thumbsDownCount: number;
  heartCount: number;
  isThumbsUpActive: boolean;
  isThumbsDownActive: boolean;
  isHeartActive: boolean;
  isThumbsUpSubmitting: boolean;
  isThumbsDownSubmitting: boolean;
  isHeartSubmitting: boolean;
}


import { useEffect } from "react";
import { useThumbsUpReaction2 } from "./reactions/useThumbsUpReaction2";
import { useThumbsDownReaction2 } from "./reactions/useThumbsDownReaction2";
import { useHeartReaction2 } from "./reactions/useHeartReaction2";
import { UsePostReactions2Props, PostReactionType2 } from "./reactions/types";

export type { PostReactionType2 };

export const usePostReactions2 = ({
  postId,
  userId,
  initialThumbsUp,
  initialThumbsDown,
  initialHeart,
  initialUserThumbsUp,
  initialUserThumbsDown,
  initialUserHeart
}: UsePostReactions2Props) => {
  // Debug logging for initial values
  console.log(`Post ${postId} initial values:`, {
    initialThumbsUp,
    initialThumbsDown,
    initialHeart,
    initialUserThumbsUp,
    initialUserThumbsDown,
    initialUserHeart
  });

  // Individual reaction hooks - completely independent
  const {
    thumbsUpCount,
    isThumbsUpActive,
    isThumbsUpSubmitting,
    toggleThumbsUp
  } = useThumbsUpReaction2({
    postId,
    userId,
    initialCount: initialThumbsUp,
    initialIsActive: initialUserThumbsUp
  });

  const {
    thumbsDownCount,
    isThumbsDownActive,
    isThumbsDownSubmitting,
    toggleThumbsDown
  } = useThumbsDownReaction2({
    postId,
    userId,
    initialCount: initialThumbsDown,
    initialIsActive: initialUserThumbsDown
  });

  const {
    heartCount,
    isHeartActive,
    isHeartSubmitting,
    toggleHeart
  } = useHeartReaction2({
    postId,
    userId,
    initialCount: initialHeart,
    initialIsActive: initialUserHeart
  });

  return {
    thumbsUpCount,
    thumbsDownCount,
    heartCount,
    isThumbsUpActive,
    isThumbsDownActive,
    isHeartActive,
    isThumbsUpSubmitting,
    isThumbsDownSubmitting,
    isHeartSubmitting,
    toggleThumbsUp,
    toggleThumbsDown,
    toggleHeart
  };
};

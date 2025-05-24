
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

  // Individual reaction hooks
  const {
    thumbsUpCount,
    isThumbsUpActive,
    isThumbsUpSubmitting,
    toggleThumbsUp,
    deactivateThumbsUp
  } = useThumbsUpReaction2({
    postId,
    userId,
    initialCount: initialThumbsUp,
    initialIsActive: initialUserThumbsUp,
    onThumbsDownDeactivate: () => {
      // This will be called when thumbs up is activated
      deactivateThumbsDown();
    }
  });

  const {
    thumbsDownCount,
    isThumbsDownActive,
    isThumbsDownSubmitting,
    toggleThumbsDown,
    deactivateThumbsDown
  } = useThumbsDownReaction2({
    postId,
    userId,
    initialCount: initialThumbsDown,
    initialIsActive: initialUserThumbsDown,
    onThumbsUpDeactivate: () => {
      // This will be called when thumbs down is activated
      deactivateThumbsUp();
    }
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

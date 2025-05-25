
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
  // Individual reaction hooks - completely independent
  const thumbsUpHook = useThumbsUpReaction2({
    postId,
    userId,
    initialCount: initialThumbsUp,
    initialIsActive: initialUserThumbsUp
  });

  const thumbsDownHook = useThumbsDownReaction2({
    postId,
    userId,
    initialCount: initialThumbsDown,
    initialIsActive: initialUserThumbsDown
  });

  const heartHook = useHeartReaction2({
    postId,
    userId,
    initialCount: initialHeart,
    initialIsActive: initialUserHeart
  });

  return {
    thumbsUpCount: thumbsUpHook.thumbsUpCount,
    thumbsDownCount: thumbsDownHook.thumbsDownCount,
    heartCount: heartHook.heartCount,
    isThumbsUpActive: thumbsUpHook.isThumbsUpActive,
    isThumbsDownActive: thumbsDownHook.isThumbsDownActive,
    isHeartActive: heartHook.isHeartActive,
    isThumbsUpSubmitting: thumbsUpHook.isThumbsUpSubmitting,
    isThumbsDownSubmitting: thumbsDownHook.isThumbsDownSubmitting,
    isHeartSubmitting: heartHook.isHeartSubmitting,
    toggleThumbsUp: thumbsUpHook.toggleThumbsUp,
    toggleThumbsDown: thumbsDownHook.toggleThumbsDown,
    toggleHeart: heartHook.toggleHeart
  };
};

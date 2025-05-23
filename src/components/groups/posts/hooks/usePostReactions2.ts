
import { useThumbsUpReaction } from "./reactions/useThumbsUpReaction";
import { useThumbsDownReaction } from "./reactions/useThumbsDownReaction";
import { useHeartReaction } from "./reactions/useHeartReaction";
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
  // Thumbs up reaction
  const {
    thumbsUpCount,
    isThumbsUpActive,
    isThumbsUpSubmitting,
    toggleThumbsUp,
    setThumbsUpCount,
    setIsThumbsUpActive
  } = useThumbsUpReaction({
    postId,
    userId,
    initialCount: initialThumbsUp,
    initialIsActive: initialUserThumbsUp,
    isThumbsDownActive: false, // Will be set below
    thumbsDownCount: 0, // Will be set below
    setIsThumbsDownActive: () => {}, // Will be set below
    setThumbsDownCount: () => {} // Will be set below
  });

  // Thumbs down reaction
  const {
    thumbsDownCount,
    isThumbsDownActive,
    isThumbsDownSubmitting,
    toggleThumbsDown,
    setThumbsDownCount,
    setIsThumbsDownActive
  } = useThumbsDownReaction({
    postId,
    userId,
    initialCount: initialThumbsDown,
    initialIsActive: initialUserThumbsDown,
    isThumbsUpActive,
    thumbsUpCount,
    setIsThumbsUpActive,
    setThumbsUpCount
  });

  // Update thumbs up with thumbs down dependencies
  const thumbsUpReaction = useThumbsUpReaction({
    postId,
    userId,
    initialCount: initialThumbsUp,
    initialIsActive: initialUserThumbsUp,
    isThumbsDownActive,
    thumbsDownCount,
    setIsThumbsDownActive,
    setThumbsDownCount
  });

  // Heart reaction
  const {
    heartCount,
    isHeartActive,
    isHeartSubmitting,
    toggleHeart
  } = useHeartReaction({
    postId,
    userId,
    initialCount: initialHeart,
    initialIsActive: initialUserHeart,
    isThumbsUpActive,
    isThumbsDownActive,
    thumbsUpCount,
    thumbsDownCount,
    setIsThumbsUpActive,
    setIsThumbsDownActive,
    setThumbsUpCount,
    setThumbsDownCount
  });

  // Check if any reaction is currently being submitted
  const isAnySubmitting = isThumbsUpSubmitting || isThumbsDownSubmitting || isHeartSubmitting;

  // Wrapper functions that check for concurrent submissions
  const handleToggleThumbsUp = async () => {
    if (isAnySubmitting) return;
    await thumbsUpReaction.toggleThumbsUp();
  };

  const handleToggleThumbsDown = async () => {
    if (isAnySubmitting) return;
    await toggleThumbsDown();
  };

  const handleToggleHeart = async () => {
    if (isAnySubmitting) return;
    await toggleHeart();
  };

  return {
    thumbsUpCount: thumbsUpReaction.thumbsUpCount,
    thumbsDownCount,
    heartCount,
    isThumbsUpActive: thumbsUpReaction.isThumbsUpActive,
    isThumbsDownActive,
    isHeartActive,
    isThumbsUpSubmitting: thumbsUpReaction.isThumbsUpSubmitting,
    isThumbsDownSubmitting,
    isHeartSubmitting,
    toggleThumbsUp: handleToggleThumbsUp,
    toggleThumbsDown: handleToggleThumbsDown,
    toggleHeart: handleToggleHeart
  };
};

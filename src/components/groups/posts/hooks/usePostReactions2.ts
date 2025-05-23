
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
  const thumbsUpReaction = useThumbsUpReaction({
    postId,
    userId,
    initialCount: initialThumbsUp,
    initialIsActive: initialUserThumbsUp,
    isThumbsDownActive: false, // Will be updated below
    thumbsDownCount: 0, // Will be updated below
    setIsThumbsDownActive: () => {}, // Will be updated below
    setThumbsDownCount: () => {} // Will be updated below
  });

  // Thumbs down reaction
  const thumbsDownReaction = useThumbsDownReaction({
    postId,
    userId,
    initialCount: initialThumbsDown,
    initialIsActive: initialUserThumbsDown,
    isThumbsUpActive: thumbsUpReaction.isThumbsUpActive,
    thumbsUpCount: thumbsUpReaction.thumbsUpCount,
    setIsThumbsUpActive: thumbsUpReaction.setIsThumbsUpActive,
    setThumbsUpCount: thumbsUpReaction.setThumbsUpCount
  });

  // Update thumbs up with thumbs down dependencies - we need to create a new instance
  const finalThumbsUpReaction = useThumbsUpReaction({
    postId,
    userId,
    initialCount: initialThumbsUp,
    initialIsActive: initialUserThumbsUp,
    isThumbsDownActive: thumbsDownReaction.isThumbsDownActive,
    thumbsDownCount: thumbsDownReaction.thumbsDownCount,
    setIsThumbsDownActive: thumbsDownReaction.setIsThumbsDownActive,
    setThumbsDownCount: thumbsDownReaction.setThumbsDownCount
  });

  // Heart reaction
  const heartReaction = useHeartReaction({
    postId,
    userId,
    initialCount: initialHeart,
    initialIsActive: initialUserHeart,
    isThumbsUpActive: finalThumbsUpReaction.isThumbsUpActive,
    isThumbsDownActive: thumbsDownReaction.isThumbsDownActive,
    thumbsUpCount: finalThumbsUpReaction.thumbsUpCount,
    thumbsDownCount: thumbsDownReaction.thumbsDownCount,
    setIsThumbsUpActive: finalThumbsUpReaction.setIsThumbsUpActive,
    setIsThumbsDownActive: thumbsDownReaction.setIsThumbsDownActive,
    setThumbsUpCount: finalThumbsUpReaction.setThumbsUpCount,
    setThumbsDownCount: thumbsDownReaction.setThumbsDownCount
  });

  // Check if any reaction is currently being submitted
  const isAnySubmitting = finalThumbsUpReaction.isThumbsUpSubmitting || thumbsDownReaction.isThumbsDownSubmitting || heartReaction.isHeartSubmitting;

  // Wrapper functions that check for concurrent submissions
  const handleToggleThumbsUp = async () => {
    if (isAnySubmitting) return;
    await finalThumbsUpReaction.toggleThumbsUp();
  };

  const handleToggleThumbsDown = async () => {
    if (isAnySubmitting) return;
    await thumbsDownReaction.toggleThumbsDown();
  };

  const handleToggleHeart = async () => {
    if (isAnySubmitting) return;
    await heartReaction.toggleHeart();
  };

  return {
    thumbsUpCount: finalThumbsUpReaction.thumbsUpCount,
    thumbsDownCount: thumbsDownReaction.thumbsDownCount,
    heartCount: heartReaction.heartCount,
    isThumbsUpActive: finalThumbsUpReaction.isThumbsUpActive,
    isThumbsDownActive: thumbsDownReaction.isThumbsDownActive,
    isHeartActive: heartReaction.isHeartActive,
    isThumbsUpSubmitting: finalThumbsUpReaction.isThumbsUpSubmitting,
    isThumbsDownSubmitting: thumbsDownReaction.isThumbsDownSubmitting,
    isHeartSubmitting: heartReaction.isHeartSubmitting,
    toggleThumbsUp: handleToggleThumbsUp,
    toggleThumbsDown: handleToggleThumbsDown,
    toggleHeart: handleToggleHeart
  };
};


import { useCommentThumbsUp2 } from "./reactions/useCommentThumbsUp2";
import { useCommentThumbsDown2 } from "./reactions/useCommentThumbsDown2";
import { UseCommentReactions2Props, CommentReactionType2 } from "./reactions/commentReactionTypes";

export type { CommentReactionType2 };

export const useCommentReactions2 = ({
  commentId,
  userId,
  initialThumbsUp,
  initialThumbsDown,
  initialUserThumbsUp,
  initialUserThumbsDown
}: UseCommentReactions2Props) => {
  // Use the individual hooks
  const thumbsUpHook = useCommentThumbsUp2({
    commentId,
    userId,
    initialCount: initialThumbsUp,
    initialIsActive: initialUserThumbsUp,
    isThumbsDownActive: false, // Will be updated below
    setIsThumbsDownActive: () => {}, // Will be updated below
    setThumbsDownCount: () => {} // Will be updated below
  });

  const thumbsDownHook = useCommentThumbsDown2({
    commentId,
    userId,
    initialCount: initialThumbsDown,
    initialIsActive: initialUserThumbsDown,
    isThumbsUpActive: thumbsUpHook.isThumbsUpActive,
    setIsThumbsUpActive: thumbsUpHook.setIsThumbsUpActive,
    setThumbsUpCount: thumbsUpHook.setThumbsUpCount
  });

  // Update thumbs up hook with thumbs down dependencies
  const thumbsUpHookWithDeps = useCommentThumbsUp2({
    commentId,
    userId,
    initialCount: initialThumbsUp,
    initialIsActive: initialUserThumbsUp,
    isThumbsDownActive: thumbsDownHook.isThumbsDownActive,
    setIsThumbsDownActive: thumbsDownHook.setIsThumbsDownActive,
    setThumbsDownCount: thumbsDownHook.setThumbsDownCount
  });

  return {
    thumbsUpCount: thumbsUpHookWithDeps.thumbsUpCount,
    thumbsDownCount: thumbsDownHook.thumbsDownCount,
    isThumbsUpActive: thumbsUpHookWithDeps.isThumbsUpActive,
    isThumbsDownActive: thumbsDownHook.isThumbsDownActive,
    isThumbsUpSubmitting: thumbsUpHookWithDeps.isThumbsUpSubmitting,
    isThumbsDownSubmitting: thumbsDownHook.isThumbsDownSubmitting,
    toggleThumbsUp: thumbsUpHookWithDeps.toggleThumbsUp,
    toggleThumbsDown: thumbsDownHook.toggleThumbsDown
  };
};

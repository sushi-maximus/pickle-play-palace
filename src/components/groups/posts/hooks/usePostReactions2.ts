
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
  // CRITICAL DEBUG - Log initial values with timestamp and navigation context
  console.log(`🚀 === POST REACTIONS HOOK INITIALIZED FOR POST ${postId} ===`);
  console.log(`🕐 Hook initialization timestamp: ${new Date().toISOString()}`);
  console.log(`📍 Current URL: ${window.location.pathname}`);
  console.log(`Initial values received:`, {
    postId,
    userId,
    initialThumbsUp,
    initialThumbsDown,
    initialHeart,
    initialUserThumbsUp,
    initialUserThumbsDown,
    initialUserHeart
  });
  
  // CRITICAL DEBUG - Special logging for post 543
  if (postId.includes('543')) {
    console.log(`🎯 === POST 543 REACTIONS HOOK INITIALIZATION ===`);
    console.log(`Post 543 heart initial state:`, {
      initialHeart,
      initialUserHeart,
      timestamp: new Date().toISOString(),
      url: window.location.pathname
    });
  }

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

  // CRITICAL DEBUG - Log what we're returning
  const returnValues = {
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

  console.log(`📤 POST REACTIONS HOOK RETURNING for ${postId}:`, {
    heartCount: returnValues.heartCount,
    isHeartActive: returnValues.isHeartActive,
    timestamp: new Date().toISOString()
  });

  // CRITICAL DEBUG - Special logging for post 543 return values
  if (postId.includes('543')) {
    console.log(`🎯 === POST 543 REACTIONS HOOK RETURNING ===`);
    console.log(`Post 543 final heart state:`, {
      heartCount: returnValues.heartCount,
      isHeartActive: returnValues.isHeartActive,
      timestamp: new Date().toISOString(),
      url: window.location.pathname
    });
  }

  return returnValues;
};

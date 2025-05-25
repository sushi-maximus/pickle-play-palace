
import { useState, useMemo, memo, useCallback } from "react";
import { MobilePostActions } from "./MobilePostActions";
import { CommentsSection2 } from "../../posts/post-card/CommentsSection2";
import type { PostReactionCounts, PostReactionHandlers } from "../types/postTypes";
import type { Profile } from "../../posts/hooks/types/groupPostTypes";

interface PostInteractionsProps extends PostReactionCounts, PostReactionHandlers {
  postId: string;
  currentUserId?: string;
  user?: Profile | null;
  commentsCount: number;
}

const PostInteractionsComponent = ({
  postId,
  currentUserId,
  user,
  commentsCount,
  thumbsUpCount,
  thumbsDownCount,
  heartCount,
  isThumbsUpActive,
  isThumbsDownActive,
  isHeartActive,
  isThumbsUpSubmitting,
  isThumbsDownSubmitting,
  isHeartSubmitting,
  onThumbsUpClick,
  onThumbsDownClick,
  onHeartClick
}: PostInteractionsProps) => {
  const [showComments, setShowComments] = useState(false);

  // Use useCallback for toggle function to ensure stable reference
  const handleToggleComments = useCallback(() => {
    setShowComments(prev => !prev);
  }, []);

  // Memoize user object more specifically to prevent unnecessary re-renders
  const memoizedUser = useMemo(() => {
    if (!user) return null;
    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      avatar_url: user.avatar_url
    };
  }, [user?.id, user?.first_name, user?.last_name, user?.avatar_url]);

  // Memoize the MobilePostActions props to prevent object recreation
  const postActionsProps = useMemo(() => ({
    thumbsUpCount,
    thumbsDownCount,
    heartCount,
    isThumbsUpActive,
    isThumbsDownActive,
    isHeartActive,
    isThumbsUpSubmitting,
    isThumbsDownSubmitting,
    isHeartSubmitting,
    onThumbsUpClick,
    onThumbsDownClick,
    onHeartClick,
    showComments,
    onToggleComments: handleToggleComments,
    currentUserId,
    commentsCount
  }), [
    thumbsUpCount,
    thumbsDownCount,
    heartCount,
    isThumbsUpActive,
    isThumbsDownActive,
    isHeartActive,
    isThumbsUpSubmitting,
    isThumbsDownSubmitting,
    isHeartSubmitting,
    onThumbsUpClick,
    onThumbsDownClick,
    onHeartClick,
    showComments,
    handleToggleComments,
    currentUserId,
    commentsCount
  ]);

  return (
    <>
      <MobilePostActions {...postActionsProps} />

      {showComments && (
        <CommentsSection2
          postId={postId}
          currentUserId={currentUserId}
          user={memoizedUser}
        />
      )}
    </>
  );
};

// Enhanced memoization with better performance checks
export const PostInteractions = memo(PostInteractionsComponent, (prevProps, nextProps) => {
  // Check counts and states (most likely to change)
  if (
    prevProps.thumbsUpCount !== nextProps.thumbsUpCount ||
    prevProps.thumbsDownCount !== nextProps.thumbsDownCount ||
    prevProps.heartCount !== nextProps.heartCount ||
    prevProps.commentsCount !== nextProps.commentsCount
  ) {
    return false;
  }

  // Check active states
  if (
    prevProps.isThumbsUpActive !== nextProps.isThumbsUpActive ||
    prevProps.isThumbsDownActive !== nextProps.isThumbsDownActive ||
    prevProps.isHeartActive !== nextProps.isHeartActive
  ) {
    return false;
  }

  // Check submitting states
  if (
    prevProps.isThumbsUpSubmitting !== nextProps.isThumbsUpSubmitting ||
    prevProps.isThumbsDownSubmitting !== nextProps.isThumbsDownSubmitting ||
    prevProps.isHeartSubmitting !== nextProps.isHeartSubmitting
  ) {
    return false;
  }

  // Check IDs (lightweight comparison)
  if (
    prevProps.postId !== nextProps.postId ||
    prevProps.currentUserId !== nextProps.currentUserId ||
    prevProps.user?.id !== nextProps.user?.id
  ) {
    return false;
  }

  // All checks passed
  return true;
});

PostInteractionsComponent.displayName = "PostInteractions";

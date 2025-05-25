
import { useState, useMemo, memo } from "react";
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

  // Memoize the toggle function to prevent recreation
  const handleToggleComments = useMemo(() => () => {
    setShowComments(prev => !prev);
  }, []);

  // Memoize user object to prevent unnecessary re-renders in CommentsSection2
  const memoizedUser = useMemo(() => user, [user?.id, user?.first_name, user?.last_name, user?.avatar_url]);

  return (
    <>
      <MobilePostActions
        thumbsUpCount={thumbsUpCount}
        thumbsDownCount={thumbsDownCount}
        heartCount={heartCount}
        isThumbsUpActive={isThumbsUpActive}
        isThumbsDownActive={isThumbsDownActive}
        isHeartActive={isHeartActive}
        isThumbsUpSubmitting={isThumbsUpSubmitting}
        isThumbsDownSubmitting={isThumbsDownSubmitting}
        isHeartSubmitting={isHeartSubmitting}
        onThumbsUpClick={onThumbsUpClick}
        onThumbsDownClick={onThumbsDownClick}
        onHeartClick={onHeartClick}
        showComments={showComments}
        onToggleComments={handleToggleComments}
        currentUserId={currentUserId}
        commentsCount={commentsCount}
      />

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

// Memoize the component to prevent unnecessary re-renders
export const PostInteractions = memo(PostInteractionsComponent, (prevProps, nextProps) => {
  return (
    prevProps.postId === nextProps.postId &&
    prevProps.currentUserId === nextProps.currentUserId &&
    prevProps.user?.id === nextProps.user?.id &&
    prevProps.commentsCount === nextProps.commentsCount &&
    prevProps.thumbsUpCount === nextProps.thumbsUpCount &&
    prevProps.thumbsDownCount === nextProps.thumbsDownCount &&
    prevProps.heartCount === nextProps.heartCount &&
    prevProps.isThumbsUpActive === nextProps.isThumbsUpActive &&
    prevProps.isThumbsDownActive === nextProps.isThumbsDownActive &&
    prevProps.isHeartActive === nextProps.isHeartActive &&
    prevProps.isThumbsUpSubmitting === nextProps.isThumbsUpSubmitting &&
    prevProps.isThumbsDownSubmitting === nextProps.isThumbsDownSubmitting &&
    prevProps.isHeartSubmitting === nextProps.isHeartSubmitting
  );
});

PostInteractionsComponent.displayName = "PostInteractions";


import { useState } from "react";
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

export const PostInteractions = ({
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
        onToggleComments={() => setShowComments(!showComments)}
        currentUserId={currentUserId}
        commentsCount={commentsCount}
      />

      {showComments && (
        <CommentsSection2
          postId={postId}
          currentUserId={currentUserId}
          user={user}
        />
      )}
    </>
  );
};

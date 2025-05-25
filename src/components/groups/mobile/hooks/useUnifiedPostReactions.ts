
import { usePostReactions2 } from "../../posts/hooks/usePostReactions2";
import type { PostData } from "../types/postTypes";
import type { Profile } from "../../posts/hooks/types/groupPostTypes";

interface UseUnifiedPostReactionsProps {
  post: PostData;
  user?: Profile | null;
}

export const useUnifiedPostReactions = ({ post, user }: UseUnifiedPostReactionsProps) => {
  const hookParams = {
    postId: post.id,
    userId: user?.id,
    initialThumbsUp: post.thumbsup_count || 0,
    initialThumbsDown: post.thumbsdown_count || 0,
    initialHeart: post.heart_count || 0,
    initialUserThumbsUp: post.user_thumbsup || false,
    initialUserThumbsDown: post.user_thumbsdown || false,
    initialUserHeart: post.user_heart || false
  };

  const reactions = usePostReactions2(hookParams);

  const handleHeartClick = () => {
    if (!user?.id || reactions.isHeartSubmitting) {
      return;
    }
    reactions.toggleHeart();
  };

  return {
    ...reactions,
    handleHeartClick,
    isDisabled: !user?.id
  };
};

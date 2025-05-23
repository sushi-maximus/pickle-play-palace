
import { ThumbsUp2 } from "./ThumbsUp2";
import { ThumbsDown2 } from "./ThumbsDown2";
import { PostHeart2 } from "./PostHeart2";

interface PostReactions2Props {
  thumbsUpCount: number;
  thumbsDownCount: number;
  heartCount: number;
  isThumbsUpActive: boolean;
  isThumbsDownActive: boolean;
  isHeartActive: boolean;
  isThumbsUpSubmitting: boolean;
  isThumbsDownSubmitting: boolean;
  isHeartSubmitting: boolean;
  onThumbsUpClick: () => void;
  onThumbsDownClick: () => void;
  onHeartClick: () => void;
  disabled?: boolean;
}

export const PostReactions2 = ({
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
  disabled = false
}: PostReactions2Props) => {
  return (
    <div className="flex items-center gap-2 md:gap-3">
      <ThumbsUp2
        count={thumbsUpCount}
        isActive={isThumbsUpActive}
        isSubmitting={isThumbsUpSubmitting}
        onClick={onThumbsUpClick}
        disabled={disabled}
      />
      <ThumbsDown2
        count={thumbsDownCount}
        isActive={isThumbsDownActive}
        isSubmitting={isThumbsDownSubmitting}
        onClick={onThumbsDownClick}
        disabled={disabled}
      />
      <PostHeart2
        count={heartCount}
        isActive={isHeartActive}
        isSubmitting={isHeartSubmitting}
        onClick={onHeartClick}
        disabled={disabled}
      />
    </div>
  );
};


import { ThumbsUp2 } from "./ThumbsUp2";
import { ThumbsDown2 } from "./ThumbsDown2";

interface PostReactions2Props {
  thumbsUpCount: number;
  thumbsDownCount: number;
  isThumbsUpActive: boolean;
  isThumbsDownActive: boolean;
  isThumbsUpSubmitting: boolean;
  isThumbsDownSubmitting: boolean;
  onThumbsUpClick: () => void;
  onThumbsDownClick: () => void;
  disabled?: boolean;
}

export const PostReactions2 = ({
  thumbsUpCount,
  thumbsDownCount,
  isThumbsUpActive,
  isThumbsDownActive,
  isThumbsUpSubmitting,
  isThumbsDownSubmitting,
  onThumbsUpClick,
  onThumbsDownClick,
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
    </div>
  );
};

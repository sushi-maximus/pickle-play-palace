
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
  onHeartClick
}: PostReactions2Props) => {
  return (
    <div className="flex items-center gap-2 md:gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50/30">
      <div className="flex items-center gap-1 md:gap-2">
        <ThumbsUp2
          count={thumbsUpCount}
          isActive={isThumbsUpActive}
          isSubmitting={isThumbsUpSubmitting}
          onClick={onThumbsUpClick}
        />
        
        <ThumbsDown2
          count={thumbsDownCount}
          isActive={isThumbsDownActive}
          isSubmitting={isThumbsDownSubmitting}
          onClick={onThumbsDownClick}
        />
      </div>
      
      <div className="flex items-center">
        <PostHeart2
          count={heartCount}
          isActive={isHeartActive}
          isSubmitting={isHeartSubmitting}
          onClick={onHeartClick}
        />
      </div>
    </div>
  );
};

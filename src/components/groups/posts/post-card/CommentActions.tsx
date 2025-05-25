
import { CommentThumbsUp2 } from "./CommentThumbsUp2";
import { CommentThumbsDown2 } from "./CommentThumbsDown2";

interface CommentActionsProps {
  thumbsUpCount: number;
  thumbsDownCount: number;
  isThumbsUpActive: boolean;
  isThumbsDownActive: boolean;
  isThumbsUpSubmitting: boolean;
  isThumbsDownSubmitting: boolean;
  toggleThumbsUp: () => void;
  toggleThumbsDown: () => void;
  currentUserId?: string;
}

export const CommentActions = ({
  thumbsUpCount,
  thumbsDownCount,
  isThumbsUpActive,
  isThumbsDownActive,
  isThumbsUpSubmitting,
  isThumbsDownSubmitting,
  toggleThumbsUp,
  toggleThumbsDown,
  currentUserId
}: CommentActionsProps) => {
  return (
    <div className="flex items-center gap-2 md:gap-3 pt-1">
      <CommentThumbsUp2
        count={thumbsUpCount}
        isActive={isThumbsUpActive}
        isSubmitting={isThumbsUpSubmitting}
        onClick={toggleThumbsUp}
        disabled={!currentUserId}
      />
      <CommentThumbsDown2
        count={thumbsDownCount}
        isActive={isThumbsDownActive}
        isSubmitting={isThumbsDownSubmitting}
        onClick={toggleThumbsDown}
        disabled={!currentUserId}
      />
    </div>
  );
};

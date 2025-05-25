
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { PostReactions2 } from "../../posts/post-card/PostReactions2";

interface MobilePostActionsProps {
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
  showComments: boolean;
  onToggleComments: () => void;
  currentUserId?: string;
  commentsCount?: number;
}

export const MobilePostActions = ({
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
  onToggleComments,
  currentUserId,
  commentsCount = 0
}: MobilePostActionsProps) => {
  const getCommentsText = () => {
    if (commentsCount === 0) {
      return showComments ? 'Hide comments' : 'Comment';
    } else if (commentsCount === 1) {
      return showComments ? 'Hide comments' : '1 comment';
    } else {
      return showComments ? 'Hide comments' : `${commentsCount} comments`;
    }
  };

  return (
    <div className="flex items-center px-3 md:px-4 py-2 md:py-3 border-t border-gray-100">
      <div className="flex items-center gap-1 md:gap-3 flex-1">
        <PostReactions2
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
        />
        
        <Button
          variant="ghost"
          size="sm"
          className="min-h-[48px] px-3 md:h-9 md:px-4 flex items-center gap-1 md:gap-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 touch-manipulation"
          onClick={onToggleComments}
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-sm font-medium">
            {getCommentsText()}
          </span>
        </Button>
      </div>
    </div>
  );
};

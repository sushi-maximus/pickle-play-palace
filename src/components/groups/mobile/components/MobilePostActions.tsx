
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { PostReactions2 } from "../../posts/post-card/PostReactions2";
import { useDebounce } from "@/hooks/useDebounce";
import { useTouchFeedback } from "@/hooks/useTouchFeedback";

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
  const debouncedToggleComments = useDebounce(onToggleComments, { delay: 200, leading: true });
  const { isPressed, touchProps } = useTouchFeedback({ feedbackDuration: 100 });

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
    <div className="flex items-center justify-between px-6 py-5 border-t border-gray-100 bg-gray-50/30">
      <div className="flex items-center gap-3">
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
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        className={`min-h-[52px] px-5 py-3 flex items-center gap-2.5 text-gray-600 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 touch-manipulation active:scale-95 rounded-lg ${
          isPressed ? 'scale-95 bg-opacity-80' : ''
        }`}
        onClick={debouncedToggleComments}
        {...touchProps}
      >
        <MessageCircle className="h-5 w-5" />
        <span className="text-sm font-medium whitespace-nowrap">
          {getCommentsText()}
        </span>
      </Button>
    </div>
  );
};

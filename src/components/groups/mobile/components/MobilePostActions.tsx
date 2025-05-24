
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
  currentUserId
}: MobilePostActionsProps) => {
  return (
    <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-3 border-t border-gray-100">
      <div className="flex-1">
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
          disabled={!currentUserId}
        />
      </div>
      
      <div className="flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-auto px-2 md:h-9 md:px-3 flex items-center gap-1 md:gap-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50"
          onClick={onToggleComments}
        >
          <MessageCircle className="h-3 w-3 md:h-4 md:w-4" />
          <span className="text-xs md:text-sm font-medium">
            {showComments ? 'Hide' : 'Comments'}
          </span>
        </Button>
      </div>
    </div>
  );
};

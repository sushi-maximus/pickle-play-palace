
import { Button } from "@/components/ui/button";
import { Heart, ThumbsUp, ThumbsDown } from "lucide-react";
import { PostReactionType } from "../hooks/usePostReactions";

interface PostReactions2Props {
  reactions: Record<PostReactionType, number>;
  userReactions: Record<PostReactionType, boolean>;
  isSubmitting: Record<PostReactionType, boolean>;
  onReactionToggle: (type: PostReactionType) => void;
  currentUserId?: string;
}

export const PostReactions2 = ({
  reactions,
  userReactions,
  isSubmitting,
  onReactionToggle,
  currentUserId
}: PostReactions2Props) => {
  const isDisabled = !currentUserId;

  return (
    <div className="flex gap-2 md:gap-4">
      <Button 
        variant="ghost" 
        size="sm" 
        className={`flex items-center gap-1 text-xs md:text-sm px-2 py-1 h-auto ${userReactions.thumbsup ? "text-blue-500" : ""}`}
        onClick={() => onReactionToggle("thumbsup")}
        disabled={isDisabled || isSubmitting.thumbsup}
      >
        <ThumbsUp className={`h-3 w-3 md:h-4 md:w-4 ${userReactions.thumbsup ? "fill-blue-500" : ""}`} />
        {reactions.thumbsup > 0 && <span>{reactions.thumbsup}</span>}
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className={`flex items-center gap-1 text-xs md:text-sm px-2 py-1 h-auto ${userReactions.thumbsdown ? "text-red-500" : ""}`}
        onClick={() => onReactionToggle("thumbsdown")}
        disabled={isDisabled || isSubmitting.thumbsdown}
      >
        <ThumbsDown className={`h-3 w-3 md:h-4 md:w-4 ${userReactions.thumbsdown ? "fill-red-500" : ""}`} />
        {reactions.thumbsdown > 0 && <span>{reactions.thumbsdown}</span>}
      </Button>

      <Button 
        variant="ghost" 
        size="sm" 
        className={`flex items-center gap-1 text-xs md:text-sm px-2 py-1 h-auto ${userReactions.like ? "text-red-500" : ""}`}
        onClick={() => onReactionToggle("like")}
        disabled={isDisabled || isSubmitting.like}
      >
        <Heart className={`h-3 w-3 md:h-4 md:w-4 ${userReactions.like ? "fill-red-500" : ""}`} />
        {reactions.like > 0 && <span>{reactions.like}</span>}
      </Button>
    </div>
  );
};

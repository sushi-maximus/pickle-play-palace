
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { ReactionType } from "../hooks/useCommentReactions";

interface CommentReactionsProps {
  reactions: Record<ReactionType, number>;
  userReactions: Record<ReactionType, boolean>;
  isSubmitting: Record<ReactionType, boolean>;
  onReactionToggle: (type: ReactionType) => void;
  currentUserId?: string;
}

export const CommentReactions = ({
  reactions,
  userReactions,
  isSubmitting,
  onReactionToggle,
  currentUserId
}: CommentReactionsProps) => {
  return (
    <div className="flex gap-2">
      {/* Thumbs Up button */}
      <Button 
        variant="ghost" 
        size="sm" 
        className={`p-0 h-6 ${userReactions?.thumbsup ? "text-blue-500" : ""}`}
        onClick={() => onReactionToggle("thumbsup")}
        disabled={!currentUserId || isSubmitting.thumbsup}
      >
        <ThumbsUp 
          className={`h-3.5 w-3.5 ${userReactions?.thumbsup ? "fill-blue-500" : ""}`} 
        />
        {reactions.thumbsup > 0 && (
          <span className="ml-1 text-xs">{reactions.thumbsup}</span>
        )}
      </Button>
      
      {/* Thumbs Down button */}
      <Button 
        variant="ghost" 
        size="sm" 
        className={`p-0 h-6 ${userReactions?.thumbsdown ? "text-red-500" : ""}`}
        onClick={() => onReactionToggle("thumbsdown")}
        disabled={!currentUserId || isSubmitting.thumbsdown}
      >
        <ThumbsDown 
          className={`h-3.5 w-3.5 ${userReactions?.thumbsdown ? "fill-red-500" : ""}`} 
        />
        {reactions.thumbsdown > 0 && (
          <span className="ml-1 text-xs">{reactions.thumbsdown}</span>
        )}
      </Button>
    </div>
  );
};

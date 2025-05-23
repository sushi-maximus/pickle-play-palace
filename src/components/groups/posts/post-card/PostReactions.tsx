
import { Button } from "@/components/ui/button";
import { Heart, ThumbsUp, ThumbsDown } from "lucide-react";
import { PostReactionType } from "../hooks/types/reactionTypes";

interface PostReactionsProps {
  reactions: Record<PostReactionType, number>;
  userReactions: Record<PostReactionType, boolean>;
  isSubmitting: Record<PostReactionType, boolean>;
  onReactionToggle: (type: PostReactionType) => void;
  currentUserId?: string;
}

export const PostReactions = ({
  reactions,
  userReactions,
  isSubmitting,
  onReactionToggle,
  currentUserId
}: PostReactionsProps) => {
  return (
    <div className="flex gap-4">
      {/* Like button */}
      <Button 
        variant="ghost" 
        size="sm" 
        className={`flex items-center gap-1 ${userReactions.like ? "text-red-500" : ""}`}
        onClick={() => onReactionToggle("like")}
        disabled={!currentUserId || isSubmitting.like}
      >
        <Heart 
          className={`h-4 w-4 ${userReactions.like ? "fill-red-500 text-red-500" : ""}`}
        />
        <span>{reactions.like > 0 ? reactions.like : ''}</span>
      </Button>
      
      {/* Thumbs Up button */}
      <Button 
        variant="ghost" 
        size="sm" 
        className={`flex items-center gap-1 ${userReactions.thumbsup ? "text-blue-500" : ""}`}
        onClick={() => onReactionToggle("thumbsup")}
        disabled={!currentUserId || isSubmitting.thumbsup}
      >
        <ThumbsUp 
          className={`h-4 w-4 ${userReactions.thumbsup ? "fill-blue-500 text-blue-500" : ""}`}
        />
        <span>{reactions.thumbsup > 0 ? reactions.thumbsup : ''}</span>
      </Button>
      
      {/* Thumbs Down button */}
      <Button 
        variant="ghost" 
        size="sm" 
        className={`flex items-center gap-1 ${userReactions.thumbsdown ? "text-red-500" : ""}`}
        onClick={() => onReactionToggle("thumbsdown")}
        disabled={!currentUserId || isSubmitting.thumbsdown}
      >
        <ThumbsDown 
          className={`h-4 w-4 ${userReactions.thumbsdown ? "fill-red-500 text-red-500" : ""}`}
        />
        <span>{reactions.thumbsdown > 0 ? reactions.thumbsdown : ''}</span>
      </Button>
    </div>
  );
};

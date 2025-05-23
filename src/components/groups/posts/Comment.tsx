
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import type { Comment as CommentType } from "./hooks/useComments";
import { useCommentReactions, ReactionType } from "./hooks/useCommentReactions";

interface CommentProps {
  comment: CommentType;
  userId?: string;
}

export const Comment = ({ comment, userId }: CommentProps) => {
  const {
    reactions,
    userReactions,
    isSubmitting,
    toggleReaction
  } = useCommentReactions({
    commentId: comment.id,
    userId,
    initialReactions: comment.reactions,
    initialUserReactions: comment.user_reactions
  });

  const handleReactionClick = (type: ReactionType) => {
    toggleReaction(type);
  };

  return (
    <div className="flex gap-3 py-2">
      <Avatar className="h-8 w-8">
        {comment.user.avatar_url ? (
          <AvatarImage src={comment.user.avatar_url} alt={`${comment.user.first_name} ${comment.user.last_name}`} />
        ) : (
          <AvatarFallback>
            {comment.user.first_name?.[0] || '?'}
            {comment.user.last_name?.[0] || '?'}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1">
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="font-medium text-sm">
            {comment.user.first_name} {comment.user.last_name}
          </div>
          <p className="text-sm">{comment.content}</p>
        </div>
        <div className="flex items-center mt-1">
          <div className="text-xs text-muted-foreground mr-auto">
            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className={`p-0 h-6 ${userReactions?.thumbsup ? "text-blue-500" : ""}`} 
            onClick={() => handleReactionClick("thumbsup")}
            disabled={!userId || isSubmitting.thumbsup}
          >
            <ThumbsUp className={`h-3.5 w-3.5 ${userReactions?.thumbsup ? "fill-blue-500" : ""}`} />
            {reactions.thumbsup > 0 && (
              <span className="ml-1 text-xs">{reactions.thumbsup}</span>
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className={`p-0 h-6 ml-2 ${userReactions?.thumbsdown ? "text-red-500" : ""}`}
            onClick={() => handleReactionClick("thumbsdown")}
            disabled={!userId || isSubmitting.thumbsdown}
          >
            <ThumbsDown className={`h-3.5 w-3.5 ${userReactions?.thumbsdown ? "fill-red-500" : ""}`} />
            {reactions.thumbsdown > 0 && (
              <span className="ml-1 text-xs">{reactions.thumbsdown}</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

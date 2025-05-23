
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import type { Comment as CommentType } from "./hooks/useComments";

interface CommentProps {
  comment: CommentType;
}

export const Comment = ({ comment }: CommentProps) => {
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
        <div className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
        </div>
      </div>
    </div>
  );
};

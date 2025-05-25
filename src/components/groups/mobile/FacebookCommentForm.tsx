
import { memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAddComment2 } from "../posts/hooks/useAddComment2";
import type { Profile } from "../posts/hooks/types/groupPostTypes";

interface FacebookCommentFormProps {
  postId: string;
  user: Profile;
  onCommentAdded?: () => void;
}

const FacebookCommentFormComponent = ({ 
  postId, 
  user, 
  onCommentAdded 
}: FacebookCommentFormProps) => {
  const { content, setContent, handleSubmit, isSubmitting } = useAddComment2({
    postId,
    userId: user.id,
    onCommentAdded
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;
    
    await handleSubmit();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (content.trim() && !isSubmitting) {
        handleSubmit();
      }
    }
  };

  const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();

  return (
    <form onSubmit={onSubmit} className="flex items-start gap-2 p-2">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={user.avatar_url || undefined} alt={`${user.first_name} ${user.last_name}`} />
        <AvatarFallback className="text-xs bg-gray-200 text-gray-700">
          {initials}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Write a comment..."
          disabled={isSubmitting}
          className="w-full px-3 py-2 text-sm bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-0 placeholder-gray-500"
        />
      </div>
    </form>
  );
};

export const FacebookCommentForm = memo(FacebookCommentFormComponent);

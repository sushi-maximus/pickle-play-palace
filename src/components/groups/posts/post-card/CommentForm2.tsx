
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface CommentForm2Props {
  content: string;
  setContent: (content: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
  };
}

export const CommentForm2 = ({
  content,
  setContent,
  onSubmit,
  isSubmitting,
  user
}: CommentForm2Props) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (content.trim() && !isSubmitting) {
        onSubmit();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setContent("");
    }
  };

  const handleSubmit = () => {
    if (content.trim() && !isSubmitting) {
      onSubmit();
    }
  };

  if (!user) return null;

  const firstName = user.first_name || '';
  const lastName = user.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim() || 'User';
  const initials = `${firstName[0] || ''}${lastName[0] || ''}` || 'U';

  return (
    <div className="p-3 md:p-4 space-y-3">
      <div className="flex gap-2 md:gap-3">
        <Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0 mt-1">
          <AvatarImage src={user.avatar_url || undefined} />
          <AvatarFallback className="text-xs md:text-sm">{initials}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Write a comment..."
            className="text-sm md:text-base min-h-[80px] md:min-h-[60px] resize-none border-gray-200 focus:border-blue-300 focus:ring-blue-200"
            disabled={isSubmitting}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between pl-10 md:pl-[52px]">
        <p className="text-xs text-gray-500">
          Press Enter to post, Esc to cancel
        </p>
        
        {content.trim() && (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim()}
            size="sm"
            className="min-h-[36px] px-4 text-sm font-medium"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </Button>
        )}
      </div>
    </div>
  );
};

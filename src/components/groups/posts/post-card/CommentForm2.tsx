
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
    <div className="p-3 space-y-3 bg-white">
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
          <AvatarImage src={user.avatar_url || undefined} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Write a comment..."
            className="text-sm min-h-[70px] resize-none border-gray-200 focus:border-blue-300 focus:ring-blue-200 bg-gray-50"
            disabled={isSubmitting}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between pl-11">
        <p className="text-xs text-gray-400">
          Press Enter to post, Esc to cancel
        </p>
        
        {content.trim() && (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim()}
            size="sm"
            className="min-h-[32px] px-3 text-sm font-medium"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </Button>
        )}
      </div>
    </div>
  );
};

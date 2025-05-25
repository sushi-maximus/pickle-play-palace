
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
    <div className="flex gap-2 md:gap-3 p-3 md:p-4 border-t border-gray-100">
      <Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0">
        <AvatarImage src={user.avatar_url || undefined} />
        <AvatarFallback className="text-xs md:text-sm">{initials}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Write a comment..."
          className="text-xs md:text-sm min-h-[60px] resize-none"
          disabled={isSubmitting}
        />
        
        {content.trim() && (
          <div className="flex flex-col gap-2">
            <div className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded border">
              💡 Press Enter to post • Press Esc to clear
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !content.trim()}
                size="sm"
                className="text-xs px-3 h-7"
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

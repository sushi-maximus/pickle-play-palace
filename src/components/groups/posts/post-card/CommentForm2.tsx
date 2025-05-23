
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
      if (content.trim()) {
        onSubmit();
      }
    }
  };

  if (!user) return null;

  const fullName = `${user.first_name || ''} ${user.last_name || ''}`;
  const initials = `${(user.first_name && user.first_name[0]) || ''}${(user.last_name && user.last_name[0]) || ''}`;

  return (
    <div className="flex gap-2 md:gap-3 p-3 md:p-4 border-t border-gray-100">
      <Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0">
        <AvatarImage src={user.avatar_url || undefined} />
        <AvatarFallback className="text-xs md:text-sm">{initials}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Write a comment..."
          className="text-xs md:text-sm min-h-[60px] resize-none"
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
};

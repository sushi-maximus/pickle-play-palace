
import { useState, memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useAddComment2 } from "../posts/hooks/useAddComment2";
import type { Profile } from "../posts/hooks/types/groupPostTypes";

interface FacebookExpandingCommentFormProps {
  postId: string;
  user: Profile;
  onCommentAdded?: () => void;
}

const FacebookExpandingCommentFormComponent = ({ 
  postId, 
  user, 
  onCommentAdded 
}: FacebookExpandingCommentFormProps) => {
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const { handleSubmit, isSubmitting } = useAddComment2({
    postId,
    userId: user.id,
    onCommentAdded: () => {
      setContent("");
      setIsExpanded(false);
      onCommentAdded?.();
    }
  });

  const onSubmit = async () => {
    if (!content.trim() || isSubmitting) return;
    await handleSubmit(content);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (content.trim() && !isSubmitting) {
        onSubmit();
      }
    }
  };

  const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();

  return (
    <div className="p-3">
      <div className="flex items-start gap-2">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={user.avatar_url || undefined} alt={`${user.first_name} ${user.last_name}`} />
          <AvatarFallback className="text-xs bg-gray-200 text-gray-700">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          {!isExpanded ? (
            <button
              onClick={() => setIsExpanded(true)}
              className="w-full bg-white hover:bg-gray-50 text-gray-500 text-left px-3 py-2 rounded-full border border-gray-200 transition-colors duration-200 text-sm min-h-[36px] touch-manipulation"
            >
              Write a comment...
            </button>
          ) : (
            <div className="space-y-2">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Write a comment..."
                className="w-full border border-gray-200 rounded-lg resize-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm min-h-[60px] bg-white"
                autoFocus
                disabled={isSubmitting}
              />
              
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  Press Enter to post
                </p>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsExpanded(false);
                      setContent("");
                    }}
                    disabled={isSubmitting}
                    className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 min-h-[32px] px-3 touch-manipulation"
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    onClick={onSubmit}
                    disabled={!content.trim() || isSubmitting}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 min-h-[32px] touch-manipulation disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="hidden sm:inline">Posting...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Send className="h-3 w-3" />
                        <span>Post</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const FacebookExpandingCommentForm = memo(FacebookExpandingCommentFormComponent);

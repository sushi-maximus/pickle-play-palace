
import { memo } from "react";
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
  const {
    content,
    setContent,
    isSubmitting,
    handleSubmit
  } = useAddComment2({
    postId,
    userId: user.id,
    onCommentAdded
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex space-x-2">
      {/* User Avatar */}
      <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
      
      {/* Comment Input */}
      <div className="flex-1">
        <form onSubmit={handleFormSubmit} className="space-y-2">
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Write a comment..."
              className="w-full bg-gray-100 border-0 rounded-full px-4 py-2 text-sm placeholder-gray-500 focus:ring-0 focus:outline-none resize-none"
              rows={1}
              style={{ minHeight: '32px' }}
              disabled={isSubmitting}
            />
          </div>
          
          {content.trim() && (
            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={isSubmitting || !content.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-7 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Posting..." : "Post"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export const FacebookCommentForm = memo(FacebookCommentFormComponent);

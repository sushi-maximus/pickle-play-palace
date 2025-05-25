
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
    <div className="flex space-x-2 sm:space-x-3">
      {/* User Avatar - Responsive sizing */}
      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
      
      {/* Comment Input - Enhanced for mobile */}
      <div className="flex-1 min-w-0">
        <form onSubmit={handleFormSubmit} className="space-y-2">
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Write a comment..."
              className="w-full bg-gray-100 border-0 rounded-full px-3 py-2 sm:px-4 text-xs sm:text-sm placeholder-gray-500 focus:ring-0 focus:outline-none resize-none min-h-[32px] sm:min-h-[36px] touch-manipulation"
              rows={1}
              disabled={isSubmitting}
            />
          </div>
          
          {content.trim() && (
            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={isSubmitting || !content.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-6 sm:h-7 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 touch-manipulation"
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

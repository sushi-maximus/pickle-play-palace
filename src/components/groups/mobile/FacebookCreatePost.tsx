
import { memo, useState } from "react";
import { useCreatePost2 } from "../posts/hooks/useCreatePost2";
import { Camera, Image, Smile } from "lucide-react";
import type { Profile } from "../posts/hooks/types/groupPostTypes";

interface FacebookCreatePostProps {
  groupId: string;
  user: Profile | null;
  onPostCreated?: () => void;
}

const FacebookCreatePostComponent = ({ 
  groupId, 
  user, 
  onPostCreated 
}: FacebookCreatePostProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    content,
    setContent,
    isSubmitting,
    handleSubmit,
    error
  } = useCreatePost2({
    groupId,
    userId: user?.id,
    onPostCreated
  });

  const handlePostClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleSubmitPost = async () => {
    await handleSubmit();
    setIsExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (content.trim()) {
        handleSubmitPost();
      }
    } else if (e.key === 'Escape') {
      setIsExpanded(false);
      setContent("");
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white border-b border-gray-200 p-3 sm:p-4">
      <div className="flex space-x-2 sm:space-x-3">
        {/* User Avatar - Enhanced for mobile */}
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex-shrink-0"></div>
        
        {/* Post Input Area */}
        <div className="flex-1 min-w-0">
          {!isExpanded ? (
            /* Collapsed State - Enhanced touch target */
            <button
              onClick={handlePostClick}
              className="w-full bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-2 sm:px-4 sm:py-3 text-left text-gray-500 text-sm sm:text-base transition-colors duration-200 min-h-[44px] touch-manipulation active:scale-[0.98]"
            >
              What's on your mind?
            </button>
          ) : (
            /* Expanded State - Enhanced for mobile */
            <div className="space-y-3">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What's on your mind?"
                className="w-full bg-transparent border-0 text-sm sm:text-base placeholder-gray-500 focus:ring-0 focus:outline-none resize-none min-h-[80px] sm:min-h-[100px] touch-manipulation"
                disabled={isSubmitting}
                autoFocus
              />
              
              {/* Action Buttons - Enhanced spacing and touch targets */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex space-x-1 sm:space-x-2">
                  <button className="flex items-center space-x-1 px-2 py-1.5 sm:px-3 sm:py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-200 min-h-[44px] min-w-[44px] touch-manipulation active:scale-95">
                    <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-xs sm:text-sm hidden sm:inline">Photo</span>
                  </button>
                  <button className="flex items-center space-x-1 px-2 py-1.5 sm:px-3 sm:py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-200 min-h-[44px] min-w-[44px] touch-manipulation active:scale-95">
                    <Image className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-xs sm:text-sm hidden sm:inline">Album</span>
                  </button>
                  <button className="flex items-center space-x-1 px-2 py-1.5 sm:px-3 sm:py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-200 min-h-[44px] min-w-[44px] touch-manipulation active:scale-95">
                    <Smile className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-xs sm:text-sm hidden sm:inline">Feeling</span>
                  </button>
                </div>
                
                {/* Post Button - Enhanced for mobile */}
                <button
                  onClick={handleSubmitPost}
                  disabled={!content.trim() || isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 disabled:cursor-not-allowed min-h-[44px] touch-manipulation active:scale-95"
                >
                  {isSubmitting ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Error Display - Mobile optimized */}
      {error && (
        <div className="mt-3 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-xs sm:text-sm">{error.message}</p>
        </div>
      )}
    </div>
  );
};

export const FacebookCreatePost = memo(FacebookCreatePostComponent);
